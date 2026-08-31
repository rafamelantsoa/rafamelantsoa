import mongoose from "mongoose";

const contactSectionSchema = new mongoose.Schema(
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

    checklists: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(
              (item) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
          );
        },
        message:
          "La checklist doit contenir au moins un élément valide.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const ContactSection =
  mongoose.models.ContactSection ||
  mongoose.model(
    "ContactSection",
    contactSectionSchema
  );

export default ContactSection;