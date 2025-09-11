import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsLayout from "./SettingLayout";
import EditProfile from "./EditProfile";
import AccountManagement from "./AccountManagement";
import ProfileVisibility from "./ProfileVisibility";
import SocialPermissions from "./SocialPermissions";
import Notifications from "./Notifications";
import BlockedAccounts from "./BlockedAccounts";
import Swal from "sweetalert2";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("editProfile");
  const [loading, setLoading] = useState(true);

  // Profile Data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    website: "",
    username: "",
    image: "",
  });

  // Account Management Data
  const [accountData, setAccountData] = useState({
    email: "",
    password: "",
    birthdate: "",
    gender: "",
    country: "",
    language: "",
  });

  // Profile Visibility
  const [visibilityData, setVisibilityData] = useState({
    privateProfile: true,
    searchPrivacy: true,
  });

  // Social Permissions
  const [socialData, setSocialData] = useState({
    mentions: "Anyone",
    allowComments: true,
    filterMyComments: true,
    filterOthersComments: true,
    autoplayVideos: true,
  });

  // Notifications
  const [notificationData, setNotificationData] = useState({
    friends: {
      comments: true,
      mentions: true,
      reminders: true,
      commentsWithPhotos: true,
    },
    activityFromFollowed: {
      follows: true,
      saves: true,
    },
    activityFromCreators: {
      newPosts: true,
      saves: true,
    },
    browserNotifications: {
      newPosts: true,
      saves: true,
    },
  });

  // Blocked Accounts
  const [blockedAccounts] = useState([
    {
      name: "Manoj kumar",
      email: "Manojkumar@gmail.com",
      avatar: "M",
    },
  ]);

  const PROFILE_API = "https://social-media-nty4.onrender.com/api/profile/68bc03a1aff2b0d7a66aedd1";

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PROFILE_API);
        if (res.data.success) {
          const profile = res.data.data.profile;
          setProfileData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            username: profile.username,
            about: profile.about,
            website: profile.website,
            image: profile.image,
          });

          setAccountData((prev) => ({
            ...prev,
            email: res.data.data.email || prev.email,
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        Swal.fire("Error", "Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (field) => {
    setVisibilityData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSocialChange = (field, value = null) => {
    setSocialData((prev) => ({ ...prev, [field]: value !== null ? value : !prev[field] }));
  };

  const handleNotificationChange = (category, field) => {
    setNotificationData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: !prev[category][field] },
    }));
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    try {
      const payload = {
        profile: profileData,
        account: accountData,
        visibility: visibilityData,
        social: socialData,
        notifications: notificationData,
      };

      const res = await axios.post(PROFILE_API, payload);
      if (res.data.success) {
        Swal.fire("Success", "Profile updated successfully ✅", "success");
      } else {
        Swal.fire("Error", "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;

    switch (activeSection) {
      case "editProfile":
        return <EditProfile profileData={profileData} handleProfileChange={handleProfileChange} />;
      case "accountManagement":
        return <AccountManagement accountData={accountData} handleAccountChange={handleAccountChange} />;
      case "profileVisibility":
        return <ProfileVisibility visibilityData={visibilityData} handleVisibilityChange={handleVisibilityChange} />;
      case "socialPermissions":
        return <SocialPermissions socialData={socialData} handleSocialChange={handleSocialChange} />;
      case "notifications":
        return <Notifications notificationData={notificationData} handleNotificationChange={handleNotificationChange} />;
      case "blockedAccounts":
        return <BlockedAccounts blockedAccounts={blockedAccounts} />;
      default:
        return <EditProfile profileData={profileData} handleProfileChange={handleProfileChange} />;
    }
  };

  return (
    <SettingsLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
      <div className="text-end mt-4">
        <button className="btn btn-primary" onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>
    </SettingsLayout>
  );
};

export default Settings;
