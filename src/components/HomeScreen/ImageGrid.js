import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

const ImageGrid = ({ images, onImageClick, selectedImage, currentUserId }) => {
  const [savingIds, setSavingIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  // --------------- FETCH SAVED POSTS ---------------
  useEffect(() => {
    if (!currentUserId) return;
    const fetchSaves = async () => {
      try {
        const res = await fetch(
          `https://apisocial.atozkeysolution.com/api/saved-posts/${currentUserId}`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const savedIds = data.data.map((item) => item._id);
          setSavedPosts(savedIds);
        }
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
      }
    };

    fetchSaves();
  }, [currentUserId]);

  // --------------- SAVE / UNSAVE ---------------
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
          body: JSON.stringify({ postId, userId: currentUserId, postOwnerId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSavedPosts((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev, postId]
        );
      }
    } catch (err) {
      console.error("Error saving post:", err);
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  const isSaved = (postId) => savedPosts.includes(postId);

  const handleProfile = (id) => {
    if (id === userId) navigate("/myprofile");
    else navigate(`/userprofile/${id}`);
  };

  // --------------- VIDEO MUTE STATES (PER VIDEO) ---------------
  const videoRefs = useRef({});
  const [muteState, setMuteState] = useState({});

  // 🟢 FIXED MUTE LOGIC
  const toggleMute = (e, id) => {
    e.stopPropagation();

    // Build complete muteState for every video
    const allIds = Object.keys(videoRefs.current);

    setMuteState((prev) => {
      const newMuted = !prev[id];

      const updatedState = {};

      allIds.forEach((vid) => {
        if (vid === id) {
          updatedState[vid] = newMuted;
          if (videoRefs.current[vid]) {
            videoRefs.current[vid].muted = newMuted;
          }
        } else {
          // Mute all other videos if this one is unmuted
          updatedState[vid] = newMuted ? prev[vid] ?? true : true;
          if (!newMuted && videoRefs.current[vid]) {
            videoRefs.current[vid].muted = true;
          }
        }
      });

      return updatedState;
    });
  };

  // --------------- RENDER ---------------
  return (
    <div className={selectedImage ? "col-md-12 col-lg-12" : "col-12"}>
      <div className="row">
        <div className="col-12">
          <div className={selectedImage ? ( selectedImage.type === "advertisement" ? "masonry" : "masonry1") : "masonry"}>
            {images.map((item, index) => {
              const isAdvertisement = item.type === "advertisement";
              const mediaUrl = item.media?.[0]?.url;
              const isVideo = item.media?.[0]?.type === "video";

              return (
                <div
                  key={item._id || index}
                  className="masonry-item mb-3 position-relative"
                  onClick={() => onImageClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Advertisement Badge */}
                  {isAdvertisement && (
                    <div className="advertisement-badge position-absolute top-0 start-0 m-2 z-2">
                      <span className="badge glassmorphism-ad px-3 py-2 fw-bold text-black d-flex align-items-center">
                        <i className="bi bi-megaphone me-1 fw-bold"></i> Ad
                      </span>
                    </div>
                  )}

                  {/* -------------------- VIDEO -------------------- */}
                  {isVideo ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <video
                        ref={(el) => {
                          if (item._id) videoRefs.current[item._id] = el;
                        }}
                        src={mediaUrl}
                        className="img-fluid rounded"
                        style={{
                          width: "100%",
                          display: "block",
                          objectFit: "cover",
                        }}
                        autoPlay
                        muted={muteState[item._id] ?? true}
                        loop
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                      />

                      <button
                        className="z-[999] image-hover-overlay"
                        onClick={(e) => toggleMute(e, item._id)}
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          background: "rgba(0,0,0,0.6)",
                          border: "none",
                          borderRadius: "50%",
                          padding: "8px",
                          cursor: "pointer",
                          color: "white",
                        }}
                      >
                        {muteState[item._id] ?? true ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                    </div>
                  ) : (
                    // -------------------- IMAGE --------------------
                    <img
                      src={mediaUrl}
                      alt={isAdvertisement ? item.title || "Advertisement" : `img-${index}`}
                      className="img-fluid rounded"
                      style={{ width: "100%", display: "block" }}
                    />
                  )}

                  {/* -------------------- HOVER OVERLAY (Only for regular posts) -------------------- */}
                  {!isAdvertisement && (
                    <div className="image-hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-light btn-sm rounded-circle"
                          onClick={(e) => handleSave(e, item._id, item.userId?._id)}
                          disabled={savingIds.includes(item._id)}
                        >
                          <i
                            className={`bi ${
                              isSaved(item._id)
                                ? "bi-bookmark-fill text-primary"
                                : "bi-bookmark"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Advertisement Title Overlay */}
                  {isAdvertisement && (
                    <div className="ad-title-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px"
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-info-circle me-2"></i>
                        <small className="fw-bold">{item.title || "Advertisement"}</small>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* -------------------- STYLES -------------------- */}
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

          /* Glassmorphism Advertisement Badge */
          .glassmorphism-ad {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .glassmorphism-ad:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }

          @media (max-width: 1180px) {
            .masonry { column-count: 4; }
            .masonry1 { column-count: 3; }
          }

          @media (max-width: 992px) {
            .masonry { column-count: 3; }
          }

          @media (max-width: 768px) {
            .image-hover-overlay {
              opacity: 1 !important;
            }
          }

          @media (max-width: 576px) {
            .masonry { column-count: 2; }
            .masonry1 { column-count: 1; }
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