import Hero from "../models/Hero.js";

import cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;

/*
|--------------------------------------------------------------------------
| CLOUDINARY CONFIGURATION
|--------------------------------------------------------------------------
*/

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
|--------------------------------------------------------------------------
| HELPER — UPLOAD BUFFER VERS CLOUDINARY
|--------------------------------------------------------------------------
*/

const uploadBufferToCloudinary = (
  buffer,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinaryV2.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    stream.end(buffer);
  });
};

/*
|--------------------------------------------------------------------------
| GET HERO
|--------------------------------------------------------------------------
|
| GET /api/hero
|
*/

export const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();

    /*
    |--------------------------------------------------------------------------
    | Création automatique
    |--------------------------------------------------------------------------
    */

    if (!hero) {
      hero = await Hero.create({
        title: "Graphiste & Développeur Web",

        description:
          "Designer, Webmaster & Technicien IT/Audiovisuel. Je conçois des expériences web modernes de bout en bout — du design à la production.",

        lightImage: {
          url: "",
          publicId: "",
        },

        darkImage: {
          url: "",
          publicId: "",
        },

        cvUrl: "",
        cvPublicId: "",
      });
    }

    return res.status(200).json(hero);
  } catch (error) {
    console.error("GET HERO ERROR:", error);

    return res.status(500).json({
      message:
        "Erreur lors de la récupération du Hero",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE HERO TEXT
|--------------------------------------------------------------------------
|
| PUT /api/hero
|
*/

export const updateHero = async (req, res) => {
  try {
    const { title, description } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation titre
    |--------------------------------------------------------------------------
    */

    if (
      title === undefined ||
      title === null ||
      !String(title).trim()
    ) {
      return res.status(400).json({
        message: "Le titre est obligatoire.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validation description
    |--------------------------------------------------------------------------
    */

    if (
      description === undefined ||
      description === null ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        message: "La description est obligatoire.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Récupérer Hero
    |--------------------------------------------------------------------------
    */

    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero();
    }

    /*
    |--------------------------------------------------------------------------
    | Mise à jour
    |--------------------------------------------------------------------------
    */

    hero.title = String(title).trim();

    hero.description =
      String(description).trim();

    await hero.save();

    return res.status(200).json({
      message:
        "Hero mis à jour avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "UPDATE HERO ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la modification du Hero",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE LIGHT IMAGE
|--------------------------------------------------------------------------
|
| PUT /api/hero/light-image
|
| FormData:
|
| image = fichier
|
*/

export const updateLightImage = async (
  req,
  res
) => {
  try {
    console.log(
      "================================================"
    );

    console.log(
      "UPDATE LIGHT IMAGE"
    );

    console.log(
      "req.file =",
      req.file
    );

    console.log(
      "req.body =",
      req.body
    );

    console.log(
      "================================================"
    );

    /*
    |--------------------------------------------------------------------------
    | Vérifier fichier
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        message:
          "Aucune image Light reçue. Le champ FormData doit être 'image'.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Vérifier buffer
    |--------------------------------------------------------------------------
    */

    if (!req.file.buffer) {
      return res.status(400).json({
        message:
          "Le fichier reçu ne contient aucun buffer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Récupérer Hero
    |--------------------------------------------------------------------------
    */

    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero();
    }

    /*
    |--------------------------------------------------------------------------
    | Upload nouvelle image
    |--------------------------------------------------------------------------
    */

    const uploadResult =
      await uploadBufferToCloudinary(
        req.file.buffer,
        {
          folder: "portfolio/hero",
          resource_type: "image",
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Supprimer ancienne image
    |--------------------------------------------------------------------------
    |
    | On fait la suppression APRÈS le nouvel upload.
    | Cela évite de perdre l'ancienne image si le nouvel upload échoue.
    |
    */

    if (hero.lightImage?.publicId) {
      try {
        await cloudinaryV2.uploader.destroy(
          hero.lightImage.publicId,
          {
            resource_type: "image",
          }
        );

        console.log(
          "Ancienne image Light supprimée."
        );
      } catch (error) {
        console.warn(
          "Impossible de supprimer ancienne Light:",
          error.message
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Enregistrer MongoDB
    |--------------------------------------------------------------------------
    */

    hero.lightImage = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    await hero.save();

    /*
    |--------------------------------------------------------------------------
    | Réponse
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      message:
        "Image Light mise à jour avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "UPDATE LIGHT IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la mise à jour de l'image Light",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE LIGHT IMAGE
|--------------------------------------------------------------------------
|
| DELETE /api/hero/light-image
|
*/

export const deleteLightImage = async (
  req,
  res
) => {
  try {
    const hero = await Hero.findOne();

    /*
    |--------------------------------------------------------------------------
    | Hero introuvable
    |--------------------------------------------------------------------------
    */

    if (!hero) {
      return res.status(404).json({
        message: "Hero introuvable.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Image inexistante
    |--------------------------------------------------------------------------
    */

    if (!hero.lightImage?.publicId) {
      return res.status(400).json({
        message:
          "Aucune image Light à supprimer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer Cloudinary
    |--------------------------------------------------------------------------
    */

    try {
      await cloudinaryV2.uploader.destroy(
        hero.lightImage.publicId,
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      console.warn(
        "Erreur Cloudinary Light:",
        error.message
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Réinitialiser MongoDB
    |--------------------------------------------------------------------------
    */

    hero.lightImage = {
      url: "",
      publicId: "",
    };

    await hero.save();

    return res.status(200).json({
      message:
        "Image Light supprimée avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "DELETE LIGHT IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la suppression de l'image Light",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE DARK IMAGE
|--------------------------------------------------------------------------
|
| PUT /api/hero/dark-image
|
| FormData:
|
| image = fichier
|
*/

export const updateDarkImage = async (
  req,
  res
) => {
  try {
    console.log(
      "================================================"
    );

    console.log(
      "UPDATE DARK IMAGE"
    );

    console.log(
      "req.file =",
      req.file
    );

    console.log(
      "req.body =",
      req.body
    );

    console.log(
      "================================================"
    );

    /*
    |--------------------------------------------------------------------------
    | Vérifier fichier
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        message:
          "Aucune image Dark reçue. Le champ FormData doit être 'image'.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Vérifier buffer
    |--------------------------------------------------------------------------
    */

    if (!req.file.buffer) {
      return res.status(400).json({
        message:
          "Le fichier reçu ne contient aucun buffer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Récupérer Hero
    |--------------------------------------------------------------------------
    */

    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero();
    }

    /*
    |--------------------------------------------------------------------------
    | Upload nouvelle image
    |--------------------------------------------------------------------------
    */

    const uploadResult =
      await uploadBufferToCloudinary(
        req.file.buffer,
        {
          folder: "portfolio/hero",
          resource_type: "image",
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Supprimer ancienne image
    |--------------------------------------------------------------------------
    */

    if (hero.darkImage?.publicId) {
      try {
        await cloudinaryV2.uploader.destroy(
          hero.darkImage.publicId,
          {
            resource_type: "image",
          }
        );

        console.log(
          "Ancienne image Dark supprimée."
        );
      } catch (error) {
        console.warn(
          "Impossible de supprimer ancienne Dark:",
          error.message
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Enregistrer MongoDB
    |--------------------------------------------------------------------------
    */

    hero.darkImage = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    await hero.save();

    return res.status(200).json({
      message:
        "Image Dark mise à jour avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "UPDATE DARK IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la mise à jour de l'image Dark",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE DARK IMAGE
|--------------------------------------------------------------------------
|
| DELETE /api/hero/dark-image
|
*/

export const deleteDarkImage = async (
  req,
  res
) => {
  try {
    const hero = await Hero.findOne();

    /*
    |--------------------------------------------------------------------------
    | Hero introuvable
    |--------------------------------------------------------------------------
    */

    if (!hero) {
      return res.status(404).json({
        message: "Hero introuvable.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Image inexistante
    |--------------------------------------------------------------------------
    */

    if (!hero.darkImage?.publicId) {
      return res.status(400).json({
        message:
          "Aucune image Dark à supprimer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer Cloudinary
    |--------------------------------------------------------------------------
    */

    try {
      await cloudinaryV2.uploader.destroy(
        hero.darkImage.publicId,
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      console.warn(
        "Erreur Cloudinary Dark:",
        error.message
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Réinitialiser MongoDB
    |--------------------------------------------------------------------------
    */

    hero.darkImage = {
      url: "",
      publicId: "",
    };

    await hero.save();

    return res.status(200).json({
      message:
        "Image Dark supprimée avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "DELETE DARK IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la suppression de l'image Dark",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE CV
|--------------------------------------------------------------------------
|
| PUT /api/hero/cv
|
| FormData:
|
| cv = fichier PDF
|
*/

export const updateCV = async (
  req,
  res
) => {
  try {
    console.log(
      "================================================"
    );

    console.log(
      "UPDATE CV"
    );

    console.log(
      "req.file =",
      req.file
    );

    console.log(
      "req.body =",
      req.body
    );

    console.log(
      "================================================"
    );

    /*
    |--------------------------------------------------------------------------
    | Vérifier fichier
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        message:
          "Aucun fichier CV reçu. Le champ FormData doit être 'cv'.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Vérifier PDF
    |--------------------------------------------------------------------------
    */

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return res.status(400).json({
        message:
          "Le CV doit obligatoirement être un fichier PDF.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Vérifier buffer
    |--------------------------------------------------------------------------
    */

    if (!req.file.buffer) {
      return res.status(400).json({
        message:
          "Le fichier CV ne contient aucun buffer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Récupérer Hero
    |--------------------------------------------------------------------------
    */

    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero();
    }

    /*
    |--------------------------------------------------------------------------
    | ID FIXE DU CV
    |--------------------------------------------------------------------------
    */

    const publicId =
      "portfolio/cv/CV_Anicolas_Rafamelantsoa";

    /*
    |--------------------------------------------------------------------------
    | Upload CV
    |--------------------------------------------------------------------------
    */

    const uploadResult =
      await uploadBufferToCloudinary(
        req.file.buffer,
        {
          public_id: publicId,
          resource_type: "raw",
          overwrite: true,
          invalidate: true,
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Supprimer ancien CV
    |--------------------------------------------------------------------------
    |
    | ATTENTION :
    | On ne fait PAS destroy ici.
    |
    | Pourquoi ?
    |
    | Parce que le nouveau fichier utilise exactement
    | le même public_id avec overwrite:true.
    |
    | Cloudinary remplace donc automatiquement l'ancien.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Enregistrer MongoDB
    |--------------------------------------------------------------------------
    */

    hero.cvUrl =
      uploadResult.secure_url;

    hero.cvPublicId =
      uploadResult.public_id;

    await hero.save();

    /*
    |--------------------------------------------------------------------------
    | Réponse
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      message:
        "CV mis à jour avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "UPDATE CV ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la mise à jour du CV",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE CV
|--------------------------------------------------------------------------
|
| DELETE /api/hero/cv
|
*/

export const deleteCV = async (
  req,
  res
) => {
  try {
    const hero = await Hero.findOne();

    /*
    |--------------------------------------------------------------------------
    | Hero introuvable
    |--------------------------------------------------------------------------
    */

    if (!hero) {
      return res.status(404).json({
        message: "Hero introuvable.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CV inexistant
    |--------------------------------------------------------------------------
    */

    if (!hero.cvPublicId) {
      return res.status(400).json({
        message:
          "Aucun CV à supprimer.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer Cloudinary
    |--------------------------------------------------------------------------
    */

    try {
      await cloudinaryV2.uploader.destroy(
        hero.cvPublicId,
        {
          resource_type: "raw",
        }
      );

      console.log(
        "CV supprimé de Cloudinary."
      );
    } catch (error) {
      console.warn(
        "Erreur suppression CV Cloudinary:",
        error.message
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Réinitialiser MongoDB
    |--------------------------------------------------------------------------
    */

    hero.cvUrl = "";
    hero.cvPublicId = "";

    await hero.save();

    return res.status(200).json({
      message:
        "CV supprimé avec succès",

      hero,
    });
  } catch (error) {
    console.error(
      "DELETE CV ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la suppression du CV",

      error: error.message,
    });
  }
};