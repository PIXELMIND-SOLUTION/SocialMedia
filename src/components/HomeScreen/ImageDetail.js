import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DownloadModal from "./Download";

const API_BASE = "https://apisocial.atozkeysolution.com/api";
const SAVE_API = "https://apisocial.atozkeysolution.com/api/posts/save";

const ImageDetail = ({ image, onBack, onOpenGalleria, currentUserId }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(image.likes || []);
  const [comments, setComments] = useState(image.comments || []);
  const [saves, setSaves] = useState([]);
  const [followStatus, setFollowStatus] = useState("none");
  const [newComment, setNewComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [cost, setCost] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  // Initialize preview image
  useEffect(() => {

    if (!image || image.type === "advertisement") {
      return null;
    }
    if (image?.media?.[0]) {
      setPreviewImage(image.media[0]);
    }
  }, [image]);

  // ---------- Fetch All Follow Requests ----------
  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await fetch(`${API_BASE}/requests/all`);
        const data = await res.json();
        if (data.success) {
          setAllRequests(data.allRequests || []);
        }
      } catch (error) {
        console.error("Failed to fetch all requests:", error);
      }
    };
    fetchAllRequests();
  }, []);

  // ---------- Fetch Saved Posts ----------
  useEffect(() => {
    if (!currentUserId) return;
    const fetchSavedPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/saved-posts/${currentUserId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const savedIds = data.data.map((post) => post._id);
          setSaves(savedIds);
        }
      } catch (error) {
        console.error("Failed to fetch saved posts:", error);
      }
    };
    fetchSavedPosts();
  }, [currentUserId]);

  // ---------- Update Likes & Comments on Image Change ----------
  useEffect(() => {
    setLikes(image.likes || []);
    setComments(image.comments || []);
  }, [image]);

  // ---------- FIXED FOLLOW STATUS ----------
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!userId || !image?.userId?._id) {
        setFollowStatus("none");
        return;
      }

      if (image.userId?._id === userId) {
        setFollowStatus("self");
        return;
      }

      try {
        const [followingRes, followersRes] = await Promise.all([
          fetch(`${API_BASE}/following/${userId}`),
          fetch(`${API_BASE}/followers/${userId}`),
        ]);

        const followingData = await followingRes.json();
        const followersData = await followersRes.json();

        const followingList = followingData?.following || [];
        const followersList = followersData?.followers || [];
        const targetId = image.userId._id;

        const isFollowing = followingList.some(f => f._id === targetId);
        if (isFollowing) {
          setFollowStatus("following");
          return;
        }

        const outgoingRequest = allRequests.find(req => req.userId === targetId);
        if (outgoingRequest) {
          const hasOutgoingRequest = outgoingRequest.requests.some(
            req => req._id === userId
          );
          if (hasOutgoingRequest) {
            setFollowStatus("requested");
            return;
          }
        }

        const incomingRequest = allRequests.find(req => req.userId === userId);
        if (incomingRequest) {
          const hasIncomingRequest = incomingRequest.requests.some(
            req => req._id === targetId
          );
          if (hasIncomingRequest) {
            setFollowStatus("incoming");
            return;
          }
        }

        const pendingFollower = followersList.find(
          f => f._id === targetId && f.status === "pending"
        );
        if (pendingFollower) {
          setFollowStatus("incoming");
          return;
        }

        setFollowStatus("none");
      } catch (error) {
        console.error("Error fetching follow status:", error);
        setFollowStatus("none");
      }
    };

    fetchFollowStatus();
  }, [userId, image.userId, allRequests]);

  // ---------- LIKE / UNLIKE ----------
  const handleLike = async () => {
    if (!currentUserId) {
      alert("You must be logged in.");
      return;
    }

    try {
      setLoadingLike(true);
      const isLiked = likes.some(like =>
        like._id === currentUserId ||
        like.userId === currentUserId ||
        like === currentUserId
      );

      const res = await fetch(`${API_BASE}/posts/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          postOwnerId: image.userId?._id,
          action: isLiked ? "unlike" : "like"
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.likes !== undefined) {
          setLikes(data.likes);
        } else if (isLiked) {
          setLikes(prev => prev.filter(like =>
            like._id !== currentUserId &&
            like.userId !== currentUserId &&
            like !== currentUserId
          ));
        } else {
          setLikes(prev => [...prev, { _id: currentUserId, userId: currentUserId }]);
        }
      } else {
        alert(data.message || "Failed to update like.");
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
      alert("Network error while updating like.");
    } finally {
      setLoadingLike(false);
    }
  };

  // ---------- FIXED FOLLOW/UNFOLLOW HANDLER ----------
  const handleFollow = async () => {
    if (!currentUserId) {
      alert("You must be logged in.");
      return;
    }

    if (image.userId?._id === currentUserId) {
      alert("You cannot follow yourself.");
      return;
    }

    try {
      setLoadingFollow(true);
      let endpoint = "";
      let method = "POST";
      let body = {};
      let expectedNewStatus = "";

      switch (followStatus) {
        case "following":
          endpoint = `${API_BASE}/unfollow`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "none";
          break;

        case "requested":
          endpoint = `${API_BASE}/cancel-request`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "none";
          break;

        case "incoming":
          endpoint = `${API_BASE}/accept-request`;
          body = {
            requestId: currentUserId,
            targetId: image.userId?._id,
          };
          expectedNewStatus = "following";
          break;

        case "none":
        default:
          endpoint = `${API_BASE}/send-request`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "requested";
          break;
      }

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setFollowStatus(expectedNewStatus);
        try {
          const requestsRes = await fetch(`${API_BASE}/requests/all`);
          const requestsData = await requestsRes.json();
          if (requestsData.success) {
            setAllRequests(requestsData.allRequests || []);
          }
        } catch (err) {
          console.error("Failed to refresh requests:", err);
        }
      } else {
        alert(data.message || "Failed to update follow status.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error while updating follow status.");
    } finally {
      setLoadingFollow(false);
    }
  };

  // ---------- SAVE / UNSAVE ----------
  const handleSave = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    try {
      setLoadingSave(true);
      const res = await fetch(SAVE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          postOwnerId: image.userId?._id,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSaves((prev) =>
          prev.includes(image._id)
            ? prev.filter((id) => id !== image._id)
            : [...prev, image._id]
        );
      } else {
        alert(data.message || "Failed to save/unsave post.");
      }
    } catch {
      alert("Network error while saving post.");
    } finally {
      setLoadingSave(false);
    }
  };

  // ---------- COMMENT ----------
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    try {
      setLoadingComment(true);
      const res = await fetch(`${API_BASE}/posts/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          text: newComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.data]);
        setNewComment("");
      } else {
        alert(data.message || "Failed to comment.");
      }
    } catch {
      alert("Network error while commenting.");
    } finally {
      setLoadingComment(false);
    }
  };

  useEffect(() => {
    if (selectedMediaIndex === null) {
      setCost(0);
      return;
    }

    const mediaType = image?.media?.[selectedMediaIndex]?.type;
    if (mediaType === "image") {
      setCost(2);
    } else if (mediaType === "video") {
      setCost(5);
    } else {
      setCost(0);
    }
  }, [image, selectedMediaIndex]);

  const handleFileDownload = async () => {
    try {
      if (selectedMediaIndex === null) {
        alert("Please select a media to download");
        return;
      }

      const media = image.media[selectedMediaIndex];
      const url = media.url?.trim();
      if (!url) return alert("No media available");

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const extension = media.type === "video" ? "mp4" : "jpg";
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `post-${image._id}-${selectedMediaIndex}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("File download error:", err);
      alert("Failed to download file");
    }
  };

  // ---------- HELPERS ----------
  const handleProfile = (id) => {
    if (!id) return;
    if (id === userId) navigate("/myprofile");
    else navigate(`/userprofile/${id}`);
  };

  const renderAvatar = (user, size = 36) => {
    const img = user?.profile?.image?.trim();
    const name = user?.fullName || "Anonymous";
    return img ? (
      <img
        src={img}
        alt={name}
        className="rounded-circle me-2"
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
      />
    ) : (
      <div
        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold me-2"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size * 0.35}px`,
          background: "linear-gradient(135deg, #f47c31, #ff6b35)",
        }}
      >
        {name?.[0]?.toUpperCase() || "U"}
      </div>
    );
  };

  const getFollowButtonText = () => {
    if (loadingFollow) return "...";
    switch (followStatus) {
      case "following":
        return "Following";
      case "requested":
        return "Requested";
      case "incoming":
        return "Accept Request";
      case "self":
        return "";
      default:
        return "Follow";
    }
  };

  const getFollowButtonClass = () => {
    switch (followStatus) {
      case "following":
        return "btn-outline-secondary";
      case "requested":
        return "btn-outline-secondary";
      case "incoming":
        return "btn-success";
      case "self":
        return "";
      default:
        return "btn-primary";
    }
  };

  // Handle image selection
  const handleImageSelect = (media, index) => {
    setPreviewImage(media);
    setSelectedMediaIndex(index);
  };

  // Open mobile modal
  const handleOpenMobileModal = () => {
    setShowMobileModal(true);
  };

  if (!image) return null;

  const isLiked = likes.some(like =>
    like._id === currentUserId ||
    like.userId === currentUserId ||
    like === currentUserId
  );
  const isSaved = saves.includes(image._id);

  return (
    <>
      {/* MODERN PREVIEW SECTION - Shown on mobile instead of immediate modal */}
      <div className="d-block d-lg-none">
        <div className="modern-preview-container" style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          margin: '16px'
        }}>
          {/* Header */}
          <div className="preview-header" style={{
            padding: '20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div className="d-flex align-items-center gap-3">
              <div
                onClick={() => handleProfile(image.userId?._id)}
                style={{ cursor: 'pointer' }}
              >
                {renderAvatar(image.userId, 44)}
              </div>
              <div>
                <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>
                  {image.userId?.fullName || "Anonymous"}
                </h6>
                <small className="text-muted" style={{ fontSize: '13px' }}>
                  @{image.userId?.profile?.username || "user"}
                </small>
              </div>
            </div>
            <button
              onClick={onBack}
              className="btn btn-sm rounded-circle"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                border: 'none',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Preview Media Display */}
          <div className="preview-media" style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #f0f0f0'
          }}>
            {previewImage?.type?.includes("video") ? (
              <div className="video-preview-container" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative'
              }}>
                <video
                  src={previewImage.url}
                  controls
                  className="w-100"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  VIDEO
                </div>
              </div>
            ) : (
              <div className="image-preview-container" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000'
              }}>
                <img
                  src={previewImage?.url}
                  alt="Preview"
                  className="w-100"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            )}
          </div>

          {/* Media Selection Thumbnails */}
          <div className="media-selection" style={{
            padding: '20px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <h6 className="fw-bold mb-3" style={{ fontSize: '15px' }}>
              Select Media ({image?.media?.length || 0} items)
            </h6>
            <div className="d-flex gap-3 flex-wrap">
              {image?.media?.map((media, index) => (
                <div
                  key={index}
                  onClick={() => handleImageSelect(media, index)}
                  className={`media-thumbnail ${selectedMediaIndex === index ? 'selected' : ''}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    border: selectedMediaIndex === index ? '3px solid #007bff' : '2px solid #e0e0e0',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {media.type === "video" ? (
                    <>
                      <video
                        src={media.url}
                        muted
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '10px'
                      }}>
                        ▶
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Image ${index + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <div className="media-number" style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Info */}
          <div className="preview-info" style={{
            padding: '20px'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-1" style={{ fontSize: '15px' }}>
                  {image.userId?.fullName || "Anonymous"}
                </h6>
                <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                  {image.description || "No description"}
                </p>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: '15px' }}>
                  {likes.length} Likes
                </div>
                <div className="text-muted" style={{ fontSize: '13px' }}>
                  {comments.length} Comments
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-3">
              <button
                onClick={handleLike}
                disabled={loadingLike}
                className="btn btn-outline-primary d-flex align-items-center gap-2 flex-grow-1 justify-content-center py-2"
                style={{ borderRadius: '8px' }}
              >
                <i className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                {isLiked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={handleSave}
                disabled={loadingSave}
                className="btn btn-outline-primary d-flex align-items-center gap-2 flex-grow-1 justify-content-center py-2"
                style={{ borderRadius: '8px' }}
              >
                <i className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"}`}></i>
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Open Full View Button */}
            <button
              onClick={handleOpenMobileModal}
              className="btn btn-primary w-100 py-3"
              style={{
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #f47c31 0%, #f47c31 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              <i className="bi bi-arrows-angle-expand me-2"></i>
              Open Full View
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Modal - Opens when user clicks "Open Full View" */}
      {showMobileModal && (
        <div className="d-block d-lg-none">
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            overflow: 'hidden'
          }}>
            <div className="mobile-modal-content" style={{
              backgroundColor: '#fff',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              height: '90%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Swipe Indicator */}
              <div className="swipe-indicator" style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '5px',
                backgroundColor: '#ddd',
                borderRadius: '3px',
                zIndex: 10
              }} />

              {/* Header - Fixed */}
              <div className="modal-header" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 16px 16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                zIndex: 5,
                flexShrink: 0
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    onClick={() => handleProfile(image.userId?._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {renderAvatar(image.userId, 44)}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>
                      {image.userId?.fullName || "Anonymous"}
                    </h6>
                    <small className="text-muted" style={{ fontSize: '13px' }}>
                      @{image.userId?.profile?.username || "user"}
                    </small>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="btn btn-close"
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '22px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    borderRadius: '50%',
                    transition: 'all 0.2s'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="modal-scrollable-content" style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '90px'
              }}>
                {/* Main Media */}
                <div className="main-media-container" style={{
                  width: '100%',
                  maxHeight: '45vh',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {previewImage?.type?.includes("video") ? (
                    <video
                      src={previewImage.url}
                      controls
                      className="w-100"
                      style={{
                        maxHeight: '45vh',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <img
                      src={previewImage?.url}
                      alt={image.description || "Post"}
                      className="w-100"
                      style={{
                        maxHeight: '45vh',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  )}
                </div>

                {/* Media Thumbnails in Modal */}
                {image?.media?.length > 1 && (
                  <div className="media-thumbnails-modal" style={{
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <h6 className="fw-bold mb-3" style={{ fontSize: '15px' }}>
                      Select Media
                    </h6>
                    <div className="d-flex gap-2 flex-nowrap overflow-auto pb-2">
                      {image.media.map((media, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setPreviewImage(media);
                            setSelectedMediaIndex(index);
                          }}
                          className={`border rounded p-1 flex-shrink-0 ${selectedMediaIndex === index
                            ? "border-primary border-2"
                            : "border-secondary"
                            }`}
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          {media.type === "video" ? (
                            <>
                              <video
                                src={media.url}
                                muted
                                className="w-100 h-100 rounded"
                                style={{ objectFit: "cover" }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                fontSize: '10px'
                              }}>
                                ▶
                              </div>
                            </>
                          ) : (
                            <img
                              src={media.url}
                              alt="media"
                              className="w-100 h-100 rounded"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                          <div className="media-number" style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions" style={{
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4">
                      <button
                        onClick={handleLike}
                        disabled={loadingLike}
                        className="btn p-0"
                        style={{
                          fontSize: '28px',
                          color: isLiked ? '#ff4757' : '#6c757d',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loadingSave}
                        className="btn p-0"
                        style={{
                          fontSize: '28px',
                          color: isSaved ? '#1e90ff' : '#6c757d',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <i className={`bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark"}`}></i>
                      </button>
                      <button
                        className="btn p-0"
                        onClick={() => setShowDownloadModal(true)}
                        style={{
                          fontSize: '28px',
                          color: '#6c757d',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <i className="bi bi-download" />
                      </button>
                    </div>

                    {followStatus !== "self" && (
                      <button
                        className={`btn btn-sm ${getFollowButtonClass()} rounded-pill px-4 py-2`}
                        onClick={handleFollow}
                        disabled={loadingFollow}
                        style={{
                          minWidth: '100px',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        {getFollowButtonText()}
                      </button>
                    )}
                  </div>

                  {/* Likes Count */}
                  <div className="mt-3">
                    <strong style={{ fontSize: '15px' }}>
                      {likes.length} {likes.length === 1 ? 'like' : 'likes'}
                    </strong>
                  </div>
                </div>

                {/* Post Description */}
                <div className="post-description" style={{
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <p className="mb-2" style={{
                    lineHeight: '1.6',
                    fontSize: '15px'
                  }}>
                    <strong>{image.userId?.fullName || "Anonymous"}</strong> {image.description || "No description"}
                  </p>
                  <small className="text-muted" style={{ fontSize: '13px' }}>
                    {new Date(image.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </small>
                </div>

                {/* Comments Section */}
                <div className="comments-section" style={{
                  padding: '16px'
                }}>
                  <h6 className="fw-bold mb-3" style={{ fontSize: '16px' }}>
                    Comments ({comments.length})
                  </h6>

                  {comments.length > 0 ? (
                    <div className="comments-list">
                      {comments.map((comment) => (
                        <div key={comment._id} className="comment-item mb-3 pb-3" style={{
                          borderBottom: '1px solid #f5f5f5'
                        }}>
                          <div className="d-flex gap-3">
                            <div
                              onClick={() => handleProfile(comment.userId?._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {renderAvatar(comment.userId, 36)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <div>
                                  <strong className="small" style={{ fontSize: '14px' }}>
                                    {comment.userId?.fullName || "Anonymous"}
                                  </strong>
                                  <small className="text-muted ms-2" style={{ fontSize: '12px' }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                              <p className="mb-0" style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                              }}>
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-chat-dots fs-4 mb-2 d-block"></i>
                      <p className="mb-1" style={{ fontSize: '15px' }}>No comments yet</p>
                      <small style={{ fontSize: '13px' }}>Be the first to comment</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Comment Input */}
              <div className="fixed-comment-input" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                backgroundColor: '#fff',
                borderTop: '1px solid #f0f0f0',
                zIndex: 10,
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <form onSubmit={handleCommentSubmit} className="d-flex gap-2 align-items-center">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={loadingComment}
                    style={{
                      flex: 1,
                      padding: '10px 20px',
                      fontSize: '15px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={!newComment.trim() || loadingComment}
                    style={{
                      fontWeight: '600',
                      fontSize: '15px',
                      padding: '10px 20px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {loadingComment ? '...' : 'Post'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View (ORIGINAL - UNCHANGED) */}
      <div className="image-detail-container d-none d-lg-flex flex-column" style={{ height: "100%" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Post Details</h5>
          <button
            className="btn btn-sm btn-outline-secondary rounded-circle"
            onClick={onBack}
          >
            ✕
          </button>
        </div>

        {/* Media */}
        <div
          className="rounded mb-3 overflow-hidden bg-dark d-flex align-items-center justify-content-center"
          style={{ height: "250px" }}
        >
          {previewImage?.type?.includes("video") ? (
            <video
              src={previewImage.url}
              controls
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <img
              src={previewImage?.url}
              alt={image.description || "Post"}
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
            />
          )}
        </div>

        {/* Media Selector (Desktop) */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {image?.media?.map((media, index) => (
            <div
              key={index}
              onClick={() => handleImageSelect(media, index)}
              className={`border rounded p-1 ${selectedMediaIndex === index
                ? "border-primary"
                : "border-secondary"
                }`}
              style={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                position: 'relative'
              }}
            >
              {media.type === "video" ? (
                <>
                  <video
                    src={media.url}
                    muted
                    className="w-100 h-100 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    fontSize: '10px'
                  }}>
                    ▶
                  </div>
                </>
              ) : (
                <img
                  src={media.url}
                  alt="media"
                  className="w-100 h-100 rounded"
                  style={{ objectFit: "cover" }}
                />
              )}
              <div className="media-number" style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {selectedMediaIndex === null && (
          <small className="text-danger d-block mb-2">
            Please select an image or video to download
          </small>
        )}

        <p className="fw-medium mb-3">
          {image.description || "No description available"}
        </p>

        {/* Like & Save Buttons */}
        <div className="d-flex gap-3 mb-3">
          <button
            className="btn btn-sm d-flex align-items-center gap-1"
            onClick={handleLike}
            disabled={loadingLike}
          >
            <i
              className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"
                }`}
            ></i>
            {likes.length} Likes
          </button>

          <button
            className="btn btn-sm d-flex align-items-center gap-1"
            onClick={handleSave}
            disabled={loadingSave}
          >
            <i
              className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"
                }`}
            ></i>
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {/* User Info */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div
            className="d-flex align-items-center"
            onClick={() => handleProfile(image.userId?._id)}
            style={{ cursor: "pointer" }}
          >
            {renderAvatar(image.userId, 36)}
            <span className="fw-bold">{image.userId?.fullName || "Anonymous"}</span>
          </div>

          {/* Follow Button */}
          {followStatus !== "self" && (
            <button
              className={`btn btn-sm ${getFollowButtonClass()}`}
              onClick={handleFollow}
              disabled={loadingFollow}
            >
              {getFollowButtonText()}
            </button>
          )}
        </div>

        {/* Debug Info (remove in production) */}
        <div className="small text-muted mb-2">
          Follow Status: {followStatus}
        </div>

        {/* Comments Section */}
        <div
          className="flex-grow-1 overflow-auto mb-3"
          style={{ maxHeight: "300px" }}
        >
          <h6 className="mb-2">Comments ({comments.length})</h6>
          {comments.map((comment) => (
            <div key={comment._id} className="mb-2 p-2 bg-light rounded">
              <div className="d-flex align-items-start">
                {renderAvatar(comment.userId, 28)}
                <div>
                  <div className="fw-bold">
                    {comment.userId?.fullName || "Anonymous"}
                  </div>
                  <div>{comment.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="mt-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loadingComment}
            />
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={!newComment.trim() || loadingComment}
            >
              {loadingComment ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {/* Download Button */}
        <button
          className="btn btn-orange w-100 mt-3 rounded-pill py-2"
          onClick={() => setShowDownloadModal(true)}
        >
          <i className="bi bi-download me-2"></i>
          Download {previewImage?.type?.includes("video") ? "Video" : "Image"}
        </button>
      </div>

      {/* Download Modal */}
      <DownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        cost={cost}
        image={image}
        currentUserId={currentUserId}
        selectedMediaIndex={selectedMediaIndex}
        onAuthorized={handleFileDownload}
      />

      {/* Styles */}
      <style>{`
        /* Modern Preview Styles */
        .media-thumbnail:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .media-thumbnail.selected {
          border-color: #007bff !important;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        /* Modal Styles */
        @media (max-width: 991px) {
          .modal-overlay {
            animation: fadeIn 0.3s ease;
          }
          
          .mobile-modal-content {
            animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(100%);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .modal-scrollable-content::-webkit-scrollbar {
            width: 6px;
          }
          
          .modal-scrollable-content::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          .modal-scrollable-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          
          .modal-scrollable-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
          
          .post-actions button:hover {
            transform: scale(1.1);
          }
          
          .comment-item:last-child {
            border-bottom: none !important;
          }
          
          .btn-close:hover {
            background-color: #f0f0f0 !important;
            transform: scale(1.1);
          }
          
          .media-thumbnails-modal div:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        }
        
        /* Smooth transitions */
        button, .media-thumbnail, .media-thumbnails-modal div {
          transition: all 0.2s ease;
        }
        
        /* Focus states */
        input:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
        
        /* Button hover effects */
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

ImageDetail.propTypes = {
  image: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpenGalleria: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

export default ImageDetail;