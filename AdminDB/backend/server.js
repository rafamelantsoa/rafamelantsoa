import "dotenv/config";

import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import app from "./src/app.js";

import heroRoutes from "./src/routes/heroRoutes.js";

import aboutRoutes from "./src/routes/aboutRoutes.js";

import contactRoutes from "./src/routes/contactRoutes.js";

import experienceRoutes from "./src/routes/experienceRoutes.js";

import footerRoutes from "./src/routes/footerRoutes.js";

import realisationsRoutes from "./src/routes/realisationsRoutes.js";

import abstractCarouselRoutes from "./src/routes/abstractCarouselRoutes.js";

import workRoutes from "./src/routes/workRoutes.js";

import authRoutes from "./src/routes/authRoutes.js";

const PORT =
  process.env.PORT || 5000;


/*
|--------------------------------------------------------------------------
| COOKIE PARSER
|--------------------------------------------------------------------------
*/

app.use(cookieParser());



/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/hero", heroRoutes);

app.use("/api/about", aboutRoutes);

app.use("/api/experiences", experienceRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/footer", footerRoutes);

app.use("/api/realisations", realisationsRoutes);

app.use("/api/work", workRoutes);

app.use("/api/abstract-carousel", abstractCarouselRoutes);


/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {

    console.log(
      "MongoDB connected"
    );

    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      "DB connection error:",
      error
    );

    process.exit(1);

  });