import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadGuide } from '../lib/storage';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface DownloadGuideProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function DownloadGuide({ onSuccess, onError, className }: DownloadGuideProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleDownload = async () => {
    if (loading) return;
    
    setLoading(true);
    let timeoutId: number;

    try {
      // Set a timeout to reset loading state if download takes too long
      timeoutId = window.setTimeout(() => {
        setLoading(false);
        toast.error(t('Download request timed out. Please try again.'));
      }, 15000); // 15 second timeout

      const success = await downloadGuide();
      
      if (success) {
        toast.success(t('Guide download started'));
        onSuccess?.();
      } else {
        throw new Error(t('Failed to download guide'));
      }
    } catch (error) {
      console.error('Download guide error:', error);
      const errorMessage = error instanceof Error ? error.message : t('Failed to download guide');
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      <Button
        onClick={handleDownload}
        disabled={loading}
        variant="primary"
        fullWidth
        className="flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('Downloading...')}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {t('Download Guide')}
          </>
        )}
      </Button>
    </div>
  );
}