import express from "express";

import {
  getWork,
  updateWork,
} from "../controllers/workController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

router.get("/", getWork);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put("/", updateWork);

export default router;