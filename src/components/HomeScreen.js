import React, { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import images from "../components/mockData";
import Download from "./HomeScreen/Download";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "./HomeScreen/WelcomeModal";
import ImageGrid from "./HomeScreen/ImageGrid";
import ImageDetail from "./HomeScreen/ImageDetail";
import Galleria from "./HomeScreen/Galleria";

const HomeScreen = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showGalleria, setShowGalleria] = useState(false);
  const [galleriaIndex, setGalleriaIndex] = useState(0);
  const [downloadModal, setDownloadModal] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard navigation for Galleria
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showGalleria) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigatePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateNext();
          break;
        case 'Escape':
          e.preventDefault();
          setShowGalleria(false);
          break;
      }
    };

    if (showGalleria) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showGalleria, galleriaIndex]);

  // PWA installation prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    });

    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('skipWelcome');
    if (hasSeenWelcome === 'true') {
      setShowModal(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = null;
      });
    };
  }, []);

  // Galleria navigation functions
  const navigateNext = () => {
    setGalleriaIndex((prev) => (prev + 1) % images.length);
  };

  const navigatePrevious = () => {
    setGalleriaIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openGalleria = () => {
    if (selectedImage) {
      const index = images.findIndex(img => img.id === selectedImage.id);
      setGalleriaIndex(index);
      setShowGalleria(true);
    }
  };

  // Image zoom and pan handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetImage = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Existing handlers
  const handleImageClick = (image) => {
    setSelectedImage(image);
    resetImage();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('skipWelcome', 'true');
  };

  const handleBackToGallery = () => setSelectedImage(null);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const updatedImage = {
        ...selectedImage,
        comments: [
          ...selectedImage.comments,
          { user: "You", text: newComment }
        ]
      };
      setSelectedImage(updatedImage);
      setNewComment("");
    }
  };

  const handleDownload = () => {
    setShowGalleria(false);
    setDownloadModal(true);
  };

  const handleCloseDownload = () => {
    setDownloadModal(false);
  };

  const handleInstallClick = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('This app is already installed on your device!');
    } else if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          handleCloseModal();
        } else {
          console.log('User dismissed the install prompt');
        }
        window.deferredPrompt = null;
      });
    } else {
      alert('To install this app: \n1. Open browser menu \n2. Tap "Add to Home Screen"');
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-4 bg-main">
      <WelcomeModal
        show={showModal}
        onClose={handleCloseModal}
        onInstall={handleInstallClick}
      />


      <Galleria
        show={showGalleria}
        onClose={() => setShowGalleria(false)}
        images={images}
        currentIndex={galleriaIndex}
        onNext={navigateNext}
        onPrevious={navigatePrevious}
        onThumbnailClick={setGalleriaIndex}
        onDownload={handleDownload}
      />

      <div className="row">
        <ImageGrid
          images={images}
          onImageClick={handleImageClick}
          selectedImage={selectedImage}
        />

        {selectedImage && (
          <ImageDetail
            image={selectedImage}
            onBack={handleBackToGallery}
            onOpenGalleria={openGalleria}
            onCommentSubmit={handleCommentSubmit}
            newComment={newComment}
            setNewComment={setNewComment}
          />
        )}
      </div>
    </div>
  );
};

export default HomeScreen;