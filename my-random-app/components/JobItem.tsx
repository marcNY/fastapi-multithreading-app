// components/JobItem.tsx

import React from "react";

interface JobItemProps {
  jobId: string;
  latestNumber: number;
  onStop: (jobId: string) => void;
  onViewHistory: (jobId: string) => void;
}

const JobItem: React.FC<JobItemProps> = ({
  jobId,
  latestNumber,
  onStop,
  onViewHistory,
}) => {
  return (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body">
        <h2 className="card-title">Job ID: {jobId}</h2>
        <p>Latest Number: {latestNumber}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => onViewHistory(jobId)}
          >
            View History
          </button>
          <button className="btn btn-error" onClick={() => onStop(jobId)}>
            Stop Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobItem;
