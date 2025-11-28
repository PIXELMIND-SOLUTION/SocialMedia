import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, MessageSquare, X, Paperclip, Trash2, UserX, UserCheck } from 'lucide-react';
import io from 'socket.io-client';

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
  const [isChatBlocked, setIsChatBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;
  const userName = storedUser?.fullName || 'You';

  const API_BASE = 'https://apisocial.atozkeysolution.com/api';
  const SOCKET_URL = 'https://apisocial.atozkeysolution.com';

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      query: { 
        userId,
        userName 
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('userStatusUpdate', (data) => {
      console.log('🟢 User status update:', data);
      setOnlineUsers(prev => {
        const newOnlineUsers = new Set(prev);
        if (data.isOnline) {
          newOnlineUsers.add(data.userId);
        } else {
          newOnlineUsers.delete(data.userId);
        }
        return newOnlineUsers;
      });

      setFriends(prev => prev.map(friend => {
        if (friend.id === data.userId) {
          return {
            ...friend,
            isOnline: data.isOnline,
            lastSeen: data.lastSeen
          };
        }
        return friend;
      }));
    });

    newSocket.on('onlineUsers', (userIds) => {
      console.log('👥 Online users:', userIds);
      setOnlineUsers(new Set(userIds));
      
      setFriends(prev => prev.map(friend => ({
        ...friend,
        isOnline: userIds.includes(friend.id)
      })));
    });

    newSocket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);
      
      if (selectedFriend && message.chatId === selectedFriend.chatId) {
        const newMsg = transformMessage(message);
        setMessages(prev => [...prev, newMsg]);
        markAsRead(selectedFriend.chatId);
      }
      
      // Update last message preview for the friend
      setFriends(prev => prev.map(friend => {
        if (friend.chatId === message.chatId) {
          return {
            ...friend,
            lastMessagePreview: {
              text: getMessagePreviewText(message),
              time: formatTime(message.createdAt),
              isMe: message.sender._id === userId,
              isDeletedForMe: message.deletedFor?.includes(userId)
            }
          };
        }
        return friend;
      }));
    });

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

    newSocket.on('chatBlocked', (data) => {
      console.log('🚫 Chat blocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(true);
        setBlockedBy(data.userId);
      }
    });

    newSocket.on('chatUnblocked', (data) => {
      console.log('✅ Chat unblocked:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setIsChatBlocked(false);
        setBlockedBy(null);
      }
    });

    newSocket.on('userTyping', (data) => {
      console.log('⌨️ User typing:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId && data.userId !== userId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.chatId]: data.userName
        }));

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

    newSocket.on('userStopTyping', (data) => {
      console.log('💤 User stopped typing:', data);
      if (selectedFriend && data.chatId === selectedFriend.chatId) {
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          delete newTyping[data.chatId];
          return newTyping;
        });
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [userId, selectedFriend]);

  // Format time helper
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      mediaUrl = msg.mediaUrl[0];
      msgType = msg.type;
      displayText = msg.text || (msgType === 'image' ? '📷 Image' : '🎥 Video');
    } else if (msg.content?.mediaUrl && msg.content.mediaUrl.length > 0) {
      mediaUrl = msg.content.mediaUrl[0];
      msgType = msg.type;
      displayText = msg.content?.text || (msgType === 'image' ? '📷 Image' : '🎥 Video');
    } else if (msg.text) {
      displayText = msg.text;
      msgType = 'text';
    } else if (msg.content?.text) {
      displayText = msg.content.text;
      msgType = 'text';
    } else {
      displayText = '[No content]';
    }

    return {
      id: msg._id,
      chatId: msg.chatId,
      friendId: selectedFriend?.id,
      text: displayText,
      time: formatTime(msg.createdAt),
      isMe: msg.sender?._id === userId || msg.sender === userId,
      timestamp: new Date(msg.createdAt).getTime(),
      type: msgType,
      mediaUrl: mediaUrl,
      senderName: msg.sender?.fullName || 'Unknown',
      deletedFor: msg.deletedFor || [],
      isDeletedForMe: isDeletedForMe,
      status: msg.isRead ? 'read' : 'sent'
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
    if (msg.text) return msg.text;
    if (msg.content?.text) return msg.content.text;
    
    return '[No content]';
  };

  // Handle typing events
  const handleTyping = () => {
    if (!socket || !selectedFriend || isChatBlocked) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        chatId: selectedFriend.chatId,
        userId: userId,
        userName: userName
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stopTyping', {
        chatId: selectedFriend.chatId,
        userId: userId
      });
    }, 1000);
  };

  // Get or create chat
  const getOrCreateChat = async (friendId) => {
    try {
      console.log('🔄 Creating/Getting chat for friend:', friendId);
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId: friendId }),
      });

      const data = await res.json();
      console.log('💬 Chat response:', data);
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create chat');
      }

      return data.data._id;
    } catch (err) {
      console.error('❌ Error creating chat:', err);
      throw err;
    }
  };

  // Get last message for a chat
  const getLastMessage = async (chatId) => {
    try {
      console.log('📝 Getting last message for chat:', chatId);
      const res = await fetch(`${API_BASE}/last-message?chatId=${chatId}`);
      const data = await res.json();
      console.log('📨 Last message response:', data);
      
      if (res.ok && data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting last message:', err);
      return null;
    }
  };

  // Fetch friends with chats and last messages
  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const fetchFriendsAndChats = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching friends for user:', userId);
        
        // Fetch friends
        const friendsRes = await fetch(`${API_BASE}/get-friends/${userId}`);
        if (!friendsRes.ok) throw new Error('Failed to fetch friends');
        
        const friendsData = await friendsRes.json();
        console.log('👥 Friends response:', friendsData);
        
        if (!friendsData.success) throw new Error(friendsData.message || 'Invalid friends response');

        const mutualFriends = friendsData.data.filter((f) => f.status === 'friends');
        console.log('🤝 Mutual friends:', mutualFriends);
        
        // Transform friends data
        const transformedFriends = mutualFriends.map((f) => ({
          id: f._id,
          name: f.fullName,
          avatar: (f.profile?.image || '').trim() || 
                 f.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
          email: f.email,
          isOnline: false
        }));

        console.log('👤 Transformed friends:', transformedFriends);

        // Get user chats to find existing chat IDs
        console.log('🔄 Fetching user chats...');
        const chatsRes = await fetch(`${API_BASE}/chats/${userId}`);
        const chatsData = await chatsRes.json();
        console.log('💬 User chats response:', chatsData);

        let existingChats = [];
        if (chatsData.success && chatsData.data) {
          existingChats = chatsData.data;
        }

        // Get chat IDs and last messages for each friend
        const friendsWithChats = await Promise.all(
          transformedFriends.map(async (friend) => {
            try {
              let chatId = null;
              let lastMessagePreview = null;

              // Check if chat already exists
              const existingChat = existingChats.find(chat => 
                chat.participants?.some(p => p._id === friend.id)
              );

              if (existingChat) {
                chatId = existingChat._id;
                console.log(`✅ Found existing chat ${chatId} for friend ${friend.name}`);
              } else {
                // Create new chat
                chatId = await getOrCreateChat(friend.id);
                console.log(`✅ Created new chat ${chatId} for friend ${friend.name}`);
              }

              // Get last message
              if (chatId) {
                const lastMessage = await getLastMessage(chatId);
                if (lastMessage) {
                  lastMessagePreview = {
                    text: getMessagePreviewText(lastMessage),
                    time: formatTime(lastMessage.createdAt),
                    isMe: lastMessage.sender?._id === userId || lastMessage.sender === userId,
                    isDeletedForMe: lastMessage.deletedFor?.includes(userId)
                  };
                }
              }

              return { 
                ...friend, 
                chatId, 
                lastMessagePreview 
              };
            } catch (err) {
              console.warn(`❌ Failed to process friend ${friend.name}:`, err);
              return { ...friend, chatId: null, lastMessagePreview: null };
            }
          })
        );

        const validFriends = friendsWithChats.filter(friend => friend.chatId !== null);
        console.log('✅ Final friends list with chats:', validFriends);
        setFriends(validFriends);

      } catch (err) {
        console.error('❌ Error loading friends and chats:', err);
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndChats();
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
    if (!fetchingMore && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, fetchingMore]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fetch messages for a chat
  const fetchMessages = async (chatId, pageNum = 1) => {
    if (fetchingMore) return;
    try {
      setFetchingMore(true);
      console.log('🔄 Fetching messages for chat:', chatId, 'page:', pageNum);
      const res = await fetch(`${API_BASE}/messages/${chatId}?page=${pageNum}&limit=20`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📨 Messages API response:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch messages');
      }

      if (!data.data || !Array.isArray(data.data)) {
        console.warn('⚠️ No messages array in response, using empty array');
        setMessages([]);
        return;
      }

      console.log('📝 Raw messages from API:', data.data);

      const newMessages = data.data.map((msg) => transformMessage(msg));
      console.log('🔄 Transformed messages:', newMessages);

      // Sort messages by timestamp (oldest first)
      const sortedMessages = newMessages.sort((a, b) => a.timestamp - b.timestamp);
      console.log('📊 Sorted messages:', sortedMessages);

      setMessages(pageNum === 1 ? sortedMessages : [...sortedMessages, ...messages]);
      setHasMore(pageNum < (data.totalPages || 1));
      setPage(pageNum);

    } catch (err) {
      console.error('❌ Error fetching messages:', err);
      setError('Failed to load messages: ' + err.message);
    } finally {
      setFetchingMore(false);
    }
  };

  // Check if chat is blocked
  const checkChatBlockStatus = async (chatId) => {
    try {
      console.log('🔄 Checking block status for chat:', chatId);
      const res = await fetch(`${API_BASE}/chats/${userId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('🚫 Chat block status response:', data);
        if (data.success && data.data) {
          const chat = data.data.find(chat => chat._id === chatId);
          if (chat) {
            setIsChatBlocked(chat.isBlocked || false);
            setBlockedBy(chat.blockedBy || null);
            console.log('💬 Chat block status:', { isBlocked: chat.isBlocked, blockedBy: chat.blockedBy });
          }
        }
      }
    } catch (err) {
      console.error('❌ Error checking chat block status:', err);
    }
  };

  // Handle scroll for pagination
  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    if (scrollTopValue === 0 && hasMore && !fetchingMore && selectedFriend?.chatId) {
      const currentHeight = messagesContainerRef.current?.scrollHeight || 0;
      fetchMessages(selectedFriend.chatId, page + 1).then(() => {
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
      console.log('📖 Marking messages as read for chat:', chatId);
      
      // Get unread messages for this chat
      const unreadRes = await fetch(`${API_BASE}/messages/unread/${userId}`);
      if (!unreadRes.ok) return;
      
      const unreadData = await unreadRes.json();
      console.log('📋 Unread messages:', unreadData);
      
      if (unreadData.success && unreadData.data) {
        const messageIds = unreadData.data
          .filter(msg => msg.chatId === chatId)
          .map(msg => msg._id);

        console.log('📍 Message IDs to mark as read:', messageIds);

        if (messageIds.length > 0) {
          await fetch(`${API_BASE}/messages/read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageIds, userId }),
          });

          // Update UI
          setMessages(prev => prev.map(msg => 
            messageIds.includes(msg.id) ? { ...msg, status: 'read' } : msg
          ));
        }
      }
    } catch (err) {
      console.warn('⚠️ Failed to mark as read:', err);
    }
  };

  // Select friend and load messages
  const handleSelectFriend = async (friend) => {
    if (!friend.chatId) {
      alert('Chat not available for this friend');
      return;
    }
    
    console.log('👤 Selecting friend:', friend.name, 'chatId:', friend.chatId);
    setSelectedFriend(friend);
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    setIsChatBlocked(false);
    setBlockedBy(null);
    
    await fetchMessages(friend.chatId, 1);
    await markAsRead(friend.chatId);
    await checkChatBlockStatus(friend.chatId);
    
    if (isMobileView) setIsMobileSidebarOpen(false);
  };

  // Block/Unblock user
  const handleBlockUser = async () => {
    if (!selectedFriend?.chatId) return;

    try {
      console.log('🚫 Blocking user for chat:', selectedFriend.chatId);
      const res = await fetch(`${API_BASE}/chat/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedFriend.chatId,
          userId: userId
        }),
      });

      const result = await res.json();
      console.log('✅ Block response:', result);
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to block user');
      }

      setIsChatBlocked(true);
      setBlockedBy(userId);
    } catch (err) {
      console.error('❌ Error blocking user:', err);
      alert('Failed to block user: ' + err.message);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedFriend?.chatId) return;

    try {
      console.log('✅ Unblocking user for chat:', selectedFriend.chatId);
      const res = await fetch(`${API_BASE}/chat/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedFriend.chatId,
          userId: userId
        }),
      });

      const result = await res.json();
      console.log('✅ Unblock response:', result);
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to unblock user');
      }

      setIsChatBlocked(false);
      setBlockedBy(null);
    } catch (err) {
      console.error('❌ Error unblocking user:', err);
      alert('Failed to unblock user: ' + err.message);
    }
  };

  // Delete message for me only
  const handleDeleteForMe = async (messageId) => {
    if (!messageId || !userId) return;

    try {
      console.log('🗑️ Deleting message for me:', messageId);
      const res = await fetch(`${API_BASE}/message`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: messageId,
          userId: userId
        }),
      });

      const result = await res.json();
      console.log('✅ Delete for me response:', result);
      
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
      console.error('❌ Error deleting message for me:', err);
      alert('Failed to delete message: ' + err.message);
    }
  };

  // Delete message for everyone
  const handleDeleteForEveryone = async (messageId) => {
    if (!messageId || !userId) return;

    try {
      console.log('🗑️ Deleting message for everyone:', messageId);
      const res = await fetch(`${API_BASE}/messages/${messageId}/${userId}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      console.log('✅ Delete for everyone response:', result);
      
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
      console.error('❌ Error deleting message for everyone:', err);
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
      socket.emit('stopTyping', {
        chatId: selectedFriend.chatId,
        userId: userId
      });
    }

    // Send text message
    if (hasText) {
      const payload = {
        chatId,
        senderId: userId,
        receiverId,
        type: 'text',
        text: message.trim(),
      };

      try {
        console.log('📤 Sending text message:', payload);
        const res = await fetch(`${API_BASE}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        console.log('✅ Send message response:', result);
        
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

        const newMsg = transformMessage(result.data);
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
      } catch (err) {
        console.error('❌ Error sending message:', err);
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
      formData.append('file', file);

      try {
        console.log('📤 Sending media message:', { chatId, type: file.type.startsWith('image') ? 'image' : 'video' });
        const res = await fetch(`${API_BASE}/message`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        console.log('✅ Send media response:', result);
        
        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to send');

        const newMsg = transformMessage(result.data);
        setMessages(prev => [...prev, newMsg]);
        fileInputRef.current.value = '';
        setMediaPreview(null);
      } catch (err) {
        console.error('❌ Error sending media:', err);
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
  const getFilteredFriendsWithMessages = () => {
    if (!searchQuery) return friends;
    return friends.filter(friend => {
      const nameMatch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
      const msgMatch = friend.lastMessagePreview?.text?.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || msgMatch;
    });
  };

  // Get status indicator color
  const getStatusColor = (friend) => {
    if (friend.isOnline) return 'bg-green-500';
    return 'bg-gray-400';
  };

  // Get status text
  const getStatusText = (friend) => {
    if (friend.isOnline) return 'Online';
    if (friend.lastSeen) {
      return `Last seen ${new Date(friend.lastSeen).toLocaleTimeString()}`;
    }
    return 'Offline';
  };

  // Loading / Error UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-orange-500 font-semibold">Loading conversations...</div>
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
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(friend)}`} />
                          </div>
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="font-semibold text-gray-800 truncate">{friend.name}</div>
                            {lastMsg ? (
                              <div className={`text-sm truncate ${lastMsg.isDeletedForMe ? 'text-gray-500 italic' : 'text-gray-500'}`}>
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
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedFriend)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{selectedFriend.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedFriend.isOnline ? 'Online' : 'Offline'}
                      {typingUsers[selectedFriend.chatId] && (
                        <span className="text-orange-500 ml-2">• typing...</span>
                      )}
                      {isChatBlocked && ` • Chat ${blockedBy === userId ? 'blocked by you' : 'blocked by user'}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isChatBlocked ? (
                    <button
                      onClick={handleUnblockUser}
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                      title="Unblock user"
                    >
                      <UserCheck size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleBlockUser}
                      className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                      title="Block user"
                    >
                      <UserX size={18} />
                    </button>
                  )}
                  <MoreVertical size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" />
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
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
                          <Send size={28} />
                        </div>
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`relative max-w-[70%] p-3 rounded-2xl break-words ${msg.isMe ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-800 border border-gray-200/80 shadow-md shadow-black/5'} ${msg.isDeletedForMe ? 'opacity-70' : ''}`}
                            >
                              {msg.type === 'deleted' ? (
                                <div className="italic text-gray-500">
                                  {msg.text}
                                </div>
                              ) : msg.type === 'image' && msg.mediaUrl ? (
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
                                  {msg.text && msg.text !== '📷 Image' && (
                                    <div className={`mt-2 ${msg.isMe ? 'text-white/90' : 'text-gray-700'}`}>
                                      {msg.text}
                                    </div>
                                  )}
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
                                  {msg.text && msg.text !== '🎥 Video' && (
                                    <div className={`mt-2 ${msg.isMe ? 'text-white/90' : 'text-gray-700'}`}>
                                      {msg.text}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="mb-1">{msg.text}</div>
                              )}
                              
                              <div className="flex items-center justify-between mt-1">
                                <div className={`text-xs ${msg.isMe ? 'text-white/80' : 'text-gray-500'}`}>
                                  {msg.time}
                                  {msg.isMe && (
                                    <span className="ml-1">
                                      {msg.status === 'read' ? ' ✓✓' : ' ✓'}
                                    </span>
                                  )}
                                </div>
                                
                                <button
                                  onClick={(e) => handleMessageMenuToggle(msg.id, e)}
                                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                  <MoreVertical size={14} />
                                </button>
                              </div>

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
                        className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed hover:shadow-orange-500/50"
                      >
                        <Send size={18} />
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
    </div>
  );
};

export default MessageModel;