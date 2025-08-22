import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, MessageSquare, X } from 'lucide-react';

const MessageModel = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 992);

  // Sample data
  const [friends] = useState([
    { id: 1, name: 'Alex Johnson', status: 'online', lastSeen: '2 min ago', avatar: 'AJ' },
    { id: 2, name: 'Sarah Miller', status: 'online', lastSeen: '5 min ago', avatar: 'SM' },
    { id: 3, name: 'Michael Chen', status: 'offline', lastSeen: '1 hour ago', avatar: 'MC' },
    { id: 4, name: 'Emma Wilson', status: 'online', lastSeen: 'Just now', avatar: 'EW' },
    { id: 5, name: 'David Brown', status: 'offline', lastSeen: '3 hours ago', avatar: 'DB' },
    { id: 6, name: 'Jennifer Lopez', status: 'online', lastSeen: '10 min ago', avatar: 'JL' },
    { id: 7, name: 'Robert Smith', status: 'offline', lastSeen: '2 hours ago', avatar: 'RS' },
    { id: 8, name: 'Lisa Anderson', status: 'online', lastSeen: 'Just now', avatar: 'LA' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, friendId: 1, text: 'Hey, how are you doing?', time: '10:30 AM', isMe: false, timestamp: Date.now() - 1800000 },
    { id: 2, friendId: 1, text: 'I\'m good! Working on a new project.', time: '10:32 AM', isMe: true, timestamp: Date.now() - 1680000 },
    { id: 3, friendId: 1, text: 'That sounds exciting! What kind of project?', time: '10:35 AM', isMe: false, timestamp: Date.now() - 1500000 },
    { id: 4, friendId: 4, text: 'Did you see the latest design?', time: 'Yesterday', isMe: false, timestamp: Date.now() - 86400000 },
    { id: 5, friendId: 2, text: 'Let\'s meet tomorrow for coffee', time: '2 days ago', isMe: false, timestamp: Date.now() - 172800000 },
    { id: 6, friendId: 6, text: 'Can you send me those files?', time: '3 days ago', isMe: false, timestamp: Date.now() - 259200000 },
    { id: 7, friendId: 8, text: 'The meeting is scheduled for next Monday', time: '4 days ago', isMe: false, timestamp: Date.now() - 345600000 }
  ]);

  const messagesEndRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobileView(mobile);
      
      // Auto-close sidebar on resize to desktop if needed
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedFriend]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedFriend) {
      const newMessage = {
        id: Date.now(),
        friendId: selectedFriend.id,
        text: message.trim(),
        time: getCurrentTime(),
        isMe: true,
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');

      // Simulate friend reply after 2-3 seconds
      setTimeout(() => {
        const replies = [
          'That\'s interesting!',
          'I see what you mean.',
          'Thanks for letting me know!',
          'Got it, thanks!',
          'Sounds good to me!',
          'I agree with you.',
          'That makes sense.',
          'Cool, let me know!',
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMessage = {
          id: Date.now() + 1,
          friendId: selectedFriend.id,
          text: randomReply,
          time: getCurrentTime(),
          isMe: false,
          timestamp: Date.now()
        };
        
        setMessages(prevMessages => [...prevMessages, replyMessage]);
      }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    }
  };

  const getFriendMessages = (friendId) => {
    return messages
      .filter(msg => msg.friendId === friendId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages based on search query when in messages tab
  const getFilteredFriendsWithMessages = () => {
    if (!searchQuery) return friends;
    
    return friends.filter(friend => {
      // Search by friend name
      const nameMatch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Search by message content
      const friendMessages = getFriendMessages(friend.id);
      const messageMatch = friendMessages.some(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return nameMatch || messageMatch;
    });
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    if (isMobileView) {
      setIsMobileSidebarOpen(false);
    }
  };

  const getLastMessage = (friendId) => {
    const friendMessages = getFriendMessages(friendId);
    return friendMessages[friendMessages.length - 1];
  };

  const getUnreadCount = (friendId) => {
    // Simulate unread count - in real app this would come from backend
    const friendMessages = getFriendMessages(friendId);
    if (friendMessages.length === 0) return 0;
    
    // Simulate some unread messages for demo
    return Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileView && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg border-r border-gray-200/50 shadow-lg flex flex-col z-50
          ${isMobileView ? 
            `fixed left-0 top-0 h-full transition-transform duration-300 w-full max-w-sm 
             ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : 'w-80'}`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="m-0 text-orange-500 font-bold">Messages</h4>
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveTab(activeTab === 'messages' ? 'friends' : 'messages')}
                    className="bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full py-1 px-3 text-sm mr-2"
                  >
                    {activeTab === 'messages' ? 'Friends' : 'Messages'}
                  </button>
                  {isMobileView && (
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="btn-close"
                    />
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-10 rounded-full border border-gray-200/80 bg-orange-500/5 text-sm"
                  placeholder={activeTab === 'messages' ? 'Search conversations...' : 'Search friends...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {activeTab === 'friends' ? (
                // Friends List
                <div className="friends-list">
                  {filteredFriends.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <div className="mb-2">No friends found</div>
                      <small>Try a different search term</small>
                    </div>
                  ) : (
                    filteredFriends.map(friend => (
                      <div
                        key={friend.id}
                        onClick={() => handleSelectFriend(friend)}
                        className="flex items-center p-3 rounded-lg cursor-pointer transition-all mb-1 hover:bg-orange-500/5"
                      >
                        <div className="relative mr-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                            {friend.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white
                            ${friend.status === 'online' ? 'bg-green-600' : 'bg-gray-500'}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                          <div className="text-sm text-gray-500">
                            {friend.status === 'online' ? 'Online' : `Last seen ${friend.lastSeen}`}
                          </div>
                        </div>
                        <MoreVertical size={18} className="text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Messages List
                <div className="conversations-list">
                  {getFilteredFriendsWithMessages().length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <div className="mb-2">No conversations found</div>
                      <small>Try a different search term</small>
                    </div>
                  ) : (
                    getFilteredFriendsWithMessages().map(friend => {
                      const lastMessage = getLastMessage(friend.id);
                      const unreadCount = getUnreadCount(friend.id);

                      return (
                        <div
                          key={friend.id}
                          onClick={() => handleSelectFriend(friend)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all mb-1
                            ${selectedFriend?.id === friend.id 
                              ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20' 
                              : 'hover:bg-orange-500/5'}`}
                        >
                          <div className="relative mr-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                              {friend.avatar}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white
                              ${friend.status === 'online' ? 'bg-green-600' : 'bg-gray-500'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                              {unreadCount > 0 && (
                                <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow-lg shadow-orange-500/30">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <div className="text-sm text-gray-500 truncate">
                                {lastMessage.isMe ? 'You: ' : ''}{lastMessage.text}
                              </div>
                            )}
                          </div>
                          {lastMessage && (
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {lastMessage.time}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center p-4 border-b border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg">
                {isMobileView && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="border border-orange-500/30 text-orange-500 rounded-md p-2 mr-3 flex items-center justify-center"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="flex items-center flex-1">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                      {selectedFriend.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${selectedFriend.status === 'online' ? 'bg-green-600' : 'bg-gray-500'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{selectedFriend.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedFriend.status === 'online' ? 'Online' : `Last seen ${selectedFriend.lastSeen}`}
                    </div>
                  </div>
                </div>
                <MoreVertical size={18} className="text-gray-500" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-100 to-gray-200">
                {getFriendMessages(selectedFriend.id).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
                      <Send size={28} />
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  getFriendMessages(selectedFriend.id).map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-2xl relative break-words
                        ${msg.isMe 
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' 
                          : 'bg-white text-gray-800 border border-gray-200/80 shadow-md shadow-black/5'}`}
                      >
                        <div className="mb-1">{msg.text}</div>
                        <div className={`text-xs ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 py-3 px-4 rounded-full border border-gray-200/80 bg-orange-500/5 text-sm"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all disabled:bg-gray-400 disabled:shadow-none"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Welcome Screen
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-4">
                {isMobileView && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none rounded-full py-3 px-6 font-semibold shadow-lg shadow-orange-500/30 mb-8"
                  >
                    Open Messages
                  </button>
                )}
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 mx-auto mb-6">
                  <MessageSquare size={36} />
                </div>
                <h4 className="font-bold text-orange-500 mb-2">Welcome to Messages</h4>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModel;