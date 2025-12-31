import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PLANS_API = "https://apisocial.atozkeysolution.com/api/campaign-packages";
const CREATE_ORDER_API =
  "https://apisocial.atozkeysolution.com/api/campaigns/payment/create-order";
const VERIFY_PAYMENT_API =
  "https://apisocial.atozkeysolution.com/api/campaigns/payment/verify";

const PricingPlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // UI states
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const userId = storedUser?.userId;
  const campaignId = sessionStorage.getItem("campaignId");

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(PLANS_API);
        setPlans(res.data.data || []);
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  /* ---------------- VERIFY PAYMENT ---------------- */
  const verifyPayment = async (paymentId) => {
    try {
      setProcessing(true);

      await axios.post(VERIFY_PAYMENT_API, {
        campaignId,
        razorpay_payment_id: paymentId
      });

      // Success UI
      setTimeout(() => setShowSuccessModal(true), 1200);

      // Redirect
      setTimeout(() => {
        navigate("/campaign-ad");
      }, 3500);
    } catch (err) {
      console.error("Payment verification failed", err);
      alert("Payment verification failed. Please contact support.");
      setProcessing(false);
    }
  };

  /* ---------------- RAZORPAY ---------------- */
  const openRazorpay = (order) => {
    const options = {
      key: order.key,
      amount: order.amount * 100,
      currency: order.currency,
      name: "Campaign Promotion",
      description: "Campaign Package Purchase",
      order_id: order.id,

      handler: function (response) {
        console.log("Razorpay Response:", response);

        // 🔐 VERIFY PAYMENT
        verifyPayment(response.razorpay_payment_id);
      },

      prefill: {
        name: storedUser?.fullName || "",
        email: storedUser?.email || "",
        contact: storedUser?.mobile || ""
      },

      theme: { color: "#f97316" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ---------------- CREATE ORDER ---------------- */
  const handleProceed = async (plan) => {
    if (!campaignId || !userId) {
      alert("Campaign or user not found");
      return;
    }

    try {
      setPaying(true);

      const res = await axios.post(
        CREATE_ORDER_API,
        new URLSearchParams({
          campaignId,
          packageId: plan._id,
          userId
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      openRazorpay(res.data.order);
    } catch (err) {
      console.error(err);
      alert("Failed to create payment order");
    } finally {
      setPaying(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {/* PROCESSING OVERLAY */}
      {processing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex flex-col items-center justify-center">
          <div className="animate-spin h-14 w-14 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg font-medium">
            Verifying your payment...
          </p>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full animate-scale-in">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2">
              Payment Verified 🎉
            </h3>
            <p className="text-gray-500">
              Your campaign is now live.
            </p>

            <p className="text-sm text-gray-400 mt-4">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className="min-h-screen bg-black/40 backdrop-blur p-6 flex justify-center">
        <div className="max-w-6xl w-full bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Choose Your Campaign Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`rounded-2xl border p-6 flex flex-col shadow-xl
                  ${
                    plan.priority === 1
                      ? "border-orange-500 ring-2 ring-orange-400"
                      : ""
                  }
                `}
              >
                <h3 className="text-4xl font-extrabold text-center">
                  ₹{plan.price}
                </h3>
                <p className="text-center text-gray-500">
                  / {plan.durationHours} hrs
                </p>

                <div className="mt-6 space-y-3 flex-1">
                  <Feature text={`Target Users: ${plan.targetUsers}`} />
                  <Feature text={`Post Interval: ${plan.postsInterval} mins`} />
                  {plan.features?.map((f, i) => (
                    <Feature key={i} text={f} />
                  ))}
                </div>

                <button
                  disabled={paying}
                  onClick={() => handleProceed(plan)}
                  className="mt-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-60"
                >
                  {paying ? "Processing..." : "Pay Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

const Feature = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>
    <span>{text}</span>
  </div>
);

export default PricingPlans;
