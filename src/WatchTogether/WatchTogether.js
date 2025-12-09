import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WatchTogether = () => {
  const [mode, setMode] = useState(null);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (!userName.trim()) return alert("Enter your name!");

    const finalId =
      mode === "create"
        ? `atoz_${Math.floor(100000 + Math.random() * 900000)}`
        : roomId.trim();

    if (!finalId) return alert("Enter room ID!");

    navigate(`/watch/${finalId}`, {
      state: { userName, roomId: finalId },
    });
  };

  return (
    <div className="min-h-screen bg-orange-200 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Watch Together</h1>

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => setMode("create")}
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 w-full rounded-lg"
            >
              Create Room
            </button>
            <button
              onClick={() => setMode("join")}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 w-full rounded-lg"
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
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 w-full rounded-lg"
            >
              {mode === "create" ? "Create & Enter" : "Join Room"}
            </button>

            <button
              onClick={() => {
                setMode(null);
                setRoomId("");
                setUserName("");
              }}
              className="text-orange-600 underline w-full"
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
