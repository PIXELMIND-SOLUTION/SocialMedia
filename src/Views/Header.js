import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://social-media-nty4.onrender.com/api/profiles/${userId}`
        );
        if (res.data.success && res.data.data.profile.image) {
          setProfilePic(res.data.data.profile.image);
        }
      } catch (err) {
        console.error("Failed to load profile picture:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch all users for search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://social-media-nty4.onrender.com/api/users");
        if (res.data.success) {
          setAllUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Search logic
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
    if (id === userId) {
      navigate('/myprofile');
    } else {
      navigate(`/userprofile/${id}`);
    }
  }


  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-main shadow-sm px-3 position-relative">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand or Logo */}
          <Link to="/home" className="navbar-brand fw-bold fs-4 text-dark">
            SocialMedia
          </Link>

          {/* Search Bar */}
          <div className="position-relative w-50 d-none d-md-block mx-auto">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 rounded-end-pill"
                placeholder="Search users by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && filteredUsers.length > 0 && (
              <div
                className="position-absolute bg-white shadow-lg rounded-4 mt-2 w-100 overflow-auto"
                style={{
                  zIndex: 1050,
                  maxHeight: "350px",
                  animation: "fadeIn 0.2s ease-in-out",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#f47c31 #f1f1f1",
                }}
              >
                {filteredUsers.slice(0, 10).map((user) => (
                  <div
                    key={user._id}
                    className="d-flex align-items-center p-2 px-3 hover-bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleProfile(user._id);
                      setSearchTerm("");
                      setShowResults(false);
                    }}
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
                ))}

                {/* Show More Indicator */}
                {filteredUsers.length > 10 && (
                  <div className="text-center py-2 text-muted small">
                    Scroll to view more...
                  </div>
                )}
              </div>
            )}

            {/* No results */}
            {showResults && filteredUsers.length === 0 && searchTerm.trim() !== "" && (
              <div
                className="position-absolute bg-white shadow-lg rounded-4 mt-2 w-100 text-center text-muted py-3"
                style={{ zIndex: 1050 }}
              >
                No results found.
              </div>
            )}
          </div>

          {/* Profile Image Trigger */}
          <div
            className="d-flex align-items-center"
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #f47c31",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ) : (
              <FaUserCircle className="text-secondary" size={45} />
            )}
          </div>
        </div>
      </nav>

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
            <div className="text-center">
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
                <FaUserCircle className="text-secondary" size={90} />
              )}
              <h5 className="mt-3 mb-4 fw-semibold">My Account</h5>
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

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
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



// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaSearch, FaBell, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [searchFocused, setSearchFocused] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const dropdownItems = [
//     { icon: <FaUser />, label: "Profile", action: () => console.log("Profile") },
//     { icon: <FaCog />, label: "Settings", action: () => console.log("Settings") },
//     { icon: <FaSignOutAlt />, label: "Logout", action: () => console.log("Logout"), danger: true }
//   ];

//   return (
//     <>
//       <nav 
//         className="navbar navbar-expand-lg position-sticky top-0"
//         style={{
//           background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
//           backdropFilter: "blur(20px)",
//           borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//           zIndex: 1030,
//           padding: "0.75rem 0",
//         }}
//       >
//         <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          
//           {/* Logo/Brand */}
//           <div className="navbar-brand mb-0 d-flex align-items-center">
//             <div
//               className="rounded-circle d-flex align-items-center justify-content-center me-3"
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 background: 'linear-gradient(135deg, #f47c31, #ff6b35)',
//                 boxShadow: '0 4px 15px rgba(244, 124, 49, 0.3)',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               }}
//             >
//               <div 
//                 className="rounded-circle bg-white"
//                 style={{ width: '16px', height: '16px' }}
//               />
//             </div>
//             {!isMobile && (
//               <span 
//                 className="fw-bold"
//                 style={{
//                   fontSize: "1.25rem",
//                   background: "linear-gradient(135deg, #1e293b, #64748b)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   backgroundClip: "text",
//                 }}
//               >
//                 AppName
//               </span>
//             )}
//           </div>

//           {/* Search Bar - Desktop */}
//           {!isMobile && (
//             <div className="flex-grow-1 mx-5">
//               <div 
//                 className="position-relative"
//                 style={{ maxWidth: "500px", margin: "0 auto" }}
//               >
//                 <div
//                   className="position-absolute d-flex align-items-center justify-content-center"
//                   style={{
//                     left: "16px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: searchFocused ? "#f47c31" : "#94a3b8",
//                     transition: "color 0.3s ease",
//                     zIndex: 10,
//                   }}
//                 >
//                   <FaSearch />
//                 </div>
//                 <input
//                   className="form-control"
//                   type="search"
//                   placeholder="Search anything..."
//                   aria-label="Search"
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                   style={{
//                     paddingLeft: "50px",
//                     paddingRight: "20px",
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                     borderRadius: "50px",
//                     border: searchFocused 
//                       ? "2px solid rgba(244, 124, 49, 0.3)" 
//                       : "2px solid rgba(226, 232, 240, 0.6)",
//                     background: "rgba(255,255,255,0.8)",
//                     backdropFilter: "blur(10px)",
//                     fontSize: "0.95rem",
//                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     boxShadow: searchFocused 
//                       ? "0 8px 25px rgba(244, 124, 49, 0.15)" 
//                       : "0 2px 10px rgba(0,0,0,0.05)",
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Mobile Search Icon */}
//           {isMobile && (
//             <button
//               className="btn p-2 me-2"
//               style={{
//                 border: "none",
//                 borderRadius: "12px",
//                 background: "rgba(244, 124, 49, 0.1)",
//                 color: "#f47c31",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <FaSearch />
//             </button>
//           )}

//           {/* Right Side - Notifications & Profile */}
//           <div className="d-flex align-items-center gap-3">
            
//             {/* Notifications Icon */}
//             <button
//               className="btn position-relative p-2"
//               style={{
//                 border: "none",
//                 borderRadius: "12px",
//                 background: "transparent",
//                 color: "#64748b",
//                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "rgba(244, 124, 49, 0.1)";
//                 e.target.style.color = "#f47c31";
//                 e.target.style.transform = "translateY(-2px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "transparent";
//                 e.target.style.color = "#64748b";
//                 e.target.style.transform = "translateY(0)";
//               }}
//             >
//               <FaBell className="fs-5" />
//               {/* Notification badge */}
//               <span
//                 className="position-absolute rounded-circle"
//                 style={{
//                   top: "6px",
//                   right: "6px",
//                   width: "8px",
//                   height: "8px",
//                   background: "linear-gradient(135deg, #ef4444, #dc2626)",
//                   boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
//                   animation: "pulse 2s infinite",
//                 }}
//               />
//             </button>

//             {/* Profile Dropdown */}
//             <div className="position-relative">
//               <button
//                 className="btn d-flex align-items-center"
//                 onClick={handleDropdownToggle}
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: "50px",
//                   border: "2px solid rgba(226, 232, 240, 0.6)",
//                   background: "rgba(255,255,255,0.8)",
//                   backdropFilter: "blur(10px)",
//                   color: "#475569",
//                   transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.borderColor = "rgba(244, 124, 49, 0.3)";
//                   e.target.style.boxShadow = "0 4px 15px rgba(244, 124, 49, 0.15)";
//                   e.target.style.transform = "translateY(-1px)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.borderColor = "rgba(226, 232, 240, 0.6)";
//                   e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
//                   e.target.style.transform = "translateY(0)";
//                 }}
//               >
//                 <div
//                   className="rounded-circle d-flex align-items-center justify-content-center me-2"
//                   style={{
//                     width: "32px",
//                     height: "32px",
//                     background: "linear-gradient(135deg, #f47c31, #ff6b35)",
//                     color: "white",
//                   }}
//                 >
//                   <FaUserCircle className="fs-6" />
//                 </div>
//                 {!isMobile && (
//                   <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
//                     John Doe
//                   </span>
//                 )}
//               </button>

//               {/* Custom Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div
//                   className="position-absolute"
//                   style={{
//                     top: "calc(100% + 8px)",
//                     right: "0",
//                     minWidth: "200px",
//                     borderRadius: "16px",
//                     background: "rgba(255,255,255,0.95)",
//                     backdropFilter: "blur(20px)",
//                     border: "1px solid rgba(226, 232, 240, 0.5)",
//                     boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//                     zIndex: 1050,
//                     animation: "dropdownFade 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {dropdownItems.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         item.action();
//                         setIsDropdownOpen(false);
//                       }}
//                       className="w-100 d-flex align-items-center text-start border-0"
//                       style={{
//                         padding: "12px 16px",
//                         backgroundColor: "transparent",
//                         color: item.danger ? "#ef4444" : "#475569",
//                         borderBottom: index < dropdownItems.length - 1 ? "1px solid rgba(226, 232, 240, 0.3)" : "none",
//                         transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                         fontSize: "0.9rem",
//                         fontWeight: "500",
//                         cursor: "pointer",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.backgroundColor = item.danger 
//                           ? "rgba(239, 68, 68, 0.1)" 
//                           : "rgba(244, 124, 49, 0.05)";
//                         e.target.style.color = item.danger ? "#dc2626" : "#f47c31";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.backgroundColor = "transparent";
//                         e.target.style.color = item.danger ? "#ef4444" : "#475569";
//                       }}
//                     >
//                       <span className="me-3" style={{ fontSize: "0.9rem" }}>
//                         {item.icon}
//                       </span>
//                       {item.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Backdrop for dropdown */}
//       {isDropdownOpen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100"
//           style={{
//             zIndex: 1040,
//             background: "transparent",
//           }}
//           onClick={() => setIsDropdownOpen(false)}
//         />
//       )}

//       {/* Mobile Search Bar */}
//       {isMobile && (
//         <div 
//           className="px-4 pb-3"
//           style={{
//             background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
//             backdropFilter: "blur(20px)",
//             borderBottom: "1px solid rgba(226, 232, 240, 0.3)",
//           }}
//         >
//           <div className="position-relative">
//             <div
//               className="position-absolute d-flex align-items-center justify-content-center"
//               style={{
//                 left: "16px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: searchFocused ? "#f47c31" : "#94a3b8",
//                 transition: "color 0.3s ease",
//                 zIndex: 10,
//               }}
//             >
//               <FaSearch />
//             </div>
//             <input
//               className="form-control w-100"
//               type="search"
//               placeholder="Search anything..."
//               aria-label="Search"
//               onFocus={() => setSearchFocused(true)}
//               onBlur={() => setSearchFocused(false)}
//               style={{
//                 paddingLeft: "50px",
//                 paddingRight: "20px",
//                 paddingTop: "12px",
//                 paddingBottom: "12px",
//                 borderRadius: "25px",
//                 border: searchFocused 
//                   ? "2px solid rgba(244, 124, 49, 0.3)" 
//                   : "2px solid rgba(226, 232, 240, 0.6)",
//                 background: "rgba(255,255,255,0.9)",
//                 backdropFilter: "blur(10px)",
//                 fontSize: "0.95rem",
//                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                 boxShadow: searchFocused 
//                   ? "0 8px 25px rgba(244, 124, 49, 0.15)" 
//                   : "0 2px 10px rgba(0,0,0,0.05)",
//               }}
//             />
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes dropdownFade {
//             from {
//               opacity: 0;
//               transform: translateY(-10px) scale(0.95);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }

//           @keyframes pulse {
//             0% {
//               box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
//             }
//             70% {
//               box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
//             }
//             100% {
//               box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
//             }
//           }

//           /* Search input focus effects */
//           .form-control:focus {
//             box-shadow: none !important;
//             outline: none !important;
//           }

//           /* Custom scrollbar for dropdown */
//           .dropdown-menu::-webkit-scrollbar {
//             width: 6px;
//           }

//           .dropdown-menu::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .dropdown-menu::-webkit-scrollbar-thumb {
//             background: rgba(244, 124, 49, 0.3);
//             border-radius: 3px;
//           }

//           /* Logo hover effect */
//           .navbar-brand > div:hover {
//             transform: scale(1.1) rotate(5deg);
//             box-shadow: 0 6px 20px rgba(244, 124, 49, 0.4);
//           }

//           /* Mobile responsive adjustments */
//           @media (max-width: 768px) {
//             .navbar {
//               padding: 0.5rem 0 !important;
//             }
            
//             .container-fluid {
//               padding: 0 1rem !important;
//             }
//           }

//           /* Profile button hover enhancement */
//           .btn:hover .rounded-circle {
//             transform: scale(1.1);
//             box-shadow: 0 4px 15px rgba(244, 124, 49, 0.3);
//           }

//           /* Smooth transitions for all interactive elements */
//           .btn, .form-control, .dropdown-item {
//             transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
//           }

//           /* Enhanced focus styles */
//           .btn:focus,
//           .form-control:focus {
//             box-shadow: 0 0 0 3px rgba(244, 124, 49, 0.1) !important;
//             outline: none !important;
//           }

//           /* Notification bell animation on hover */
//           .btn:hover .fa-bell {
//             animation: bellRing 0.5s ease-in-out;
//           }

//           @keyframes bellRing {
//             0%, 100% { transform: rotate(0deg); }
//             25% { transform: rotate(-10deg); }
//             75% { transform: rotate(10deg); }
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default Header;