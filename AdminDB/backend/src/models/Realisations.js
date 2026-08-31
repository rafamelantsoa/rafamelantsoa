import mongoose from "mongoose";

const projectImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: null,
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    client: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    services: {
      type: [String],
      default: [],
    },

    projectUrl: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    gallery: {
      type: [projectImageSchema],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const realisationsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Selected Work",
    },

    description: {
      type: String,
      required: true,
      default: "",
    },

    projects: {
      type: [projectSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Realisations",
  realisationsSchema
);