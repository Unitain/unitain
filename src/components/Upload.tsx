import { useEffect, useState } from "react";
import { CarIcon, Check, EyeIcon, DownloadIcon, UserIcon, Upload as UploadIcon, ReceiptIcon, FileSpreadsheetIcon, CircleIcon,  TrashIcon, CheckCheck } from "lucide-react"
import { supabase } from "../lib/supabase";
import axios from "axios";
import { useTranslation } from "react-i18next"


export const Upload = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [verifiedFiles, setVerifiedFiles] = useState<boolean[]>(Array(images.length).fill(false));
  const [paymentModal, setPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showReloadWarning, setShowReloadWarning] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnverified = images.some((img) => !img.verified);
      if (hasUnverified) {
        e.preventDefault();
        e.returnValue =
          "You have unverified images that will be lost if you reload. Are you sure?";
        return e.returnValue;
      }
    };

    const hasUnverified = images.some((img) => !img.verified);
    if (hasUnverified) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        const hasUnverified = images.some((img) => !img.verified);
        if (hasUnverified) {
          e.preventDefault();
          setShowReloadWarning(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images]);

  const fetchSubmission = async (userData) => {
    const { data, error } = await supabase
      .from("submission")
      .select("id, images")
      .eq("user_id", userData?.id);

    if (data.length > 0) {
      const latestSubmission = data.at(-1);
      console.log("latestSubmission", latestSubmission?.images);

      setImages(latestSubmission.images);
      setVerifiedFiles(latestSubmission.images.map((img) => img.verified));

      localStorage.setItem(
        "savedImages",
        JSON.stringify(latestSubmission.images)
      );
      console.log(
        "🙌🙌 this is a latest Submission images",
        latestSubmission?.images
      );

      sessionStorage.setItem(
        "allImages",
        JSON.stringify(latestSubmission.images)
      );
    }

    if (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    console.log("not working");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    setUser(userData);

    // Load saved images from localStorage
    const savedImages = JSON.parse(localStorage.getItem("savedImages" || []));
    if (savedImages) {
      setImages(savedImages);
      setVerifiedFiles(savedImages.map((img) => img.verified));
    } else {
      fetchSubmission(userData);
    }
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      console.log(user?.id);

      const { data, error } = await supabase
        .from("users")
        .select("payment_status")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setPaymentStatus(data.payment_status);
        localStorage.setItem("paymentStatus", data.payment_status);

        if (data.payment_status === "approved") {
          setPaymentModal(false);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const savedPaymentStatus = localStorage.getItem("paymentStatus");
    if (savedPaymentStatus) {
      setPaymentStatus(savedPaymentStatus);
    } else {
      fetchPaymentStatus();
    }
  }, [paymentStatus, user]);

  const viewImage = (url: string) => {
    setSelectedImage(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        id: `temp-${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
        verified: false,
        file: file,
      }));
      const updatedImages = [...images, ...newImages];
      setImages((prev) => [...prev, ...newImages]);
      console.log("updatedImages", updatedImages);

      sessionStorage.setItem("allImages", JSON.stringify(updatedImages));
    }
  };

  const handleDelete = async (index: number) => {
    if (!user?.id || !images[index]) return;

    if (!images[index].verified) {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      setVerifiedFiles(updatedImages.map((img) => img.verified));
      sessionStorage.setItem("allImages", JSON.stringify(updatedImages));
      return;
    }

    let { data: submission, error: fetchError } = await supabase
      .from("submission")
      .select("id, images")
      .eq("user_id", user?.id)
      .maybeSingle();

    console.log("submission", submission?.images);

    if (fetchError) {
      console.error("Error fetching submission:", fetchError);
      return;
    }

    if (!submission || !submission?.images || submission?.images.length === 0) {
      console.warn("No submission or images found!");
      return;
    }
    console.log("submission.images[index]", submission.images[index]);

    const fileToDelete = submission.images[index]?.url;
    console.log("🚀 ~ handleDelete ~ fileToDelete:", fileToDelete);

    if (!fileToDelete) {
      console.warn("File URL not found in submission!");
      return;
    }
    const fileName = fileToDelete.split("/").pop();
    console.log("🚀 ~ handleDelete ~ fileName:", fileName);

    const { error: deleteError } = await supabase.storage
      .from("vehicle.uploads")
      .remove([`${user.id}/${fileName}`]);

    if (deleteError) {
      console.error("Error deleting file from storage:", deleteError);
      return;
    }

    console.log("✅ File deleted from storage successfully!");
    // let updatedImages = submission.images.filter(img => img.url !== fileToDelete);
    const updatedImages = submission.images.filter((_, i) => i !== index);
    console.log("🚀 ~ handleDelete ~ updatedImages:", updatedImages);

    const { error: updateError } = await supabase
      .from("submission")
      .update({ images: updatedImages })
      .eq("id", submission.id);

    if (updateError) {
      console.error("Error updating submission:", updateError);
    } else {
      const updatedImages = images.filter((_, i) => i !== index);
      const updatedVerifiedFiles = updatedImages.map((img) => img.verified);
      console.log(
        "🚀 ~ handleDelete ~ updatedVerifiedFiles:",
        updatedVerifiedFiles
      );
      setImages(updatedImages);
      setVerifiedFiles(updatedVerifiedFiles);
      localStorage.setItem(
        "savedImages",
        JSON.stringify(updatedImages.filter((img) => img.verified))
      );
      sessionStorage.setItem("allImages", JSON.stringify(updatedImages));
      console.log("✅ Image removed from submission successfully!");
    }
  };

  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_");
  };

  const handleVerify = async (index: number) => {
    try {
      const imageToVerify = images[index];
      console.log("🚀 ~imageToVerify :", imageToVerify);

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
        .from("vehicle.uploads")
        .upload(fileName, imageToVerify.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("vehicle.uploads")
        .getPublicUrl(fileName);

      const updatedImages = [...images];
      updatedImages[index] = {
        ...updatedImages[index],
        url: urlData.publicUrl,
        verified: true,
        file: undefined,
      };

      setImages(updatedImages);
      setVerifiedFiles(updatedImages.map((img) => img.verified));
      localStorage.setItem(
        "savedImages",
        JSON.stringify(updatedImages.filter((img) => img.verified))
      );
      const sessionImages = JSON.parse(
        sessionStorage.getItem("allImages") || []
      );
      const updatedSessionImages = sessionImages.filter((_, i) => i !== index);
      sessionStorage.setItem("allImages", JSON.stringify(updatedSessionImages));

      let { data: submission, error: fetchError } = await supabase
        .from("submission")
        .select("images, id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching submission:", fetchError);
        return;
      }
      console.log("🚀 ~ handleVerify ~ updatedImages:", updatedImages);

      if (submission) {
        const { error: updateError } = await supabase
          .from("submission")
          .update({ images: updatedImages })
          .eq("id", submission.id);

        if (updateError) {
          console.error("Error updating submission:", updateError);
        } else {
          console.log("Submission updated successfully!");
        }
      } else {
        const { error: insertError } = await supabase
          .from("submission")
          .insert([
            {
              user_id: user?.id,
              payment_status: "pending",
              submission_complete: false,
              images: updatedImages,
            },
          ])
          .select();

        if (insertError) {
          console.error("Error inserting submission:", insertError);
        } else {
          console.log("Submission created successfully!");
        }
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
    }
  };

  const documents = [
    { id: 1, name: "Vehicle Documents", icon: <CarIcon /> },
    { id: 2, name: "Owner's Documents", icon: <UserIcon /> },
    { id: 3, name: "Tax Proof Documents", icon: <ReceiptIcon /> },
    { id: 4, name: "NIF Document", icon: <FileSpreadsheetIcon /> },
  ];

  const handleSubmit = (e: { preventDefault: () => void }) => {
    if (!user?.id) {
      throw new Error("User ID not found");
    }

    setLoading(true);
    e.preventDefault();
    axios
      .post("https://unitain-server.vercel.app/api/payment", {
        user_id: user?.id,
      })
      .then((res) => {
        window.location.href = res.data;
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Payment success handler error:", error);
      });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files).map((file) => ({
        id: `temp-${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
        verified: false,
        file: file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const verifiedCount = images.filter((img) => img.verified).length;
  return (
    <div className="grid grid-cols-1 items-baseline lg:grid-cols-12 gap-6 sm:gap-8">
      <div className="lg:col-span-8 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("upload.title")}
          </h2>

          <label
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ease-in-out block ${
              dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 transition-colors duration-300 text-primary-500" />
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              <span className="hidden sm:inline">{t("upload.dragDrop")}</span>
              <span className="sm:hidden">{t("upload.tapUpload")}</span>
              <span className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
                {t("upload.browse")}
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t("upload.supportedFormats")}
            </p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpeg,.png,.doc"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
        {/* display images setion */}
        <div className="bg-white rounded-xl shadow-neu-flat animate-slide-up">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t("upload.filesTitle")}</h2>
              <span className="text-sm text-gray-500">
                {images.length} {t("upload.filesCount")}
              </span>
            </div>
          </div>

          <div className="flex text-white justify-center p-5 text-center max-h-[496px] overflow-y-auto no-scrollbar scrollbar-none">
            {images.length === 0 ? (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-text mx-auto h-12 w-12 text-gray-400"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t("upload.noFilesTitle")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("upload.noFilesSubtitle")}
                </p>
              </div>
            ) : (
              <ul className="space-y-4 w-full">
                {images.map((file, index) => (
                  console.log("file.verified", file.verified),
                  <li
                    key={file.id}
                    className="flex relative items-center justify-between no-scrollbar px-3 py-3 md:px-5 border rounded-lg cursor-pointer w-full overscroll-contain"
                  >
                    <div className="flex md:w-auto gap-4 items-center mt-4">
                      <img
                        src={file.url}
                        alt="uploaded"
                        className="md:w-16 md:h-16 w-11 h-11 object-contain rounded-lg"
                        />
                      <div>
                      <span className="md:text-sm text-xs text-left text-gray-800">
                        {file.name}
                      </span>
                      {file.verified && (
                      <div className="text-green-700 flex text-xs gap-2 font-medium">
                         <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12l3 3 5-5" />
                        </svg>
                        verified
                      </div>
                    )}
                      </div>
                    </div>
                    <div className="flex gap-4 flex-col items-end">
                      <div className="flex items-center gap-5 text-sm text-gray-500">
                        <p className="md:block hidden">
                          {new Date().toLocaleDateString()}
                        </p>
                        <button onClick={() => viewImage(file.url)}>
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <a href={file.url} download>
                          <DownloadIcon className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => {
                              if (!file.verified) handleVerify(index);
                            }}
                            disabled={file.verified}
                            className={`p-2 rounded-md ${
                              file.verified? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 transition-colors"
                            }`}
                            title={file.verified ? "Already uploaded" : "Upload"}
                          >
                            <UploadIcon className="h-5 w-5" />
                          </button>
                        {file.verified ? (
                          <button
                            onClick={() =>
                              setDeleteIndex(index) || setWarning(true)
                            }
                            className="text-gray-500 cursor-pointer"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 cursor-pointer"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-600 absolute bottom-1 md:hidden">
                        <p className="text-xs">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
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
            <h2 className="text-xl font-semibold text-gray-900">
              {t("upload.progressTitle")}
            </h2>
            <div className="text-sm font-medium text-gray-600">
            </div>
          </div>
            {/* Horizontal traffic light indicator */}
            <div className="flex justify-center mb-4"> 
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full ${
                      index < verifiedCount 
                        ? "bg-green-500" 
                        : index === verifiedCount
                          ? "bg-blue-500 animate-pulse" 
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => {
            const isVerified = verifiedFiles[index];
            const isNextToProcess =  !isVerified && (index === 0 || verifiedFiles[index - 1]) && verifiedFiles.filter(Boolean).length < 4;            
            return (
              <div key={index} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${isVerified? "bg-green-50 border-green-100": isNextToProcess? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"} border`}>
                 <div className={`mr-3 ${isVerified ? "text-green-600"  : isNextToProcess ? "text-blue-500" : "text-gray-400"}`}>
                  {isVerified ? (<Check className="h-6 w-6" />) : (<CircleIcon className="h-6 w-6" />)}
                </div>
                <div className="flex items-center flex-1">
                  <div className={`mr-3 ${isVerified ? "text-green-600" : isNextToProcess ? "text-blue-500" : "text-gray-400" }`}>
                    {doc.icon}
                  </div>
                  <span className={`font-medium ${isVerified? "text-green-600" : isNextToProcess ? "text-blue-600" : "text-gray-500"}`}>{doc.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg">
          {verifiedFiles.filter(Boolean).length >= 4 ? (
            <div className="text-center text-sm text-green-500 font-semibold mb-4">
              {t("upload.allVerified")}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 mb-4">
              {verifiedFiles.filter(Boolean).length > 0 ? (
                <span className="text-blue-600 font-medium">
                  {4 - verifiedFiles.filter(Boolean).length} {t("upload.moreToVerify")}
                </span>
              ) : (
                <span>{t("upload.startHint")}</span>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (verifiedFiles.filter(Boolean).length >= 4) {
                if (paymentStatus === "approved") {
                  setIsPaid(true);
                } else {
                  if (localStorage.getItem("paymentStatus") === "approved") {
                    setIsPaid(true);
                    setPaymentModal(false);
                  } else {
                    setPaymentModal(true);
                  }
                }
              }
            }}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${
                  verifiedFiles.filter(Boolean).length >= 4
                    ? "bg-green-600 text-white cursor-pointer hover:bg-green-700 focus:ring-green-500"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
          >
            {paymentStatus === "approved"
              ? t("upload.paymentDone")
              : t("upload.startProcess")}
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-lg max-h-[80vh]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="block mx-auto mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}

      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg">
            <h1 className="text-xl font-semibold">{t("upload.modalTitle")}</h1>
            <p>{t("upload.modalDescription")}</p>
            <div className="flex justify-end mt-10 gap-5">
              <button
                onClick={() => setPaymentModal(false)}
                className="bg-gray-100 p-3 px-4 rounded-lg"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary-600 text-white px-4 p-3 rounded-lg"
              >
                {loading ? t("upload.loadingPay") : t("upload.startPay")}
              </button>
            </div>
          </div>
        </div>
      )}

      {warning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("upload.warningTitle")}
            </h3>
            <p className="text-gray-600 mb-6">{t("upload.warningMessage")}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setWarning(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => {
                  if (deleteIndex !== null) {
                    handleDelete(deleteIndex);
                    setDeleteIndex(null);
                    setWarning(false);
                  }
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="flex flex-col items-center px-8 pt-10 pb-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {t("upload.alreadyPaidTitle")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("upload.alreadyPaidMessage")}
              </p>
              <button
                onClick={() => setIsPaid(false)}
                className="px-8 py-3 text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReloadWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("upload.reloadTitle")}
            </h3>
            <p className="text-gray-600 mb-6">{t("upload.reloadMessage")}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReloadWarning(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => setShowReloadWarning(false)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {t("upload.reloadAnyway")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
