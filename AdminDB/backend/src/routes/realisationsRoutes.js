import express from "express";

import {
  getRealisations,
  updateRealisations,
  addProject,
  updateProject,
  addGalleryImages,
  deleteGalleryImage,
  deleteProject,
  reorderProjects,
} from "../controllers/realisationsController.js";

import { uploadRealisations } from "../middleware/realisationsUpload.js";

const router = express.Router();

/* ================================================================
   GET SECTION
   GET /api/realisations
================================================================ */

router.get("/", getRealisations);

/* ================================================================
   UPDATE SECTION
   PUT /api/realisations
================================================================ */

router.put("/", updateRealisations);

/* ================================================================
   ADD PROJECT
   POST /api/realisations/projects

   image = image principale
================================================================ */

router.post(
  "/projects",
  uploadRealisations.single("image"),
  addProject
);

/* ================================================================
   UPDATE PROJECT
   PUT /api/realisations/projects/:id

   image = nouvelle image principale facultative
================================================================ */

router.put(
  "/projects/:id",
  uploadRealisations.single("image"),
  updateProject
);

/* ================================================================
   ADD GALLERY IMAGES
   POST /api/realisations/projects/:id/gallery

   images = plusieurs images
================================================================ */

router.post(
  "/projects/:id/gallery",
  uploadRealisations.array("images", 20),
  addGalleryImages
);

/* ================================================================
   DELETE GALLERY IMAGE
   DELETE /api/realisations/projects/:id/gallery/:imageId
================================================================ */

router.delete(
  "/projects/:id/gallery/:imageId",
  deleteGalleryImage
);

/* ================================================================
   DELETE PROJECT
   DELETE /api/realisations/projects/:id
================================================================ */

router.delete(
  "/projects/:id",
  deleteProject
);

/* ================================================================
   REORDER PROJECTS
   PUT /api/realisations/projects/reorder
================================================================ */

router.put(
  "/projects/reorder",
  reorderProjects
);

export default router;