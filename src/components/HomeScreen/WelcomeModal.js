import React from "react";
import PropTypes from "prop-types";

const WelcomeModal = ({ show, onClose, onInstall }) => {
  if (!show) return null; // 🔑 Don't render if not visible

  return (
    <div
      className="modal show d-block glass-effect"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4" style={{ borderRadius: "15px" }}>
          <div className="modal-header border-0 p-0 justify-content-end">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="justify-content-center align-items-center">
              <div>
                <img
                  src="/assets/images/profile.png"
                  alt="Avatar"
                  className="rounded-circle mb-4"
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <h4 className="mb-3">Welcome to PixelMind!</h4>
              <p className="text-muted mb-4">
                Discover amazing images and share your creativity with the world.
              </p>

              <div className="d-flex flex-column gap-3">
                <button
                  className="btn btn-warning text-white rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={onInstall}
                >
                  <i className="bi bi-download"></i>
                  Add To Home Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

WelcomeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onInstall: PropTypes.func.isRequired,
};

export default WelcomeModal;
