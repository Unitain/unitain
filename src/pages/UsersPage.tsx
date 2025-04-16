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

const UsersPage = ({user}) => {
  const [filter, setFilter] = useState<"all" | "approved" | "missing" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState([])

  // useEffect(()=>{
  //   if(user) {
  //     const fetchSubmissions = async () =>{
  //     const { data, error } = await supabase
  //     .from('submission')
  //     .select('');

  //     console.log("🚀 ~ check ~ data:", data)
  //     }

  //   }else{
  //     console.log("user ni mil raha");
  //   }
  // },[])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        console.log("before await");
        const { data, error } = await supabase
        .from('submission')
        .select()
        .filter('images', 'neq', null);
        console.log(data);

          const userIds = submissions.map(submission => submission.user_id);

          const {data: userData, error:userError} = await supabase
          .from('users')
          .select('')
          .in('id', userIds)

          console.log("🚀 ~ fetchSubmissions ~ userData:", userData)

      if (userError) {
        console.error("Error fetching user data:", userError);
        return
      }
      if (error) {
        console.error("Error fetching submissions:", error);
        return;
      }
        setUsers(userData || []);
        setSubmissions(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter submissions based on search and filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
          Documents Review
        </h1>

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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="w-8 flex justify-center">
              <span className="text-gray-400">#</span>
            </div>
            <div className="flex-1 font-medium text-gray-600">Email</div>
            <div className="hidden md:block md:w-1/5 font-medium text-gray-600">
              First Upload
            </div>
            <div className="hidden md:block md:w-1/6 font-medium text-gray-600">
              Documents
            </div>
            <div className="w-1/4 md:w-1/6 font-medium text-gray-600">Status</div>
            <div className="w-1/5 md:w-1/6"></div>
          </div>

          {/* User List */}
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission, index) => (
              <div
                key={submission.id}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="px-4 py-3 flex items-center">
                  <div className="w-8 flex justify-center">
                    <span className="text-gray-500">{index + 1}</span>
                  </div>
                  <div className="flex-1 text-primary-600 font-medium">
                    {users.find(user => user.id === submission.userId)?.email || ''}
                  </div>
                  <div className="hidden md:block md:w-1/5 text-gray-600">
                    {formatDate(submission.created_at)}
                  </div>
                  <div className="hidden md:block md:w-1/6 text-gray-600">
                    {submission.documents?.length || 0} documents
                  </div>
                  <div className="w-1/4 md:w-1/6">
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
                  </div>
                  <div className="w-1/5 md:w-1/6 flex justify-end">
                    <button className="text-primary-600 hover:text-primary-800 flex items-center text-sm">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No submissions found
            </div>
          )}
        </div>
      )}

      {/* Status Summary */}
      <div className="mt-10">
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
              {submissions.length}
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
    </div>
  );
};

export default UsersPage;