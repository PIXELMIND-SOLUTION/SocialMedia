import React from "react";
import PropTypes from "prop-types";

const InsufficientBalanceModal = ({ show, onClose }) => {
  if (!show) return null;

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
          width: "360px",
          maxWidth: "95%",
        }}
      >
        <h5 className="fw-bold text-danger mb-3">⚠️ Insufficient Balance</h5>
        <p className="mb-4">
          You don’t have enough <strong>Star Coins</strong> to download this item.
        </p>
        <button className="btn btn-dark rounded-pill px-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

InsufficientBalanceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InsufficientBalanceModal;
