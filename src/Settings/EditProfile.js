import React from "react";

const EditProfile = ({ profileData, handleProfileChange, handleImageChange, isDesktop }) => {
  const styles = {
    formGroup: { marginBottom: "1rem" },
    label: { display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#495057", fontSize: isDesktop ? "1rem" : "0.9rem" },
    input: { display: "block", width: "100%", padding: "0.75rem", fontSize: isDesktop ? "1rem" : "0.9rem", lineHeight: "1.5", color: "#495057", backgroundColor: "#fff", border: "1px solid #ced4da", borderRadius: "0.375rem", boxSizing: "border-box" },
    textarea: { display: "block", width: "100%", padding: "0.75rem", fontSize: isDesktop ? "1rem" : "0.9rem", lineHeight: "1.5", color: "#495057", backgroundColor: "#fff", border: "1px solid #ced4da", borderRadius: "0.375rem", resize: "vertical", minHeight: "80px", boxSizing: "border-box" },
    profilePhotoSection: { display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: "center", marginBottom: "2rem", gap: "1rem" },
    profileAvatar: { width: isDesktop ? "80px" : "60px", height: isDesktop ? "80px" : "60px", borderRadius: "50%", backgroundColor: "#f3d0ff", color: "#6f42c1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isDesktop ? "2rem" : "1.5rem", fontWeight: "600", marginRight: isDesktop ? "1rem" : "0", overflow: "hidden" },
    profileImg: { width: "100%", height: "100%", objectFit: "cover" },
    button: { display: "inline-block", fontWeight: "400", textAlign: "center", verticalAlign: "middle", cursor: "pointer", border: "1px solid #6c757d", padding: "0.5rem 1rem", fontSize: isDesktop ? "1rem" : "0.9rem", lineHeight: "1.5", borderRadius: "0.375rem", transition: "all 0.15s ease-in-out", textDecoration: "none", backgroundColor: "transparent", color: "#6c757d" }
  };

  return (
    <div>
      <h4 style={{ marginBottom: "1.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Edit profile</h4>
      
      <div style={styles.profilePhotoSection}>
        <div style={styles.profileAvatar}>
          {profileData.image ? <img src={profileData.image} alt="Profile" style={styles.profileImg} /> : "P"}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="profileImageInput" />
        <label htmlFor="profileImageInput" style={styles.button}>Change profile photo</label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name</label>
          <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name</label>
          <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} style={styles.input} />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>About</label>
        <textarea name="about" value={profileData.about} onChange={handleProfileChange} placeholder="Tell your story" style={styles.textarea} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Website</label>
        <input type="url" name="website" value={profileData.website} onChange={handleProfileChange} style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Username</label>
        <input type="text" name="username" value={profileData.username} onChange={handleProfileChange} style={styles.input} />
      </div>
    </div>
  );
};

export default EditProfile;
