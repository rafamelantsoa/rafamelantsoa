import express from "express";

import {
  getCarousel,
  addSlide,
  updateSlide,
  deleteSlide,
} from "../controllers/abstractCarouselController.js";

const router = express.Router();

/* =========================================================
   GET — Récupérer le carrousel
   ========================================================= */
router.get("/", getCarousel);

/* =========================================================
   POST — Ajouter une slide
   ========================================================= */
router.post("/", addSlide);

/* =========================================================
   PUT — Modifier une slide
   ========================================================= */
router.put("/:id", updateSlide);

/* =========================================================
   DELETE — Supprimer une slide
   ========================================================= */
router.delete("/:id", deleteSlide);

export default router;