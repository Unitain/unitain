import { Check, X, ChevronRight, Clock, Eye, Search, Filter, AArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { log } from "console";

interface Submission {
  id: string;
  email: string;
  created_at: string;
  documents: any[]; // Replace with your document type
  status: "pending" | "approved" | "rejected" | "missing";
}

const UsersPage = () => {
  const [filter, setFilter] = useState<"all" | "approved" | "missing" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  console.log("🚀 ~ UsersPage ~ submissions:", submissions)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Get all submissions
        const { data: submissions } = await supabase
          .from('submission')
          .select('*');
  
        // 2. Get all user IDs from submissions
        const userIds = submissions.map(sub => sub.user_id);
        
        // 3. Get matching users
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds);
  
        // 4. Combine data
        const combined = submissions.map(sub => ({
          ...sub,
          user: users.find(user => user.id === sub.user_id)
        }));
  
        setSubmissions(combined);
        
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Filter submissions based on search and filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || submission.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Count submissions by status
  const statusCounts = submissions.reduce((acc, submission) => {
    acc[submission.status] = (acc[submission.status] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0, missing: 0 });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalDocuments = submissions.reduce((sum, submission) => sum + (submission.documents?.length || 0),0);

  return (
    <div className="p-4 md:p-8 container mx-auto min-h-screen">
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Documents Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-gray-50">
                <Eye className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-800">Total Documents</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {totalDocuments}
            </div>
            <p className="text-sm text-gray-500">Total documents submitted</p>
          </div>

          {/* Pending Reviews Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-yellow-50">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-800">Pending Review</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {statusCounts.pending}
            </div>
            <p className="text-sm text-gray-500">Documents awaiting review</p>
          </div>

          {/* Fully Reviewed Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-50">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-800">Fully Reviewed</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {statusCounts.approved}
            </div>
            <p className="text-sm text-gray-500">Documents approved</p>
          </div>

          {/* Rejected Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-red-50">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-medium text-gray-800">Rejected</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {statusCounts.rejected}
            </div>
            <p className="text-sm text-gray-500">Documents rejected</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-4 px-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-600">Users cases</h1>
          <p className="text-gray-500 mt-1">Manage users uploaded document</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All users</option>
              <option value="approved">Only Fully Reviewed</option>
              <option value="missing">With missing document</option>
              <option value="pending">Not yet reviewed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8 text-center">
                #
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1 min-w-[150px]">
                Email
              </th>
              <th scope="col" className="table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                First Upload
              </th>
              <th scope="col" className="table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Documents
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 md:w-1/6">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5 md:w-1/6">
                Action
              </th>
            </tr>
          </thead>
      
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.length > 0 ? (
              submissions.map((submission, index) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  {/* Index */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center w-8">
                    {index + 1}
                  </td>
      
                  {/* Email (always visible) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-600 min-w-[150px]">
                    {submission.user?.email}
                  </td>
      
                  {/* First Upload (hidden on mobile) */}
                  <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-1/5">
                    {formatDate(submission?.created_at)}
                  </td>
      
                  {/* Documents (hidden on mobile) */}
                  <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-1/6">
                    {submission?.documents?.length || 0} documents
                  </td>
      
                  {/* Status (always visible) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-1/4 md:w-1/6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : submission.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : submission.status === "missing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {submission.status === "pending" ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      ) : submission.status === "approved" ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Approved
                        </>
                      ) : submission.status === "missing" ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Missing
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Rejected
                        </>
                      )}
                    </span>
                  </td>
      
                  {/* Action (always visible) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right w-1/5 md:w-1/6">
                    <button className="text-primary-600 hover:text-primary-800 flex items-center justify-end text-sm w-full">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  </div>
  );
};

export default UsersPage;