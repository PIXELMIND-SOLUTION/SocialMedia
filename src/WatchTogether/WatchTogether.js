import React, { useState, useEffect, useRef } from 'react';
import {
  FaCopy,
  FaUsers,
  FaComments,
  FaShareAlt,
  FaTimes,
  FaCheckCircle,
  FaSignOutAlt,
  FaPaperPlane,
  FaBell,
  FaVideo,
  FaMicrophone,
  FaDesktop,
  FaPhoneSlash,
  FaUserFriends
} from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';

// ZegoCloud SDK imports
import ZegoUIKitPrebuilt from '@zegocloud/zego-uikit-prebuilt';

const WatchTogether = () => {
  const [userName, setUserName] = useState('');
  const [showSetName, setShowSetName] = useState(true);

  // Meet States
  const [isInMeet, setIsInMeet] = useState(false);
  const [meetId, setMeetId] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Followers States
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSent, setInviteSent] = useState({});

  // Chat States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const API_BASE = 'https://apisocial.atozkeysolution.com/api';
  
  // ZegoCloud credentials (DUMMY CREDENTIALS - REPLACE IN PRODUCTION)
  const ZEGO_APP_ID = 1150075754; // Replace with your ZegoCloud App ID
  const ZEGO_SERVER_SECRET = '42ab9a10016d337ea1e43007ceffcfdc'; // Replace with your Server Secret

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = storedUser?.userId || 'user_' + Math.random().toString(36).substr(2, 9);

  // Video container ref
  const videoContainerRef = useRef(null);

  // Fetch followers
  const fetchFollowers = async () => {
    setLoadingFollowers(true);
    try {
      const response = await fetch(`${API_BASE}/followers/${currentUserId}`);
      const data = await response.json();

      if (data.success) {
        const allUsers = [
          ...(data.followers || []),
          ...(data.pendingRequests || [])
        ];
        setFollowers(allUsers);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      alert('Failed to load followers');
    } finally {
      setLoadingFollowers(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  // Initialize ZegoCloud
  const initZegoCloud = async () => {
    if (!videoContainerRef.current) return;

    try {
      const zp = ZegoUIKitPrebuilt.create({
        appID: ZEGO_APP_ID,
        serverSecret: ZEGO_SERVER_SECRET,
        userID: currentUserId,
        userName: userName,
        roomID: meetId,
      });

      zp.joinRoom({
        container: videoContainerRef.current,
        sharedLinks: [{
          name: 'Copy Link',
          url: `${window.location.origin}?meet=${meetId}`,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // Group video call
        },
        showPreJoinView: false,
        showScreenSharingButton: true, // Enable screen sharing
        showLeavingView: false,
        onLeaveRoom: () => {
          leaveMeet();
        },
        // Additional UI customizations
        showRoomTimer: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showCallEndButton: true,
        showRaiseHandButton: true,
        showChatButton: false, // We have our own chat
      });
      
      // Store instance for cleanup
      window.zegoInstance = zp;
    } catch (error) {
      console.error('ZegoCloud initialization error:', error);
      alert('Failed to initialize video call');
    }
  };

  // Create Meet
  const createMeet = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      // Generate random meet ID
      const newMeetId = 'meet_' + Math.random().toString(36).substr(2, 9);
      setMeetId(newMeetId);
      setIsInMeet(true);
      setShowSetName(false);
      setShowInviteModal(true);
    } catch (error) {
      console.error('Error creating meet:', error);
      alert('Failed to create meet');
    }
  };

  // Send invitation
  const sendInvitation = (followerId, followerName) => {
    setInviteSent(prev => ({
      ...prev,
      [followerId]: true
    }));

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'System',
      text: `📨 Invitation sent to ${followerName}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    }]);

    setTimeout(() => {
      setInviteSent(prev => ({
        ...prev,
        [followerId]: false
      }));
    }, 2000);
  };

  // Copy meet link
  const copyMeetLink = () => {
    const link = `${window.location.origin}?meet=${meetId}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Send chat message
  const sendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: userName,
        text: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isSystem: false
      }]);
      setMessage('');
    }
  };

  // Leave meet
  const leaveMeet = () => {
    setIsInMeet(false);
    setShowSetName(true);
    setMeetId('');
    setMessages([]);
    setShowInviteModal(false);
    setUserName('');
    
    // Clean up ZegoCloud instance
    if (window.zegoInstance) {
      window.zegoInstance.destroy();
      window.zegoInstance = null;
    }
  };

  // Initialize ZegoCloud when meetId is available
  useEffect(() => {
    if (isInMeet && meetId && videoContainerRef.current) {
      initZegoCloud();
    }
  }, [isInMeet, meetId]);

  // Pre-meet setup screen
  if (showSetName && !isInMeet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaUsers className="text-white w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Watch Together</h1>
              <p className="text-gray-600">Share screens, video call & chat with friends</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && createMeet()}
                />
              </div>

              <button
                onClick={createMeet}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <FaUsers size={20} />
                Start Watch Party
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main meet screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-orange-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
            <FaUsers className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Watch Together</h1>
            <p className="text-xs text-gray-500">{userName} • Meet ID: {meetId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyMeetLink}
            className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-colors"
            title="Copy meet link"
          >
            {copySuccess ? <FaCheckCircle size={18} /> : <FaCopy size={18} />}
            <span className="hidden sm:inline text-sm">{copySuccess ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaBell size={18} />
            <span className="hidden sm:inline text-sm">Invite</span>
          </button>

          <button
            onClick={leaveMeet}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaSignOutAlt size={18} />
            <span className="hidden sm:inline text-sm">Leave</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Video Container */}
        <div className="flex-1 flex flex-col gap-4">
          <div 
            ref={videoContainerRef}
            className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center"
          >
            {!isInMeet && (
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Initializing Video...</h2>
                <FiLoader size={24} className="text-orange-500 animate-spin mx-auto" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 bg-white rounded-2xl shadow-lg p-4">
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
              <FaVideo size={20} />
            </button>
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
              <FaMicrophone size={20} />
            </button>
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
              <FaDesktop size={20} />
            </button>
            <button
              onClick={leaveMeet}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
            >
              <FaPhoneSlash size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex flex-col gap-4">
          {/* Chat */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaComments size={18} className="text-blue-500" />
                Chat
              </h3>
              {messages.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {messages.length}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <FaComments size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-medium ${msg.isSystem ? 'text-gray-500' : 'text-gray-800'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className={`text-gray-700 ml-0 mt-1 p-2 rounded-lg ${msg.isSystem ? 'bg-yellow-50 text-gray-600' : 'bg-gray-50'}`}>
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Invite Friends</h3>
                <p className="text-sm text-gray-600 mt-1">Share your watch party with followers</p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Copy Link */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl">
              <p className="text-xs font-semibold text-gray-600 mb-2">📎 Share This Link</p>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <code className="flex-1 text-xs font-mono text-gray-700 truncate">
                  {window.location.origin}?meet={meetId}
                </code>
                <button
                  onClick={copyMeetLink}
                  className="flex-shrink-0 p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                >
                  {copySuccess ? (
                    <FaCheckCircle size={14} className="text-green-600" />
                  ) : (
                    <FaCopy size={14} className="text-orange-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Followers List */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUserFriends size={16} />
                Your Followers ({followers.length})
              </p>

              {loadingFollowers ? (
                <div className="flex items-center justify-center py-8">
                  <FiLoader size={24} className="text-orange-500 animate-spin" />
                </div>
              ) : followers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FaUserFriends size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No followers yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {followers.map((follower) => (
                    <div
                      key={follower._id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-amber-50 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {follower.fullName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {follower.fullName || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">@{follower._id.slice(0, 8)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => sendInvitation(follower._id, follower.fullName)}
                        disabled={inviteSent[follower._id]}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm flex-shrink-0 ${inviteSent[follower._id]
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                      >
                        {inviteSent[follower._id] ? '✓ Sent' : 'Invite'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchTogether;