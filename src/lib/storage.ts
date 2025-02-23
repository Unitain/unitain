import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { addChatMessage } from './chat';

const GUIDE_URL = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf';

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log('Starting guide download:', GUIDE_URL);

    const response = await fetch(GUIDE_URL);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'unitan-guide.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    addChatMessage('✅ Guide downloaded successfully! You can now proceed with the next steps.', 'bot');

    return true;
  } catch (error) {
    console.error('Guide download failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message
      : 'Failed to download guide';
    
    addChatMessage('❌ Failed to download guide. Please try again.', 'bot');
    toast.error(errorMessage);
    return false;
  }
}

export async function uploadVehicleFile(
  file: File,
  userId: string
): Promise<string | null> {
  try {
    if (file.size > 52428800) {
      throw new Error('File size exceeds 50MB limit');
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PDF, Word, or image files.');
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${timestamp}_${safeFilename}`;

    const { data, error } = await supabase.storage
      .from('vehicle_uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    addChatMessage(`✅ File "${file.name}" uploaded successfully! You can proceed with the next steps.`, 'bot');
    
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle_uploads')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Vehicle file upload failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to upload file';
    
    addChatMessage('❌ Upload failed. Please try again.', 'bot');
    toast.error(errorMessage);
    return null;
  }
}

export async function listVehicleFiles(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from('vehicle_uploads')
      .list(userId);

    if (error) throw error;

    return data.map(file => file.name);
  } catch (error) {
    console.error('Failed to list vehicle files:', error);
    return [];
  }
}

export async function deleteVehicleFile(userId: string, filename: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('vehicle_uploads')
      .remove([`${userId}/${filename}`]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Failed to delete vehicle file:', error);
    toast.error('Failed to delete file');
    return false;
  }
}