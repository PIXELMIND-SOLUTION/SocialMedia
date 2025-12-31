import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  X,
  Mail,
  Calendar,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";

const FormDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(sessionStorage.getItem("userData"));
  const userId = storedUser?.userId;

  /* ================= FETCH ACTIVE CAMPAIGNS + RESPONSES ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch user campaigns
        const campaignRes = await axios.get(
          `https://apisocial.atozkeysolution.com/api/campaigns/user/${userId}`
        );

        const activeCampaigns = campaignRes.data.data.filter(
          (c) => c.adminApprovalStatus === "approved"
        );

        setCampaigns(activeCampaigns);

        if (!activeCampaigns.length) {
          setSubmissions([]);
          return;
        }

        // 2️⃣ Fetch FAQ responses for active campaigns
        const responses = await Promise.all(
          activeCampaigns.map(async (campaign) => {
            const res = await axios.get(
              `https://apisocial.atozkeysolution.com/api/campaigns/${campaign._id}/faq-responses`,
              { params: { userId } }
            );

            return res.data.data.map((item) => ({
              id: item._id,
              campaignId: campaign._id,
              campaignName:
                campaign.purchasedPackage?.packageName || "Campaign",
              name: item.userName,
              email: item.userEmail,
              dateAdded: new Date(item.createdAt).toLocaleDateString(),
              submittedAt: new Date(item.completedAt).toLocaleString(),
              status:
                item.score === item.totalQuestions
                  ? "complete"
                  : "incomplete",
              score: item.score,
              totalQuestions: item.totalQuestions,
              answers: item.answers
            }));
          })
        );

        setSubmissions(responses.flat());
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ================= FILTERED DATA ================= */
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch =
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCampaign =
        selectedCampaign === "all" ||
        s.campaignId === selectedCampaign;

      return matchesSearch && matchesCampaign;
    });
  }, [searchTerm, submissions, selectedCampaign]);

  const getStatusColor = (status) =>
    status === "complete"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Search */}
      <div className="mb-4 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ================= CAMPAIGN FILTER ================= */}
      {campaigns.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCampaign("all")}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              selectedCampaign === "all"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            All Campaigns
          </button>

          {campaigns.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCampaign(c._id)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                selectedCampaign === c._id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {c.fullName || "Campaign"}
            </button>
          ))}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow border">
        <div className="grid grid-cols-6 font-medium text-sm bg-gray-100 px-6 py-3">
          <div>Date</div>
          <div>Campaign Name</div>
          <div>Email</div>
          <div>Plan</div>
          <div>Status</div>
          <div></div>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No responses found
          </div>
        ) : (
          filteredSubmissions.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-6 px-6 py-4 border-t hover:bg-gray-50"
            >
              <div>{item.dateAdded}</div>
              <div>{item.name}</div>
              <div>{item.email}</div>
              <div className="text-sm">{item.campaignName}</div>
              <div>
                <span
                  className={`px-2 py-1 text-xs rounded ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div>
                <button
                  onClick={() => {
                    setSelectedSubmission(item);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-semibold">
                FAQ Submission Details
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <User size={18} /> {selectedSubmission.name}
                </div>
                <div className="flex gap-2">
                  <Mail size={18} /> {selectedSubmission.email}
                </div>
                <div className="flex gap-2">
                  <Calendar size={18} /> {selectedSubmission.submittedAt}
                </div>
                <div className="font-semibold">
                  Score: {selectedSubmission.score}/
                  {selectedSubmission.totalQuestions}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Answers</h3>
                <div className="space-y-3">
                  {selectedSubmission.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <p className="font-medium">
                        {idx + 1}. {ans.questionText}
                      </p>
                      <p>Selected: <b>{ans.selectedOption}</b></p>
                      <p>Correct: <b>{ans.correctOption}</b></p>
                      <div className="flex items-center gap-2 mt-1">
                        {ans.isCorrect ? (
                          <>
                            <CheckCircle
                              size={18}
                              className="text-green-600"
                            />
                            <span className="text-green-600">Correct</span>
                          </>
                        ) : (
                          <>
                            <XCircle
                              size={18}
                              className="text-red-600"
                            />
                            <span className="text-red-600">Wrong</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDashboard;
