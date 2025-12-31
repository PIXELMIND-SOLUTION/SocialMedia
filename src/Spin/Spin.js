import React, { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";

const Spin = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [canvasSize, setCanvasSize] = useState(350);
  const [segments, setSegments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [walletAnimation, setWalletAnimation] = useState(false);
  const [walletCoins, setWalletCoins] = useState(0);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [coinsAnimation, setCoinsAnimation] = useState([]);
  const canvasRef = useRef(null);
  const coinContainerRef = useRef(null);

  // Store user data in memory instead of sessionStorage
  const [userData] = useState(() => {
    // Try to get from sessionStorage if available, otherwise use demo user
    try {
      const stored = typeof window !== 'undefined' && window.sessionStorage 
        ? window.sessionStorage.getItem('userData') 
        : null;
      return stored ? JSON.parse(stored) : { userId: "demo-user-123" };
    } catch (e) {
      return { userId: "demo-user-123" };
    }
  });
  const userId = userData?.userId;

  // Color gradient mapping for segments
  const gradientColors = [
    ["#11A85F", "#11A85F"], // 1 Coin
    ["#0D83C6", "#0D83C6"], // 2 Coins
    ["#D24495", "#D24495"], // 3 Coins
    ["#F9A23B", "#F9A23B"], // 4 Coins
    ["#FFFFFF", "#FFFFFF"], // Better Luck / Spin Again
    ["#4DAE6E", "#4DAE6E"], // 5 Coins
    ["#F56C54", "#F56C54"], // 1 Coin (duplicate)
    ["#F9A23B", "#F9A23B"], // 2 Coins (duplicate)
  ];

  // Calculate countdown until midnight
  const calculateCountdown = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if it's past midnight to reset spins
  useEffect(() => {
    const updateCountdown = () => {
      const countdownStr = calculateCountdown();
      setCountdown(countdownStr);
      
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        resetWheel();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`https://apisocial.atozkeysolution.com/api/wallet/${userId}`);
      const data = await response.json();
      if (data.success) {
        setWalletData(data.data);
        setWalletCoins(data.data.coins || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Fetch wheel segments from API
  useEffect(() => {
    const fetchWheelData = async () => {
      try {
        const response = await fetch('https://apisocial.atozkeysolution.com/api/wheel');
        const data = await response.json();
        if (data.success) {
          const segmentsData = data.data
            .sort((a, b) => a.position - b.position)
            .map((item, index) => ({
              ...item,
              gradient: gradientColors[index] || ["#999999", "#999999"],
              value: item.label,
              label: item.label
            }));
          setSegments(segmentsData);
        } else {
          // Fallback to demo segments
          setDemoSegments();
        }
      } catch (error) {
        console.error('Error fetching wheel data:', error);
        setDemoSegments();
      }
    };

    const setDemoSegments = () => {
      const demoSegments = [
        { _id: "1", label: "1 Star", coins: 1, position: 0, isActive: true, spinAgain: false },
        { _id: "2", label: "2 Stars", coins: 2, position: 1, isActive: true, spinAgain: false },
        { _id: "3", label: "3 Stars", coins: 3, position: 2, isActive: true, spinAgain: false },
        { _id: "4", label: "4 Stars", coins: 4, position: 3, isActive: true, spinAgain: false },
        { _id: "5", label: "Better Luck", coins: 0, position: 4, isActive: true, spinAgain: false },
        { _id: "6", label: "5 Stars", coins: 5, position: 5, isActive: true, spinAgain: false },
        { _id: "7", label: "1 Star", coins: 1, position: 6, isActive: true, spinAgain: false },
        { _id: "8", label: "Spin Again", coins: 0, position: 7, isActive: true, spinAgain: true },
      ];
      const segmentsData = demoSegments.map((item, index) => ({
        ...item,
        gradient: gradientColors[index] || ["#999999", "#999999"],
        value: item.label,
      }));
      setSegments(segmentsData);
    };

    fetchWheelData();
  }, []);

  // Fetch user summary and wallet data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch summary
        const summaryResponse = await fetch(`https://apisocial.atozkeysolution.com/api/spin/summary/${userId}`);
        const summaryData = await summaryResponse.json();
        if (summaryData.success) {
          setSummary(summaryData.data);
        } else {
          setFallbackSummary();
        }
        
        // Fetch wallet data
        await fetchWalletData();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFallbackSummary();
      } finally {
        setLoading(false);
      }
    };

    const setFallbackSummary = () => {
      setSummary({
        yourCoins: 0,
        todayRewards: [],
        spinsUsed: 0,
        spinsLeft: 2,
        nextSpin: "2 spins available",
        mostCommonReward: null,
        friendsRecentSpins: [
          { name: "Vijay", reward: "3 Stars", coins: 3, timeAgo: "Last spin" },
          { name: "Priya", reward: "Better Luck", coins: 0, timeAgo: "10 mins ago" },
          { name: "Rahul", reward: "2 Stars", coins: 2, timeAgo: "15 mins ago" },
          { name: "Anjali", reward: "5 Stars", coins: 5, timeAgo: "20 mins ago" },
          { name: "Karthik", reward: "1 Star", coins: 1, timeAgo: "25 mins ago" },
          { name: "Sneha", reward: "4 Stars", coins: 4, timeAgo: "30 mins ago" },
        ]
      });
    };

    fetchUserData();
  }, [userId]);

  // Responsive canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      if (width <= 380) setCanvasSize(220);
      else if (width < 480) setCanvasSize(250);
      else if (width < 640) setCanvasSize(300);
      else setCanvasSize(350);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Draw wheel
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 12;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#D6291E";
    ctx.fill();
    ctx.strokeStyle = "#A00000";
    ctx.lineWidth = 3;
    ctx.stroke();

    const studs = 12;
    for (let i = 0; i < studs; i++) {
      const angle = (i * 360 / studs) * Math.PI / 180;
      const x = centerX + (radius + 6) * Math.cos(angle);
      const y = centerY + (radius + 6) * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD43B";
      ctx.fill();
      ctx.strokeStyle = "#B8860B";
      ctx.stroke();
    }

    if (segments.length === 0) return;

    const segmentAngle = (2 * Math.PI) / segments.length;

    segments.forEach((segment, index) => {
      const startAngle = segmentAngle * index;
      const endAngle = segmentAngle * (index + 1);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.gradient[0];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.fillStyle = segment.gradient[0] === "#FFFFFF" ? "#000" : "#fff";
      ctx.font = `${canvasSize <= 280 ? "10px" : "12px"} bold sans-serif`;
      ctx.textAlign = "right";
      const label = segment.label.length > 10 ? segment.label.substring(0, 10) + "..." : segment.label;
      ctx.fillText(label, radius - 15, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = "#D6A33A";
    ctx.fill();
    ctx.strokeStyle = "#8B6A23";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Create coin animation elements
  const createCoinAnimation = (coins) => {
    const coinsArray = [];
    for (let i = 0; i < Math.min(coins, 20); i++) {
      coinsArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: 20 + Math.random() * 15
      });
    }
    setCoinsAnimation(coinsArray);
    
    setTimeout(() => {
      setCoinsAnimation([]);
    }, 2000);
  };

  // Wallet credit animation with flying coins
  const animateWalletCredit = (coins) => {
    setWalletAnimation(true);
    createCoinAnimation(coins);
    
    let current = walletCoins;
    const target = walletCoins + coins;
    const duration = 1500;
    const increment = (target - current) / (duration / 16);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        setTimeout(() => {
          setWalletAnimation(false);
        }, 500);
      }
      setWalletCoins(Math.round(current));
    }, 16);
  };

  // Fixed: Calculate which segment the arrow points to after rotation
  const calculateWinningSegmentIndex = (finalRotation) => {
    if (segments.length === 0) return 0;
    
    // Normalize rotation to 0-360
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // The arrow points UP (at 270 degrees in standard coordinate system)
    const segmentAngle = 360 / segments.length;
    
    // Arrow is at top, calculate which segment is there
    const arrowAngle = 270;
    const totalAngle = (arrowAngle - normalizedRotation + 360) % 360;
    
    let winningIndex = Math.floor(totalAngle / segmentAngle);
    winningIndex = (winningIndex + segments.length) % segments.length;
    
    return winningIndex;
  };

  // Fixed: Calculate exact rotation to land on a specific segment
  const calculateRotationForSegment = (segmentIndex) => {
    if (segments.length === 0) return 0;
    
    const segmentAngle = 360 / segments.length;
    
    // The arrow is at 270° (top of wheel)
    // We want the CENTER of the selected segment to align with the arrow
    const segmentCenterAngle = (segmentIndex * segmentAngle) + (segmentAngle / 2);
    
    // Calculate rotation needed
    const targetRotation = (270 - segmentCenterAngle + 360) % 360;
    
    // Add multiple full rotations for effect
    const fullRotations = 5 * 360;
    
    return fullRotations + targetRotation;
  };

  // Function to select a random spin slot ID
  const getRandomSpinSlotId = () => {
    if (segments.length === 0) return null;
    
    const eligibleSegments = segments.filter(segment => segment.isActive !== false);
    
    if (eligibleSegments.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * eligibleSegments.length);
    return eligibleSegments[randomIndex]._id;
  };

  // Spin wheel with API integration
  const spinWheel = async () => {
    if (spinning || hasSpun || !userId) return;

    setSpinning(true);
    setSelectedItem(null);

    try {
      // Get a random spin slot ID
      const spinSlotId = getRandomSpinSlotId();
      
      if (!spinSlotId) {
        throw new Error("No valid spin slots available");
      }

      // Make spin API call
      const response = await fetch('https://apisocial.atozkeysolution.com/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          spinSlotId: spinSlotId
        })
      });

      const data = await response.json();

      if (data.success) {
        const result = data.data;
        
        // Find the selected segment
        const selectedSegment = segments.find(segment => segment._id === spinSlotId);
        
        if (!selectedSegment) {
          throw new Error("Selected segment not found");
        }
        
        // Find the index of the selected segment
        const segmentIndex = segments.findIndex(seg => seg._id === spinSlotId);
        
        if (segmentIndex === -1) {
          throw new Error("Segment index not found");
        }
        
        // Calculate the exact rotation to land on this segment
        const targetRotation = calculateRotationForSegment(segmentIndex);
        const newRotation = rotation + targetRotation;
        
        // Apply rotation with CSS transition
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.style.transition = "transform 4000ms cubic-bezier(0.1, 0.7, 0.1, 1)";
          canvas.style.transform = `rotate(${newRotation}deg)`;
        }
        
        // Update rotation state
        setRotation(newRotation);

        setTimeout(() => {
          // Verify the winning segment
          const verifyIndex = calculateWinningSegmentIndex(newRotation);
          const verifySegment = segments[verifyIndex];
          
          console.log("Target segment:", selectedSegment.label, "at index", segmentIndex);
          console.log("Actual segment:", verifySegment?.label, "at index", verifyIndex);
          
          // Set the selected item
          setSelectedItem({
            ...selectedSegment,
            coins: result.coinsWon || selectedSegment.coins || 0,
            spinAgain: selectedSegment.spinAgain || false
          });
          
          // Animate wallet credit if coins won
          if (result.coinsWon > 0) {
            animateWalletCredit(result.coinsWon);
            setWalletCoins(result.walletCoins || walletCoins + result.coinsWon);
          }
          
          setHasSpun(true);
          setSpinning(false);
          
          // Refresh wallet and summary data
          fetchWalletData();
          if (userId) {
            fetch(`https://apisocial.atozkeysolution.com/api/spin/summary/${userId}`)
              .then(res => res.json())
              .then(res => {
                if (res.success) {
                  setSummary(res.data);
                }
              })
              .catch(err => console.error('Error refreshing summary:', err));
          }
          
        }, 4000);
      } else {
        throw new Error(data.message || "Spin failed");
      }
    } catch (error) {
      console.error('Error spinning wheel:', error);
      
      // Fallback: select a random segment and animate to it
      const fallbackIndex = Math.floor(Math.random() * segments.length);
      const fallbackSegment = segments[fallbackIndex];
      const targetRotation = calculateRotationForSegment(fallbackIndex);
      const newRotation = rotation + targetRotation;
      
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transition = "transform 4000ms cubic-bezier(0.1, 0.7, 0.1, 1)";
        canvas.style.transform = `rotate(${newRotation}deg)`;
      }
      
      setRotation(newRotation);

      setTimeout(() => {
        setSelectedItem({
          ...fallbackSegment,
          coins: fallbackSegment.coins || 0,
          spinAgain: fallbackSegment.spinAgain || false
        });
        
        if (fallbackSegment.coins > 0) {
          animateWalletCredit(fallbackSegment.coins);
        }
        
        setHasSpun(true);
        setSpinning(false);
      }, 4000);
    }
  };

  const resetWheel = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = "none";
      canvas.style.transform = `rotate(${rotation}deg)`;
      
      void canvas.offsetHeight;
      
      canvas.style.transition = "transform 1000ms ease-out";
      canvas.style.transform = "rotate(0deg)";
    }
    
    setTimeout(() => {
      setRotation(0);
      setHasSpun(false);
      setSelectedItem(null);
    }, 100);
  };

  // Draw wheel when segments or canvas size changes
  useEffect(() => {
    if (segments.length > 0) {
      drawWheel();
    }
  }, [segments, canvasSize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff7ec] to-[#fef3d7] flex items-center justify-center">
        <div className="text-xl font-bold text-gray-900">Loading Spin Wheel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ec] to-[#fef3d7] p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Spin Wheel
        </h1>

        {/* Flying Coins Animation */}
        {coinsAnimation.length > 0 && (
          <div ref={coinContainerRef} className="fixed inset-0 pointer-events-none z-50">
            {coinsAnimation.map(coin => (
              <div
                key={coin.id}
                className="absolute"
                style={{
                  left: `${coin.left}%`,
                  top: '50%',
                  animation: `coinFloat 2s ease-out forwards`,
                  animationDelay: `${coin.delay}s`,
                  fontSize: `${coin.size}px`
                }}
              >
                🪙
              </div>
            ))}
          </div>
        )}

        {/* Wallet Animation Overlay */}
        {walletAnimation && selectedItem && selectedItem.coins > 0 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-full shadow-2xl animate-ping">
              <div className="text-3xl font-bold text-center">+{selectedItem.coins}</div>
              <div className="text-lg text-center">Stars Added! 💰</div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT SIDE: WHEEL */}
          <div className="lg:w-2/5 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-[420px]">
              {/* Wallet Balance */}
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-2 border-yellow-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Your Wallet Balance</div>
                    <div className={`text-3xl font-bold ${walletAnimation ? 'text-green-600 animate-bounce' : 'text-gray-900'}`}>
                      {walletCoins} Stars
                    </div>
                  </div>
                  <div className={`text-4xl w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center ${walletAnimation ? 'animate-spin' : ''}`}>
                    <Star className="text-white" size={20} />
                  </div>
                </div>
                
                {/* Reset Timer */}
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-blue-700">Next spin resets in:</div>
                    <div className="font-mono font-bold text-blue-800 text-sm">
                      {countdown}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pointer */}
              <div className="flex justify-center mb-[-12px] z-10 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500"></div>
                <div
                  className="w-0 h-0 border-l-[25px] border-r-[25px] border-t-[45px]
                  border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-lg"
                ></div>
              </div>

              {/* Wheel & Button */}
              <div className="relative w-full aspect-square">
                <canvas
                  ref={canvasRef}
                  width={canvasSize}
                  height={canvasSize}
                  style={{
                    width: "100%",
                    height: "100%",
                    filter: spinning ? "blur(0.5px)" : "none"
                  }}
                />

                {/* SPIN Button */}
                <button
                  onClick={spinWheel}
                  disabled={spinning || hasSpun || !userId || (summary?.spinsLeft === 0)}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[70px] h-[70px] rounded-full text-white font-bold border-4 border-yellow-300 shadow-2xl
                  transition-all duration-300
                  ${spinning || hasSpun || !userId || summary?.spinsLeft === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-yellow-500 to-yellow-600 hover:scale-105 active:scale-95 animate-pulse hover:shadow-yellow-300/50"
                    }`}
                >
                  {spinning ? (
                    <div className="animate-spin">⟳</div>
                  ) : summary?.spinsLeft === 0 ? (
                    "0 LEFT"
                  ) : (
                    "SPIN"
                  )}
                </button>
              </div>

              {/* Stand */}
              <div className="mx-auto mt-[-4px] w-[50%] h-[40px] bg-gradient-to-b from-red-600 to-red-700 rounded-t-full shadow-lg"></div>
              <div className="mx-auto w-[70%] h-[15px] bg-red-800 rounded-b-lg shadow"></div>

              

              {/* Reset Button */}
              <button
                onClick={resetWheel}
                disabled={!hasSpun || summary?.spinsLeft === 0}
                className={`mt-4 w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-300
                ${!hasSpun || summary?.spinsLeft === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-[1.02] hover:shadow-red-500/30 active:scale-95"
                  }`}
              >
                {summary?.spinsLeft === 0 ? 
                  `🕐 Next spin: ${countdown}` : 
                  hasSpun ? "Reset Wheel" : "Spin to see results"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: SUMMARY & FRIENDS LIST */}
          <div className="lg:w-3/5">
            {/* Summary */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                📊 Today's Summary
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Resets in: {countdown}
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-xl border border-yellow-200">
                  <div className="text-xs text-gray-600">Your Spin</div>
                  <div className="font-bold text-yellow-700 text-lg">
                    {selectedItem?.label || "Not yet"}
                  </div>
                  {selectedItem?.coins > 0 && (
                    <div className="text-xs text-green-600 mt-1">+{selectedItem.coins} Stars</div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                  <div className="text-xs text-gray-600">Spins Left</div>
                  <div className="font-bold text-blue-700 text-lg">
                    {summary?.spinsLeft ?? 2}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Today</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                  <div className="text-xs text-gray-600">Total Won</div>
                  <div className="font-bold text-green-700 text-lg">
                    {summary?.todayRewards?.reduce((sum, r) => sum + (r.coins || 0), 0) || 0} Stars
                  </div>
                  <div className="text-xs text-green-600 mt-1">Today</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                  <div className="text-xs text-gray-600">Next Spin</div>
                  <div className="font-bold text-purple-700 text-lg">
                    {summary?.spinsLeft === 0 ? "Tomorrow" : "Now"}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {summary?.spinsLeft === 0 ? "00:00" : "Available"}
                  </div>
                </div>
              </div>
            </div>

            {/* Friends' Recent Spins */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mt-4">
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                👥 Friends' Recent Spins
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  Live Updates
                </span>
              </h2>

              <div className="max-h-[350px] overflow-y-auto space-y-2">
                {summary?.friendsRecentSpins?.map((friend, index) => {
                  const avatarColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"];
                  const colorIndex = index % avatarColors.length;
                  const wonCoins = friend.coins > 0;
                  
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg shadow"
                            style={{ background: avatarColors[colorIndex] }}
                          >
                            {friend.name ? friend.name[0] : 'F'}
                          </div>
                          {wonCoins && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="text-xs">🪙</div>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-900">{friend.name || `Friend ${index + 1}`}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>🕐</span>
                            <span>{friend.timeAgo || "Recently"}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`font-bold text-lg ${wonCoins ? 'text-green-600' : 'text-gray-500'} flex items-center gap-1`}>
                        {wonCoins && <span className="text-sm">+</span>}
                        {friend.reward || "No reward"}
                      </div>
                    </div>
                  );
                })}

                {(!summary?.friendsRecentSpins || summary.friendsRecentSpins.length === 0) && (
                  <div className="text-center p-6 text-gray-500 border border-dashed border-gray-300 rounded-xl">
                    <div className="text-4xl mb-2">👥</div>
                    <div>No friends have spun yet</div>
                    <div className="text-sm mt-1">Be the first to spin!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes coinFloat {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 100px), var(--ty, -100px)) scale(0.5) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spin;