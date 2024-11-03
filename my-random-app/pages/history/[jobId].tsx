// pages/history/[jobId].tsx

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";

const JobHistoryPage: React.FC = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (jobId) {
      // Fetch the history from the backend
      axios
        .get(`http://localhost:8000/history/${jobId}`)
        .then((response) => {
          setHistory(response.data.history);
        })
        .catch((error) => {
          console.error("Error fetching job history:", error);
        });
    }
  }, [jobId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job History for {jobId}</h1>
      {history.length > 0 ? (
        <ul className="list-disc pl-5">
          {history.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      ) : (
        <p>No history available.</p>
      )}
      <button className="btn btn-secondary mt-4" onClick={() => router.back()}>
        Back
      </button>
    </div>
  );
};

export default JobHistoryPage;
