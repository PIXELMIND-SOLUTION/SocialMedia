import { useState } from "react";
import { X } from "lucide-react";

const PackageSelectionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    { id: 1, coins: 100, price: 120 },
    { id: 2, coins: 200, price: 210 },
    { id: 3, coins: 100, price: 100 },
    { id: 4, coins: 100, price: 120 },
    { id: 5, coins: 200, price: 210 },
    { id: 6, coins: 100, price: 100 }
  ];

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectPackage = (packageId) => {
    setSelectedPackage(packageId);
  };

  const proceedWithPayment = () => {
    if (selectedPackage) {
      const selected = packages.find(pkg => pkg.id === selectedPackage);
      console.log("Proceeding with package:", selected);
      alert(`Processing payment for ${selected.coins} coins at ₹${selected.price}`);
    } else {
      alert("Please select a package first");
    }
  };

  if (!isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Show Package Selection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Select Package</h2>
            <button
              onClick={closeModal}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Package Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => selectPackage(pkg.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedPackage === pkg.id
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-orange-200 bg-white hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Coin Icon */}
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs font-bold">⭐</span>
                      </div>
                    </div>
                    
                    {/* Package Details */}
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{pkg.coins}</div>
                      <div className="text-sm text-gray-600">₹ {pkg.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Proceed Button */}
            <button
              onClick={proceedWithPayment}
              className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedPackage}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionModal;