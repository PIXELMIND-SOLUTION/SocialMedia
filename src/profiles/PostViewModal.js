// src/components/PostViewModal.jsx
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Smile, X, Search, Share2, Link, Trash2 } from 'lucide-react';

const PostViewModal = ({ post, onClose, currentUserId, onLike, onComment, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [saves, setSaves] = useState(post.saves || []);
  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingTo, setSendingTo] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(currentUserId);
  const hasMultipleMedia = post.media?.length > 1;

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const name = storedUser?.fullName || "you";

  const postUrl = `${window.location.origin}/post/${post._id}`;

  // Refresh data
  const refreshPostData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`https://apisocial.atozkeysolution.com/api/posts/${post._id}`);
      const data = await res.json();
      if (data.success && data.post) {
        setLikes(data.post.likes || []);
        setComments(data.post.comments || []);
        setSaves(data.post.saves || []);
      }
    } catch (err) {
      console.error('Error refreshing post:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch followers
  const fetchFollowers = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(`https://apisocial.atozkeysolution.com/api/followers/${currentUserId}`);
      const data = await res.json();
      if (data.success) {
        const followerList = data.followers || [];
        setFollowers(followerList);
        setFilteredFollowers(followerList);
      }
    } catch (err) {
      console.error('Error fetching followers:', err);
    }
  };

  useEffect(() => {
    if (showShareModal) {
      fetchFollowers();
      setCopySuccess(false);
    }
  }, [showShareModal]);

  useEffect(() => {
    const results = followers.filter(f =>
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFollowers(results);
  }, [searchQuery, followers]);

  // Web Share
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.userId?.fullName || 'Someone'} shared a post`,
          text: post.description?.substring(0, 100) || 'Check out this post!',
          url: postUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Web Share failed:', err);
      }
    } else {
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link.');
    }
  };

  // Like
  const handleLike = async () => {
    if (!currentUserId) {
      alert('Please log in to like posts.');
      return;
    }

    setLikes(prev => (isLiked ? prev.filter(id => id !== currentUserId) : [...prev, currentUserId]));

    try {
      await fetch('https://apisocial.atozkeysolution.com/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          postId: post._id,
          postOwnerId: post.userId?._id,
        }),
      });

      await refreshPostData();
      onLike?.(post._id);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Save
  const handleSaveToggle = async () => {
    if (!currentUserId) {
      alert('Please log in to save posts.');
      return;
    }

    setSaves(prev => (isSaved ? prev.filter(id => id !== currentUserId) : [...prev, currentUserId]));

    try {
      await fetch('https://apisocial.atozkeysolution.com/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          postId: post._id,
          postOwnerId: post.userId?._id,
        }),
      });
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  // Comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;

    const newComment = {
      _id: `temp-${Date.now()}`,
      userId: { _id: currentUserId, fullName: name },
      text: commentText,
      isTemp: true,
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');

    try {
      await fetch('https://apisocial.atozkeysolution.com/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          userId: currentUserId,
          text: newComment.text,
        }),
      });

      await refreshPostData();
      onComment?.(post._id, commentText);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const nextMedia = () => {
    if (currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(i => i + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(i => i - 1);
    }
  };

  // 🔥 DELETE POST API INTEGRATION
  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://apisocial.atozkeysolution.com/api/deletepost/${post.userId._id}/${post._id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (data.success) {
        alert("Post deleted successfully!");
        onDelete?.(post._id); // optional callback
        window.location.reload(); // 🔥 refresh window
        onClose(); // close modal         
      } else {
        alert(data.message || "Failed to delete post.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <>
      {/* Main Post Modal */}
      <div
        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-3 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[500px] rounded-2xl shadow-2xl bg-white overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-1 right-3 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>

          {/* 🔥 Header with Delete Icon Added */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 relative">

            {post.userId?.profile?.image ? (
              <img
                src={post.userId.profile.image}
                alt={post.userId?.fullName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {post.userId?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            <span className="font-semibold text-gray-900">
              {post.userId?.fullName || 'Anonymous'}
            </span>

            {/* DELETE ICON - ONLY SHOW FOR POST OWNER */}
            {currentUserId === post.userId?._id && (
              <button
                onClick={handleDeletePost}
                className="ml-auto text-red-500 hover:text-red-700 mt-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

          </div>


          {/* ----------- REMAINING CODE UNCHANGED BELOW ----------- */}

          <div className="relative w-full bg-black">
            {post.media?.[currentMediaIndex]?.type === 'video' ? (
              <video
                src={post.media[currentMediaIndex].url}
                className="w-full object-contain"
                style={{ maxHeight: '500px' }}
                controls
                playsInline
              />
            ) : (
              <img
                src={post.media?.[currentMediaIndex]?.url || ''}
                alt={post.description || 'Post'}
                className="w-full object-contain"
                style={{ maxHeight: '500px' }}
              />
            )}

            {hasMultipleMedia && (
              <>
                {currentMediaIndex > 0 && (
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentMediaIndex < post.media.length - 1 && (
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>

          <p className="px-4 py-3 text-gray-900 text-sm">
            {post.description || 'No description available.'}
          </p>

          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
            <div className="flex gap-4 items-center">
              <Heart
                className={`w-6 h-6 cursor-pointer transition ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-900'}`}
                onClick={handleLike}
              />
              <MessageCircle
                className="w-6 h-6 text-gray-900 cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              />
            </div>
          </div>

          <p className="px-4 pb-2 text-sm font-semibold text-gray-900">
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            {isRefreshing && <span className="ml-2 text-gray-400 text-xs">(updating...)</span>}
          </p>

          {showComments && (
            <>
              <div className="px-4 pb-3 space-y-3 max-h-[300px] overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c._id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        {c.userId?.fullName || 'Anonymous'}
                      </div>
                      <div className="text-gray-700 text-sm">{c.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmitComment}
                className="flex items-center gap-2 px-4 py-3 border-t border-gray-200"
              >
                <Smile className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 outline-none focus:border-gray-300"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Post
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Share Modal (unchanged) */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ... share modal unchanged */}
          </div>
        </div>
      )}
    </>
  );
};

export default PostViewModal;
