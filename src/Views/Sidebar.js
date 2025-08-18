import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaBell,
  FaCommentDots,
  FaPlus,
  FaUserFriends,
  FaBullhorn,
  FaWallet,
  FaCog,
} from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { to: '/home', icon: <FaHome />, title: 'Home' },
    { to: '/messages', icon: <FaCommentDots />, title: 'Messages' },
    { to: '/notifications', icon: <FaBell />, title: 'Notifications' },
    { to: '/create', icon: <FaPlus />, title: 'Create' },
    { to: '/people', icon: <FaUserFriends />, title: 'People' },
    { to: '/megaphone', icon: <FaBullhorn />, title: 'Megaphone' },
    { to: '/wallet', icon: <FaWallet />, title: 'Wallet' },
  ];

  return (
    <div
      className="d-flex flex-column align-items-center bg-white border-end vh-100"
      style={{
        width: '60px',
        height: '100vh',
        paddingTop: '1rem',
      }}
    >
      {/* Orange Circle */}
      <div
        className="rounded-circle mb-4"
        style={{
          width: '28px',
          height: '28px',
          backgroundColor: '#f47c31',
        }}
      ></div>

      {/* Navigation Icons */}
      <div className="d-flex flex-column align-items-center gap-4 flex-grow-1">
        {navItems.map((item, index) => (
          <Link
            to={item.to}
            key={index}
            className="text-dark text-decoration-none"
            title={item.title}
          >
            <span className="fs-5">{item.icon}</span>
          </Link>
        ))}
      </div>

      {/* Settings Icon at Bottom */}
      <div className="mb-3">
        <Link
          to="/settings"
          className="text-dark text-decoration-none"
          title="Settings"
        >
          <FaCog className="fs-5" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
