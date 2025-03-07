import React, { useState, useRef, useEffect } from "react";
import { Upload as UploadIcon, Loader2, FileText, Trash2, X } from "lucide-react";
import { Button } from "./Button";
import {
  uploadVehicleFile,
  listVehicleFiles,
  deleteVehicleFile,
} from "../lib/storage";
import { useAuthStore } from "../lib/store";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface FileItem {
  name: string;
  url: string;
  uploadedAt: string;
}

export function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userFiles, setUserFiles] = useState<FileItem[]>([]);
    const [uploadGuide, setUploadGuide] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<any>(null);
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchUserFiles();
    }

    return () => {
      setIsUploading(false);
      setUserFiles([]);
    };
  }, [user]); // Runs when `user` changes

  const fetchUserFiles = async () => {
    if (!user?.id) {
      console.warn("⚠️ No user ID found, skipping fetch.");
      return;
    }
    try {
      setIsLoading(true);

      // Fetch files from storage (Ensure we await properly)
      const fileNames = await listVehicleFiles(user.id);
      console.log("🚀 ~ fetchUserFiles ~ fileNames:", fileNames);

      // Fetch submissions from database
      const { data: submissions, error } = await supabase
        .from("submission")
        .select("document, created_at")
        .eq("id", user.id);

      if (error) {
        console.error("❌ Error fetching submissions:", error);
        throw new Error("Failed to fetch submissions");
      }

      console.log("🚀 ~ fetchUserFiles ~ submissions:", submissions);

      // Combine files from storage & database
      const files: FileItem[] = [];

      // Add files from storage
      fileNames.forEach((name) => {
        const url = `${supabase.supabaseUrl}/storage/v1/object/public/vehicle_uploads/${user.id}/${name}`;
        console.log("📂 Storage File URL:", url);
        files.push({ name, url, uploadedAt: "Unknown date" });
      });

      // Add files from submissions if they exist
      if (submissions && Array.isArray(submissions)) {
        submissions.forEach((submission) => {
          if (submission.document) {
            const documentUrl = submission.document;
            const fileName = documentUrl.split("/").pop() || "document";

            if (!files.some((f) => f.url === documentUrl)) {
              files.push({
                name: fileName,
                url: documentUrl,
                uploadedAt: submission.created_at
                  ? new Date(submission.created_at).toLocaleString()
                  : "Unknown date",
              });
            }
          }
        });
      }

      setUserFiles(files);
      console.log("✅ Final File List:", files);
    } catch (error) {
      console.error("🚨 Failed to fetch user files:", error);
      toast.error("Failed to load your uploaded files");
    } finally {
      setIsLoading(false); // Always ensure loading state is stopped
    }
  };

  const handleUpload = async (event: any) => {
    setIsUploading(true);
    const file = event?.target?.files?.[0];
    if (!file || !user) return;

    try {
      // Upload file and get URL
      const url = await uploadVehicleFile(file, user.id);
      console.log("🚀 ~ handleUpload ~ url:", url);
      if (url) {
        // Check if a submission already exists
        const { data: existingSubmission } = await supabase
          .from("submission")
          .select("id")
          .eq("id", user.id)
          .limit(1);

        if (existingSubmission && existingSubmission.length > 0) {
          // Update existing submission
          const { error } = await supabase
            .from("submission")
            .update({
              document: url,
              updated_at: new Date().toISOString(),
              submission_complete: true,
            })
            .eq("id", user.id);

          if (error) {
            console.error("Database update failed:", error);
            toast.error("Failed to update document record.");
          } else {
            toast.success("File uploaded successfully!");
            fetchUserFiles();
          }
        } else {
          // Insert new submission
          const { error } = await supabase.from("submission").insert([
            {
              id: user.id,
              document: url,
              created_at: new Date().toISOString(),
              payment_status: "paid",
              submission_complete: true,
              guide_downloaded: false,
            },
          ]);

          if (error) {
            console.error("Database insert failed:", error);
            toast.error("Failed to save document record.");
          } else {
            toast.success("File uploaded successfully!");
            fetchUserFiles();
          }
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // const handleDeleteFile = async (fileName: string) => {
  //   if (!user?.id) return;    

  //   setIsDeleting(fileName);
  //   try {
  //     const success = await deleteVehicleFile(user.id, fileName);
  //     if (success) {
  //       toast.success("File deleted successfully");
  //       console.log("✅ deleting");
        
  //       fetchUserFiles();
  //     } else {
  //       throw new Error("Failed to delete file");
  //       console.log("✅ not deleteing");
        
  //     }
  //   } catch (error) {
  //     console.error("Delete failed:", error.message);
  //     toast.error("Failed to delete file. Please try again.");
  //   } finally {
  //     setIsDeleting(null);
  //   }
  // };
  const handleDeleteFile = async (fileName: string) => {
    if (!user?.id) return;    
    setIsDeleting(fileName);
    try {
      const success = await deleteVehicleFile(user.id, fileName);
      if (success) {
        // Remove or update the submission record if it exists
        await supabase
          .from("submission")
          .update({ document: null })
          .eq("id", user.id);
          
        toast.success("File deleted successfully");
        fetchUserFiles();
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete failed:", error.message);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };
  

  const handleOpenModal = () => {
    const modalShown = localStorage.getItem('UploadGuideShown');
    if (modalShown === 'true') {
      // Already shown before; trigger file input directly
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      setUploadGuide(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {uploadGuide && (
      <div className="fixed text-center cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-10 rounded shadow-md max-w-lg relative">
          <div className='absolute right-6 top-5' onClick={()=> setUploadGuide(false)}><X/></div>
          <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
          <p className="mb-5">Here you can test our upload process by uploading any files— these can be placeholder files (e.g., an empty PDF) or real documents if you wish. We process all data securely and discreetly. It’s not mandatory for the beta test, but it demonstrates how the upload step works in a real scenario.</p>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setUploadGuide(false)}>
              Cancel
            </Button>
            <Button
                variant="primary"
                onClick={() => {
                  // Mark modal as shown and trigger file input
                  localStorage.setItem('UploadGuideShown', 'true');
                  setUploadGuide(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
               Upload document
            </Button>
          </div>
        </div>
      </div>
      )}
      <div className="flex flex-col items-center gap-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleUpload}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          id="file-upload"
        />

           {/* Clickable div to open modal */}
           <div className="cursor-pointer" onClick={handleOpenModal}>
           <div className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition" >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadIcon className="w-6 h-6" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Supported formats: PDF, JPEG, PNG, DOC
        </p>
      </div>
      {/* <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        // className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      /> 
       <Button
        onClick={() => {
          if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UploadIcon className="w-5 h-5" />
        )}
        {isUploading ? "Uploading..." : "Upload Documents"}
      </Button>
       <p className="text-sm text-gray-500">
        Supported formats: PDF, JPEG, PNG, DOC
      </p> */}

      {/* File List */}
      <div className="w-full mt-4">
        <h3 className="text-lg font-medium mb-2">Your Uploaded Files</h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : userFiles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No files uploaded yet
          </p>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {userFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.uploadedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    // disabled={isDeleting === file.name}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Delete file"
                  >
                    {/* {isDeleting === file.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : ( */}
                      <Trash2 className="w-4 h-4" />
                    {/* )} */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
