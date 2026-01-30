import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flipbook-loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Loading PDF...</p>
    </div>
  );
};
