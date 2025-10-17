import React, { useState, useEffect } from 'react';
import { Grid, Bookmark, Film, Heart, MessageCircle, UserPlus, UserCheck, Clock, MoreVertical } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PostViewModal from './PostViewModal';
import FollowersFollowingModal from './FollowersFollowingModal';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followRequestPending, setFollowRequestPending] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState('followers');
  const [savedPostsData, setSavedPostsData] = useState([]);

  const { id } = useParams();
  const userId = id;
  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = storedUser?.userId;
  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    fetchProfile();
    if (!isOwnProfile) {
      checkFollowStatus();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://social-media-nty4.onrender.com/api/profiles/${userId}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        if (data.data.savedPosts && data.data.savedPosts.length > 0) {
          fetchSavedPosts(data.data.savedPosts);
        } else {
          setSavedPostsData([]);
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async (savedPostsIds) => {
    try {
      const savedPostsDetails = await Promise.all(
        savedPostsIds.map(async (postId) => {
          try {
            const res = await fetch(`https://social-media-nty4.onrender.com/api/posts/user/${postId}`);
            const data = await res.json();
            console.log('Fetched saved post data:', data);
            
            if (data.success && data.data) {
              return data.data;
            }
            return null;
          } catch (err) {
            console.error(`Error fetching post ${postId}:`, err);
            return null;
          }
        })
      );
      
      // Filter out null values and set the saved posts
      const validSavedPosts = savedPostsDetails.filter(Boolean);
      setSavedPostsData(validSavedPosts);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setSavedPostsData([]);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/following/${currentUserId}`);
      const data = await response.json();

      if (data.success) {
        const followingIds = (data.following || []).map(u => u._id);
        setIsFollowing(followingIds.includes(userId));
      }

      // Check if request is pending
      const followersResponse = await fetch(`https://social-media-nty4.onrender.com/api/followers/${userId}`);
      const followersData = await followersResponse.json();
      
      if (followersData.success) {
        const pendingIds = (followersData.pendingRequests || []).map(u => u._id);
        setFollowRequestPending(pendingIds.includes(currentUserId));
      }
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      alert('Please login to follow users');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow logic - you may need to implement unfollow API
        setIsFollowing(false);
      } else {
        // Send follow request
        const response = await fetch(`https://social-media-nty4.onrender.com/api/send-request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            followerId: currentUserId
          })
        });

        const data = await response.json();

        if (data.success) {
          setFollowRequestPending(true);
          // Optionally refresh profile to update counts
          fetchProfile();
        }
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const fetchPostDetails = async (postId) => {
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/posts/${postId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedPost(data.data);
      }
    } catch (err) {
      console.error('Error loading post:', err);
    }
  };

  const handlePostClick = (post) => {
    fetchPostDetails(post._id);
  };

  const handleLike = async (postId) => {
    console.log('Like post:', postId);
  };

  const handleComment = async (postId, text) => {
    console.log('Comment on post:', postId, text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Profile not found'}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const posts = activeTab === 'posts' ? profile.posts : savedPostsData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile */}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{profile.profile.username}</h1>
        <MoreVertical className="w-6 h-6 cursor-pointer" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
        {/* Profile Header */}
        <div className="mb-11">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-20 mb-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-24 h-24 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                {profile.profile.image ? (
                  <img
                    src={profile.profile.image}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold">
                    {profile.profile.firstName?.[0] || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {/* Username and Actions - Desktop */}
              <div className="hidden lg:flex items-center gap-5 mb-6">
                <h1 className="text-xl font-light">{profile.profile.username}</h1>
                
                {!isOwnProfile && (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      disabled={followRequestPending}
                      className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                        isFollowing
                          ? 'bg-gray-200 text-black hover:bg-gray-300'
                          : followRequestPending
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing ? (
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Following
                        </span>
                      ) : followRequestPending ? (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Requested
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </span>
                      )}
                    </button>
                    <button className="px-6 py-1.5 bg-gray-200 text-black text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                      Message
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Username */}
              <div className="lg:hidden text-center mb-4">
                <h1 className="text-2xl font-light mb-2">{profile.profile.username}</h1>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 lg:gap-10 mb-5 text-base">
                <div>
                  <span className="font-semibold">{profile.posts.length}</span>
                  <span className="text-gray-700 ml-1">posts</span>
                </div>
                <div 
                  className="cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    setFollowModalTab('followers');
                    setShowFollowModal(true);
                  }}
                >
                  <span className="font-semibold">{profile.counts.followers}</span>
                  <span className="text-gray-700 ml-1">followers</span>
                </div>
                <div 
                  className="cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    setFollowModalTab('following');
                    setShowFollowModal(true);
                  }}
                >
                  <span className="font-semibold">{profile.counts.following}</span>
                  <span className="text-gray-700 ml-1">following</span>
                </div>
              </div>

              {/* Bio - Desktop */}
              <div className="hidden lg:block">
                <h2 className="font-semibold text-sm">{profile.fullName}</h2>
                {profile.profile.about && (
                  <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed">{profile.profile.about}</p>
                )}
                {profile.profile.website && (
                  <a
                    href={profile.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 font-semibold text-sm hover:underline inline-block mt-1"
                  >
                    {profile.profile.website}
                  </a>
                )}
              </div>

              {/* Mobile Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-2 lg:hidden mt-4">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followRequestPending}
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-black hover:bg-gray-300'
                        : followRequestPending
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : followRequestPending ? 'Requested' : 'Follow'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-200 text-black text-sm font-semibold rounded-lg hover:bg-gray-300">
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bio */}
          <div className="lg:hidden text-center px-4">
            <h2 className="font-semibold text-sm">{profile.fullName}</h2>
            {profile.profile.about && (
              <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed">{profile.profile.about}</p>
            )}
            {profile.profile.website && (
              <a
                href={profile.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 font-semibold text-sm hover:underline inline-block mt-1"
              >
                {profile.profile.website}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-300">
          <div className="flex justify-center gap-16">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest transition-colors ${
                activeTab === 'posts'
                  ? 'border-t-2 border-black text-black -mt-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-3 h-3" />
              POSTS
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest transition-colors ${
                activeTab === 'saved'
                  ? 'border-t-2 border-black text-black -mt-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              SAVED
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 lg:gap-7 mt-1">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post)}
              className="aspect-square bg-gray-100 cursor-pointer relative group overflow-hidden rounded-sm"
            >
              {post.media[0]?.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={post.media[0].url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <Film className="absolute top-2 right-2 w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-lg" />
                </div>
              ) : (
                <img
                  src={post.media[0]?.url}
                  alt={post.description}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Hover Overlay - Desktop Only */}
              <div className="hidden lg:flex absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-8 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  <span className="font-semibold text-lg">{post.likes.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span className="font-semibold text-lg">{post.comments.length}</span>
                </div>
              </div>

              {/* Multiple Media Indicator */}
              {post.media.length > 1 && (
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3">
                  <div className="flex gap-1 bg-black/50 rounded-full px-2 py-1">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Grid className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-2xl font-light">
              {activeTab === 'posts' ? 'No posts yet' : 'No saved posts'}
            </p>
          </div>
        )}
      </div>

      {/* Post View Modal */}
      {selectedPost && (
        <PostViewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          currentUserId={currentUserId}
          onComment={handleComment}
        />
      )}

      {/* Followers/Following Modal */}
      {showFollowModal && (
        <FollowersFollowingModal
          isOpen={showFollowModal}
          onClose={() => setShowFollowModal(false)}
          userId={userId}
          initialTab={followModalTab}
        />
      )}
    </div>
  );
};

export default UserProfile;