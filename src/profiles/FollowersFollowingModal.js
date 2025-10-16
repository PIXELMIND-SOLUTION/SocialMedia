import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, UserMinus, UserCheck, Clock } from 'lucide-react';

const FollowersFollowingModal = ({ isOpen, onClose, userId, initialTab = 'followers' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const [userProfiles, setUserProfiles] = useState({});

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = storedUser?.userId;

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      fetchFollowersFollowing();
    }
  }, [isOpen, userId, initialTab]);

  const fetchFollowersFollowing = async () => {
    try {
      setLoading(true);

      // Fetch followers
      const followersResponse = await fetch(`https://social-media-nty4.onrender.com/api/followers/${userId}`);
      const followersData = await followersResponse.json();

      // Fetch following
      const followingResponse = await fetch(`https://social-media-nty4.onrender.com/api/following/${userId}`);
      const followingData = await followingResponse.json();

      if (followersData.success) {
        const followersList = followersData.followers || [];
        const pendingList = followersData.pendingRequests || [];
        
        setFollowers(followersList);
        setPendingRequests(pendingList);

        // Fetch profiles for followers
        await fetchUserProfiles([...followersList, ...pendingList]);
      }

      if (followingData.success) {
        // Remove duplicates from following list
        const uniqueFollowing = Array.from(
          new Map((followingData.following || []).map(user => [user._id, user])).values()
        );
        setFollowing(uniqueFollowing);

        // Fetch profiles for following
        await fetchUserProfiles(uniqueFollowing);
      }

      // Initialize following states - check if current user follows these users
      await initializeFollowingStates([
        ...(followersData.followers || []),
        ...(followingData.following || []),
        ...(followersData.pendingRequests || [])
      ]);

    } catch (err) {
      console.error('Error fetching followers/following:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfiles = async (users) => {
    const profilePromises = users.map(async (user) => {
      if (userProfiles[user._id]) return; // Skip if already fetched

      try {
        const response = await fetch(`https://social-media-nty4.onrender.com/api/profiles/${user._id}`);
        const data = await response.json();

        if (data.success) {
          setUserProfiles(prev => ({
            ...prev,
            [user._id]: data.data
          }));
        }
      } catch (err) {
        console.error(`Error fetching profile for ${user._id}:`, err);
      }
    });

    await Promise.all(profilePromises);
  };

  const initializeFollowingStates = async (users) => {
    // Fetch current user's following list to determine who they follow
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/following/${currentUserId}`);
      const data = await response.json();

      if (data.success) {
        const followingIds = (data.following || []).map(u => u._id);
        const states = {};
        
        users.forEach(user => {
          states[user._id] = followingIds.includes(user._id);
        });
        
        setFollowingStates(states);
      }
    } catch (err) {
      console.error('Error initializing following states:', err);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      // Optimistic update
      const wasFollowing = followingStates[targetUserId];
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !prev[targetUserId]
      }));

      // Send follow request
      const response = await fetch(`https://social-media-nty4.onrender.com/api/send-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetUserId,
          followerId: currentUserId
        })
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on failure
        setFollowingStates(prev => ({
          ...prev,
          [targetUserId]: wasFollowing
        }));
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      // Revert on error
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !prev[targetUserId]
      }));
    }
  };

  const handleApproveRequest = async (requesterId) => {
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/approve-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          requesterId: requesterId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from pending and add to followers
        setPendingRequests(prev => prev.filter(user => user._id !== requesterId));
        
        // Optionally add to followers list
        const approvedUser = pendingRequests.find(user => user._id === requesterId);
        if (approvedUser) {
          setFollowers(prev => [...prev, approvedUser]);
        }

        // Refresh the lists
        fetchFollowersFollowing();
      }
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleRejectRequest = async (followerId) => {
    try {
      const response = await fetch(`https://social-media-nty4.onrender.com/api/reject-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          followerId: followerId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(user => user._id !== followerId));
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const filterUsers = (users) => {
    if (!searchQuery.trim()) return users;
    return users.filter(user => {
      const profile = userProfiles[user._id];
      const username = profile?.profile?.username || '';
      const fullName = profile?.fullName || user.fullName || '';
      
      return username.toLowerCase().includes(searchQuery.toLowerCase()) ||
             fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const getCurrentList = () => {
    if (activeTab === 'followers') {
      return followers;
    } else if (activeTab === 'following') {
      return following;
    } else {
      return pendingRequests;
    }
  };

  const currentList = getCurrentList();
  const filteredUsers = filterUsers(currentList);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="w-8" />
            <h2 className="text-base font-semibold">
              {userId === currentUserId ? 'My ' : ''}
              {activeTab === 'followers' ? 'Followers' : activeTab === 'following' ? 'Following' : 'Pending Requests'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'followers' ? 'text-black' : 'text-gray-400'
              }`}
            >
              {followers.length} Followers
              {activeTab === 'followers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'following' ? 'text-black' : 'text-gray-400'
              }`}
            >
              {following.length} Following
              {activeTab === 'following' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            {userId === currentUserId && pendingRequests.length > 0 && (
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'pending' ? 'text-black' : 'text-gray-400'
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {pendingRequests.length}
                </span>
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">
                {searchQuery ? 'No users found' : `No ${activeTab === 'pending' ? 'pending requests' : activeTab} yet`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  profile={userProfiles[user._id]}
                  isFollowing={followingStates[user._id]}
                  onFollow={() => handleFollow(user._id)}
                  onApprove={() => handleApproveRequest(user._id)}
                  onReject={() => handleRejectRequest(user._id)}
                  isOwnProfile={user._id === currentUserId}
                  isPending={activeTab === 'pending'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user, profile, isFollowing, onFollow, onApprove, onReject, isOwnProfile, isPending }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const profileData = profile?.profile || {};
  const username = profileData.username || 'Unknown';
  const fullName = profile?.fullName || user.fullName || '';
  const profileImage = profileData.image || '';
  const firstName = profileData.firstName || username[0] || 'U';

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove();
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject();
    setIsProcessing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {firstName[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{username}</div>
          {fullName && (
            <div className="text-gray-500 text-xs truncate">{fullName}</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isOwnProfile && (
        <>
          {isPending ? (
            <div className="flex gap-2">
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? '...' : 'Accept'}
              </button>
              <button 
                onClick={handleReject}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-gray-200 text-black text-xs font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? '...' : 'Decline'}
              </button>
            </div>
          ) : (
            <button
              onClick={onFollow}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isFollowing
                  ? 'bg-gray-200 text-black hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? (
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Following
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  Follow
                </span>
              )}
            </button>
          )}
        </>
      )}

      {isOwnProfile && (
        <span className="text-xs text-gray-400 font-medium px-3">You</span>
      )}
    </div>
  );
};

export default FollowersFollowingModal;