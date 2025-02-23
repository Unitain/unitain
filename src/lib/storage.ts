import { supabase } from './supabase';
import toast from 'react-hot-toast';

const GUIDE_URL = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf';

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log('Downloading guide from:', GUIDE_URL);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = GUIDE_URL;
    link.target = '_self'; // Use same window
    link.rel = 'noopener noreferrer';
    link.download = 'unitan-guide.pdf'; // Suggest filename to browser

    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
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