import React, { useState, useRef } from "react";
import axios from "axios";
import SelectScreen from "./SelectScreen";
import CropScreen from "./CropScreen";
import EditScreen from "./EditScreen";
import PostScreen from "./PostScreen";

const CreatePost = () => {
  const [currentStep, setCurrentStep] = useState("select"); // select, crop, edit, post
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hideEngagement, setHideEngagement] = useState(false);
  const [commentsOff, setCommentsOff] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [cropRatio, setCropRatio] = useState("original");
  const [activeTab, setActiveTab] = useState("adjustments"); // filters, adjustments
  const [location, setLocation] = useState("");

  // Image adjustments
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [fade, setFade] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [temperature, setTemperature] = useState(50);

  const fileInputRef = useRef(null);

  const currentUserId = JSON.parse(sessionStorage.getItem("userData"));
  const userId = currentUserId?.userId;

  const filters = [
    { name: "Aden", filter: "sepia(0.2) brightness(1.15) saturate(1.4)" },
    { name: "Clarendon", filter: "contrast(1.2) saturate(1.35)" },
    { name: "Crema", filter: "sepia(0.5) contrast(1.25) brightness(1.15)" },
    { name: "B&W", filter: "grayscale(1)" },
    { name: "Cerma", filter: "sepia(0.3) contrast(1.1)" },
    { name: "Normal", filter: "none" },
    { name: "Vintage", filter: "sepia(0.4) contrast(1.1) brightness(1.1)" },
    { name: "Cool", filter: "brightness(1.1) hue-rotate(10deg) saturate(1.3)" },
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedImages((prev) => [...prev, ...images]);
    setCurrentStep("crop");
  };

  const handleNext = () => {
    switch (currentStep) {
      case "select":
        if (selectedImages.length > 0) setCurrentStep("crop");
        break;
      case "crop":
        setCurrentStep("edit");
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
        setCurrentStep("edit");
        break;
    }
  };

  // Apply filters/adjustments to an image file using canvas
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
          if (!blob) return reject("Canvas conversion failed");
          const file = new File([blob], imageFile.name, { type: imageFile.type });
          resolve(file);
        }, imageFile.type);
      };

      img.onerror = (err) => reject(err);
    });
  };

  const handlePostSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("description", postText);

      const filteredImages = await Promise.all(
        selectedImages.map((img) =>
          applyFilterToImage(img.file, getCurrentImageFilter())
        )
      );

      filteredImages.forEach((file) => formData.append("media", file));

      const res = await axios.post(
        "https://social-media-nty4.onrender.com/api/posts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Post created successfully ✅");
        setPostText("");
        setSelectedImages([]);
        setCurrentStep("select");
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
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    if (!newImages.length) setCurrentStep("select");
    else if (currentImageIndex >= newImages.length)
      setCurrentImageIndex(newImages.length - 1);
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
