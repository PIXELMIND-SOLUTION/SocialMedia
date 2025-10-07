import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ImageGrid = ({ image, images, onImageClick, selectedImage, currentUserId }) => {
  const [saves, setSaves] = useState(image?.saves || []);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
      setSaves(image?.saves || []);
    }, [image]);

  const handleSave = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    try {
      setLoadingSave(true);
      const res = await fetch("https://social-media-nty4.onrender.com/api/posts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          postOwnerId: image?.userId?._id
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaves(data.saves || []);
      } else {
        alert(data.message || "Failed to save.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoadingSave(false);
    }
  };
  const isSaved = saves.includes(currentUserId);


  return (
    <div className={selectedImage ? "col-md-12 col-lg-12" : "col-12"}>
      <div className="row">
        <div className="col-12">
          <div className={selectedImage ? "masonry1" : "masonry"}>
            {images.map((image, index) => (
              <div
                key={index}
                className="masonry-item mb-3 position-relative "
                onClick={() => onImageClick(image)}
                style={{ cursor: "pointer" }}
              >
                {/* Use first media image */}
                <img
                  src={image.media?.[0]?.url}
                  alt={`img-${index}`}
                  className="img-fluid rounded"
                  style={{ width: "100%", display: "block" }}
                />

                {/* Hover overlay */}
                <div className="image-hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3 opacity-0">
                  {/* Bookmark icon */}
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-light btn-sm rounded-circle" onClick={handleSave} disabled={loadingSave}>
                      <i className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"}`}></i>
                    </button>
                  </div>

                  {/* User info */}
                  <div className="text-white">
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={image.userId?.profile?.image}
                        alt={image.userId?.fullName}
                        className="rounded-circle me-2"
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                      />
                      <span className="fw-bold">{image.userId?.fullName}</span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
        .masonry {
          column-count: 5;
          column-gap: 1rem;
        }
        .masonry1 {
          column-count: 4;
          column-gap: 1rem;
        }

        .masonry-item {
          break-inside: avoid;
          position: relative;
        }

        .masonry-item:hover .image-hover-overlay {
          opacity: 1 !important;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          transition: opacity 0.3s ease;
        }

        @media (max-width: 1180px) {
          .masonry {
            column-count: 4;
          }
        }
          @media (max-width: 1180px) {
          .masonry1 {
            column-count: 3;
          }
        }

        @media (max-width: 992px) {
          .masonry {
            column-count: 3;
          }
        }

        @media (max-width: 576px) {
          .masonry {
            column-count: 1;
          }
        }
        `}
      </style>
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  selectedImage: PropTypes.object,
};

export default ImageGrid;
