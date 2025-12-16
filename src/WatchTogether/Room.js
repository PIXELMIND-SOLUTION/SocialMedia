import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// All icons remain the same
const IconVideo = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
    <path d="M8 12l6 4 6-4-6-4z" />
  </svg>
);

const IconCopy = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const IconChat = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
  </svg>
);

const IconInfo = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const IconFriends = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.99.69 3.03 2.5 3.03 4.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const IconClose = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IconMenu = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const IconSend = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const IconMic = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
);

const IconCamera = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98z" />
  </svg>
);

const IconShare = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
    <path d="M9.41 15.95L12 13.36l2.59 2.59L16 14.54l-3-3-3 3z" />
    <path d="M9.41 8.05L12 10.64l2.59-2.59L16 9.46l-3 3-3-3z" />
  </svg>
);

const IconPlay = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Custom hook for responsive design
const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Add debouncing to prevent excessive re-renders[citation:2]
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', debouncedResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return { windowWidth, isMobile, isTablet, isDesktop };
};

const Room = () => {
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const [zegoInstance, setZegoInstance] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Friends and Chat states
  const [friends, setFriends] = useState([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userId, setUserId] = useState('');

  // ZegoCloud credentials
  const APP_ID = 938850321;
  const SERVER_SECRET = "b27c8f8fcc265d4d3c3d6010e5d3af2c";

  const videoContainerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const zegoInstanceRef = useRef(null);
  const isJoiningRef = useRef(false);

  // Initialize user data from sessionStorage and location state
  useEffect(() => {
    // Get user from session
    const storedUser = JSON.parse(sessionStorage.getItem("userData"));

    // Resolve username priority:
    const resolvedName =
      location.state?.userName ||
      storedUser?.fullName ||
      localStorage.getItem('watchTogether_userName') ||
      "Guest";

    // Set the values
    setUserId(storedUser?.userId || "");
    setUserName(resolvedName);

    // Set roomId
    if (location.state?.roomId) {
      setRoomId(location.state.roomId);
    }

    // Save to localStorage
    localStorage.setItem('watchTogether_userName', resolvedName);

    return () => {
      // Clean up on unmount
      if (zegoInstanceRef.current) {
        try {
          zegoInstanceRef.current.destroy();
        } catch (e) {
          console.log('Error destroying Zego instance on unmount:', e);
        }
      }
    };
  }, [location.state]);

  useEffect(() => {
    if (!roomId || !userName || isJoiningRef.current) return;

    const initVideo = async () => {
      if (videoContainerRef.current && !zegoInstanceRef.current) {
        await initZegoCloud();
      }
    };

    initVideo();
  }, [roomId, userName]);

  // Fetch friends list when userId is available
  useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchFriends = async () => {
    if (!userId) return;

    setIsLoadingFriends(true);
    try {
      const response = await axios.get(`https://apisocial.atozkeysolution.com/api/chat/all/${userId}`);
      if (response.data.success) {
        // Filter out duplicate participants and get unique friends
        const friendsList = response.data.data.flatMap(chat =>
          chat.participants.filter(participant => participant._id !== userId)
        );

        // Remove duplicates by id
        const uniqueFriends = friendsList.filter((friend, index, self) =>
          index === self.findIndex(f => f._id === friend._id)
        );

        setFriends(uniqueFriends);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const sendInviteMessage = async (friendId, friendName) => {
    if (!userId || !friendId) return;

    try {
      // First, we need to find or create a chat with this friend
      const chatResponse = await axios.get(`https://apisocial.atozkeysolution.com/api/chat/all/${userId}`);
      if (chatResponse.data.success) {
        const existingChat = chatResponse.data.data.find(chat =>
          chat.participants.some(participant => participant._id === friendId)
        );

        let chatId = existingChat?._id;

        // If no existing chat, we might need to create one (API may handle this automatically)
        if (!chatId) {
          alert(`No existing chat found with ${friendName}. Please start a conversation first.`);
          return;
        }

        // Send the invite message
        const messageData = {
          chatId: chatId,
          senderId: userId,
          receiverId: friendId,
          type: "text",
          text: `${userName} is inviting you to join the video room! Room ID: ${roomId}\n\nJoin here: ${window.location.origin}/watch/${roomId}`
        };

        const messageResponse = await axios.post(
          'https://apisocial.atozkeysolution.com/api/messages/send',
          messageData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (messageResponse.data.success) {
          alert(`Invitation sent to ${friendName}!`);

          // Add this message to the local chat if it's the current chat
          if (currentChatId === chatId) {
            setChatMessages(prev => [...prev, {
              ...messageResponse.data.data,
              sender: { _id: userId, fullName: userName },
              receiver: { _id: friendId, fullName: friendName }
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    // For demo purposes, we'll simulate sending a message
    const newMsg = {
      _id: `temp_${Date.now()}`,
      text: newMessage,
      type: "text",
      sender: { _id: userId, fullName: userName },
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setChatMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const generateToken = (userID, userName, roomID) => {
    const effectiveTime = 3600;
    const payload = JSON.stringify({
      app_id: APP_ID,
      user_id: userID,
      room_id: roomID,
      privilege: {
        1: 1,
        2: 1
      },
      exp_time: Math.floor(Date.now() / 1000) + effectiveTime
    });

    return btoa(payload);
  };

  const initZegoCloud = async () => {
    if (!userName || isJoiningRef.current) {
      return;
    }

    try {
      console.log('Initializing ZegoCloud...');
      setIsInitializing(true);
      isJoiningRef.current = true;
      setError('');

      // Clean up previous instance if exists
      if (zegoInstanceRef.current) {
        try {
          zegoInstanceRef.current.destroy();
        } catch (e) {
          console.log('Error destroying previous Zego instance:', e);
        }
        zegoInstanceRef.current = null;
        setZegoInstance(null);
      }

      // Clear video container
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = '';
      }

      let ZegoUIKitPrebuilt;

      try {
        const module = await import('@zegocloud/zego-uikit-prebuilt');
        ZegoUIKitPrebuilt = module.default || module;
      } catch (importError) {
        console.log('Dynamic import failed, trying CDN global:', importError);
        if (window.ZegoUIKitPrebuilt) {
          ZegoUIKitPrebuilt = window.ZegoUIKitPrebuilt;
        } else {
          throw new Error('ZegoCloud SDK not found. Check package installation or CDN script tag.');
        }
      }

      if (!ZegoUIKitPrebuilt) {
        throw new Error('ZegoUIKitPrebuilt is not available');
      }

      const userID = userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentRoomId = roomId;

      let token;
      const userNameForToken = userName || 'Guest';

      if (ZegoUIKitPrebuilt.generateKitTokenForTest) {
        token = ZegoUIKitPrebuilt.generateKitTokenForTest(
          APP_ID,
          SERVER_SECRET,
          currentRoomId,
          userID,
          userNameForToken
        );
        console.log('Used generateKitTokenForTest');
      } else if (ZegoUIKitPrebuilt.ZegoUIKitPrebuilt && ZegoUIKitPrebuilt.ZegoUIKitPrebuilt.generateKitTokenForTest) {
        const Zego = ZegoUIKitPrebuilt.ZegoUIKitPrebuilt;
        token = Zego.generateKitTokenForTest(
          APP_ID,
          SERVER_SECRET,
          currentRoomId,
          userID,
          userNameForToken
        );
        console.log('Used ZegoUIKitPrebuilt.ZegoUIKitPrebuilt.generateKitTokenForTest');
      } else {
        token = generateToken(userID, userNameForToken, currentRoomId);
        console.log('Used manual token generation');
      }

      let zp;
      if (typeof ZegoUIKitPrebuilt.create === 'function') {
        zp = ZegoUIKitPrebuilt.create(token);
      } else if (ZegoUIKitPrebuilt.ZegoUIKitPrebuilt && typeof ZegoUIKitPrebuilt.ZegoUIKitPrebuilt.create === 'function') {
        zp = ZegoUIKitPrebuilt.ZegoUIKitPrebuilt.create(token);
      } else if (window.ZegoUIKitPrebuilt && typeof window.ZegoUIKitPrebuilt.create === 'function') {
        zp = window.ZegoUIKitPrebuilt.create(token);
      } else {
        throw new Error('Cannot find create method in ZegoUIKitPrebuilt');
      }

      if (!zp) {
        throw new Error('Failed to create Zego instance');
      }

      let attempts = 0;
      const maxAttempts = 50;
      while (!videoContainerRef.current && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!videoContainerRef.current) {
        throw new Error('Video container not found after waiting');
      }

      const roomConfig = {
        container: videoContainerRef.current,
        scenario: {
          mode: 1,
        },
        showPreJoinView: false,
        showRoomTimer: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showScreenSharingButton: true,
        showTextChat: true, // ✅ ENABLE ZEGOCLOUD GROUP CHAT
        showUserList: false,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        maxUsers: 50,
        layout: "Grid",
        videoResolutionList: [
          { resolution: 360, label: "SD" },
          { resolution: 720, label: "HD" }
        ],
        onJoinRoom: () => {
          console.log('✅ Joined room successfully');
          setIsInitializing(false);
          setIsReconnecting(false);
          isJoiningRef.current = false;
          setZegoInstance(zp);
          zegoInstanceRef.current = zp;
        },
        onLeaveRoom: () => {
          console.log('Left room');
          if (zegoInstanceRef.current) {
            zegoInstanceRef.current.destroy();
            zegoInstanceRef.current = null;
          }
          setZegoInstance(null);
          setParticipants([]);
        },
        onUserJoin: (users) => {
          console.log("User joined:", users);

          setParticipants((prev) => {
            // Add new users, avoid duplicates
            const updated = [...prev];
            users.forEach(u => {
              if (!updated.find(x => x.userID === u.userID)) {
                updated.push(u);
              }
            });
            return updated;
          });
        },

        onUserLeave: (users) => {
          console.log("User left:", users);

          setParticipants((prev) =>
            prev.filter(
              (p) => !users.some((u) => u.userID === p.userID)
            )
          );
        },
        onRoomStateUpdate: (state) => {
          console.log('Room state update:', state);
          if (state === 'DISCONNECTED' || state === 'ERROR') {
            setIsReconnecting(true);
            setTimeout(() => {
              if (zegoInstanceRef.current) {
                initZegoCloud();
              }
            }, 3000);
          }
        }
      };

      if (typeof zp.joinRoom === 'function') {
        await zp.joinRoom(roomConfig);
      } else if (typeof zp.join === 'function') {
        await zp.join(roomConfig);
      } else {
        throw new Error('Cannot find join method in Zego instance');
      }

    } catch (error) {
      console.error('❌ ZegoCloud initialization error:', error);
      setError(error.message);
      setIsInitializing(false);
      setIsReconnecting(false);
      isJoiningRef.current = false;
      setZegoInstance(null);
      zegoInstanceRef.current = null;

      // Retry after 5 seconds if it's a connection error
      if (error.message.includes('network') || error.message.includes('connection')) {
        setTimeout(() => {
          if (!zegoInstanceRef.current) {
            initZegoCloud();
          }
        }, 5000);
      }
    }
  };

  const leaveRoom = () => {
    if (zegoInstanceRef.current) {
      try {
        zegoInstanceRef.current.destroy();
      } catch (e) {
        console.log('Error destroying Zego instance:', e);
      }
      zegoInstanceRef.current = null;
      setZegoInstance(null);
    }
    navigate('/watch');
  };

  const reconnectVideo = () => {
    if (!isJoiningRef.current) {
      initZegoCloud();
    }
  };

  // Handle input change properly - FIX for single character issue[citation:4]
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  // Handle key press for Enter key[citation:4]
  const handleKeyPress = (e) => {
    // Use key instead of keyCode for better compatibility[citation:4]
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission behavior
      sendChatMessage();
    }
  };

  // Sub-components
  const SidebarTab = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
          : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100'
          }`}
        title={label}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="ml-2 hidden sm:inline font-medium">{label}</span>
      </button>
    );
  };

  const RoomInfoContent = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <p className="text-sm text-orange-600 mb-1 font-medium">Your Name</p>
        <p className="text-base font-semibold text-gray-900 truncate bg-orange-50 p-3 rounded-lg border border-orange-100">
          {userName}
        </p>
      </div>
      <div>
        <p className="text-sm text-orange-600 mb-1 font-medium">Room Status</p>
        <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
          <div className={`w-3 h-3 rounded-full ${zegoInstance ? 'bg-green-500 animate-pulse ring-2 ring-green-200' : 'bg-amber-500 ring-2 ring-amber-200'}`}></div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {zegoInstance ? `Video call active (${participants.length + 1} users)` : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Participants list */}
      <div>
        <p className="text-sm text-orange-600 mb-2 font-medium">Participants</p>

        {participants.length === 0 ? (
          <p className="text-xs text-gray-500 bg-orange-50 p-2 rounded-lg">
            No other users yet
          </p>
        ) : (
          <div className="space-y-1">
            {participants.map((u) => (
              <div key={u.userID} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-orange-100">
                <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center font-bold">
                  {u.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {u.userName || u.userID}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>


      {isReconnecting && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-amber-700 font-medium">Reconnecting video...</p>
          </div>
          <button
            onClick={reconnectVideo}
            className="mt-2 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all w-full"
          >
            Reconnect Now
          </button>
        </div>
      )}
      <div className="pt-4 border-t border-orange-200">
        <p className="text-sm text-orange-600 mb-2 font-medium">Invite Friends</p>
        <div className="space-y-2">
          <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded-lg">Share this Room ID:</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg font-mono text-xs sm:text-sm break-all text-orange-800 border border-orange-200">
              {roomId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied!');
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 active:scale-95"
              title="Copy"
            >
              <IconCopy className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FriendsContent = () => (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <IconFriends className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="hidden sm:inline">Friends ({friends.length})</span>
            <span className="sm:hidden">Friends ({friends.length})</span>
          </div>
          <button
            onClick={fetchFriends}
            className="text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:opacity-90 transition-all"
            disabled={isLoadingFriends}
          >
            {isLoadingFriends ? 'Loading...' : 'Refresh'}
          </button>
        </h3>
      </div>

      <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gradient-to-b from-orange-50/50 to-transparent">
        {isLoadingFriends ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading friends...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full flex items-center justify-center mb-4">
              <IconFriends className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
            </div>
            <p className="text-gray-600 text-center mb-2 font-medium text-sm sm:text-base">No friends found</p>
            <p className="text-xs text-orange-600 text-center bg-orange-50 p-3 rounded-lg">
              Start chatting with people to add them here
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-xl border border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  {friend.fullName?.charAt(0) || friend.profile?.username?.charAt(0) || 'F'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {friend.fullName || friend.profile?.username || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{friend.profile?.username || 'No username'}
                  </p>
                </div>
                <button
                  onClick={() => sendInviteMessage(friend._id, friend.fullName || friend.profile?.username)}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 whitespace-nowrap"
                  title="Invite to room"
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ChatContent = () => (
    <div className="flex-1 flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gradient-to-b from-orange-50/50 to-transparent"
      >
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconChat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg inline-block">
              Say hello to start chatting!
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.sender?._id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2 sm:p-3 ${msg.sender?._id === userId
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none'
                    : 'bg-orange-100 text-gray-900 rounded-bl-none border border-orange-200'}`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.sender?._id === userId ? 'text-white/80' : 'text-gray-600'}`}>
                      {msg.sender?._id === userId ? 'You' : msg.sender?.fullName || 'Unknown'}
                    </span>
                    <span className={`text-xs ${msg.sender?._id === userId ? 'text-white/60' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm break-words">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-2 sm:p-4 border-t border-orange-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange} // ✅ FIXED: Using proper onChange handler
            onKeyDown={handleKeyPress} // ✅ FIXED: Using onKeyDown instead of onKeyPress[citation:4]
            placeholder="Type a message..."
            className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
          />
          <button
            onClick={sendChatMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <IconSend className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Redirect to join page if no roomId
  if (!roomId) {
    navigate('/');
    return null;
  }

  // Determine sidebar width based on device
  const getSidebarWidth = () => {
    if (isMobile) return 'w-full max-w-xs';
    if (isTablet) return 'w-80';
    return 'w-96';
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Header - Responsive */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-between items-center shadow-lg relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
            <IconVideo className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 md:gap-3">
            <h2 className="text-xs sm:text-sm md:text-lg font-bold truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
              Watch Together
            </h2>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-lg">
              <span className="text-xs font-medium">ID:</span>
              <code className="font-mono text-xs font-bold truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px]">
                {roomId}
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {isInitializing && (
            <div className="flex items-center gap-1 sm:gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
              <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium hidden sm:inline">Initializing...</span>
            </div>
          )}

          {isReconnecting && (
            <div className="flex items-center gap-1 sm:gap-2 text-amber-200 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium hidden sm:inline">Reconnecting...</span>
            </div>
          )}

          {/* Mobile room ID copy button */}
          {isMobile && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied!');
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
              title="Copy Room ID"
            >
              <IconCopy className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm sm:hidden transition-all"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <IconClose className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <IconMenu className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>

          <button
            onClick={leaveRoom}
            className="bg-white text-orange-600 hover:bg-orange-50 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95"
          >
            {isMobile ? 'Leave' : 'Leave Room'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden relative p-2 sm:p-3 md:p-4">
        {/* Video Container */}
        <div className="flex-1 flex flex-col min-w-0 mr-0 sm:mr-4">
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl overflow-hidden relative shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white">
            <div
              ref={videoContainerRef}
              className="w-full h-full"
            />

            {/* Loading/Error Overlay */}
            {(isInitializing || (!zegoInstance && !isReconnecting)) && (
              <div className={`absolute inset-0 flex items-center justify-center ${isInitializing ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-900/95 to-black/95'}`}>
                <div className="text-center p-3 sm:p-4 md:p-6 lg:p-8 max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-b from-orange-50/10 to-transparent backdrop-blur-sm rounded-xl sm:rounded-2xl border border-orange-500/20">
                  {isInitializing ? (
                    <>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-3 sm:border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6 shadow-lg shadow-orange-500/25"></div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        Setting Up Video Call
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                        Please wait for initialization...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-orange-500/50">
                        <IconVideo className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        {isReconnecting ? 'Reconnecting...' : 'Video Inactive'}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                        {error
                          ? `Setup failed: ${error.substring(0, 50)}...`
                          : isReconnecting
                            ? 'Attempting to reconnect video...'
                            : 'Video call failed to initialize. Chat and room sharing is still active.'
                        }
                      </p>
                      <button
                        onClick={reconnectVideo}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                      >
                        {isReconnecting ? 'Reconnect Now' : 'Retry Video Setup'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Participants counter */}
          {zegoInstance && (
            <div className="mt-2 flex items-center justify-center">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Active: {participants.length + 1}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Sidebar --- */}
        {/* Backdrop overlay for mobile */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-gradient-to-br from-orange-900/40 to-amber-900/40 backdrop-blur-sm z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`
          fixed inset-y-0 right-0 z-30 ${getSidebarWidth()}
          bg-gradient-to-b from-white to-orange-50 text-gray-800
          transform transition-transform duration-300 ease-in-out
          sm:relative sm:flex sm:flex-col sm:translate-x-0 shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          border-l border-orange-200
        `}>
          <div className="flex flex-col h-full bg-white rounded-l-xl sm:rounded-xl overflow-hidden border border-orange-200">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 text-white sm:hidden">
              <h3 className="font-bold text-base sm:text-lg">
                {activeTab === 'chat' ? 'Live Chat' : activeTab === 'info' ? 'Room Info' : 'Participants'}
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <IconClose className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="p-2 sm:p-3 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 flex gap-1 sm:gap-2">
              <SidebarTab id="chat" label="Chat" icon={IconChat} />
              <SidebarTab id="info" label="Info" icon={IconInfo} />
              <SidebarTab id="friends" label="Friends" icon={IconFriends} />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <div className={`h-full ${activeTab !== 'info' ? 'hidden' : ''}`}>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <IconInfo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="hidden sm:inline">Room Information</span>
                    <span className="sm:hidden">Info</span>
                  </h3>
                  <RoomInfoContent />
                </div>
              </div>

              <div className={`h-full ${activeTab !== 'friends' ? 'hidden' : ''}`}>
                <FriendsContent />
              </div>

              <div className={`h-full flex flex-col ${activeTab !== 'chat' ? 'hidden' : ''}`}>
                <div className="p-3 sm:p-4 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <IconChat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="hidden sm:inline">Live Chat</span>
                    <span className="sm:hidden">Chat</span>
                  </h3>
                </div>
                <ChatContent />
              </div>
            </div>
          </div>
        </div>
      </main>      
    </div>
  );
};

export default Room;