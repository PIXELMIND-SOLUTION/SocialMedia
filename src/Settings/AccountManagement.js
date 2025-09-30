import React from "react";

const AccountManagement = ({
  accountData,
  handleAccountChange,
  onDeactivate,
  onReactivate,
  onDeleteAccount,
  isDesktop,
}) => {
  const styles = {
    formGroup: { marginBottom: "1rem" },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      color: "#495057",
      fontSize: isDesktop ? "1rem" : "0.9rem",
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
      boxSizing: "border-box",
    },
    select: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      fontSize: isDesktop ? "1rem" : "0.9rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      borderRadius: "0.375rem",
      boxSizing: "border-box",
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
    secondaryButton: {
      backgroundColor: "transparent",
      borderColor: "#6c757d",
      color: "#6c757d",
    },
    dangerButton: {
      backgroundColor: "transparent",
      borderColor: "#dc3545",
      color: "#dc3545",
    },
    genderOptions: {
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      gap: isDesktop ? "1rem" : "0.5rem",
    },
  };

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>
        Account management
      </h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Easily edit your profile and manage your account preferences.
      </p>

      {/* Personal Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1.1rem" }}>
          Personal information
        </h5>

        {/* Birthdate */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Birthdate</label>
          <input
            type="date"
            name="birthdate"
            value={accountData.birthdate ? accountData.birthdate.substring(0, 10) : ""}
            onChange={handleAccountChange}
            style={styles.input}
          />
        </div>

        {/* Gender */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Gender</label>
          <div style={styles.genderOptions}>
            {["Male", "Female","Other", "Prefer not to say"].map((gender) => (
              <label key={gender} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={accountData.gender === gender}
                  onChange={handleAccountChange}
                  style={{ marginRight: "0.5rem" }}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        {/* Country */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Country/Region</label>
          <select
            name="country"
            value={accountData.country}
            onChange={handleAccountChange}
            style={styles.select}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>

        {/* Language */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Language</label>
          <select
            name="language"
            value={accountData.language}
            onChange={handleAccountChange}
            style={styles.select}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h5
          style={{
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#495057",
            fontSize: "1.1rem",
          }}
        >
          Deactivation and deletion
        </h5>

        <div style={{ marginBottom: "1.5rem" }}>
          <h6 style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" }}>
            Deactivate account
          </h6>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Temporarily hide your profile, Pins and boards
          </p>
          <button
            style={{ ...styles.button, ...styles.secondaryButton, marginRight: "0.5rem" }}
            onClick={onDeactivate}
          >
            Deactivate account
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={onReactivate}
          >
            Reactivate account
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h6 style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" }}>
            Delete your data and account
          </h6>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Permanently delete your data and everything associated with your account
          </p>
          <button
            style={{ ...styles.button, ...styles.dangerButton }}
            onClick={onDeleteAccount}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
