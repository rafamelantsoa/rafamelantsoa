import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    paragraph: {
      type: String,
      required: true,
      trim: true,
    },

    checklist: {
      type: [String],
      required: true,
      default: [],
    },

    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Contact",
  contactSchema
);