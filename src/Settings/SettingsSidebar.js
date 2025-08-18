import React from "react";

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


 
  const styles = {
    sidebar: {
      width: isDesktop ? "280px" : "100%",
      borderRight: isDesktop ? "1px solid #dee2e6" : "none",
      padding: isDesktop ? "1.5rem" : "0",
      backgroundColor: "white",
      position: isDesktop ? "static" : (isMobileMenuOpen ? "fixed" : "fixed"),
      left: isDesktop ? "0" : (isMobileMenuOpen ? "0" : "-100%"),
      top: isDesktop ? "0" : "0",
      height: isDesktop ? "auto" : "100vh",
      zIndex: 1000,
      transition: "left 0.3s ease-in-out",
      borderBottom: isDesktop ? "none" : "1px solid #dee2e6",
    },
    sidebarContent: {
      padding: isDesktop ? "0" : "1rem",
    },
    menuItem: {
      display: "block",
      width: "100%",
      padding: isDesktop ? "0.75rem 1rem" : "1rem",
      backgroundColor: "transparent",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: isDesktop ? "0.375rem" : "0",
      marginBottom: "0.25rem",
      transition: "all 0.15s ease-in-out",
      color: "#495057",
      textDecoration: "none",
      fontSize: isDesktop ? "0.95rem" : "1rem",
    },
    activeMenuItem: {
      color: "#ff7a1c",
      backgroundColor: "#fff3cd",
      fontWeight: "600"
    },
  };

   const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarContent}>
        {!isDesktop && (
          <div className="text-end w-100">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              X
            </button>
          </div>
        )}
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item.id)}
            style={{
              ...styles.menuItem,
              ...(activeSection === item.id ? styles.activeMenuItem : {})
            }}
          >
            {item.label} {isDesktop && "→"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
