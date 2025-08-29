import { useState } from "react";
import { X } from "lucide-react";

const CampaignAdModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [adStatus, setAdStatus] = useState("Running");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const pauseAd = () => {
    setAdStatus("Paused");
    console.log("Ad paused");
  };

  const resumeAd = () => {
    setAdStatus("Running");
    console.log("Ad resumed");
  };

  const campaignData = {
    title: "Diwali Discount Blast",
    format: "Image",
    status: adStatus,
    startDate: "22-072025",
    budget: "₹ 5000",
    endDate: "25-072025",
    reach: "12,300 people",
    clicks: "1200"
  };

  if (!isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Campaign Ad Modal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Current Campaign Ad</h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {/* Campaign Image */}
          <div className="mb-4 relative">
            <div className="w-full h-48 bg-gradient-to-br from-red-800 via-red-700 to-red-900 rounded-lg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-orange-400 rounded-full opacity-80"></div>
              <div className="absolute top-8 right-8 w-4 h-4 bg-orange-300 rounded-full opacity-60"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
              
              {/* Main content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="border-2 border-yellow-400 rounded-md p-4 mb-3">
                  <div className="text-yellow-400 font-bold text-2xl text-center">DIWALI</div>
                  <div className="text-yellow-400 font-bold text-lg text-center">DISCOUNT</div>
                  <div className="text-yellow-400 font-bold text-3xl text-center">BLAST</div>
                </div>
                
                {/* Sparkle effect */}
                <div className="relative">
                  <div className="text-yellow-300 text-2xl">✨</div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-orange-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{campaignData.title}</h3>

          {/* Campaign Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ad Format:</span>
              <span className="text-sm font-medium text-gray-900">{campaignData.format}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Status</span>
                <span className={`text-sm font-medium ${
                  campaignData.status === "Running" ? "text-green-600" : "text-red-600"
                }`}>
                  {campaignData.status}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Start Date</span>
                <span className="text-sm font-medium text-gray-900">{campaignData.startDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Budget</span>
                <span className="text-sm font-medium text-gray-900">{campaignData.budget}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">End Date</span>
                <span className="text-sm font-medium text-gray-900">{campaignData.endDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Reach</span>
                <span className="text-sm font-medium text-gray-900">{campaignData.reach}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Clicks</span>
                <span className="text-sm font-medium text-gray-900">{campaignData.clicks}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            {campaignData.status === "Running" ? (
              <button
                onClick={pauseAd}
                className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Pause Ad
              </button>
            ) : (
              <button
                onClick={resumeAd}
                className="w-full py-3 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Resume Ad
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAdModal;