"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { supabase } from '../supabase';
import { FileText, ChevronDown, AlertTriangle, ChevronLeft, Check, X, HelpCircle, Eye, Download } from 'lucide-react';

const UserDetailsPage = () => {
  const { id } = useParams(); 
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const fetchSubmission = async () => {
    const { data, error } = await supabase
      .from('submission')
      .select()
      .eq('id', id)
      .maybeSingle(); 

    if (error) {
      console.error('Error fetching submission:', error);
    } else {
      setSubmission(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  const handleDocumentStatusChange = async (docId, newStatus) => {
    const updatedDocs = submission.documents.map((doc) =>
      doc.id === docId ? { ...doc, status: newStatus } : doc
    );
    setSubmission({ ...submission, documents: updatedDocs });
  
    const { error } = await supabase
      .from('documents')
      .update({ status: newStatus })
      .eq('id', docId);
  
    if (error) {
      console.error('Error updating document status:', error);
      // Optionally: show toast error
    }
  };
  
  const getReviewStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'valid': return <Check className="w-4 h-4 text-emerald-500" />;
      case 'unclear': return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case 'missing': return <X className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading submission details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="container mx-auto max-w-5xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button 
                className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">{submission?.createdBy?.email || 'User Submission'}</h1>
                <p className="text-sm text-slate-500">ID: {id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Submission Info */}

            <div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Created At</h3>
                <p className="text-gray-700">{new Date(submission.created_at).toLocaleDateString('en-US', {month: 'short',day: 'numeric',year: 'numeric',})}</p>
            </div>
            {submission?.payment_status && (
            <div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Payment status</h3>
                <p className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                submission?.payment_status === 'pending' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                {submission?.payment_status}
                </p>
            </div>
            )}
          {/* Documents Section */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Documents
              </h2>
            </div>
            
            {submission?.documents?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Review Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {submission.documents.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex items-center justify-center rounded">
                              {/* <FileText className="h-4 w-4" /> */}
                              <img src={doc.url} alt="" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.category || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.created_at || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                          {getReviewStatusIcon(doc.status)}
                          <select
                            className="border text-sm rounded px-2 py-1 focus:outline-none"
                            value={doc.status}
                            onChange={(e) => handleDocumentStatusChange(doc.id, e.target.value)}
                          >
                            <option value="valid">Pending</option>
                            <option value="valid">Verified</option>
                            <option value="valid">Valid</option>
                            <option value="unclear">Unclear</option>
                            <option value="missing">Missing</option>
                          </select>
                        </div>
                       </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors" title="View Document">
                              <Eye/>
                            </button>
                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Download Document">
                              <Download/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-50 p-12 text-center rounded-b-lg border-t border-slate-200">
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 font-medium mb-1">No documents uploaded</h3>
                  <p className="text-slate-500 text-sm">There are no documents associated with this submission.</p>
                </div>
              </div>
            )}
          </div>

          {/* Eligibility Notes */}
          {submission?.eligibility_notes && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-amber-800">Eligibility Notes</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>{submission.eligibility_notes}</p>
                  </div>
                </div>


              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
