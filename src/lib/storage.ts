import { supabase } from "./supabase";
import toast from "react-hot-toast";
import { addSystemMessage } from "./chat";

const GUIDE_URL =
  "https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/object/public/guides_open/unitan-guide.pdf";

export async function downloadGuide(): Promise<boolean> {
  try {
    console.log("Starting guide download:", GUIDE_URL);

    const response = await fetch(GUIDE_URL);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "unitan-guide.pdf";
    link.style.display = "none";
    document.body.appendChild(link);

    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    addSystemMessage(
      "✅ Guide downloaded successfully! You can now proceed with the next steps."
    );
    return true;
  } catch (error) {
    console.error("Guide download failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to download guide. Please check your internet connection and try again.";

    addSystemMessage("❌ Failed to download guide. Please try again.");
    toast.error(errorMessage);
    return false;
  }
}
export async function uploadVehicleFile(
  file: File,
  userId: string
): Promise<string | null> {
  console.log(
    "🔹 uploadVehicleFile called with file:",
    file.name,
    "User ID:",
    userId
  );

  try {
    if (!userId) {
      throw new Error("User ID is required for upload");
    }

    if (file.size > 52428800) {
      throw new Error("File size exceeds 50MB limit");
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload PDF, Word, or image files."
      );
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${userId}/${timestamp}_${safeFilename}`;

    console.log("🚀 ~ Preparing to upload filePath:", filePath);

    // Upload the file
    const { data, error } = await supabase.storage
      .from("vehicle_uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("🔹 Upload response received. Data:", data, "Error:", error);

    if (error) {
      console.error("🚨 Supabase upload error:", error);
      throw error;
    }

    if (!data?.path) {
      throw new Error("Upload failed - no path returned");
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("vehicle_uploads")
      .getPublicUrl(data.path);
    console.log("🔹 Public URL Data:", publicUrlData);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    addSystemMessage(`✅ File "${file.name}" uploaded successfully!`);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("❌ Vehicle file upload failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload file. Please try again.";

    addSystemMessage("❌ Upload failed. Please try again.");
    toast.error(errorMessage);
    return null;
  }
}

// export async function uploadVehicleFile(
//   file: File,
//   userId: string
// ): Promise<string | null> {
//   try {
//     if (!userId) {
//       throw new Error("User ID is required for upload");
//     }

//     if (file.size > 52428800) {
//       // 50MB limit
//       throw new Error("File size exceeds 50MB limit");
//     }

//     const allowedTypes = [
//       "application/pdf",
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       throw new Error(
//         "Invalid file type. Please upload PDF, Word, or image files."
//       );
//     }

//     // Create a clean filename
//     const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
//     const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//     const filePath = ${userId}/${timestamp}_${safeFilename};

//     console.log("🚀 ~ filePath:", filePath);
//     // Upload the file
//     const { data, error } = await supabase.storage
//       .from("vehicle_uploads")
//       .upload(filePath, file, {
//         cacheControl: "3600",
//         upsert: false,
//       });
//     console.log("🚀 ~ error:", error);
//     console.log("🚀 ~ data:", data);

//     if (error) {
//       console.error("Supabase upload error:", error);
//       throw error;
//     }

//     if (!data?.path) {
//       throw new Error("Upload failed - no path returned");
//     }

//     // Get the public URL
//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("vehicle_uploads").getPublicUrl(data.path);

//     if (!publicUrl) {
//       throw new Error("Failed to generate public URL");
//     }
//     addSystemMessage(✅ File "${file.name}" uploaded successfully!);

//     return publicUrl;
//   } catch (error) {
//     console.error("Vehicle file upload failed:", error);
//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "Failed to upload file. Please try again.";

//     addSystemMessage("❌ Upload failed. Please try again.");
//     toast.error(errorMessage);
//     return null;
//   }
// }

// export async function listVehicleFiles(userId: string): Promise<string[]> {
//   console.log("🚀 ~ listVehicleFiles ~ userId:", userId);
//   try {
//     if (!userId) {
//       throw new Error("User ID is required");
//     }

//     const { data, error } = await supabase.storage
//       .from("vehicle_uploads")
//       .list(userId);

//     if (error) {
//       return [];
//     }

//     return data.map((file) => file.name);
//   } catch (error) {
//     console.error("Failed to list vehicle files:", error);
//     return [];
//   }
// }
export async function listVehicleFiles(userId: string): Promise<string[]> {
  console.log("🚀 ~ listVehicleFiles ~ userId:", userId);

  if (!userId) {
    console.error("❌ User ID is required to list files.");
    return [];
  }

  try {
    // Set a timeout for the request (5 seconds)
    const timeoutPromise = new Promise<[]>((resolve) =>
      setTimeout(() => {
        console.error("⏳ Request timed out while listing vehicle files.");
        resolve([]); // Return empty list if timeout occurs
      }, 5000)
    );

    // Supabase fetch promise
    const fetchPromise = supabase.storage.from("vehicle_uploads").list(userId);

    // Race both promises, whichever completes first wins
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) {
      console.error("❌ Supabase storage error:", error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.warn("⚠️ No files found or invalid response format.");
      return [];
    }

    console.log("✅ Successfully retrieved files:", data.map((file) => file.name));

    return data.map((file) => file.name);
  } catch (error) {
    console.error("🚨 Unexpected error in listVehicleFiles:", error);
    return [];
  }
}

export async function deleteVehicleFile(
  userId: string,
  filename: string
): Promise<boolean> {
  try {
    if (!userId || !filename) {
      throw new Error("User ID and filename are required");
    }
    const filePath = `${userId}/${filename}`;
    console.log("✅filePath", filePath);
    const { data, error } = await supabase.storage
      .from("vehicle_uploads")
      .remove([filePath]);
    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Failed to delete vehicle file:", error);
    toast.error("Failed to delete file");
    return false;
  }
}
