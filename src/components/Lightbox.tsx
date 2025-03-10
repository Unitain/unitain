import React, { useEffect, useCallback, useState } from 'react';
import { X, FileText, Download, Eye } from 'lucide-react';
import type { FileItem } from '../types';

interface LightboxProps {
  file: FileItem | null;
  onClose: () => void;
}

export function Lightbox({ file, onClose }: LightboxProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleKeyDown, handleResize]);

  if (!file) return null;

  const getContentStyles = () => {
    const baseStyles = 'relative rounded-lg overflow-hidden';
    const responsiveStyles = {
      width: `min(90vw, 1200px)`,
      maxHeight: '90vh',
      margin: '0 auto'
    };

    return {
      className: baseStyles,
      style: responsiveStyles
    };
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative aspect-auto">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-auto object-contain max-h-[80vh]"
            style={{
              minHeight: '200px',
              backgroundColor: 'rgb(243, 244, 246)'
            }}
          />
        </div>
      );
    } else if (file.type === 'application/pdf') {
      return (
        <div className="relative" style={{ height: '80vh', minHeight: '400px' }}>
          <object
            data={file.url}
            type="application/pdf"
            className="w-full h-full rounded-lg"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-white p-8 rounded-lg">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Unable to display PDF directly.
                </p>
                <a 
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open PDF in new tab
                </a>
              </div>
            </div>
          </object>
        </div>
      );
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return (
        <div className="bg-white p-8 rounded-lg text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {file.name}
          </h3>
          <p className="text-gray-600 mb-6">
            Word documents cannot be previewed directly in the browser.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href={file.url}
              download={file.name}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </a>
            <a
              href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Online
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 rounded-lg">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Preview not available for this file type.
            </p>
            <a 
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              Open in new tab
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        isClosing ? 'bg-opacity-0' : 'bg-opacity-75'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div {...getContentStyles()}>
        <div className={`relative bg-white rounded-lg overflow-hidden transform transition-transform duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Vorschau schließen"
            title="Schließen (ESC)"
            tabIndex={0}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <X className="h-6 w-6" />
          </button>
          
          {renderPreview()}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <p className="text-sm truncate">{file.name}</p>
        </div>
      </div>
    </div>
  );
}