import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Tabs, Tab, Image, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaUser, FaPalette } from "react-icons/fa";
import { useParams } from "react-router-dom";
import PostViewModal from "./PostViewModal"; // import your PostViewModal

const UserProfile = ({ currentUserId }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("uploads");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedPostsData, setSavedPostsData] = useState([]);
  const { id } = useParams();
  const userId = id;

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://social-media-nty4.onrender.com/api/profiles/${userId}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setIsFollowing(data.data.counts.followers.includes(currentUserId));
          fetchSavedPosts(data.data.savedPosts);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedPosts = async (savedPostsIds) => {
      try {
        const savedPostsDetails = await Promise.all(
          savedPostsIds.map(async (postId) => {
            const res = await fetch(`https://social-media-nty4.onrender.com/api/posts/${userId}/${postId}`);
            const data = await res.json();
            return data.success ? data.data : null;
          })
        );
        setSavedPostsData(savedPostsDetails.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [userId, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId) return alert("Login to follow");
    try {
      const res = await fetch(
        `https://social-media-nty4.onrender.com/api/profiles/${userId}/follow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setUser((prev) => ({
          ...prev,
          counts: {
            ...prev.counts,
            followers: !isFollowing
              ? prev.counts.followers + 1
              : prev.counts.followers - 1,
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = (postId) => {
    // Optional: integrate like API here
    console.log("Liked post:", postId);
  };

  const handleComment = (postId, text) => {
    // Optional: integrate comment API here
    console.log("Comment on post:", postId, text);
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  const userPosts = user.posts || [];

  return (
    <>
      <Container className="py-4">
        {/* Profile Header */}
        <Row className="align-items-center text-center text-md-start mb-4">
          <Col md="auto" className="mb-3 mb-md-0">
            <Image
              src={user.profile.image || "/default-avatar.png"}
              roundedCircle
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
              alt={user.fullName}
            />
          </Col>
          <Col>
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-2 justify-content-center justify-content-md-start">
              <h2 className="mb-0">{user.fullName}</h2>
              <Button
                variant={isFollowing ? "outline-secondary" : "primary"}
                size="sm"
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>

            <div className="d-flex gap-4 mb-2 justify-content-center justify-content-md-start">
              <div>
                <strong>{userPosts.length}</strong> posts
              </div>
              <div>
                <strong>{user.counts.followers}</strong> followers
              </div>
              <div>
                <strong>{user.counts.following}</strong> following
              </div>
            </div>

            {user.profile.about && <p className="mb-1">{user.profile.about}</p>}
            <p className="text-muted small">
              <FaUser className="me-1" /> Joined{" "}
              {new Date(user.createdAt).toLocaleDateString()} · <FaPalette className="ms-2 me-1" /> ★
            </p>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 justify-content-center"
        >
          <Tab eventKey="uploads" title="Posts" />
          <Tab eventKey="saved" title="Saved" />
        </Tabs>

        {/* User Posts Grid */}
        {activeTab === "uploads" && (
          <Row className="g-2">
            {userPosts.map((img) => (
              <Col key={img._id} xs={4} sm={4} md={3}>
                <Image
                  src={img.media?.[0]?.url}
                  alt={img.description}
                  style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", cursor: 'pointer' }}
                  onClick={() => setSelectedPost(img)}
                  className="rounded"
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Saved Posts Grid */}
        {activeTab === "saved" && (
          <Row className="g-2">
            {savedPostsData.map((post) => (
              <Col key={post._id} xs={4} sm={4} md={3}>
                <Image
                  src={post.media?.[0]?.url}
                  alt={post.description}
                  style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", cursor: 'pointer' }}
                  onClick={() => setSelectedPost(post)}
                  className="rounded"
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Post View Modal */}
      {selectedPost && (
        <PostViewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          currentUserId={currentUserId}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </>
  );
};

export default UserProfile;
