import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignMenu = ({ onNavigate, onClose }) => {

    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Campaign</h2>
                    <button

                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Options */}
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            navigate("/simplifiedform");

                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg border-b border-gray-100 transition-colors"
                    >
                        Campaign
                    </button>
                    <button
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg border-b border-gray-100 transition-colors"
                        onClick={() => {
                            navigate("/responseform");
                        }}
                    >
                        Received responses
                    </button>
                    <button

                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                            navigate("/campaign-ad");
                        }}
                    >
                        Current Campaign Ad
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignMenu;
