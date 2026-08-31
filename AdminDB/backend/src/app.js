import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

/*
|--------------------------------------------------------------------------
| ENVIRONMENT
|--------------------------------------------------------------------------
*/

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

const ADMIN_URL =
  process.env.ADMIN_URL ||
  "http://localhost:5174";

const allowedOrigins = [
  CLIENT_URL,
  ADMIN_URL,
];

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.error(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `Origin non autorisée par CORS : ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Portfolio API is running",
  });
});

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Une erreur interne est survenue.",
    });
  }
);

export default app;