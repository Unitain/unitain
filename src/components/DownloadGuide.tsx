import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadGuide } from '../lib/storage';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface DownloadGuideProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function DownloadGuide({ onSuccess, onError, className }: DownloadGuideProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    
    setLoading(true);
    let timeoutId: number;

    try {
      // Set a timeout to reset loading state if download takes too long
      timeoutId = window.setTimeout(() => {
        setLoading(false);
        toast.error('Download request timed out. Please try again.');
      }, 15000); // 15 second timeout

      const success = await downloadGuide();
      
      if (success) {
        toast.success('Guide download started');
        onSuccess?.();
      } else {
        throw new Error('Failed to download guide');
      }
    } catch (error) {
      console.error('Download guide error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download guide';
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <Download className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium">Download Guide</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Get started with our comprehensive guide
      </p>
      <Button
        onClick={handleDownload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Guide
          </>
        )}
      </Button>
    </div>
  );
}