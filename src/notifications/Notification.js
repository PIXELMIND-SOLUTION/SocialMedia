import { useState } from "react";
import { 
  Bell, 
  X, 
  Check, 
  Star, 
  Gift, 
  TrendingUp, 
  Users, 
  Mail,
  Settings
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Campaign Performance",
      message: "Your 'Diwali Discount Blast' campaign reached 12,300 people with 1,200 clicks!",
      time: "2 minutes ago",
      unread: true,
      icon: TrendingUp,
      color: "green"
    },
    {
      id: 2,
      type: "info",
      title: "New Form Submission",
      message: "Manoj Kumar submitted a new form via Email channel. Review required.",
      time: "5 minutes ago",
      unread: true,
      icon: Mail,
      color: "blue"
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stars Balance",
      message: "Your stars balance is running low. Add more stars to continue campaigns.",
      time: "10 minutes ago",
      unread: true,
      icon: Star,
      color: "orange"
    },
    {
      id: 4,
      type: "gift",
      title: "Bonus Reward",
      message: "Congratulations! You've earned 50 bonus stars for completing 10 campaigns.",
      time: "1 hour ago",
      unread: false,
      icon: Gift,
      color: "purple"
    },
    {
      id: 5,
      type: "users",
      title: "New Team Member",
      message: "Sarah Johnson has been added to your marketing team workspace.",
      time: "2 hours ago",
      unread: false,
      icon: Users,
      color: "indigo"
    },
    {
      id: 6,
      type: "settings",
      title: "Account Settings Updated",
      message: "Your notification preferences have been successfully updated.",
      time: "3 hours ago",
      unread: false,
      icon: Settings,
      color: "gray"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(true);

  const unreadCount = notifications?.filter(n => n?.unread)?.length || 0;

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === "unread") return notification?.unread;
    if (filter === "read") return !notification?.unread;
    return true;
  }) || [];

  const markAsRead = (id) => {
    setNotifications(prev => prev?.map(notification => 
      notification?.id === id ? { ...notification, unread: false } : notification
    ) || []);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(notification => ({ ...notification, unread: false })) || []);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id) || []);
  };

  const getColorClasses = (color, unread) => {
    const baseColors = {
      green: unread ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200",
      blue: unread ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200",
      orange: unread ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200",
      purple: unread ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200",
      indigo: unread ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-200",
      gray: "bg-gray-50 border-gray-200"
    };
    return baseColors[color] || "bg-gray-50 border-gray-200";
  };

  const getIconColor = (color) => {
    const iconColors = {
      green: "text-green-600 bg-green-100",
      blue: "text-blue-600 bg-blue-100",
      orange: "text-orange-600 bg-orange-100",
      purple: "text-purple-600 bg-purple-100",
      indigo: "text-indigo-600 bg-indigo-100",
      gray: "text-gray-600 bg-gray-100"
    };
    return iconColors[color] || "text-gray-600 bg-gray-100";
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative px-6 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-gray-700" />
            <span className="text-gray-700 font-medium">Show Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Bell size={18} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-orange-100 rounded-lg p-1">
              {["all", "unread", "read"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors capitalize ${
                    filter === filterType
                      ? "bg-white text-orange-900 shadow-sm"
                      : "text-orange-700 hover:text-orange-900"
                  }`}
                >
                  {filterType} {filterType === "unread" && unreadCount > 0 && `(${unreadCount})`}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification?.icon || Bell;
                  return (
                    <div
                      key={notification?.id}
                      className={`p-4 transition-all duration-200 hover:bg-gray-50 ${
                        notification?.unread ? "bg-orange-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification?.color)}`}>
                          <IconComponent size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-semibold ${
                                notification?.unread ? "text-gray-900" : "text-gray-700"
                              }`}>
                                {notification?.title}
                                {notification?.unread && (
                                  <span className="ml-2 w-2 h-2 bg-orange-600 rounded-full inline-block"></span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {notification?.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">{notification?.time}</p>
                            </div>

                            <div className="flex items-center space-x-1 ml-2">
                              {notification?.unread && (
                                <button
                                  onClick={() => markAsRead(notification?.id)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                  title="Mark as read"
                                >
                                  <Check size={14} className="text-gray-500" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification?.id)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                title="Delete notification"
                              >
                                <X size={14} className="text-gray-500" />
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
