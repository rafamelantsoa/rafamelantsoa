import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// public
router.get("/", getProjects);

// protected (admin only)
router.post("/", protect, createProject);
router.delete("/:id", protect, deleteProject);

export default router;