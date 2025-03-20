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
      console.log('Please sign in to download the guide');
      return;
    }
    const guideModalShown = localStorage.getItem('GuideModal')
    if(guideModalShown === 'true'){
    setGuideModal(false);
    }else{
    setGuideModal(true);
    localStorage.setItem('GuideModal', 'true')
    }
    try {
      const success = await downloadGuide();
      if (success) {
        toast.success('Guide downloaded successfully!');
        const { error } = await supabase
          .from('submission')
          .update({ guide_downloaded: true })
          .eq('id', user.id);
        if (error) {
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
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
      {/* {guideModal && (
      <div className="fixed text-center cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-xl z-50">
        <div className="bg-white p-10 rounded shadow-md max-w-lg relative">
          <div className='absolute right-6 top-5' onClick={()=> setGuideModal(false)}><X/></div>
          <h2 className="text-2xl font-bold mb-4">Download Guide</h2>
          <p className="mb-5">Here’s our comprehensive document about importing a vehicle into Portugal. Downloading it is not required for the beta test, but feel free to read it to learn which documents you’d need in a real application. If you like, we’d appreciate any feedback on whether it was helpful!</p>
          <div className="flex justify-end gap-4">
            <button className="border p-3 rounded-md border-black" onClick={() => setGuideModal(false)}>
              Cancel
            </button>
            <button onClick={handleDownload}  className="border p-3 rounded-md bg-black text-white">
              Download Guide
            </button>
          </div>
        </div>
      </div>
      )} */}

      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-primary-900 mb-4">Download Guide</h2>
      <p className="text-sm text-primary-700 mb-6">
        Get our comprehensive guide on vehicle tax exemption procedures and requirements
      </p>
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-white shadow-neu-flat hover:shadow-neu-pressed active:shadow-neu-pressed transition-all duration-200 group touch-manipulation"
      >
        <DownloadIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-700 transition-colors duration-200 mr-2" />
        <span className="text-primary-700 font-medium group-hover:text-primary-800 transition-colors duration-200">
          Download Guide
        </span>
      </button>

      {/* {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <DownloadIcon className="w-5 h-5" />
        )}
        {isDownloading ? 'Downloading...' : 'Download Guide'} */}


    </div>

      <p className="text-sm text-gray-500">
        Download our comprehensive vehicle tax exemption guide
      </p>
    </div>
  );
}

export default Download;