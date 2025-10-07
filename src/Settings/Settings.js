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

  // Account Management
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
    privateProfile: false,
    searchPrivacy: false,
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

  const [blockedAccounts] = useState([
    { name: "Manoj kumar", email: "Manojkumar@gmail.com", avatar: "M" },
  ]);

  // APIs
  const GET_PROFILE_API = `https://social-media-nty4.onrender.com/api/profiles/${userId}`;
  const UPDATE_PROFILE_API = `https://social-media-nty4.onrender.com/api/Profile`;
  const PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info`;
  const GET_PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info/${userId}`;
  const DELETE_PERSONAL_INFO_API = `https://social-media-nty4.onrender.com/api/personal-info/${userId}`;
  const DEACTIVATE_API = `https://social-media-nty4.onrender.com/api/account/deactivate`;
  const REACTIVATE_API = `https://social-media-nty4.onrender.com/api/account/reactivate`;
  const DELETE_ACCOUNT_API = `https://social-media-nty4.onrender.com/api/account/delete-account`;

  // ✅ Privacy APIs
  const PRIVACY_UPDATE_API = `https://social-media-nty4.onrender.com/api/privacy`;
  const GET_PRIVACY_API = `https://social-media-nty4.onrender.com/api/profile-visibility/${userId}/${userId}`;

  // Fetch all profile data on mount
  useEffect(() => {
    if (!userId) return;

    const fetchAllData = async () => {
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

        // ✅ Fetch privacy settings
        const privacyRes = await axios.get(GET_PRIVACY_API);
        if (privacyRes.data.success && privacyRes.data.data.privacy) {
          const { profileVisibility, searchEngineIndexing } = privacyRes.data.data.privacy;
          setVisibilityData({
            privateProfile: profileVisibility === "private",
            searchPrivacy: !searchEngineIndexing,
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        Swal.fire("Error", "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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

  // ✅ Handle privacy change (API integration)
  const handleVisibilityChange = async (field) => {
    const newState = {
      ...visibilityData,
      [field]: !visibilityData[field],
    };
    setVisibilityData(newState);

    try {
      const payload = {
        userId,
        profileVisibility: newState.privateProfile ? "private" : "public",
        searchEngineIndexing: newState.searchPrivacy ? "off" : "on",
      };
      await axios.post(PRIVACY_UPDATE_API, payload);
      Swal.fire("Updated", "Privacy settings updated successfully ✅", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update privacy settings", "error");
    }
  };

  const handleSaveProfile = async () => {
    try {
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
      Swal.fire("Error", "Failed to update settings", "error");
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
        return <SocialPermissions socialData={socialData} />;
      case "notifications":
        return (
          <Notifications
            notificationData={notificationData}
          />
        );
      case "blockedAccounts":
        return <BlockedAccounts blockedAccounts={blockedAccounts} />;
      default:
        return null;
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
