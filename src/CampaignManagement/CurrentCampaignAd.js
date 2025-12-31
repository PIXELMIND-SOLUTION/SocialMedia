import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://apisocial.atozkeysolution.com/api/campaigns/user";

const TABS = [
  { id: "Pending", label: "Pending", countKey: "pending" },
  { id: "Current", label: "Active", countKey: "approved" },
  { id: "Rejected", label: "Rejected", countKey: "rejected" }
];
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} min`;
  return `${mins}m ${secs}s`;
};

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("Current");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const userId = storedUser?.userId;

  /* ================= FETCH CAMPAIGNS ================= */
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/${userId}`);

        if (res.data.success) {
          setCampaigns(res.data.data || []);
        } else {
          setError("Failed to fetch campaigns");
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
        setError(err.response?.data?.message || "Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [userId]);


  /* ================= FILTER LOGIC ================= */
  const pendingCampaigns = campaigns.filter(
    (c) => c.adminApprovalStatus === "pending"
  );

  const currentCampaigns = campaigns.filter(
    (c) => c.adminApprovalStatus === "approved"
  );

  const rejectedCampaigns = campaigns.filter(
    (c) => c.adminApprovalStatus === "rejected"
  );

  const dataMap = {
    Pending: pendingCampaigns,
    Current: currentCampaigns,
    Rejected: rejectedCampaigns
  };

  const campaignCounts = {
    pending: pendingCampaigns.length,
    approved: currentCampaigns.length,
    rejected: rejectedCampaigns.length
  };

  const totalStats = campaigns.reduce(
    (acc, campaign) => {
      const stats = campaign.stats || {};
      return {
        impressions: acc.impressions + (stats.impressions || 0),
        clicks: acc.clicks + (stats.clicks || 0),
        conversions: acc.conversions + (stats.conversions || 0),
        faqAttempts: acc.faqAttempts + (stats.faqAttempts || 0),
        faqCompletions: acc.faqCompletions + (stats.faqCompletions || 0)
      };
    },
    { impressions: 0, clicks: 0, conversions: 0, faqAttempts: 0, faqCompletions: 0 }
  );



  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div>
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-64 mb-4"></div>
              <div className="flex flex-wrap gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 w-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-xl w-24"></div>
                ))}
              </div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-4 sm:p-5">
                  <div className="h-36 sm:h-40 md:h-44 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Campaigns</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                My Campaigns
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track all your campaigns in one place
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm border">
              {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* STATS SUMMARY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <StatSummary label="Total" value={campaigns.length} icon="📊" />
            <StatSummary label="Active" value={campaignCounts.approved} icon="✅" color="green" />
            <StatSummary label="Pending" value={campaignCounts.pending} icon="⏳" color="yellow" />
            {/* <StatSummary label="Impressions" value={totalStats.impressions} icon="👁️" color="blue" /> */}
            <StatSummary label="Clicks" value={totalStats.clicks} icon="🖱️" color="purple" />
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-1 sm:p-2 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => {
              const count = campaignCounts[tab.countKey];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium sm:font-semibold transition-all duration-300 ease-out flex-1 min-w-[100px] sm:min-w-0 sm:flex-none
                    ${activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        {dataMap[activeTab].length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No campaigns found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                {activeTab === "Pending"
                  ? "You don't have any pending campaigns at the moment."
                  : activeTab === "Current"
                    ? "Start your first campaign to see it here."
                    : "No rejected campaigns. Keep up the good work!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {dataMap[activeTab].map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= MODERN CAMPAIGN CARD ================= */

const CampaignCard = ({ campaign }) => {
  const pkg = campaign.purchasedPackage || {};
  const stats = campaign.stats || {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    faqAttempts: 0,
    faqCompletions: 0,
    totalTimeSpent: 0,
    uniqueViews: 0
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-100">
      {/* IMAGE/VIDEO SECTION */}
      <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {campaign.media?.[0]?.url ? (
          <>
            {campaign.media[0].type === "video" ||
              campaign.media[0].url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              /* ---------- VIDEO ---------- */
              <div className="relative w-full h-full">
                <video
                  src={campaign.media[0].url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Video
                </div>
              </div>
            ) : (
              /* ---------- IMAGE ---------- */
              <img
                src={campaign.media[0].url}
                alt={campaign.fullName || "Campaign"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          /* ---------- NO MEDIA ---------- */
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-3">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 mb-2"
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
            <span className="text-xs sm:text-sm font-medium">No Media</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={campaign.adminApprovalStatus} />
        </div>

        {/* Payment Status */}
        {pkg.paymentStatus && (
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold 
              ${pkg.paymentStatus === "completed" ? "bg-green-500/90 text-white" :
                pkg.paymentStatus === "pending" ? "bg-yellow-500/90 text-white" :
                  "bg-red-500/90 text-white"}`}>
              {pkg.paymentStatus === "completed" ? "Paid" :
                pkg.paymentStatus === "pending" ? "Pending" : "Failed"}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 md:p-5">
        {/* TITLE & DATE */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {campaign.fullName || "Untitled Campaign"}
          </h3>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(campaign.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </div>
        </div>

        {/* PACKAGE & PAYMENT INFO */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">Package</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2 max-w-[50%]">
              {pkg.packageName || "Not Purchased"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">Amount</span>
            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              ₹{pkg.price ? pkg.price.toLocaleString() : 0}
            </span>
          </div>
          {campaign.adminNotes && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <span className="font-medium">Admin Note:</span> {campaign.adminNotes}
              </p>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Performance</h4>
            <span className="text-xs text-gray-500">{campaign.faqs?.length || 0} FAQ{campaign.faqs?.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <CompactStat
              label="Users Time Spent"
              value={formatTime(stats.totalTimeSpent)}
              color="blue"
            />
            <CompactStat label="Clicks" value={stats.clicks} color="green" />
            <CompactStat label="FAQs" value={stats.faqAttempts} color="purple" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const StatSummary = ({ label, value, icon, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg sm:rounded-xl p-2 sm:p-3 border flex items-center gap-2 sm:gap-3`}>
      <span className="text-base sm:text-lg">{icon}</span>
      <div>
        <p className="text-lg sm:text-xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </div>
  );
};

const CompactStat = ({ label, value, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700"
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-2`}>
      <p className="text-xs font-medium opacity-75 truncate">{label}</p>
      <p className="text-sm sm:text-base font-bold">{value.toLocaleString()}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "bg-gradient-to-r from-yellow-100 to-yellow-50",
      text: "text-yellow-800",
      border: "border border-yellow-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    approved: {
      bg: "bg-gradient-to-r from-green-100 to-green-50",
      text: "text-green-800",
      border: "border border-green-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    rejected: {
      bg: "bg-gradient-to-r from-red-100 to-red-50",
      text: "text-red-800",
      border: "border border-red-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border border-gray-200"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      {config.icon}
      {status?.toUpperCase() || "UNKNOWN"}
    </span>
  );
};

export default MyCampaigns;