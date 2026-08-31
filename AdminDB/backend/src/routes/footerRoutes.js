import express from "express";

import {
  getFooter,
  updateFooter,
} from "../controllers/footerController.js";

const router = express.Router();

/*
  GET /api/footer
*/
router.get("/", getFooter);

/*
  PUT /api/footer
*/
router.put("/", updateFooter);

export default router;