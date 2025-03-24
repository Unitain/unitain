import { useEffect, useState } from 'react'
import {UploadIcon} from "lucide-react"
import { supabase } from '../lib/supabase'

export const Upload = () => {
  const [images, setImages] = useState<File[]>([])
  const [selectedImage ,setSelectedImage] = useState(null)
  const [user, setUser] = useState(null)
  const [verifiedFiles, setVerifiedFiles] = useState<boolean[]>(Array(images.length).fill(false));
  const [paymentModal, setPaymentModal] = useState(false)
  console.log("🚀 ~ Upload ~ verifiedFiles:", verifiedFiles)

  useEffect(()=>{
    const useData = JSON.parse(localStorage.getItem("userData"))
    setUser(useData)
  },[])

  const viewImage = (file) => {
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleFileChange = (event: { target: { files: any; }; }) => {
    const files = event.target.files;
    if (files.length > 0) {
       setImages((prevImages) => [...prevImages, ...files]);
    }
  };


const handleDelete = async (index: number) => {
  if (!user?.id || !images[index]) return;

  let { data: submission, error: fetchError } = await supabase
    .from('submission')
    .select('id, images')
    .eq('user_id', user?.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching submission:", fetchError);
    return;
  }

  if (!submission || !submission.images || submission.images.length === 0) {
    console.warn("No submission or images found!");
    return;
  }
  const fileToDelete = submission.images[index]?.publicUrl;
  console.log("🚀 ~ handleDelete ~ fileToDelete:", fileToDelete)
  
  if (!fileToDelete) {
    console.warn("File URL not found in submission!");
    return;
  }
  const fileName = fileToDelete.split('/').pop(); 
  console.log("🚀 ~ handleDelete ~ fileName:", fileName)
  const filePath = `${user?.id}/${fileName}`;

  console.log("Deleting file:", filePath);

  const { error: deleteError } = await supabase.storage
    .from('vehicle.uploads')
    .remove([filePath]);

  if (deleteError) {
    console.error("Error deleting file from storage:", deleteError);
    return;
  }

  console.log("✅ File deleted from storage successfully!");
  let updatedImages = submission.images.filter(img => img.publicUrl !== fileToDelete);

  const { error: updateError } = await supabase
    .from('submission')
    .update({ images: updatedImages })
    .eq('id', submission.id);

  if (updateError) {
    console.error("Error updating submission:", updateError);
  } else {
    console.log("✅ Image removed from submission successfully!");
  }
  setVerifiedFiles(prev => prev.filter((_, i) => i !== index))
  setImages(prev => prev.filter((_, i) => i !== index));
};


  const handleVerify = async(index: number) => {
    if (verifiedFiles[index]){ alert("this image is already verified"); return};

    console.log("Verifying index:", index);

    const fileName = `${user?.id}/${Date.now()}_${images[index].name}`;
    const { data, error } = await supabase.storage
    .from('vehicle.uploads')
    .upload(fileName, images[index], {
      cacheControl: '3600',
      upsert: false
    })
    if (data) {
      console.log("Upload successful:", data);
      setVerifiedFiles((prev) => { const updatedFiles = [...prev]; updatedFiles[index] = true; return updatedFiles;});

      const { data: url } = supabase.storage
      .from('vehicle.uploads')
      .getPublicUrl(fileName)
      
      let { data: submission, error: fetchError } = await supabase
      .from('submission')
      .select('images, id')
      .eq('user_id', user?.id) 
      .maybeSingle();

      if (fetchError) {
        console.error("Error fetching submission:", fetchError);
        return;
      }

      let imagesArray = submission?.images || [];
      imagesArray.push({publicUrl: url.publicUrl,status: "verified",});
      
      if (submission) {
        const { error: updateError } = await supabase
          .from('submission')
          .update({ images: imagesArray })
          .eq('id', submission.id); 
    
        if (updateError) {
          console.error("Error updating submission:", updateError);
        } else {
          console.log("Submission updated successfully!");
        }
      } else {
        const { error: insertError } = await supabase
          .from('submission')
          .insert([{user_id: user?.id, payment_status: 'pending', submission_complete: false, images: imagesArray,},])
          .select(); 

          if (insertError) {
            console.error("Error inserting submission:", insertError);
          } else {
            console.log("Submission created successfully!");
          }
     }

      
    } else {
      console.error("Upload failed:", error);
    }
  
  };

  const documents = [
    { id: 1, name: "Vehicle Documents", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car h-5 w-5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>  },
    { id: 2, name: "Owner's Documents", icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, uploaded: false },
    { id: 3, name: "Tax Proof Documents", icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt h-5 w-5"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg> },
    { id: 4, name: "NIF Document", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet h-5 w-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M8 13h2"></path><path d="M14 13h2"></path><path d="M8 17h2"></path><path d="M14 17h2"></path></svg>}
  ];  
  
  return (
    <div className='grid grid-cols-1 items-baseline lg:grid-cols-12 gap-6 sm:gap-8'>
      
     <div className='lg:col-span-8 space-y-6 sm:space-y-8'>
       <div className=' bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up'>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
          <label className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ease-in-out block">
            <UploadIcon  className={`mx-auto h-10 sm:h-12 w-10 sm:w-12 transition-colors duration-300 text-primary-500`} />
            <p className="mt-4 text-sm sm:text-base text-gray-600">
                <>
                  <span className="hidden sm:inline">Drag & drop files here, or </span>
                  <span className="sm:hidden">Tap to upload or </span>
                  <span className="text-primary-600 hover:text-primary-700 transition-colors duration-300">browse files</span>
                </>
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
            <span className="text-sm text-gray-500">0 files</span>
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
                {images.map((file, index) => (
                  <li key={index} className='flex items-center justify-between px-3 py-3 md:px-5 border rounded-lg cursor-pointer w-full overflow-scroll'>
                    <div className='flex gap-4 items-center'>
                      <img src={URL.createObjectURL(file)} alt="uploaded" className="w-16 h-16 object-cover rounded-lg" />
                      <span className='text-sm text-left text-gray-800'>{file.name}</span>
                    </div>                     
                    <div className='flex items-center gap-5 text-sm text-gray-500'>
                      <p>{new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
                      <div className='curson-pointer' onClick={() => viewImage(file)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-5 w-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>
                      <div ><a href={URL.createObjectURL(file)} download><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg></a></div>
                      <button  onClick={() => handleVerify(index)} className={`${verifiedFiles[index] ? 'bg-green-500 text-white' : 'bg-gray-100'} px-3 py-1 rounded transition-all`}>{verifiedFiles[index] ? 'Verified' : 'Verify'}</button>
                      <div onClick={()=> handleDelete(index)} className='text-red-500 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 h-5 w-5 "><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></div>
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
                <div className="text-sm font-medium text-gray-600"><span>{verifiedFiles.filter(Boolean).length}/4 verified</span> verified</div>
          </div>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => {
            const isVerified = verifiedFiles[index];
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

      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg">      
            <h1 className='text-xl font-semibold'>Confirm Proccess</h1>
            <p>Would you like to place a paid order?</p>
            <div className='flex justify-end mt-10 gap-5'>
              <button onClick={() => setPaymentModal(false)} className='bg-gray-100 p-3 px-4 rounded-lg'>Cancel</button>
              <button className='bg-primary-600 text-white px-4 p-3 rounded-lg'>Ok</button>
            </div>
          </div>
        </div>
      )}
  </div>
  )
}


