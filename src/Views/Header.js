import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSearch, FaTimes, FaBell, FaVideo, FaEnvelope, FaClock, FaCheck, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsBroadcast, BsBroadcastPin } from "react-icons/bs";

const Header = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;
  const username = storedUser?.fullName;

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);

  // --- Utility Effects ---

  // Handle click outside for Search Results Dropdown (Desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      // Handle desktop search dropdown
      if (!isMobileSearchVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }

      // Handle notification dropdown - only for desktop
      if (showNotificationModal &&
        notificationRef.current && !notificationRef.current.contains(event.target) &&
        !isMobileScreen()) {
        setShowNotificationModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchVisible, showNotificationModal]);

  // Focus mobile search input when it becomes visible
  useEffect(() => {
    if (isMobileSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchVisible]);

  // Fetch notifications every 10 seconds
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchNotifications();

    // Set up interval for auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  // --- Data Fetching Effects ---

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://31.97.206.144:5002/api/profiles/${userId}`
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
        const res = await axios.get("http://31.97.206.144:5002/api/users");
        if (res.data.success) {
          setAllUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch user notifications
  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoadingNotifications(true);
    setNotificationError("");

    try {
      const res = await axios.get(
        `http://31.97.206.144:5002/api/invites/user/${userId}`
      );

      if (res.data.success) {
        // Filter only pending notifications
        const pendingInvites = res.data.data.filter(invite => invite.status === "pending");
        setNotifications(pendingInvites);
        setPendingCount(pendingInvites.length);
      } else {
        setNotificationError("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationError("Could not load meeting invites");
    } finally {
      setIsLoadingNotifications(false);
    }
  };

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

  // Handle Accept Invite
  const handleAcceptInvite = async (inviteId, roomId) => {
    try {
      const response = await axios.post(
        "http://31.97.206.144:5002/api/accept",
        {
          inviteId,
          userId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Remove accepted notification from list
        setNotifications(prev => prev.filter(invite => invite._id !== inviteId));
        setPendingCount(prev => prev - 1);

        // Navigate to the room
        navigate(`/watch/${roomId}`);

        // Close notification modal
        setShowNotificationModal(false);
      } else {
        alert("Failed to accept invite. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      alert("Error accepting invite. Please try again.");
    }
  };

  // Handle Reject Invite
  const handleRejectInvite = async (inviteId) => {
    try {
      const response = await axios.post(
        "http://31.97.206.144:5002/api/reject",
        {
          inviteId,
          userId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Remove rejected notification from list
        setNotifications(prev => prev.filter(invite => invite._id !== inviteId));
        setPendingCount(prev => prev - 1);
      } else {
        alert("Failed to reject invite. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting invite:", error);
      alert("Error rejecting invite. Please try again.");
    }
  };

  const handleProfile = (id) => {
    if (id === userId) {
      navigate('/myprofile');
    } else {
      navigate(`/userprofile/${id}`);
    }
    setSearchTerm("");
    setShowResults(false);
    setIsMobileSearchVisible(false);
  };

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
    if (!isMobileSearchVisible) {
      setSearchTerm("");
      setShowResults(false);
    }
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Check if mobile screen
  const isMobileScreen = () => window.innerWidth < 768;

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

                {filteredUsers.length > 10 && (
                  <div className="text-center py-2 text-muted small">
                    Scroll to view more...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons Container */}
          <div className="d-flex align-items-center">
            {/* Notification Bell Icon */}
            <div className="position-relative me-2 me-md-3" ref={notificationRef}>
              <button
                className="btn position-relative p-2"
                onClick={() => setShowNotificationModal(true)}
                aria-label="Meeting Invitations"
                style={{
                  fontSize: "1.25rem",
                  color: "#333",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <BsBroadcastPin className={pendingCount > 0 ? "live-blink" : ""} />

                {pendingCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "0.6rem",
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px 5px",
                      transform: "translate(-50%, -20%)",
                      border: "2px solid white"
                    }}
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Search Icon */}
            <button
              className="btn d-md-none p-2 me-2"
              onClick={handleMobileSearchToggle}
              aria-label="Toggle Search"
              style={{
                fontSize: "1.25rem",
                color: "#333",
                backgroundColor: "transparent",
                border: "none"
              }}
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

      {/* ========== MOBILE NOTIFICATION MODAL (Full Screen) ========== */}
      {showNotificationModal && isMobileScreen() && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{
            zIndex: 1060,
            backgroundColor: "white",
            animation: "slideInFromTop 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          {/* Mobile Notification Header */}
          <div className="sticky-top bg-white border-bottom shadow-sm" style={{ zIndex: 1 }}>
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "40px", height: "40px" }}>
                  <BsBroadcast />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-dark">Meeting Invitations</h5>
                  <small className="text-muted">{pendingCount} pending</small>
                </div>
              </div>
              <button
                className="btn btn-sm btn-light rounded-circle"
                onClick={() => setShowNotificationModal(false)}
                aria-label="Close Notifications"
                style={{ width: "40px", height: "40px" }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Mobile Notification Content */}
          <div className="p-3">
            {isLoadingNotifications ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted">Loading meeting invites...</p>
              </div>
            ) : notificationError ? (
              <div className="alert alert-danger text-center">
                <FaTimesCircle className="mb-2" style={{ fontSize: "2rem" }} />
                <p className="mb-0">{notificationError}</p>
                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={fetchNotifications}
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-5">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-circle d-inline-flex p-4 mb-3">
                  <FaEnvelope className="text-primary" style={{ fontSize: "3rem" }} />
                </div>
                <h5 className="text-dark mb-2">No Pending Invites</h5>
                <p className="text-muted mb-4">You're all caught up! No meeting invitations pending.</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={fetchNotifications}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((invite) => (
                  <div
                    key={invite._id}
                    className="card shadow-sm border-0 mb-3"
                    style={{ borderRadius: "15px" }}
                  >
                    <div className="card-body">
                      {/* Header with inviter info */}
                      <div className="d-flex align-items-start mb-3">
                        <img
                          src={
                            invite.invitedBy.profile?.image ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={invite.invitedBy.fullName}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #f47c31",
                          }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0 fw-bold text-dark">{invite.invitedBy.fullName}</h6>
                              <small className="text-muted">@{invite.invitedBy.profile?.username}</small>
                            </div>
                            <span className="badge bg-success text-white">
                              <FaClock className="me-1" /> {formatDate(invite.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Invite message */}
                      <div className="mb-3">
                        <p className="mb-2 text-dark">
                          <FaVideo className="text-primary me-2" />
                          {invite.text}
                        </p>
                        <div className="d-flex align-items-center text-muted small">
                          <span className="badge bg-light text-dark me-2">Room ID: {invite.roomId}</span>
                          <span className="badge bg-light text-dark">
                            <FaEnvelope className="me-1" /> Invitation
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning flex-grow-1 d-flex align-items-center justify-content-center"
                          onClick={() => handleAcceptInvite(invite._id, invite.roomId)}
                          style={{ borderRadius: "10px", height: "45px" }}
                        >
                          <FaCheck className="me-2" /> Join Meeting
                        </button>
                        <button
                          className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                          onClick={() => handleRejectInvite(invite._id)}
                          style={{
                            borderRadius: "10px",
                            height: "45px",
                            width: "45px"
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer info */}
            {notifications.length > 0 && (
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  <FaClock className="me-1" /> Auto-refreshes every 10 seconds
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== DESKTOP NOTIFICATION MODAL ========== */}
      {showNotificationModal && !isMobileScreen() && (
        <>
          {/* Backdrop for desktop */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 1040,
            }}
            onClick={() => setShowNotificationModal(false)}
          ></div>

          {/* Desktop Notification Modal */}
          <div
            className="position-fixed top-50 start-50 translate-middle d-none d-md-block"
            style={{
              zIndex: 1050,
              width: "420px",
              maxWidth: "90vw",
              animation: "scaleIn 0.2s ease-out"
            }}
          >
            <div className="bg-white rounded-4 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-white/20 rounded-circle p-2 me-3">
                      <BsBroadcast style={{ fontSize: "1.2rem" }} />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Meeting Invitations</h5>
                      <small>{pendingCount} pending invitation{pendingCount !== 1 ? 's' : ''}</small>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={() => setShowNotificationModal(false)}
                    style={{ width: "36px", height: "36px" }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3" style={{ maxHeight: "500px", overflowY: "auto" }}>
                {isLoadingNotifications ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="text-muted small">Loading meeting invites...</p>
                  </div>
                ) : notificationError ? (
                  <div className="alert alert-warning text-center py-3">
                    <p className="mb-2">{notificationError}</p>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={fetchNotifications}
                    >
                      Retry
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-circle d-inline-flex p-4 mb-3">
                      <FaEnvelope className="text-primary" style={{ fontSize: "2.5rem" }} />
                    </div>
                    <h6 className="text-dark mb-2">All Caught Up!</h6>
                    <p className="text-muted small mb-0">No pending meeting invitations</p>
                  </div>
                ) : (
                  notifications.map((invite) => (
                    <div
                      key={invite._id}
                      className="card border-0 shadow-sm mb-3 hover-lift"
                      style={{
                        borderRadius: "12px",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-start mb-3">
                          <img
                            src={
                              invite.invitedBy.profile?.image ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={invite.invitedBy.fullName}
                            style={{
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #f47c31",
                            }}
                          />
                          <div className="ms-3 flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-0 fw-semibold text-dark">{invite.invitedBy.fullName}</h6>
                                <small className="text-muted">@{invite.invitedBy.profile?.username}</small>
                              </div>
                              <small className="text-danger ">
                                <FaClock className="me-1" /> {formatDate(invite.createdAt)}
                              </small>
                            </div>
                          </div>
                        </div>

                        <p className="text-dark mb-3 small">{invite.text}</p>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="badge bg-light text-dark">
                            <FaVideo className="me-1 text-primary" /> Room: {invite.roomId}
                          </span>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                            onClick={() => handleAcceptInvite(invite._id, invite.roomId)}
                            style={{ borderRadius: "8px" }}
                          >
                            <FaCheck className="me-1" /> Accept & Join
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRejectInvite(invite._id)}
                            style={{ borderRadius: "8px", minWidth: "40px" }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {notifications.length > 0 && (
                  <div className="text-center mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <FaClock className="me-1" /> Auto-refreshes every 10 seconds
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== MOBILE SEARCH MODAL ========== */}
      {isMobileSearchVisible && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-md-none"
          style={{
            zIndex: 1040,
            backgroundColor: "white",
            animation: "slideInFromTop 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
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

          <div className="w-100">
            {showResults && searchTerm.trim() !== "" && (
              <div
                className="bg-white shadow-sm rounded-4 w-100"
                ref={dropdownRef}
                style={{
                  zIndex: 1050,
                  maxHeight: "calc(100vh - 150px)",
                  overflowY: "auto",
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

            {!searchTerm.trim() && (
              <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 mt-5">
                <FaSearch className="mb-3" style={{ fontSize: '3rem', color: '#ccc' }} />
                <p className="lead">Start typing to search for users by name or username.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== PROFILE MODAL ========== */}
      {showModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={() => setShowModal(false)}
          ></div>

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
        @keyframes scaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
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
        
        /* Notification badge pulse animation */
        @keyframes pulse {
          0% { transform: translate(-50%, -20%) scale(1); }
          50% { transform: translate(-50%, -20%) scale(1.1); }
          100% { transform: translate(-50%, -20%) scale(1); }
        }
        
        .badge.bg-danger {
          animation: pulse 2s infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 767.98px) {
          .notification-list .card {
            margin-bottom: 1rem;
          }
        }

        /* Smooth transitions */
        button, .card, .hover-bg-light {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Header;