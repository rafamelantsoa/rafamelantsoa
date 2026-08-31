import express from "express";

import {
  getAbout,
  updateAbout,
  addTool,
  updateTool,
  updateToolLogo,
  deleteTool,
} from "../controllers/aboutController.js";

import {
  uploadToolLogo,
} from "../middleware/upload.js";

const router = express.Router();


/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAbout
);


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

// Modifier la section complète
router.put(
  "/",
  updateAbout
);


/*
|--------------------------------------------------------------------------
| TOOLS
|--------------------------------------------------------------------------
*/

// Ajouter un outil avec son logo
router.post(
  "/tools",
  uploadToolLogo.single("logo"),
  addTool
);


// Modifier le nom d'un outil
router.put(
  "/tools/:toolId",
  updateTool
);


// Modifier uniquement le logo
router.put(
  "/tools/:toolId/logo",
  uploadToolLogo.single("logo"),
  updateToolLogo
);


// Supprimer un outil
router.delete(
  "/tools/:toolId",
  deleteTool
);


export default router;