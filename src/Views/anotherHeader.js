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