import React from "react";
import PropTypes from "prop-types";

const Download = ({ show, onClose, balance, cost, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,
      }}
    >
      <div
        className="bg-white p-4 shadow-lg text-center"
        style={{
          borderRadius: "15px",
          width: "350px",
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

        {/* Balance */}
        <div
          className="d-flex align-items-center justify-content-center mb-3 p-2"
          style={{
            background: "#fff3e6",
            borderRadius: "10px",
          }}
        >
          <img
            src="/assets/icons/coin.png"
            alt="Coin"
            style={{ width: "28px", marginRight: "10px" }}
          />
          <div>
            <h4 className="mb-0">{balance}</h4>
            <small className="text-muted">Star Coins Available</small>
          </div>
        </div>

        {/* Cost */}
        <p className="fw-bold text-warning mb-3">
          <img
            src="/assets/icons/coin.png"
            alt="Coin"
            style={{ width: "20px", marginRight: "6px" }}
          />
          {cost} Star Coins
        </p>

        {/* Confirm Button */}
        <button
          className="btn btn-warning text-white w-100 rounded-pill"
          onClick={onConfirm}
        >
          Download Now
        </button>
      </div>
    </div>
  );
};

Download.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  balance: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Download;
