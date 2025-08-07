import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaBell,
  FaCommentDots,
  FaPlus,
  FaUserFriends,
  FaWrench,
  FaWallet,
  FaCog,
} from 'react-icons/fa';

const Sidebar = () => {
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { to: '/home', icon: <FaHome />, title: 'Home' },
    { to: '/notifications', icon: <FaBell />, title: 'Notifications' },
    { to: '/messages', icon: <FaCommentDots />, title: 'Messages' },
    { to: '/create', icon: <FaPlus />, title: 'Create' },
    { to: '/people', icon: <FaUserFriends />, title: 'People' },
    { to: '/tools', icon: <FaWrench />, title: 'Tools' },
    { to: '/wallet', icon: <FaWallet />, title: 'Wallet' },
  ];

  const circleStyle = (id) => ({
    transition: 'all 0.3s ease',
    backgroundColor: hovered === id ? '#f8f9fa' : 'transparent',
    boxShadow: hovered === id ? '0 0 10px rgba(0,0,0,0.15)' : 'none',
    cursor: 'pointer'
  });

  return (
    <div
      className="d-flex flex-column bg-white sticky-top"
      style={{ width: '60px', height: '100vh', paddingTop: '1rem' }}
    >
      <div className="d-flex flex-column align-items-center gap-4">
        <div
          className="bg-warning rounded-circle"
          style={{ width: '30px', height: '30px' }}
        ></div>

        {navItems.map((item, index) => (
          <Link
            to={item.to}
            key={index}
            className="text-dark text-decoration-none"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="p-2 rounded-circle d-flex align-items-center justify-content-center"
              style={circleStyle(index)}
              title={item.title}
            >
              <span className="fs-5">{item.icon}</span>
            </div>
          </Link>
        ))}

        <Link
          to="/settings"
          className="mt-auto mb-3 text-dark text-decoration-none"
          onMouseEnter={() => setHovered('settings')}
          onMouseLeave={() => setHovered(null)}
        >
          <div
            className="p-2 rounded-circle d-flex align-items-center justify-content-center"
            style={circleStyle('settings')}
            title="Settings"
          >
            <FaCog className="fs-5" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
