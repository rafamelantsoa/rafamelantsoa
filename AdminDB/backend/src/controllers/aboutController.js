import About from "../models/About.js";
import cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;

/*
|--------------------------------------------------------------------------
| GET ABOUT
|--------------------------------------------------------------------------
*/

export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        title: "What I Do Best",

        expertise: [
          {
            title: "UI / UX Design",
            description:
              "Interfaces modernes, simples et centrées utilisateur.",
            icon: "Palette",
          },
          {
            title: "Branding",
            description:
              "Identité visuelle forte et cohérente pour votre marque.",
            icon: "PenTool",
          },
          {
            title: "3D Modeling",
            description:
              "Modélisation 3D réaliste pour produits et visuels.",
            icon: "Box",
          },
          {
            title: "Web Development",
            description:
              "Sites rapides, performants et responsives.",
            icon: "Code2",
          },
        ],

        toolsTitle: "Outils du quotidien",

        tools: [],
      });
    }

    res.status(200).json(about);
  } catch (error) {
    console.error("GET ABOUT ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la récupération de la section About.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE ABOUT
| Titre + expertise + titre des outils
|--------------------------------------------------------------------------
*/

export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About();
    }

    if (req.body.title !== undefined) {
      about.title = req.body.title;
    }

    if (req.body.expertise !== undefined) {
      about.expertise = req.body.expertise;
    }

    if (req.body.toolsTitle !== undefined) {
      about.toolsTitle = req.body.toolsTitle;
    }

    if (req.body.tools !== undefined) {
      about.tools = req.body.tools;
    }

    await about.save();

    res.status(200).json({
      message: "Section About mise à jour avec succès.",
      about,
    });
  } catch (error) {
    console.error("UPDATE ABOUT ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la mise à jour de la section About.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADD TOOL
|--------------------------------------------------------------------------
*/

export const addTool = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        message: "Le nom de l'outil est obligatoire.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Le logo de l'outil est obligatoire.",
      });
    }

    let about = await About.findOne();

    if (!about) {
      about = new About();
    }

    const tool = {
      name: req.body.name,

      logo: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    };

    about.tools.push(tool);

    await about.save();

    res.status(201).json({
      message: "Outil ajouté avec succès.",
      about,
      tool: about.tools[about.tools.length - 1],
    });
  } catch (error) {
    console.error("ADD TOOL ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de l'ajout de l'outil.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE TOOL
|--------------------------------------------------------------------------
*/

export const updateTool = async (req, res) => {
  try {
    const { toolId } = req.params;

    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "Section About introuvable.",
      });
    }

    const tool = about.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({
        message: "Outil introuvable.",
      });
    }

    if (req.body.name !== undefined) {
      tool.name = req.body.name;
    }

    if (req.body.logo !== undefined) {
      tool.logo = req.body.logo;
    }

    await about.save();

    res.status(200).json({
      message: "Outil modifié avec succès.",
      about,
      tool,
    });
  } catch (error) {
    console.error("UPDATE TOOL ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la modification de l'outil.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE TOOL LOGO
|--------------------------------------------------------------------------
|
| Cette fonction est nécessaire si ton aboutRoutes.js
| utilise updateToolLogo.
|
|--------------------------------------------------------------------------
*/

export const updateToolLogo = async (req, res) => {
  try {
    const { toolId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Aucun logo reçu.",
      });
    }

    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "Section About introuvable.",
      });
    }

    const tool = about.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({
        message: "Outil introuvable.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer ancien logo Cloudinary
    |--------------------------------------------------------------------------
    */

    if (tool.logoPublicId) {
      try {
        await cloudinaryV2.uploader.destroy(
          tool.logoPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (error) {
        console.warn(
          "Ancien logo impossible à supprimer:",
          error.message
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Enregistrer nouveau logo
    |--------------------------------------------------------------------------
    */

    tool.logo = req.file.path;
    tool.logoPublicId = req.file.filename;

    await about.save();

    res.status(200).json({
      message: "Logo de l'outil mis à jour avec succès.",
      about,
      tool,
    });
  } catch (error) {
    console.error("UPDATE TOOL LOGO ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la modification du logo.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE TOOL
|--------------------------------------------------------------------------
*/

export const deleteTool = async (req, res) => {
  try {
    const { toolId } = req.params;

    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "Section About introuvable.",
      });
    }

    const tool = about.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({
        message: "Outil introuvable.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer logo Cloudinary
    |--------------------------------------------------------------------------
    */

    if (tool.logoPublicId) {
      try {
        await cloudinaryV2.uploader.destroy(
          tool.logoPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (error) {
        console.warn(
          "Logo Cloudinary impossible à supprimer:",
          error.message
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer outil MongoDB
    |--------------------------------------------------------------------------
    */

    about.tools.pull(toolId);

    await about.save();

    res.status(200).json({
      message: "Outil supprimé avec succès.",
      about,
    });
  } catch (error) {
    console.error("DELETE TOOL ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la suppression de l'outil.",
      error: error.message,
    });
  }
};