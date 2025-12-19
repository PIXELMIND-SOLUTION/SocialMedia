import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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

  // Get user from session storage
  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;

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
      
      // Check if it's past midnight (00:00)
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
      const response = await axios.get(`https://apisocial.atozkeysolution.com/api/wallet/${userId}`);
      if (response.data.success) {
        setWalletData(response.data.data);
        setWalletCoins(response.data.data.coins || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Fetch wheel segments from API
  useEffect(() => {
    const fetchWheelData = async () => {
      try {
        const response = await axios.get('https://apisocial.atozkeysolution.com/api/wheel');
        if (response.data.success) {
          const segmentsData = response.data.data
            .sort((a, b) => a.position - b.position)
            .map((item, index) => ({
              ...item,
              gradient: gradientColors[index] || ["#999999", "#999999"],
              value: item.label,
              label: item.label
            }));
          setSegments(segmentsData);
        }
      } catch (error) {
        console.error('Error fetching wheel data:', error);
        // Fallback to default segments
        setSegments([
          { _id: "1", position: 1, label: "1 Coin", value: "1 Coin", gradient: ["#11A85F", "#11A85F"], coins: 1, spinAgain: false },
          { _id: "2", position: 2, label: "2 Coins", value: "2 Coins", gradient: ["#0D83C6", "#0D83C6"], coins: 2, spinAgain: false },
          { _id: "3", position: 3, label: "3 Coins", value: "3 Coins", gradient: ["#D24495", "#D24495"], coins: 3, spinAgain: false },
          { _id: "4", position: 4, label: "Spin Again", value: "Spin Again", gradient: ["#FFFFFF", "#FFFFFF"], coins: 0, spinAgain: true },
          { _id: "5", position: 5, label: "4 Coins", value: "4 Coins", gradient: ["#F9A23B", "#F9A23B"], coins: 4, spinAgain: false },
          { _id: "6", position: 6, label: "5 Coins", value: "5 Coins", gradient: ["#4DAE6E", "#4DAE6E"], coins: 5, spinAgain: false },
          { _id: "7", position: 7, label: "Better Luck Next Time", value: "Better Luck Next Time", gradient: ["#FFFFFF", "#FFFFFF"], coins: 0, spinAgain: false },
          { _id: "8", position: 8, label: "2 Coins", value: "2 Coins", gradient: ["#F9A23B", "#F9A23B"], coins: 2, spinAgain: false },
        ]);
      }
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
        const summaryResponse = await axios.get(`https://apisocial.atozkeysolution.com/api/spin/summary/${userId}`);
        if (summaryResponse.data.success) {
          setSummary(summaryResponse.data.data);
        }
        
        // Fetch wallet data
        await fetchWalletData();
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback summary data
        setSummary({
          yourCoins: 0,
          todayRewards: [],
          spinsUsed: 0,
          spinsLeft: 2,
          nextSpin: "2 spins available",
          mostCommonReward: null,
          friendsRecentSpins: [
            { name: "Vijay", reward: "3 Coins", coins: 3, timeAgo: "Last spin" },
            { name: "Priya", reward: "Better Luck", coins: 0, timeAgo: "10 mins ago" },
            { name: "Rahul", reward: "2 Coins", coins: 2, timeAgo: "15 mins ago" },
            { name: "Anjali", reward: "5 Coins", coins: 5, timeAgo: "20 mins ago" },
            { name: "Karthik", reward: "1 Coin", coins: 1, timeAgo: "25 mins ago" },
            { name: "Sneha", reward: "4 Coins", coins: 4, timeAgo: "30 mins ago" },
          ]
        });
      } finally {
        setLoading(false);
      }
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
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.fillStyle = segment.gradient[0] === "#FFFFFF" ? "#000" : "#fff";
      ctx.font = `${canvasSize <= 280 ? "10px" : "12px"} bold sans-serif`;
      ctx.textAlign = "right";
      // Truncate long labels
      const label = segment.label.length > 10 ? segment.label.substring(0, 10) + "..." : segment.label;
      ctx.fillText(label, radius - 15, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = "#D6A33A";
    ctx.strokeStyle = "#8B6A23";
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
    
    // Animate wallet count increment
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

  // Calculate winner based on arrow at top (0 degrees)
  const calculateWinner = (finalRotation) => {
    // Normalize rotation to 0-360
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // Arrow is at top (0 degrees), but canvas rotation is clockwise
    // We need to find which segment is at 0 degrees after rotation
    // Since wheel rotates, the segment at 0 degrees is the one that started at (360 - normalizedRotation)
    const segmentAngle = 360 / segments.length;
    
    // Calculate the index of the winning segment
    // The pointer is at 0 degrees, so we need the segment that ends at (360 - normalizedRotation) % 360
    let winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length;
    
    // Adjust for array bounds
    winnerIndex = (winnerIndex + segments.length) % segments.length;
    
    return segments[winnerIndex];
  };

  // Spin wheel
  const spinWheel = async () => {
    if (spinning || hasSpun || !userId) return;

    setSpinning(true);
    setSelectedItem(null);

    try {
      // Make spin API call
      const spinResponse = await axios.post('https://apisocial.atozkeysolution.com/api/spin', {
        userId: userId
      });

      if (spinResponse.data.success) {
        const result = spinResponse.data.data;
        
        // Calculate rotation for animation - end at specific segment
        const duration = 3000 + Math.random() * 1000;
        const extraRotation = 3600 + Math.random() * 1800;
        const finalRotation = rotation + extraRotation;
        
        // Calculate exact rotation to land on winning segment
        const targetSegment = segments.find(seg => 
          seg.coins === result.coins || seg.label === result.reward
        );
        
        let finalRotationAdjusted = finalRotation;
        if (targetSegment) {
          // Calculate exact rotation to land arrow on this segment
          const segmentIndex = segments.indexOf(targetSegment);
          const segmentAngle = 360 / segments.length;
          // Target position: segment should be at top (0 degrees)
          const targetRotation = 360 - (segmentIndex * segmentAngle) - (segmentAngle / 2);
          finalRotationAdjusted = rotation + extraRotation + (targetRotation - (finalRotation % 360));
        }
        
        setRotation(finalRotationAdjusted);

        setTimeout(() => {
          // Calculate winner based on arrow position
          const winner = calculateWinner(finalRotationAdjusted);
          setSelectedItem(winner || {
            label: result.reward,
            value: result.reward,
            coins: result.coins
          });
          
          // Animate wallet credit if coins won
          if (result.coins > 0) {
            animateWalletCredit(result.coins);
          }
          
          setHasSpun(true);
          setSpinning(false);
          
          // Refresh wallet and summary data
          fetchWalletData();
          if (userId) {
            axios.get(`https://apisocial.atozkeysolution.com/api/spin/summary/${userId}`)
              .then(res => {
                if (res.data.success) {
                  setSummary(res.data.data);
                }
              });
          }
        }, duration);
      }
    } catch (error) {
      console.error('Error spinning wheel:', error);
      
      // Fallback animation if API fails
      const duration = 3000 + Math.random() * 1000;
      const extraRotation = 3600 + Math.random() * 1800;
      const finalRotation = rotation + extraRotation;
      setRotation(finalRotation);

      setTimeout(() => {
        const winner = calculateWinner(finalRotation);
        setSelectedItem(winner);
        
        if (winner && winner.coins > 0) {
          animateWalletCredit(winner.coins);
        }
        
        setHasSpun(true);
        setSpinning(false);
      }, duration);
    }
  };

  const resetWheel = () => {
    setRotation(0);
    setHasSpun(false);
    setSelectedItem(null);
  };

  // Draw wheel when segments or canvas size changes
  useEffect(() => {
    if (segments.length > 0) {
      drawWheel();
    }
  }, [segments, canvasSize]);

  // Initial draw
  useEffect(() => {
    const interval = setInterval(() => {
      if (segments.length > 0) {
        drawWheel();
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [segments]);

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
        {/* TITLE */}
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          🪙 Coin Spin Wheel
        </h1>

        {/* Flying Coins Animation */}
        {coinsAnimation.length > 0 && (
          <div ref={coinContainerRef} className="fixed inset-0 pointer-events-none z-50">
            {coinsAnimation.map(coin => (
              <div
                key={coin.id}
                className="absolute animate-coin-float"
                style={{
                  left: `${coin.left}%`,
                  top: '50%',
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
              <div className="text-lg text-center">Coins Added! 💰</div>
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
                      {walletCoins} Coins
                    </div>
                    {/* <div className="text-xs text-gray-500 mt-1">
                      {walletData?.history?.length || 0} transactions
                    </div> */}
                  </div>
                  <div className={`text-4xl ${walletAnimation ? 'animate-spin' : ''}`}>
                    💰
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
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning
                      ? `transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)`
                      : "none",
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
                
                {/* Arrow indicator */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                  <div className="text-2xl">▼</div>
                </div>
              </div>

              {/* Stand */}
              <div className="mx-auto mt-[-4px] w-[50%] h-[40px] bg-gradient-to-b from-red-600 to-red-700 rounded-t-full shadow-lg"></div>
              <div className="mx-auto w-[70%] h-[15px] bg-red-800 rounded-b-lg shadow"></div>

              {/* Result */}
              <div className="text-center mt-4">
                {selectedItem ? (
                  <div className="animate-fade-in">
                    <h2 className={`font-bold text-xl ${selectedItem.coins > 0 ? 'text-green-600' : selectedItem.spinAgain ? 'text-blue-600' : 'text-gray-600'}`}>
                      {selectedItem.coins > 0 
                        ? `🎉 You Won: ${selectedItem.coins} Coins!` 
                        : selectedItem.spinAgain
                        ? "🔄 Spin Again!"
                        : "🤞 Better Luck Next Time!"
                      }
                    </h2>
                    {selectedItem.coins > 0 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-pulse">
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-2xl">🪙</div>
                          <div className="text-green-700 font-semibold">
                            +{selectedItem.coins} coins added to your wallet
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {!userId ? "Please login to spin" : 
                     summary?.spinsLeft === 0 ? `Next spin in ${countdown}` : 
                     `Spins left: ${summary?.spinsLeft ?? 2}`}
                  </p>
                )}
              </div>

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
                    <div className="text-xs text-green-600 mt-1">+{selectedItem.coins} coins</div>
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
                    {summary?.todayRewards?.reduce((sum, r) => sum + (r.coins || 0), 0) || 0} Coins
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
        
        @keyframes coin-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-coin-bounce {
          animation: coin-bounce 0.5s ease-in-out infinite;
        }
        
        @keyframes coin-float {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 100px), var(--ty, -100px)) scale(0.5) rotate(360deg);
          }
        }
        
        .animate-coin-float {
          animation: coin-float 2s ease-out forwards;
          --tx: ${Math.random() * 200 - 100}px;
          --ty: ${Math.random() * -200 - 50}px;
        }
        
        @keyframes spin-wheel {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(var(--rotation, 3600deg));
          }
        }
      `}</style>
    </div>
  );
};

export default Spin;