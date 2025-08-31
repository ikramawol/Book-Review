import { NextApiRequest, NextApiResponse } from "next";
import { getAllBooks } from "@/lib/book.controller";
import prisma from "@/lib/prisma";
import { 
  uploadImageToCloudinary, 
  validateImageFile, 
  cleanupTempFile,
  deleteImageFromCloudinary 
} from "@/utils/cloudinary";
import { z } from "zod";
import {
  authMiddleware,
  AuthenticatedRequest as BaseAuthenticatedRequest,
} from "@/middlewares/auth.middleware";

// Extend AuthenticatedRequest to include Multer's file property
interface AuthenticatedRequest extends BaseAuthenticatedRequest {
  file?: Express.Multer.File;
}
import multer from "multer";

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

const bookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  author: z.string().min(1).optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  publishedDate: z.string().optional(),
});

// GET Handler
export async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    if (isNaN(page) || isNaN(limit)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid pagination parameters" });
    }

    req.query.page = String(page);
    req.query.limit = String(limit);
    return await getAllBooks(req, res);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

// POST Handler
async function handlePOST(req: AuthenticatedRequest, res: NextApiResponse) {
  let uploadedImageData: any = null;
  let tempFilePath: string | null = null;

  try {
  // Validate input (except image which is a file)
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues });
  }

  const { title, description, author, image, category, publishedDate } = req.body;

  // Auth check
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User authentication required to create a book",
    });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ success: false, error: "Forbidden: Admins only" });
  }

    // Handle image upload with enhanced validation and error handling
    let imageUrl = "";
    let publicId = "";

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
          width: 800,
          height: 600,
          crop: "fill",
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
      publicId = uploadedImageData.public_id;

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
      title,
      description,
      author,
      image: imageUrl,
      publishedDate: publishedDate ? new Date(publishedDate) : new Date(),
    };

    if (categoryIds.length > 0) {
      data.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    const book = await prisma.book.create({
      data,
      include: { reviews: true },
    });

    return res.status(201).json({ 
      success: true, 
      data: {
        ...book,
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
    console.error("Create book error:", error);

    // Cleanup on error
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }

    // If we uploaded an image but failed to create the book, delete the image
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

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply multer middleware
    await runMiddleware(req, res, upload.single("image"));

    if (req.method === "GET") {
      return handleGET(req, res);
    }

    if (req.method === "POST") {
      return authMiddleware(handlePOST)(req as AuthenticatedRequest, res);
    }

    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
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
