import React from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';

const CropScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  cropRatio,
  setCropRatio,
  handleAddMoreImages,
  handleImageRemove,
  fileInputRef,
  handleFileSelect
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Crop</h2>
          <button 
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium"
          >
            Next
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 bg-gray-50 flex items-center justify-center relative" style={{ minHeight: '400px' }}>
          {/* Crop Ratio Selector */}
          <div className="absolute left-6 top-6 bg-gray-700 bg-opacity-90 rounded-lg p-3 space-y-3 z-10">
            {[
              { label: 'Original', value: 'original', icon: '↗' },
              { label: '1:1', value: '1:1', icon: '⬜' },
              { label: '4:5', value: '4:5', icon: '▬' },
              { label: '16:9', value: '16:9', icon: '▭' }
            ].map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setCropRatio(ratio.value)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm w-full ${
                  cropRatio === ratio.value 
                    ? 'bg-white text-gray-900' 
                    : 'text-white hover:bg-gray-600'
                }`}
              >
                <div className="w-4 h-4 border border-current flex items-center justify-center text-xs">
                  {ratio.icon}
                </div>
                <span>{ratio.label}</span>
              </button>
            ))}
          </div>

          {/* Image Display */}
          <div className="flex flex-col items-center">
            {/* Main Image */}
            <div className="relative mb-4">
              {selectedImages.length > 0 && (
                <img 
                  src={selectedImages[currentImageIndex]?.url} 
                  alt="Crop preview" 
                  className="max-w-sm max-h-80 object-cover rounded-lg shadow-lg"
                  style={{ aspectRatio: cropRatio === '1:1' ? '1/1' : cropRatio === '4:5' ? '4/5' : cropRatio === '16:9' ? '16/9' : 'auto' }}
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
              
              {/* Selection overlay */}
              <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 rounded-lg p-1 flex items-center space-x-1">
                <button 
                  onClick={() => handleAddMoreImages()}
                  className="w-6 h-6 bg-white rounded flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleImageRemove(currentImageIndex)}
                  className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tools */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropScreen;