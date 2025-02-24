import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { uploadVehicleFile } from '../lib/storage';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

export function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const url = await uploadVehicleFile(file, user.id);
      if (url) {
        toast.success('File uploaded successfully!');
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