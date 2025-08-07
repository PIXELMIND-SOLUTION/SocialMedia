import React, { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import images from "./mockData";
import Download from "../functions/Download";


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
  const imageRef = useRef(null);

  const [downloadModal, setDownloadModal] = useState(false);

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

  const handleCloseModal = () => setShowModal(false);
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

  const createColumns = (numColumns = 5) => {
    const columns = Array(numColumns).fill().map(() => []);
    images.forEach((image, index) => {
      const columnIndex = index % numColumns;
      columns[columnIndex].push(image);
    });
    return columns;
  };

  const columns = createColumns();
  const currentGalleriaImage = images[galleriaIndex];

  const handleDownload = () =>{
    setShowGalleria(false)
    setDownloadModal(true);
  }

const  handleClose = ()=>{
  setDownloadModal(false);
}


  return (
    <div className="container-fluid min-vh-100 p-4 bg-main">
      {/* Welcome Modal */}
      {showModal && (
        <div className="modal show d-block glass-effect" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4" style={{ borderRadius: '15px' }}>
              <div className="modal-header border-0 p-0 justify-content-end">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="justify-content-center align-items-center">
                  <div>
                    <img
                      src="/assets/images/profile.png"
                      alt="Avatar"
                      className="rounded-circle mb-4"
                      style={{ width: '80px', height: '80px' }}
                    />
                  </div>
                  <div>
                    <button className="btn btn-warning text-white">
                      + Add To Home Screen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Galleria Fullscreen Modal */}
      {showGalleria && (
        <div className="galleria-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="galleria-content w-100 h-100 d-flex flex-column">
            {/* Header */}
            <div className="galleria-header d-flex justify-content-between align-items-center p-3 text-white">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-light text-dark p-2"
                  onClick={() => setShowGalleria(false)}
                  style={{ fontSize: '1.5rem' }}
                >
                  X
                </button>

              </div>
              <div className=" justify-content-center">
                <button className="btn badge text-bg-light p-2" onClick={handleDownload}>Download</button>
                <button className="btn badge text-bg-light p-2">Save</button>
              {/* <span className="badge bg-light text-dark">
                {galleriaIndex + 1} of {images.length}
              </span> */}
              </div>
            </div>

            {/* Main Image Area */}
            <div className="galleria-main flex-grow-1 d-flex align-items-center justify-content-center position-relative">
              Previous Button
              <button
                className="galleria-nav galleria-nav-prev position-absolute start-0 top-50 translate-middle-y btn btn-link text-white p-3"
                onClick={navigatePrevious}
                style={{ zIndex: 10, fontSize: '2rem' }}
              >
                ❮
              </button>

              {/* Image */}
              <div className="galleria-image-container d-flex align-items-center justify-content-center">
                <img
                  src={currentGalleriaImage.url}
                  alt={currentGalleriaImage.title}
                  className="galleria-image"
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                className="galleria-nav galleria-nav-next position-absolute end-0 top-50 translate-middle-y btn btn-link text-white p-3"
                onClick={navigateNext}
                style={{ zIndex: 10, fontSize: '2rem' }}
              >
                ❯
              </button>
            </div>

            {/* Footer with thumbnails */}
            <div className="galleria-footer p-3">
              <div className="d-flex justify-content-center align-items-center gap-2 overflow-auto">
                {images.slice(Math.max(0, galleriaIndex - 3), galleriaIndex + 4).map((image, index) => {
                  const actualIndex = Math.max(0, galleriaIndex - 3) + index;
                  return (
                    <div
                      key={image.id}
                      className={`galleria-thumbnail ${actualIndex === galleriaIndex ? 'active' : ''}`}
                      onClick={() => setGalleriaIndex(actualIndex)}
                      style={{
                        cursor: 'pointer',
                        opacity: actualIndex === galleriaIndex ? 1 : 0.6,
                        border: actualIndex === galleriaIndex ? '2px solid white' : '2px solid transparent',
                        borderRadius: '4px'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        style={{
                          width: '60px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '2px'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-white mt-2">
                <small>Use arrow keys or click thumbnails to navigate</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        {/* Image Grid View */}
        <div className={selectedImage ? "col-md-8 col-lg-8" : "col-12"}>
          <div className="row">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="col-lg-3 col-md-4 col-sm-6">
                {column.map((image) => (
                  <div
                    key={image.id}
                    className="mb-4 position-relative"
                    style={{
                      height: `${image.height}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      className="card h-100 border-0 shadow-sm"
                      onClick={() => handleImageClick(image)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.querySelector('.image-overlay').style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.querySelector('.image-overlay').style.opacity = '0';
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="card-img-top h-100 w-100"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                      <div
                        className="image-overlay position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <div className="position-absolute top-0 end-0 p-3">
                          <button
                            className="btn btn-sm btn-light rounded-circle"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <i className="bi bi-bookmark"></i>
                          </button>
                        </div>
                        <div className="position-absolute bottom-0 start-0 p-3 text-white">
                          <h6 className="mb-0">{image.title}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Image Detail Panel */}
        {selectedImage && (
          <div className="col-md-4">
            <div className="bg-light p-4 sticky-top" style={{
              top: '20px',
              borderRadius: '15px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Details</h4>
                <button
                  className="btn btn-sm btn-dark rounded-circle"
                  onClick={handleBackToGallery}
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 position-relative"
                style={{
                  overflow: 'hidden',
                  height: '300px',
                  cursor: 'pointer'
                }}
                onClick={openGalleria}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    //transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    transformOrigin: 'center center'
                  }}
                />
              </div>

              <h5>{selectedImage.title}</h5>
              <p className="text-muted">{selectedImage.description}</p>
              <div className="d-flex gap-3 mb-3">
                <span><i className="bi bi-bookmark me-1"></i> {selectedImage.stats.saves} Saves</span>
                <span><i className="bi bi-heart me-1"></i> {selectedImage.stats.likes} Likes</span>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <img
                    src="/assets/images/profile.png"
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <div>
                    <h6 className="mb-0">Pixelmind Solution</h6>
                    <small className="text-muted">Creative Agency</small>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline-primary">+ Follow</button>
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <h6>Comments ({selectedImage.comments.length})</h6>
                <div className="mt-3">
                  {selectedImage.comments.map((comment, index) => (
                    <div key={index} className="mb-2 p-2 glass-effect rounded">
                      <strong>{comment.user}</strong>: {comment.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="mt-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">Post</button>
                  </div>
                </form>
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <h6>Reach. Engage. Convert.</h6>
                <p className="text-muted small">Social Media Marketing, That Works</p>
              </div>

              <div className="mb-4">
                <h6>Redeuthen</h6>
                <p className="text-muted small">Safe Pixtinfo Solutions</p>
              </div>

              <div>
                <h6>Expansions</h6>
                <ul className="list-unstyled small">
                  {selectedImage.expansions.map((item, index) => (
                    <li key={index} className="mb-2">• {item}</li>
                  ))}
                </ul>
              </div>

              <button className="btn btn-primary w-100 mt-3 rounded-pill">
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .glass-effect {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Galleria Styles */
        .galleria-overlay {
          border: 1px solid rgba(255, 255, 255, 0.58);
          z-index: 9999;
          backdrop-filter: blur(5px);
        }
        
        .galleria-nav {
          background: rgba(255, 255, 255, 0.1) !important;
          border: none !important;
          border-radius: 50% !important;
          width: 60px !important;
          height: 60px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
        }
        
        .galleria-nav:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }
        
        .galleria-thumbnail {
          transition: all 0.3s ease;
        }
        
        .galleria-thumbnail:hover {
          transform: scale(1.1);
        }
        
        .galleria-image {
          transition: opacity 0.3s ease;
        }
        
        /* Zoom icon overlay hover effect */
        .mb-4:hover .zoom-icon-overlay {
          opacity: 1 !important;
        }
        
        /* Custom scrollbar for thumbnails */
        .galleria-footer .overflow-auto::-webkit-scrollbar {
          height: 6px;
        }
        
        .galleria-footer .overflow-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .galleria-footer .overflow-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .galleria-footer .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Animation for galleria opening */
        .galleria-overlay {
          animation: galleriaFadeIn 0.3s ease;
        }
        
        @keyframes galleriaFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .galleria-nav {
            width: 45px !important;
            height: 45px !important;
            font-size: 1.2rem !important;
          }
          
          .galleria-thumbnail img {
            width: 45px !important;
            height: 30px !important;
          }
          
          .galleria-header h5 {
            font-size: 1rem;
          }
        }
        
        /* Loading state for images */
        .galleria-image {
          max-width: 100%;
          height: auto;
        }
        
        /* Prevent text selection in galleria */
        .galleria-overlay {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
      <Download show={downloadModal} handleClose={handleClose}  />
    </div>
  );
}

export default HomeScreen;