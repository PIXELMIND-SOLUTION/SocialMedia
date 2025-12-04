import React from "react";
import { Plus } from "lucide-react";

const SelectScreen = ({ fileInputRef, handleFileSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        
        <h2 className="text-xl font-semibold mb-12">Create New Post</h2>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center relative">

              {/* 🔥 NEW Image + Video Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
              >
                {/* Video Frame */}
                <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
                {/* Image Mountains */}
                <path d="M8 14l2.5-3 3 4 2.5-3 3 4" />
                {/* Sun / circle */}
                <circle cx="9" cy="8" r="1.7" />
              </svg>

              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-8 text-lg">Drag Photos or Videos</p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Select from Gallery
        </button>

      </div>
    </div>
  );
};

export default SelectScreen;
