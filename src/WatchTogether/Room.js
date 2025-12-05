import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// All icons remain the same
const IconVideo = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/>
    <path d="M8 12l6 4 6-4-6-4z"/>
  </svg>
);

const IconCopy = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

const IconChat = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
  </svg>
);

const IconInfo = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const IconFriends = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.99.69 3.03 2.5 3.03 4.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const IconClose = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const IconMenu = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const IconSend = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const IconMic = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const IconCamera = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98z"/>
  </svg>
);

const IconShare = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
    <path d="M9.41 15.95L12 13.36l2.59 2.59L16 14.54l-3-3-3 3z"/>
    <path d="M9.41 8.05L12 10.64l2.59-2.59L16 9.46l-3 3-3-3z"/>
  </svg>
);

const IconPlay = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const Room = () => {
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const [zegoInstance, setZegoInstance] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ZegoCloud credentials
  const APP_ID = 1150075754;
  const SERVER_SECRET = "42ab9a10016d337ea1e43007ceffcfdc";

  const videoContainerRef = useRef(null);

  // Initialize user data from location state or localStorage
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Get user data from location state or localStorage
    if (location.state?.userName) {
      setUserName(location.state.userName);
      if (location.state.roomId) {
        setRoomId(location.state.roomId);
      }
    } else {
      // Try to get from localStorage if user refreshes the page
      const savedUserName = localStorage.getItem('watchTogether_userName');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    }
    
    // Save userName to localStorage
    if (userName) {
      localStorage.setItem('watchTogether_userName', userName);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [location.state, userName]);

  // Initialize video call when component mounts
  useEffect(() => {
    if (roomId && userName) {
      setTimeout(() => {
        initZegoCloud();
      }, 100);
    }
  }, [roomId, userName]);

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
    if (!userName) {
      alert('Please enter your name first');
      navigate('/');
      return;
    }

    try {
      console.log('Initializing ZegoCloud...');
      setIsInitializing(true);
      setError('');

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

      const userID = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        showTextChat: false,
        showUserList: false,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        onJoinRoom: () => {
          console.log('✅ Joined room successfully');
          setIsInitializing(false);
          setZegoInstance(zp);
        },
        onLeaveRoom: () => {
          console.log('Left room');
          navigate('/watch');
        },
        onUserJoin: (users) => {
          console.log('User joined:', users);
        },
        onUserLeave: (users) => {
          console.log('User left:', users);
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
      setZegoInstance(null);
    }
  };

  const leaveRoom = () => {
    if (zegoInstance) {
      try {
        zegoInstance.destroy();
      } catch (e) {
        console.log('Error destroying Zego instance:', e);
      }
      setZegoInstance(null);
    }
    navigate('/watch');
  };

  useEffect(() => {
    return () => {
      if (zegoInstance) {
        try {
          zegoInstance.destroy();
        } catch (e) {
          console.log('Error cleaning up on unmount:', e);
        }
      }
    };
  }, [zegoInstance]);

  // Sub-components
  const SidebarTab = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title={label}
      >
        <Icon className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">{label}</span>
      </button>
    );
  };

  const RoomInfoContent = () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-1">Your Name</p>
        <p className="text-base font-medium text-gray-900 truncate">{userName}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Room Status</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${zegoInstance ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
          <span className="text-sm text-gray-900 truncate">
            {zegoInstance ? 'Video call active' : 'Chat/Share mode'}
          </span>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Invite Friends</p>
        <div className="space-y-2">
          <p className="text-xs text-gray-700">Share this Room ID:</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-100 p-2 rounded-lg font-mono text-xs sm:text-sm break-all text-gray-800">
              {roomId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied!');
              }}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors flex-shrink-0"
              title="Copy"
            >
              <IconCopy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FriendsContent = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <IconFriends className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-600 text-center mb-2">Participants will appear here</p>
      <p className="text-xs text-gray-500 text-center">
        Users in the video call will be displayed in the main video area
      </p>
    </div>
  );

  const ChatContent = () => (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <div className="space-y-3">
          <div className="text-center py-8">
            <IconChat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Say hello to start chatting!</p>
          </div>
        </div>
      </div>
      <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
          <button className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:opacity-90 text-white px-3 sm:px-4 py-2 rounded-lg transition-all flex-shrink-0">
            <IconSend className="w-5 h-5" />
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

  return (
    <div className="flex flex-col h-screen bg-[#202124] overflow-hidden">
      {/* Header - Responsive */}
      <header className="bg-white text-gray-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex justify-between items-center border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8E53] rounded-full flex items-center justify-center flex-shrink-0">
            <IconVideo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h2 className="text-sm sm:text-base md:text-lg font-medium truncate max-w-[100px] sm:max-w-none">
              Watch Together
            </h2>
            <code className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[#FF6B35] font-mono text-xs hidden sm:block truncate max-w-[120px] md:max-w-[200px]">
              {roomId}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isInitializing && (
            <div className="flex items-center gap-1 text-[#FF6B35]">
              <div className="w-3 h-3 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs hidden sm:inline">Initializing...</span>
            </div>
          )}

          {/* Mobile room ID copy button */}
          {isMobile && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied!');
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              title="Copy Room ID"
            >
              <IconCopy className="w-4 h-4" />
            </button>
          )}

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:hidden"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <IconClose className="w-4 h-4" />
            ) : (
              <IconMenu className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={leaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm active:scale-95"
          >
            {isMobile ? 'Leave' : 'Leave Room'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Video Container */}
        <div className="flex-1 flex flex-col p-1 sm:p-2 md:p-4 min-w-0">
          <div className="flex-1 bg-black rounded-lg sm:rounded-xl overflow-hidden relative shadow-lg">
            <div
              ref={videoContainerRef}
              className="w-full h-full"
            />

            {/* Loading/Error Overlay */}
            {(isInitializing || (!isInitializing && !zegoInstance)) && (
              <div className={`absolute inset-0 flex items-center justify-center ${isInitializing ? 'bg-black/95' : 'bg-black/80'}`}>
                <div className="text-center p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md">
                  {isInitializing ? (
                    <>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                        Setting Up Video Call
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base">
                        Please wait for initialization...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8E53] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <IconVideo className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                        Video Inactive
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                        {error
                          ? `Setup failed: ${error.substring(0, 50)}...`
                          : 'Video call failed to initialize. Chat and room sharing is still active.'
                        }
                      </p>
                      <button
                        onClick={() => initZegoCloud()}
                        className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:opacity-90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base active:scale-95"
                      >
                        Retry Video Setup
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Sidebar --- */}
        {/* Backdrop overlay for mobile */}
        {isSidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`
          fixed inset-y-0 right-0 z-30 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80
          bg-white text-gray-800
          transform transition-transform duration-300 ease-in-out
          sm:relative sm:flex sm:flex-col sm:translate-x-0 sm:shadow-lg
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full bg-white rounded-l-lg sm:rounded-lg overflow-hidden">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-[#FF6B35]/5 to-[#FF8E53]/5 sm:hidden">
              <h3 className="font-medium text-base">
                {activeTab === 'chat' ? 'Chat' : activeTab === 'info' ? 'Room Info' : 'Participants'}
              </h3>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="p-2 sm:p-3 border-b border-gray-200 flex gap-1 sm:gap-2">
              <SidebarTab id="chat" label="Chat" icon={IconChat} />
              <SidebarTab id="info" label="Info" icon={IconInfo} />
              <SidebarTab id="friends" label="Friends" icon={IconFriends} />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <div className={`h-full ${activeTab !== 'info' ? 'hidden' : ''}`}>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <IconInfo className="w-5 h-5 text-[#FF6B35]" /> 
                    <span className="hidden sm:inline">Room Information</span>
                    <span className="sm:hidden">Info</span>
                  </h3>
                  <RoomInfoContent />
                </div>
              </div>
              
              <div className={`h-full ${activeTab !== 'friends' ? 'hidden' : ''}`}>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <IconFriends className="w-5 h-5 text-[#FF6B35]" /> 
                    <span className="hidden sm:inline">Participants</span>
                    <span className="sm:hidden">Participants</span>
                  </h3>
                  <FriendsContent />
                </div>
              </div>
              
              <div className={`h-full flex flex-col ${activeTab !== 'chat' ? 'hidden' : ''}`}>
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h3 className="font-medium text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                    <IconChat className="w-5 h-5 text-[#FF6B35]" /> 
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

      {/* Mobile bottom navigation for quick access */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 p-2 sm:hidden">
          <div className="flex justify-around">
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setActiveTab('chat');
              }}
              className={`flex flex-col items-center p-2 ${activeTab === 'chat' ? 'text-[#FF6B35]' : 'text-gray-600'}`}
            >
              <IconChat className="w-6 h-6" />
              <span className="text-xs mt-1">Chat</span>
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setActiveTab('info');
              }}
              className={`flex flex-col items-center p-2 ${activeTab === 'info' ? 'text-[#FF6B35]' : 'text-gray-600'}`}
            >
              <IconInfo className="w-6 h-6" />
              <span className="text-xs mt-1">Info</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied!');
              }}
              className="flex flex-col items-center p-2 text-gray-600"
            >
              <IconCopy className="w-6 h-6" />
              <span className="text-xs mt-1">Copy ID</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;