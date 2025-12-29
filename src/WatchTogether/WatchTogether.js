import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WatchTogether = () => {
  const [mode, setMode] = useState(null);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔗 API URLs
  const CREATE_ROOM_API = "http://31.97.206.144:5002/api/room-create";
  const JOIN_ROOM_API = "http://31.97.206.144:5002/api/room-join";

  // 👤 Get userId from storage (adjust key if needed)
   const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser.userId;

  const handleEnter = async () => {
    if (!userName.trim()) return alert("Enter your name!");
    if (!userId) return alert("User not logged in!");

    setLoading(true);

    try {
      // ================= CREATE ROOM =================
      if (mode === "create") {
        const res = await axios.post(CREATE_ROOM_API, { userId });

        const createdRoomId = res.data?.data?.roomId;
        if (!createdRoomId) throw new Error("Room ID not received");

        navigate(`/watch/${createdRoomId}`, {
          state: { userName, roomId: createdRoomId },
        });
      }

      // ================= JOIN ROOM =================
      if (mode === "join") {
        if (!roomId.trim()) return alert("Enter room ID!");

        await axios.post(JOIN_ROOM_API, {
          roomId: roomId.trim(),
          userId,
        });

        navigate(`/watch/${roomId.trim()}`, {
          state: { userName, roomId: roomId.trim() },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: 'url("/watch.png")' }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="relative z-10 mb-6 w-40 drop-shadow-lg rounded-full"
      />

      {/* Card */}
      <div className="relative bg-white/95 p-8 rounded-2xl shadow-2xl max-w-md w-full z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Watch Together
        </h1>

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => setMode("create")}
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 w-full rounded-lg font-semibold shadow-md"
            >
              Create Room
            </button>

            <button
              onClick={() => setMode("join")}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 w-full rounded-lg font-semibold shadow-md"
            >
              Join Room
            </button>
          </div>
        )}

        {mode && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />

            {mode === "join" && (
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border p-3 rounded-lg w-full"
              />
            )}

            <button
              onClick={handleEnter}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white p-3 w-full rounded-lg font-semibold shadow-md"
            >
              {loading
                ? "Please wait..."
                : mode === "create"
                ? "Create & Enter"
                : "Join Room"}
            </button>

            <button
              onClick={() => {
                setMode(null);
                setRoomId("");
                setUserName("");
              }}
              className="text-orange-600 underline w-full text-center block"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchTogether;
