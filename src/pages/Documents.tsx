import {useState, useEffect} from 'react';
import {Search,Download, Eye, Filter, Clock, X, Check} from "lucide-react"
import { supabase } from "../supabase";
import { log } from 'node:console';

const Documents = () => {
    const [filter, setFilter] = useState<"all" | "approved" | "missing" | "pending">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0)
    const [submission ,setSubmissions] = useState(null)
    console.log("🚀 ~ Documents ~ submission:", submission)

    const getPagination = (page, size) => {
      const limit = size ? +size : 3;
      const from = page * limit;
      const to = from + limit - 1;      
    
      return { from, to };
    };
    
        const fetchSubmissions = async () => {
          const { from, to } = getPagination(page, 10);

            const { data, error } = await supabase
            .from('submission')
            .select('*')
            .range(from, to)
            .order('created_at', { ascending: false });

            if(error){
              console.log("error while fetching submissions");
            }
            setSubmissions(data);
            console.log("🚀 ~ fetchSubmissions ~ data:", data)
        };

    useEffect(() => {
        fetchSubmissions();
      }, [page]);

  return (
    <div className="p-4 md:p-8 container mx-auto min-h-screen overflow-y-hidden">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-600">Documents</h1>
          <p className="text-gray-500 mt-1">Manage and review uploaded documents</p>
        </div>
        
        <div className='flex gap-4 flex-wrap'>
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Document Type Filter */}
          <div className="relative min-w-[150px]">
            <select
              className="bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="identity">Identity</option>
              <option value="photo">Photo</option>
              <option value="tax">Tax</option>
            </select>
          </div>

          {/* review_status Filter */}
          <div className="relative min-w-[180px]">
            <select
              className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Fully Reviewed</option>
              <option value="missing">Missing Docs</option>
              <option value="pending">Pending Review</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-auto shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submission?.map((doc, index) => (
              doc?.documents?.map((sub) =>  (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg mr-3">
                    {sub?.name.split('.').pop().toUpperCase()}
                    </div>
                    <div><div className="text-sm text-gray-500">{sub.name}</div></div>
                  </div>
                </td>
                <div className="flex">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 truncate max-w-[180px]">{doc.createdBy?.email}</div></td>
                </div>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(doc.uploaded_at).toLocaleDateString('en-US', {month: 'short',day: 'numeric',year: 'numeric',})}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.review_status === "pending" ? "bg-blue-100 text-blue-800" : sub.review_status === "verified" ? "bg-green-100 text-green-800" : sub.review_status === "missing" ? "bg-rose-100 text-rose-800" : sub.review_status === "unclear" ? "text-amber-700 bg-amber-50" : "bg-gray-100 text-gray-800"}`}>
                {sub.review_status === "pending" ? (<><Clock className="w-3 h-3 mr-1" />Pending</>) : sub.review_status === "verified" ? (<><Check className="w-3 h-3 mr-1" />Approved</>) : sub.review_status === "missing" ? (<><Eye className="w-3 h-3 mr-1" />Missing</>) : (<><X className="w-3 h-3 mr-1" />Rejected</>)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                  <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => {
                          window.open(sub.url, "_blank");
                        }}
                      >
                        <Eye />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-yellow-500 transition-colors"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = sub.url;
                          link.download = sub.name;
                          link.click();
                        }}
                      >
                        <Download />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">Showing 1 to {submission?.length} of {submission?.length} documents</div>
        <div className="flex justify-end gap-4 mt-10">
         <button className={`${page === 0 ? 'text-gray-400 disabled:opacity-50' : 'text-black'} px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50`} onClick={() => {setPage(prev => Math.max(prev - 1, 0));}}disabled={page === 0}>Previous</button>
         <button  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"  onClick={() => {setPage(prev => prev + 1);}}>Next</button>
      </div>
      </div>
    </div>
  );
}

export default Documents;