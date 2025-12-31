import React, { useEffect, useState, useRef } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Send, 
  Smile,
  X,
  CheckCircle,
  Loader2
} from "lucide-react";

const PostScreen = ({
  handleBack,
  handleNext,
  selectedImages,
  currentImageId,
  postText,
  setPostText,
  location,
  setLocation,
  hideEngagement,
  setHideEngagement,
  commentsOff,
  setCommentsOff,
  getCurrentImageFilter,
  cropRatio,
}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showPostingModal, setShowPostingModal] = useState(false);
  const [postStatus, setPostStatus] = useState(''); // '', 'posting', 'success', 'error'
  const [emojiSearch, setEmojiSearch] = useState("");

  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const postingTimeoutRef = useRef(null);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const currentUserId = userData?.userId;

  // Sync preview index with prop
  useEffect(() => {
    setCurrentPreviewIndex(currentImageId || 0);
  }, [currentImageId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (postingTimeoutRef.current) {
        clearTimeout(postingTimeoutRef.current);
      }
    };
  }, []);

  const currentItem = selectedImages[currentPreviewIndex];
  const displayFilter = currentItem?.type === "image" ? getCurrentImageFilter() : "none";

  const getAspectStyle = () => {
    const baseStyle = {
      width: '100%',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '50vh',
      objectFit: 'contain',
    };

    if (currentItem?.type === "image") {
      const itemCropRatio = currentItem.cropRatio || cropRatio;
      const ratioMap = {
        "1:1": { aspect: "1/1", maxW: "100%", maxH: "320px" },
        "3:4": { aspect: "3/4", maxW: "240px", maxH: "320px" },
        "4:3": { aspect: "4/3", maxW: "100%", maxH: "240px" },
        "4:5": { aspect: "4/5", maxW: "256px", maxH: "320px" },
        "5:4": { aspect: "5/4", maxW: "100%", maxH: "256px" },
        "9:16": { aspect: "9/16", maxW: "180px", maxH: "320px" },
        "16:9": { aspect: "16/9", maxW: "100%", maxH: "180px" },
        "original": { aspect: currentItem.originalAspect, maxW: "100%", maxH: "50vh" },
      };

      const { aspect, maxW, maxH } = ratioMap[itemCropRatio] || ratioMap["1:1"];
      return {
        ...baseStyle,
        aspectRatio: aspect,
        maxWidth: maxW,
        maxHeight: maxH,
        width: 'auto',
      };
    }

    if (currentItem?.type === "video") {
      return { ...baseStyle, aspectRatio: "16/9", maxHeight: "180px" };
    }

    return baseStyle;
  };

  const aspectStyle = getAspectStyle();

  const handleNextPreview = () => {
    if (currentPreviewIndex < selectedImages.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    }
  };

  const handlePrevPreview = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  const emojiCategories = [
    { name: "Smileys & People", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓"] },
    { name: "Animals & Nature", emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄"] },
    { name: "Food & Drink", emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠"] },
    { name: "Activities", emojis: ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳️", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷"] },
    { name: "Travel & Places", emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍", "🛺", "🚲", "🛴", "🚂", "✈️", "🛩", "🚀", "🛸", "🚁", "🛶", "⛵️", "🚤", "🛥", "🛳"] },
    { name: "Objects", emojis: ["💎", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🎮", "👾", "🔋", "🔌", "💡", "🔦", "🕯", "🧯", "🛢", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "🧸", "🪆", "🛍", "🎁"] },
    { name: "Symbols", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️"] },
  ];

  const filteredCategories = emojiCategories.map(cat => ({
    ...cat,
    emojis: cat.emojis.filter(emoji =>
      emojiSearch === "" || 
      cat.name.toLowerCase().includes(emojiSearch.toLowerCase()) ||
      emoji.toLowerCase().includes(emojiSearch.toLowerCase())
    )
  })).filter(cat => cat.emojis.length > 0);

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = postText.substring(0, start) + emoji + postText.substring(end);
    setPostText(text);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
    setShowEmojiPicker(false);
  };

  const handlePostSubmit = async () => {
    setIsPosting(true);
    setPostStatus('posting');
    setShowPostingModal(true);
    
    try {
      // Call the handleNext function to actually post
      await handleNext();
      
      // Simulate posting process (you can remove this if handleNext already handles timing)
      setPostStatus('success');
      
      // Show success for 1.5 seconds then navigate
      postingTimeoutRef.current = setTimeout(() => {
        setShowPostingModal(false);
        setIsPosting(false);
        setPostStatus('');
      }, 3000);
      
    } catch (err) {
      console.error("Post submission error:", err);
      setPostStatus('error');
      
      // Show error for 2 seconds then allow retry
      postingTimeoutRef.current = setTimeout(() => {
        setShowPostingModal(false);
        setIsPosting(false);
        setPostStatus('');
      }, 2000);
    }
  };

  const handleClosePostingModal = () => {
    if (postStatus === 'posting') {
      // Don't allow closing while posting
      return;
    }
    setShowPostingModal(false);
    setIsPosting(false);
    setPostStatus('');
    
    if (postingTimeoutRef.current) {
      clearTimeout(postingTimeoutRef.current);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUserId) {
          setLoading(false);
          return;
        }
        const res = await fetch(`https://apisocial.atozkeysolution.com/api/profiles/${currentUserId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProfileData(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUserId]);

  const profileImage = profileData?.profile?.image;
  const firstLetter = profileData?.profile?.firstName?.charAt(0)?.toUpperCase() || "U";
  const fullName = profileData?.profile?.firstName
    ? `${profileData.profile.firstName} ${profileData.profile.lastName || ""}`
    : "User";
  const username = profileData?.profile?.username || fullName;

  // Determine if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-4 sm:p-6 flex items-start justify-center pt-6">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <button
              onClick={handleBack}
              disabled={isPosting}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold">Create new post</h2>
            <button
              onClick={handlePostSubmit}
              disabled={isPosting}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-colors flex items-center gap-1 sm:gap-2"
            >
              {isPosting ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                "Post Now"
              )}
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {/* Profile */}
            <div className="flex items-center mb-4 sm:mb-6">
              {loading ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse" />
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt={username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                  {firstLetter}
                </div>
              )}
              <span className="ml-2 sm:ml-3 font-medium text-gray-900 text-sm sm:text-base">
                {username}
              </span>
            </div>

            {/* Media Preview */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative w-full max-w-xs sm:max-w-md">
                {currentItem ? (
                  currentItem.type === "image" ? (
                    <div className="relative bg-gray-100 rounded-lg shadow overflow-hidden">
                      <img
                        key={`post-preview-${currentItem.id}-${currentPreviewIndex}`}
                        src={currentItem.url}
                        alt="Post preview"
                        className="mx-auto"
                        style={aspectStyle}
                        onError={(e) => {
                          if (currentItem.originalUrl && currentItem.originalUrl !== currentItem.url) {
                            e.target.src = currentItem.originalUrl;
                          } else {
                            e.target.src = "/assets/images/placeholder.jpg";
                          }
                        }}
                      />
                      {displayFilter !== "none" && (
                        <>
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              mixBlendMode: 'multiply',
                              filter: displayFilter,
                              opacity: 0.7
                            }}
                          />
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-black bg-opacity-50 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded">
                            Filtered
                          </div>
                        </>
                      )}
                      {currentItem.cropRatio && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-50 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded">
                          {currentItem.cropRatio === "original" ? "Original" : currentItem.cropRatio}
                        </div>
                      )}
                    </div>
                  ) : (
                    <video
                      key={`post-video-${currentItem.id}-${currentPreviewIndex}`}
                      src={currentItem.url}
                      className="rounded-lg shadow bg-black"
                      style={aspectStyle}
                      controls
                      muted
                      playsInline
                    />
                  )
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No media selected</span>
                  </div>
                )}

                {selectedImages.length > 1 && (
                  <>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-50 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1">
                      <span className="text-white text-[10px] sm:text-sm font-medium">
                        {currentPreviewIndex + 1}/{selectedImages.length}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 top-1/2 flex justify-between px-1 sm:px-2">
                      <button
                        onClick={handlePrevPreview}
                        disabled={currentPreviewIndex === 0}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={handleNextPreview}
                        disabled={currentPreviewIndex === selectedImages.length - 1}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {selectedImages.length > 1 && (
              <div className="flex space-x-1.5 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
                {selectedImages.map((img, idx) => (
                  <div key={img.id} className="relative flex-shrink-0">
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-md border-2 ${
                        idx === currentPreviewIndex ? "border-orange-500" : "border-gray-300"
                      }`}
                      onClick={() => setCurrentPreviewIndex(idx)}
                    />
                    {img.type === "video" && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 border-r-0 border-l border-t border-b border-white transform translate-x-px rotate-45" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Caption with Emoji Picker */}
            <div className="mb-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full p-3 sm:p-4 pr-10 sm:pr-12 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  maxLength={2000}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 p-1 text-gray-500 hover:text-orange-500 rounded-full"
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Emoji Picker Modal */}
                {showEmojiPicker && (
                  <div 
                    ref={emojiPickerRef}
                    className={`z-40 rounded-xl shadow-2xl border border-gray-200 bg-white ${
                      isMobile 
                        ? 'fixed bottom-0 left-0 right-0 w-full max-h-[50vh]' 
                        : 'absolute top-full right-0 w-80 max-h-[40vh] mt-1'
                    } overflow-hidden`}
                  >
                    <div className="p-2.5 sm:p-3 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 text-sm">Emojis</h4>
                      <button 
                        onClick={() => setShowEmojiPicker(false)} 
                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      placeholder="Search emojis..."
                      className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 border-b border-gray-100"
                    />

                    <div 
                      className="overflow-y-auto p-2.5 sm:p-3"
                      style={{ maxHeight: isMobile ? 'calc(50vh - 100px)' : 'calc(40vh - 100px)' }}
                    >
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, idx) => (
                          <div key={idx} className="mb-3 last:mb-0">
                            <h5 className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                              {category.name}
                            </h5>
                            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5">
                              {category.emojis.map((emoji, i) => (
                                <button
                                  key={i}
                                  onClick={() => addEmoji(emoji)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                                  aria-label={`Add ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 text-sm py-4">No emojis found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-gray-400">{postText.length}/2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posting Modal */}
      {showPostingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              {postStatus === 'posting' && (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <Loader2 className="w-full h-full text-orange-500 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Posting...</h3>
                  <p className="text-gray-600 mb-4">Your post is being uploaded. Please wait.</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </>
              )}

              {postStatus === 'success' && (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <CheckCircle className="w-full h-full text-green-500" />
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Posted Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your post is now live. Navigating to home...</p>
                </>
              )}

              {postStatus === 'error' && (
                <>
                  <div className="w-16 h-16 mx-auto mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Post</h3>
                  <p className="text-gray-600 mb-6">There was an error posting your content. Please try again.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClosePostingModal}
                      className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePostSubmit}
                      className="flex-1 py-2.5 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Only show close button when not posting */}
            {postStatus !== 'posting' && postStatus !== 'success' && (
              <div className="px-6 pb-6">
                <button
                  onClick={handleClosePostingModal}
                  className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostScreen;