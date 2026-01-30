import React from "react";

interface ControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  showPageNumber: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  showPageNumber,
}) => {
  return (
    <div
      className="flipbook-controls"
      role="navigation"
      aria-label="Page navigation"
    >
      <button
        className="control-button prev-button"
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        title="Previous page (Arrow Left)"
      >
        ‹
      </button>
      {showPageNumber && (
        <span className="page-indicator" aria-live="polite" aria-atomic="true">
          Page {currentPage} of {totalPages}
        </span>
      )}
      <button
        className="control-button next-button"
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        title="Next page (Arrow Right)"
      >
        ›
      </button>
    </div>
  );
};
