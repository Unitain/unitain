import { supabase } from './supabase';
import toast from 'react-hot-toast';

const GUIDE_URL = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf';

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log('Opening guide in new window:', GUIDE_URL);

    // Open in new window
    const newWindow = window.open(GUIDE_URL, '_blank', 'noopener,noreferrer');
    
    // Check if window was blocked by popup blocker
    if (newWindow === null) {
      throw new Error('Popup was blocked. Please allow popups for this site.');
    }

    return true;
  } catch (error) {
    console.error('Guide open failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message
      : 'Failed to open guide';
    
    toast.error(errorMessage);
    return false;
  }
}