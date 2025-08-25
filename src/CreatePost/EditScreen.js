import React from 'react';
import { ChevronLeft } from 'lucide-react';

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
  cropRatio
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
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
          {/* Left Side - Image Preview */}
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="relative">
              {selectedImages.length > 0 && (
                <img 
                  src={selectedImages[currentImageIndex]?.url} 
                  alt="Edit preview" 
                  className="max-w-sm max-h-80 object-cover rounded-lg shadow-lg"
                  style={{ 
                    filter: getCurrentImageFilter(),
                    aspectRatio: cropRatio === '1:1' ? '1/1' : cropRatio === '4:5' ? '4/5' : cropRatio === '16:9' ? '16/9' : 'auto'
                  }}
                />
              )}
              
              {/* Image navigation if multiple images */}
              {selectedImages.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-1 flex">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                    className="w-6 h-6 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-white text-sm mx-1">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => Math.min(selectedImages.length - 1, prev + 1))}
                    className="w-6 h-6 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4 transform rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="w-full md:w-80 border-l">
            {/* Tab Headers */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 py-4 px-6 font-medium ${
                  activeTab === 'filters' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setActiveTab('adjustments')}
                className={`flex-1 py-4 px-6 font-medium ${
                  activeTab === 'adjustments' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Adjustments
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'filters' ? (
                <div className="grid grid-cols-3 gap-4">
                  {filters.map((filter, index) => (
                    <div key={index} className="text-center">
                      <button
                        onClick={() => setSelectedFilter(filter.name)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedFilter === filter.name ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={filter.image} 
                          alt={filter.name}
                          className="w-full h-full object-cover"
                          style={{ filter: filter.filter }}
                        />
                      </button>
                      <p className="text-xs text-gray-600 mt-2 font-medium">{filter.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Brightness */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Brightness: {brightness}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Contrast: {contrast}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Fade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Fade: {fade}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fade}
                      onChange={(e) => setFade(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Saturation: {saturation}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Temperature: {temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={temperature}
                      onChange={(e) => setTemperature(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
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