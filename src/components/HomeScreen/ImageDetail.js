// ImageDetail.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ImageDetail = ({ image, onBack, onOpenGalleria, currentUserId }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(image.likes || []);
  const [comments, setComments] = useState(image.comments || []);
  const [saves, setSaves] = useState(image.saves || []);
  const [newComment, setNewComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  useEffect(() => {
    setLikes(image.likes || []);
    setComments(image.comments || []);
    setSaves(image.saves || []);
  }, [image]);

  const handleLike = async () => {
    if (!currentUserId) return alert("You must be logged in.");
    try {
      setLoadingLike(true);
      const res = await fetch("https://social-media-nty4.onrender.com/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          postOwnerId: image.userId?._id
        }),
      });
      const data = await res.json();
      if (data.success) setLikes(data.likes || []);
      else alert(data.message || "Failed to like.");
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoadingLike(false);
    }
  };

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
          postOwnerId: image.userId?._id
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    try {
      setLoadingComment(true);
      const res = await fetch("https://social-media-nty4.onrender.com/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: image._id,
          userId: currentUserId,
          text: newComment
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.data]);
        setNewComment("");
      } else {
        alert(data.message || "Failed to comment.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDownload = () => {
    const url = image.media?.[0]?.url?.trim();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    const extension = isVideo(image.media?.[0]?.type) ? 'mp4' : 'jpg';
    a.download = `post-${image._id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleProfile = (id) => {
    if (id === userId) {
      navigate('/myprofile');
    } else {
      navigate(`/userprofile/${id}`);
    }
  }

  const isVideo = (type) => {
    return type && (type.startsWith('video/') || type === 'video');
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const renderProfileImage = (user) => {
    const profileImage = user?.profile?.image?.trim();
    const fullName = user?.fullName || "Anonymous";
    
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={fullName}
          className="rounded-circle"
          width="36"
          height="36"
          style={{ objectFit: "cover" }}
        />
      );
    } else {
      return (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
          style={{ width: "36px", height: "36px", fontSize: "14px" }}
        >
          {getInitials(fullName)}
        </div>
      );
    }
  };

  const renderCommentAvatar = (user) => {
    const profileImage = user?.profile?.image?.trim();
    const fullName = user?.fullName || "Anonymous";
    
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={fullName}
          className="rounded-circle me-2"
          width="28"
          height="28"
          style={{ objectFit: "cover" }}
        />
      );
    } else {
      return (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold me-2"
          style={{ width: "28px", height: "28px", fontSize: "12px", flexShrink: 0 }}
        >
          {getInitials(fullName)}
        </div>
      );
    }
  };

  if (!image) return null;
  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(currentUserId);
  const mediaType = image.media?.[0]?.type;
  const mediaUrl = image.media?.[0]?.url?.trim();

  return (
    <div className="image-detail-container d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Post Details</h5>
        <button
          className="btn btn-sm btn-outline-secondary rounded-circle"
          onClick={onBack}
        >
          ✕
        </button>
      </div>

      <div
        className="rounded mb-3 overflow-hidden bg-dark"
        style={{ height: '250px', cursor: isVideo(mediaType) ? 'default' : 'pointer' }}
        onClick={!isVideo(mediaType) ? onOpenGalleria : undefined}
      >
        {isVideo(mediaType) ? (
          <video
            src={mediaUrl}
            controls
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={image.description || "Post"}
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
          />
        )}
      </div>

      <p className="fw-medium mb-3">{image.description || "No description"}</p>

      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={handleLike}
          disabled={loadingLike}
        >
          <i className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
          {likes.length} Likes
        </button>
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={handleSave}
          disabled={loadingSave}
        >
          <i className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"}`}></i>
          {saves.length} Saves
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="d-flex align-items-center gap-2"
          onClick={() => handleProfile(image.userId?._id)}
          style={{ cursor: "pointer" }}
        >
          {renderProfileImage(image.userId)}
          <span className="fw-bold">{image.userId?.fullName || "Anonymous"}</span>
        </div>
        <button className="btn btn-sm btn-outline-primary">Follow</button>
      </div>

      <hr className="my-3" />

      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
        <h6 className="mb-2">Comments ({comments.length})</h6>
        <div>
          {comments.map(comment => (
            <div key={comment._id} className="mb-2 p-2 bg-light rounded">
              <div className="d-flex align-items-start">
                {renderCommentAvatar(comment.userId)}
                <div className="flex-grow-1">
                  <div className="fw-bold">{comment.userId?.fullName || "Anonymous"}</div>
                  <div>{comment.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            Post
          </button>
        </div>
      </form>

      <button
        className="btn btn-primary w-100 mt-3 rounded-pill py-2"
        onClick={handleDownload}
      >
        Download {isVideo(mediaType) ? 'Video' : 'Image'}
      </button>

      <style jsx>{`
        .image-detail-container {
          width: 100%;
          max-width: 100%;
          padding: 0;
        }

        @media (min-width: 768px) {
          .image-detail-container {
            position: sticky;
            top: 20px;
            height: fit-content;
            max-height: calc(100vh - 40px);
            overflow: hidden;
            padding-right: 0;
          }
        }
      `}</style>
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