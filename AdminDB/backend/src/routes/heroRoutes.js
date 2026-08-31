import express from "express";

import {
  getHero,
  updateHero,

  updateLightImage,
  deleteLightImage,

  updateDarkImage,
  deleteDarkImage,

  updateCV,
  deleteCV,
} from "../controllers/heroController.js";

import {
  uploadHeroImages,
  uploadCV,
} from "../middleware/uploadHero.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

// GET /api/hero
router.get("/", getHero);

/*
|--------------------------------------------------------------------------
| ADMIN — CONTENU
|--------------------------------------------------------------------------
*/

// PUT /api/hero
router.put("/", updateHero);

/*
|--------------------------------------------------------------------------
| ADMIN — IMAGE LIGHT
|--------------------------------------------------------------------------
*/

// PUT /api/hero/light-image
router.put(
  "/light-image",
  uploadHeroImages.single("image"),
  updateLightImage
);

// DELETE /api/hero/light-image
router.delete(
  "/light-image",
  deleteLightImage
);

/*
|--------------------------------------------------------------------------
| ADMIN — IMAGE DARK
|--------------------------------------------------------------------------
*/

// PUT /api/hero/dark-image
router.put(
  "/dark-image",
  uploadHeroImages.single("image"),
  updateDarkImage
);

// DELETE /api/hero/dark-image
router.delete(
  "/dark-image",
  deleteDarkImage
);

/*
|--------------------------------------------------------------------------
| ADMIN — CV
|--------------------------------------------------------------------------
*/

// PUT /api/hero/cv
router.put(
  "/cv",
  uploadCV.single("cv"),
  updateCV
);

// DELETE /api/hero/cv
router.delete(
  "/cv",
  deleteCV
);

export default router;