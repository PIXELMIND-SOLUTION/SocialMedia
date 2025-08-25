import React, { useState } from 'react';
import { X, Copy, Users, MessageCircle, Play, Pause, Volume2, VolumeX, Share2, UserPlus } from 'lucide-react';

const WatchTogether = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState('');
  
  const participants = [
    { id: 1, name: 'Mary', avatar: '/api/placeholder/40/40', isMuted: false },
    { id: 2, name: 'Pawan', avatar: '/api/placeholder/40/40', isMuted: false },
    { id: 3, name: 'Nancy', avatar: '/api/placeholder/40/40', isMuted: false },
    { id: 4, name: 'You', avatar: '/api/placeholder/40/40', isMuted: false, isHost: true }
  ];

  const messages = [
    { id: 1, sender: 'You', message: 'Hi Guys How Are You?', time: '09:25 AM', isOwn: true },
    { id: 2, sender: 'Alex Linderson', message: 'Yeah i\'m fine!', time: '09:25 AM', isOwn: false }
  ];

  const inviteLink = 'Testwebsite/watchtogether.com';

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // Add toast notification here if needed
  };

  const startScreenShare = () => {
    setIsScreenSharing(true);
    setShowInviteModal(false);
  };

  const stopScreenShare = () => {
    setIsScreenSharing(false);
  };

  const sendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
          
          {/* Video Area */}
          <div className="lg:col-span-3 relative">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              
              {/* Video Content */}
              <div className="relative h-5/6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {isScreenSharing ? (
                  /* One Piece Anime Content */
                  <div className="w-full h-full bg-cover bg-center relative" 
                       style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23ff6b35\'/%3E%3Ctext x=\'400\' y=\'300\' text-anchor=\'middle\' dy=\'0.3em\' font-family=\'Arial, sans-serif\' font-size=\'24\' fill=\'white\'%3EOne Piece Episode Playing%3C/text%3E%3C/svg%3E")'}}>
                    
                    {/* Stop Screen Share Warning */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">!</span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">If You stop the screen sharing</p>
                          <p className="text-gray-600 text-sm">the party will be end</p>
                        </div>
                      </div>
                      <button 
                        onClick={stopScreenShare}
                        className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Stop Screen Sharing
                      </button>
                    </div>

                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-4 py-2 flex items-center gap-4">
                      <button 
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Watch Together Invitation Screen */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Play className="text-white w-4 h-4 ml-0.5" />
                          </div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full -ml-2 -mt-4"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Watch Together</h2>
                        <button 
                          onClick={() => setShowInviteModal(true)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          Let's Start
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Controls */}
              <div className="h-1/6 bg-white p-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowPeopleModal(true)}
                    className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Users size={18} />
                    <span className="font-medium">People</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span className="font-medium">Messages</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Share2 size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 h-full">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={18} className="text-orange-500" />
                Participants ({participants.length})
              </h3>
              
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{participant.name}</p>
                      {participant.isHost && (
                        <p className="text-xs text-orange-500">Host</p>
                      )}
                    </div>
                    {!participant.isMuted ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <VolumeX size={14} className="text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <UserPlus size={18} />
                Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* People Modal */}
      {showPeopleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">People</h3>
              <button 
                onClick={() => setShowPeopleModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-orange-600 font-medium mb-2">Invite your friends!</p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600 text-sm flex-1">{inviteLink}</span>
                <button 
                  onClick={copyInviteLink}
                  className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <Copy size={14} className="text-orange-600" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Search for people"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">In the Watch Party</p>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{participant.name}</p>
                        {participant.isHost && (
                          <p className="text-xs text-orange-500">Host</p>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="text-lg">⋮</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
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
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${msg.isOwn ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-2xl`}>
                    {!msg.isOwn && (
                      <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-white text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Watch Together</h3>
              <p className="text-gray-600 mb-1">share this link with others you</p>
              <p className="text-gray-600 mb-4">want in the party</p>
              <p className="text-orange-600 font-medium mb-4">Invite your friends!</p>
              
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg mb-6">
                <span className="text-gray-600 text-sm flex-1">{inviteLink}</span>
                <button 
                  onClick={copyInviteLink}
                  className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <Copy size={14} className="text-orange-600" />
                </button>
              </div>
              
              <button 
                onClick={startScreenShare}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Start Sharing Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchTogether;