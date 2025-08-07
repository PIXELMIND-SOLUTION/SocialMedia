import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaTimes, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Download = ({ show, handleClose, starCoins = 1000 }) => {

const navigate = useNavigate();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="text-center p-4" style={{ backgroundColor: "#fff6f0", borderRadius: "10px" }}>
        {/* Close Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 mx-auto fw-bold">Download</h5>
          <Button
            variant="light"
            className="position-absolute end-0 top-0 mt-2 me-2 p-1"
            onClick={handleClose}
            style={{ borderRadius: "50%" }}
          >
            <FaTimes />
          </Button>
        </div>

        {/* Coins Available */}
        <div className="bg-white rounded-4 shadow-sm px-4 py-3 mb-4 d-inline-block">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <FaStar size={28} color="#fca311" />
            <div>
              <h4 className="mb-0 fw-bold">{starCoins}</h4>
              <small className="text-muted">Star Coins Available</small>
            </div>
          </div>
        </div>

        {/* Cost Info */}
        <div className="mb-3 text-orange fw-bold" style={{ fontSize: "1.1rem" }}>
          <FaStar className="me-1 text-warning" /> 20 Star coins
        </div>

        {/* Download Button */}
        <Button
          variant="warning"
          className="px-4 fw-bold text-white"
          style={{ backgroundColor: "#f77f00", border: "none", borderRadius: "8px" }}
        >
          Download Now
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default Download;
