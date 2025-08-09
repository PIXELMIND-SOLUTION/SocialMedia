import React, { useState } from "react";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("editProfile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit Profile Form Data
  const [profileData, setProfileData] = useState({
    firstName: "Pixelmind",
    lastName: "Solutions",
    about: "",
    website: "https://",
    username: "Manojkumar123",
  });

  // Account Management Data
  const [accountData, setAccountData] = useState({
    email: "Pixelmindsolutions@gmail.com",
    password: "••••••••",
    birthdate: "08/07/2025",
    gender: "Male",
    country: "India",
    language: "English"
  });

  // Profile Visibility Data
  const [visibilityData, setVisibilityData] = useState({
    privateProfile: true,
    searchPrivacy: true
  });

  // Social Permissions Data
  const [socialData, setSocialData] = useState({
    mentions: "Anyone",
    allowComments: true,
    filterMyComments: true,
    filterOthersComments: true,
    autoplayVideos: true
  });

  // Notifications Data
  const [notificationData, setNotificationData] = useState({
    friends: {
      comments: true,
      mentions: true,
      reminders: true,
      commentsWithPhotos: true
    },
    activityFromFollowed: {
      follows: true,
      saves: true
    },
    activityFromCreators: {
      newPosts: true,
      saves: true
    },
    browserNotifications: {
      newPosts: true,
      saves: true
    }
  });

  // Blocked Accounts Data
  const [blockedAccounts] = useState([
    {
      name: "Manoj kumar",
      email: "Manojkumar@gmail.com",
      avatar: "M"
    }
  ]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisibilityChange = (field) => {
    setVisibilityData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSocialChange = (field, value = null) => {
    setSocialData(prev => ({
      ...prev,
      [field]: value !== null ? value : !prev[field]
    }));
  };

  const handleNotificationChange = (category, field) => {
    setNotificationData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const menuItems = [
    { id: "editProfile", label: "Edit profile" },
    { id: "accountManagement", label: "Account management" },
    { id: "profileVisibility", label: "Profile visibility" },
    { id: "socialPermissions", label: "Social permissions" },
    { id: "notifications", label: "Notifications" },
    { id: "blockedAccounts", label: "Blocked accounts" }
  ];

  const styles = {
    container: {
      backgroundColor: "#ffddc8",
      minHeight: "100vh",
      padding: "10px",
      '@media (min-width: 768px)': {
        padding: "20px"
      }
    },
    mainCard: {
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      overflow: "hidden",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      '@media (min-width: 1024px)': {
        flexDirection: "row"
      }
    },
    mobileMenuButton: {
      display: "block",
      width: "100%",
      padding: "1rem 1.5rem",
      backgroundColor: "#f8f9fa",
      border: "none",
      borderBottom: "1px solid #dee2e6",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#495057",
      textAlign: "left",
      position: "relative",
      transition: "background-color 0.2s ease"
    },
    sidebar: {
      width: "280px",
      borderRight: "1px solid #dee2e6",
      padding: "1.5rem",
      backgroundColor: "white",
      display: "none"
    },
    sidebarContent: {
      padding: "0"
    },
    menuItem: {
      display: "block",
      width: "100%",
      padding: "0.75rem 1rem",
      backgroundColor: "transparent",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: "0.375rem",
      marginBottom: "0.25rem",
      transition: "all 0.15s ease-in-out",
      color: "#495057",
      textDecoration: "none",
      fontSize: "0.95rem"
    },
    activeMenuItem: {
      color: "#ff7a1c",
      backgroundColor: "#fff3cd",
      fontWeight: "600"
    },
    content: {
      flex: 1,
      padding: "1rem",
      '@media (min-width: 768px)': {
        padding: "1.5rem"
      },
      '@media (min-width: 1024px)': {
        padding: "2rem"
      }
    },
    formGroup: {
      marginBottom: "1rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      color: "#495057",
      fontSize: "0.9rem",
      '@media (min-width: 768px)': {
        fontSize: "1rem"
      }
    },
    input: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      borderRadius: "0.375rem",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      boxSizing: "border-box",
      '@media (min-width: 768px)': {
        fontSize: "1rem"
      }
    },
    textarea: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      borderRadius: "0.375rem",
      resize: "vertical",
      minHeight: "80px",
      boxSizing: "border-box",
      '@media (min-width: 768px)': {
        fontSize: "1rem"
      }
    },
    select: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      borderRadius: "0.375rem",
      boxSizing: "border-box",
      '@media (min-width: 768px)': {
        fontSize: "1rem"
      }
    },
    button: {
      display: "inline-block",
      fontWeight: "400",
      textAlign: "center",
      verticalAlign: "middle",
      cursor: "pointer",
      border: "1px solid transparent",
      padding: "0.5rem 1rem",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      borderRadius: "0.375rem",
      transition: "all 0.15s ease-in-out",
      textDecoration: "none",
      '@media (min-width: 768px)': {
        fontSize: "1rem"
      }
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
    card: {
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      marginBottom: "1rem"
    },
    cardBody: {
      padding: "1rem",
      '@media (min-width: 768px)': {
        padding: "1.5rem"
      }
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: "50px",
      height: "28px",
      '@media (min-width: 768px)': {
        width: "60px",
        height: "34px"
      }
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    switchSlider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      transition: "0.4s",
      borderRadius: "34px"
    },
    switchSliderActive: {
      backgroundColor: "#ff7a1c"
    },
    switchHandle: {
      position: "absolute",
      content: "",
      height: "20px",
      width: "20px",
      left: "4px",
      bottom: "4px",
      backgroundColor: "white",
      transition: "0.4s",
      borderRadius: "50%",
      '@media (min-width: 768px)': {
        height: "26px",
        width: "26px"
      }
    },
    switchHandleActive: {
      transform: "translateX(22px)",
      '@media (min-width: 768px)': {
        transform: "translateX(26px)"
      }
    },
    twoColumnGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "1rem",
      marginBottom: "1rem",
      '@media (min-width: 768px)': {
        gridTemplateColumns: "1fr 1fr"
      }
    },
    profilePhotoSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "2rem",
      gap: "1rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        alignItems: "center"
      }
    },
    profileAvatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#f3d0ff",
      color: "#6f42c1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      fontWeight: "600",
      '@media (min-width: 768px)': {
        width: "80px",
        height: "80px",
        fontSize: "2rem",
        marginRight: "1rem"
      }
    },
    passwordInputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        gap: "0"
      }
    },
    passwordInput: {
      borderTopRightRadius: "0.375rem",
      borderBottomRightRadius: "0.375rem",
      borderRight: "1px solid #ced4da",
      '@media (min-width: 768px)': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: "none"
      }
    },
    passwordShowButton: {
      borderTopLeftRadius: "0.375rem",
      borderBottomLeftRadius: "0.375rem",
      borderLeft: "1px solid #6c757d",
      '@media (min-width: 768px)': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: "none"
      }
    },
    passwordChangeButton: {
      marginLeft: "0",
      marginTop: "0.5rem",
      '@media (min-width: 768px)': {
        marginLeft: "0.5rem",
        marginTop: "0"
      }
    },
    genderOptions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        gap: "1rem"
      }
    },
    mentionOptions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0"
      }
    },
    cardTextContent: {
      flex: 1
    },
    actionButtons: {
      borderTop: "1px solid #dee2e6",
      paddingTop: "1.5rem",
      marginTop: "2rem"
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        justifyContent: "flex-end"
      }
    },
    blockedAccountCard: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      '@media (min-width: 768px)': {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0"
      }
    },
    blockedAccountInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    blockedAccountAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#f3d0ff",
      color: "#6f42c1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1rem",
      fontWeight: "600",
      '@media (min-width: 768px)': {
        width: "48px",
        height: "48px",
        fontSize: "1.25rem"
      }
    }
  };

  const Switch = ({ checked, onChange }) => (
    <label style={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={styles.switchInput}
      />
      <span
        style={{
          ...styles.switchSlider,
          ...(checked ? styles.switchSliderActive : {})
        }}
      >
        <span
          style={{
            ...styles.switchHandle,
            ...(checked ? styles.switchHandleActive : {})
          }}
        ></span>
      </span>
    </label>
  );

  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const renderEditProfile = () => (
    <div>
      <h4 style={{ marginBottom: "1.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Edit profile</h4>
      
      <div style={styles.profilePhotoSection}>
        <div style={styles.profileAvatar}>
          P
        </div>
        <button
          style={{
            ...styles.button,
            ...styles.secondaryButton
          }}
        >
          Change profile photo
        </button>
      </div>

      <div style={styles.twoColumnGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleProfileChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleProfileChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>About</label>
        <textarea
          name="about"
          value={profileData.about}
          onChange={handleProfileChange}
          placeholder="Tell your story"
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Website</label>
        <input
          type="url"
          name="website"
          value={profileData.website}
          onChange={handleProfileChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>User name</label>
        <input
          type="text"
          name="username"
          value={profileData.username}
          onChange={handleProfileChange}
          style={styles.input}
        />
      </div>
    </div>
  );

  const renderAccountManagement = () => (
    <div>
      <h4 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#495057", fontSize: "1.25rem" }}>Account management</h4>
      <p style={{ color: "#6c757d", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Easily edit your profile and manage your account preferences.</p>
      
      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1.1rem" }}>Your Account</h5>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            name="email"
            value={accountData.email}
            onChange={handleAccountChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordInputGroup}>
            <input
              type="password"
              name="password"
              value={accountData.password}
              onChange={handleAccountChange}
              style={{
                ...styles.input,
                ...styles.passwordInput
              }}
            />
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                ...styles.passwordShowButton
              }}
            >
              👁
            </button>
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                ...styles.passwordChangeButton
              }}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1.1rem" }}>Personal information</h5>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Birthdate</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="birthdate"
              value={accountData.birthdate}
              onChange={handleAccountChange}
              style={{
                ...styles.input,
                paddingRight: "3rem"
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              📅
            </span>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Gender</label>
          <div style={styles.genderOptions}>
            {["Male", "Female", "Non-binary"].map(gender => (
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
        <h5 style={{ fontWeight: "600", marginBottom: "1rem", color: "#495057", fontSize: "1.1rem" }}>Deactivation and deletion</h5>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <h6 style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" }}>Deactivate account</h6>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Temporarily hide your profile, Pins and boards</p>
          <button
            style={{
              ...styles.button,
              ...styles.secondaryButton
            }}
          >
            Deactivate account
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h6 style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" }}>Delete your data and account</h6>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Permanently delete your data and everything associated with your account</p>
          <button
            style={{
              ...styles.button,
              backgroundColor: "transparent",
              borderColor: "#dc3545",
              color: "#dc3545"
            }}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfileVisibility = () => (
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
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialPermissions = () => (
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
              <button
                style={{
                  ...styles.button,
                  ...styles.secondaryButton
                }}
              >
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
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
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

  const renderBlockedAccounts = () => (
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
              <button
                style={{
                  ...styles.button,
                  ...styles.secondaryButton
                }}
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "editProfile":
        return renderEditProfile();
      case "accountManagement":
        return renderAccountManagement();
      case "profileVisibility":
        return renderProfileVisibility();
      case "socialPermissions":
        return renderSocialPermissions();
      case "notifications":
        return renderNotifications();
      case "blockedAccounts":
        return renderBlockedAccounts();
      default:
        return renderEditProfile();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Mobile Toggle Menu */}
          <div style={{ display: window.innerWidth < 1024 ? 'block' : 'none' }}>
            <button
              style={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span style={{ marginRight: '0.5rem' }}>{isMobileMenuOpen ? '✕' : '☰'}</span>
              {menuItems.find(item => item.id === activeSection)?.label}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderTop: 'none',
                borderRadius: '0 0 15px 15px',
                zIndex: 1000,
                maxHeight: '70vh',
                overflowY: 'auto'
              }}>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    style={{
                      ...styles.menuItem,
                      ...(activeSection === item.id ? styles.activeMenuItem : {}),
                      width: '100%',
                      textAlign: 'left',
                      padding: '1rem 1.5rem',
                      borderRadius: '0',
                      borderBottom: '1px solid #f8f9fa',
                      fontSize: '1rem',
                      marginBottom: '0'
                    }}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span style={{ float: 'right', color: '#ff7a1c' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  zIndex: 999
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: window.innerWidth >= 1024 ? "row" : "column" }}>
            {/* Desktop Sidebar Menu */}
            <div style={{
              ...styles.sidebar,
              display: window.innerWidth >= 1024 ? 'block' : 'none'
            }}>
              <div style={styles.sidebarContent}>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    style={{
                      ...styles.menuItem,
                      ...(activeSection === item.id ? styles.activeMenuItem : {})
                    }}
                  >
                    {item.label} →
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div style={styles.content}>
              {renderContent()}
              
              {/* Action Buttons */}
              <div style={styles.actionButtons}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;