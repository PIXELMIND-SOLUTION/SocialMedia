import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ImageGrid = ({ images, onImageClick, selectedImage, currentUserId }) => {
  const [savingIds, setSavingIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  // ✅ Fetch all saved posts of the current user on mount
  useEffect(() => {
    if (!currentUserId) return;
    const fetchSaves = async () => {
      try {
        const res = await fetch(
          `https://apisocial.atozkeysolution.com/api/saved-posts/${currentUserId}`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Extract post IDs from saved posts array
          const savedIds = data.data.map((item) => item._id);
          setSavedPosts(savedIds);
        }
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
      }
    };
    fetchSaves();
  }, [currentUserId]);

  // ✅ Handle Save/Unsave Toggle
  const handleSave = async (e, postId, postOwnerId) => {
    e.stopPropagation();

    if (!currentUserId) {
      alert("You must be logged in.");
      return;
    }

    try {
      setSavingIds((prev) => [...prev, postId]);

      const res = await fetch(
        "https://apisocial.atozkeysolution.com/api/posts/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            userId: currentUserId,
            postOwnerId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ Toggle saved state locally
        setSavedPosts((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev, postId]
        );
      } else {
        alert(data.message || "Failed to save post.");
      }
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Network error while saving post.");
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  const handleProfile = (id) => {
    if (id === userId) navigate("/myprofile");
    else navigate(`/userprofile/${id}`);
  };

  const isSaved = (postId) => savedPosts.includes(postId);

  return (
    <div className={selectedImage ? "col-md-12 col-lg-12" : "col-12"}>
      <div className="row">
        <div className="col-12">
          <div className={selectedImage ? "masonry1" : "masonry"}>
            {images.map((img, index) => (
              <div
                key={img._id || index}
                className="masonry-item mb-3 position-relative"
                onClick={() => onImageClick(img)}
                style={{ cursor: "pointer" }}
              >
                {(() => {
                  const mediaUrl = img.media?.[0]?.url;
                  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

                  return isVideo ? (
                    <video
                      src={mediaUrl}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={`img-${index}`}
                      className="img-fluid rounded"
                      style={{ width: "100%", display: "block" }}
                    />
                  );
                })()}

                {/* Hover Overlay */}
                <div className="image-hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3">
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-light btn-sm rounded-circle"
                      onClick={(e) => handleSave(e, img._id, img.userId?._id)}
                      disabled={savingIds.includes(img._id)}
                    >
                      <i
                        className={`bi ${
                          isSaved(img._id)
                            ? "bi-bookmark-fill text-primary"
                            : "bi-bookmark"
                        }`}
                      ></i>
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="text-white">
                    <div
                      className="d-flex align-items-center mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProfile(img.userId?._id);
                      }}
                    >
                      {img.userId?.profile?.image ? (
                        <img
                          src={img.userId.profile.image}
                          alt={img.userId?.fullName}
                          className="rounded-circle me-2"
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle me-2 d-flex justify-content-center align-items-center"
                          style={{
                            width: "30px",
                            height: "30px",
                            background:
                              "linear-gradient(135deg, #f47c31, #ff6b35)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {img.userId?.fullName?.[0] || "U"}
                        </div>
                      )}
                      <span className="fw-bold">{img.userId?.fullName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles */}
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

        .image-hover-overlay {
          opacity: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent);
          transition: opacity 0.3s ease;
        }

        .masonry-item:hover .image-hover-overlay {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .image-hover-overlay {
            opacity: 1 !important;
            background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent);
          }
        }

        @media (max-width: 1180px) {
          .masonry { column-count: 4; }
          .masonry1 { column-count: 3; }
        }

        @media (max-width: 992px) {
          .masonry { column-count: 3; }
        }

        @media (max-width: 576px) {
          .masonry { column-count: 1; }
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
  currentUserId: PropTypes.string,
};

export default ImageGrid;
