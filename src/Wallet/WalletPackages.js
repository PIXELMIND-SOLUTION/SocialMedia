import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Wallet } from "lucide-react";

const WalletPackages = () => {
  /* ===============================
     USER
  =============================== */
  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const USER_ID = storedUser?.userId;

  /* ===============================
     STATE
  =============================== */
  const [packages, setPackages] = useState([]);
  const [walletCoins, setWalletCoins] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

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
        setLoading(true);

        const [packageRes, walletRes] = await Promise.all([
          axios.get("https://apisocial.atozkeysolution.com/api/admin/packages"),
          axios.get(
            `https://apisocial.atozkeysolution.com/api/wallet/${USER_ID}`
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
        console.error(err);
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

      // 🔹 CREATE ORDER
      const orderRes = await axios.post(
        "https://apisocial.atozkeysolution.com/api/create-order",
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

      // 🔹 OPEN RAZORPAY
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: "INR",
        name: "Wallet Recharge",
        description: `${coins} Coins`,
        order_id: razorpayOrderId,

        handler: async (response) => {
          try {
            // 🔹 VERIFY PAYMENT
            const verifyRes = await axios.post(
              "https://apisocial.atozkeysolution.com/api/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            if (verifyRes.data?.success) {
              setWalletCoins(verifyRes.data.data.totalCoins);
              setSelectedPackage(null);
              alert("Coins added to wallet 🎉");
            } else {
              alert(verifyRes.data.message || "Verification failed");
            }
          } catch (err) {
            console.error(
              "VERIFY ERROR:",
              err.response?.data || err
            );
            alert(
              err.response?.data?.message ||
                "Payment verification error"
            );
          }
        },

        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
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
    <div className="relative mx-auto max-w-5xl px-4 py-8">
      {/* ================= HEADER ================= */}
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

      {/* ================= PACKAGES ================= */}
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

      {/* ================= ACTION ================= */}
      <div className="mt-8">
        <button
          onClick={proceedWithPayment}
          disabled={!selectedPackage || processing}
          className="w-full rounded-xl bg-orange-500 py-3 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default WalletPackages;
