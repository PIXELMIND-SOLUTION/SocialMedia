import React from "react";
import PropTypes from "prop-types";

const DownloadModal = ({ show, onClose, balance, cost, onConfirm, image }) => {
  if (!show) return null;

  const hasEnough = balance >= cost;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 10000,
      }}
    >
      <div
        className="bg-white p-4 shadow-lg text-center"
        style={{
          borderRadius: "15px",
          width: "380px",
          maxWidth: "95%",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Download</h5>
          <button
            className="btn btn-sm btn-outline-dark rounded-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mb-3">
            <img
              src={image.url}
              alt={image.title}
              style={{
                maxWidth: "100%",
                maxHeight: "180px",
                borderRadius: "10px",
                objectFit: "contain",
                background: "#f8f9fa",
                padding: "4px",
              }}
            />
            <p className="mt-2 text-muted small">{image.title}</p>
          </div>
        )}

        {/* Balance & Cost Together */}
        <div
          className="d-flex flex-column align-items-center justify-content-center mb-3 p-3"
          style={{
            background: "#fff3e6",
            borderRadius: "10px",
          }}
        >
          <div className="d-flex align-items-center mb-2">
            <img
              src="/assets/icons/coin1.png"
              alt="Coin"
              style={{ width: "28px", marginRight: "10px" }}
            />
            <h4 className="mb-0">{balance}</h4>
          </div>
          <small className="text-muted mb-2">Star Coins Available</small>

          <div className="d-flex align-items-center fw-bold">
            <img
              src="/assets/icons/coin1.png"
              alt="Coin"
              style={{ width: "20px", marginRight: "6px" }}
            />
            <span className={hasEnough ? "text-warning" : "text-danger"}>
              {cost} Star Coins
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          className={`btn w-100 rounded-pill ${
            hasEnough ? "btn-warning text-white" : "btn-secondary"
          }`}
          onClick={hasEnough ? onConfirm : undefined}
          disabled={!hasEnough}
        >
          {hasEnough ? "Download Now" : "Insufficient Balance"}
        </button>
      </div>
    </div>
  );
};

DownloadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  balance: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  image: PropTypes.object,
};

export default DownloadModal;
