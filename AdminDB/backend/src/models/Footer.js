import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const footerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Lucianno Rafamelantsoa",
    },

    paragraph: {
      type: String,
      required: true,
      trim: true,
      default:
        "Graphiste, UI/UX Designer & Développeur Frontend. Je crée des identités visuelles, des interfaces modernes et des expériences digitales performantes.",
    },

    address: {
      type: String,
      required: true,
      trim: true,
      default: "Antananarivo\nMadagascar",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      default: "+261 34 00 000 00",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      default: "contact@portfolio.com",
    },

    socialLinks: {
      type: [socialSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Footer = mongoose.model("Footer", footerSchema);

export default Footer;