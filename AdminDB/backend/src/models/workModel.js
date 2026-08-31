import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      default: 0,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const workSchema = new mongoose.Schema(
  {
    stats: {
      type: [statSchema],
      default: [
        {
          number: 120,
          label: "Projects Completed",
          order: 0,
        },
        {
          number: 5,
          label: "Years Experience",
          order: 1,
        },
        {
          number: 80,
          label: "Happy Clients",
          order: 2,
        },
        {
          number: 15,
          label: "Awards & Certifications",
          order: 3,
        },
      ],
    },

    marquee: {
      type: [String],
      default: [
        "UI DESIGN",
        "WEB DESIGN",
        "GRAPHIC DESIGN",
        "BRANDING",
        "POSTER",
        "REACT",
        "TAILWIND",
        "FRONTEND",
      ],
    },

    title: {
      type: String,
      default: "Recent Projects",
      trim: true,
    },

    description: {
      type: String,
      default:
        "Designer, Webmaster & Technicien IT/Audiovisuel. Je conçois des expériences web modernes de bout en bout — du design à la production.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Work = mongoose.model("Work", workSchema);

export default Work;