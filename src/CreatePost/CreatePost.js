import React, { useState, useRef } from 'react';
import SelectScreen from './SelectScreen';
import CropScreen from './CropScreen';
import EditScreen from './EditScreen';
import PostScreen from './PostScreen';

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

  // Render current screen
  return (
    <div>
      {currentStep === 'select' && (
        <SelectScreen 
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
        />
      )}
      
      {currentStep === 'crop' && (
        <CropScreen 
          handleBack={handleBack}
          handleNext={handleNext}
          selectedImages={selectedImages}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          cropRatio={cropRatio}
          setCropRatio={setCropRatio}
          handleAddMoreImages={handleAddMoreImages}
          handleImageRemove={handleImageRemove}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
        />
      )}
      
      {currentStep === 'edit' && (
        <EditScreen 
          handleBack={handleBack}
          handleNext={handleNext}
          selectedImages={selectedImages}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filters={filters}
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          fade={fade}
          setFade={setFade}
          saturation={saturation}
          setSaturation={setSaturation}
          temperature={temperature}
          setTemperature={setTemperature}
          getCurrentImageFilter={getCurrentImageFilter}
          cropRatio={cropRatio}
        />
      )}
      
      {currentStep === 'post' && (
        <PostScreen 
          handleBack={handleBack}
          handleNext={handleNext}
          selectedImages={selectedImages}
          currentImageIndex={currentImageIndex}
          postText={postText}
          setPostText={setPostText}
          location={location}
          setLocation={setLocation}
          hideEngagement={hideEngagement}
          setHideEngagement={setHideEngagement}
          commentsOff={commentsOff}
          setCommentsOff={setCommentsOff}
          getCurrentImageFilter={getCurrentImageFilter}
          cropRatio={cropRatio}
        />
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default CreatePost;