import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://apisocial.atozkeysolution.com/api";
const SAVE_API = "https://apisocial.atozkeysolution.com/api/posts/save";

const ImageDetail = ({ image, onBack, onOpenGalleria, currentUserId }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(image.likes || []);
  const [comments, setComments] = useState(image.comments || []);
  const [saves, setSaves] = useState([]); // we'll fetch user-specific saves
  const [followStatus, setFollowStatus] = useState("none");
  const [newComment, setNewComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

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

  // ---------- FOLLOW STATUS ----------
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

        const followingList = followingData?.data?.following || [];
        const pendingOutgoing = followingData?.data?.pendingRequests || [];
        const followersList = followersData?.data?.followers || [];

        const targetId = image.userId._id;

        const isFollowing = followingList.some((f) => f._id === targetId);
        const hasOutgoingRequest = pendingOutgoing.some((r) => r._id === targetId);
        const hasIncomingRequest = followersList.some(
          (f) => f._id === targetId && f.status === "pending"
        );

        if (isFollowing) setFollowStatus("following");
        else if (hasOutgoingRequest) setFollowStatus("requested");
        else if (hasIncomingRequest) setFollowStatus("incoming");
        else setFollowStatus("none");
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
    } catch (error) {
      console.error("Error saving post:", error);
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

  // ---------- FOLLOW ----------
  const handleFollow = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    if (image.userId?._id === currentUserId) return;

    try {
      setLoadingFollow(true);
      let res;
      let newStatus;

      if (followStatus === "following") {
        // Unfollow
        res = await fetch(`${API_BASE}/unfollow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: image.userId?._id,
            followerId: currentUserId,
          }),
        });
        newStatus = "none";
      } else if (followStatus === "requested") {
        // Cancel request
        res = await fetch(`${API_BASE}/cancel-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: image.userId?._id,
            followerId: currentUserId,
          }),
        });
        newStatus = "none";
      } else {
        // Follow (send request)
        res = await fetch(`${API_BASE}/send-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: image.userId?._id,
            followerId: currentUserId,
          }),
        });
        newStatus = "requested";
      }

      const data = await res.json();
      if (data.success) {
        setFollowStatus(newStatus);
      } else {
        alert(data.message || "Failed to update follow status.");
      }
    } catch {
      alert("Network error while updating follow status.");
    } finally {
      setLoadingFollow(false);
    }
  };

  // ---------- DOWNLOAD ----------
  const handleDownload = () => {
    const url = image.media?.[0]?.url?.trim();
    if (!url) return alert("No media available for download.");
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    const extension = image.media?.[0]?.type?.includes("video") ? "mp4" : "jpg";
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

  if (!image) return null;

  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(image._id);
  const mediaType = image.media?.[0]?.type;
  const mediaUrl = image.media?.[0]?.url?.trim();

  return (
    <div className="image-detail-container d-flex flex-column" style={{ height: "100%" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Post Details</h5>
        <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={onBack}>
          ✕
        </button>
      </div>

      {/* Media */}
      <div className="rounded mb-3 overflow-hidden bg-dark d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
        {mediaType?.includes("video") ? (
          <video src={mediaUrl} controls className="w-100 h-100" style={{ objectFit: "contain" }} />
        ) : (
          <img src={mediaUrl} alt={image.description || "Post"} className="w-100 h-100" style={{ objectFit: "contain" }} />
        )}
      </div>

      <p className="fw-medium mb-3">{image.description || "No description available"}</p>

      {/* Like & Save Buttons */}
      <div className="d-flex gap-3 mb-3">
        <button className="btn btn-sm d-flex align-items-center gap-1" onClick={handleLike} disabled={loadingLike}>
          <i className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
          {likes.length} Likes
        </button>

        <button className="btn btn-sm d-flex align-items-center gap-1" onClick={handleSave} disabled={loadingSave}>
          <i className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"}`}></i>
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* User Info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center" onClick={() => handleProfile(image.userId?._id)} style={{ cursor: "pointer" }}>
          {renderAvatar(image.userId, 36)}
          <span className="fw-bold">{image.userId?.fullName || "Anonymous"}</span>
        </div>
        
        {/* Follow Button */}
        {followStatus !== "self" && (
          <button
            className={`btn btn-sm ${
              followStatus === "following"
                ? "btn-outline-danger"
                : followStatus === "requested"
                ? "btn-outline-secondary"
                : "btn-primary"
            }`}
            onClick={handleFollow}
            disabled={loadingFollow}
          >
            {loadingFollow
              ? "..."
              : followStatus === "following"
              ? "Unfollow"
              : followStatus === "requested"
              ? "Requested"
              : "Follow"}
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: "300px" }}>
        <h6 className="mb-2">Comments ({comments.length})</h6>
        {comments.map((comment) => (
          <div key={comment._id} className="mb-2 p-2 bg-light rounded">
            <div className="d-flex align-items-start">
              {renderAvatar(comment.userId, 28)}
              <div>
                <div className="fw-bold">{comment.userId?.fullName || "Anonymous"}</div>
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
          <button className="btn btn-primary btn-sm" type="submit" disabled={!newComment.trim() || loadingComment}>
            {loadingComment ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Download Button */}
      <button className="btn btn-primary w-100 mt-3 rounded-pill py-2" onClick={handleDownload}>
        Download {mediaType?.includes("video") ? "Video" : "Image"}
      </button>
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