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
              <svg
                className="w-8 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-8 text-lg">Drag Photos</p>

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