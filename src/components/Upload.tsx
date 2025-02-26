import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { uploadVehicleFile } from '../lib/storage';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
  
    setIsUploading(true);
    try {
      // Upload file and get URL
      const url = await uploadVehicleFile(file, user.id);
      if (url) {
        // Insert record into Supabase
        // documents
        const { error } = await supabase
          .from('submission')
          .insert([
            {
              id: user.id,
              document: url,
              created_at: new Date().toISOString(),  
              payment_status: 'paid', 
              submission_complete: true,
              guide_downloaded: false
            },
          ]);
              console.log("🚀 ~ handleUpload ~ url:", url)
  
        if (error) {
          console.error('Database insert failed:', error);
          toast.error('Failed to save document record.');
        } else {
          toast.success('File uploaded and document record created!');
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UploadIcon className="w-5 h-5" />
        )}
        {isUploading ? 'Uploading...' : 'Upload Documents'}
      </Button>
      
      <p className="text-sm text-gray-500">
        Supported formats: PDF, JPEG, PNG, DOC
      </p>
    </div>
  );
}

export default Upload;