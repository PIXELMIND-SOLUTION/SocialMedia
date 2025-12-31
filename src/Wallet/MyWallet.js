import { useState, useEffect } from "react";
import { Star, Search, X, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const WalletModal = () => {
  const [starsBalance, setStarsBalance] = useState(0);
  const [walletHistory, setWalletHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [coinsToSend, setCoinsToSend] = useState("");
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/watch") {
      window.location.reload();
    }
  }, [location.pathname]);

  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const userId = storedUser?.userId;

  /* ================= FETCH WALLET ================= */
  const fetchWallet = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `https://apisocial.atozkeysolution.com/api/wallet/${userId}`
      );

      if (res.data?.success) {
        setStarsBalance(res.data.data.coins || 0);
        setWalletHistory(res.data.data.history.slice().reverse() || []);
      }
    } catch (err) {
      console.error("Wallet fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  /* ================= FETCH FRIENDS ================= */
  const fetchFriends = async () => {
    const res = await axios.get(
      `https://apisocial.atozkeysolution.com/api/get-friends/${userId}`
    );
    if (res.data?.success) {
      setFriends(res.data.data.filter(f => f.status === "friends"));
    }
  };

  /* ================= SEND COINS ================= */
  const sendCoins = async () => {
    if (!coinsToSend || coinsToSend > starsBalance) return;

    try {
      setSending(true);

      const res = await axios.post(
        "https://apisocial.atozkeysolution.com/api/transfer-coins",
        {
          senderId: userId,
          friendId: selectedFriend._id,
          coins: Number(coinsToSend),
        }
      );

      if (res.data?.success) {
        alert("Coins sent successfully 🎉");
        setShowSendModal(false);
        setShowFriendsModal(false);
        fetchWallet();
      }
    } catch {
      alert("Transfer failed");
    } finally {
      setSending(false);
    }
  };

  const filteredFriends = friends.filter(
    f =>
      f.fullName.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 px-3 py-6 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center mb-6">My Wallet</h1>

        {/* BALANCE */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-3">
            <Star className="text-white" size={32} />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="text-4xl font-bold">{starsBalance}</div>
              <p className="text-gray-500">Stars Available</p>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate("/packages")}
            className="bg-orange-500 text-white py-3 rounded-lg font-medium"
          >
            Add Stars
          </button>

          <button
            onClick={() => {
              fetchFriends();
              setShowFriendsModal(true);
            }}
            className="bg-orange-500 text-white py-3 rounded-lg font-medium"
          >
            Send to Friends
          </button>
        </div>

        {/* WALLET HISTORY */}
        {walletHistory.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Recent Wallet Activity</h3>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {walletHistory.slice(0, 5).map((tx, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{tx.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`font-bold ${tx.coins > 0 ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {tx.coins > 0 ? "+" : ""}
                    {tx.coins}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= FRIENDS MODAL ================= */}
      {showFriendsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Friends</h3>
              <X onClick={() => setShowFriendsModal(false)} />
            </div>

            <div className="p-4">
              <div className="flex items-center border rounded-lg px-3 mb-3">
                <Search size={18} />
                <input
                  className="w-full p-2 outline-none"
                  placeholder="Search friends"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {filteredFriends.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <UserPlus size={36} className="mx-auto mb-2" />
                    <p className="font-medium text-gray-600">No friends found</p>
                    <p className="text-xs mt-1">Invite friends to start sending coins</p>
                  </div>

                ) : (
                  filteredFriends.map(friend => (
                    <div
                      key={friend._id}
                      className="flex justify-between items-center border p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{friend.fullName}</p>
                        <p className="text-xs text-gray-500">{friend.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedFriend(friend);
                          setCoinsToSend("");
                          setShowSendModal(true);
                        }}
                        className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm"
                      >
                        Send
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= SEND COINS MODAL ================= */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">
                Send coins to {selectedFriend?.fullName}
              </h3>
              <X onClick={() => setShowSendModal(false)} />
            </div>

            <input
              type="number"
              placeholder={`Max ${starsBalance}`}
              value={coinsToSend}
              onChange={(e) => {
                let v = Number(e.target.value);
                if (!v) return setCoinsToSend("");
                if (v > starsBalance) v = starsBalance;
                setCoinsToSend(v);
              }}
              className="w-full border p-3 rounded-lg mb-3"
            />

            <button
              onClick={sendCoins}
              disabled={!coinsToSend || sending}
              className={`w-full py-3 rounded-lg text-white ${sending ? "bg-gray-400" : "bg-orange-500"
                }`}
            >
              {sending ? "Sending..." : "Send Coins"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletModal;
