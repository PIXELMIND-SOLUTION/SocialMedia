import React from "react";
import Switch from "./Switch";

const ProfileVisibility = ({ visibilityData, handleVisibilityChange, isDesktop }) => {
  const styles = {
    card: {
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      marginBottom: "1rem"
    },
    cardBody: {
      padding: isDesktop ? "1.5rem" : "1rem",
    },
    cardContent: {
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      justifyContent: isDesktop ? "space-between" : "flex-start",
      alignItems: isDesktop ? "center" : "flex-start",
      gap: isDesktop ? "0" : "1rem",
    },
    cardTextContent: {
      flex: 1
    },
  };

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Profile Visibility</h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Customize your profile's visibility on and off the platform.</p>
      
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
            <div style={styles.cardTextContent}>
              <h5 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "1rem" }}>Private profile</h5>
              <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>With a private profile, only approved people can view your followers, and who you follow.</p>
            </div>
            <Switch
              checked={visibilityData.privateProfile}
              onChange={() => handleVisibilityChange('privateProfile')}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
            <div style={styles.cardTextContent}>
              <h5 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "1rem" }}>Search privacy</h5>
              <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>Keep your profile and boards out of search engine results.</p>
            </div>
            <Switch
              checked={visibilityData.searchPrivacy}
              onChange={() => handleVisibilityChange('searchPrivacy')}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibility;