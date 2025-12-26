import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://apisocial.atozkeysolution.com/api/campaign-packages";

const PricingPlans = ({ onNavigate }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(API_URL);
        setPlans(res.data.data || []);
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/40 backdrop-blur">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black/40 backdrop-blur-sm p-6">
      <div className="w-full max-w-6xl">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Choose Your Campaign Plan
          </h2>

          {plans.length === 0 ? (
            <p className="text-center text-gray-500">
              No plans available right now
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`relative rounded-2xl border shadow-xl p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl
                    ${
                      plan.priority === 1
                        ? "border-orange-500 ring-2 ring-orange-400/40"
                        : "border-white/40"
                    }
                  `}
                >
                  {/* Badge */}
                  {plan.priority === 1 && (
                    <span className="absolute -top-3 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      Most Popular
                    </span>
                  )}

                  {/* Price */}
                  <div className="text-center">
                    <h3 className="text-4xl font-extrabold text-gray-900">
                      ₹{plan.price}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      / {plan.durationHours} hrs
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-8 space-y-4 flex-1">
                    <Feature text={`Target Users: ${plan.targetUsers}`} />
                    <Feature text={`Post Interval: ${plan.postsInterval} mins`} />
                    {plan.features?.map((feat, idx) => (
                      <Feature key={idx} text={feat} />
                    ))}
                    {plan.content?.map((c, idx) => (
                      <Feature key={idx} text={`Includes ${c}`} />
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => onNavigate("menu", plan)}
                    className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition
                      ${
                        plan.priority === 1
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          : "bg-gray-800 hover:bg-gray-900"
                      }
                    `}
                  >
                    Proceed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Feature Item ---------------- */

const Feature = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>
    <span className="text-gray-700">{text}</span>
  </div>
);

export default PricingPlans;
