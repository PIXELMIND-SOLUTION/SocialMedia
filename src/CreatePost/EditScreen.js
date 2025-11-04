import React from "react";
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
  const currentImage =
    selectedImages[currentImageIndex] || selectedImages[0] || null;
  const imageUrl = currentImage?.url || "/assets/images/placeholder.jpg";

  // Helper to get aspect ratio class for Tailwind
  const getAspectRatioClass = () => {
    switch (cropRatio) {
      case "1:1":
        return "aspect-square";
      case "4:5":
        return "aspect-[4/5]";
      case "16:9":
        return "aspect-video"; // Tailwind built-in 16:9
      case "full":
        return "w-full h-[80vh]"; // Full preview area
      default:
        return "";
    }
  };

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
                      key={imageUrl}
                      src={imageUrl}
                      controls
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      style={{ filter: getCurrentImageFilter() }}
                    />
                  ) : (
                    <img
                      key={imageUrl} // 👈 Forces re-render when URL changes
                      src={imageUrl}
                      alt="Edit preview"
                      className={`object-cover rounded-lg shadow-lg transition-all duration-300 ${
                        cropRatio === "full"
                          ? "w-full h-full"
                          : "w-full h-full"
                      }`}
                      style={{
                        filter: "",
                      }}
                    />
                  )
                ) : (
                  <span className="text-gray-500">No image</span>
                )}
              </div>

              {/* Navigation for multiple images */}
              {selectedImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center text-white text-sm shadow-md">
                  <button
                    onClick={() =>
                      setCurrentImageIndex((i) => Math.max(0, i - 1))
                    }
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="mx-2 font-medium">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((i) =>
                        Math.min(selectedImages.length - 1, i + 1)
                      )
                    }
                    className="w-6 h-6 flex items-center justify-center"
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
                    <div key={filter.name} className="text-center">
                      <button
                        onClick={() => setSelectedFilter(filter.name)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedFilter === filter.name
                            ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                            : "border-gray-200 hover:scale-105"
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={filter.name}
                          className="w-full h-full object-cover"
                          style={{ filter: filter.filter }}
                        />
                      </button>
                      <p className="text-xs text-gray-600 mt-1">
                        {filter.name}
                      </p>
                    </div>
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
                    { label: "Contrast", value: contrast, setter: setContrast },
                    { label: "Fade", value: fade, setter: setFade },
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

export default EditScreen;
