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
          <div className={selectedImage ? "masonry1" : "masonry"}>
            {images.map((img, index) => {
              const mediaUrl = img.media?.[0]?.url;
              const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

              return (
                <div
                  key={img._id || index}
                  className="masonry-item mb-3 position-relative"
                  onClick={() => onImageClick(img)}
                  style={{ cursor: "pointer" }}
                >
                  {/* -------------------- VIDEO -------------------- */}
                  {isVideo ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <video
                        ref={(el) => (videoRefs.current[img._id] = el)}
                        src={mediaUrl}
                        className="img-fluid rounded"
                        style={{
                          width: "100%",
                          display: "block",
                          objectFit: "cover",
                        }}
                        autoPlay
                        muted={muteState[img._id] ?? true}
                        loop
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                      />

                      <button
                        className="z-[9999]"
                        onClick={(e) => toggleMute(e, img._id)}
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
                        {muteState[img._id] ?? true ? (
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
                      alt={`img-${index}`}
                      className="img-fluid rounded"
                      style={{ width: "100%", display: "block" }}
                    />
                  )}

                  {/* -------------------- HOVER OVERLAY -------------------- */}
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
                  </div>
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
