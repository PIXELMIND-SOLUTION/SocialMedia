import React, { useState, useEffect } from 'react';
import { Grid, Bookmark, Film, Settings, Info, MessageCircle, Heart, ChevronLeft } from 'lucide-react';
import PostViewModal from './PostViewModal';
import AboutModal from './AboutModal';
import { useNavigate } from 'react-router-dom';
import FollowersFollowingModal from './FollowersFollowingModal';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [showAbout, setShowAbout] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState('followers');
  const [savedPostsData, setSavedPostsData] = useState([]);

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://social-media-nty4.onrender.com/api/profiles/${userId}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        // Fetch saved posts if available
        if (data.data.savedPosts && data.data.savedPosts.length > 0) {
          fetchSavedPosts(data.data.savedPosts);
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
          const res = await fetch(`https://social-media-nty4.onrender.com/api/posts/${userId}/${postId}`);
          const data = await res.json();
          return data.success ? data.data : null;
        })
      );
      setSavedPostsData(savedPostsDetails.filter(Boolean));
    } catch (err) {
      console.error('Error fetching saved posts:', err);
    }
  };

  const fetchPostDetails = async (postId) => {
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/posts/${userId}/${postId}`);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load profile data'}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const posts = activeTab === 'posts' ? profile.posts : savedPostsData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile */}
      <div className="lg:hidden sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronLeft 
              className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" 
              onClick={() => navigate(-1)}
            />
            <h1 className="text-lg font-semibold">{profile.profile.username}</h1>
          </div>
          <Settings 
            className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" 
            onClick={() => navigate('/settings')} 
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-10">
        {/* Profile Header */}
        <div className="mb-8 lg:mb-11">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-20 mb-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                  {profile.profile.image ? (
                    <img
                      src={profile.profile.image}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center text-white text-3xl sm:text-5xl lg:text-6xl font-bold">
                      {profile.profile.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-light text-gray-900">{profile.profile.username}</h1>
                <button 
                  className="px-5 py-1.5 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowAbout(true)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  <Info className="w-4 h-4" />
                  About
                </button>
                <Settings 
                  className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors" 
                  onClick={() => navigate('/settings')} 
                />
              </div>

              {/* Mobile Username */}
              <div className="lg:hidden text-center mb-4">
                <h1 className="text-xl sm:text-2xl font-light text-gray-900">{profile.profile.username}</h1>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-6 sm:gap-10 lg:gap-12 mb-5 text-sm sm:text-base">
                <div className="text-center lg:text-left">
                  <div className="font-semibold text-gray-900">{profile.posts.length}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">posts</div>
                </div>
                <div 
                  className="cursor-pointer hover:opacity-70 transition-opacity text-center lg:text-left"
                  onClick={() => {
                    setFollowModalTab('followers');
                    setShowFollowModal(true);
                  }}
                >
                  <div className="font-semibold text-gray-900">{profile.counts.followers}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">followers</div>
                </div>
                <div 
                  className="cursor-pointer hover:opacity-70 transition-opacity text-center lg:text-left"
                  onClick={() => {
                    setFollowModalTab('following');
                    setShowFollowModal(true);
                  }}
                >
                  <div className="font-semibold text-gray-900">{profile.counts.following}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">following</div>
                </div>
              </div>

              {/* Bio - Desktop */}
              <div className="hidden lg:block">
                <h2 className="font-semibold text-sm text-gray-900 mb-1">{profile.fullName}</h2>
                {profile.profile.about && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-1">{profile.profile.about}</p>
                )}
                {profile.profile.website && (
                  <a
                    href={profile.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium text-sm hover:underline inline-block"
                  >
                    {profile.profile.website}
                  </a>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-2 lg:hidden mt-5">
                <button 
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowAbout(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">About</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bio */}
          <div className="lg:hidden text-center px-2 sm:px-4">
            <h2 className="font-semibold text-sm text-gray-900 mb-1">{profile.fullName}</h2>
            {profile.profile.about && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-1">{profile.profile.about}</p>
            )}
            {profile.profile.website && (
              <a
                href={profile.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium text-sm hover:underline inline-block"
              >
                {profile.profile.website}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-300 -mx-4 sm:-mx-6 lg:mx-0">
          <div className="flex justify-center gap-12 sm:gap-16">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 py-3 sm:py-4 text-xs font-semibold tracking-widest transition-colors ${
                activeTab === 'posts'
                  ? 'border-t-2 border-black text-black -mt-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-3 h-3" />
              <span className="hidden sm:inline">POSTS</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3 sm:py-4 text-xs font-semibold tracking-widest transition-colors ${
                activeTab === 'saved'
                  ? 'border-t-2 border-black text-black -mt-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span className="hidden sm:inline">SAVED</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1 md:gap-3 lg:gap-7 mt-0.5 sm:mt-1 -mx-4 sm:-mx-6 lg:mx-0">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post)}
              className="aspect-square bg-gray-100 cursor-pointer relative group overflow-hidden"
            >
              {post.media[0]?.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={post.media[0].url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <Film className="absolute top-2 right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white drop-shadow-lg" />
                </div>
              ) : (
                <img
                  src={post.media[0]?.url}
                  alt={post.description}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Hover Overlay - Desktop Only */}
              <div className="hidden lg:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-8 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  <span className="font-semibold text-lg">{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span className="font-semibold text-lg">{post.comments?.length || 0}</span>
                </div>
              </div>

              {/* Multiple Media Indicator */}
              {post.media?.length > 1 && (
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3">
                  <div className="flex gap-1 bg-black/60 rounded-full px-1.5 py-1 backdrop-blur-sm">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400">
            {activeTab === 'posts' ? (
              <>
                <Grid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-xl sm:text-2xl font-light mb-2">No posts yet</p>
                <p className="text-sm text-gray-500">Share your first moment!</p>
              </>
            ) : (
              <>
                <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-xl sm:text-2xl font-light mb-2">No saved posts</p>
                <p className="text-sm text-gray-500">Save posts you like to see them here</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post View Modal */}
      {selectedPost && (
        <PostViewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          currentUserId={userId}
          onComment={handleComment}
        />
      )}

      {/* About Modal */}
      {showAbout && (
        <AboutModal
          profile={profile}
          onClose={() => setShowAbout(false)}
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

export default MyProfile;