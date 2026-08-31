import express from "express";

import {
  login,
  logout,
  me,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post("/login", login);

/*
|--------------------------------------------------------------------------
| VÉRIFIER LA SESSION
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authMiddleware,
  me
);

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  logout
);

export default router;