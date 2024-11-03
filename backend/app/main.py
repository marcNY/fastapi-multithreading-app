# app/main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import uuid
import redis
import logging

from app.random_gen import RandomGen

app = FastAPI()
# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MainApp")

# Redis client
redis_client = redis.Redis(host="redis", port=6379, db=0)

# Dictionary to keep track of threads
jobs = {}


# Store history in Redis lists
def store_number(job_id, number):
    redis_client.set(job_id, number)
    redis_client.rpush(f"{job_id}_history", number)


@app.post("/start")
def start_job():
    job_id = str(uuid.uuid4())
    job = RandomGen(job_id=job_id, callback=store_number)
    jobs[job_id] = job
    job.start()
    logger.info(f"Started job with ID: {job_id}")
    return {"job_id": job_id}


@app.get("/status/{job_id}")
def get_latest_number(job_id: str):
    if not redis_client.exists(job_id):
        return JSONResponse(status_code=404, content={"error": "Job ID not found"})
    number = redis_client.get(job_id)
    return {"job_id": job_id, "latest_number": float(number)}


@app.post("/stop/{job_id}")
def stop_job(job_id: str):
    job = jobs.get(job_id)
    if job:
        job.stop()
        del jobs[job_id]
        return {"message": f"Job {job_id} stopped."}
    else:
        return JSONResponse(status_code=404, content={"error": "Job ID not found"})


@app.get("/jobs")
def get_all_jobs():
    job_ids = list(jobs.keys())
    data = []
    for job_id in job_ids:
        number = redis_client.get(job_id)
        data.append(
            {"job_id": job_id, "latest_number": float(number) if number else None}
        )
    return {"jobs": data}


@app.get("/history/{job_id}")
def get_job_history(job_id: str):
    if not redis_client.exists(f"{job_id}_history"):
        return JSONResponse(status_code=404, content={"error": "Job ID not found"})
    history = redis_client.lrange(f"{job_id}_history", 0, -1)
    history = [float(num) for num in history]
    return {"job_id": job_id, "history": history}
