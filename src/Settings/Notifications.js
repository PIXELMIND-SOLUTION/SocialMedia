import React from "react";

const Notifications = ({ notificationData, handleNotificationChange, isDesktop }) => {
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
  };

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Notifications</h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>We'll always notify you about important updates, but you decide what other notifications you'd like to receive.</p>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#495057", fontSize: "1.1rem" }}>On Website Name</h5>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "1rem" }}>Select which notifications to get directly to you.</p>
        
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h6 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1rem" }}>Friends Inbox</h6>
            {Object.entries(notificationData.friends).map(([key, value]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange('friends', key)}
                  style={{ marginRight: "0.75rem" }}
                />
                {key === 'commentsWithPhotos' ? 'Comments with photos' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h6 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1rem" }}>Activity Form people you follow</h6>
            {Object.entries(notificationData.activityFromFollowed).map(([key, value]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange('activityFromFollowed', key)}
                  style={{ marginRight: "0.75rem" }}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h6 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1rem" }}>Activity Form Creators</h6>
            {Object.entries(notificationData.activityFromCreators).map(([key, value]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange('activityFromCreators', key)}
                  style={{ marginRight: "0.75rem" }}
                />
                {key === 'newPosts' ? 'New Posts from people you follow' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h6 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1rem" }}>Browser notifications</h6>
            {Object.entries(notificationData.browserNotifications).map(([key, value]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange('browserNotifications', key)}
                  style={{ marginRight: "0.75rem" }}
                />
                {key === 'newPosts' ? 'New Posts from people you follow' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;