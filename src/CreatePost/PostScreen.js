import React from 'react';
import { ChevronLeft, Smile, MapPin } from 'lucide-react';

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
  const currentItem = selectedImages[currentImageIndex];

  // Only apply filter if it's an image
  const displayFilter = currentItem?.type === "image" ? getCurrentImageFilter() : "none";

  // Determine aspect ratio style (only for images)
  const aspectStyle = {};
  if (currentItem?.type === "image") {
    if (cropRatio === "1:1") aspectStyle.aspectRatio = "1/1";
    else if (cropRatio === "4:5") aspectStyle.aspectRatio = "4/5";
    else if (cropRatio === "16:9") aspectStyle.aspectRatio = "16/9";
    // else 'original' → no forced aspect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
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
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              P
            </div>
            <span className="ml-3 font-medium text-gray-900">PMS</span>
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
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 flex">
                  <span className="text-white text-sm px-2">
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
              <span className="text-sm text-gray-400">{postText.length}/2000</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default PostScreen;