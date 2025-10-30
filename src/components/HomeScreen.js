// HomeScreen.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Download from "./HomeScreen/Download";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "./HomeScreen/WelcomeModal";
import ImageGrid from "./HomeScreen/ImageGrid";
import ImageDetail from "./HomeScreen/ImageDetail";
import Galleria from "./HomeScreen/Galleria";

const HomeScreen = () => {
  const [showModal, setShowModal] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showGalleria, setShowGalleria] = useState(false);
  const [galleriaIndex, setGalleriaIndex] = useState(0);
  const [downloadModal, setDownloadModal] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = userData?.userId;

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://social-media-nty4.onrender.com/api/posts");
        if (res.data.success) {
          let allPosts = res.data.data.map((post) => ({
            ...post,
            saves: post.saves || [],
            likes: post.likes || [],
            comments: post.comments || [],
            media: post.media || [],
          }));

          // ✅ Show only posts from other users (exclude current user)
          if (currentUserId) {
            allPosts = allPosts.filter(
              (post) => post.userId?._id !== currentUserId && post.userId !== currentUserId
            );
          }

          setPosts(allPosts);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, [currentUserId]);

  // Keyboard navigation for Galleria
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showGalleria) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigatePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateNext();
          break;
        case "Escape":
          e.preventDefault();
          setShowGalleria(false);
          break;
      }
    };

    if (showGalleria) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showGalleria]);

  // PWA + welcome modal
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (localStorage.getItem("skipWelcome") === "true") setShowModal(false);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const navigateNext = () => setGalleriaIndex((prev) => (prev + 1) % posts.length);
  const navigatePrevious = () => setGalleriaIndex((prev) => (prev - 1 + posts.length) % posts.length);

  const openGalleria = () => {
    if (selectedImage) {
      const index = posts.findIndex((img) => img._id === selectedImage._id);
      if (index >= 0) {
        setGalleriaIndex(index);
        setShowGalleria(true);
      }
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    if (window.innerWidth < 768) setShowMobileDetail(true);
  };

  const handleBackToGallery = () => {
    setSelectedImage(null);
    setShowMobileDetail(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("skipWelcome", "true");
  };

  const handleDownload = () => {
    setShowGalleria(false);
    setDownloadModal(true);
  };

  const handleCloseDownload = () => setDownloadModal(false);

  const handleInstallClick = () => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      alert("This app is already installed!");
    } else if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") handleCloseModal();
        window.deferredPrompt = null;
      });
    } else {
      alert('To install:\n1. Open browser menu\n2. Tap "Add to Home Screen"');
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-3 p-md-4 bg-light">
      <WelcomeModal show={showModal} onClose={handleCloseModal} onInstall={handleInstallClick} />

      <Galleria
        show={showGalleria}
        onClose={() => setShowGalleria(false)}
        images={posts}
        currentIndex={galleriaIndex}
        onNext={navigateNext}
        onPrevious={navigatePrevious}
        onThumbnailClick={setGalleriaIndex}
        onDownload={handleDownload}
      />

      <div className="row g-4">
        <div className={selectedImage && window.innerWidth >= 768 ? "col-lg-8" : "col-12"}>
          <div className="overflow-auto hide-scrollbar" style={{ maxHeight: "calc(100vh)" }}>
            <ImageGrid
              images={posts}
              onImageClick={handleImageClick}
              selectedImage={selectedImage}
              image={selectedImage}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {selectedImage && window.innerWidth >= 768 && (
          <div className="col-lg-4">
            <ImageDetail
              image={selectedImage}
              onBack={handleBackToGallery}
              onOpenGalleria={openGalleria}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>

      {/* Mobile Fullscreen Modal */}
      {showMobileDetail && selectedImage && (
        <div className="mobile-detail-overlay">
          <ImageDetail
            image={selectedImage}
            onBack={handleBackToGallery}
            onOpenGalleria={openGalleria}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {downloadModal && (
        <Download show={downloadModal} onClose={handleCloseDownload} image={selectedImage} />
      )}

      <style jsx>{`
        .mobile-detail-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: white;
          z-index: 1050;
          overflow-y: auto;
        }
        @media (min-width: 768px) {
          .mobile-detail-overlay {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
