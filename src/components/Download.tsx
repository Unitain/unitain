import React, { useState } from 'react';
import { Download as DownloadIcon, Loader2, X } from 'lucide-react';
import { Button } from './Button';
import { downloadGuide } from '../lib/storage';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export function Download() {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [guideModal, setGuideModal] = useState(false)
  const { user } = useAuthStore();

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please sign in to download the guide');
      return;
    }
    // if(user) {
    //   setGuideModal(true)
    //   return
    // }
    // setIsDownloading(true);
    try {
      const success = await downloadGuide();
      if (success) {
        toast.success('Guide downloaded successfully!');

        const { error } = await supabase
        .from('submission')
        .update({ guide_downloaded: true })
        .eq('id', user.id)

        if(error){
          toast.error('Failed to update guide status. Please try again.');
        }

      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download guide. Please try again.');
    } finally {
      // setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {guideModal && (
      <div className="fixed text-center cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-10 rounded shadow-md max-w-lg relative">
          <div className='absolute right-6 top-5' onClick={()=> setGuideModal(false)}><X/></div>
          <h2 className="text-2xl font-bold mb-4">Almost Done! Let’s Start the Test Purchase</h2>
          <p className="mb-5">Great news—you may qualify for a tax exemption. To test our payment process, we’ll now do a test purchase that doesn’t cost you anything.</p>
        </div>
      </div>
      )}
      <Button
        onClick={handleDownload}
        // disabled={isDownloading}
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