import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

const PostScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  currentImageIndex,
  postText,
  setPostText,
  location,
  setLocation,
  hideEngagement,
  setHideEngagement,
  commentsOff,
  setCommentsOff,
  getCurrentImageFilter,
  cropRatio,
}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Extract current user ID from session
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = userData?.userId;

  const currentItem = selectedImages[currentImageIndex];
  const displayFilter =
    currentItem?.type === "image" ? getCurrentImageFilter() : "none";

  // Handle image aspect ratio
  const aspectStyle = {};
  if (currentItem?.type === "image") {
    if (cropRatio === "1:1") aspectStyle.aspectRatio = "1/1";
    else if (cropRatio === "4:5") aspectStyle.aspectRatio = "4/5";
    else if (cropRatio === "16:9") aspectStyle.aspectRatio = "16/9";
  }

  // 🔹 Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUserId) return;
        const res = await fetch(
          `https://social-media-nty4.onrender.com/api/profiles/${currentUserId}`
        );
        const data = await res.json();
        if (data.success) {
          setProfileData(data.data);
        } else {
          console.error("Profile fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUserId]);

  // Get profile image or fallback
  const profileImage = profileData?.profile?.image;
  const firstLetter = profileData?.profile?.firstName?.charAt(0)?.toUpperCase() || "U";
  const fullName = profileData?.profile?.firstName
    ? `${profileData.profile.firstName} ${profileData.profile.lastName || ""}`
    : "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Create new post</h2>
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium"
          >
            Post Now
          </button>
        </div>

        <div className="p-6">
          {/* User Profile */}
          <div className="flex items-center mb-6">
            {loading ? (
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {firstLetter}
              </div>
            )}
            <span className="ml-3 font-medium text-gray-900">
              {profileData?.profile?.username || fullName}
            </span>
          </div>

          {/* Media Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {currentItem?.type === "image" ? (
                <img
                  src={currentItem.url}
                  alt="Post preview"
                  className="max-w-xs max-h-64 object-cover rounded-lg shadow-lg"
                  style={{
                    filter: displayFilter,
                    ...aspectStyle,
                  }}
                />
              ) : currentItem?.type === "video" ? (
                <video
                  src={currentItem.url}
                  className="max-w-xs max-h-64 object-cover rounded-lg shadow-lg"
                  controls
                  muted
                  playsInline
                />
              ) : null}

              {/* Media counter */}
              {selectedImages.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1">
                  <span className="text-white text-sm">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="mb-6">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write a caption..."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              rows="4"
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                {postText.length}/2000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostScreen;
