import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./croptils";
import { ChevronLeft, X } from "lucide-react";

const CropScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  setSelectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  cropRatio,
  setCropRatio,
  fileInputRef,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels || !selectedImages[currentImageIndex]) return;

    try {
      const croppedBlob = await getCroppedImg(
        selectedImages[currentImageIndex].url,
        croppedAreaPixels
      );
      
      // Create new URL for cropped image
      const croppedUrl = URL.createObjectURL(croppedBlob);
      const croppedFile = new File(
        [croppedBlob],
        selectedImages[currentImageIndex].file.name,
        { type: selectedImages[currentImageIndex].file.type }
      );

      const updated = [...selectedImages];
      // Revoke old URL if it's a blob URL
      if (updated[currentImageIndex].url.startsWith('blob:')) {
        URL.revokeObjectURL(updated[currentImageIndex].url);
      }
      
      updated[currentImageIndex] = {
        ...updated[currentImageIndex],
        file: croppedFile,
        url: croppedUrl,
        croppedUrl: croppedUrl, // Store separately for edits
      };
      setSelectedImages(updated);
      handleNext();
    } catch (err) {
      console.error("Crop failed:", err);
      alert("Failed to crop image");
    }
  };

  const handleRemove = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    // Revoke URL of removed image
    if (selectedImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImages[index].url);
    }
    setSelectedImages(newImages);
    if (currentImageIndex >= newImages.length && newImages.length > 0) {
      setCurrentImageIndex(newImages.length - 1);
    }
  };

  const aspectRatios = {
    original: undefined,
    "1:1": 1,
    "4:5": 4 / 5,
    "16:9": 16 / 9,
    full: 16 / 9,
  };

  const ratioLabels = {
    original: "Original",
    "1:1": "1:1",
    "4:5": "4:5",
    "16:9": "16:9",
    full: "Full Screen",
  };

  const currentImage = selectedImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <button onClick={handleBack} className="p-2 bg-white rounded-full shadow">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">Crop</h2>
        <button
          onClick={handleCropSave}
          disabled={!currentImage}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-full"
        >
          Save
        </button>
      </div>

      <div className="relative w-full max-w-4xl h-96 bg-black rounded-lg overflow-hidden">
        {currentImage && (
          <Cropper
            image={currentImage.url}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatios[cropRatio]}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={false}
          />
        )}
      </div>

      {/* Aspect Ratio Buttons */}
      <div className="flex items-center justify-center w-full max-w-4xl mt-4 space-x-2 overflow-x-auto pb-2">
        {Object.keys(aspectRatios).map((key) => (
          <button
            key={key}
            onClick={() => setCropRatio(key)}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
              cropRatio === key
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {ratioLabels[key]}
          </button>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
        {selectedImages.map((img, idx) => (
          <div key={img.id} className="relative">
            <img
              src={img.url}
              alt=""
              className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border-2 ${
                idx === currentImageIndex ? "border-orange-500" : "border-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(idx)}
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-md border-2 border-dashed border-gray-400 text-gray-500 text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CropScreen;