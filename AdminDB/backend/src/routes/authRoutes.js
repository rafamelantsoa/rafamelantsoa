import express from "express";

import {
  login,
  logout,
  me,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", login);

/**
 * LOGOUT
 * POST /api/auth/logout
 */
router.post("/logout", authMiddleware, logout);

/**
 * CURRENT ADMIN
 * GET /api/auth/me
 */
router.get("/me", authMiddleware, me);

export default router;