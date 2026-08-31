import multer from "multer";

/*
|--------------------------------------------------------------------------
| MULTER MEMORY STORAGE
|--------------------------------------------------------------------------
|
| Les fichiers sont conservés temporairement en mémoire.
| Ensuite, les controllers les envoient directement à Cloudinary
| avec upload_stream().
|
*/

const memoryStorage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| FILTRE IMAGE
|--------------------------------------------------------------------------
*/

const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format image non autorisé. Utilisez JPG, JPEG, PNG ou WEBP."
      ),
      false
    );
  }
};

/*
|--------------------------------------------------------------------------
| FILTRE PDF
|--------------------------------------------------------------------------
*/

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("Le CV doit obligatoirement être un fichier PDF."),
      false
    );
  }
};

/*
|--------------------------------------------------------------------------
| HERO IMAGES
|--------------------------------------------------------------------------
*/

export const uploadHeroImages = multer({
  storage: memoryStorage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: imageFilter,
});

/*
|--------------------------------------------------------------------------
| HERO CV
|--------------------------------------------------------------------------
*/

export const uploadCV = multer({
  storage: memoryStorage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: pdfFilter,
});