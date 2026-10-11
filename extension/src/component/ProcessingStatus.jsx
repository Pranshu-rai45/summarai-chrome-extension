import React from "react";
import "./Processing.css";
function ProcessingStatus({ isProcessing, processed }) {
  if (isProcessing) {
    return (
      <div className="processing-status">

        <div className="spinner"></div>

        <h3>Processing source...</h3>

        <p>
          Loading document and preparing it for RAG.
        </p>

      </div>
    );
  }

  if (processed) {
    return (
      <div className="success-status">

        <span>✓</span>

        <div>
          <strong>Source processed successfully</strong>
          <p>Your source is ready for questions.</p>
        </div>

      </div>
    );
  }

  return null;
}

export default ProcessingStatus;