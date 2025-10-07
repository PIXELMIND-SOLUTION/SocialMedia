import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./croptils"; // helper to get cropped blob
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
  handleAddMoreImages,
  handleImageRemove,
  fileInputRef,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(
        selectedImages[currentImageIndex].url,
        croppedAreaPixels
      );
      const croppedFile = new File(
        [croppedBlob],
        selectedImages[currentImageIndex].file.name,
        { type: selectedImages[currentImageIndex].file.type }
      );

      const updatedImages = [...selectedImages];
      updatedImages[currentImageIndex] = {
        ...updatedImages[currentImageIndex],
        file: croppedFile,
        url: URL.createObjectURL(croppedBlob),
      };
      setSelectedImages(updatedImages);

      handleNext(); // Move to next step (edit)
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImageLocal = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (currentImageIndex >= newImages.length) setCurrentImageIndex(newImages.length - 1);
  };

  const aspectRatios = {
    original: undefined,
    "1:1": 1 / 1,
    "4:5": 4 / 5,
    "16:9": 16 / 9,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <button onClick={handleBack} className="p-2 bg-white rounded-full shadow">
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-semibold text-center flex-1">Crop</h2>
        <button
          onClick={handleCropSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
        >
          Save
        </button>
      </div>

      {/* Cropper */}
      <div className="relative w-full max-w-4xl h-96 bg-black rounded-lg overflow-hidden">
        {selectedImages && selectedImages[currentImageIndex] && (
          <Cropper
            image={selectedImages[currentImageIndex].url}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatios[cropRatio]}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-4xl mt-4 space-x-2 overflow-x-auto">
        {/* Crop Ratios */}
        {Object.keys(aspectRatios).map((ratio) => (
          <button
            key={ratio}
            onClick={() => setCropRatio(ratio)}
            className={`px-3 py-1 rounded-md ${
              cropRatio === ratio ? "bg-orange-500 text-white" : "bg-white"
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* Thumbnail Bar */}
      <div className="flex mt-4 space-x-2 overflow-x-auto">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover rounded-md border-2 ${
                index === currentImageIndex ? "border-orange-500" : "border-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
            <button
              onClick={() => handleRemoveImageLocal(index)}
              className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 flex items-center justify-center bg-white rounded-md border-2 border-dashed border-gray-400"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CropScreen;
