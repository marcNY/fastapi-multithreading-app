// lib/api/jobs.ts

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const startJob = async () => {
  const response = await axios.post(`${API_BASE_URL}/start`);
  return response.data.job_id;
};

export const stopJob = async (jobId: string) => {
  await axios.post(`${API_BASE_URL}/stop/${jobId}`);
};

export const getJobStatus = async (jobId: string) => {
  const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
  return response.data;
};

export const getAllJobs = async () => {
  const response = await axios.get(`${API_BASE_URL}/jobs`);
  return response.data.jobs;
};

export const getJobHistory = async (jobId: string) => {
  const response = await axios.get(`${API_BASE_URL}/history/${jobId}`);
  return response.data.history;
};
