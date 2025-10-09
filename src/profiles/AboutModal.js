import React from 'react';
import { X } from 'lucide-react';

const AboutModal = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">About</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Full Name</h3>
            <p className="text-base">{profile.fullName}</p>
          </div>

          {profile.profile.about && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Bio</h3>
              <p className="text-base whitespace-pre-wrap">{profile.profile.about}</p>
            </div>
          )}

          {profile.profile.website && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Website</h3>
              <a 
                href={profile.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {profile.profile.website}
              </a>
            </div>
          )}

          {profile.personalInfo?.birthdate && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Birthdate</h3>
              <p className="text-base">
                {new Date(profile.personalInfo.birthdate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {profile.personalInfo?.country && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Country</h3>
              <p className="text-base">{profile.personalInfo.country}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Email</h3>
            <p className="text-base">{profile.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Mobile</h3>
            <p className="text-base">{profile.mobile}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Account Created</h3>
            <p className="text-base">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;