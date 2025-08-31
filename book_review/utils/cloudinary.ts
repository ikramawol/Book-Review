import cloudinary from "cloudinary";
import fs from "fs";

// Enhanced Cloudinary configuration
cloudinary.v2.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  api_URL: process.env.CLOUDINARY_URL,
});

// File validation types
export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

// Upload options interface
export interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any;
  resource_type?: "image" | "video" | "raw";
  format?: string;
  quality?: number;
}

// Validation function
export function validateImageFile(
  file: Express.Multer.File,
  options: FileValidationOptions = {}
): { isValid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
    maxWidth = 4000,
    maxHeight = 4000,
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { isValid: true };
}

// Enhanced upload function with better error handling
export async function uploadImageToCloudinary(
  filePath: string,
  options: UploadOptions = {}
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const {
    folder = "books",
    public_id,
    transformation,
    resource_type = "image",
    quality = "auto",
  } = options;

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: "File not found",
      };
    }

    // Upload options
    const uploadOptions: any = {
      folder,
      resource_type,
      quality,
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);

    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
      },
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image to Cloudinary",
    };
  }
}

// Function to delete image from Cloudinary
export async function deleteImageFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image from Cloudinary",
    };
  }
}

// Function to get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const { width, height, quality = "auto", format = "auto", crop = "fill" } = options;

  let transformation = "";
  if (width || height) {
    transformation += `w_${width || "auto"},h_${height || "auto"},c_${crop},`;
  }
  transformation += `q_${quality},f_${format}`;

  return cloudinary.v2.url(publicId, {
    transformation: transformation,
    secure: true,
  });
}

// Cleanup temporary file
export function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error cleaning up temp file:", error);
  }
}

// Batch upload function for multiple images
export async function uploadMultipleImages(
  filePaths: string[],
  options: UploadOptions = {}
): Promise<{
  success: boolean;
  data?: any[];
  errors?: string[];
}> {
  const results = [];
  const errors = [];

  for (const filePath of filePaths) {
    const result = await uploadImageToCloudinary(filePath, options);
    if (result.success) {
      results.push(result.data);
    } else {
      errors.push(result.error || "Unknown error");
    }
  }

  return {
    success: errors.length === 0,
    data: results.length > 0 ? results : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
}
