import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AdvertisementModal = ({ show, onClose, advertisement }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (show && advertisement?.campaignId) {
      fetchFAQs();
    }
  }, [show, advertisement]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://31.97.206.144:5002/api/campaigns/${advertisement.campaignId}/faqs`
      );
      if (response.data.success) {
        setFaqs(response.data.data.faqs || []);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (faqId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [faqId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== faqs.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Calculate score (simple mock - in real app, send to backend)
    const correctAnswers = Math.floor(Math.random() * faqs.length); // Mock
    setScore({
      correct: correctAnswers,
      total: faqs.length,
      percentage: Math.round((correctAnswers / faqs.length) * 100)
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const handleExternalLink = () => {
    if (advertisement.link) {
      window.open(advertisement.link, "_blank");
    }
  };

  if (!show) return null;

  const mediaUrl = advertisement.media?.[0]?.url;
  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "800px" }}>
        <div className="modal-content border-0 shadow-lg" style={{ 
          borderRadius: "20px",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div className="modal-header border-0 pb-0" style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="modal-title text-white mb-1">
                  <i className="bi bi-megaphone-fill me-2"></i>
                  {advertisement.title || "Advertisement"}
                </h5>
                <small className="text-white-50">
                  Answer questions to engage with this ad
                </small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle"
                onClick={onClose}
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            {/* Advertisement Media */}
            <div className="ad-media-container position-relative" style={{ 
              height: "300px",
              backgroundColor: "#000"
            }}>
              {isVideo ? (
                <video
                  src={mediaUrl}
                  className="w-100 h-100"
                  style={{ objectFit: "contain" }}
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={advertisement.title}
                  className="w-100 h-100"
                  style={{ objectFit: "contain" }}
                />
              )}
              <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                }}
              >
                <button 
                  className="btn btn-light btn-sm rounded-pill px-4"
                  onClick={handleExternalLink}
                >
                  <i className="bi bi-link-45deg me-2"></i>
                  Visit Website
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading advertisement content...</p>
                </div>
              ) : submitted ? (
                // Results Screen
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="score-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: `conic-gradient(#4CAF50 ${score.percentage}%, #f0f0f0 0%)`,
                        position: "relative"
                      }}
                    >
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "100px",
                          height: "100px"
                        }}
                      >
                        <div>
                          <div className="display-4 fw-bold text-primary">{score.percentage}%</div>
                          <small className="text-muted">Score</small>
                        </div>
                      </div>
                    </div>
                    <h4 className="fw-bold">Quiz Completed!</h4>
                    <p className="text-muted">
                      You got {score.correct} out of {score.total} questions correct.
                    </p>
                  </div>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary px-4"
                      onClick={handleExternalLink}
                    >
                      <i className="bi bi-link-45deg me-2"></i>
                      Visit Website
                    </button>
                    <button 
                      className="btn btn-outline-primary px-4"
                      onClick={handleReset}
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                // FAQ Questions
                <div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}>
                      <i className="bi bi-question-lg"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="fw-bold mb-0">Advertisement Quiz</h6>
                      <small className="text-muted">
                        Answer {faqs.length} questions about this ad
                      </small>
                    </div>
                  </div>

                  {faqs.map((faq, index) => (
                    <div key={faq._id} className="card mb-3 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <span className="badge bg-primary me-2">{index + 1}</span>
                          {faq.question}
                        </h6>
                        <div className="mt-3">
                          {faq.options.map((option, optIndex) => (
                            <div 
                              key={optIndex}
                              className={`form-check mb-2 p-3 rounded ${answers[faq._id] === optIndex ? 'bg-light border-primary' : 'border'}`}
                              style={{ 
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onClick={() => handleOptionSelect(faq._id, optIndex)}
                            >
                              <input
                                type="radio"
                                className="form-check-input"
                                name={`faq-${faq._id}`}
                                checked={answers[faq._id] === optIndex}
                                onChange={() => {}}
                              />
                              <label className="form-check-label ms-2 fw-medium">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Submit Button */}
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          Answered: {Object.keys(answers).length} / {faqs.length}
                        </small>
                      </div>
                      <button
                        className="btn btn-primary px-5 py-2 rounded-pill"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== faqs.length}
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          fontWeight: "600"
                        }}
                      >
                        <i className="bi bi-send me-2"></i>
                        Submit Answers
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light">
            <small className="text-muted me-auto">
              <i className="bi bi-info-circle me-1"></i>
              This is a sponsored advertisement
            </small>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .modal-content {
          animation: modalSlideUp 0.3s ease-out;
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-check:hover {
          background-color: #f8f9fa !important;
          border-color: #dee2e6 !important;
        }
        
        .score-circle::before {
          content: '';
          position: absolute;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: white;
          top: 5px;
          left: 5px;
        }
      `}</style>
    </div>
  );
};

AdvertisementModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  advertisement: PropTypes.object.isRequired,
};

export default AdvertisementModal;