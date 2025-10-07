import React from "react";
import Switch from "./Switch";

const ProfileVisibility = ({ visibilityData, handleVisibilityChange, isDesktop }) => {
  const styles = {
    card: {
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.075)",
      marginBottom: "1rem"
    },
    cardBody: { padding: isDesktop ? "1.5rem" : "1rem" },
    cardContent: {
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
    },
  };

  return (
    <div>
      <h4 className="fw-bold mb-2 text-dark">Profile Visibility</h4>
      <p className="text-muted mb-4">Customize your profile's visibility and privacy options.</p>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
            <div>
              <h5 className="fw-semibold mb-1">Private Profile</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Only approved followers can view your posts and profile.
              </p>
            </div>
            <Switch
              checked={visibilityData.privateProfile}
              onChange={() => handleVisibilityChange("privateProfile")}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
            <div>
              <h5 className="fw-semibold mb-1">Search Privacy</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Prevent search engines from indexing your profile.
              </p>
            </div>
            <Switch
              checked={visibilityData.searchPrivacy}
              onChange={() => handleVisibilityChange("searchPrivacy")}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibility;
