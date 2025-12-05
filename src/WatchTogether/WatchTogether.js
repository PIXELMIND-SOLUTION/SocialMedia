import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons remain the same as before
const IconVideo = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
    <path d="M8 12l6 4 6-4-6-4z" />
  </svg>
);

const WatchTogether = () => {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);

    // Generate room ID if not provided
    const finalRoomId =
      roomId.trim() ||
      `atoz_${Math.floor(100000 + Math.random() * 900000)}`;


    // Navigate to room with user data
    navigate(`/watch/${finalRoomId}`, {
      state: {
        userName,
        roomId: finalRoomId
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#202124] p-4">
      <div className="bg-white text-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-md shadow-lg mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8E53] rounded-full flex items-center justify-center mx-auto mb-4">
            <IconVideo className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
            Watch Together
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Watch videos with friends in real-time</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 text-sm sm:text-base"
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Room ID (Optional)</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 text-sm sm:text-base"
              placeholder="Leave empty to create new room"
              disabled={isLoading}
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {roomId ? 'Join existing room' : 'New room will be created'}
            </p>
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isLoading || !userName.trim()}
            className={`w-full p-3 sm:p-3.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base ${isLoading || !userName.trim()
                ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white hover:shadow-lg active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <IconVideo className="w-4 h-4 sm:w-5 sm:h-5" />
                {roomId ? 'Join Room' : 'Create Room'}
              </>
            )}
          </button>

          <div className="text-center text-gray-500 text-xs sm:text-sm pt-4 border-t border-gray-200">
            <p>🎥 Video calls • 🎮 Screen sharing • 💬 Live chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchTogether;