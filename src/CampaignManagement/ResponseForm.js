import { useState, useMemo } from "react";
import { Search, X, Mail, Calendar, User, Tag } from "lucide-react";

const FormDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data - in a real app this would come from an API
  const [submissions, setSubmissions] = useState([
    { 
      id: 1, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 14:30:25",
      formData: {
        company: "Tech Solutions Ltd",
        designation: "Software Engineer",
        experience: "5 years",
        interest: "Web Development"
      }
    },
    { 
      id: 2, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 15:45:12",
      formData: {
        company: "Digital Marketing Inc",
        designation: "Marketing Manager",
        experience: "3 years",
        interest: "Digital Strategy"
      }
    },
    { 
      id: 3, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "incomplete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 16:20:45",
      formData: {
        company: "StartUp Hub",
        designation: "",
        experience: "",
        interest: ""
      }
    },
    { 
      id: 4, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 17:10:33",
      formData: {
        company: "Consulting Group",
        designation: "Business Analyst",
        experience: "7 years",
        interest: "Data Analytics"
      }
    },
    { 
      id: 5, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 18:25:18",
      formData: {
        company: "E-commerce Solutions",
        designation: "Product Manager",
        experience: "4 years",
        interest: "Product Development"
      }
    },
    { 
      id: 6, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 19:15:42",
      formData: {
        company: "FinTech Innovations",
        designation: "DevOps Engineer",
        experience: "6 years",
        interest: "Cloud Architecture"
      }
    },
    { 
      id: 7, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 20:30:56",
      formData: {
        company: "Mobile App Studio",
        designation: "UX Designer",
        experience: "2 years",
        interest: "Mobile Design"
      }
    },
    { 
      id: 8, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 21:45:29",
      formData: {
        company: "AI Research Lab",
        designation: "Data Scientist",
        experience: "8 years",
        interest: "Machine Learning"
      }
    },
    { 
      id: 9, 
      dateAdded: "Jul 7", 
      name: "Manoj Kumar", 
      channel: "Email", 
      status: "complete",
      email: "manoj.kumar@example.com",
      phone: "+91 98765 43210",
      submittedAt: "2024-07-07 22:12:37",
      formData: {
        company: "Cybersecurity Corp",
        designation: "Security Engineer",
        experience: "5 years",
        interest: "Network Security"
      }
    },
  ]);

  // Filter submissions based on search term and status
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.channel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || submission.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, selectedStatus]);

  const handleView = (id) => {
    const submission = submissions.find(sub => sub.id === id);
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleStatusUpdate = (id, newStatus) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );
  };

  const getStatusColor = (status) => {
    return status === "complete" 
      ? "bg-green-100 text-green-800 border border-green-200" 
      : "bg-red-100 text-red-800 border border-red-200";
  };

  const getStatusText = (status) => {
    return status === "complete" ? "Complete form" : "Not Completed";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            P
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4 px-6 py-4">
            <div className="text-sm font-medium text-gray-700">Date added</div>
            <div className="text-sm font-medium text-gray-700">Name</div>
            <div className="text-sm font-medium text-gray-700">Channel</div>
            <div className="text-sm font-medium text-gray-700">Status</div>
            <div className="text-sm font-medium text-gray-700"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredSubmissions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No submissions found matching your criteria.
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="text-sm text-gray-900">{submission.dateAdded}</div>
                <div className="text-sm text-gray-900">{submission.name}</div>
                <div className="text-sm text-gray-900">{submission.channel}</div>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(submission.status)}`}>
                    {getStatusText(submission.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(submission.id)}
                    className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                  >
                    View
                  </button>
                  {submission.status === "incomplete" && (
                    <button
                      onClick={() => handleStatusUpdate(submission.id, "complete")}
                      className="px-3 py-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Total Submissions</div>
          <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Complete Forms</div>
          <div className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.status === "complete").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Incomplete Forms</div>
          <div className="text-2xl font-bold text-red-600">
            {submissions.filter(s => s.status === "incomplete").length}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Submission Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Tag size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Channel</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.channel}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Submitted At</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.submittedAt}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusText(selectedSubmission.status)}
                  </span>
                  {selectedSubmission.status === "incomplete" && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedSubmission.id, "complete");
                        setSelectedSubmission(prev => ({ ...prev, status: "complete" }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Form Data */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Form Data</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium mb-1">Company</div>
                      <div className="text-gray-900">{selectedSubmission.formData.company || "Not provided"}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium mb-1">Designation</div>
                      <div className="text-gray-900">{selectedSubmission.formData.designation || "Not provided"}</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-600 font-medium mb-1">Experience</div>
                      <div className="text-gray-900">{selectedSubmission.formData.experience || "Not provided"}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium mb-1">Interest</div>
                      <div className="text-gray-900">{selectedSubmission.formData.interest || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Date Added</div>
                      <div className="font-medium text-gray-900">{selectedSubmission.dateAdded}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log("Editing submission:", selectedSubmission.id);
                  // Add edit functionality here
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDashboard;