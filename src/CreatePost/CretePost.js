import React, { useState, useRef } from 'react';
import { ChevronLeft, MapPin, Smile, X, Plus, MoreHorizontal } from 'lucide-react';

const CreatePost = () => {
  const [currentStep, setCurrentStep] = useState('select'); // select, crop, edit, post
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hideEngagement, setHideEngagement] = useState(false);
  const [commentsOff, setCommentsOff] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [cropRatio, setCropRatio] = useState('original');
  const [activeTab, setActiveTab] = useState('adjustments'); // filters, adjustments
  const [location, setLocation] = useState('');
  
  // Image adjustments
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [fade, setFade] = useState(0);
  const [saturation, setSaturation] = useState(50);
  const [temperature, setTemperature] = useState(50);
  
  const fileInputRef = useRef(null);

  const balloonImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&sat=-100',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&sat=-100',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop'
  ];

  const filters = [
    { name: 'Aden', image: balloonImages[0], filter: 'sepia(0.2) brightness(1.15) saturate(1.4)' },
    { name: 'Clarendon', image: balloonImages[1], filter: 'contrast(1.2) saturate(1.35)' },
    { name: 'Crema', image: balloonImages[2], filter: 'sepia(0.5) contrast(1.25) brightness(1.15)' },
    { name: 'B&W', image: balloonImages[3], filter: 'grayscale(1)' },
    { name: 'Clarendon', image: balloonImages[4], filter: 'contrast(1.2) saturate(1.35)' },
    { name: 'Cerma', image: balloonImages[5], filter: 'sepia(0.3) contrast(1.1)' },
    { name: 'Normal', image: balloonImages[6], filter: 'none' },
    { name: 'Vintage', image: balloonImages[7], filter: 'sepia(0.4) contrast(1.1) brightness(1.1)' },
    { name: 'Cool', image: balloonImages[8], filter: 'brightness(1.1) hue-rotate(10deg) saturate(1.3)' }
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imageUrls = files.map(file => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => resolve({
            url: e.target.result,
            name: file.name,
            type: file.type
          });
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(imageUrls).then(images => {
        setSelectedImages(images);
        setCurrentStep('crop');
      });
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'select':
        if (selectedImages.length > 0) setCurrentStep('crop');
        break;
      case 'crop':
        setCurrentStep('edit');
        break;
      case 'edit':
        setCurrentStep('post');
        break;
      case 'post':
        // Handle final post submission
        handlePostSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'crop':
        setCurrentStep('select');
        break;
      case 'edit':
        setCurrentStep('crop');
        break;
      case 'post':
        setCurrentStep('edit');
        break;
    }
  };

  const handlePostSubmit = () => {
    // Create post object with all data
    const postData = {
      images: selectedImages,
      caption: postText,
      location: location,
      settings: {
        hideEngagement: hideEngagement,
        commentsOff: commentsOff
      },
      edits: {
        filter: selectedFilter,
        brightness: brightness,
        contrast: contrast,
        fade: fade,
        saturation: saturation,
        temperature: temperature,
        cropRatio: cropRatio
      }
    };
    
    console.log('Posting data:', postData);
    alert('Post created successfully!');
    // In a real app, you would send this data to your backend API
  };

  const handleImageRemove = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    
    if (newImages.length === 0) {
      setCurrentStep('select');
    } else if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
  };

  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  const getCurrentImageFilter = () => {
    if (activeTab === 'filters' && selectedFilter) {
      const filterObj = filters.find(f => f.name === selectedFilter);
      return filterObj ? filterObj.filter : 'none';
    }
    
    if (activeTab === 'adjustments') {
      return `
        brightness(${brightness / 50}) 
        contrast(${contrast / 50}) 
        saturate(${saturation / 50}) 
        sepia(${(100 - fade) / 100}) 
        hue-rotate(${(temperature - 50) * 3.6}deg)
      `;
    }
    
    return 'none';
  };

  // Screen 1: Select from Computer
  const SelectScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-12">Create New Post</h2>
        
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main image icon */}
            <div className="w-20 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
              <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Video icon */}
            <div className="absolute -bottom-2 -right-2 w-12 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white">
              <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">Drag Photos and videos</p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Select from computer
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );

  // Screen 2: Crop
  const CropScreen = () => (
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

  // Screen 3: Filters and Adjustments
  const EditScreen = () => (
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

  // Screen 4: Final Post Screen
  const PostScreen = () => (
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

          {/* Image Display */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {selectedImages.length > 0 && (
                <img 
                  src={selectedImages[currentImageIndex]?.url} 
                  alt="Post preview" 
                  className="max-w-xs max-h-64 object-cover rounded-lg shadow-lg"
                  style={{ 
                    filter: getCurrentImageFilter(),
                    aspectRatio: cropRatio === '1:1' ? '1/1' : cropRatio === '4:5' ? '4/5' : cropRatio === '16:9' ? '16/9' : 'auto'
                  }}
                />
              )}
              
              {/* Image navigation if multiple images */}
              {selectedImages.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 flex">
                  <span className="text-white text-sm px-2">
                    {currentImageIndex + 1}/{selectedImages.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write a caption..."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              rows="4"
            />
            <div className="flex justify-between items-center mt-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-400">{postText.length}/2000</span>
            </div>
          </div>

          {/* Add Location */}
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="w-5 h-5 mr-2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              className="border-none outline-none flex-1"
            />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900 mb-1">Hide like and view counts</h3>
                <p className="text-sm text-gray-500">Only you will see the total number of likes and views on this post</p>
              </div>
              <button
                onClick={() => setHideEngagement(!hideEngagement)}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${hideEngagement ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${hideEngagement ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900 mb-1">Turn off commenting</h3>
                <p className="text-sm text-gray-500">No one can comment on this post</p>
              </div>
              <button
                onClick={() => setCommentsOff(!commentsOff)}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${commentsOff ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${commentsOff ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current screen
  return (
    <div>
      {currentStep === 'select' && <SelectScreen />}
      {currentStep === 'crop' && <CropScreen />}
      {currentStep === 'edit' && <EditScreen />}
      {currentStep === 'post' && <PostScreen />}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CreatePost;