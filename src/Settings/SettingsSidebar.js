import React from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';

const SettingsSidebar = ({
  isDesktop,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeSection,
  setActiveSection
}) => {
  const menuItems = [
    { id: "editProfile", label: "Edit profile" },
    { id: "accountManagement", label: "Account management" },
    { id: "profileVisibility", label: "Profile visibility" },
    { id: "socialPermissions", label: "Social permissions" },
    { id: "notifications", label: "Notifications" },
    { id: "blockedAccounts", label: "Blocked accounts" }
  ];

  const getActiveLabel = () => {
    const activeItem = menuItems.find(item => item.id === activeSection);
    return activeItem ? activeItem.label : "Select an option";
  };

  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Mobile Dropdown Menu
  if (!isDesktop) {
    return (
      <>
        {/* Mobile Dropdown Trigger */}
        <div className="position-relative w-100 mb-4">
          {/* <button
            className="btn w-100 d-flex justify-content-between align-items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              border: "2px solid #e2e8f0",
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              color: "#334155",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <span>{getActiveLabel()}</span>
            <div
              style={{
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isMobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <FaChevronDown />
            </div>
          </button> */}

          {/* Dropdown Menu */}
          {isMobileMenuOpen && (
            <div
              className="position-absolute w-100 mt-2"
              style={{
                zIndex: 1050,
                borderRadius: "16px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                animation: "dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className="w-100 text-start border-0"
                  style={{
                    padding: "1rem 1.25rem",
                    backgroundColor: activeSection === item.id 
                      ? "linear-gradient(135deg, rgba(244, 124, 49, 0.1), rgba(255, 107, 53, 0.1))"
                      : "transparent",
                    color: activeSection === item.id ? "#f47c31" : "#475569",
                    borderBottom: index < menuItems.length - 1 ? "1px solid rgba(226, 232, 240, 0.3)" : "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "0.95rem",
                    fontWeight: activeSection === item.id ? "600" : "500",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.target.style.backgroundColor = "rgba(244, 124, 49, 0.05)";
                      e.target.style.color = "#f47c31";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#475569";
                    }
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span 
                      className="float-end"
                      style={{
                        color: "#f47c31",
                        fontSize: "0.8rem",
                        marginTop: "2px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Backdrop for mobile dropdown */}
        {isMobileMenuOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 1040,
              background: "rgba(0,0,0,0.1)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <style>
          {`
            @keyframes dropdownSlide {
              from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </>
    );
  }

  // Desktop Sidebar - Enhanced Modern Design
  return (
    <div
      style={{
        width: "300px",
        borderRight: "1px solid rgba(226, 232, 240, 0.6)",
        padding: "2rem 1.5rem",
        backgroundColor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
        boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* Desktop Header */}
      <div className="mb-4">
        <h4 
          className="mb-1"
          style={{
            color: "#1e293b",
            fontWeight: "700",
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #1e293b, #64748b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Settings
        </h4>
        <p 
          className="mb-0"
          style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          Manage your account preferences
        </p>
      </div>

      {/* Desktop Menu Items */}
      <div className="d-flex flex-column gap-2">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="text-start border-0 position-relative"
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: activeSection === item.id 
                ? "linear-gradient(135deg, rgba(244, 124, 49, 0.1), rgba(255, 107, 53, 0.1))"
                : "transparent",
              color: activeSection === item.id ? "#f47c31" : "#475569",
              borderRadius: "12px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: "0.95rem",
              fontWeight: activeSection === item.id ? "600" : "500",
              cursor: "pointer",
              border: activeSection === item.id ? "1px solid rgba(244, 124, 49, 0.2)" : "1px solid transparent",
              backdropFilter: activeSection === item.id ? "blur(10px)" : "none",
            }}
            onMouseEnter={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = "rgba(244, 124, 49, 0.05)";
                e.target.style.color = "#f47c31";
                e.target.style.transform = "translateX(8px)";
                e.target.style.borderColor = "rgba(244, 124, 49, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#475569";
                e.target.style.transform = "translateX(0)";
                e.target.style.borderColor = "transparent";
              }
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span>{item.label}</span>
              <span 
                style={{
                  opacity: activeSection === item.id ? "1" : "0",
                  transition: "opacity 0.3s ease",
                  color: "#f47c31",
                  fontSize: "1.1rem",
                }}
              >
                →
              </span>
            </div>
            
            {/* Active indicator line */}
            {activeSection === item.id && (
              <div
                className="position-absolute"
                style={{
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "4px",
                  height: "60%",
                  background: "linear-gradient(135deg, #f47c31, #ff6b35)",
                  borderRadius: "0 2px 2px 0",
                  boxShadow: "2px 0 8px rgba(244, 124, 49, 0.3)",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;