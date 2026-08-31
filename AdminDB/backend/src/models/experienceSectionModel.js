import mongoose from "mongoose";

const experienceSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExperienceSection = mongoose.model(
  "ExperienceSection",
  experienceSectionSchema
);

export default ExperienceSection;