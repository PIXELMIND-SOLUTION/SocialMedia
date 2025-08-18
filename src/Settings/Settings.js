import React, { useState } from "react";
import SettingsLayout from "./SettingLayout";
import EditProfile from "./EditProfile";
import AccountManagement from "./AccountManagement";
import ProfileVisibility from "./ProfileVisibility";
import SocialPermissions from "./SocialPermissions";
import Notifications from "./Notifications";
import BlockedAccounts from "./BlockedAccounts";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("editProfile");
 
  
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


  const renderContent = () => {
    switch (activeSection) {
      case "editProfile":
        return (
          <EditProfile 
            profileData={profileData} 
            handleProfileChange={handleProfileChange} 
          />
        );
      case "accountManagement":
        return (
          <AccountManagement 
            accountData={accountData} 
            handleAccountChange={handleAccountChange} 
          />
        );
      case "profileVisibility":
        return (
          <ProfileVisibility 
            visibilityData={visibilityData} 
            handleVisibilityChange={handleVisibilityChange} 
          />
        );
      case "socialPermissions":
        return (
          <SocialPermissions 
            socialData={socialData} 
            handleSocialChange={handleSocialChange} 
          />
        );
      case "notifications":
        return (
          <Notifications 
            notificationData={notificationData} 
            handleNotificationChange={handleNotificationChange} 
          />
        );
      case "blockedAccounts":
        return <BlockedAccounts blockedAccounts={blockedAccounts} />;
      default:
        return (
          <EditProfile 
            profileData={profileData} 
            handleProfileChange={handleProfileChange} 
          />
        );
    }
  };

  return (
    <SettingsLayout 
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderContent()}
    </SettingsLayout>
  );
};

export default Settings;