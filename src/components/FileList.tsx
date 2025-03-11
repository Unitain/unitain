import React, { useState } from 'react';
import { Eye, Trash2, FileText, Download } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { Lightbox } from './Lightbox';
import type { FileItem } from '../types';

export function FileList() {
  const { files, removeFile } = useFiles();
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleView = (file: FileItem) => {
    setPreviewFile(file);
  };

  const handleDelete = async (file: FileItem) => {
    console.log(file);
    
    try {
      setDeletingId(file.id);
      await removeFile(file.id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Uploaded Files</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr 
                      key={file.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150
                        ${deletingId === file.id ? 'opacity-50' : ''}`}
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                          <button
                            onClick={() => handleView(file)}
                            className="p-2 text-blue-600 hover:text-blue-900 transition-colors duration-150 touch-manipulation"
                            aria-label={`View ${file.name}`}
                            disabled={deletingId === file.id}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <a
                            href={file.url}
                            download={file.name}
                            className="p-2 text-green-600 hover:text-green-900 transition-colors duration-150 touch-manipulation"
                            aria-label={`Download ${file.name}`}
                          >
                            <Download className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDelete(file)}
                            className="p-2 text-red-600 hover:text-red-900 transition-colors duration-150 touch-manipulation"
                            aria-label={`Delete ${file.name}`}
                            disabled={deletingId === file.id}
                          >
                            <Trash2 className={`h-5 w-5 ${deletingId === file.id ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {files.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload files to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}