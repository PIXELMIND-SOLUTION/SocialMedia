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

  // Get logged-in user from session
  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

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

  // Blocked Accounts (dummy for now)
  const [blockedAccounts] = useState([
    {
      name: "Manoj kumar",
      email: "Manojkumar@gmail.com",
      avatar: "M",
    },
  ]);

  // APIs
  const GET_PROFILE_API = `https://social-media-nty4.onrender.com/api/profiles/${userId}`;
  const UPDATE_PROFILE_API = `https://social-media-nty4.onrender.com/api/Profile`;

  const PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info`;
  const GET_PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info/${userId}`;
  const DELETE_PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info/${userId}`;

  const DEACTIVATE_API = `https://social-media-nty4.onrender.com/api/deactivate`;
  const REACTIVATE_API = `https://social-media-nty4.onrender.com/api/reactivate`;
  const DELETE_ACCOUNT_API = `https://social-media-nty4.onrender.com/api/delete-account`;

  // Fetch profile + personal info on mount
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profile
        const profileRes = await axios.get(GET_PROFILE_API);
        if (profileRes.data.success) {
          const profile = profileRes.data.data.profile;
          setProfileData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            username: profile.username || "",
            about: profile.about || "",
            website: profile.website || "",
            image: profile.image || "",
          });
          setAccountData((prev) => ({
            ...prev,
            email: profileRes.data.data.email || prev.email,
          }));
        }

        // Fetch personal info
        const personalRes = await axios.get(GET_PERSONAL_INFO_API);
        if (personalRes.data.success) {
          const info = personalRes.data.data;
          setAccountData((prev) => ({
            ...prev,
            birthdate: info.birthdate || "",
            gender: info.gender || "",
            country: info.country || "",
            language: info.language || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        Swal.fire("Error", "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setProfileData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
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

  // Save Profile + Personal Info
  const handleSaveProfile = async () => {
    try {
      // Profile API (form-data for image)
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("about", profileData.about || "");
      formData.append("website", profileData.website || "");
      if (profileData.image && typeof profileData.image !== "string") {
        formData.append("image", profileData.image);
      }
      await axios.post(UPDATE_PROFILE_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Personal Info API
      const personalPayload = {
        userId,
        birthdate: accountData.birthdate,
        gender: accountData.gender,
        country: accountData.country,
        language: accountData.language,
      };
      await axios.post(PERSONAL_INFO_API, personalPayload);

      Swal.fire("Success", "Settings updated successfully ✅", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update settings", "error");
    }
  };

  // Account Actions
  const handleDeactivate = async () => {
    try {
      await axios.post(DEACTIVATE_API, { userId });
      Swal.fire("Deactivated", "Account has been deactivated", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to deactivate account", "error");
    }
  };

  const handleReactivate = async () => {
    try {
      await axios.post(REACTIVATE_API, { userId });
      Swal.fire("Reactivated", "Account has been reactivated", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to reactivate account", "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(DELETE_ACCOUNT_API, { userId });
      Swal.fire("Deleted", "Your account has been permanently deleted", "success");
      sessionStorage.clear();
      window.location.href = "/"; // redirect to home/login
    } catch (err) {
      Swal.fire("Error", "Failed to delete account", "error");
    }
  };

  const handleDeletePersonalInfo = async () => {
    try {
      await axios.delete(DELETE_PERSONAL_INFO_API);
      Swal.fire("Deleted", "Personal info removed successfully", "success");
      setAccountData((prev) => ({
        ...prev,
        birthdate: "",
        gender: "",
        country: "",
        language: "",
      }));
    } catch (err) {
      Swal.fire("Error", "Failed to delete personal info", "error");
    }
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;

    switch (activeSection) {
      case "editProfile":
        return <EditProfile profileData={profileData} handleProfileChange={handleProfileChange} />;
      case "accountManagement":
        return (
          <AccountManagement
            accountData={accountData}
            handleAccountChange={handleAccountChange}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
            onDeleteAccount={handleDeleteAccount}
            onDeletePersonalInfo={handleDeletePersonalInfo}
          />
        );
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
