import React from 'react';
import { Download as DownloadIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { downloadGuide } from '../lib/storage';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

export function Download() {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { user } = useAuthStore();

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please sign in to download the guide');
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadGuide();
      if (success) {
        toast.success('Guide downloaded successfully!');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download guide. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2"
      >
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <DownloadIcon className="w-5 h-5" />
        )}
        {isDownloading ? 'Downloading...' : 'Download Guide'}
      </Button>
      
      <p className="text-sm text-gray-500">
        Download our comprehensive vehicle tax exemption guide
      </p>
    </div>
  );
}

export default Download;