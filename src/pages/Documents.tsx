import {useState, useEffect} from 'react';
import {Search, Filter} from "lucide-react"
import { supabase } from "../supabase";
import { log } from 'console';

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

  const documents = [
    {
      name: "driver_license_641.png",
      category: "Identity",
      uploadedBy: "David Miller",
      email: "david.miller@example.com",
      uploadDate: "Jan 21, 2025",
      status: "Unclear"
    },
    {
      name: "income_statement_657.docx",
      category: "Tax",
      uploadedBy: "Olivia Moore",
      email: "olivia.moore@example.com",
      uploadDate: "Jul 10, 2024",
      status: "Valid"
    },
    {
      name: "birth_certificate_789.pdf",
      category: "Identity",
      uploadedBy: "Sarah Davis",
      email: "sarah.davis@example.com",
      uploadDate: "Jan 25, 2024",
      status: "Not Reviewed"
    },
    {
      name: "property_tax_299.jpg",
      category: "Tax",
      uploadedBy: "Bob Wilson",
      email: "bob.wilson@example.com",
      uploadDate: "Aug 8, 2024",
      status: "Not Reviewed"
    },
    {
      name: "purchase_invoice_138.png",
      category: "Vehicle",
      uploadedBy: "Jane Smith",
      email: "jane.smith@example.com",
      uploadDate: "Jan 15, 2025",
      status: "Not Reviewed"
    },
    {
      name: "profile_photo_833.pdf",
      category: "Photo",
      uploadedBy: "Emma Wilson",
      email: "emma.wilson@example.com",
      uploadDate: "Dec 17, 2024",
      status: "Unclear"
    },
    {
      name: "insurance_policy_70.jpg",
      category: "Residence",
      uploadedBy: "Emma Wilson",
      email: "emma.wilson@example.com",
      uploadDate: "Jan 20, 2024",
      status: "Unclear"
    },
    {
      name: "utility_bill_195.doc",
      category: "Residence",
      uploadedBy: "John Doe",
      email: "john.doe@example.com",
      uploadDate: "Aug 2, 2024",
      status: "Valid"
    },
    {
      name: "driver_license_491.jpg",
      category: "Identity",
      uploadedBy: "Jane Smith",
      email: "jane.smith@example.com",
      uploadDate: "Nov 2, 2024",
      status: "Not Reviewed"
    },
    {
      name: "property_tax_340.png",
      category: "Tax",
      uploadedBy: "Olivia Moore",
      email: "olivia.moore@example.com",
      uploadDate: "Sep 2, 2024",
      status: "Valid"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Valid': return 'bg-green-100 text-green-800';
      case 'Unclear': return 'bg-yellow-100 text-yellow-800';
      case 'Not Reviewed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Valid': return '✓';
      case 'Unclear': return '?';
      case 'Not Reviewed': return '!';
      default: return '';
    }
  };

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

          {/* Status Filter */}
          <div className="relative min-w-[180px]">
            <select
              className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
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
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg mr-3">
                    {doc.documents[0].name.split('.').pop().toUpperCase()}
                    </div>
                    <div>
                      {/* <div className="text-sm text-gray-500">{doc.category}</div> */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <div className="font-medium">{doc?.createdBy.name}</div> */}
                  <div className="text-sm text-gray-500 truncate max-w-[180px]">{doc.createdBy?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(doc.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    <span className="mr-1">{getStatusIcon(doc.status)}</span>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">Showing 1 to {documents.length} of {documents.length} documents</div>
        <div className="flex justify-end gap-4 mt-10">
         <button className={`${page === 0 ? 'text-gray-400 disabled:opacity-50' : 'text-black'} px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50`} onClick={() => {setPage(prev => Math.max(prev - 1, 0));}}disabled={page === 0}>Previous</button>
         <button  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"  onClick={() => {setPage(prev => prev + 1);}}>Next</button>
      </div>
      </div>
    </div>
  );
}

export default Documents;