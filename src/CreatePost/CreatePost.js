import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import SelectScreen from "./SelectScreen";
import CropScreen from "./CropScreen";
import EditScreen from "./EditScreen";
import PostScreen from "./PostScreen";

const CreatePost = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState("select"); // select, crop, edit, post
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // now holds mixed media
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hideEngagement, setHideEngagement] = useState(false);
  const [commentsOff, setCommentsOff] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [cropRatio, setCropRatio] = useState("original");
  const [activeTab, setActiveTab] = useState("adjustments"); // filters, adjustments
  const [location, setLocation] = useState("");

  // Image adjustments (only for images)
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [fade, setFade] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [temperature, setTemperature] = useState(50);

  const fileInputRef = React.useRef(null);

  const currentUserId = JSON.parse(sessionStorage.getItem("userData"));
  const userId = currentUserId?.userId;

  const filters = [
    { name: "Aden", filter: "sepia(0.2) brightness(1.15) saturate(1.4)", image: "/assets/images/filter.png"},
    { name: "Clarendon", filter: "contrast(1.2) saturate(1.35)", image: "/assets/images/filter.png" },
    { name: "Crema", filter: "sepia(0.5) contrast(1.25) brightness(1.15)", image: "/assets/images/filter.png" },
    { name: "B&W", filter: "grayscale(1)", image: "/assets/images/filter.png" },
    { name: "Cerma", filter: "sepia(0.3) contrast(1.1)", image: "/assets/images/filter.png" },
    { name: "Normal", filter: "none", image: "/assets/images/filter.png" },
    { name: "Vintage", filter: "sepia(0.4) contrast(1.1) brightness(1.1)", image: "/assets/images/filter.png" },
    { name: "Cool", filter: "brightness(1.1) hue-rotate(10deg) saturate(1.3)", image: "/assets/images/filter.png" },
  ];

  // Cleanup object URLs on unmount or when media changes
  useEffect(() => {
    return () => {
      selectedImages.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
    };
  }, [selectedImages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const mediaFiles = files.map((file) => {
      const isVideo = file.type.startsWith("video/");
      return {
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        type: isVideo ? "video" : "image",
      };
    });

    setSelectedImages((prev) => [...prev, ...mediaFiles]);
    setCurrentImageIndex(0);
  };

  const handleNext = () => {
    switch (currentStep) {
      case "select":
        if (selectedImages.length > 0) {
          const hasVideo = selectedImages.some((item) => item.type === "video");
          setCurrentStep(hasVideo ? "post" : "crop");
        }
        break;
      case "crop":
        const hasVideoAfterCrop = selectedImages.some((item) => item.type === "video");
        setCurrentStep(hasVideoAfterCrop ? "post" : "edit");
        break;
      case "edit":
        setCurrentStep("post");
        break;
      case "post":
        handlePostSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "crop":
        setCurrentStep("select");
        break;
      case "edit":
        setCurrentStep("crop");
        break;
      case "post":
        // Go back to edit if all images, else to select
        const hasVideo = selectedImages.some((item) => item.type === "video");
        if (hasVideo) {
          setCurrentStep("select");
        } else {
          setCurrentStep("edit");
        }
        break;
    }
  };

  const applyFilterToImage = (imageFile, filter) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        ctx.filter = filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(img.src);
          if (!blob) return reject("Canvas conversion failed");
          const file = new File([blob], imageFile.name, { type: imageFile.type });
          resolve(file);
        }, imageFile.type);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(img.src);
        reject(err);
      };
    });
  };

  const handlePostSubmit = async () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("description", postText);
      if (location) formData.append("location", location);
      if (hideEngagement) formData.append("hideLikes", "true");
      if (commentsOff) formData.append("disableComments", "true");

      // Process media: apply filters only to images
      const processedFiles = await Promise.all(
        selectedImages.map(async (item) => {
          if (item.type === "video") {
            return item.file;
          } else {
            return await applyFilterToImage(item.file, getCurrentImageFilter());
          }
        })
      );

      processedFiles.forEach((file) => formData.append("media", file));

      const res = await axios.post(
        "https://social-media-nty4.onrender.com/api/posts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Post created successfully ✅");
        // Reset state
        setPostText("");
        setSelectedImages([]);
        setCurrentStep("select");
        navigate("/home");
      } else {
        alert("Failed to create post ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating post ❌");
    }
  };

  const handleImageRemove = (index) => {
    const newImages = [...selectedImages];
    const removed = newImages.splice(index, 1)[0];
    if (removed.url) URL.revokeObjectURL(removed.url);

    setSelectedImages(newImages);

    if (!newImages.length) {
      setCurrentStep("select");
    } else if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
  };

  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  const getCurrentImageFilter = () => {
    if (activeTab === "filters" && selectedFilter) {
      const filterObj = filters.find((f) => f.name === selectedFilter);
      return filterObj ? filterObj.filter : "none";
    }
    if (activeTab === "adjustments") {
      return `
        brightness(${brightness / 50})
        contrast(${contrast / 50})
        saturate(${saturation / 50})
        sepia(${(100 - fade) / 100})
        hue-rotate(${(temperature - 50) * 3.6}deg)
      `;
    }
    return "none";
  };

  // Auto-advance from select if files are added
  React.useEffect(() => {
    if (selectedImages.length > 0 && currentStep === "select") {
      const hasVideo = selectedImages.some((item) => item.type === "video");
      setCurrentStep(hasVideo ? "post" : "crop");
    }
  }, [selectedImages, currentStep]);

  return (
    <div>
      {currentStep === "select" && (
        <SelectScreen
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
        />
      )}

      {currentStep === "crop" && (
        <CropScreen
          handleBack={handleBack}
          handleNext={handleNext}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          cropRatio={cropRatio}
          setCropRatio={setCropRatio}
          handleAddMoreImages={handleAddMoreImages}
          handleImageRemove={handleImageRemove}
          fileInputRef={fileInputRef}
        />
      )}

      {currentStep === "edit" && (
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

      {currentStep === "post" && (
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