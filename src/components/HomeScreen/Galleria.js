import React, { useState } from "react";
import PropTypes from "prop-types";
import DownloadModal from "./Download";
import InsufficientBalanceModal from "./InsufficientBalanceModal";

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
  const [balance, setBalance] = useState(40); // example balance
  const cost = 20;

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  const currentImage = images[currentIndex];

  const handleDownloadClick = () => {
    if (balance >= cost) {
      setShowDownloadModal(true);
    } else {
      setShowInsufficientModal(true);
    }
  };

  const handleConfirmDownload = () => {
    setBalance((prev) => prev - cost);
    onDownload(currentImage); // pass current image to parent if needed
    setShowDownloadModal(false);
  };

  if (!show) return null;

  return (
    <div
      className="galleria-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
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
          <div>
            <button
              className="btn btn-light shadow-sm d-flex align-items-center justify-content-center"
              onClick={onClose}
              style={{
                fontSize: "1rem",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                position: "absolute",
                top: "10px",
                left: "10px",
              }}
            >
              ✕
            </button>

          </div>
          <div>
            <button
              className="btn badge text-bg-light p-2 me-2"
              onClick={handleDownloadClick}
            >
              Download
            </button>
            <button className="btn badge text-bg-light p-2">
              Save
            </button>
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
                    className={`galleria-thumbnail ${actualIndex === currentIndex ? "active" : ""
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

      {/* Modals */}
      <DownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        balance={balance}
        cost={cost}
        onConfirm={handleConfirmDownload}
        image={currentImage}
      />

      <InsufficientBalanceModal
        show={showInsufficientModal}
        onClose={() => setShowInsufficientModal(false)}
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
