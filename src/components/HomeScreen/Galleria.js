import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DownloadModal = ({ show, onClose, balance, cost, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 10000,
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
          style={{ background: "#fff3e6", borderRadius: "10px" }}
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

        {/* Confirm */}
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

const Galleria = ({
  show,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
  onThumbnailClick,
  onDownload,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(1000); // example balance
  const cost = 20;

  const currentImage = images[currentIndex];

  const handleConfirmDownload = () => {
    if (balance >= cost) {
      setBalance(balance - cost);
      onDownload(currentImage); // pass current image to parent if needed
    }
    setShowModal(false);
  };

  return (
    <div
      className={`galleria-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
        show ? "d-flex" : "d-none"
      }`}
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 9999,
      }}
    >
      <div className="galleria-content w-100 h-100 d-flex flex-column">
        {/* Header */}
        <div className="galleria-header d-flex justify-content-between align-items-center p-3 text-white">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light text-dark p-2"
              onClick={onClose}
              style={{ fontSize: "1.5rem" }}
            >
              X
            </button>
          </div>
          <div className="justify-content-center">
            <button
              className="btn badge text-bg-light p-2"
              onClick={() => setShowModal(true)}
            >
              Download
            </button>
            <button className="btn badge text-bg-light p-2">Save</button>
          </div>
        </div>

        {/* Main Image */}
        <div className="galleria-main flex-grow-1 d-flex align-items-center justify-content-center position-relative">
          <button
            className="galleria-nav galleria-nav-prev position-absolute start-0 top-50 translate-middle-y btn btn-link text-white p-3"
            onClick={onPrevious}
            style={{ zIndex: 10, fontSize: "2rem" }}
          >
            ❮
          </button>

          <div className="galleria-image-container d-flex align-items-center justify-content-center">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="galleria-image"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </div>

          <button
            className="galleria-nav galleria-nav-next position-absolute end-0 top-50 translate-middle-y btn btn-link text-white p-3"
            onClick={onNext}
            style={{ zIndex: 10, fontSize: "2rem" }}
          >
            ❯
          </button>
        </div>

        {/* Footer Thumbnails */}
        <div className="galleria-footer p-3">
          <div className="d-flex justify-content-center align-items-center gap-2 overflow-auto">
            {images
              .slice(Math.max(0, currentIndex - 3), currentIndex + 4)
              .map((image, index) => {
                const actualIndex = Math.max(0, currentIndex - 3) + index;
                return (
                  <div
                    key={image.id}
                    className={`galleria-thumbnail ${
                      actualIndex === currentIndex ? "active" : ""
                    }`}
                    onClick={() => onThumbnailClick(actualIndex)}
                    style={{
                      cursor: "pointer",
                      opacity: actualIndex === currentIndex ? 1 : 0.6,
                      border:
                        actualIndex === currentIndex
                          ? "2px solid white"
                          : "2px solid transparent",
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      style={{
                        width: "60px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                );
              })}
          </div>
          <div className="text-center text-white mt-2">
            <small>Use arrow keys or click thumbnails to navigate</small>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        show={showModal}
        onClose={() => setShowModal(false)}
        balance={balance}
        cost={cost}
        onConfirm={handleConfirmDownload}
      />
    </div>
  );
};

Galleria.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onThumbnailClick: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default Galleria;
