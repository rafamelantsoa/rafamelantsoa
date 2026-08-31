import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;

/*
|--------------------------------------------------------------------------
| CLOUDINARY CONFIGURATION
|--------------------------------------------------------------------------
*/

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/*
|--------------------------------------------------------------------------
| HERO IMAGES
|--------------------------------------------------------------------------
*/

const heroImageStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,

  params: {
    folder: "portfolio/hero",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    resource_type: "image",
  },
});

export const uploadHeroImages = multer({
  storage: heroImageStorage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


/*
|--------------------------------------------------------------------------
| HERO CV
|--------------------------------------------------------------------------
*/

const heroCVStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "portfolio/cv",
    resource_type: "raw",
    public_id: "CV_Anicolas_Rafamelantsoa",
    format: "pdf",
    allowed_formats: ["pdf"],
  },
});

export const uploadCV = multer({
  storage: heroCVStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| ABOUT - TOOL LOGOS
|--------------------------------------------------------------------------
*/

const toolLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,

  params: {
    folder: "portfolio/about/tools",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "svg",
    ],

    resource_type: "image",
  },
});

export const uploadToolLogo = multer({
  storage: toolLogoStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


/*
|--------------------------------------------------------------------------
| EXPORT CLOUDINARY
|--------------------------------------------------------------------------
|
| Utile si certains autres fichiers du backend
| doivent utiliser directement Cloudinary.
|--------------------------------------------------------------------------
*/

export { cloudinaryV2 };