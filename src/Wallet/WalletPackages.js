import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Wallet, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WalletPackages = () => {
  /* ===============================
     USER
  =============================== */
  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const USER_ID = storedUser?.userId;

  const navigate = useNavigate();

  /* ===============================
     STATE
  =============================== */
  const [packages, setPackages] = useState([]);
  const [walletCoins, setWalletCoins] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ===============================
     LOAD RAZORPAY
  =============================== */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ===============================
     FETCH WALLET + PACKAGES
  =============================== */
  useEffect(() => {
    if (!USER_ID) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [packageRes, walletRes] = await Promise.all([
          axios.get("http://31.97.206.144:5002/api/admin/packages"),
          axios.get(
            `http://31.97.206.144:5002/api/wallet/${USER_ID}`
          ),
        ]);

        if (packageRes.data?.success) {
          setPackages(
            packageRes.data.data.filter((pkg) => pkg.isActive)
          );
        }

        if (walletRes.data?.success) {
          setWalletCoins(walletRes.data.data.coins || 0);
        }
      } catch (err) {
        setError("Failed to load packages or wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [USER_ID]);

  /* ===============================
     PAYMENT FLOW
  =============================== */
  const proceedWithPayment = async () => {
    if (!selectedPackage || processing) return;

    try {
      setProcessing(true);

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const orderRes = await axios.post(
        "http://31.97.206.144:5002/api/create-order",
        {
          userId: USER_ID,
          packageId: selectedPackage,
        }
      );

      if (!orderRes.data?.success) {
        throw new Error("Order creation failed");
      }

      const {
        razorpayOrderId,
        amount,
        coins,
        razorpayKey,
      } = orderRes.data.data;

      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: "INR",
        name: "Wallet Recharge",
        description: `${coins} Coins`,
        order_id: razorpayOrderId,

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "http://31.97.206.144:5002/api/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            if (verifyRes.data?.success) {
              setWalletCoins(verifyRes.data.data.totalCoins);
              setSelectedPackage(null);

              // 🎉 SHOW SUCCESS MODAL
              setShowSuccessModal(true);

              // ⏳ AUTO REDIRECT AFTER 3 SEC
              setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/mywallet");
              }, 3000);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Payment verification error");
          }
        },

        theme: { color: "#f97316" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading packages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h3 className="mt-4 text-xl font-bold text-gray-800">
              Payment Successful 🎉
            </h3>
            <p className="mt-2 text-gray-600">
              Coins added to your wallet
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Redirecting to wallet...
            </p>
          </div>
        </div>
      )}

      {/* ================= MAIN UI ================= */}
      <div className="relative mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Packages
          </h2>

          <div className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-white shadow-lg">
            <Wallet size={18} />
            <span className="font-semibold">{walletCoins}</span>
            <Star size={16} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {packages.map((pkg) => (
            <button
              key={pkg._id}
              onClick={() => setSelectedPackage(pkg._id)}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                selectedPackage === pkg._id
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 hover:border-orange-400"
              }`}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <Star className="text-white" size={26} />
              </div>

              <p className="text-lg font-bold text-orange-600">
                {pkg.coins} Coins
              </p>

              <p className="text-sm font-semibold text-gray-800">
                ₹{pkg.price}
              </p>

              {pkg.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{pkg.originalPrice}
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={proceedWithPayment}
            disabled={!selectedPackage || processing}
            className="w-full rounded-xl bg-orange-500 py-3 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </>
  );
};

export default WalletPackages;
