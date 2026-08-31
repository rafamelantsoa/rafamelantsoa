import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;

// ============================================================
// CLOUDINARY CONFIG
// ============================================================

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================================
// REALISATIONS STORAGE
// ============================================================

const realisationsStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,

  params: {
    folder: "portfolio/realisations",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    resource_type: "image",
  },
});

// ============================================================
// MULTER
// ============================================================

export const uploadRealisations = multer({
  storage: realisationsStorage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});