import React, { useState } from "react";
import { X, Upload, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimplifiedForm = ({ onClose }) => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    { id: Date.now(), text: "", type: "Multiple Choice", options: [""] },
  ]);
  const [showDropdownId, setShowDropdownId] = useState(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", type: "Multiple Choice", options: [""] },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestionText = (id, text) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text } : q))
    );
  };

  const updateQuestionType = (id, type) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, type } : q))
    );
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    );
  };

  const updateOptionText = (questionId, optionIndex, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? text : opt
              ),
            }
          : q
      )
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Glass background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h2 className="text-xl font-semibold text-gray-900">Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">Upload Image Or Video</p>
            <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
              + Upload
            </button>
          </div>

          {/* Questions */}
          {questions.map((q) => (
            <div key={q.id} className="border p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Enter Question"
                  value={q.text}
                  onChange={(e) => updateQuestionText(q.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Question Type Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setShowDropdownId(showDropdownId === q.id ? null : q.id)
                  }
                  className="flex items-center justify-between px-4 py-2 w-full border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
                >
                  {q.type}
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </button>
                {showDropdownId === q.id && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {["Multiple Choice", "Checkboxes", "Drop-down"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          updateQuestionType(q.id, type);
                          setShowDropdownId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        updateOptionText(q.id, idx, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={() => removeOption(q.id, idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(q.id)}
                  className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full px-4 py-2 border border-orange-300 text-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          {/* Contact Info */}
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Enter your mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/30">
          <button
            onClick={() => navigate("/pricingplan")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedForm;
