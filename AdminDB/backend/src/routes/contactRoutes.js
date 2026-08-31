import express from "express";

import {
  getContact,
  updateContact,
  createContactMessage,
  getContactMessages,
  markContactMessageAsRead,
  deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

/* =========================================================
   CONTACT SETTINGS
========================================================= */

router.get(
  "/",
  getContact
);

router.put(
  "/",
  updateContact
);

/* =========================================================
   CONTACT MESSAGES
========================================================= */

/*
 * Récupérer tous les messages
 */
router.get(
  "/messages",
  getContactMessages
);

/*
 * Créer un nouveau message
 */
router.post(
  "/messages",
  createContactMessage
);

/*
 * Marquer comme lu
 */
router.patch(
  "/messages/:id/read",
  markContactMessageAsRead
);

/*
 * Supprimer
 */
router.delete(
  "/messages/:id",
  deleteContactMessage
);

export default router;