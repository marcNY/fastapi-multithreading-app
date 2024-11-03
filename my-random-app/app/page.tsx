// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { startJob, stopJob, getAllJobs } from "../lib/api/jobs";
import JobItem from "../components/JobItem";
import { useRouter } from "next/navigation";
const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<
    { job_id: string; latest_number: number | null }[]
  >([]);
  const router = useRouter();
  // Function to fetch all jobs
  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    // Fetch jobs initially
    fetchJobs();

    // Set up polling every 5 seconds
    const interval = setInterval(() => {
      fetchJobs();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Start a new job
  const handleStartJob = async () => {
    try {
      const jobId = await startJob();
      console.log("Started job:", jobId);
      fetchJobs();
    } catch (error) {
      console.error("Error starting job:", error);
    }
  };

  // Stop a job
  const handleStopJob = async (jobId: string) => {
    try {
      await stopJob(jobId);
      console.log("Stopped job:", jobId);
      fetchJobs();
    } catch (error) {
      console.error("Error stopping job:", error);
    }
  };

  // View job history
  const handleViewHistory = (jobId: string) => {
    router.push(`/history/${jobId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Random Number Generator</h1>
      <button className="btn btn-primary mb-4" onClick={handleStartJob}>
        Start New Job
      </button>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobItem
            key={job.job_id}
            jobId={job.job_id}
            latestNumber={job.latest_number || 0}
            onStop={handleStopJob}
            onViewHistory={handleViewHistory}
          />
        ))
      ) : (
        <p>No active jobs.</p>
      )}
    </div>
  );
};

export default HomePage;
