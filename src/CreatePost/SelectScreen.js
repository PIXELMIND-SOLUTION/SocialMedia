import React from 'react';
import { Plus } from 'lucide-react';

const SelectScreen = ({ fileInputRef, handleFileSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-12">Create New Post</h2>
        
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main image icon */}
            <div className="w-20 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
              <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Video icon */}
            <div className="absolute -bottom-2 -right-2 w-12 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white">
              <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">Drag Photos and videos</p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Select from computer
        </button>
      </div>
    </div>
  );
};

export default SelectScreen;