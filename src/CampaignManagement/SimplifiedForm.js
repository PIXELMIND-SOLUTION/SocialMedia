import React, { useState } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SimplifiedForm = ({ onClose }) => {
  const navigate = useNavigate();
  const API_BASE_URL = "https://apisocial.atozkeysolution.com/api";
  const storedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = storedUser?.userId;

  const [questions, setQuestions] = useState([
    { id: Date.now(), question: "", options: ["", "", "", ""], answer: "" }
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    link: "",
    media: []
  });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* ---------------- FAQ LOGIC ---------------- */

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { id: Date.now(), question: "", options: ["", "", "", ""], answer: "" }
    ]);

  const removeQuestion = (id) =>
    setQuestions(questions.filter((q) => q.id !== id));

  const updateQuestion = (id, value) =>
    setQuestions(questions.map((q) => (q.id === id ? { ...q, question: value } : q)));

  const updateOption = (qid, idx, value) =>
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) }
          : q
      )
    );

  const updateAnswer = (qid, value) =>
    setQuestions(questions.map((q) => (q.id === qid ? { ...q, answer: value } : q)));

  /* ---------------- FORM ---------------- */

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = (e) =>
    setFormData((p) => ({ ...p, media: [...p.media, ...Array.from(e.target.files)] }));

  const removeMediaFile = (index) =>
    setFormData((p) => ({ ...p, media: p.media.filter((_, i) => i !== index) }));

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!userId) return alert("User not logged in");

    for (const q of questions) {
      if (!q.question || q.options.some((o) => !o.trim()) || !q.answer)
        return alert("Each question needs 4 options and an answer");
      if (!q.options.includes(q.answer))
        return alert("Answer must match one option");
    }
    return true;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("fullName", formData.fullName);
      fd.append("email", formData.email);
      fd.append("mobileNumber", formData.mobileNumber);
      fd.append("link", formData.link);
      fd.append("faqs", JSON.stringify(questions));
      formData.media.forEach((file) => fd.append("media", file));

      await axios.post(`${API_BASE_URL}/campaign`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });

      alert("Campaign submitted for admin approval ✅");
      navigate("/pricingplan");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Campaign</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Upload */}
          <label className="group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-orange-500 transition">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500" />
            <span className="mt-2 text-sm text-gray-500">Upload image / video / pdf</span>
            <input hidden multiple accept="image/*,video/*,application/pdf" type="file" onChange={handleFileUpload} />
          </label>

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {/* Media list */}
          {formData.media.map((file, i) => (
            <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
              <span className="truncate">{file.name}</span>
              <Trash2 onClick={() => removeMediaFile(i)} className="w-4 h-4 text-red-500 cursor-pointer" />
            </div>
          ))}

          {/* FAQs */}
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-50 border rounded-xl p-4 space-y-3">
              <input
                className="w-full input-modern"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => updateQuestion(q.id, e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    className="input-modern"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(q.id, i, e.target.value)}
                  />
                ))}
              </div>

              <select
                className="input-modern"
                value={q.answer}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
              >
                <option value="">Select correct answer</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 text-orange-600 hover:underline"
          >
            <Plus size={16} /> Add Question
          </button>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4">
            {["fullName", "mobileNumber", "email", "link"].map((f) => (
              <input
                key={f}
                name={f}
                placeholder={f === "link" ? "Campaign link (optional)" : f.replace(/([A-Z])/g, " $1")}
                onChange={handleInputChange}
                className="input-modern"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="sticky bottom-0 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium shadow-lg hover:scale-[1.01] transition"
          >
            {loading ? "Submitting..." : "Proceed"}
          </button>
        </form>
      </div>

      {/* Tailwind helper */}
      <style>{`
        .input-modern {
          @apply w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none;
        }
      `}</style>
    </div>
  );
};

export default SimplifiedForm;