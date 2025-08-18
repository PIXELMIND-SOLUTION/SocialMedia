import React from "react";

const BlockedAccounts = ({ blockedAccounts, isDesktop }) => {
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
    input: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      fontSize: isDesktop ? "1rem" : "0.9rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      borderRadius: "0.375rem",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      boxSizing: "border-box",
    },
    blockedAccountCard: {
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      alignItems: isDesktop ? "center" : "flex-start",
      justifyContent: isDesktop ? "space-between" : "flex-start",
      gap: isDesktop ? "0" : "1rem",
    },
    blockedAccountInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    blockedAccountAvatar: {
      width: isDesktop ? "48px" : "40px",
      height: isDesktop ? "48px" : "40px",
      borderRadius: "50%",
      backgroundColor: "#f3d0ff",
      color: "#6f42c1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isDesktop ? "1.25rem" : "1rem",
      fontWeight: "600",
    },
    button: {
      display: "inline-block",
      fontWeight: "400",
      textAlign: "center",
      verticalAlign: "middle",
      cursor: "pointer",
      border: "1px solid #6c757d",
      padding: "0.5rem 1rem",
      fontSize: isDesktop ? "1rem" : "0.9rem",
      lineHeight: "1.5",
      borderRadius: "0.375rem",
      transition: "all 0.15s ease-in-out",
      textDecoration: "none",
      backgroundColor: "transparent",
      color: "#6c757d"
    },
  };

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Blocked Accounts</h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>When you block someone, you'll still be able to view each other's profiles, but you won't be able to message, follow, or save each other's posts.</p>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search"
          style={styles.input}
        />
      </div>

      {blockedAccounts.map((account, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.blockedAccountCard}>
              <div style={styles.blockedAccountInfo}>
                <div style={styles.blockedAccountAvatar}>
                  {account.avatar}
                </div>
                <div>
                  <h6 style={{ fontWeight: "600", marginBottom: 0, color: "#495057", fontSize: "0.95rem" }}>{account.name}</h6>
                  <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>{account.email}</p>
                </div>
              </div>
              <button style={styles.button}>
                Unblock
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockedAccounts;