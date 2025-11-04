// ImageDetail.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://social-media-nty4.onrender.com/api";

const ImageDetail = ({ image, onBack, onOpenGalleria, currentUserId }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(image.likes || []);
  const [comments, setComments] = useState(image.comments || []);
  const [saves, setSaves] = useState(image.saves || []);
  const [followStatus, setFollowStatus] = useState("none"); // 'none' | 'requested' | 'following' | 'incoming'
  const [newComment, setNewComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  useEffect(() => {
    setLikes(image.likes || []);
    setComments(image.comments || []);
    setSaves(image.saves || []);
  }, [image]);

  // ---------- FETCH FOLLOW STATUS ----------
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!userId || !image?.userId?._id || image.userId?._id === userId) {
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
        const pendingOutgoing = followingData?.pendingRequests || [];
        const followersList = followersData?.followers || [];

        const targetId = image.userId._id;

        const isFollowing = followingList.some((f) => f._id === targetId);
        const hasOutgoingRequest = pendingOutgoing.some((r) => r._id === targetId);
        const hasIncomingRequest = followersList.some(
          (f) => f._id === targetId && f.status === "pending"
        );

        if (isFollowing) {
          setFollowStatus("following");
        } else if (hasOutgoingRequest) {
          setFollowStatus("requested");
        } else if (hasIncomingRequest) {
          setFollowStatus("incoming");
        } else {
          setFollowStatus("none");
        }
      } catch (error) {
        console.error("Error fetching follow status:", error);
        setFollowStatus("none");
      }
    };

    fetchFollowStatus();
  }, [userId, image.userId]);

  // ---------- LIKE ----------
  const handleLike = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    try {
      setLoadingLike(true);
      const res = await fetch(`${API_BASE}/posts/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          postOwnerId: image.userId?._id,
        }),
      });
      const data = await res.json();
      if (data.success) setLikes(data.likes || []);
      else alert(data.message || "Failed to like post.");
    } catch {
      alert("Network error while liking post.");
    } finally {
      setLoadingLike(false);
    }
  };

  // ---------- SAVE / UNSAVE ----------
  const handleSave = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    try {
      setLoadingSave(true);
      const res = await fetch(`${API_BASE}/posts/save`, {
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
        setSaves(data.saves || []);
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

  // ---------- FOLLOW / SEND REQUEST ----------
  const handleFollow = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    if (image.userId?._id === currentUserId) return;

    try {
      setLoadingFollow(true);
      const res = await fetch(`${API_BASE}/send-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: image.userId?._id,
          followerId: currentUserId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowStatus("requested");
      } else {
        alert(data.message || "Failed to send follow request.");
      }
    } catch {
      alert("Network error while following user.");
    } finally {
      setLoadingFollow(false);
    }
  };

  // ---------- APPROVE REQUEST ----------
  const handleApprove = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(`${API_BASE}/approve-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          requesterId: image.userId?._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowStatus("following");
        setShowRequestModal(false);
      } else {
        alert(data.message || "Failed to approve request.");
      }
    } catch (err) {
      alert("Error approving request.");
    }
  };

  // ---------- REJECT REQUEST ----------
  const handleReject = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(`${API_BASE}/reject-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          followerId: image.userId?._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowStatus("none");
        setShowRequestModal(false);
      } else {
        alert(data.message || "Failed to reject request.");
      }
    } catch (err) {
      alert("Error rejecting request.");
    }
  };

  // ---------- DOWNLOAD ----------
  const handleDownload = () => {
    const url = image.media?.[0]?.url?.trim();
    if (!url) return alert("No media available for download.");
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    const extension = isVideo(image.media?.[0]?.type) ? "mp4" : "jpg";
    a.download = `post-${image._id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ---------- HELPERS ----------
  const handleProfile = (id) => {
    if (!id) return;
    if (id === userId) navigate("/myprofile");
    else navigate(`/userprofile/${id}`);
  };

  const isVideo = (type) => type?.startsWith("video/") || type === "video";

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
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
        {getInitials(name)}
      </div>
    );
  };

  if (!image) return null;

  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(currentUserId);
  const mediaType = image.media?.[0]?.type;
  const mediaUrl = image.media?.[0]?.url?.trim();

  // Button logic
  let followBtnText = "Follow";
  let followBtnClass = "btn-outline-primary text-primary";
  let followAction = handleFollow;

  if (followStatus === "following") {
    followBtnText = "Following";
    followBtnClass = "btn-success text-white";
    followAction = null;
  } else if (followStatus === "requested") {
    followBtnText = "Requested";
    followBtnClass = "btn-warning text-dark";
    followAction = null;
  } else if (followStatus === "incoming") {
    followBtnText = "Accept Request";
    followBtnClass = "btn-info text-white";
    followAction = () => setShowRequestModal(true);
  } else if (followStatus === "self") {
    followBtnText = "You";
    followBtnClass = "btn-secondary text-white";
    followAction = null;
  }

  return (
    <div className="image-detail-container d-flex flex-column" style={{ height: "100%" }}>
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
        {isVideo(mediaType) ? (
          <video
            src={mediaUrl}
            controls
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <img
            src={mediaUrl}
            alt={image.description || "Post"}
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
          />
        )}
      </div>

      <p className="fw-medium mb-3">
        {image.description || "No description available"}
      </p>

      {/* Like & Save */}
      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={handleLike}
          disabled={loadingLike}
        >
          <i
            className={`bi ${
              isLiked ? "bi-heart-fill text-danger" : "bi-heart"
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
            className={`bi ${
              isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"
            }`}
          ></i>
          {saves.length} Saves
        </button>
      </div>

      {/* Profile + Follow Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="d-flex align-items-center"
          onClick={() => handleProfile(image.userId?._id)}
          style={{ cursor: "pointer" }}
        >
          {renderAvatar(image.userId, 36)}
          <span className="fw-bold">{image.userId?.fullName || "Anonymous"}</span>
        </div>
        {followAction ? (
          <button
            className={`btn btn-sm ${followBtnClass}`}
            onClick={followAction}
            disabled={loadingFollow}
          >
            {loadingFollow ? "Processing..." : followBtnText}
          </button>
        ) : (
          <span className={`btn btn-sm ${followBtnClass} disabled`}>
            {followBtnText}
          </span>
        )}
      </div>

      <hr className="my-3" />

      {/* Comments */}
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
        className="btn btn-primary w-100 mt-3 rounded-pill py-2"
        onClick={handleDownload}
      >
        Download {isVideo(mediaType) ? "Video" : "Image"}
      </button>

      {/* Accept/Reject Modal */}
      {showRequestModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Follow Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRequestModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {image.userId?.fullName || "This user"} wants to follow you.
                </p>
                <p>Do you want to accept or reject the request?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleReject}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ImageDetail.propTypes = {
  image: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpenGalleria: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

export default ImageDetail;