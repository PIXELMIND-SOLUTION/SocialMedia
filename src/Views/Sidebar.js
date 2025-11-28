import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBell,
  FaCommentDots,
  FaPlus,
  FaUserFriends,
  FaBullhorn,
  FaWallet,
  FaCog,
  FaTimes,
  FaBars,
} from 'react-icons/fa';
import axios from 'axios';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMenu, setShowMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 useEffect(() => {
  if (!userId) return;

  const fetchData = async () => {
    try {
      // Fetch notification count
      const notifRes = await axios.get(
        `https://apisocial.atozkeysolution.com/api/notifications/all-live/${userId}`
      );
      if (notifRes.data.success) {
        setNotificationCount(notifRes.data.data.counts.unread || 0);
      }

      // Fetch unread messages count
      const msgRes = await axios.get(
        `https://apisocial.atozkeysolution.com/api/messages/unread/${userId}`
      );
      if (msgRes.data.success && msgRes.data.data?.unreadCount !== undefined) {
        setMessageCount(msgRes.data.data.unreadCount);
      }
      
    } catch (error) {
      console.error("Error refreshing counts:", error);
    }
  };

  // Initial fetch
  fetchData();

  // Refresh every 2 seconds (2000ms)
  const interval = setInterval(fetchData, 2000);

  return () => clearInterval(interval);
}, [userId]);


  const navItems = [
    { to: '/home', icon: <FaHome />, title: 'Home' },
    { to: '/messages', icon: <FaCommentDots />, title: 'Messages', count: messageCount },
    { to: '/notification', icon: <FaBell />, title: 'Notifications', count: notificationCount },
    { to: '/create', icon: <FaPlus />, title: 'Create' },
    { to: '/watch', icon: <FaUserFriends />, title: 'Watch' },
    { to: '/campaign', icon: <FaBullhorn />, title: 'Campaign' },
    { to: '/mywallet', icon: <FaWallet />, title: 'Wallet' },
    { to: '/settings', icon: <FaCog />, title: 'Settings' }
  ];

  const isActiveRoute = (path) => location.pathname === path;

  // Handle restricted routes
  const handleRestrictedRoute = (to) => {
    if (['/campaign', '/watch', '/mywallet'].includes(to)) {
      setShowComingSoon(true);
    } else {
      // For other routes, let Link handle (but we won't use this in Link now)
      navigate(to);
    }
  };

  // Close modal
  const closeComingSoon = () => setShowComingSoon(false);

  // Go Home from modal
  const goToHome = () => {
    closeComingSoon();
    navigate('/home');
  };

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Mobile Floating Bottom Navigation */}
        <div
          className="d-flex justify-content-around align-items-center fixed-bottom mx-2 mb-2 shadow-lg"
          style={{
            height: "65px",
            padding: "0.75rem 1rem",
            zIndex: 1000,
            borderRadius: "25px",
            backdropFilter: "blur(20px)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(244,244,247,0.95))",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Home Icon */}
          <Link
            to="/home"
            className={`text-decoration-none d-flex flex-column align-items-center nav-item ${isActiveRoute('/home') ? 'active' : ''}`}
            style={{
              color: isActiveRoute('/home') ? '#f47c31' : '#6b7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="icon-wrapper position-relative">
              <FaHome className="fs-5" />
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500' }}>Home</small>
          </Link>

          {/* Notifications */}
          <Link
            to="/notification"
            className={`text-decoration-none d-flex flex-column align-items-center nav-item ${isActiveRoute('/notification') ? 'active' : ''}`}
            style={{
              color: isActiveRoute('/notification') ? '#f47c31' : '#6b7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="icon-wrapper position-relative">
              <FaBell className="fs-5" />
              {notificationCount > 0 && (
                <span className="notification-badge-mobile">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500' }}>Alerts</small>
          </Link>

          {/* Create */}
          <Link
            to="/create"
            className="text-decoration-none d-flex flex-column align-items-center position-relative"
            style={{ transform: 'translateY(-5px)' }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-lg"
              style={{
                width: "50px",
                height: "50px",
                background: "linear-gradient(135deg, #f47c31, #ff6b35)",
                boxShadow: "0 4px 15px rgba(244, 124, 49, 0.4)",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <FaPlus className="fs-5" />
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500', color: '#6b7280', marginTop: '2px' }}>
              Create
            </small>
          </Link>

          {/* Messages */}
          <Link
            to="/messages"
            className={`text-decoration-none d-flex flex-column align-items-center nav-item ${isActiveRoute('/messages') ? 'active' : ''}`}
            style={{
              color: isActiveRoute('/messages') ? '#f47c31' : '#6b7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="icon-wrapper position-relative">
              <FaCommentDots className="fs-5" />
              {messageCount > 0 && (
                <span className="message-badge-mobile">
                  {messageCount > 99 ? '99+' : messageCount}
                </span>
              )}
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500' }}>Chats</small>
          </Link>

          {/* Menu */}
          <button
            className="border-0 bg-transparent d-flex flex-column align-items-center nav-item"
            onClick={() => setShowMenu(!showMenu)}
            style={{
              color: showMenu ? '#f47c31' : '#6b7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="icon-wrapper">
              {showMenu ? <FaTimes className="fs-5" /> : <FaBars className="fs-5" />}
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500' }}>Menu</small>
          </button>
        </div>

        {/* Floating Bubble Menu */}
        {showMenu && (
          <div
            className="position-fixed d-flex flex-column align-items-center gap-2"
            style={{
              bottom: "110px",
              right: "30px",
              zIndex: 1001,
            }}
          >
            {navItems
              .filter((item) => !['/home', '/create', '/notification', '/messages'].includes(item.to))
              .reverse()
              .map((item, index) => {
                const isRestricted = ['/campaign', '/watch', '/mywallet'].includes(item.to);
                const clickHandler = () => {
                  setShowMenu(false);
                  if (isRestricted) {
                    handleRestrictedRoute(item.to);
                  } else {
                    navigate(item.to);
                  }
                };

                return (
                  <div
                    key={index}
                    onClick={clickHandler}
                    className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg bubble-btn position-relative"
                    style={{
                      width: "60px",
                      height: "60px",
                      textDecoration: "none",
                      background: "linear-gradient(135deg, #f47c31, #ff6b35)",
                      transform: "scale(0)",
                      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                      animation: `bubbleAppear 0.5s ${index * 0.1}s forwards`,
                      border: "2px solid rgba(255,255,255,0.2)",
                      cursor: 'pointer',
                    }}
                    title={item.title}
                  >
                    <span className="fs-5">{item.icon}</span>
                    {item.count > 0 && (
                      <span className="bubble-menu-badge">
                        {item.count > 99 ? '99+' : item.count}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Backdrop */}
        {showMenu && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 999,
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowMenu(false)}
          />
        )}

        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              zIndex: 2000,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="bg-white rounded-4 p-4 p-md-5 text-center shadow-lg"
              style={{ maxWidth: '400px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="d-inline-block p-3 rounded-circle bg-orange-100 mb-3">
                  <FaBullhorn className="fs-1 text-orange-600" />
                </div>
                <h3 className="mb-3 font-weight-bold">Coming Soon!</h3>
                <p className="text-muted">
                  This feature is under development. Stay tuned for exciting updates!
                </p>
              </div>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-primary rounded-pill py-2 px-4"
                  onClick={goToHome}
                >
                  Go Home
                </button>
                <button
                  className="btn btn-outline-secondary rounded-pill py-2 px-4"
                  onClick={closeComingSoon}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes bubbleAppear {
              0% {
                opacity: 0;
                transform: scale(0) translateY(20px);
              }
              50% {
                opacity: 0.8;
                transform: scale(1.1) translateY(-5px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            .notification-badge-mobile,
            .message-badge-mobile {
              position: absolute;
              top: -5px;
              right: -5px;
              min-width: 18px;
              height: 18px;
              padding: 0 4px;
              background: linear-gradient(135deg, #ef4444, #dc2626);
              color: white;
              font-size: 0.6rem;
              font-weight: bold;
              border-radius: 9px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              animation: pulse 2s infinite;
            }

            .message-badge-mobile {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            }

            .bubble-menu-badge {
              position: absolute;
              top: -5px;
              right: -5px;
              min-width: 20px;
              height: 20px;
              padding: 0 4px;
              background: linear-gradient(135deg, #ef4444, #dc2626);
              color: white;
              font-size: 0.65rem;
              font-weight: bold;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid rgba(255,255,255,0.8);
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
              }
              70% {
                box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
              }
            }

            @media (max-width: 768px) {
              body {
                padding-bottom: 100px !important;
              }
            }
          `}
        </style>
      </>
    );
  }

  // Desktop view
  return (
    <>
      <div
        className="d-flex flex-column align-items-center position-sticky vh-100"
        style={{
          width: '80px',
          height: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          top: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(226, 232, 240, 0.5)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div
          className="rounded-circle mb-5 d-flex align-items-center justify-content-center shadow-sm"
          style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #f47c31, #ff6b35)',
            boxShadow: '0 4px 15px rgba(244, 124, 49, 0.3)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/home')}
        >
          <img
            src="/logo.png"
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Navigation */}
        <div className="d-flex flex-column align-items-center gap-3 flex-grow-1">
          {navItems
            .filter((item) => item.to !== "/settings")
            .map((item, index) => {
              const isRestricted = ['/campaign', '/watch', '/mywallet'].includes(item.to);
              const isActive = isActiveRoute(item.to);
              const hasCount = item.count > 0;

              const handleClick = (e) => {
                if (isRestricted) {
                  e.preventDefault();
                  handleRestrictedRoute(item.to);
                }
              };

              return (
                <Link
                  to={item.to}
                  key={index}
                  className="text-decoration-none nav-link-modern position-relative"
                  title={item.title}
                  style={{
                    color: isActive ? '#f47c31' : '#64748b',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={handleClick}
                >
                  <div
                    className="rounded-xl d-flex align-items-center justify-content-center position-relative"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(244, 124, 49, 0.1), rgba(255, 107, 53, 0.1))'
                        : 'transparent',
                      border: isActive ? '1px solid rgba(244, 124, 49, 0.2)' : '1px solid transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <span className="fs-5 position-relative z-index-2">{item.icon}</span>

                    {isActive && (
                      <div
                        className="position-absolute rounded-circle active-indicator"
                        style={{
                          width: '6px',
                          height: '6px',
                          background: 'linear-gradient(135deg, #f47c31, #ff6b35)',
                          top: '8px',
                          right: '8px',
                          boxShadow: '0 2px 8px rgba(244, 124, 49, 0.4)',
                        }}
                      />
                    )}

                    {hasCount && (
                      <span className={`position-absolute desktop-badge ${item.to === '/notification' ? 'notification-badge' :
                        item.to === '/messages' ? 'message-badge' : 'default-badge'
                        }`}>
                        {item.count > 99 ? '99+' : item.count}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>

        {/* Settings */}
        <div className="mt-auto">
          <Link
            to="/settings"
            className="text-decoration-none nav-link-modern"
            title="Settings"
            style={{
              color: isActiveRoute('/settings') ? '#f47c31' : '#64748b',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              className="rounded-xl d-flex align-items-center justify-content-center"
              style={{
                width: '50px',
                height: '50px',
                background: isActiveRoute('/settings')
                  ? 'linear-gradient(135deg, rgba(244, 124, 49, 0.1), rgba(255, 107, 53, 0.1))'
                  : 'transparent',
                border: isActiveRoute('/settings') ? '1px solid rgba(244, 124, 49, 0.2)' : '1px solid transparent',
                backdropFilter: isActiveRoute('/settings') ? 'blur(10px)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <FaCog className="fs-5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Coming Soon Modal (Desktop) */}
      {showComingSoon && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 2000,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="bg-white rounded-4 p-4 p-md-5 text-center shadow-lg"
            style={{ maxWidth: '500px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="d-inline-block p-3 rounded-circle bg-orange-100 mb-3">
                <FaBullhorn className="fs-1 text-orange-600" />
              </div>
              <h3 className="mb-3" style={{ fontWeight: '700', color: '#333' }}>Coming Soon!</h3>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                We're working hard to bring you amazing new features. Stay tuned!
              </p>
            </div>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button
                className="btn btn-primary rounded-pill px-4 py-2"
                style={{ minWidth: '140px', fontWeight: '600' }}
                onClick={goToHome}
              >
                Go Home
              </button>
              <button
                className="btn btn-outline-secondary rounded-pill px-4 py-2"
                style={{ minWidth: '140px', fontWeight: '600' }}
                onClick={closeComingSoon}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .desktop-badge {
            top: 6px;
            right: 6px;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            font-size: 0.65rem;
            font-weight: bold;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            animation: pulse 2s infinite;
          }

          .notification-badge {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
          }

          .message-badge {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
          }

          .default-badge {
            background: linear-gradient(135deg, #f47c31, #ff6b35);
            color: white;
          }

          .nav-link-modern:hover > div {
            background: linear-gradient(135deg, rgba(244, 124, 49, 0.15), rgba(255, 107, 53, 0.15)) !important;
            border: 1px solid rgba(244, 124, 49, 0.3) !important;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 6px 20px rgba(244, 124, 49, 0.15);
            backdropFilter: blur(15px);
          }

          .nav-link-modern:hover {
            color: #f47c31 !important;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }

          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(244, 124, 49, 0.3);
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(244, 124, 49, 0.5);
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;