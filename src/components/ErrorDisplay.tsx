import React from "react";

interface ErrorDisplayProps {
  error: Error;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="flipbook-error" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>
      <h3>Failed to Load PDF</h3>
      <p>{error.message}</p>
    </div>
  );
};
