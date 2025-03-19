
// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Upload as UploadIcon, X } from 'lucide-react';
// import { useFiles } from '../context/FileContext';
// import { handleError } from '../utils/errorHandling';
// import { FileSchema } from '../types/type';
// import { supabase } from "../lib/supabase";
// import { UploadProgress } from './UploadProgress';
// import { FileList } from './FileList';
// import toast from 'react-hot-toast';

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_TYPES = {
//   'application/pdf': ['.pdf'],
//   'image/jpeg': ['.jpg', '.jpeg'],
//   'image/png': ['.png'],
//   'application/msword': ['.doc'],
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
// };

// interface UploadProgress {
//   fileName: string;
//   progress: number;
// }

export function Upload() {
  // const { addFile } = useFiles();

  // const [uploadGuide, setUploadGuide] = useState(false)
  // const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  // const [files, setFiles] = useState<FileItem[]>([]);

  // const validateFile = (file: File) => {
  //   if (file.size > MAX_FILE_SIZE) {
  //     throw new Error(`Die Datei "${file.name}" ist zu groß. Maximale Größe: 10MB`);
  //   }
  //   if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
  //     throw new Error(`Der Dateityp von "${file.name}" wird nicht unterstützt`);
  //   }
  // };

  // const simulateUploadProgress = (fileName: string) => {
  //   let progress = 0;
  //   const interval = setInterval(() => {
  //     progress += 10;
  //     setUploadProgress({ fileName, progress: Math.min(progress, 100) });
      
  //     if (progress >= 100) {
  //       clearInterval(interval);
  //       setTimeout(() => setUploadProgress(null), 500);
  //     }
  //   }, 200);
  // };

  // const onDrop = useCallback(async (acceptedFiles: File[]) => {

  //   for (const file of acceptedFiles) {
  //     try {
  //       if (files.some((existingFile) => existingFile.name === file.name)) {
  //         toast.error(`"${file.name}" already exists!`);
  //         continue;
  //       }

  //       validateFile(file);
  //       simulateUploadProgress(file.name);
  //       console.log("Uploading file:", file.name);
      
  //       const timestamp = Date.now();
  //       const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  //       const uniqueFileName = `${timestamp}_${sanitizedFileName}`;        


  //         const { data, error } = await supabase.storage
  //             .from("vehicle_uploads")
  //             .upload(uniqueFileName, file, {
  //               cacheControl: "3600",
  //               upsert: false,
  //             });
        
  //           console.log("🔹 Upload response received. Data:", data, "Error:", error);
        
  //           if (error) {
  //             console.error("🚨 Supabase upload error:", error);
  //             throw error;
  //           }
        
  //           if (!data?.path) {
  //             throw new Error("Upload failed - no path returned");
  //           }
        
  //           const { data: publicUrlData } = supabase.storage
  //             .from("vehicle_uploads")
  //             .getPublicUrl(data.path);
  //              console.log("🔹 Public URL Data:", publicUrlData);
        
  //           if (!publicUrlData?.publicUrl) {
  //             throw new Error("Failed to generate public URL");
  //           }
        
  //       const newFile = {
  //         id: crypto.randomUUID(),
  //         name: file.name,
  //         size: file.size,
  //         type: file.type,
  //         created_at: new Date().toISOString(),
  //         url: publicUrlData?.publicUrl,
  //         path: data.path
  //       };
        
  //       console.log("🚨newFile", newFile);

  //       // Validate file data against schema
  //       FileSchema.parse(newFile);
        
  //       // Simulate network delay
  //       await new Promise(resolve => setTimeout(resolve, 2000));
        
  //       await addFile(newFile);
  //       toast.success(`"${file.name}" wurde erfolgreich hochgeladen`);
  //     } catch (error) {
  //       handleError(error, 'FileUpload');
  //     }
  //   }
  // }, [addFile, files]);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: ALLOWED_TYPES,
  //   maxSize: MAX_FILE_SIZE,
  //   onError: (error) => handleError(error, 'Dropzone'),
  // });

  // // or trigger the file input click directly.
  // // const handleContainerClick = (e: React.MouseEvent) => {
  // //   e.preventDefault();
  // //   const modalShown = localStorage.getItem('UploadGuideShown');
  // //   if (modalShown !== 'true') {
  // //     setUploadGuide(true);
  // //   } else {
  // //     document.getElementById('fileInput')?.click();
  // //   }
  // // };

  // // Combine Dropzone's root props with our custom onClick
  // const rootPropsWithClick = {
  //   ...getRootProps(),
  //   // onClick: handleContainerClick,
  // };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    {/* {uploadGuide && (
      <div className="fixed inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-20 z-50">
        <div className="bg-white p-10 rounded shadow-md max-w-lg relative">
          <div className="absolute right-6 top-5 cursor-pointer" onClick={() => setUploadGuide(false)}><X /></div>
          <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
          <p className="mb-5">
            Here you can test our upload process by uploading any files— these can be placeholder files (e.g., an empty PDF) or real documents if you wish. We process all data securely and discreetly. It’s not mandatory for the beta test, but it demonstrates how the upload step works in a real scenario.
          </p>
          <div className="flex justify-end gap-4">
            <button onClick={() => setUploadGuide(false)} className="border p-3 rounded-md border-black">
              Cancel
            </button>
            <button
              className="border p-3 rounded-md bg-black text-white"
                onClick={() => {
                  localStorage.setItem('UploadGuideShown', 'true');
                  setUploadGuide(false);
                  document.getElementById('fileInput')?.click();
                }}
              >
              Upload document
            </button>
          </div>
        </div>
      </div>
      )} */}

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
      {/* <div
        {...rootPropsWithClick}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ease-in-out touch-manipulation
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 scale-102' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
      >
        <input id="fileInput" {...getInputProps()} />
        <UploadIcon 
          className={`mx-auto h-10 sm:h-12 w-10 sm:w-12 transition-colors duration-300
            ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`}
        />
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          {isDragActive ? (
            "Drop files here..."
          ) : (
            <>
              <span className="hidden sm:inline">Drag & drop files here, or </span>
              <span className="sm:hidden">Tap to upload or </span>
              <span className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
                browse files
              </span>
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Supported formats: PDF, JPEG, PNG, DOC (Max 10MB)
        </p>
        
        {uploadProgress && (
          <UploadProgress 
            fileName={uploadProgress.fileName}
            progress={uploadProgress.progress}
          />
        )}
      </div> */}
    </div>
  );
}

export default Upload;