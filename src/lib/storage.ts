import { supabase } from './supabase';
import toast from 'react-hot-toast';

const GUIDE_URL = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf';

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log('Starting guide download:', GUIDE_URL);

    // Fetch the file
    const response = await fetch(GUIDE_URL);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // Convert to blob
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Create a hidden link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'unitan-guide.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

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