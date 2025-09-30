import React, { useState, useEffect } from "react";
import SettingsSidebar from "./SettingsSidebar";

const SettingsLayout = ({ children, activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  const styles = {
    container: {
      backgroundColor: "#ffddc8",
      minHeight: "100vh",
      padding: "10px",
    },
    mainCard: {
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      overflow: "hidden",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
    },
    mobileMenuButton: {
      display: isDesktop ? "none" : "block",
      width: "100%",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      border: "none",
      borderBottom: "1px solid #dee2e6",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#495057",
    },
    content: {
      flex: 1,
      padding: isDesktop ? "2rem" : "1rem",
    },
    actionButtons: {
      borderTop: "1px solid #dee2e6",
      paddingTop: "1.5rem",
      marginTop: "2rem"
    },
    buttonGroup: {
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      gap: "0.75rem",
      justifyContent: isDesktop ? "flex-end" : "flex-start",
    },
    button: {
      display: "inline-block",
      fontWeight: "400",
      textAlign: "center",
      verticalAlign: "middle",
      cursor: "pointer",
      border: "1px solid transparent",
      padding: "0.5rem 1rem",
      fontSize: isDesktop ? "1rem" : "0.9rem",
      lineHeight: "1.5",
      borderRadius: "0.375rem",
      transition: "all 0.15s ease-in-out",
      textDecoration: "none",
    },
    primaryButton: {
      backgroundColor: "#ff7a1c",
      borderColor: "#ff7a1c",
      color: "#fff"
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderColor: "#6c757d",
      color: "#6c757d"
    },
  };

   return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        <button
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰ Menu
        </button>

        <SettingsSidebar 
          isDesktop={isDesktop} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {!isDesktop && isMobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div style={styles.content}>
          {children}
          
          {/* <div style={styles.actionButtons}>
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.button,
                  ...styles.secondaryButton
                }}
              >
                Reset
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton
                }}
              >
                Save
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;