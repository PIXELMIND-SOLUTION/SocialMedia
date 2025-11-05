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

  // Helper to get aspect ratio class
  const getAspectRatioClass = () => {
    switch (cropRatio) {
      case "1:1":
        return "aspect-square";
      case "4:5":
        return "aspect-[4/5]";
      case "16:9":
        return "aspect-video";
      case "full":
        return "w-full h-[80vh]";
      case "original":
        return "w-full h-[80vh]";
      default:
        return "w-full h-[80vh]";
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
    }
  }, [currentImageIndex, currentImage?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-4 md:p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Edit</h2>
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: Preview */}
          <div className="flex-1 p-4 md:p-6 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            <div className="relative w-full max-w-sm md:max-w-md">
              {/* Aspect ratio wrapper */}
              <div
                className={`${getAspectRatioClass()} bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300`}
              >
                {currentImage ? (
                  currentImage.type === "video" ? (
                    <video
                      key={`video-${currentImage.id}-${currentImageIndex}`}
                      src={currentImage.url}
                      controls
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <img
                      key={`image-${currentImage.id}-${currentImageIndex}`}
                      src={currentImage.url}
                      alt="Edit preview"
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      style={{
                        filter: getCurrentFilterStyle(),
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", currentImage.url);
                        if (currentImage.originalUrl && currentImage.originalUrl !== currentImage.url) {
                          e.target.src = currentImage.originalUrl;
                        }
                      }}
                    />
                  )
                ) : (
                  <div className="text-gray-500 text-center p-8">
                    <p>No image selected</p>
                    <p className="text-sm mt-2">Please go back and select images</p>
                  </div>
                )}
              </div>

              {/* Navigation for multiple images */}
              {selectedImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center text-white text-sm shadow-md">
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="w-6 h-6 flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="mx-2 font-medium">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === selectedImages.length - 1}
                    className="w-6 h-6 flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="w-full md:w-80 border-l">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("filters")}
                className={`flex-1 py-4 px-4 font-medium ${
                  activeTab === "filters"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setActiveTab("adjustments")}
                className={`flex-1 py-4 px-4 font-medium ${
                  activeTab === "adjustments"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800"
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
                <div className="space-y-4">
                  {[
                    {
                      label: "Brightness",
                      value: brightness,
                      setter: setBrightness,
                    },
                    { 
                      label: "Contrast", 
                      value: contrast, 
                      setter: setContrast,
                    },
                    { 
                      label: "Fade", 
                      value: fade, 
                      setter: setFade,
                    },
                    {
                      label: "Saturation",
                      value: saturation,
                      setter: setSaturation,
                    },
                    {
                      label: "Temperature",
                      value: temperature,
                      setter: setTemperature,
                    },
                  ].map(({ label, value, setter }) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        {label}: {value}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  ))}
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

        canvas.width = 80;
        canvas.height = 80;
        
        // Apply the filter
        ctx.filter = filter.filter;
        ctx.drawImage(img, 0, 0, 80, 80);
        
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
          className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100"
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
        className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
          selectedFilter === filter.name
            ? "border-orange-500 ring-2 ring-orange-200 scale-105"
            : "border-gray-200 hover:scale-105"
        }`}
      >
        {/* Show preview if available, otherwise show original with CSS filter */}
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
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          </div>
        )}
      </button>
      <p className="text-xs text-gray-600 mt-1">{filter.name}</p>
    </div>
  );
};

export default EditScreen;