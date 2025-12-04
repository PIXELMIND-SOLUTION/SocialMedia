import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, MessageSquare, X, Paperclip, Trash2, UserX, UserCheck, Download } from 'lucide-react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

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
  const [mediaPreview, setMediaPreview] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isChatBlocked, setIsChatBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [lastSeenTimestamps, setLastSeenTimestamps] = useState({});
  const [showChatMenu, setShowChatMenu] = useState(false);


  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;
  const userName = storedUser?.fullName || 'You';

  const navigate = useNavigate();

  const API_BASE = 'https://apisocial.atozkeysolution.com/api';
  const SOCKET_URL = 'https://apisocial.atozkeysolution.com';

  // Format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Recently';

    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return lastSeen.toLocaleDateString();
  };

  // Enhanced Socket.IO connection with better status handling
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      query: {
        userId,
        userName
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);

      // Join user to their personal room and get initial online status
      newSocket.emit('userOnline', userId);
      newSocket.emit('joinNotificationRoom', userId);
      newSocket.emit('getOnlineUsers');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected to server after', attemptNumber, 'attempts');
      setIsConnected(true);
      newSocket.emit('userOnline', userId);
      newSocket.emit('getOnlineUsers');
    });

    newSocket.on('connect_error', (error) => {
      console.error('🚨 Connection error:', error);
      setIsConnected(false);
    });

    // Enhanced user status handling
    newSocket.on('userStatusChanged', (data) => {
      console.log('👤 User status changed:', data);

      setOnlineUsers(prev => {
        const newOnlineUsers = new Set(prev);
        if (data.status === 'online') {
          newOnlineUsers.add(data.userId);
        } else {
          newOnlineUsers.delete(data.userId);
        }
        return newOnlineUsers;
      });

      // Update last seen timestamps
      if (data.lastSeen) {
        setLastSeenTimestamps(prev => ({
          ...prev,
          [data.userId]: data.lastSeen
        }));
      }

      // Update friends list with instant status update
      setFriends(prev => prev.map(friend => {
        if (friend.id === data.userId) {
          return {
            ...friend,
            isOnline: data.status === 'online',
            lastSeen: data.lastSeen,
            status: data.status
          };
        }
        return friend;
      }));
    });

    newSocket.on('onlineUsers', (userIds) => {
      console.log('👥 Online users:', userIds);
      const onlineSet = new Set(userIds);
      setOnlineUsers(onlineSet);

      // Update all friends with online status instantly
      setFriends(prev => prev.map(friend => ({
        ...friend,
        isOnline: onlineSet.has(friend.id),
        status: onlineSet.has(friend.id) ? 'online' : 'offline'
      })));
    });

    newSocket.on('userLastSeen', (data) => {
      console.log('🕒 User last seen:', data);
      setLastSeenTimestamps(prev => ({
        ...prev,
        [data.userId]: data.lastSeen
      }));

      setFriends(prev => prev.map(friend => {
        if (friend.id === data.userId) {
          return {
            ...friend,
            lastSeen: data.lastSeen,
            isOnline: false
          };
        }
        return friend;
      }));
    });

    // Handle new messages
    newSocket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);

      // Update unread count if message is not from current user and not in current chat
      const isCurrentChat = selectedFriend && message.chatId === selectedFriend.chatId;
      const isMyMessage = message.sender._id === userId;

      if (!isMyMessage && !isCurrentChat) {
        // Increment unread count for the friend
        setFriends(prev => prev.map(friend => {
          if (friend.chatId === message.chatId) {
            return {
              ...friend,
              unreadCount: (friend.unreadCount || 0) + 1,
              lastMessagePreview: {
                text: getMessagePreviewText(message),
                time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                isDeletedForMe: message.deletedFor?.includes(userId)
              }
            };
          }
          return friend;
        }));
      }

      if (selectedFriend && message.chatId === selectedFriend.chatId) {
        const newMsg = transformMessage(message);
        setMessages(prev => [...prev, newMsg]);
        markAsRead(selectedFriend.chatId);

        // Emit delivery confirmation
        if (message.sender._id !== userId) {
          newSocket.emit('messageDelivered', {
            messageId: message._id,
            chatId: message.chatId
          });
        }
      }

      // Update last message preview for the friend (for current chat too)
      setFriends(prev => prev.map(friend => {
        if (friend.chatId === message.chatId) {
          return {
            ...friend,
            lastMessagePreview: {
              text: getMessagePreviewText(message),
              time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: message.sender._id === userId,
              isDeletedForMe: message.deletedFor?.includes(userId)
            }
          };
        }
        return friend;
      }));
    });

    // Handle message deletion
    newSocket.on('messageDeleted', (data) => {
      console.log('🗑️ Message deleted:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId
            ? {
              ...msg,
              text: 'This message was deleted',
              type: 'deleted',
              mediaUrl: null,
              isDeletedForMe: true
            }
            : msg
        ));
      }
    });

    // Handle chat blocking
    newSocket.on('chatBlockedNotification', (data) => {
      console.log('🚫 Chat blocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(true);
        setBlockedBy(data.blockedBy);
      }
    });

    newSocket.on('chatBlocked', (data) => {
      console.log('🚫 Chat blocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(true);
        setBlockedBy(data.blockedBy);
      }
    });

    // Handle chat unblocking
    newSocket.on('chatUnblockedNotification', (data) => {
      console.log('✅ Chat unblocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(false);
        setBlockedBy(null);
      }
    });

    newSocket.on('chatUnblocked', (data) => {
      console.log('✅ Chat unblocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(false);
        setBlockedBy(null);
      }
    });

    // Handle typing indicators
    newSocket.on('userTyping', (data) => {
      console.log('✍️ User typing:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId && data.userId !== userId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.chatId]: data.userName || data.userId
        }));

        // Clear typing indicator after 3 seconds
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUsers(prev => {
            const newTyping = { ...prev };
            delete newTyping[data.chatId];
            return newTyping;
          });
        }, 3000);
      }
    });

    // Handle read receipts
    newSocket.on('messagesRead', (data) => {
      console.log('👀 Messages read:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setMessages(prev => prev.map(msg =>
          data.messageIds.includes(msg.id)
            ? { ...msg, status: 'read' }
            : msg
        ));
      }
    });

    // Handle delivery confirmations
    newSocket.on('deliveryConfirmed', (data) => {
      console.log('📨 Delivery confirmed:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId
            ? { ...msg, status: 'delivered' }
            : msg
        ));
      }
    });

    // Heartbeat for connection monitoring
    newSocket.on('pong', () => {
      console.log('❤️ Heartbeat received');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (newSocket) {
        newSocket.emit('userOffline', userId);
        newSocket.close();
      }
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingTimeout);
    };
  }, [userId, selectedFriend]);

  // Enhanced status update effect for instant updates
  useEffect(() => {
    if (!socket || !userId) return;

    // Update friends list with current online status whenever onlineUsers changes
    setFriends(prev => prev.map(friend => ({
      ...friend,
      isOnline: onlineUsers.has(friend.id),
      status: onlineUsers.has(friend.id) ? 'online' : 'offline'
    })));

  }, [onlineUsers, socket, userId]);

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API_BASE}/blocked/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch blocked users');
      const data = await res.json();
      if (data.success) {
        setBlockedUsers(data.blocked || []);
      }
    } catch (err) {
      console.error('Error fetching blocked users:', err);
    }
  };

  // Transform message for display
  const transformMessage = (msg) => {
    const isDeletedForMe = msg.deletedFor?.includes(userId);

    let displayText = '';
    let mediaUrl = null;
    let msgType = 'text';

    if (isDeletedForMe) {
      displayText = 'This message was deleted';
      msgType = 'deleted';
    } else if (msg.mediaUrl && msg.mediaUrl.length > 0) {
      mediaUrl = msg.mediaUrl[0]?.trim();
      msgType = msg.type;
      displayText = msgType === 'image' ? '📷 Image' : '🎥 Video';
    } else if (msg.text !== undefined && msg.text !== null) {
      displayText = msg.text?.trim() || '[No content]';
      msgType = 'text';
    } else if (msg.content?.text) {
      displayText = msg.content.text.trim() || '[No content]';
      msgType = 'text';
    } else {
      displayText = '[No content]';
    }

    return {
      id: msg._id,
      chatId: msg.chatId,
      friendId: selectedFriend?.id,
      text: displayText,
      time: new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: msg.sender?._id === userId || msg.sender === userId,
      timestamp: new Date(msg.createdAt || msg.timestamp).getTime(),
      type: msgType,
      mediaUrl: mediaUrl,
      senderName: msg.sender?.fullName || msg.senderName || 'Unknown',
      deletedFor: msg.deletedFor || [],
      isDeletedForMe: isDeletedForMe,
      status: msg.status || 'sent'
    };
  };

  // Get message preview text
  const getMessagePreviewText = (msg) => {
    const isDeletedForMe = msg.deletedFor?.includes(userId);
    if (isDeletedForMe) return 'This message was deleted';
    if (msg.mediaUrl && msg.mediaUrl.length > 0) {
      return msg.type === 'image' ? '📷 Image' : '🎥 Video';
    }
    if (msg.content?.mediaUrl && msg.content.mediaUrl.length > 0) {
      return msg.type === 'image' ? '📷 Image' : '🎥 Video';
    }
    return msg.text?.trim() || msg.content?.text?.trim() || '[No content]';
  };

  // Enhanced typing handler with better performance
  const handleTyping = () => {
    if (!socket || !selectedFriend || isChatBlocked) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        chatId: selectedFriend.chatId,
        userId: userId,
        userName: userName,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', {
        chatId: selectedFriend.chatId,
        userId: userId,
        userName: userName,
        isTyping: false
      });
    }, 1000);

    setTypingTimeout(timeout);
  };

  // Enhanced friends fetching with better status handling
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
          avatar: (f?.image || '').trim() || f.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
          email: f.email,
          isOnline: onlineUsers.has(f._id), // Set initial online status
          lastSeen: f.lastSeen,
          status: onlineUsers.has(f._id) ? 'online' : 'offline'
        }));

        const friendsWithChatAndLastMsg = await Promise.all(
          transformed.map(async (friend) => {
            try {
              // Get or create chat
              const chatRes = await fetch(`${API_BASE}/chat/get-or-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, targetId: friend.id }),
              });
              const chatData = await chatRes.json();
              console.log('Chat response for friend', friend.id, chatData.data);
              if (!chatRes.ok || !chatData.success) {
                return { ...friend, chatId: null, lastMessagePreview: null, unreadCount: 0 };
              }
              setIsChatBlocked(chatData.data.isBlocked);
              setBlockedBy(chatData.data.blockedBy);
              const chatId = chatData.data._id;
              console.log('Chat ID for friend', friend.id, chatId);

              // Join chat room
              if (socket) {
                socket.emit('joinChat', chatId);
              }

              // Get last message
              const lastMsgRes = await fetch(`${API_BASE}/messages/last/${chatId}`);
              console.log('Last message response for chat', chatId, lastMsgRes);
              const lastMsgData = await lastMsgRes.json();
              let lastMessagePreview = null;
              if (lastMsgRes.ok && lastMsgData.success && lastMsgData.data) {
                const msg = lastMsgData.data;
                lastMessagePreview = {
                  text: getMessagePreviewText(msg),
                  time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isMe: msg.sender._id === userId,
                  isDeletedForMe: msg.deletedFor?.includes(userId)
                };
              }

              // Get unread message count for this chat
              let unreadCount = 0;
              try {
                const unreadRes = await fetch(`${API_BASE}/messages/unread/count/${userId}/${chatId}`);
                const unreadData = await unreadRes.json();
                if (unreadRes.ok && unreadData.success) {
                  unreadCount = unreadData.data.unreadCount || 0;
                }
              } catch (err) {
                console.warn(`Failed to get unread count for ${friend.name}:`, err);
              }

              return { ...friend, chatId, lastMessagePreview, unreadCount };
            } catch (err) {
              console.warn(`Failed to enrich friend ${friend.id}`, err);
              return { ...friend, chatId: null, lastMessagePreview: null, unreadCount: 0 };
            }
          })
        );

        setFriends(friendsWithChatAndLastMsg);
        await fetchBlockedUsers();
      } catch (err) {
        setError(err.message || 'Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId, socket, onlineUsers]); // Added onlineUsers dependency for instant updates

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
        .map((msg) => transformMessage(msg))
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

  // Check if chat is blocked
  const checkChatBlockStatus = async (chatId) => {
    try {
      const res = await fetch(`${API_BASE}/chat/block-status/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // setIsChatBlocked(data.isBlocked);
          // setBlockedBy(data.blockedBy);
        }
      }
    } catch (err) {
      console.error('Error checking chat block status:', err);
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
      const unreadRes = await fetch(`${API_BASE}/messages/unread/count/${userId}/${chatId}`);
      const unread = await unreadRes.json();
      if (unread.success && unread.data.unreadCount > 0) {
        await fetch(`${API_BASE}/messages/mark-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, userId }),
        });

        // Reset unread count for this chat in friends list
        setFriends(prev => prev.map(friend => {
          if (friend.chatId === chatId) {
            return { ...friend, unreadCount: 0 };
          }
          return friend;
        }));

        // Emit read receipt via socket
        if (socket) {
          // Get unread message IDs for this chat
          const msgIds = messages
            .filter(msg => msg.chatId === chatId && !msg.isMe && msg.status !== 'read')
            .map(msg => msg.id);

          if (msgIds.length > 0) {
            socket.emit('messageRead', {
              chatId: chatId,
              userId: userId,
              messageIds: msgIds
            });
          }
        }
      }
    } catch (err) {
      console.warn('Failed to mark as read');
    }
  };

  // Select friend and load messages
  const handleSelectFriend = (friend) => {
    if (!friend.chatId) return alert("Chat not available");

    // Leave previous room
    if (selectedFriend && socket) {
      socket.emit("leaveChat", selectedFriend.chatId);
    }
    if (isMobileView) {
    setIsMobileSidebarOpen(false);
  }


    setMessages([]);        // reset messages
    setSelectedFriend(friend); // triggers useEffect

    // Reset unread count for selected friend immediately in UI
    setFriends(prev => prev.map(f =>
      f.id === friend.id
        ? { ...f, unreadCount: 0 }
        : f
    ));
  };

  useEffect(() => {
    if (!selectedFriend) return;

    const chatId = selectedFriend.chatId;
    const friendId = selectedFriend._id || selectedFriend.id;

    // Join room
    socket?.emit("joinChat", chatId);

    // Fetch
    fetchMessages(chatId, friendId, 1);
    markAsRead(chatId);
    checkChatBlockStatus(chatId);

  }, [selectedFriend]);

  // Block/Unblock user
  const handleBlockUser = async () => {
    if (!selectedFriend?.chatId) return;

    try {
      const res = await fetch(`${API_BASE}/chat/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedFriend.chatId,
          userId: userId,
          blockedUserId: selectedFriend.id
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to block user');
      }

      setIsChatBlocked(true);
      setBlockedBy(userId);

      if (socket) {
        socket.emit('chatBlocked', {
          chatId: selectedFriend.chatId,
          userId: userId,
          blockedUserId: selectedFriend.id
        });
      }
    } catch (err) {
      console.error('Error blocking user:', err);
      alert('Failed to block user: ' + err.message);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedFriend?.chatId) return;

    try {
      const res = await fetch(`${API_BASE}/chat/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedFriend.chatId,
          userId: userId
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to unblock user');
      }

      setIsChatBlocked(false);
      setBlockedBy(null);

      if (socket) {
        socket.emit('chatUnblocked', {
          chatId: selectedFriend.chatId,
          userId: userId
        });
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      alert('Failed to unblock user: ' + err.message);
    }
  };

  // Delete message for me only
  const handleDeleteForMe = async (messageId) => {
    if (!messageId || !userId) return;

    try {
      const res = await fetch(`${API_BASE}/messages/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: messageId,
          userId: userId
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete message');
      }

      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
            ...msg,
            text: 'This message was deleted',
            type: 'deleted',
            mediaUrl: null,
            isDeletedForMe: true
          }
          : msg
      ));

      setShowMessageMenu(null);
    } catch (err) {
      console.error('Error deleting message for me:', err);
      alert('Failed to delete message: ' + err.message);
    }
  };

  // Delete message for everyone
  const handleDeleteForEveryone = async (messageId) => {
    if (!messageId || !userId) return;

    try {
      const res = await fetch(`${API_BASE}/messages/delete/${messageId}/${userId}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete message for everyone');
      }

      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
            ...msg,
            text: 'This message was deleted',
            type: 'deleted',
            mediaUrl: null,
            isDeletedForMe: true
          }
          : msg
      ));

      setShowMessageMenu(null);
    } catch (err) {
      console.error('Error deleting message for everyone:', err);
      alert('Failed to delete message for everyone: ' + err.message);
    }
  };

  // Send message (text or media)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFriend || isChatBlocked) return;

    const chatId = selectedFriend.chatId;
    const receiverId = selectedFriend.id;
    const hasText = message.trim();
    const hasFile = fileInputRef.current?.files?.length > 0;

    if (!hasText && !hasFile) return;

    // Stop typing when sending message
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('typing', {
        chatId: selectedFriend.chatId,
        userId: userId,
        isTyping: false
      });
    }

    // Send text message
    if (hasText) {
      const payload = {
        chatId,
        senderId: userId,
        receiverId,
        type: 'text',
        text: message.trim()
      };

      try {
        const res = await fetch(`${API_BASE}/messages/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

        // The message will be added via socket event
        setMessage('');
      } catch (err) {
        alert('Failed to send message: ' + err.message);
      }
    }

    // Send media message
    if (hasFile) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('senderId', userId);
      formData.append('receiverId', receiverId);
      formData.append('type', file.type.startsWith('image') ? 'image' : 'video');
      formData.append('media', file);

      try {
        const res = await fetch(`${API_BASE}/messages/send`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

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
      console.log('Selected media URL:', url);
      setMediaPreview({ url, type: file.type.startsWith('image') ? 'image' : 'video' });
    } else {
      setMediaPreview(null);
    }
  };

  // Message menu handlers
  const handleMessageMenuToggle = (messageId, e) => {
    if (e) e.stopPropagation();
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShowMessageMenu(showMessageMenu === messageId ? null : messageId);
  };

  const handleOutsideClick = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMessageMenu(null);
    }, 100);
  };

  // Utility functions
  const getFriendMessages = (friendId) => {
    return messages.filter(msg => msg.friendId === friendId).sort((a, b) => a.timestamp - b.timestamp);
  };

  const getFilteredFriendsWithMessages = () => {
    if (!searchQuery) return friends;
    return friends.filter(friend => {
      const nameMatch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
      const msgMatch = friend.lastMessagePreview?.text?.toLowerCase().includes(searchQuery.toLowerCase());
      console.log('Filtering friend:', friend.name, 'Name match:', nameMatch, 'Msg match:', msgMatch);
      return nameMatch || msgMatch;
    });
  };

  // Enhanced status indicator with better real-time updates
  const getStatusColor = (friend) => {
    if (friend.isOnline) return 'bg-green-500';
    return 'bg-gray-400';
  };

  // Enhanced status text with last seen
  const getStatusText = (friend) => {
    if (friend.isOnline) return 'Online';
    if (friend.lastSeen) {
      return `Last seen ${formatLastSeen(friend.lastSeen)}`;
    }
    return 'Offline';
  };

  // Enhanced status for chat header
  const getChatStatusText = (friend) => {
    if (friend.isOnline) return 'Online';
    if (friend.lastSeen) {
      return `Last seen ${formatLastSeen(friend.lastSeen)}`;
    }
    return 'Offline';
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
                  {getFilteredFriendsWithMessages().length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <div className="mb-2">No friends found</div>
                      <small>Try a different search term</small>
                    </div>
                  ) : (
                    getFilteredFriendsWithMessages().map((friend) => (
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
                          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(friend)}`} />
                        </div>
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                          <div className="text-sm text-gray-500">{getStatusText(friend)}</div>
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
                      const lastMsg = friend.lastMessagePreview;
                      const hasUnread = friend.unreadCount > 0;

                      return (
                        <div
                          key={friend.id}
                          onClick={() => handleSelectFriend(friend)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all mb-1 ${selectedFriend?.id === friend.id
                            ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20'
                            : 'hover:bg-orange-500/5'
                            } ${hasUnread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
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
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(friend)}`} />
                          </div>
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                              {lastMsg && (
                                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {lastMsg.time}
                                </div>
                              )}
                            </div>
                            {lastMsg ? (
                              <div className={`text-sm truncate ${lastMsg.isDeletedForMe ? 'text-gray-500 italic' : 'text-gray-500'} ${hasUnread ? 'font-semibold text-gray-800' : ''}`}>
                                {lastMsg.isMe ? 'You: ' : ''}{lastMsg.text}
                              </div>
                            ) : (
                              <div className={`${hasUnread ? "text-sm fw-bold text-black-400 truncate" : "text-sm text-gray-400 truncate"}`}>{hasUnread ? "new messages" : "No new messages"}</div>
                            )}
                          </div>

                          {/* Unread message counter */}
                          {hasUnread && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                                {friend.unreadCount > 99 ? '99+' : friend.unreadCount}
                              </div>
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
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedFriend)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{selectedFriend.name}</div>
                    <div className="text-sm text-gray-500">
                      {getChatStatusText(selectedFriend)}
                      {isChatBlocked && ` • Chat ${blockedBy === userId ? 'blocked by you' : 'blocked by user'}`}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <MoreVertical
                    size={18}
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => setShowChatMenu(true)}
                  />
                </div>


              </div>

              {isChatBlocked ? (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 mb-4 mx-auto">
                      <UserX size={32} />
                    </div>
                    <h4 className="font-bold text-red-500 mb-2">Chat Blocked</h4>
                    <p className="text-gray-500 mb-4">
                      {blockedBy === userId
                        ? "You have blocked this user. Unblock to send messages."
                        : "This user has blocked you. You cannot send messages."}
                    </p>
                    {blockedBy === userId && (
                      <button
                        onClick={handleUnblockUser}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Unblock User
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-100 to-gray-200"
                    onClick={handleOutsideClick}
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
                            <div
                              className={`relative max-w-[250px] p-3 rounded-2xl break-words ${msg.isMe ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-800 border border-gray-200/80 shadow-md shadow-black/5'} ${msg.isDeletedForMe ? 'opacity-70' : ''}`}
                            >
                              {msg.type === 'deleted' ? (
                                <div className="break-words max-w-[150px] leading-relaxed">
                                  {msg.text}
                                </div>

                              ) : msg.type === 'image' && msg.mediaUrl ? (
                                <div className="mb-1 relative group">
                                  <img
                                    src={msg.mediaUrl}
                                    alt="Attachment"
                                    className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />

                                  {/* Download Button */}
                                  <a
                                    href={msg.mediaUrl}
                                    download
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-1 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    title="Download"
                                    target="_blank"
                                  >
                                    <Download size={16} className="text-white" />
                                  </a>


                                  {/* Fallback message */}
                                  <div
                                    className={`text-xs mt-1 ${msg.isMe ? "text-white/80" : "text-gray-500"}`}
                                    style={{ display: "none" }}
                                  >
                                    📷 Image unavailable
                                  </div>
                                </div>

                              ) : (
                                <div className="mb-1">{msg.text}</div>
                              )}

                              <div className="flex items-center justify-between mt-1">
                                <div className={`text-xs ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`}>
                                  {msg.time}
                                  {msg.isMe && (
                                    <span className="ml-1">
                                      {msg.status === 'read' ? ' ✓✓' : msg.status === 'delivered' ? ' ✓✓' : ' ✓'}
                                    </span>
                                  )}
                                </div>

                                {/* Show menu button for ALL messages */}
                                <button
                                  onClick={(e) => handleMessageMenuToggle(msg.id, e)}
                                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                  <MoreVertical size={14} />
                                </button>
                              </div>

                              {/* Menu for all messages */}
                              {showMessageMenu === msg.id && (
                                <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-32">
                                  {msg.isDeletedForMe ? (
                                    <div className="text-xs text-gray-500 px-3 py-2 italic">
                                      Message deleted
                                    </div>
                                  ) : msg.isMe ? (
                                    <>
                                      <button
                                        onClick={() => handleDeleteForMe(msg.id)}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full"
                                      >
                                        <Trash2 size={14} className="mr-2" />
                                        Delete for me
                                      </button>
                                      <button
                                        onClick={() => handleDeleteForEveryone(msg.id)}
                                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                                      >
                                        <Trash2 size={14} className="mr-2" />
                                        Delete for everyone
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteForMe(msg.id)}
                                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full"
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Delete for me
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  <div className="p-2 border-t border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg">
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
                            <div></div>
                          )}
                          <button
                            onClick={() => {
                              setMediaPreview(null);
                              fileInputRef.current.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <X size={6} />
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Typing Indicator Above Input */}
                    {typingUsers[selectedFriend.chatId] && !isChatBlocked && (
                      <div className="flex items-center mb-2 px-2 text-sm text-orange-500">
                        typing
                        <span className="flex ml-2 ms-2 space-x-1">
                          <span className="dot-typing"></span>
                          <span className="dot-typing animation-delay-200"></span>
                          <span className="dot-typing animation-delay-400"></span>
                        </span>
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*" //,video/*
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={handleMediaSelect}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200/80 bg-orange-500/5 text-gray-500 hover:bg-orange-500/10 transition-colors"
                      >
                        <Paperclip size={16} />
                      </button>
                      <input
                        type="text"
                        className="flex-1 items-center py-2 px-4 rounded-full border border-gray-200/80 bg-orange-500/5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!message.trim() && !mediaPreview}
                        className="w-10 h-10 rounded-full border-none flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed hover:shadow-orange-500/50"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </>
              )}
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
                <div className="mt-4 text-sm text-gray-400">
                  {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                  <div className="mt-1 text-xs">
                    Online: {onlineUsers.size} users
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Options Modal */}
      {showChatMenu && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center md:items-center z-[9999] animate-fadeIn"
          onClick={() => setShowChatMenu(false)}
        >
          <div
            className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:w-80 p-3 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X Close Button */}
            <button
              onClick={() => setShowChatMenu(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
              Chat Options
            </h3>

            {/* Buttons */}
            <div className="space-y-3">
              {/* View Profile */}
              <button
                onClick={() => {
                  navigate(`/userprofile/${selectedFriend.id}`);
                  setShowChatMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
              >
                View Profile
              </button>

              {/* Block / Unblock */}
              {isChatBlocked ? (
                <button
                  onClick={() => {
                    handleUnblockUser();
                    setShowChatMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-all"
                >
                  Unblock User
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleBlockUser();
                    setShowChatMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all"
                >
                  Block User
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Add CSS for typing animation */}
      <style jsx>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #f97316;
          color: #f97316;
          box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          animation: dot-typing 1.5s infinite linear;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
          16.667% {
            box-shadow: 9984px -10px 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
          50% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px -10px 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px -10px 0 0 #f97316;
          }
          100% {
            box-shadow: 9984px 0 0 0 #f97316, 9999px 0 0 0 #f97316, 10014px 0 0 0 #f97316;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }

      `}</style>
    </div>
  );
};

export default MessageModel;