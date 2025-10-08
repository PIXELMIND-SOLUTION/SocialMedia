import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Users, MessageCircle, Play, Pause, Volume2, VolumeX, Share2, UserPlus, Send, CheckCircle, Monitor, MonitorOff } from 'lucide-react';

const WatchTogether = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState('');
  const [currentMeetId, setCurrentMeetId] = useState(null);
  const [meetData, setMeetData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  
  const API_BASE = 'https://social-media-nty4.onrender.com/api';
  const CURRENT_USER_ID = '68bc03a1aff2b0d7a66aedd1';
  
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
    
    return () => {
      stopScreenSharing();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (currentMeetId) {
      const interval = setInterval(() => {
        fetchMeetDetails(currentMeetId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentMeetId]);

  const initializeWebSocket = (meetId) => {
    const channel = new BroadcastChannel(`meet-${meetId}`);
    
    channel.onmessage = async (event) => {
      const { type, data, from } = event.data;
      
      if (from === CURRENT_USER_ID) return;
      
      switch (type) {
        case 'offer':
          await handleOffer(data, from);
          break;
        case 'answer':
          await handleAnswer(data, from);
          break;
        case 'ice-candidate':
          await handleIceCandidate(data, from);
          break;
        case 'viewer-joined':
          if (isHost && localStream) {
            await createOffer(from);
          }
          break;
        default:
          break;
      }
    };
    
    wsRef.current = channel;
    return channel;
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch(`${API_BASE}/followers/${CURRENT_USER_ID}`);
      const data = await response.json();
      if (data.success) {
        setFollowers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await fetch(`${API_BASE}/following/${CURRENT_USER_ID}`);
      const data = await response.json();
      if (data.success) {
        setFollowing(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const createMeet = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/video-meet/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Watch Together Party',
          host: CURRENT_USER_ID
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentMeetId(data.data._id);
        setMeetData(data.data);
        setIsHost(true);
        setShowInviteModal(false);
        
        initializeWebSocket(data.data._id);
        
        await startScreenSharing();
      }
    } catch (error) {
      console.error('Error creating meet:', error);
      alert('Failed to create meet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinMeet = async (meetId) => {
    try {
      setCurrentMeetId(meetId);
      setIsHost(false);
      
      const response = await fetch(`${API_BASE}/video-meet/${meetId}`);
      const data = await response.json();
      
      if (data.success) {
        setMeetData(data.data);
        
        const ws = initializeWebSocket(meetId);
        
        await addParticipant(CURRENT_USER_ID);
        
        ws.postMessage({
          type: 'viewer-joined',
          from: CURRENT_USER_ID
        });
        
        setShowInviteModal(false);
      }
    } catch (error) {
      console.error('Error joining meet:', error);
      alert('Failed to join meet. Please try again.');
    }
  };

  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: true
      });
      
      setLocalStream(stream);
      setIsScreenSharing(true);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      stream.getVideoTracks()[0].onended = () => {
        stopScreenSharing();
      };
      
      participants.forEach(participant => {
        if (participant._id !== CURRENT_USER_ID) {
          createOffer(participant._id);
        }
      });
      
    } catch (error) {
      console.error('Error starting screen share:', error);
      alert('Failed to start screen sharing. Please allow screen sharing permission.');
      setIsScreenSharing(false);
    }
  };

  const stopScreenSharing = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    Object.values(peerConnections).forEach(pc => pc.close());
    setPeerConnections({});
    
    setIsScreenSharing(false);
  };

  const createOffer = async (targetUserId) => {
    try {
      const peerConnection = new RTCPeerConnection(rtcConfig);
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.postMessage({
            type: 'ice-candidate',
            data: event.candidate,
            from: CURRENT_USER_ID,
            to: targetUserId
          });
        }
      };
      
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      if (wsRef.current) {
        wsRef.current.postMessage({
          type: 'offer',
          data: offer,
          from: CURRENT_USER_ID,
          to: targetUserId
        });
      }
      
      setPeerConnections(prev => ({
        ...prev,
        [targetUserId]: peerConnection
      }));
      
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (offer, fromUserId) => {
    try {
      const peerConnection = new RTCPeerConnection(rtcConfig);
      
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setIsScreenSharing(true);
      };
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.postMessage({
            type: 'ice-candidate',
            data: event.candidate,
            from: CURRENT_USER_ID,
            to: fromUserId
          });
        }
      };
      
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      if (wsRef.current) {
        wsRef.current.postMessage({
          type: 'answer',
          data: answer,
          from: CURRENT_USER_ID,
          to: fromUserId
        });
      }
      
      setPeerConnections(prev => ({
        ...prev,
        [fromUserId]: peerConnection
      }));
      
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer, fromUserId) => {
    try {
      const peerConnection = peerConnections[fromUserId];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate, fromUserId) => {
    try {
      const peerConnection = peerConnections[fromUserId];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const fetchMeetDetails = async (meetId) => {
    try {
      const response = await fetch(`${API_BASE}/video-meet/${meetId}`);
      const data = await response.json();
      if (data.success) {
        setMeetData(data.data);
        setParticipants(data.data.participants || []);
        setMessages(data.data.chat || []);
      }
    } catch (error) {
      console.error('Error fetching meet details:', error);
    }
  };

  const addParticipant = async (userId) => {
    if (!currentMeetId) return;
    
    try {
      const response = await fetch(`${API_BASE}/meet/${currentMeetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addParticipant: userId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchMeetDetails(currentMeetId);
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!message.trim() || !currentMeetId) return;
    
    try {
      const response = await fetch(`${API_BASE}/chat/${currentMeetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: CURRENT_USER_ID,
          message: message.trim()
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('');
        fetchMeetDetails(currentMeetId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const copyInviteLink = () => {
    const link = meetData?.meetLink || currentMeetId || 'Testwebsite/watchtogether.com';
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const endWatchParty = () => {
    stopScreenSharing();
    setIsScreenSharing(false);
    setCurrentMeetId(null);
    setMeetData(null);
    setParticipants([]);
    setMessages([]);
    setIsHost(false);
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (isHost && localVideoRef.current) {
      if (isVideoPlaying) {
        localVideoRef.current.pause();
      } else {
        localVideoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    const videoElement = isHost ? localVideoRef.current : remoteVideoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const allUsers = [...new Map([...followers, ...following].map(user => [user._id, user])).values()];
  
  const displayParticipants = participants.length > 0 
    ? participants.map(p => ({
        id: p._id || p,
        name: p.username || p.name || 'User',
        avatar: p.profilePicture || '/api/placeholder/40/40',
        isMuted: false,
        isHost: p._id === CURRENT_USER_ID || p === CURRENT_USER_ID
      }))
    : [{
        id: CURRENT_USER_ID,
        name: 'You',
        avatar: '/api/placeholder/40/40',
        isMuted: false,
        isHost: true
      }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
          
          <div className="lg:col-span-3 relative">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              
              <div className="relative h-5/6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {isScreenSharing ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={isHost ? localVideoRef : remoteVideoRef}
                      autoPlay
                      playsInline
                      muted={isHost ? true : isMuted}
                      className="w-full h-full object-contain"
                    />
                    
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-4 shadow-lg max-w-sm w-full mx-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Monitor className="text-green-600 w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {isHost ? 'You are sharing your screen' : 'Viewing shared screen'}
                          </p>
                          <p className="text-gray-600 text-sm">{displayParticipants.length} participant(s)</p>
                        </div>
                      </div>
                      {isHost && (
                        <button 
                          onClick={endWatchParty}
                          className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <MonitorOff size={18} />
                          Stop Sharing & End Party
                        </button>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 rounded-full px-6 py-3 flex items-center gap-6">
                      {isHost && (
                        <button 
                          onClick={togglePlayPause}
                          className="text-white hover:text-orange-400 transition-colors"
                          title="Play/Pause"
                        >
                          {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                      )}
                      <button 
                        onClick={toggleMute}
                        className="text-white hover:text-orange-400 transition-colors"
                        title="Mute/Unmute"
                      >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                      <div className="h-6 w-px bg-gray-500"></div>
                      <div className="text-white text-sm font-medium">
                        {isHost ? 'Host' : 'Viewer'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Monitor className="text-white w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Watch Together</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                          Share your screen with friends or join an existing watch party
                        </p>
                        
                        <button 
                          onClick={() => {
                            setShowInviteModal(true);
                            setIsHost(true);
                          }}
                          disabled={loading}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 mb-3"
                        >
                          {loading ? 'Creating...' : "Start Watch Party"}
                        </button>
                        
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const meetId = prompt('Enter the meeting ID or paste the meeting link:');
                            if (meetId) {
                              const id = meetId.includes('/') ? meetId.split('/').pop() : meetId;
                              joinMeet(id);
                            }
                          }}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          Join Existing Party
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="h-1/6 bg-white p-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowPeopleModal(true)}
                    className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Users size={18} />
                    <span className="font-medium">People</span>
                    {displayParticipants.length > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {displayParticipants.length}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span className="font-medium">Messages</span>
                    {messages.length > 0 && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {messages.length}
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  {meetData?.meetLink && (
                    <button 
                      onClick={copyInviteLink}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                      <span className="font-medium hidden sm:inline">{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 h-full">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={18} className="text-orange-500" />
                Participants ({displayParticipants.length})
              </h3>
              
              <div className="space-y-3 mb-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {displayParticipants.map((participant, index) => (
                  <div key={participant.id || index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{participant.name}</p>
                      {participant.isHost && (
                        <p className="text-xs text-orange-500">Host</p>
                      )}
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowPeopleModal(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPeopleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">People</h3>
              <button 
                onClick={() => setShowPeopleModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            
            {(meetData?.meetLink || currentMeetId) && (
              <div className="mb-4">
                <p className="text-orange-600 font-medium mb-2">Share this link to invite friends!</p>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 text-sm flex-1 truncate">
                    {meetData?.meetLink || `Meeting ID: ${currentMeetId}`}
                  </span>
                  <button 
                    onClick={copyInviteLink}
                    className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {copySuccess ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} className="text-orange-600" />}
                  </button>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-3">In the Watch Party</p>
              <div className="space-y-2">
                {displayParticipants.map((participant, index) => (
                  <div key={participant.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{participant.name}</p>
                        {participant.isHost && (
                          <p className="text-xs text-orange-500">Host</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentMeetId && allUsers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Invite from your network</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{user.username || user.name}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => addParticipant(user._id)}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">In Room Messages</h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.sender === CURRENT_USER_ID || msg.sender?._id === CURRENT_USER_ID;
                  const senderName = isOwn ? 'You' : (msg.sender?.username || msg.sender?.name || 'User');
                  
                  return (
                    <div key={msg._id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs ${isOwn ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-2xl`}>
                        {!isOwn && (
                          <p className="text-xs font-medium mb-1 opacity-75">{senderName}</p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                disabled={!currentMeetId}
              />
              <button 
                onClick={sendChatMessage}
                disabled={!currentMeetId || !message.trim()}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Watch Party</h3>
              <p className="text-gray-600 mb-6">Start a watch party and share your screen with friends</p>
              
              <button 
                onClick={createMeet}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 mb-3"
              >
                {loading ? 'Creating Party...' : 'Create & Share Screen'}
              </button>
              
              <button 
                onClick={() => setShowInviteModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchTogether;