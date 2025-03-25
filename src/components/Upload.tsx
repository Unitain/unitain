import { useEffect, useState } from 'react'
import { UploadIcon, CarIcon, EyeIcon, DownloadIcon, UserIcon, ReceiptIcon, FileSpreadsheetIcon, CircleIcon,  TrashIcon } from "lucide-react"
import { supabase } from '../lib/supabase'

export const Upload = () => {
  const [images, setImages] = useState<File[]>([])
  const [selectedImage ,setSelectedImage] = useState(null)
  const [user, setUser] = useState(null)
  const [verifiedFiles, setVerifiedFiles] = useState<boolean[]>(Array(images.length).fill(false));
  const [paymentModal, setPaymentModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || 'null')
    setUser(userData)
    
    // Load saved images from localStorage
    const savedImages = JSON.parse(localStorage.getItem("savedImages" || []))
    if(savedImages){
    setImages(savedImages)
    setVerifiedFiles(savedImages.map(img => img.verified)); 
    }
  }, [])

  const viewImage = (url: string) => {
    setSelectedImage(url)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        id: `temp-${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
        verified: false,
        file: file
      }))

      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleDelete = async (index: number) => {
    const imageToDelete = images[index]
    
    if (imageToDelete.verified) {

      const fileName = imageToDelete.url.split('/').pop()
      if (fileName && user?.id) {
          await supabase.storage
        .from('vehicle.uploads')
        .remove([`${user.id}/${fileName}`])
      }
      } else {
        URL.revokeObjectURL(imageToDelete.url)
      }

      const updatedImages = images.filter((_, i) => i !== index)
      const updatedVerifiedFiles = updatedImages.map(img => img.verified);
      setImages(updatedImages)
      setVerifiedFiles(updatedVerifiedFiles)
      localStorage.setItem('savedImages', JSON.stringify(updatedImages.filter(img => img.verified)))
  }

  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_");
  };

  
  const handleVerify = async (index: number) => {
    try {
      const imageToVerify = images[index];
  
      if (imageToVerify.verified) {
        alert("This image is already verified");
        return;
      }
  
      if (!imageToVerify.file || !user?.id) {
        alert("Missing file data or user information");
        return;
      }
      const safeFileName = sanitizeFileName(imageToVerify.name); 
      const fileName = `${user.id}/${Date.now()}_${safeFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('vehicle.uploads')
        .upload(fileName, imageToVerify.file, {
          cacheControl: '3600',
          upsert: false,
        });
  
      if (uploadError) throw uploadError;
  
      const { data: urlData } = supabase.storage
        .from('vehicle.uploads')
        .getPublicUrl(fileName);
  
      const updatedImages = [...images];
      updatedImages[index] = {
        ...updatedImages[index],
        url: urlData.publicUrl,
        verified: true,
        file: undefined,
      };
  
      setImages(updatedImages);
      setVerifiedFiles(updatedImages.map(img => img.verified))
      localStorage.setItem(
        'savedImages',
        JSON.stringify(updatedImages.filter((img) => img.verified))
      );

    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
    }
  };

  const documents = [
    { id: 1, name: "Vehicle Documents", icon: <CarIcon /> },
    { id: 2, name: "Owner's Documents", icon: <UserIcon /> },
    { id: 3, name: "Tax Proof Documents", icon: <ReceiptIcon /> },
    { id: 4, name: "NIF Document", icon: <FileSpreadsheetIcon /> }
  ];

  const handlePayment = () =>{
    
  }

  const verifiedCount = images.filter(img => img.verified).length
  return (
    <div className='grid grid-cols-1 items-baseline lg:grid-cols-12 gap-6 sm:gap-8'>
        <div className='lg:col-span-8 space-y-6 sm:space-y-8'>
          <div className='bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up'>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
          <label className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ease-in-out block">
            <UploadIcon  className={`mx-auto h-10 sm:h-12 w-10 sm:w-12 transition-colors duration-300 text-primary-500`} />
            <p className="mt-4 text-sm sm:text-base text-gray-600">
                  <span className="hidden sm:inline">Drag & drop files here, or </span>
                  <span className="sm:hidden">Tap to upload or </span>
                  <span className="text-primary-600 hover:text-primary-700 transition-colors duration-300">browse files</span>
            </p>
            <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPEG, PNG, DOC (Max 10MB)</p>
            <input type='file' className='hidden' accept='.pdf,.jpeg,.png,.doc' multiple onChange={handleFileChange} />
           </label>
      </div>
      {/* display images setion */}
      <div className='bg-white rounded-xl shadow-neu-flat animate-slide-up'>
         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Uploaded Files</h2>
            <span className="text-sm text-gray-500">{images.length} files</span>
          </div>
        </div>

          <div className='overflow-auto max-h-[440px] text-center py-6 overscroll-contain p-6'>
            {images.length === 0 ? (
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-file-text mx-auto h-12 w-12 text-gray-400'><path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'></path><path d='M14 2v4a2 2 0 0 0 2 2h4'></path><path d='M10 9H8'></path><path d='M16 13H8'></path><path d='M16 17H8'></path></svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>No files</h3>
                <p className='mt-1 text-sm text-gray-500'>Upload files to get started</p>
              </div>
            ) : (
              <ul className='space-y-4'>
                {images.length > 0 && images.map((file, index) => (
                  console.log("images", images),
                  
                  <li key={file.id} className='flex items-center justify-between px-3 py-3 md:px-5 border rounded-lg cursor-pointer w-full overflow-scroll'>
                    <div className='flex gap-4 items-center'>
                      <img  src={file.url} alt="uploaded" className="w-16 h-16 object-cover rounded-lg" />
                      <span className='text-sm text-left text-gray-800'>{file.name}</span>
                    </div>                     
                    <div className='flex items-center gap-5 text-sm text-gray-500'>
                      <p>{new Date().toLocaleDateString()}</p>
                      <button onClick={() => viewImage(file.url)}><EyeIcon className="h-5 w-5" /></button>
                      <a href={file.url} download><DownloadIcon className="h-5 w-5" /></a>
                      <button 
                        onClick={() => file.verified ? null : handleVerify(index)}
                        className={`${file.verified ? 'bg-green-500 text-white' : 'bg-gray-100'} px-3 py-1 rounded transition-all`}
                        disabled={file.verified}
                      >
                        {file.verified ? 'Verified' : 'Verify'}
                      </button>
                      <button onClick={() => handleDelete(index)} className='text-red-500 cursor-pointer'>
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>
    </div>


      {/* progres */}
      <div className="lg:col-span-4 space-y-6 sm:space-y-8 bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up">
        <div className="border-b border-gray-100">
          <div className="flex gap-5 items-center justify-between mb-7">
                <h2 className="text-xl font-semibold text-gray-900">Document Progress</h2>
                <div className="text-sm font-medium text-gray-600"><span>{verifiedCount}/4 verified</span> verified</div>
          </div>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => {
            const isVerified = verifiedFiles[index];
            console.log("verify", verifiedFiles);
            console.log("index", index);
            
            console.log("🚀 ~ {documents.map ~ isVerified:", isVerified)
            return (
              <div key={index} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${isVerified ? "bg-green-50 border-blue-100" : "bg-gray-50 border-gray-100"} border`}>
                <div className={`mr-3 ${isVerified ? "text-green-600" : "text-gray-400"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle h-6 w-6"><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                <div className="flex items-center flex-1">
                  <div className={`mr-3 ${isVerified ? "text-green-600" : "text-gray-400"}`}>{doc.icon}</div>
                  <span className={`font-medium ${isVerified ? "text-green-600" : "text-gray-500"}`}>{doc.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg">
            {verifiedFiles.filter(Boolean).length >= 4 ? (
              <div className="text-center text-sm text-green-500 font-semibold mb-4">All required documents have been verified</div>
            ):(
              <div className="text-center text-sm text-gray-500 mb-4">Start by uploading and verifying your first document</div>
            )}
          <button
            onClick={verifiedFiles.filter(Boolean).length >= 4 ? () => setPaymentModal(true) : undefined}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${verifiedFiles.filter(Boolean).length >= 4 
                ? "bg-green-600 text-white cursor-pointer hover:bg-green-700 focus:ring-green-500" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                disabled={verifiedFiles.filter(Boolean).length < 4}
              >
              Start Process
          </button>
        </div>
      </div>


      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <img src={selectedImage} alt="Preview" className="max-w-lg max-h-[80vh]" />
            <button onClick={() => setSelectedImage(null)} className="block mx-auto mt-4 px-4 py-2 bg-red-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg">      
            <h1 className='text-xl font-semibold'>Confirm Proccess</h1>
            <p>Would you like to place a paid order?</p>
            <div className='flex justify-end mt-10 gap-5'>
              <button onClick={() => setPaymentModal(false)} className='bg-gray-100 p-3 px-4 rounded-lg'>Cancel</button>
              <button onClick={handlePayment} className='bg-primary-600 text-white px-4 p-3 rounded-lg'>Ok</button>
            </div>
          </div>
        </div>
      )}
  </div>
  )
}


