// src/components/PostViewModal.jsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Smile, X } from 'lucide-react';

const PostViewModal = ({ post, onClose, currentUserId, onLike, onComment }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [saves, setSaves] = useState(post.saves || []);
  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(currentUserId);
  const hasMultipleMedia = post.media?.length > 1;

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const name = storedUser?.fullName || "you";

  // ✅ Fetch fresh post data from backend
  const refreshPostData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`https://social-media-nty4.onrender.com/api/posts/${post._id}`);
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

  // ✅ Handle Like Toggle (Instant + Refresh)
  const handleLike = async () => {
    if (!currentUserId) {
      alert('Please log in to like posts.');
      return;
    }

    // Optimistic UI update
    setLikes((prev) =>
      isLiked ? prev.filter((id) => id !== currentUserId) : [...prev, currentUserId]
    );

    try {
      const response = await fetch('https://social-media-nty4.onrender.com/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          postId: post._id,
          postOwnerId: post.userId?._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onLike?.(post._id);
        await refreshPostData(); // Refresh likes
      } else {
        console.error('Like failed:', data.message);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // ✅ Handle Save Toggle (Instant)
  const handleSaveToggle = async () => {
    if (!currentUserId) {
      alert('Please log in to save posts.');
      return;
    }

    // Optimistic update
    setSaves((prev) =>
      isSaved ? prev.filter((id) => id !== currentUserId) : [...prev, currentUserId]
    );

    try {
      const response = await fetch('https://social-media-nty4.onrender.com/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          postId: post._id,
          postOwnerId: post.userId?._id,
        }),
      });

      const data = await response.json();
      if (!data.success) console.error('Save toggle failed:', data.message);
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  // ✅ Handle Comment Submit (Instant + Refresh)
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;

    const newComment = {
      _id: `temp-${Date.now()}`,
      userId: { _id: currentUserId, fullName: name },
      text: commentText,
      isTemp: true,
    };

    // Optimistic UI
    setComments((prev) => [...prev, newComment]);
    setCommentText('');

    try {
      const response = await fetch('https://social-media-nty4.onrender.com/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          userId: currentUserId,
          text: newComment.text,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onComment?.(post._id, commentText);
        await refreshPostData(); // ✅ Refresh comments and likes after comment
      } else {
        console.error('Comment failed:', data.message);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // ✅ Media Navigation
  const nextMedia = () => {
    if (currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex((i) => i + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((i) => i - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] rounded-2xl shadow-2xl bg-white overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>

        {/* 👤 Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <img
            src={post.userId?.profile?.image || '/default-avatar.png'}
            alt={post.userId?.fullName || 'User'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-900">
            {post.userId?.fullName || 'Anonymous'}
          </span>
        </div>

        {/* 📸 Media Section */}
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
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {currentMediaIndex < post.media.length - 1 && (
                <button
                  onClick={nextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                >
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* 📝 Description */}
        <p className="px-4 py-3 text-gray-900 text-sm">
          {post.description || 'No description available.'}
        </p>

        {/* ❤️ Action Buttons */}
        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
          <div className="flex gap-4 items-center">
            <Heart
              className={`w-6 h-6 cursor-pointer transition ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-gray-900'
              }`}
              onClick={handleLike}
            />
            <MessageCircle
              className="w-6 h-6 text-gray-900 cursor-pointer"
              onClick={() => setShowComments(!showComments)}
            />
            <Send className="w-6 h-6 text-gray-900 cursor-pointer" />
          </div>
          <Bookmark
            className={`w-6 h-6 cursor-pointer transition ${
              isSaved ? 'text-blue-500 fill-blue-500' : 'text-gray-900'
            }`}
            onClick={handleSaveToggle}
          />
        </div>

        {/* 👍 Like Count */}
        <p className="px-4 pb-2 text-sm font-semibold text-gray-900">
          {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          {isRefreshing && <span className="ml-2 text-gray-400 text-xs">(updating...)</span>}
        </p>

        {/* 💬 Comments */}
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
  );
};

export default PostViewModal;
