import { supabase } from './supabase';
import toast from 'react-hot-toast';

const GUIDE_URL = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf';

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log('Starting guide download:', GUIDE_URL);

    // Create a hidden link element
    const link = document.createElement('a');
    link.href = GUIDE_URL;
    link.download = 'unitan-guide.pdf'; // Set filename
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Guide download failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message
      : 'Failed to download guide';
    
    toast.error(errorMessage);
    return false;
  }
}