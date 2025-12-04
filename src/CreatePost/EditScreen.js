import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";

const EditScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  activeTab,
  setActiveTab,
  selectedFilter,
  setSelectedFilter,
  filters,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  fade,
  setFade,
  saturation,
  setSaturation,
  temperature,
  setTemperature,
  getCurrentImageFilter,
  cropRatio,
}) => {
  const currentImage = selectedImages[currentImageIndex];
  const previewGenerationRef = useRef(null);

  // Helper to get aspect ratio class based on saved crop ratio
  const getAspectRatioClass = () => {
    // Get the actual crop ratio from the image data or fallback to prop
    const itemCropRatio = currentImage?.cropRatio || cropRatio;
    
    switch (itemCropRatio) {
      case "1:1":
        return "aspect-square";
      case "3:4":
        return "aspect-[3/4]";
      case "4:3":
        return "aspect-[4/3]";
      case "4:5":
        return "aspect-[4/5]";
      case "5:4":
        return "aspect-[5/4]";
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
        return "aspect-video";
      case "original":
        // For original, we need to calculate from image dimensions
        if (currentImage?.originalAspect) {
          return `aspect-[${currentImage.originalAspect}]`;
        }
        return "aspect-auto";
      default:
        return "aspect-auto";
    }
  };

  // Helper to get aspect ratio style for preview container
  const getAspectRatioStyle = () => {
    const itemCropRatio = currentImage?.cropRatio || cropRatio;
    
    switch (itemCropRatio) {
      case "1:1":
        return { maxWidth: "320px", maxHeight: "320px" };
      case "3:4":
        return { maxWidth: "240px", maxHeight: "320px" };
      case "4:3":
        return { maxWidth: "320px", maxHeight: "240px" };
      case "4:5":
        return { maxWidth: "256px", maxHeight: "320px" };
      case "5:4":
        return { maxWidth: "320px", maxHeight: "256px" };
      case "9:16":
        return { maxWidth: "180px", maxHeight: "320px" };
      case "16:9":
        return { maxWidth: "320px", maxHeight: "180px" };
      case "original":
        return { maxWidth: "320px", maxHeight: "400px" };
      default:
        return { maxWidth: "320px", maxHeight: "320px" };
    }
  };

  // Get current filter style for main preview
  const getCurrentFilterStyle = () => {
    if (!currentImage || currentImage.type === "video") return "none";
    return getCurrentImageFilter();
  };

  const handleNextImage = () => {
    if (currentImageIndex < selectedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Reset adjustments when image changes
  useEffect(() => {
    if (currentImage) {
      setBrightness(50);
      setContrast(50);
      setFade(50);
      setSaturation(50);
      setTemperature(50);
      setSelectedFilter("Normal");
      setActiveTab("filters");
    }
  }, [currentImageIndex, currentImage?.id]);

  // Thumbnail navigation
  const thumbnailStyle = (img) => {
    const itemCropRatio = img.cropRatio || cropRatio;
    
    switch (itemCropRatio) {
      case "1:1":
        return "w-12 h-12";
      case "3:4":
        return "w-9 h-12";
      case "4:3":
        return "w-12 h-9";
      case "4:5":
        return "w-9.6 h-12";
      case "5:4":
        return "w-12 h-9.6";
      case "9:16":
        return "w-6.75 h-12";
      case "16:9":
        return "w-12 h-6.75";
      case "original":
        return "w-12 h-12";
      default:
        return "w-12 h-12";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-4 md:p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Edit</h2>
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: Preview */}
          <div className="flex-1 p-4 md:p-6 bg-gray-50 flex flex-col items-center justify-center">
            {/* Main Preview */}
            <div className="relative w-full flex justify-center items-center" style={getAspectRatioStyle()}>
              {currentImage ? (
                currentImage.type === "video" ? (
                  <div className="w-full h-full bg-black rounded-lg overflow-hidden">
                    <video
                      key={`video-${currentImage.id}-${currentImageIndex}`}
                      src={currentImage.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center ${getAspectRatioClass()}`}>
                    <img
                      key={`image-${currentImage.id}-${currentImageIndex}`}
                      src={currentImage.url}
                      alt="Edit preview"
                      className="w-full h-full object-contain"
                      style={{
                        filter: getCurrentFilterStyle(),
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", currentImage.url);
                        if (currentImage.originalUrl && currentImage.originalUrl !== currentImage.url) {
                          e.target.src = currentImage.originalUrl;
                        } else {
                          e.target.src = "/assets/images/placeholder.jpg";
                        }
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500 text-center p-8">
                    <p>No image selected</p>
                    <p className="text-sm mt-2">Please go back and select images</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {selectedImages.length > 1 && (
              <div className="mt-6 flex space-x-2 overflow-x-auto pb-2 max-w-full">
                {selectedImages.map((img, idx) => (
                  <div key={img.id} className="relative flex-shrink-0">
                    <div
                      className={`rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                        idx === currentImageIndex
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      {img.type === "image" ? (
                        <img
                          src={img.url}
                          alt={`Thumb ${idx + 1}`}
                          className={thumbnailStyle(img)}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={`relative ${thumbnailStyle(img)} bg-black flex items-center justify-center`}>
                          <div className="w-4 h-4 border-r-0 border-l-2 border-t-2 border-b-2 border-white transform translate-x-0.5 rotate-45" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-0.5">
                            Video
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Crop ratio badge */}
                    {img.cropRatio && img.cropRatio !== "original" && img.type === "image" && (
                      <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {img.cropRatio.split(':')[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Navigation for multiple images */}
            {selectedImages.length > 1 && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className="p-2 bg-gray-800 text-white rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {currentImageIndex + 1}/{selectedImages.length}
                </span>
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === selectedImages.length - 1}
                  className="p-2 bg-gray-800 text-white rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            )}
            
            {/* Current crop ratio info */}
            {currentImage?.cropRatio && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Crop: {currentImage.cropRatio === "original" 
                  ? `Original (${currentImage.originalAspect ? currentImage.originalAspect.toFixed(2) : 'auto'})` 
                  : currentImage.cropRatio}
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="w-full md:w-80 border-l">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("filters")}
                className={`flex-1 py-4 px-4 font-medium transition-colors ${
                  activeTab === "filters"
                    ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setActiveTab("adjustments")}
                className={`flex-1 py-4 px-4 font-medium transition-colors ${
                  activeTab === "adjustments"
                    ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                Adjustments
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6 max-h-96 overflow-y-auto">
              {activeTab === "filters" ? (
                <div className="grid grid-cols-3 gap-3">
                  {filters.map((filter) => (
                    <FilterButton
                      key={filter.name}
                      filter={filter}
                      currentImage={currentImage}
                      selectedFilter={selectedFilter}
                      setSelectedFilter={setSelectedFilter}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {[
                    {
                      label: "Brightness",
                      value: brightness,
                      setter: setBrightness,
                      icon: "☀️",
                    },
                    { 
                      label: "Contrast", 
                      value: contrast, 
                      setter: setContrast,
                      icon: "◐",
                    },
                    { 
                      label: "Fade", 
                      value: fade, 
                      setter: setFade,
                      icon: "🌫️",
                    },
                    {
                      label: "Saturation",
                      value: saturation,
                      setter: setSaturation,
                      icon: "🎨",
                    },
                    {
                      label: "Temperature",
                      value: temperature,
                      setter: setTemperature,
                      icon: "🌡️",
                    },
                  ].map(({ label, value, setter, icon }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{icon}</span>
                          <label className="text-sm font-medium text-gray-900">
                            {label}
                          </label>
                        </div>
                        <span className="text-sm font-medium text-orange-600">
                          {value}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Reset button */}
                  <button
                    onClick={() => {
                      setBrightness(50);
                      setContrast(50);
                      setFade(50);
                      setSaturation(50);
                      setTemperature(50);
                    }}
                    className="w-full mt-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Adjustments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for each filter button to manage its own state
const FilterButton = ({ filter, currentImage, selectedFilter, setSelectedFilter }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate preview when current image changes
  useEffect(() => {
    if (!currentImage || currentImage.type === "video") {
      setPreviewUrl(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const generatePreview = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = "anonymous";
        img.src = currentImage.url;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Set canvas size based on image aspect ratio
        const aspectRatio = img.width / img.height;
        canvas.width = 80;
        canvas.height = 80 / aspectRatio;
        
        // Apply the filter
        ctx.filter = filter.filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL for preview
        canvas.toBlob(blob => {
          if (blob && isMounted) {
            const newPreviewUrl = URL.createObjectURL(blob);
            setPreviewUrl(newPreviewUrl);
            setIsLoading(false);
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        console.error(`Failed to generate preview for ${filter.name}:`, error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [currentImage?.url, filter.filter, filter.name]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!currentImage || currentImage.type === "video") {
    return (
      <div className="text-center">
        <button
          disabled
          className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100 opacity-50"
        >
          <span className="text-xs text-gray-500">N/A</span>
        </button>
        <p className="text-xs text-gray-600 mt-1">{filter.name}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={() => setSelectedFilter(filter.name)}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all relative group ${
          selectedFilter === filter.name
            ? "border-orange-500 ring-2 ring-orange-200 scale-105"
            : "border-gray-200 hover:border-orange-300 hover:scale-105"
        }`}
      >
        {/* Show preview if available, otherwise show original with CSS filter */}
        <div className="w-full h-full relative">
          <img
            src={previewUrl || currentImage.url}
            alt={filter.name}
            className="w-full h-full object-cover"
            style={{ 
              filter: previewUrl ? 'none' : filter.filter
            }}
            onError={(e) => {
              console.error("Filter preview failed to load");
              // Fallback to CSS filter
              e.target.style.filter = filter.filter;
            }}
          />
          
          {/* Show loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-orange-500"></div>
            </div>
          )}
          
          {/* Selected overlay */}
          {selectedFilter === filter.name && (
            <div className="absolute inset-0 bg-orange-500 bg-opacity-20"></div>
          )}
        </div>
        
        {/* Checkmark for selected filter */}
        {selectedFilter === filter.name && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
      <p className={`text-xs mt-1 font-medium ${
        selectedFilter === filter.name ? "text-orange-600" : "text-gray-600"
      }`}>
        {filter.name}
      </p>
    </div>
  );
};

export default EditScreen;