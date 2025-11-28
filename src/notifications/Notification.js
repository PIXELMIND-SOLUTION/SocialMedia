import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  FileText,
  Mail,
  Loader2,
  Filter,
  ChevronDown,
  ExternalLink,
  Clock,
  User,
  UserCheck,
  UserX
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [friendStatus, setFriendStatus] = useState({});
  const [processingRequest, setProcessingRequest] = useState(null);

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      fetchFriendStatus();
    }
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/notifications/all-live/${userId}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications);
        console.log("Fetched notifications:", data.data.notifications);
        setCounts(data.data.notifications.length);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      setError('Error loading notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendStatus = async () => {
    try {
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/get-friends/${userId}`);
      const data = await response.json();

      if (data.success) {
        const statusMap = {};
        data.data.forEach(friend => {
          statusMap[friend._id] = friend.status;
        });
        setFriendStatus(statusMap);
      }
    } catch (err) {
      console.error('Error fetching friend status:', err);
    }
  };

  const handleProfile = (id) => {
    if (id === userId) {
      navigate('/myprofile');
    } else {
      navigate(`/userprofile/${id}`);
    }
  }

  const unreadCount = counts.unread || 0;

  const filterOptions = [
    { key: "all", label: "All", count: counts.all },
    { key: "unread", label: "Unread", count: counts.unread },
    { key: "likes", label: "Likes", count: counts.likes },
    { key: "comments", label: "Comments", count: counts.comments },
    { key: "follows", label: "Follows", count: counts.follows },
    { key: "mentions", label: "Mentions", count: counts.mentions }
  ];

  const currentFilter = filterOptions.find(f => f.key === filter);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    if (filter === "likes") return notification.type === "like";
    if (filter === "comments") return notification.type === "comment";
    if (filter === "follows") return notification.type === "follow";
    if (filter === "mentions") return notification.type === "mention";
    if (filter === "posts") return notification.type === "post";
    return true;
  });

  console.log("Filtered notifications:", filteredNotifications);

  // Generate notification content based on type and API data
  const generateNotificationContent = (notification) => {
    const senderName = notification.sender?.fullName || 'Someone';
    const username = notification.sender?.profile?.username || 'user';

    switch (notification.type) {
      case 'like':
        return {
          title: `${senderName} liked your post`,
          message: `${senderName} (@${username}) liked your post`,
          description: "Your post received a like",
          link: notification.post ? `/post/${notification.post}` : '#'
        };
      case 'comment':
        return {
          title: `${senderName} commented on your post`,
          message: `${senderName} (@${username}) commented on your post`,
          description: "New comment on your post",
          link: notification.post ? `/post/${notification.post}` : '#'
        };
      case 'follow':
        return {
          title: `${senderName} wants to follow you`,
          message: `${senderName} (@${username}) sent you a follow request`,
          description: "You have a new follow request",
          link: `/userprofile/${notification.sender?._id}`
        };
      case 'mention':
        return {
          title: `${senderName} mentioned you`,
          message: `${senderName} (@${username}) mentioned you in a comment`,
          description: "You were mentioned in a comment",
          link: notification.post ? `/post/${notification.post}` : '#'
        };
      case 'post':
        return {
          title: `${senderName} created a new post`,
          message: `${senderName} (@${username}) shared a new post`,
          description: "New post from someone you follow",
          link: notification.post ? `/post/${notification.post}` : '#'
        };
      default:
        return {
          title: 'New Notification',
          message: 'You have a new notification',
          description: "Notification",
          link: '#'
        };
    }
  };

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedNotification(null), 300);
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/notifications/read/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev => prev.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        ));
      } else {
        console.error("Failed to mark notification as read:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/notifications/read-all/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
        fetchNotifications(); // Refresh counts
      } else {
        console.error("Failed to mark all notifications as read:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    console.log("Deleting notification with ID:", id);
    try {
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications((prev) => prev.filter((notification) => notification._id !== id));

        if (selectedNotification?._id === id) {
          closeModal();
        }

        console.log("Notification deleted successfully");
        fetchNotifications(); // Refresh notifications and counts
      } else {
        console.error("Failed to delete notification:", data.message || "Unknown error");
        alert("Failed to delete notification. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("An error occurred while deleting the notification.");
    }
  };

  // Handle follow request approval
  const handleApproveRequest = async (notification) => {
    if (!notification.sender?._id) return;

    setProcessingRequest(notification._id);
    try {
      const response = await fetch('https://social-media-nty4.onrender.com/api/approve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          requesterId: notification.sender._id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update friend status locally
        setFriendStatus(prev => ({
          ...prev,
          [notification.sender._id]: 'friends'
        }));
        
        // Delete the notification after successful approval
        await deleteNotification(notification._id);
        
        alert('Follow request approved successfully!');
      } else {
        alert('Failed to approve follow request: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error approving follow request:', error);
      alert('An error occurred while approving the follow request.');
    } finally {
      setProcessingRequest(null);
    }
  };

  // Handle follow request rejection
  const handleRejectRequest = async (notification) => {
    if (!notification.sender?._id) return;

    setProcessingRequest(notification._id);
    try {
      const response = await fetch('https://social-media-nty4.onrender.com/api/reject-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          followerId: notification.sender._id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update friend status locally
        setFriendStatus(prev => ({
          ...prev,
          [notification.sender._id]: 'rejected'
        }));
        
        // Delete the notification after successful rejection
        await deleteNotification(notification._id);
        
        alert('Follow request rejected successfully!');
      } else {
        alert('Failed to reject follow request: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error rejecting follow request:', error);
      alert('An error occurred while rejecting the follow request.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like": return Heart;
      case "comment": return MessageCircle;
      case "follow": return UserPlus;
      case "mention": return AtSign;
      case "post": return FileText;
      case "message": return Mail;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    const colors = {
      like: "text-orange-600 bg-orange-100",
      comment: "text-orange-600 bg-orange-100",
      follow: "text-orange-600 bg-orange-100",
      mention: "text-orange-600 bg-orange-100",
      post: "text-orange-600 bg-orange-100",
      message: "text-orange-600 bg-orange-100"
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  const getGradientColor = (type) => {
    const gradients = {
      like: "from-orange-500 to-amber-500",
      comment: "from-orange-500 to-amber-500",
      follow: "from-orange-500 to-amber-500",
      mention: "from-orange-500 to-amber-500",
      post: "from-orange-500 to-amber-500",
      message: "from-orange-500 to-amber-500"
    };
    return gradients[type] || "from-gray-500 to-gray-600";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:scale-105"
        >
          <div className="flex items-center space-x-2">
            <Bell size={18} className="text-orange-600 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base text-gray-700 font-medium">Show Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 min-w-5 sm:min-w-6 h-5 sm:h-6 px-1 sm:px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6">
        <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <Bell size={16} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="min-w-5 sm:min-w-6 h-5 sm:h-6 px-1 sm:px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-600 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              {/* Filter Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Filter size={14} className="text-orange-600 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {currentFilter?.label || "Filter"}
                      {currentFilter?.count > 0 && ` (${currentFilter.count})`}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform sm:w-4 sm:h-4 ${showFilterMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showFilterMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden">
                    {filterOptions.map((filterOption) => (
                      <button
                        key={filterOption.key}
                        onClick={() => {
                          setFilter(filterOption.key);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors ${filter === filterOption.key
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filterOption.label}</span>
                          {filterOption.count > 0 && (
                            <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${filter === filterOption.key
                              ? "bg-white/20"
                              : "bg-gray-100 text-gray-600"
                              }`}>
                              {filterOption.count}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-2 sm:mt-3 text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] lg:max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-8 sm:p-12 text-center">
                  <Loader2 size={40} className="mx-auto text-orange-500 animate-spin mb-3 sm:w-12 sm:h-12" />
                  <p className="text-sm sm:text-base text-gray-500">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="p-6 sm:p-8 text-center">
                  <Bell size={40} className="mx-auto text-red-300 mb-3 sm:w-12 sm:h-12" />
                  <p className="text-sm sm:text-base text-red-500 mb-3">{error}</p>
                  <button
                    onClick={fetchNotifications}
                    className="px-4 py-2 text-sm sm:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <Bell size={40} className="mx-auto text-gray-300 mb-3 sm:w-12 sm:h-12" />
                  <p className="text-sm sm:text-base text-gray-500">No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const content = generateNotificationContent(notification);
                    const currentStatus = friendStatus[notification.sender?._id];
                    
                    return (
                      <div
                        key={notification._id}
                        onClick={() => openNotificationModal(notification)}
                        className={`p-3 sm:p-4 lg:p-5 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-orange-50" : "bg-white"
                          }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          {/* Sender Profile Image */}
                          {notification.sender?.profile?.image ? (
                            <img
                              src={notification.sender.profile.image}
                              alt={notification.sender.fullName}
                              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                              <IconComponent size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-xs sm:text-sm lg:text-base font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"
                                  }`}>
                                  <span className="break-words">{content.title}</span>
                                  {!notification.isRead && (
                                    <span className="ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-600 rounded-full inline-block"></span>
                                  )}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed break-words line-clamp-2">
                                  {content.message}
                                </p>
                                
                                {/* Show current status for follow requests */}
                                {notification.type === 'follow' && currentStatus && (
                                  <div className="mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      currentStatus === 'friends' 
                                        ? 'bg-green-100 text-green-800'
                                        : currentStatus === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      Status: {currentStatus}
                                    </span>
                                  </div>
                                )}
                                
                                <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">{formatTime(notification.createdAt)}</p>
                              </div>

                              <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification._id);
                                  }}
                                  className="p-1 sm:p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                  title="Delete notification"
                                >
                                  <X size={12} className="text-gray-500 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-6 bg-gradient-to-r ${getGradientColor(selectedNotification.type)}`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={20} className="text-white" />
              </button>

              <div className="flex items-center space-x-4">
                {selectedNotification.sender?.profile?.image ? (
                  <img
                    src={selectedNotification.sender.profile.image}
                    alt={selectedNotification.sender.fullName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => handleProfile(selectedNotification.sender._id)}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => handleProfile(selectedNotification.sender._id)}
                  >
                    {(() => {
                      const IconComponent = getNotificationIcon(selectedNotification.type);
                      return <IconComponent size={28} className="text-white" />;
                    })()}
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {generateNotificationContent(selectedNotification).title}
                  </h3>
                  <div 
                    className="flex items-center space-x-2 text-white/90 text-sm cursor-pointer hover:text-white transition-colors" 
                    onClick={() => handleProfile(selectedNotification.sender._id)}
                  >
                    <User size={14} />
                    <span>{selectedNotification.sender?.fullName || 'Unknown User'}</span>
                    <span>@{selectedNotification.sender?.profile?.username || 'user'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {/* Timestamp */}
                <div className="flex items-center space-x-2 text-gray-500 text-sm bg-gray-50 rounded-lg p-3">
                  <Clock size={16} />
                  <span>{formatFullDate(selectedNotification.createdAt)}</span>
                </div>

                {/* Message */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                  <p className="text-gray-800 leading-relaxed">
                    {generateNotificationContent(selectedNotification).message}
                  </p>
                </div>

                {/* Description */}
                {generateNotificationContent(selectedNotification).description && (
                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Content</h4>
                    <p className="text-gray-700 italic">
                      "{generateNotificationContent(selectedNotification).description}"
                    </p>
                  </div>
                )}

                {/* Follow Request Actions */}
                {selectedNotification.type === 'follow' && (
                  <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
                    <h4 className="text-sm font-semibold text-orange-700 mb-3">Follow Request</h4>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveRequest(selectedNotification)}
                        disabled={processingRequest === selectedNotification._id}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingRequest === selectedNotification._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <UserCheck size={16} />
                        )}
                        <span>
                          {processingRequest === selectedNotification._id ? 'Processing...' : 'Accept'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(selectedNotification)}
                        disabled={processingRequest === selectedNotification._id}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingRequest === selectedNotification._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <UserX size={16} />
                        )}
                        <span>
                          {processingRequest === selectedNotification._id ? 'Processing...' : 'Reject'}
                        </span>
                      </button>
                    </div>
                    
                    {/* Current Status */}
                    {friendStatus[selectedNotification.sender?._id] && (
                      <div className="mt-3 text-center">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          friendStatus[selectedNotification.sender._id] === 'friends' 
                            ? 'bg-green-100 text-green-800'
                            : friendStatus[selectedNotification.sender._id] === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          Current Status: {friendStatus[selectedNotification.sender._id]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => deleteNotification(selectedNotification._id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Delete</span>
              </button>

              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Notifications;