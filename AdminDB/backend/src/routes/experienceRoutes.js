import express from "express";

import {
  getExperienceSection,
  updateExperienceSection,
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| SECTION
|--------------------------------------------------------------------------
*/

router.get(
  "/section",
  getExperienceSection
);

router.put(
  "/section",
  updateExperienceSection
);

/*
|--------------------------------------------------------------------------
| EXPERIENCES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getExperiences
);

router.get(
  "/:id",
  getExperienceById
);

router.post(
  "/",
  createExperience
);

router.put(
  "/:id",
  updateExperience
);

router.delete(
  "/:id",
  deleteExperience
);

export default router;