import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { to: '/home', icon: <FaHome />, title: 'Home' },
    { to: '/messages', icon: <FaCommentDots />, title: 'Messages' },
    { to: '/notifications', icon: <FaBell />, title: 'Notifications' },
    { to: '/create', icon: <FaPlus />, title: 'Create' },
    { to: '/watch', icon: <FaUserFriends />, title: 'Watch' },
    { to: '/megaphone', icon: <FaBullhorn />, title: 'Megaphone' },
    { to: '/wallet', icon: <FaWallet />, title: 'Wallet' },
    { to: '/settings', icon: <FaCog />, title: 'Settings' }
  ];

  const isActiveRoute = (path) => location.pathname === path;

  // Mobile view with floating navigation
  if (isMobile) {
    return (
      <>
        {/* Add padding to body to prevent content from being hidden behind navigation */}
        <style>
          {`
            @media (max-width: 768px) {
              body {
                padding-bottom: 100px !important;
              }
              
              /* Alternative: Add margin to main content container if body styling doesn't work */
              .main-content,
              .container,
              .content {
                margin-bottom: 100px !important;
              }
            }
          `}
        </style>
        
        {/* Mobile Floating Bottom Navigation */}
        <div
          className="d-flex justify-content-around align-items-center fixed-bottom mx-2 mb-2 shadow-lg"
          style={{
            height: "55px",
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
            className={`text-decoration-none d-flex flex-column align-items-center nav-item ${
              isActiveRoute('/home') ? 'active' : ''
            }`}
            style={{
              color: isActiveRoute('/home') ? '#f47c31' : '#6b7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="icon-wrapper">
              <FaHome className="fs-5" />
            </div>
            <small style={{ fontSize: '0.7rem', fontWeight: '500' }}>Home</small>
          </Link>

          {/* Create/Plus Icon */}
          <Link
            to="/create"
            className="text-decoration-none d-flex flex-column align-items-center position-relative"
            style={{
              transform: 'translateY(-5px)',
            }}
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

          {/* Menu Button */}
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
              .filter((item) => item.to !== "/home" && item.to !== "/create")
              .reverse()
              .map((item, index) => (
                <Link
                  to={item.to}
                  key={index}
                  className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg bubble-btn"
                  style={{
                    width: "60px",
                    height: "60px",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #f47c31, #ff6b35)",
                    transform: "scale(0)",
                    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                    animation: `bubbleAppear 0.5s ${index * 0.1}s forwards`,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                  title={item.title}
                  onClick={() => setShowMenu(false)}
                >
                  <span className="fs-5">{item.icon}</span>
                </Link>
              ))}
          </div>
        )}

        {/* Backdrop Overlay */}
        {showMenu && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ 
              zIndex: 999, 
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
              transition: 'all 0.3s ease',
            }}
            onClick={() => setShowMenu(false)}
          />
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

            .bubble-btn:hover {
              background: linear-gradient(135deg, #f47c31, #ff6b35) !important;
              box-shadow: 0 8px 25px rgba(244, 124, 49, 0.4) !important;
              transform: scale(1.1) !important;
            }

            .nav-item .icon-wrapper {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .nav-item:hover .icon-wrapper {
              transform: translateY(-2px);
            }

            .nav-item.active .icon-wrapper {
              transform: scale(1.2);
            }
          `}
        </style>
      </>
    );
  }

  // Desktop view - Modern Glassmorphism Sidebar
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
        {/* Modern Logo/Brand */}
        <div
          className="rounded-circle mb-5 d-flex align-items-center justify-content-center shadow-sm"
          style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #f47c31, #ff6b35)',
            boxShadow: '0 4px 15px rgba(244, 124, 49, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(5deg)';
            e.target.style.boxShadow = '0 6px 20px rgba(244, 124, 49, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 4px 15px rgba(244, 124, 49, 0.3)';
          }}
        >
          <div 
            className="rounded-circle bg-white"
            style={{ width: '18px', height: '18px' }}
          />
        </div>

        {/* Navigation Icons */}
        <div className="d-flex flex-column align-items-center gap-3 flex-grow-1">
          {navItems
            .filter((item) => item.to !== "/settings")
            .map((item, index) => {
              const isActive = isActiveRoute(item.to);
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
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className="position-absolute rounded-circle"
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
                  </div>
                </Link>
              );
            })}
        </div>

        {/* Settings Icon at Bottom with Modern Styling */}
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

      <style>
        {`
          /* Desktop Navigation Hover Effects */
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

          /* Mobile Bubble Animations */
          @keyframes bubbleAppear {
            0% {
              opacity: 0;
              transform: scale(0) translateY(30px) rotate(-180deg);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.15) translateY(-10px) rotate(-90deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0) rotate(0deg);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          .bubble-btn {
            animation: float 3s ease-in-out infinite;
          }

          .bubble-btn:hover {
            background: linear-gradient(135deg, #f47c31, #ff6b35) !important;
            box-shadow: 0 12px 30px rgba(244, 124, 49, 0.5) !important;
            transform: scale(1.15) !important;
            animation-play-state: paused;
          }

          .bubble-btn:nth-child(even) {
            animation-delay: -1.5s;
          }

          /* Mobile Bottom Nav Hover Effects */
          .nav-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          .nav-item:hover {
            transform: translateY(-3px);
          }

          .nav-item.active {
            color: #f47c31 !important;
          }

          /* Glassmorphism effects */
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Smooth scrollbar for webkit browsers */
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

          /* Create button special hover effect on desktop */
          .nav-link-modern[href="/create"]:hover > div {
            background: linear-gradient(135deg, #f47c31, #ff6b35) !important;
            color: white;
            transform: translateY(-2px) scale(1.1) rotate(90deg);
            box-shadow: 0 8px 25px rgba(244, 124, 49, 0.4);
          }

          .nav-link-modern[href="/create"]:hover {
            color: white !important;
          }

          /* Notification badge styles */
          .notification-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
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

          /* Mobile navigation active state */
          @media (max-width: 768px) {
            .nav-item.active .icon-wrapper {
              transform: scale(1.2);
            }
            
            /* Ensure content is not hidden behind bottom navigation */
            body {
              padding-bottom: 100px !important;
            }
            
            /* Alternative selectors for different app structures */
            #root,
            .app,
            .main-content,
            .container-fluid,
            .content-wrapper {
              padding-bottom: 100px !important;
            }
            
            /* Specific for React Router outlet content */
            .outlet-content,
            .page-content,
            .route-content {
              margin-bottom: 100px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;