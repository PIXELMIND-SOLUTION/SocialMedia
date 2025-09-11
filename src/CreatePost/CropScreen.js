import React from "react";
import { ChevronLeft, Plus, X } from "lucide-react";

const CropScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  setSelectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  cropRatio,
  setCropRatio,
  handleAddMoreImages,
  handleImageRemove,
  fileInputRef,
}) => {
  // ✅ FIX: Handle case where setSelectedImages might not be provided
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    
    // Check if setSelectedImages is a function before calling it
    if (typeof setSelectedImages === 'function') {
      setSelectedImages((prev) => [...prev, ...newImages]);
    } else if (typeof handleAddMoreImages === 'function') {
      // Fallback to handleAddMoreImages if available
      handleAddMoreImages(newImages);
    }
  };

  // Fallback function if handleImageRemove is not provided
  const handleRemoveImage = (index) => {
    if (typeof handleImageRemove === 'function') {
      handleImageRemove(index);
    } else if (typeof setSelectedImages === 'function') {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      
      // Adjust current image index if needed
      if (currentImageIndex >= index && currentImageIndex > 0) {
        setCurrentImageIndex(prev => Math.max(0, prev - 1));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-center flex-1">
            Crop
          </h2>
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition"
          >
            Next
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-50 p-4 sm:p-6">
          {/* Crop Ratio Selector */}
          <div className="absolute left-3 top-3 sm:left-6 sm:top-6 bg-gray-800 bg-opacity-90 rounded-lg p-2 sm:p-3 space-y-2 sm:space-y-3 z-10">
            {[
              { label: "Original", value: "original", icon: "↗" },
              { label: "1:1", value: "1:1", icon: "⬜" },
              { label: "4:5", value: "4:5", icon: "▬" },
              { label: "16:9", value: "16:9", icon: "▭" },
            ].map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setCropRatio && setCropRatio(ratio.value)}
                className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm w-full transition ${
                  cropRatio === ratio.value
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-gray-600"
                }`}
              >
                <div className="w-4 h-4 border border-current flex items-center justify-center text-[10px]">
                  {ratio.icon}
                </div>
                <span>{ratio.label}</span>
              </button>
            ))}
          </div>

          {/* Image Display */}
          <div className="flex flex-col items-center w-full mb-4">
            <div className="relative w-full flex items-center justify-center">
              {selectedImages && selectedImages.length > 0 && (
                <img
                  src={selectedImages[currentImageIndex]?.url}
                  alt="Crop preview"
                  className="max-h-72 sm:max-h-96 w-auto object-cover rounded-lg shadow-lg"
                  style={{
                    aspectRatio:
                      cropRatio === "1:1"
                        ? "1/1"
                        : cropRatio === "4:5"
                        ? "4/5"
                        : cropRatio === "16:9"
                        ? "16/9"
                        : "auto",
                  }}
                />
              )}

              {/* Image navigation */}
              {selectedImages && selectedImages.length > 1 && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center space-x-1">
                  <button
                    onClick={() =>
                      setCurrentImageIndex && setCurrentImageIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="w-6 h-6 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-white text-xs sm:text-sm">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentImageIndex && setCurrentImageIndex((prev) =>
                        Math.min(selectedImages.length - 1, prev + 1)
                      )
                    }
                    className="w-6 h-6 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4 transform rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Preview Bar */}
          {selectedImages && selectedImages.length > 0 && (
            <div className="w-full mt-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setCurrentImageIndex && setCurrentImageIndex(index)}
                    style={{
                      width: "80px",
                      height: "60px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}              
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropScreen;