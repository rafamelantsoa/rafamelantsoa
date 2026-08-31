import mongoose from "mongoose";

/* =========================================================
   SLIDE DU CARROUSEL
   ========================================================= */

const slideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);


/* =========================================================
   CARROUSEL
   ========================================================= */

const abstractCarouselSchema = new mongoose.Schema(
  {
    slides: {
      type: [slideSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   MODEL
   ========================================================= */

const AbstractCarousel = mongoose.model(
  "AbstractCarousel",
  abstractCarouselSchema
);

export default AbstractCarousel;