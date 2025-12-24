import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const DOWNLOAD_API = "https://apisocial.atozkeysolution.com/api/post-download";
const WALLET_API = "https://apisocial.atozkeysolution.com/api/wallet";

const DownloadModal = ({
  show,
  onClose,
  cost,
  image,
  selectedMediaIndex,
  currentUserId,
  onAuthorized
}) => {
  // ✅ HOOKS AT TOP (ESLINT SAFE)
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);



  // ✅ FETCH WALLET BALANCE
  const fetchWallet = async () => {
    try {
      setWalletLoading(true);
      const res = await axios.get(`${WALLET_API}/${currentUserId}`);
      if (res.data?.success) {
        setBalance(res.data.data.coins);
      }
    } catch (err) {
      console.error("Wallet fetch failed:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  // 🔄 Fetch wallet when modal opens
  useEffect(() => {
    if (show && currentUserId) {
      fetchWallet();
    }
  }, [show, currentUserId]);

  // ✅ CONDITIONAL RENDER AFTER HOOKS
  if (!show) return null;

  const hasEnough = balance >= cost;

  // ✅ CONFIRM DOWNLOAD (API ONLY)
  const handleConfirm = async () => {
    if (!hasEnough || loading) return;

    try {
      setLoading(true);

      const res = await axios.post(DOWNLOAD_API, {
        postId: image._id,
        userId: currentUserId,
      });

      if (!res.data.success) {
        alert(res.data.message || "Download failed");
        return;
      }

      // 🔄 Refresh wallet after deduction
      await fetchWallet();

      // ✅ Tell parent to download file
      onAuthorized();

      onClose();
    } catch (err) {
      console.error("Download auth error:", err);
      alert(
        err?.response?.data?.message ||
        "Unable to process download"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 10000 }}
    >
      <div
        className="bg-white p-4 shadow-lg text-center"
        style={{ borderRadius: "15px", width: "380px", maxWidth: "95%" }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Download</h5>
          <button
            className="btn btn-sm btn-outline-dark rounded-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* PREVIEW */}
        {image && (
          <div className="mb-3">
            <div className="d-flex justify-content-center position-relative">
              {image.media?.[selectedMediaIndex]?.type === "video" ? (
                <>
                  {/* Video Preview */}
                  <video
                    src={image.media?.[selectedMediaIndex]?.url?.trim()}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "180px",
                      objectFit: "contain",
                      display: "block",
                      backgroundColor: "#000"
                    }}
                    muted
                  />

                  {/* Play Icon Overlay */}
                  <div
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <i
                      className="bi bi-play-fill text-white"
                      style={{ fontSize: "30px", marginLeft: "4px" }}
                    ></i>
                  </div>
                </>
              ) : (
                /* Image Preview */
                <img
                  src={image.media?.[selectedMediaIndex]?.url?.trim()}
                  alt={image.description || "Post"}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "180px",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              )}
            </div>

            <p className="mt-2 text-muted small text-center">
              {image.description || "Post media"}
            </p>
          </div>

        )}

        {/* WALLET INFO */}
        <div className="bg-warning bg-opacity-10 rounded p-3 mb-3">
          {walletLoading ? (
            <div className="spinner-border spinner-border-sm text-warning" />
          ) : (
            <>
              <h4 className="mb-0">{balance} Coins</h4>
              <small className="text-muted">Available</small>
              <hr />
              <div
                className={
                  hasEnough ? "text-warning fw-bold" : "text-danger fw-bold"
                }
              >
                Cost: {cost} Coins
              </div>
            </>
          )}
        </div>

        {/* ACTION */}
        <button
          className={`btn w-100 rounded-pill ${hasEnough ? "btn-warning text-white" : "btn-secondary"
            }`}
          onClick={handleConfirm}
          disabled={!hasEnough || loading || walletLoading}
        >
          {loading
            ? "Processing..."
            : hasEnough
              ? "Confirm Download"
              : "Insufficient Balance"}
        </button>
      </div>
    </div>
  );
};

DownloadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cost: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onAuthorized: PropTypes.func.isRequired,
};

export default DownloadModal;
