import React, { useState, useRef, useEffect } from "react";

const Spin = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [canvasSize, setCanvasSize] = useState(350);
  const canvasRef = useRef(null);

  // Updated segments
  const segments = [
    { label: "1 Coin", value: "1 Coin", gradient: ["#11A85F", "#11A85F"] },
    { label: "2 Coins", value: "2 Coins", gradient: ["#0D83C6", "#0D83C6"] },
    { label: "3 Coins", value: "3 Coins", gradient: ["#D24495", "#D24495"] },
    { label: "4 Coins", value: "4 Coins", gradient: ["#F9A23B", "#F9A23B"] },
    { label: "Better Luck", value: "Better Luck", gradient: ["#FFFFFF", "#FFFFFF"] },
    { label: "5 Coins", value: "5 Coins", gradient: ["#4DAE6E", "#4DAE6E"] },
    { label: "1 Coin", value: "1 Coin", gradient: ["#F56C54", "#F56C54"] },
    { label: "2 Coins", value: "2 Coins", gradient: ["#F9A23B", "#F9A23B"] }
  ];

  // Friends spins
  const friendsSpins = [
    { name: "Vijay", result: "3 Coins", time: "Last spin", avatarColor: "#6366f1" },
    { name: "Priya", result: "Better Luck", time: "10 mins ago", avatarColor: "#10b981" },
    { name: "Rahul", result: "2 Coins", time: "15 mins ago", avatarColor: "#f59e0b" },
    { name: "Anjali", result: "5 Coins", time: "20 mins ago", avatarColor: "#ef4444" },
    { name: "Karthik", result: "1 Coin", time: "25 mins ago", avatarColor: "#8b5cf6" },
    { name: "Sneha", result: "4 Coins", time: "30 mins ago", avatarColor: "#3b82f6" },
  ];

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
      ctx.fillText(segment.label, radius - 15, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = "#D6A33A";
    ctx.strokeStyle = "#8B6A23";
    ctx.stroke();
  };

  // Spin
  const spinWheel = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setSelectedItem(null);

    const duration = 3000 + Math.random() * 1000;
    const extraRotation = 3600 + Math.random() * 1800;
    const finalRotation = rotation + extraRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      const normalized = finalRotation % 360;
      const segmentAngle = 360 / segments.length;
      const winnerIndex = Math.floor(normalized / segmentAngle);
      setSelectedItem(segments[winnerIndex]);
      setHasSpun(true);
      setSpinning(false);
    }, duration);
  };

  const resetWheel = () => {
    setRotation(0);
    setHasSpun(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    drawWheel();
  }, [segments, canvasSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ec] to-[#fef3d7] p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          🪙 Coin Spin Wheel
        </h1>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* LEFT SIDE: WHEEL */}
          <div className="lg:w-2/5 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-[420px]">

              {/* Pointer */}
              <div className="flex justify-center mb-[-12px] z-10">
                <div
                  className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px]
                  border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"
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
                      ? "transform 4s cubic-bezier(0.23, 1, 0.32, 1)"
                      : "none",
                  }}
                />

                {/* SPIN */}
                <button
                  onClick={spinWheel}
                  disabled={spinning || hasSpun}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[60px] h-[60px] rounded-full text-white font-bold border-4 border-yellow-300 shadow-lg
                  ${spinning || hasSpun
                      ? "bg-gray-400"
                      : "bg-gradient-to-br from-yellow-500 to-yellow-600 hover:scale-95 active:scale-90"
                    }`}
                >
                  {spinning ? "..." : "SPIN"}
                </button>
              </div>

              {/* Stand */}
              <div className="mx-auto mt-[-4px] w-[50%] h-[40px] bg-red-600 rounded-t-full shadow-lg"></div>
              <div className="mx-auto w-[70%] h-[15px] bg-red-700 rounded-b-lg shadow"></div>

              {/* Result */}
              <div className="text-center mt-3">
                {selectedItem ? (
                  <h2 className="text-green-600 font-bold text-lg">
                    {selectedItem.value === "Better Luck"
                      ? "🤞 Better Luck Next Time!"
                      : `🎉 You Won: ${selectedItem.value}!`}
                  </h2>
                ) : (
                  <p className="text-gray-600 text-sm">Tap spin to start</p>
                )}
              </div>

              {/* Reset */}
              <button
                onClick={resetWheel}
                disabled={!hasSpun}
                className={`mt-3 w-full py-2 rounded-lg font-bold shadow
                ${!hasSpun
                    ? "bg-gray-300 text-gray-500"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white"}`}
              >
                Reset for Tomorrow
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: FRIENDS LIST */}
          <div className="lg:w-3/5">
            {/* Summary */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-3">
              <h3 className="font-bold mb-2">🪙 Today's Summary</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-600">Your Spin</div>
                  <div className="font-bold text-yellow-600">
                    {selectedItem?.value || "Not yet"}
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-600">Friends' Total</div>
                  <div className="font-bold text-blue-600">15 Coins</div>
                </div>

                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-600">Most Common</div>
                  <div className="font-bold text-green-600">2 Coins</div>
                </div>

                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-600">Next Spin</div>
                  <div className="font-bold text-purple-600">Tomorrow</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-3 mt-2">
              <h2 className="font-bold text-gray-900 mb-2">👥 Friends' Recent Spins</h2>

              <div className="max-h-[350px] overflow-y-auto space-y-2">
                {friendsSpins.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold"
                        style={{ background: f.avatarColor }}
                      >
                        {f.name[0]}
                      </div>

                      <div>
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-xs text-gray-500">{f.time}</div>
                      </div>
                    </div>

                    <div className={`${f.result === "Better Luck" ? "text-gray-500" : "text-green-600"} font-bold`}>
                      {f.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Spin;
