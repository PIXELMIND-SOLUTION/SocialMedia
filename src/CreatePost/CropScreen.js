import React, { useState, useCallback, useEffect } from "react";
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
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Load image natural size when image changes
  useEffect(() => {
    if (selectedImages[currentImageIndex]) {
      const img = new Image();
      img.onload = () => {
        setImageNaturalSize({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = selectedImages[currentImageIndex].url;
    }
  }, [selectedImages, currentImageIndex]);

  const handleCropSave = async () => {
    if (!croppedAreaPixels || !selectedImages[currentImageIndex]) return;

    try {
      let croppedBlob;

      if (cropRatio === "original") {
        // For original ratio, we need to ensure we crop at the original aspect
        const currentImage = selectedImages[currentImageIndex];
        const originalAspect = imageNaturalSize.width / imageNaturalSize.height;

        // Calculate crop area that maintains original aspect
        const cropWidth = croppedAreaPixels.width;
        const cropHeight = croppedAreaPixels.height;
        const cropAspect = cropWidth / cropHeight;

        let finalCropArea = { ...croppedAreaPixels };

        // Adjust crop area to maintain original aspect if needed
        if (Math.abs(cropAspect - originalAspect) > 0.01) {
          // The user cropped with a different aspect, we need to constrain it
          if (cropAspect > originalAspect) {
            // Crop is wider than original, adjust height
            finalCropArea.height = cropWidth / originalAspect;
            if (finalCropArea.y + finalCropArea.height > imageNaturalSize.height) {
              finalCropArea.y = imageNaturalSize.height - finalCropArea.height;
            }
          } else {
            // Crop is taller than original, adjust width
            finalCropArea.width = cropHeight * originalAspect;
            if (finalCropArea.x + finalCropArea.width > imageNaturalSize.width) {
              finalCropArea.x = imageNaturalSize.width - finalCropArea.width;
            }
          }
        }

        croppedBlob = await getCroppedImg(
          currentImage.url,
          finalCropArea
        );
      } else {
        croppedBlob = await getCroppedImg(
          selectedImages[currentImageIndex].url,
          croppedAreaPixels
        );
      }

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
        croppedUrl: croppedUrl,
        cropRatio: cropRatio,
        originalAspect: imageNaturalSize.width / imageNaturalSize.height
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

  const getAspectRatioValue = (ratioKey) => {
    if (ratioKey === "original") {
      // For original, we need to calculate from the image's natural size
      if (imageNaturalSize.width > 0 && imageNaturalSize.height > 0) {
        return imageNaturalSize.width / imageNaturalSize.height;
      }
      return undefined;
    }

    switch (ratioKey) {
      case "1:1":
        return 1;
      case "3:4":
        return 3 / 4;
      case "4:3":
        return 4 / 3;
      case "4:5":
        return 4 / 5;
      case "5:4":
        return 5 / 4;
      case "9:16":
        return 9 / 16;
      case "16:9":
        return 16 / 9;
      default:
        return undefined;
    }
  };

  const aspectRatios = [
    { key: "original", label: `Original ${imageNaturalSize.width > 0 ? `(${imageNaturalSize.width}x${imageNaturalSize.height})` : ''}` },
    { key: "1:1", label: "1:1" },
    { key: "3:4", label: "3:4" },
    { key: "4:3", label: "4:3" },
    { key: "4:5", label: "4:5" },
    { key: "5:4", label: "5:4" },
    { key: "9:16", label: "9:16" },
    { key: "16:9", label: "16:9" },
  ];

  const currentImage = selectedImages[currentImageIndex];

  // Reset crop position when changing images
  useEffect(() => {
    if (currentImage) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      // If image has saved crop ratio, use it
      if (currentImage.cropRatio) {
        setCropRatio(currentImage.cropRatio);
      }
    }
  }, [currentImageIndex, currentImage]);

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
            aspect={getAspectRatioValue(cropRatio)}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={true}
            objectFit="contain"
            minZoom={0.5}
            maxZoom={3}
            restrictPosition={true}
            initialCroppedAreaPixels={
              cropRatio === "original" && currentImage.originalAspect
                ? null // Let it calculate based on original aspect
                : undefined
            }
          />
        )}
      </div>

      {/* Aspect Ratio Buttons */}
      <div
        className="
    w-full 
    flex flex-wrap md:flex-nowrap 
    items-center justify-start md:justify-center 
    gap-2 
    mt-4 
    overflow-x-auto 
    pb-2 
    px-2
  "
      >
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.key}
            onClick={() => {
              setCropRatio(ratio.key);
              setCrop({ x: 0, y: 0 });
              setZoom(1);
            }}
            className={`
        px-3 py-1.5 
        text-xs sm:text-sm 
        rounded-lg 
        whitespace-nowrap 
        flex-shrink-0 
        ${cropRatio === ratio.key
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 shadow-sm"
              }
      `}
            title={
              ratio.key === "original"
                ? `Natural size: ${imageNaturalSize.width}x${imageNaturalSize.height}`
                : ""
            }
          >
            {ratio.key === "original" && imageNaturalSize.width > 0
              ? `Original (${Math.round(imageNaturalSize.width)}x${Math.round(imageNaturalSize.height)})`
              : ratio.label}
          </button>
        ))}
      </div>


      {/* Zoom Slider */}
      <div className="w-full max-w-4xl mt-4 px-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Zoom</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
        {selectedImages.map((img, idx) => (
          <div key={img.id} className="relative">
            <img
              src={img.url}
              alt=""
              className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border-2 ${idx === currentImageIndex ? "border-orange-500" : "border-gray-300"
                }`}
              onClick={() => {
                setCurrentImageIndex(idx);
                // Use saved crop ratio or default to original
                setCropRatio(img.cropRatio || "original");
              }}
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-3 h-3" />
            </button>
            {img.cropRatio && img.cropRatio !== "original" && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-0.5">
                {img.cropRatio}
              </div>
            )}
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