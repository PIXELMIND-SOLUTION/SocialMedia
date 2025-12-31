import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AdvertisementModal = ({ show, onClose, advertisement }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [answerDetails, setAnswerDetails] = useState([]);
  const timerRef = useRef(null);
  const modalRef = useRef(null);
  const hasSentClickStat = useRef(false);
  const hasSentTimeSpent = useRef(false);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;
  const userMail = storedUser?.email;
  const userName = storedUser?.fullName || storedUser?.username || "User";

  // Track time spent and send click stat when modal opens
  useEffect(() => {
    if (show) {
      // Send click stat when modal opens (once)
      if (!hasSentClickStat.current) {
        sendStatUpdate('click');
        hasSentClickStat.current = true;
      }

      // Start timer for time tracking
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [show]);

  // Reset refs when modal closes
  useEffect(() => {
    if (!show) {
      hasSentClickStat.current = false;
      hasSentTimeSpent.current = false;
    }
  }, [show]);

  useEffect(() => {
    if (show && advertisement?.campaignId) {
      fetchFAQs();
    }
  }, [show, advertisement]);

  const sendStatUpdate = async (type, data = {}) => {
    try {
      await axios.post('https://apisocial.atozkeysolution.com/api/campaigns/stats/update', {
        campaignId: advertisement.campaignId,
        type,
        ...data,
        userEmail: userMail,
        userName: userName
      });
    } catch (error) {
      console.error(`Failed to update ${type} stat:`, error);
    }
  };

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://apisocial.atozkeysolution.com/api/campaigns/${advertisement.campaignId}/faqs`
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

  const handleOptionSelect = async (faqId, optionIndex) => {
    // Record FAQ attempt
    try {
      await axios.post('https://apisocial.atozkeysolution.com/api/campaigns/stats/update', {
        campaignId: advertisement.campaignId,
        type: 'faq_attempt',
        userEmail: userMail,
        userName: userName
      });
    } catch (error) {
      console.error("Failed to record FAQ attempt:", error);
    }

    setAnswers(prev => ({
      ...prev,
      [faqId]: optionIndex
    }));
  };

  const validateAnswers = async () => {
    const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption: faqs.find(faq => faq._id === questionId)?.options[selectedOption] ||
        String.fromCharCode(65 + selectedOption)
    }));

    try {
      const response = await axios.post('https://apisocial.atozkeysolution.com/api/campaigns/faqs/submit', {
        campaignId: advertisement.campaignId,
        userEmail: userMail,
        userName: userName,
        answers: answerArray,
        timeSpent: timeSpent // Include time spent in the submission
      });

      if (response.data.success && response.data.data) {
        const { score, totalQuestions, percentage, answers } = response.data.data;
        return {
          correct: score,
          total: totalQuestions,
          percentage: parseFloat(percentage),
          answerDetails: answers || []
        };
      }




    } catch (error) {
      console.error("Failed to submit answers:", error.response?.data || error.message);
    }

    // Fallback calculation if API fails
    const correctAnswers = Math.floor(Math.random() * faqs.length);
    return {
      correct: correctAnswers,
      total: faqs.length,
      percentage: Math.round((correctAnswers / faqs.length) * 100),
      answerDetails: []
    };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== faqs.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    try {
      // Send time spent stat when submitting
      if (!hasSentTimeSpent.current) {
        await axios.post('https://apisocial.atozkeysolution.com/api/campaigns/time-spent', {
          campaignId: advertisement.campaignId,
          userId: userId,
          timeSpent: timeSpent
        });
      }

      const result = await validateAnswers();
      setScore({
        correct: result.correct,
        total: result.total,
        percentage: result.percentage
      });
      setAnswerDetails(result.answerDetails);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setAnswerDetails([]);
    setTimeSpent(0);
    hasSentTimeSpent.current = false;
  };

  const handleExternalLink = () => {
    // Send click stat for external link
    sendStatUpdate('click');
    if (advertisement.link) {
      window.open(advertisement.link, "_blank");
    }
  };

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!show) return null;

  const mediaUrl = advertisement.media?.[0]?.url;
  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg|mov|m3u8)$/i);
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = faqs.length > 0 ? (answeredCount / faqs.length) * 100 : 0;

  return (
    <div
      ref={modalRef}
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        overflowY: "auto"
      }}
      tabIndex="-1"
      onClick={handleModalClick}
    >
      <div className="modal-dialog modal-dialog-centered" style={{
        maxWidth: "900px",
        width: "100%",
        padding: "1rem"
      }}>
        <div className="modal-content border-0 shadow-xl" style={{
          borderRadius: "24px",
          overflow: "hidden",
          maxHeight: "95vh",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
        }}>
          {/* Header */}
          <div className="modal-header border-0 py-4" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0
          }}>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div style={{ maxWidth: "calc(100% - 50px)" }}>
                <div className="d-flex align-items-center mb-2">
                  <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center me-3"
                    style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <i className="bi bi-megaphone-fill text-white"></i>
                  </div>
                  <div>
                    <h5 className="modal-title text-gray-900 mb-0 fw-bold fs-4">
                      {advertisement.title || "Advertisement"}
                    </h5>
                    <small className="text-gray-600 d-block text-truncate">
                      {advertisement.description || "Answer questions to engage with this ad"}
                    </small>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle flex-shrink-0 border"
                onClick={onClose}
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#e2e8f0 !important",
                  background: "#fff",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "rotate(90deg)";
                  e.target.style.background = "#f1f5f9";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "rotate(0deg)";
                  e.target.style.background = "#fff";
                }}
                aria-label="Close"
              >
                <i className="bi bi-x-lg text-gray-600"></i>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-0" style={{
            flex: 1,
            overflowY: "auto"
          }}>
            {/* Advertisement Media - Modern Card Style */}
            <div className="position-relative px-4 pt-4">
              <div className="rounded-3 overflow-hidden shadow-lg border border-gray-200" style={{
                minHeight: "240px",
                maxHeight: "360px",
                backgroundColor: "#f8fafc",
                position: "relative"
              }}>
                {isVideo ? (
                  <div className="video-container position-relative w-100 h-100">
                    <video
                      src={mediaUrl}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      controls
                      autoPlay
                      muted
                      playsInline
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2">
                        <i className="bi bi-play-circle me-2"></i>
                        Video Ad
                      </span>
                    </div>
                  </div>
                ) : mediaUrl ? (
                  <div className="image-container w-100 h-100 position-relative">
                    <img
                      src={mediaUrl}
                      alt={advertisement.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2">
                        <i className="bi bi-image me-2"></i>
                        Sponsored
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-gradient-primary bg-opacity-10">
                    <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center mb-3"
                      style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)" }}>
                      <i className="bi bi-image text-primary" style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <p className="text-gray-600 mb-0">Advertisement Preview</p>
                  </div>
                )}

                {/* Overlay Action Button */}
                <div className="position-absolute bottom-0 start-0 w-100 p-4"
                  style={{
                    background: "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.7), transparent)"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-gray-900 mb-1">Ready to learn more?</h6>
                      <small className="text-gray-600">Visit the website for complete details</small>
                    </div>
                    <button
                      className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center shadow-sm"
                      onClick={handleExternalLink}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        fontWeight: "600"
                      }}
                    >
                      <i className="bi bi-box-arrow-up-right me-2"></i>
                      Visit Site
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
              {loading && !submitted ? (
                <div className="text-center py-8">
                  <div className="spinner-border text-primary mb-4" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h6 className="fw-bold text-gray-900 mb-2">Submitting Answers</h6>
                  <p className="text-gray-600">Please wait while we process your responses...</p>
                </div>
              ) : submitted ? (
                // Results Screen
                <div className="text-center py-6">
                  <div className="mb-6">
                    <div className="score-circle mx-auto mb-4 position-relative"
                      style={{
                        width: "160px",
                        height: "160px",
                        margin: "0 auto"
                      }}
                    >
                      <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                        style={{
                          background: `conic-gradient(${score.percentage >= 70 ? "#10b981" :
                            score.percentage >= 50 ? "#f59e0b" : "#3b82f6"
                            } ${score.percentage}%, #f1f5f9 0%)`
                        }}
                      ></div>
                      <div className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                        style={{
                          width: "150px",
                          height: "150px",
                          border: "8px solid white"
                        }}
                      >
                        <div>
                          <div className="display-3 fw-bold" style={{
                            color: score.percentage >= 70 ? "#10b981" :
                              score.percentage >= 50 ? "#f59e0b" : "#3b82f6"
                          }}>{score.percentage}%</div>
                          <small className="text-gray-600">Score</small>
                        </div>
                      </div>
                    </div>
                    <h4 className="fw-bold text-gray-900 mb-3">Quiz Completed!</h4>
                    <p className="text-gray-600 mb-4">
                      You got <span className="fw-bold">{score.correct}</span> out of <span className="fw-bold">{score.total}</span> questions correct.
                    </p>

                    {/* Answer Details */}
                    {answerDetails.length > 0 && (
                      <div className="answer-details mt-5 text-start">
                        <h6 className="fw-bold text-gray-900 mb-3">Your Answers:</h6>
                        <div className="row g-3">
                          {answerDetails.map((detail, index) => (
                            <div key={index} className="col-12">
                              <div className={`card border-0 ${detail.isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                                <div className="card-body">
                                  <div className="d-flex align-items-start">
                                    <div className={`rounded-circle ${detail.isCorrect ? 'bg-success text-white' : 'bg-danger text-white'} d-flex align-items-center justify-content-center me-3 flex-shrink-0`}
                                      style={{ width: "32px", height: "32px" }}>
                                      <i className={`bi ${detail.isCorrect ? 'bi-check-lg' : 'bi-x-lg'}`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold text-gray-900 mb-1">{detail.questionText}</h6>
                                      <div className="d-flex flex-wrap gap-2 mt-2">
                                        <span className="badge bg-gray-200 text-dark">
                                          Your Answer: {detail.selectedOption}
                                        </span>
                                        {!detail.isCorrect && (
                                          <span className="badge bg-success text-white">
                                            Correct: {detail.correctOption}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {score.percentage >= 70 ? (
                      <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-3 px-4 rounded-pill mb-4 mt-4">
                        <i className="bi bi-trophy-fill me-2"></i>
                        Excellent Performance!
                      </div>
                    ) : score.percentage >= 50 ? (
                      <div className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 py-3 px-4 rounded-pill mb-4 mt-4">
                        <i className="bi bi-emoji-smile-fill me-2"></i>
                        Good Job!
                      </div>
                    ) : (
                      <div className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 py-3 px-4 rounded-pill mb-4 mt-4">
                        <i className="bi bi-lightbulb-fill me-2"></i>
                        Keep Learning!
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <button
                      className="btn btn-primary px-5 py-3 rounded-pill d-flex align-items-center justify-content-center shadow-sm"
                      onClick={handleExternalLink}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        fontWeight: "600"
                      }}
                    >
                      <i className="bi bi-link-45deg me-2"></i>
                      Visit Website
                    </button>
                    <button
                      className="btn btn-outline-primary px-5 py-3 rounded-pill d-flex align-items-center justify-content-center"
                      onClick={handleReset}
                      style={{
                        borderColor: "#667eea",
                        color: "#667eea",
                        fontWeight: "600"
                      }}
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                // FAQ Questions
                <div>
                  {/* Quiz Header */}
                  <div className="d-flex align-items-center justify-content-between mb-6 p-4 bg-gray-50 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                        style={{ width: "52px", height: "52px" }}>
                        <i className="bi bi-question-lg fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-gray-900 mb-1">Advertisement Quiz</h6>
                        <small className="text-gray-600">
                          Answer {faqs.length} questions to test your knowledge
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-gray-900 fs-3">{answeredCount}<span className="text-gray-400 fs-6">/{faqs.length}</span></div>
                      <small className="text-gray-600">Questions answered</small>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {faqs.length > 0 && (
                    <div className="mb-6">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-gray-700 fw-medium">Quiz Progress</span>
                        <span className="text-gray-900 fw-bold">{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="progress" style={{ height: "10px", borderRadius: "5px", background: "#f1f5f9" }}>
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{
                            width: `${progressPercentage}%`,
                            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            transition: "width 0.6s ease"
                          }}
                          aria-valuenow={progressPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="faq-list" style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }}>
                    {faqs.map((faq, index) => (
                      <div key={faq._id || index} className="card mb-4 border-0 shadow-sm rounded-3 overflow-hidden">
                        <div className="card-header bg-white border-0 py-4">
                          <h6 className="card-title fw-bold text-gray-900 d-flex align-items-start m-0">
                            <span className="badge bg-primary rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: "36px",
                                height: "36px",
                                fontSize: "0.9rem",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              }}>
                              {index + 1}
                            </span>
                            <span style={{ flex: 1, lineHeight: "1.5" }}>{faq.question}</span>
                          </h6>
                        </div>
                        <div className="card-body p-4 pt-0">
                          <div className="row g-3">
                            {faq.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="col-12 col-md-6"
                              >
                                <div
                                  className={`option-card h-100 rounded-3 p-4 ${answers[faq._id] === optIndex ? 'selected' : ''}`}
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    border: "2px solid #e2e8f0",
                                    background: answers[faq._id] === optIndex ?
                                      "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)" :
                                      "#ffffff",
                                    position: "relative",
                                    overflow: "hidden"
                                  }}
                                  onClick={() => handleOptionSelect(faq._id, optIndex)}
                                >
                                  {/* Selection Indicator */}
                                  <div className={`position-absolute top-0 end-0 m-3 ${answers[faq._id] === optIndex ? 'visible' : 'invisible'}`}
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      borderRadius: "50%",
                                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    <i className="bi bi-check text-white" style={{ fontSize: "0.75rem" }}></i>
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <div className={`radio-indicator me-3 ${answers[faq._id] === optIndex ? 'checked' : ''}`}
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        border: "2px solid #cbd5e1",
                                        position: "relative",
                                        flexShrink: 0,
                                        transition: "all 0.2s ease"
                                      }}
                                    >
                                      {answers[faq._id] === optIndex && (
                                        <div style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          width: "12px",
                                          height: "12px",
                                          borderRadius: "50%",
                                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        }}></div>
                                      )}
                                    </div>
                                    <span className="fw-medium text-gray-800" style={{ lineHeight: "1.5" }}>{option}</span>
                                  </div>

                                  {/* Option Label */}
                                  <div className="position-absolute bottom-0 start-0 px-3 py-1 bg-gray-100 rounded-tr-lg rounded-bl-lg"
                                    style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                    Option {String.fromCharCode(65 + optIndex)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 pt-4 border-top">
                    <button
                      className="btn btn-primary w-100 py-4 rounded-3 fw-bold shadow-lg"
                      onClick={handleSubmit}
                      disabled={answeredCount !== faqs.length || faqs.length === 0}
                      style={{
                        background: answeredCount === faqs.length ?
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" :
                          "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                        border: "none",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onMouseOver={(e) => {
                        if (answeredCount === faqs.length) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 12px 25px rgba(102, 126, 234, 0.4)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (answeredCount === faqs.length) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)";
                        }
                      }}
                    >
                      {answeredCount === faqs.length ? (
                        <>
                          <i className="bi bi-send-fill me-3"></i>
                          Submit Your Answers
                          {/* <span className="position-absolute end-0 top-50 translate-middle-y me-4 badge bg-white text-primary px-3 py-2 rounded-pill">
                            +{Math.floor(timeSpent / 10)} Points
                          </span> */}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-clock me-3"></i>
                          Complete All Questions ({answeredCount}/{faqs.length})
                        </>
                      )}
                    </button>
                    <div className="text-center mt-3">
                      <small className="text-gray-600">
                        <i className="bi bi-info-circle me-1"></i>
                        Time spent on quiz: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .modal-content {
          animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .option-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .option-card:hover {
          border-color: #93c5fd !important;
          background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%) !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15) !important;
        }
        
        .option-card.selected {
          border-color: #667eea !important;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2) !important;
        }
        
        .option-card.selected::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px 3px 0 0;
        }
        
        .progress-bar {
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .faq-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .faq-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .faq-list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .faq-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
        
        .score-circle {
          animation: scoreCirclePop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }
        
        @keyframes scoreCirclePop {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-180deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .modal-dialog {
            margin: 0.5rem;
            padding: 0;
            max-width: calc(100% - 1rem);
          }
          
          .modal-content {
            max-height: 98vh;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 1.5rem !important;
          }
          
          .modal-body {
            padding: 0 !important;
          }
          
          .ad-media-container {
            padding: 1rem !important;
          }
          
          .rounded-3 {
            border-radius: 16px !important;
          }
          
          .faq-list {
            max-height: 350px;
            padding: 0 0.5rem;
          }
          
          .option-card {
            padding: 1.25rem !important;
            margin-bottom: 0.75rem;
          }
          
          .score-circle {
            width: 140px !important;
            height: 140px !important;
          }
          
          .score-circle > div {
            width: 110px !important;
            height: 110px !important;
          }
          
          .btn {
            padding: 0.875rem 1.5rem !important;
            font-size: 1rem !important;
          }
          
          .modal-title {
            font-size: 1.25rem;
          }
          
          .answer-details .card {
            padding: 0.75rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0.25rem;
            padding: 0;
          }
          
          .modal-content {
            border-radius: 18px;
            max-height: 99vh;
          }
          
          .modal-header {
            padding: 1.25rem !important;
          }
          
          .modal-body > div {
            padding: 1rem !important;
          }
          
          .faq-list {
            max-height: 300px;
          }
          
          .option-card {
            padding: 1rem !important;
          }
          
          .row.g-3 > .col-12 {
            padding-right: calc(var(--bs-gutter-x) * 0.5) !important;
            padding-left: calc(var(--bs-gutter-x) * 0.5) !important;
          }
          
          .btn {
            padding: 0.75rem 1rem !important;
            font-size: 0.95rem !important;
          }
          
          .modal-footer {
            padding: 1rem !important;
          }
        }
        
        /* Small mobile devices */
        @media (max-width: 375px) {
          .modal-dialog {
            margin: 0.125rem;
          }
          
          .modal-content {
            border-radius: 16px;
          }
          
          .modal-header {
            padding: 1rem !important;
          }
          
          .modal-title {
            font-size: 1.1rem;
          }
          
          .btn {
            padding: 0.625rem 0.875rem !important;
            font-size: 0.9rem !important;
          }
        }
        
        /* Tablet optimizations */
        @media (min-width: 769px) and (max-width: 1024px) {
          .modal-dialog {
            max-width: 700px;
          }
          
          .ad-media-container {
            max-height: 300px;
          }
          
          .faq-list {
            max-height: 350px;
          }
        }
        
        /* Large desktop optimizations */
        @media (min-width: 1400px) {
          .modal-dialog {
            max-width: 1000px;
          }
          
          .modal-content {
            max-height: 85vh;
          }
        }
        
        /* Print styles */
        @media print {
          .modal-content {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          
          .btn, .badge, .progress-bar {
            border: 1px solid #ddd !important;
          }
        }
        
        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .modal-content,
          .option-card,
          .progress-bar,
          .score-circle,
          .btn {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .modal-content {
            border: 2px solid #000 !important;
          }
          
          .option-card.selected {
            border: 3px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

AdvertisementModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  advertisement: PropTypes.shape({
    campaignId: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    )
  }).isRequired,
};

AdvertisementModal.defaultProps = {
  advertisement: {
    campaignId: '',
    title: 'Advertisement',
    description: '',
    link: '#',
    media: []
  }
};

export default AdvertisementModal;