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
  ChevronDown
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://social-media-nty4.onrender.com/api/notifications/get-live/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setCounts(data.data.counts);
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

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification._id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification._id !== id));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
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
      like: "text-red-600 bg-red-100",
      comment: "text-blue-600 bg-blue-100",
      follow: "text-green-600 bg-green-100",
      mention: "text-purple-600 bg-purple-100",
      post: "text-orange-600 bg-orange-100",
      message: "text-indigo-600 bg-indigo-100"
    };
    return colors[type] || "text-gray-600 bg-gray-100";
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
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors ${
                        filter === filterOption.key
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{filterOption.label}</span>
                        {filterOption.count > 0 && (
                          <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                            filter === filterOption.key
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
                  return (
                    <div
                      key={notification._id}
                      className={`p-3 sm:p-4 lg:p-5 transition-all duration-200 hover:bg-gray-50 ${
                        !notification.isRead ? "bg-orange-50" : "bg-white"
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
                              <h4 className={`text-xs sm:text-sm lg:text-base font-semibold ${
                                !notification.isRead ? "text-gray-900" : "text-gray-700"
                              }`}>
                                <span className="break-words">{notification.content.title}</span>
                                {!notification.isRead && (
                                  <span className="ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-600 rounded-full inline-block"></span>
                                )}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed break-words">
                                {notification.message}
                              </p>
                              {notification.content.description && (
                                <p className="text-xs text-gray-500 mt-1 italic break-words line-clamp-2">
                                  "{notification.content.description}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">{formatTime(notification.createdAt)}</p>
                            </div>

                            <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="p-1 sm:p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                  title="Mark as read"
                                >
                                  <Check size={12} className="text-gray-500 sm:w-3.5 sm:h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification._id)}
                                className="p-1 sm:p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                title="Delete notification"
                              >
                                <X size={12} className="text-gray-500 sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Preview Image/Video */}
                          {notification.content.preview && notification.postData?.media && (
                            <div className="mt-2">
                              {notification.postData.media[0].type === 'image' ? (
                                <img 
                                  src={notification.content.preview} 
                                  alt="Preview"
                                  className="w-full max-w-xs sm:w-28 md:w-32 h-16 sm:h-18 md:h-20 object-cover rounded-lg border border-gray-200"
                                />
                              ) : (
                                <video 
                                  src={notification.content.preview}
                                  className="w-full max-w-xs sm:w-28 md:w-32 h-16 sm:h-18 md:h-20 object-cover rounded-lg border border-gray-200"
                                  muted
                                />
                              )}
                            </div>
                          )}
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
  );
};

export default Notifications;