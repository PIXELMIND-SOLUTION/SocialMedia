import React from "react";
import Switch from "./Switch";

const SocialPermissions = ({ socialData, handleSocialChange, isDesktop }) => {
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
    mentionOptions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
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
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Social permissions</h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Control who can engage with you on Name and adjust permissions for the latest tools.</p>
      
      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#495057", fontSize: "1.1rem" }}>@Mentions</h5>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "1rem" }}>Choose who can @mention you</p>
        <div style={styles.mentionOptions}>
          {["Anyone", "Only people you follow", "Turn off"].map(option => (
            <label key={option} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <input
                type="radio"
                name="mentions"
                value={option}
                checked={socialData.mentions === option}
                onChange={(e) => handleSocialChange('mentions', e.target.value)}
                style={{ marginRight: "0.75rem" }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1.1rem" }}>Comments</h5>
        
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.cardContent}>
              <div style={styles.cardTextContent}>
                <h6 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "0.95rem" }}>Allow comments on your Posts</h6>
                <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>Comments are automatically turned on for both new and current posts.</p>
              </div>
              <Switch
                checked={socialData.allowComments}
                onChange={() => handleSocialChange('allowComments')}
                isDesktop={isDesktop}
              />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.cardContent}>
              <div style={styles.cardTextContent}>
                <h6 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "0.95rem" }}>Filter comments on my Posts</h6>
                <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>Automatically hide comments on your posts that include certain words or phrases.</p>
              </div>
              <Switch
                checked={socialData.filterMyComments}
                onChange={() => handleSocialChange('filterMyComments')}
                isDesktop={isDesktop}
              />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.cardContent}>
              <div style={styles.cardTextContent}>
                <h6 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "0.95rem" }}>Filter comments on others' Posts</h6>
                <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>Automatically hide comments on others' posts containing specific words or phrases.</p>
              </div>
              <Switch
                checked={socialData.filterOthersComments}
                onChange={() => handleSocialChange('filterOthersComments')}
                isDesktop={isDesktop}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.cardContent}>
              <div style={styles.cardTextContent}>
                <h5 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "1rem" }}>Blocked accounts</h5>
                <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>When you block someone, you'll both still see each other's profiles, but can't message, follow, or save each other's content.</p>
              </div>
              <button style={styles.button}>
                Edit list
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
            <div style={styles.cardTextContent}>
              <h5 style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#495057", fontSize: "1rem" }}>Autoplay videos</h5>
              <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: 0 }}>Autoplay videos on desktop</p>
            </div>
            <Switch
              checked={socialData.autoplayVideos}
              onChange={() => handleSocialChange('autoplayVideos')}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPermissions;