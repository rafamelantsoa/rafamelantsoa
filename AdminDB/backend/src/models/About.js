import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| EXPERTISE
|--------------------------------------------------------------------------
*/

const expertiseSchema = new mongoose.Schema(
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

/*
|--------------------------------------------------------------------------
| TOOL
|--------------------------------------------------------------------------
*/

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },
  },
  {
    _id: true,
  }
);

/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
*/

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    expertise: {
      type: [expertiseSchema],
      required: true,
      validate: {
        validator: (value) => value.length === 4,
        message: "La section Expertise doit contenir exactement 4 éléments.",
      },
    },

    toolsTitle: {
      type: String,
      required: true,
      trim: true,
    },

    tools: {
      type: [toolSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("About", aboutSchema);