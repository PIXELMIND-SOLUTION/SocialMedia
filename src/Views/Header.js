import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-main">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Icon or Logo Placeholder */}
        {/* <span className="navbar-brand fw-bold fs-4">LOGO</span> */}

        {/* Centered Search */}
        <form className="d-none d-md-block w-100 mx-auto">
          <input
            className="form-control rounded-pill"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </form>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light rounded-pill d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle className="me-2 fs-5" />
            <span className="d-none d-sm-inline"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><button className="dropdown-item">Profile</button></li>
            <li><button className="dropdown-item">Settings</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item">Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
