import React, { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  Bell, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  Settings, 
  CreditCard,
  X,
  Upload,
  Plus,
  MoreHorizontal,
  Trash2,
  ChevronDown
} from 'lucide-react';





// 1. Campaign Menu Component
const CampaignMenu = ({ onNavigate }) => (
  <div className="flex">

    <div className="flex-1 flex flex-col">

      <div className="flex-1 bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100 p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Campaign</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => onNavigate('simplified')}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg border-b border-gray-100 transition-colors"
              >
                Campaign
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg border-b border-gray-100 transition-colors">
                Received responses
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Current Campaign Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Simplified Form Component
const SimplifiedForm = ({ onNavigate }) => (
  <div className="flex">

    <div className="flex-1 flex flex-col">
 
      <div className="flex-1 bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100 p-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">campaign</h2>
              <button 
                onClick={() => onNavigate('menu')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">Upload Image Or Video</p>
              <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                + Upload
              </button>
            </div>

            {/* Create Questions Button */}
            <button 
              onClick={() => onNavigate('detailed')}
              className="w-full mb-6 px-4 py-3 border border-orange-300 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Questions</span>
            </button>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
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

            {/* Proceed Button */}
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 3. Campaign Form (Detailed) Component
const CampaignFormDetailed = ({ onNavigate }) => {
  const [questions, setQuestions] = useState([
    { id: 1, text: 'Test', type: 'radio' },
    { id: 2, text: 'Test', type: 'radio' },
    { id: 3, text: 'Test', type: 'radio' },
    { id: 4, text: 'Test', type: 'radio' }
  ]);
  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [showDropdown, setShowDropdown] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      text: 'Test', 
      type: 'radio' 
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="flex">
      
      <div className="flex-1 flex flex-col">
 
        <div className="flex-1 bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">campaign</h2>
                <button 
                  onClick={() => onNavigate('simplified')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">Upload Image Or Video</p>
                <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                  + Upload
                </button>
              </div>

              {/* Question Input */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter Question"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Question Type Selector */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
                    >
                      <span>{questionType}</span>
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    </button>
                    {showDropdown && (
                      <div className="absolute top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {['Multiple Choice', 'Checkboxes', 'Drop-down'].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setQuestionType(type);
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Options */}
                <div className="space-y-3 mb-4">
                  {questions.map((question) => (
                    <div key={question.id} className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      <span className="flex-1 text-gray-700">{question.text}</span>
                      <button 
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={addQuestion}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  + Add Option
                </button>
              </div>

              {/* Add Question Button */}
              <button className="w-full mb-6 px-4 py-3 border border-orange-300 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                + Add question
              </button>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
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

              {/* Proceed Button */}
              <button 
                onClick={() => onNavigate('pricing')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Pricing Plans Component
const PricingPlans = ({ onNavigate }) => (
  <div className="flex">
 
    <div className="flex-1 flex flex-col">
 
      <div className="flex-1 bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Plan */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹199<span className="text-lg font-normal text-gray-500">/4 Hr's</span></h3>
                  <div className="space-y-4 mt-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700">Lorem Ipsum is simply dummy</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate('menu')}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹400<span className="text-lg font-normal text-gray-500">/8 Hr's</span></h3>
                  <div className="space-y-4 mt-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700">Lorem Ipsum is simply dummy</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate('menu')}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹800<span className="text-lg font-normal text-gray-500">/16 Hr's</span></h3>
                  <div className="space-y-4 mt-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700">Lorem Ipsum is simply dummy</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate('menu')}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
const CampaignFlowApp = () => {
  const [currentStep, setCurrentStep] = useState('menu');

  const handleNavigation = (step) => {
    setCurrentStep(step);
  };

  // Navigation Bar
  const NavigationBar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex space-x-6">
        <button 
          onClick={() => setCurrentStep('menu')}
          className={`px-4 py-2 rounded-lg transition-colors ${currentStep === 'menu' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          1. Campaign Menu
        </button>
        <button 
          onClick={() => setCurrentStep('simplified')}
          className={`px-4 py-2 rounded-lg transition-colors ${currentStep === 'simplified' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          2. Simplified Form
        </button>
        <button 
          onClick={() => setCurrentStep('detailed')}
          className={`px-4 py-2 rounded-lg transition-colors ${currentStep === 'detailed' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          3. Campaign Form
        </button>
        <button 
          onClick={() => setCurrentStep('pricing')}
          className={`px-4 py-2 rounded-lg transition-colors ${currentStep === 'pricing' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          4. Pricing Plans
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <NavigationBar />
      </div>
      
      {currentStep === 'menu' && <CampaignMenu onNavigate={handleNavigation} />}
      {currentStep === 'simplified' && <SimplifiedForm onNavigate={handleNavigation} />}
      {currentStep === 'detailed' && <CampaignFormDetailed onNavigate={handleNavigation} />}
      {currentStep === 'pricing' && <PricingPlans onNavigate={handleNavigation} />}
    </div>
  );
};

export default CampaignFlowApp;