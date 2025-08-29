import React from "react";

const plans = [
  {
    name: "Basic",
    price: "₹199",
    duration: "/4 Hr's",
    features: [
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
    ],
  },
  {
    name: "Standard",
    price: "₹400",
    duration: "/8 Hr's",
    features: [
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
    ],
  },
  {
    name: "Premium",
    price: "₹800",
    duration: "/16 Hr's",
    features: [
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
      "Lorem Ipsum is simply dummy",
    ],
  },
];

const PricingPlans = ({ onNavigate }) => (
  <div className="flex justify-center items-center min-h-screen bg-black/40 backdrop-blur-sm p-6">
    <div className="w-full max-w-6xl">
      <div className="bg-white rounded-xl shadow-xl p-8 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[300px]">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white/50 backdrop-blur-md rounded-lg border shadow-xl border-white/30 p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-500">
                    {plan.duration}
                  </span>
                </h3>

                <div className="space-y-4 mt-6 flex-1">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate("menu")}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Proceed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PricingPlans;
