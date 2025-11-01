import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, MessageSquare, X, Paperclip } from 'lucide-react';

const MessageModel = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 992);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null); // For preview
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;

  // Fix: Trim URLs to avoid trailing spaces
  const API_BASE = 'https://social-media-nty4.onrender.com/api';

  // Fetch friends on mount
  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/get-friends/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch friends');
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Invalid friends response');

        const mutualFriends = data.data.filter((f) => f.status === 'friends');
        const transformed = mutualFriends.map((f) => ({
          id: f._id,
          name: f.fullName,
          avatar: (f.profile?.image || '').trim() || f.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
          email: f.email,
        }));

        const friendsWithChat = await Promise.all(
          transformed.map(async (friend) => {
            try {
              const chatRes = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, targetId: friend.id }),
              });
              const chatData = await chatRes.json();
              if (chatRes.ok && chatData.success) {
                return { ...friend, chatId: chatData.data._id };
              }
            } catch (err) {
              console.warn(`Chat fetch failed for ${friend.id}`);
            }
            return { ...friend, chatId: null };
          })
        );

        setFriends(friendsWithChat);
      } catch (err) {
        setError(err.message || 'Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobileView(mobile);
      if (!mobile && isMobileSidebarOpen) setIsMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!fetchingMore) {
      scrollToBottom();
    }
  }, [messages, fetchingMore]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages for a chat
  const fetchMessages = async (chatId, friendIdArg, pageNum = 1) => {
    if (fetchingMore) return;
    try {
      setFetchingMore(true);
      const res = await fetch(`${API_BASE}/messages/${chatId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Invalid response');

      const newMessages = data.data
        .map((msg) => {
          let displayText = '';
          let mediaUrl = null;
          let msgType = 'text';

          if (msg.mediaUrl && msg.mediaUrl.length > 0) {
            mediaUrl = msg.mediaUrl[0].trim();
            msgType = msg.type;
            displayText = msgType === 'image' ? '📷 Image' : '🎥 Video';
          } else if (msg.text !== undefined && msg.text !== null) {
            displayText = msg.text.trim() || '[No content]';
            msgType = 'text';
          } else {
            displayText = '[No content]';
          }

          return {
            id: msg._id,
            friendId: friendIdArg,
            text: displayText,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: msg.sender._id === userId,
            timestamp: new Date(msg.createdAt).getTime(),
            type: msgType,
            mediaUrl: mediaUrl,
            senderName: msg.sender.fullName,
          };
        })
        .reverse();

      setMessages(prev => pageNum === 1 ? newMessages : [...newMessages, ...prev]);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (pageNum === 1) {
        setError('Failed to load messages');
      }
    } finally {
      setFetchingMore(false);
    }
  };

  // Handle scroll for pagination
  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    if (scrollTopValue === 0 && hasMore && !fetchingMore && selectedFriend?.chatId) {
      const currentHeight = messagesContainerRef.current?.scrollHeight || 0;
      fetchMessages(selectedFriend.chatId, selectedFriend.id, page + 1).then(() => {
        setTimeout(() => {
          const newHeight = messagesContainerRef.current?.scrollHeight || 0;
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = newHeight - currentHeight;
          }
        }, 100);
      });
    }
  };

  // Mark messages as read
  const markAsRead = async (chatId) => {
    try {
      const unreadRes = await fetch(`${API_BASE}/messages/unread/${userId}`);
      const unread = await unreadRes.json();
      if (unread.success && unread.data) {
        const msgIds = unread.data
          .filter((m) => m.chatId === chatId)
          .map((m) => m._id);

        if (msgIds.length > 0) {
          await fetch(`${API_BASE}/messages/read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageIds: msgIds, userId }),
          });
        }
      }
    } catch (err) {
      console.warn('Failed to mark as read');
    }
  };

  // Select friend and load messages
  const handleSelectFriend = async (friend) => {
    if (!friend.chatId) {
      alert('Chat not available for this friend');
      return;
    }
    setSelectedFriend(friend);
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    await fetchMessages(friend.chatId, friend.id, 1);
    await markAsRead(friend.chatId);
    if (isMobileView) setIsMobileSidebarOpen(false);
  };

  // Poll messages every 10 seconds if a chat is open
  useEffect(() => {
    let intervalId;
    if (selectedFriend?.chatId) {
      const pollMessages = () => {
        fetchMessages(selectedFriend.chatId, selectedFriend.id, 1);
      };
      intervalId = setInterval(pollMessages, 10000);
    }
    return () => clearInterval(intervalId);
  }, [selectedFriend, userId]);

  // Send message (text or media)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFriend) return;

    const chatId = selectedFriend.chatId;
    const receiverId = selectedFriend.id;
    const hasText = message.trim();
    const hasFile = fileInputRef.current?.files?.length > 0;

    if (!hasText && !hasFile) return;

    // Send text
    if (hasText) {
      const payload = {
        chatId,
        senderId: userId,
        receiverId,
        type: 'text',
        content: { text: message.trim() },
      };

      try {
        const res = await fetch(`${API_BASE}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

        const newMsg = {
          id: result.data._id,
          friendId: receiverId,
          text: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          timestamp: Date.now(),
          type: 'text',
          senderName: storedUser?.fullName || 'You',
        };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
      } catch (err) {
        alert('Failed to send message: ' + err.message);
      }
    }

    // Send media
    if (hasFile) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('senderId', userId);
      formData.append('receiverId', receiverId);
      formData.append('type', file.type.startsWith('image') ? 'image' : 'video');
      formData.append('file', file);

      try {
        const res = await fetch(`${API_BASE}/message`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

        const mediaUrl = result.data.mediaUrl?.[0]?.trim() || URL.createObjectURL(file);
        const msgType = file.type.startsWith('image') ? 'image' : 'video';
        const newMsg = {
          id: result.data._id,
          friendId: receiverId,
          text: msgType === 'image' ? '📷 Image' : '🎥 Video',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          timestamp: Date.now(),
          type: msgType,
          mediaUrl: mediaUrl,
          senderName: storedUser?.fullName || 'You',
        };
        setMessages(prev => [...prev, newMsg]);
        fileInputRef.current.value = '';
        setMediaPreview(null);
      } catch (err) {
        alert('Failed to send media: ' + err.message);
      }
    }
  };

  // Handle media selection & preview
  const handleMediaSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview({ url, type: file.type.startsWith('image') ? 'image' : 'video' });
    } else {
      setMediaPreview(null);
    }
  };

  // Utility functions
  const getFriendMessages = (friendId) => {
    return messages.filter(msg => msg.friendId === friendId).sort((a, b) => a.timestamp - b.timestamp);
  };

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getFilteredFriendsWithMessages = () => {
    if (!searchQuery) return friends;
    return friends.filter(friend => {
      const nameMatch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
      const msgs = getFriendMessages(friend.id);
      const msgMatch = msgs.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return nameMatch || msgMatch;
    });
  };

  const getLastMessagePreview = (friendId) => {
    const msgs = getFriendMessages(friendId);
    if (msgs.length === 0) return null;
    const last = msgs[msgs.length - 1];
    return { text: last.text, time: last.time, isMe: last.isMe };
  };

  // Loading / Error UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-orange-500 font-semibold">Loading friends...</div>
        </div>
      </div>
    );
  }

  if (error && !selectedFriend) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-2 font-semibold">Error loading data</div>
          <div className="text-gray-500 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {isMobileView && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg border-r border-gray-200/50 shadow-lg flex flex-col z-50 ${isMobileView ? `fixed left-0 top-0 h-full transition-transform duration-300 w-full max-w-sm ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` : 'w-80'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="m-0 text-orange-500 font-bold">Messages</h4>
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveTab(activeTab === 'messages' ? 'friends' : 'messages')}
                    className="bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full py-1 px-3 text-sm mr-2 hover:bg-orange-500/20 transition-colors"
                  >
                    {activeTab === 'messages' ? 'Friends' : 'Messages'}
                  </button>
                  {isMobileView && (
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500"><Search size={16} /></span>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-10 rounded-full border border-gray-200/80 bg-orange-500/5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder={activeTab === 'messages' ? 'Search conversations...' : 'Search friends...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 text-gray-500 hover:text-gray-700">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {activeTab === 'friends' ? (
                <div className="friends-list">
                  {filteredFriends.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <div className="mb-2">No friends found</div>
                      <small>Try a different search term</small>
                    </div>
                  ) : (
                    filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => handleSelectFriend(friend)}
                        className="flex items-center p-3 rounded-lg cursor-pointer transition-all mb-1 hover:bg-orange-500/5"
                      >
                        <div className="relative mr-3">
                          {friend.avatar.startsWith('http') ? (
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-12 h-12 rounded-full object-cover shadow-lg shadow-orange-500/30"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                              {friend.avatar}
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-600" />
                        </div>
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                          <div className="text-sm text-gray-500">Online</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="conversations-list">
                  {getFilteredFriendsWithMessages().length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <div className="mb-2">No conversations found</div>
                      <small>Start chatting with your friends</small>
                    </div>
                  ) : (
                    getFilteredFriendsWithMessages().map((friend) => {
                      const lastMsg = getLastMessagePreview(friend.id);
                      return (
                        <div
                          key={friend.id}
                          onClick={() => handleSelectFriend(friend)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all mb-1 ${selectedFriend?.id === friend.id ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20' : 'hover:bg-orange-500/5'}`}
                        >
                          <div className="relative mr-3">
                            {friend.avatar.startsWith('http') ? (
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-full object-cover shadow-lg shadow-orange-500/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                                {friend.avatar}
                              </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-600" />
                          </div>
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                            {lastMsg ? (
                              <div className="text-sm text-gray-500 truncate">
                                {lastMsg.isMe ? 'You: ' : ''}{lastMsg.text}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 truncate">No messages yet</div>
                            )}
                          </div>
                          {lastMsg && (
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {lastMsg.time}
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
              <div className="flex items-center p-4 border-b border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg">
                {isMobileView && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="border border-orange-500/30 text-orange-500 rounded-md p-2 mr-3 flex items-center justify-center hover:bg-orange-500/10 transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="flex items-center flex-1">
                  <div className="relative mr-3">
                    {selectedFriend.avatar.startsWith('http') ? (
                      <img
                        src={selectedFriend.avatar}
                        alt={selectedFriend.name}
                        className="w-10 h-10 rounded-full object-cover shadow-lg shadow-orange-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                        {selectedFriend.avatar}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{selectedFriend.name}</div>
                    <div className="text-sm text-gray-500">Online</div>
                  </div>
                </div>
                <MoreVertical size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>

              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-100 to-gray-200"
              >
                {fetchingMore && page > 1 && (
                  <div className="text-center py-2">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                )}
                {getFriendMessages(selectedFriend.id).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
                      <Send size={28} />
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {getFriendMessages(selectedFriend.id).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-2xl relative break-words ${msg.isMe ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-800 border border-gray-200/80 shadow-md shadow-black/5'}`}>
                          {msg.type === 'image' && msg.mediaUrl ? (
                            <div className="mb-1">
                              <img
                                src={msg.mediaUrl}
                                alt="Attachment"
                                className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className={`text-xs mt-1 ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`} style={{ display: 'none' }}>
                                📷 Image unavailable
                              </div>
                            </div>
                          ) : msg.type === 'video' && msg.mediaUrl ? (
                            <div className="mb-1">
                              <video
                                src={msg.mediaUrl}
                                controls
                                className="max-w-full h-auto rounded-lg max-h-64"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className={`text-xs mt-1 ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`} style={{ display: 'none' }}>
                                🎥 Video unavailable
                              </div>
                            </div>
                          ) : (
                            <div className="mb-1">{msg.text}</div>
                          )}
                          <div className={`text-xs ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area with Media Preview */}
              <div className="p-4 border-t border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg">
                {mediaPreview && (
                  <div className="mb-2 flex justify-end">
                    <div className="relative max-w-xs">
                      {mediaPreview.type === 'image' ? (
                        <img
                          src={mediaPreview.url}
                          alt="Preview"
                          className="max-h-32 rounded-lg object-cover border border-gray-300"
                        />
                      ) : (
                        <video
                          src={mediaPreview.url}
                          controls
                          className="max-h-32 rounded-lg object-cover border border-gray-300"
                        />
                      )}
                      <button
                        onClick={() => {
                          setMediaPreview(null);
                          fileInputRef.current.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleMediaSelect}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200/80 bg-orange-500/5 text-gray-500 hover:bg-orange-500/10 transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    className="flex-1 py-3 px-4 rounded-full border border-gray-200/80 bg-orange-500/5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() && !mediaPreview}
                    className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed hover:shadow-orange-500/50"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-4">
                {isMobileView && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none rounded-full py-3 px-6 font-semibold shadow-lg shadow-orange-500/30 mb-8 hover:shadow-orange-500/50 transition-all"
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