import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ImageDetail = ({
  image,
  onBack,
  onOpenGalleria,
  currentUserId, // Pass logged-in userId from parent
}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(image.likes || []);
  const [comments, setComments] = useState(image.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  console.log(comments)

  if (!image) return null;

  // --- LIKE HANDLER ---
  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const response = await fetch(
        "https://social-media-nty4.onrender.com/api/posts/like",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: image._id,
            userId: currentUserId,
            postOwnerId: image.userId?._id,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setLikes(data.likes || []); // Update likes array
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  // --- COMMENT HANDLER ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoadingComment(true);
      const response = await fetch(
        "https://social-media-nty4.onrender.com/api/posts/comment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: image._id,
            userId: currentUserId,
            text: newComment,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setComments((prev) => [...prev, data.data]); // Append new comment
        setNewComment("");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  // --- DOWNLOAD HANDLER ---
  const handleDownload = () => {
    if (!image.media?.[0]?.url) return;
    const link = document.createElement("a");
    link.href = image.media[0].url;
    link.download = "post-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="col-md-4">
      <div
        className="bg-light p-4 sticky-top"
        style={{
          top: "20px",
          borderRadius: "15px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Details</h4>
          <button
            className="btn btn-sm btn-dark rounded-circle"
            onClick={onBack}
          >
            ✕
          </button>
        </div>

        {/* Image Preview */}
        <div
          className="mb-4 position-relative"
          style={{
            overflow: "hidden",
            height: "300px",
            cursor: "pointer",
          }}
          onClick={onOpenGalleria}
        >
          <img
            src={image.media?.[0]?.url}
            alt={image.description || "Post Image"}
            className="rounded w-100 h-100"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Description */}
        <h5>{image.description}</h5>

        {/* Likes + Saves */}
        <div className="d-flex gap-3 mb-3">
          <button
            className="btn btn-link p-0"
            onClick={handleLike}
            disabled={loadingLike}
          >
            <i
              className={`bi me-1 ${
                likes.includes(currentUserId)
                  ? "bi-heart-fill text-danger"
                  : "bi-heart"
              }`}
            ></i>
            {image.likes.length} Likes
          </button>
          <span>
            <i className="bi bi-bookmark me-1"></i>{" "}
            {image.saves?.length || 0} Saves
          </span>
        </div>

        {/* User Info */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/userprofile/${image.userId?._id}`)}
          >
            <img
              src={image.userId?.profile?.image || "/default-avatar.png"}
              alt={image.userId?.fullName || "User"}
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div>
              <h6 className="mb-0">{image.userId?.fullName || "Anonymous"}</h6>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-primary">+ Follow</button>
        </div>

        <hr className="my-4" />

        {/* Comments */}
        <div className="mb-4">
          <h6>Comments ({image.comments.length})</h6>
          <div className="mt-3">
            {image.comments.map((comment, index) => (
              <div key={index} className="mb-2 p-2 glass-effect rounded">
                <strong>
                  {comment.userId?.fullName || comment.user || "Anonymous"}
                </strong>
                : {comment.text}
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loadingComment}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loadingComment}
              >
                {loadingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Download */}
        <button
          className="btn btn-primary w-100 mt-3 rounded-pill"
          onClick={handleDownload}
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

ImageDetail.propTypes = {
  image: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpenGalleria: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default ImageDetail;
