// Galleria.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DownloadModal from "./Download";
import InsufficientBalanceModal from "./InsufficientBalanceModal";

const Galleria = ({
  show,
  onClose,
  images, // array of posts
  currentIndex, // index of current POST
  onNext,
  onPrevious,
  onThumbnailClick,
  onDownload,
}) => {
  const [balance, setBalance] = useState(40);
  const cost = 20;
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  
  // State for media navigation within current post
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const currentPost = images[currentIndex];
  const mediaList = currentPost?.media || [];
  const currentMedia = mediaList[currentMediaIndex];

  // Reset media index when post changes
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [currentIndex]);

  const handleDownloadClick = () => {
    if (balance >= cost) {
      setShowDownloadModal(true);
    } else {
      setShowInsufficientModal(true);
    }
  };

  const handleConfirmDownload = () => {
    setBalance((prev) => prev - cost);
    onDownload(currentPost);
    setShowDownloadModal(false);
  };

  const handleMediaThumbnailClick = (index) => {
    setCurrentMediaIndex(index);
  };

  const nextMedia = () => {
    if (currentMediaIndex < mediaList.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else if (currentIndex < images.length - 1) {
      // Move to next post
      onNext();
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    } else if (currentIndex > 0) {
      // Move to previous post
      onPrevious();
      // Set media index to last media of previous post
      setTimeout(() => {
        setCurrentMediaIndex(images[currentIndex - 1]?.media?.length - 1 || 0);
      }, 50);
    }
  };

  // Keyboard navigation for media
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMedia();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, currentMediaIndex, currentIndex, images]);

  if (!show || !currentPost) return null;

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
            onClick={prevMedia}
            style={{ zIndex: 10, fontSize: "2rem" }}
            disabled={currentIndex === 0 && currentMediaIndex === 0}
          >
            ❮
          </button>

          <div className="galleria-image-container d-flex align-items-center justify-content-center">
            {currentMedia ? (
              <img
                src={currentMedia.url?.trim()}
                alt={currentPost.description || "Post"}
                className="galleria-image"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div className="text-white">No media available</div>
            )}
          </div>

          <button
            className="galleria-nav galleria-nav-next position-absolute end-0 top-50 translate-middle-y btn btn-link text-white p-3"
            onClick={nextMedia}
            style={{ zIndex: 10, fontSize: "2rem" }}
            disabled={currentIndex === images.length - 1 && currentMediaIndex === mediaList.length - 1}
          >
            ❯
          </button>
        </div>

        {/* Footer Thumbnails - ALL media from current post */}
        <div className="galleria-footer p-3">
          <div className="d-flex justify-content-center align-items-center gap-2 overflow-auto">
            {mediaList.map((media, index) => (
              <div
                key={`${currentPost._id}-${index}`}
                className="galleria-thumbnail"
                onClick={() => handleMediaThumbnailClick(index)}
                style={{
                  cursor: "pointer",
                  opacity: index === currentMediaIndex ? 1 : 0.6,
                  border: index === currentMediaIndex ? "2px solid white" : "2px solid transparent",
                  borderRadius: "4px",
                }}
              >
                <img
                  src={media.url?.trim()}
                  alt={`Media ${index + 1}`}
                  style={{
                    width: "60px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "2px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="text-center text-white mt-2">
            <small>
              {currentIndex + 1} / {images.length} posts • 
              {mediaList.length > 1 && ` Media ${currentMediaIndex + 1} / ${mediaList.length}`}
            </small>
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
        image={currentPost}
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
  images: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.string,
    })).isRequired,
    description: PropTypes.string,
  })).isRequired,
  currentIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onThumbnailClick: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default Galleria;