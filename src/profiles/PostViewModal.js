import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Smile, X } from 'lucide-react';

const PostViewModal = ({ post, onClose, currentUserId, onLike, onComment }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [saves, setSaves] = useState(post.saves || []);
  const [commentText, setCommentText] = useState('');

  const isLiked = likes.includes(currentUserId);
  const isSaved = saves.includes(currentUserId);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setComments(prev => [...prev, { userId: { fullName: 'You' }, text: commentText, _id: Date.now() }]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-2 backdrop-blur-sm">
      {/* Modal Container with Glassmorphism */}
      <div className="post-column-container d-flex flex-column w-full max-w-[500px] bg-white border border-white/20 rounded-lg shadow-lg relative overflow-hidden">

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 z-10 p-1 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/70"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Top: Profile */}
        <div className="d-flex justify-content-between align-items-center p-3 border-b border-white/20">
          <div className="d-flex align-items-center gap-2 cursor-pointer">
            <img
              src={post.userId?.profile?.image || "/default-avatar.png"}
              alt={post.userId?.fullName}
              className="rounded-circle"
              width={40}
              height={40}
              style={{ objectFit: 'cover' }}
            />
            <span className="fw-bold text-black">{post.userId?.fullName || "Anonymous"}</span>
          </div>
        </div>

        {/* Media */}
        <div className="rounded overflow-hidden mb-3" style={{ maxHeight: '300px' }}>
          <img
            src={post.media?.[0]?.url || ""}
            alt={post.description || "Post"}
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Description */}
        <p className="fw-medium px-3 mb-2 text-black">{post.description || "No description"}</p>

        {/* Actions */}
        <div className="d-flex justify-content-between align-items-center px-3 mb-2">
          <div className="d-flex gap-3">
            <Heart
              className={`w-5 h-5 cursor-pointer ${isLiked ? 'text-red-500' : 'text-black'}`}
              onClick={() => onLike(post._id)}
            />
            <MessageCircle className="w-5 h-5 text-black" />
            <Send className="w-5 h-5 text-black" />
          </div>
          <Bookmark
            className={`w-5 h-5 cursor-pointer ${isSaved ? 'text-blue-400' : 'text-black'}`}
          />
        </div>
        <p className="px-3 mb-2 text-black">{likes.length} likes</p>

        {/* Comments */}
        <div className="flex-grow-1 overflow-auto px-3 mb-3" style={{ maxHeight: '200px' }}>
          {comments.map(c => (
            <div key={c._id} className="mb-2 p-2 bg-white/20 rounded text-black">
              <div className="fw-bold">{c.userId?.fullName || "Anonymous"}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleSubmitComment} className="d-flex gap-2 px-3 mb-3">
          <Smile className="w-5 h-5 text-black" />
          <input
            type="text"
            className="form-control form-control-sm flex-1 bg-white/20 text-black placeholder-white/70 border-none"
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" type="submit" disabled={!commentText.trim()}>Post</button>
        </form>

        {/* Download Button */}
        <button
          className="btn btn-primary w-full rounded-pill py-2 mb-3 px-3"
          onClick={() => {
            const url = post.media?.[0]?.url;
            if (!url) return;
            const a = document.createElement('a');
            a.href = url;
            a.download = `post-${post._id}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          Download Image
        </button>

      </div>
    </div>
  );
};

export default PostViewModal;
