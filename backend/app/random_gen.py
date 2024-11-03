# app/random_gen.py

import threading
import time
import random
import logging


class RandomGen(threading.Thread):
    def __init__(self, job_id, callback, duration=300, interval=5):
        super().__init__()
        self.job_id = job_id
        self.callback = callback
        self.duration = duration
        self.interval = interval
        self._stop_event = threading.Event()
        self.logger = logging.getLogger(f"RandomGen-{self.job_id}")

    def run(self):
        start_time = time.time()
        self.logger.info(f"Job {self.job_id} started.")
        while not self._stop_event.is_set():
            if time.time() - start_time > self.duration:
                self.logger.info(
                    f"Job {self.job_id} completed after {self.duration} seconds."
                )
                break
            number = random.random()
            self.logger.debug(f"Job {self.job_id} generated number: {number}")
            self.callback(self.job_id, number)
            time.sleep(self.interval)

    def stop(self):
        self._stop_event.set()
        self.logger.info(f"Job {self.job_id} stopped manually.")
