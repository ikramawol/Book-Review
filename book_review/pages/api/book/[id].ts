import { authMiddleware, AuthenticatedRequest as BaseAuthenticatedRequest } from "@/middlewares/auth.middleware";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { 
  uploadImageToCloudinary, 
  validateImageFile, 
  cleanupTempFile,
  deleteImageFromCloudinary 
} from "@/utils/cloudinary";
import multer from "multer";

// Extend AuthenticatedRequest to include Multer's file property
interface AuthenticatedRequest extends BaseAuthenticatedRequest {
  file?: Express.Multer.File;
}

// Enhanced Multer setup with file filtering
const upload = multer({
  dest: "/tmp",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`));
    }
    cb(null, true);
  },
});

const updatebookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  author: z.string().min(1).optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  publishedDate: z.string().optional(),
});

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookId = id as string;

  if (!bookId) {
    return res.status(400).json({ success: false, error: "Invalid book id" });
  }

  try {
    // Increment views
    await prisma.book.update({
      where: { id: bookId },
      data: { views: { increment: 1 } },
    });

    // Fetch book details
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { reviews: true, categories: true },
    });

    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch book" });
  }
}

async function handlePUT(req: AuthenticatedRequest, res: NextApiResponse) {
  let uploadedImageData: any = null;
  let tempFilePath: string | null = null;
  let oldImagePublicId: string | null = null;

  try {
    const { id } = req.query;
    const bookId = id as string;

    if (!bookId) {
      return res.status(400).json({ success: false, error: "Invalid book id" });
    }

    // Validate input (except image which is a file)
    const parsed = updatebookSchema
      .extend({
        category: z.union([z.string(), z.array(z.string())]).optional(),
        publishedDate: z.string().optional(),
      })
      .safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues });
    }

    const { title, description, image, author, category, publishedDate } = parsed.data;

    // Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "User authentication required to update a book",
      });
    }

    // Check if book exists and user has permission
    const existingBook = await prisma.book.findUnique({ 
      where: { id: bookId },
      include: { categories: true }
    });

    if (!existingBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    // Check if user is admin (for now, only admins can update books)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ 
        success: false, 
        error: "Forbidden: Only admins can update books" 
      });
    }

    // Handle image upload with enhanced validation and error handling
    let imageUrl = existingBook.image; // Keep existing image if no new one uploaded

    if (req.file) {
      tempFilePath = req.file.path;

      // Validate the uploaded file
      const validation = validateImageFile(req.file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
      });

      if (!validation.isValid) {
        cleanupTempFile(tempFilePath);
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      // Upload to Cloudinary with enhanced options
      const uploadResult = await uploadImageToCloudinary(tempFilePath, {
        folder: "books",
        transformation: {
          quality: "auto",
        },
      });

      if (!uploadResult.success) {
        cleanupTempFile(tempFilePath);
        return res.status(500).json({
          success: false,
          error: `Image upload failed: ${uploadResult.error}`,
        });
      }

      uploadedImageData = uploadResult.data;
      imageUrl = uploadedImageData.secure_url;

      // Store old image public ID for cleanup
      if (existingBook.image && existingBook.image.includes('cloudinary')) {
        // Extract public ID from existing image URL
        const urlParts = existingBook.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        oldImagePublicId = publicIdWithExtension.split('.')[0]; // Remove file extension
      }

      // Clean up temp file after successful upload
      cleanupTempFile(tempFilePath);
      tempFilePath = null;
    }

    // Handle categories
    let categoryNames: string[] = [];
    if (category) categoryNames = Array.isArray(category) ? category : [category];

    const categoryIds: number[] = [];
    for (const catName of categoryNames) {
      let cat = await prisma.category.findFirst({ where: { name: catName } });
      if (!cat) {
        cat = await prisma.category.create({ data: { name: catName } });
      }
      categoryIds.push(cat.id);
    }

    const data: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(author && { author }),
      ...(publishedDate && { publishedDate: new Date(publishedDate) }),
      ...(imageUrl !== existingBook.image && { image: imageUrl }),
    };

    if (categoryIds.length > 0) {
      data.categories = {
        set: [], // Clear existing categories
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data,
      include: { categories: true, reviews: true },
    });

    // Delete old image from Cloudinary if new image was uploaded successfully
    if (oldImagePublicId && uploadedImageData) {
      try {
        await deleteImageFromCloudinary(oldImagePublicId);
      } catch (deleteError) {
        console.error("Failed to delete old image from Cloudinary:", deleteError);
        // Don't fail the request if image deletion fails
      }
    }

    return res.status(200).json({ 
      success: true, 
      data: {
        ...updatedBook,
        imageData: uploadedImageData ? {
          public_id: uploadedImageData.public_id,
          width: uploadedImageData.width,
          height: uploadedImageData.height,
          format: uploadedImageData.format,
          bytes: uploadedImageData.bytes,
        } : null,
      }
    });

  } catch (error: any) {
    console.error("Update book error:", error);

    // Cleanup on error
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }

    // If we uploaded an image but failed to update the book, delete the image
    if (uploadedImageData?.public_id) {
      try {
        await deleteImageFromCloudinary(uploadedImageData.public_id);
      } catch (deleteError) {
        console.error("Failed to delete uploaded image on error:", deleteError);
      }
    }

    return res.status(500).json({ 
      success: false, 
      error: error.message || "Internal server error" 
    });
  }
}

async function handleDELETE(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookId = id as string;

  if (!bookId) {
    return res.status(400).json({ success: false, error: "Invalid book id" });
  }

  try {
    // Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "User authentication required to delete a book",
      });
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    // Check if user is admin (for now, only admins can delete books)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ 
        success: false, 
        error: "Forbidden: Only admins can delete books" 
      });
    }

    // Delete image from Cloudinary if it exists
    if (book.image && book.image.includes('cloudinary')) {
      try {
        const urlParts = book.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        await deleteImageFromCloudinary(publicId);
      } catch (deleteError) {
        console.error("Failed to delete image from Cloudinary:", deleteError);
        // Continue with book deletion even if image deletion fails
      }
    }

    await prisma.book.delete({ where: { id: bookId } });
    return res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error: any) {
    console.error("Delete book error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to delete book" 
    });
  }
}

// Helper function to handle multer errors
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Default export function that handles all HTTP methods
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply multer middleware for PUT requests
    res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === "PUT") {
      await runMiddleware(req, res, upload.single("image"));
    }

    if (req.method === "GET") {
      return handleGET(req, res);
    }

    if (req.method === "PUT") {
      return authMiddleware(handlePUT)(req as AuthenticatedRequest, res);
    }

    if (req.method === "DELETE") {
      return authMiddleware(handleDELETE)(req as AuthenticatedRequest, res);
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("API Route Error:", error);
    
    // Clean up any temp files on error
    if ((req as any).file?.path) {
      cleanupTempFile((req as any).file.path);
    }

    return res.status(501).json({ error: `Something went wrong: ${error.message}` });
  }
}

// Disable default Next.js body parsing for multer
export const config = {
  api: {
    bodyParser: false,
  },
};
