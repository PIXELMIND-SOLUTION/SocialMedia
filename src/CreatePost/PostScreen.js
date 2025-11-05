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
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(currentImageIndex);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = userData?.userId;

  const currentItem = selectedImages[currentPreviewIndex];
  const displayFilter = currentItem?.type === "image" ? getCurrentImageFilter() : "none";

  // Sync current preview index with currentImageIndex
  useEffect(() => {
    setCurrentPreviewIndex(currentImageIndex);
  }, [currentImageIndex]);

  // Handle image aspect ratio
  const getAspectStyle = () => {
    const style = {};
    if (currentItem?.type === "image") {
      switch (cropRatio) {
        case "1:1":
          style.aspectRatio = "1/1";
          style.maxWidth = "320px";
          style.maxHeight = "320px";
          break;
        case "4:5":
          style.aspectRatio = "4/5";
          style.maxWidth = "256px";
          style.maxHeight = "320px";
          break;
        case "16:9":
          style.aspectRatio = "16/9";
          style.maxWidth = "320px";
          style.maxHeight = "180px";
          break;
        case "full":
          style.aspectRatio = "16/9";
          style.maxWidth = "320px";
          style.maxHeight = "180px";
          break;
        case "original":
          style.maxWidth = "320px";
          style.maxHeight = "400px";
          break;
        default:
          style.maxWidth = "320px";
          style.maxHeight = "320px";
      }
    }
    return style;
  };

  const aspectStyle = getAspectStyle();

  const handleNextPreview = () => {
    if (currentPreviewIndex < selectedImages.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    }
  };

  const handlePrevPreview = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUserId) {
          setLoading(false);
          return;
        }
        
        const res = await fetch(
          `https://social-media-nty4.onrender.com/api/profiles/${currentUserId}`
        );
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProfileData(data.data);
          } else {
            console.error("Profile fetch failed:", data.message);
          }
        } else {
          console.error("Profile fetch failed with status:", res.status);
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
  const username = profileData?.profile?.username || fullName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Create new post</h2>
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
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
                alt={username}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            {!profileImage && (
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {firstLetter}
              </div>
            )}
            
            <span className="ml-3 font-medium text-gray-900">
              {username}
            </span>
          </div>

          {/* Media Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {currentItem ? (
                currentItem.type === "image" ? (
                  <div className="relative">
                    <img
                      key={`post-preview-${currentItem.id}-${currentPreviewIndex}`}
                      src={currentItem.url}
                      alt="Post preview"
                      className="rounded-lg shadow-lg object-contain bg-gray-100"
                      style={{
                        filter: displayFilter,
                        ...aspectStyle,
                      }}
                      onError={(e) => {
                        console.error("Preview image failed to load:", currentItem.url);
                        // Try fallback URL
                        if (currentItem.originalUrl && currentItem.originalUrl !== currentItem.url) {
                          e.target.src = currentItem.originalUrl;
                        } else {
                          e.target.src = "/assets/images/placeholder.jpg";
                        }
                      }}
                    />
                    
                    {/* Filter overlay indicator */}
                    {displayFilter !== "none" && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Filtered
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      key={`post-video-${currentItem.id}-${currentPreviewIndex}`}
                      src={currentItem.url}
                      className="rounded-lg shadow-lg object-contain bg-black"
                      style={aspectStyle}
                      controls
                      muted
                      playsInline
                      onError={(e) => {
                        console.error("Preview video failed to load:", currentItem.url);
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Video
                    </div>
                  </div>
                )
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No media selected</span>
                </div>
              )}

              {/* Media counter and navigation */}
              {selectedImages.length > 1 && (
                <>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1">
                    <span className="text-white text-sm font-medium">
                      {currentPreviewIndex + 1}/{selectedImages.length}
                    </span>
                  </div>
                  
                  {/* Navigation arrows */}
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2">
                    <button
                      onClick={handlePrevPreview}
                      disabled={currentPreviewIndex === 0}
                      className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextPreview}
                      disabled={currentPreviewIndex === selectedImages.length - 1}
                      className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </>
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