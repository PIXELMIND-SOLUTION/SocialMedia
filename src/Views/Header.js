import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false); // State for mobile search visibility

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;
  const username = storedUser?.fullName;

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // --- Utility Effects ---

  // Handle click outside for Search Results Dropdown (Desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      // Only handle desktop dropdown or mobile results when in the overlay
      if (!isMobileSearchVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    // Attach listener globally, but only relevant for desktop search closing
    if (!isMobileSearchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchVisible]);

  // Focus mobile search input when it becomes visible
  useEffect(() => {
    if (isMobileSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchVisible]);

  // --- Data Fetching Effects ---

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://apisocial.atozkeysolution.com/api/profiles/${userId}`
        );
        if (res.data.success && res.data.data.profile.image) {
          setProfilePic(res.data.data.profile.image);
        }
      } catch (err) {
        console.error("Failed to load profile picture:", err);
      }
    };
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Fetch all users for search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://apisocial.atozkeysolution.com/api/users");
        if (res.data.success) {
          setAllUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // --- Search Logic ---

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      setShowResults(false);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const results = allUsers.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(lowerTerm) ||
        user.mobile?.includes(lowerTerm) ||
        user.profile?.username?.toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredUsers(results);
    setShowResults(true);
  }, [searchTerm, allUsers]);

  const handleProfile = (id) => {
    // Navigate to the correct profile page
    if (id === userId) {
      navigate('/myprofile');
    } else {
      navigate(`/userprofile/${id}`);
    }
    // Close search results and mobile search
    setSearchTerm("");
    setShowResults(false);
    setIsMobileSearchVisible(false);
  }

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchVisible(false);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleMobileSearchToggle = () => {
    // If we're opening the search, ensure term is cleared initially
    if (!isMobileSearchVisible) {
      setSearchTerm("");
      setShowResults(false);
    }
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-main shadow-sm px-3 position-relative">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand or Logo */}
          <Link to="/home" className="navbar-brand fw-bold fs-4 text-dark">
            Atoz
          </Link>

          {/* Desktop Search Bar (Visible from md and up) */}
          <div className="position-relative w-50 d-none d-md-block mx-auto">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 rounded-end-pill"
                placeholder="Search with username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
            </div>

            {/* Search Results Dropdown (Desktop) */}
            {showResults && searchTerm.trim() !== "" && (
              <div
                className="position-absolute bg-white shadow-lg rounded-4 mt-2 w-100 overflow-auto"
                ref={dropdownRef}
                style={{
                  zIndex: 1050,
                  maxHeight: "350px",
                  animation: "fadeIn 0.2s ease-in-out",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#f47c31 #f1f1f1",
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.slice(0, 10).map((user) => (
                    <div
                      key={user._id}
                      className="d-flex align-items-center p-2 px-3 hover-bg-light"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProfile(user._id)}
                    >
                      <img
                        src={
                          user.profile?.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "12px",
                          border: "2px solid #f47c31",
                        }}
                      />
                      <div>
                        <div className="fw-semibold text-dark">{user.fullName}</div>
                        <small className="text-muted">
                          @{user.profile?.username}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    No results found.
                  </div>
                )}

                {/* Show More Indicator */}
                {filteredUsers.length > 10 && (
                  <div className="text-center py-2 text-muted small">
                    Scroll to view more...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Icon & Profile Trigger */}
          <div className="d-flex align-items-center">
            {/* Mobile Search Icon (Visible below md) */}
            <button
              className="btn d-md-none p-2 me-2"
              onClick={handleMobileSearchToggle}
              aria-label="Toggle Search"
              style={{ fontSize: "1.25rem", color: "#333" }}
            >
              {isMobileSearchVisible ? <FaTimes /> : <FaSearch />}
            </button>

            {/* Profile Image Trigger */}
            <div
              className="d-flex align-items-center"
              onClick={() => setShowModal(true)}
              style={{ cursor: "pointer", width: "45px", height: "45px" }}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #f47c31",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ) : (
                <div
                  className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 
                             d-flex justify-content-center align-items-center text-white 
                             fw-bold"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    fontSize: "20px",
                    border: "2px solid #f47c31",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Full Screen Overlay */}
      {isMobileSearchVisible && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-md-none"
          style={{
            zIndex: 1040,
            backgroundColor: "white", // Solid white background
            animation: "slideInFromTop 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          {/* Overlay Header / Title */}
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <div className="text-center mb-3 mb-md-4">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ maxHeight: "40px", height: "auto" }}
                className="rounded-circle"
              />
            </div>
            <h4 className="m-0 text-dark d-flex align-items-center fw-bold">

              AtoZ
            </h4>
            <button
              className="btn btn-sm btn-outline-secondary border-0"
              onClick={handleMobileSearchClose}
              aria-label="Close Search"
              style={{ fontSize: '1.2rem' }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Search Bar Container */}
          <div className="d-flex align-items-center mb-3">
            <div className="input-group flex-grow-1">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill">
                <FaSearch />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control border-start-0 rounded-end-pill"
                placeholder="Search with username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
            </div>
          </div>

          {/* Search Results Content */}
          <div className="w-100">
            {showResults && searchTerm.trim() !== "" && (
              <div
                className="bg-white shadow-sm rounded-4 w-100"
                ref={dropdownRef}
                style={{
                  zIndex: 1050,
                  maxHeight: "calc(100vh - 150px)", // Max height relative to viewport
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#f47c31 #f1f1f1",
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="d-flex align-items-center p-2 px-3 hover-bg-light border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProfile(user._id)}
                    >
                      <img
                        src={
                          user.profile?.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "12px",
                          border: "2px solid #f47c31",
                        }}
                      />
                      <div>
                        <div className="fw-semibold text-dark">{user.fullName}</div>
                        <small className="text-muted">
                          @{user.profile?.username}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    No results found for **"{searchTerm}"**.
                  </div>
                )}
              </div>
            )}

            {/* Initial Prompt/No Search Yet */}
            {!searchTerm.trim() && (
              <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 mt-5">
                <FaSearch className="mb-3" style={{ fontSize: '3rem', color: '#ccc' }} />
                <p className="lead">Start typing to search for users by name or username.</p>
              </div>

            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showModal && (
        <>
          {/* Blur Background */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Content */}
          <div
            className="position-fixed top-50 start-50 translate-middle bg-white shadow-lg rounded-4 p-4"
            style={{
              width: "320px",
              zIndex: 1050,
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <div className="text-center d-flex flex-column align-items-center">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #f47c31",
                  }}
                />
              ) : (
                <div
                  className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 
                             d-flex justify-content-center align-items-center text-white fw-bold"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    fontSize: "36px",
                    border: "3px solid #f47c31",
                  }}
                >
                  {username?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <h5 className="mt-3 mb-4 fw-semibold">
                {username ? username : "My Account"}
              </h5>
            </div>


            <div className="list-group text-center">
              <Link
                to="/myprofile"
                className="list-group-item list-group-item-action border-0"
                onClick={() => setShowModal(false)}
              >
                View Profile
              </Link>
              <Link
                to="/settings"
                className="list-group-item list-group-item-action border-0"
                onClick={() => setShowModal(false)}
              >
                Settings
              </Link>
              <button
                className="list-group-item list-group-item-action border-0 text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}


      {/* Animations & Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }

        /* Scrollbar styling */
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background-color: #f47c31;
          border-radius: 10px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </>
  );
};

export default Header;