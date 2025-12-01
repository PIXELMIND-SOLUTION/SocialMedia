import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

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
    console.log("Updated Likes:", image.likes || []);
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
        // Fetch following and followers data
        const [followingRes, followersRes] = await Promise.all([
          fetch(`${API_BASE}/following/${userId}`),
          fetch(`${API_BASE}/followers/${userId}`),
        ]);

        const followingData = await followingRes.json();
        const followersData = await followersRes.json();
        console.log("Following Data:", followingData);

        const followingList = followingData?.following || [];
        const followersList = followersData?.followers || [];
        const targetId = image.userId._id;

        console.log("Following List:", followingList);
        console.log("Followers List:", followersList);
        console.log("Target User ID:", targetId);

        // Check if already following
        const isFollowing = followingList.some(f => f._id === targetId);
        if (isFollowing) {
          setFollowStatus("following");
          return;
        }

        // Check if there's an outgoing request (user has sent request to target)
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

        // Check if there's an incoming request (target has sent request to user)
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

        // Check in followers list for pending status
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

  // ---------- LIKE / UNLIKE (TOGGLE) ----------
  const handleLike = async () => {
    if (!currentUserId) {
      alert("You must be logged in.");
      return;
    }

    try {
      setLoadingLike(true);

      // Check if already liked
      const isLiked = likes.some(like =>
        like._id === currentUserId ||
        like.userId === currentUserId ||
        like === currentUserId
      );

      console.log("Current likes:", likes);
      console.log("User ID:", currentUserId);
      console.log("Is liked:", isLiked);

      // Use the same endpoint for both like and unlike
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
      console.log("Like/Unlike Response:", data);

      if (data.success) {
        console.log(data.message || "Like updated successfully.");

        // Update likes based on backend response
        if (data.likes !== undefined) {
          setLikes(data.likes);
        } else if (data.likesCount !== undefined) {
          if (isLiked) {
            setLikes(prev => prev.filter(like =>
              like._id !== currentUserId &&
              like.userId !== currentUserId &&
              like !== currentUserId
            ));
          } else {
            setLikes(prev => [...prev, { _id: currentUserId, userId: currentUserId }]);
          }
        } else {
          if (isLiked) {
            setLikes(prev => prev.filter(like =>
              like._id !== currentUserId &&
              like.userId !== currentUserId &&
              like !== currentUserId
            ));
          } else {
            setLikes(prev => [...prev, { _id: currentUserId, userId: currentUserId }]);
          }
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
          // Unfollow
          endpoint = `${API_BASE}/unfollow`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "none";
          break;

        case "requested":
          // Cancel follow request
          endpoint = `${API_BASE}/cancel-request`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "none";
          break;

        case "incoming":
          // Accept follow request
          endpoint = `${API_BASE}/accept-request`;
          body = {
            requestId: currentUserId, // Current user accepting the request
            targetId: image.userId?._id, // The user who sent the request
          };
          expectedNewStatus = "following";
          break;

        case "none":
        default:
          // Send follow request
          endpoint = `${API_BASE}/send-request`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          expectedNewStatus = "requested";
          break;
      }

      console.log("Sending follow request to:", endpoint);
      console.log("Request body:", body);

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Follow response:", data);

      if (data.success) {
        setFollowStatus(expectedNewStatus);
        
        // Refresh all requests after follow action
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

  // ---------- ALTERNATIVE FOLLOW HANDLER USING SEPARATE ENDPOINTS ----------
  const handleFollowAlternative = async () => {
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
      let body = {};

      switch (followStatus) {
        case "following":
          endpoint = `${API_BASE}/unfollow`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          break;

        case "requested":
          endpoint = `${API_BASE}/requests/cancel`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          break;

        case "incoming":
          endpoint = `${API_BASE}/requests/accept`;
          body = {
            requestId: image.userId?._id, // The user who sent the request
            userId: currentUserId, // Current user accepting
          };
          break;

        case "none":
        default:
          endpoint = `${API_BASE}/follow`;
          body = {
            userId: image.userId?._id,
            followerId: currentUserId,
          };
          break;
      }

      console.log("Using alternative endpoint:", endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.success) {
        // Update follow status based on response
        if (endpoint.includes("unfollow") || endpoint.includes("cancel")) {
          setFollowStatus("none");
        } else if (endpoint.includes("accept")) {
          setFollowStatus("following");
        } else if (endpoint.includes("follow") || endpoint.includes("send-request")) {
          setFollowStatus("requested");
        }
        
        // Refresh requests
        const requestsRes = await fetch(`${API_BASE}/requests/all`);
        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setAllRequests(requestsData.allRequests || []);
        }
      } else {
        alert(data.message || "Failed to update follow status.");
      }
    } catch (error) {
      console.error("Error:", error);
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

  // ---------- DOWNLOAD ----------
  const handleDownload = () => {
    const url = image.media?.[0]?.url?.trim();
    if (!url) return alert("No media available.");
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

  // Get follow button text based on status
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

  // Get follow button class based on status
  const getFollowButtonClass = () => {
    switch (followStatus) {
      case "following":
        return "btn-outline-danger";
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

  if (!image) return null;

  const isLiked = likes.some(like =>
    like._id === currentUserId ||
    like.userId === currentUserId ||
    like === currentUserId
  );
  const isSaved = saves.includes(image._id);
  const mediaType = image.media?.[0]?.type;
  const mediaUrl = image.media?.[0]?.url?.trim();

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
        {mediaType?.includes("video") ? (
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
        className="btn btn-primary w-100 mt-3 rounded-pill py-2"
        onClick={handleDownload}
      >
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