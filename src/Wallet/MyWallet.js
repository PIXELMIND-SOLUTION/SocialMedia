import { useState } from "react";
import { X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WalletModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [starsBalance, setStarsBalance] = useState(1000);

  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addStars = () => {
    navigate('/packages');
  };

  if (!isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Show My Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Wallet</h2>
            <button
              onClick={closeModal}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-8 text-center">
            {/* Star Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <Star size={32} className="text-white fill-current" />
              </div>
            </div>

            {/* Balance Display */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{starsBalance.toLocaleString()}</div>
              <div className="text-gray-500">Stars Available</div>
            </div>

            {/* Add Stars Button */}
            <button
              onClick={addStars}
              className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Stars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;