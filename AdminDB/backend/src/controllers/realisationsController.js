import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Realisations from "../models/Realisations.js";

/* ================================================================
   GET REALISATIONS
================================================================ */

export const getRealisations = async (req, res) => {
  try {
    let realisations = await Realisations.findOne();

    if (!realisations) {
      realisations = await Realisations.create({
        title: "Selected Work",
        description: "",
        projects: [],
      });
    }

    realisations.projects.sort(
      (a, b) => a.order - b.order
    );

    res.status(200).json(realisations);
  } catch (error) {
    console.error(
      "Erreur getRealisations:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la récupération des réalisations.",
    });
  }
};

/* ================================================================
   UPDATE SECTION
================================================================ */

export const updateRealisations = async (
  req,
  res
) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Le titre est obligatoire.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        message:
          "La description est obligatoire.",
      });
    }

    const realisations =
      await Realisations.findOneAndUpdate(
        {},
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      message:
        "Section Realisations mise à jour.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur updateRealisations:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la mise à jour.",
    });
  }
};

/* ================================================================
   ADD PROJECT
================================================================ */

export const addProject = async (
  req,
  res
) => {
  try {
    const {
      title,
      category,
      description,
      client,
      year,
      projectUrl,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message:
          "Le nom du projet est obligatoire.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        message:
          "La catégorie est obligatoire.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "L'image principale est obligatoire.",
      });
    }

    const realisations =
      await Realisations.findOne();

    if (!realisations) {
      return res.status(404).json({
        message:
          "Section Realisations introuvable.",
      });
    }

    let services = [];

    if (req.body.services) {
      try {
        services = JSON.parse(
          req.body.services
        );
      } catch {
        services = req.body.services
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    const order =
      realisations.projects.length;

    const project = {
      title: title.trim(),
      category: category.trim(),
      description:
        description?.trim() || "",
      client: client?.trim() || "",
      year: year?.trim() || "",
      projectUrl:
        projectUrl?.trim() || "",
      services,
      image: {
        url: req.file.path,
        publicId: req.file.filename,
      },
      gallery: [],
      order,
    };

    realisations.projects.push(project);

    await realisations.save();

    res.status(201).json({
      message: "Projet ajouté avec succès.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur addProject:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de l'ajout du projet.",
    });
  }
};

/* ================================================================
   UPDATE PROJECT
================================================================ */

export const updateProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID projet invalide.",
      });
    }

    const realisations =
      await Realisations.findOne();

    if (!realisations) {
      return res.status(404).json({
        message:
          "Section Realisations introuvable.",
      });
    }

    const project =
      realisations.projects.id(id);

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable.",
      });
    }

    const {
      title,
      category,
      description,
      client,
      year,
      projectUrl,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message:
          "Le nom du projet est obligatoire.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        message:
          "La catégorie est obligatoire.",
      });
    }

    let services = project.services;

    if (req.body.services) {
      try {
        services = JSON.parse(
          req.body.services
        );
      } catch {
        services = req.body.services
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    project.title = title.trim();
    project.category = category.trim();
    project.description =
      description?.trim() || "";
    project.client =
      client?.trim() || "";
    project.year =
      year?.trim() || "";
    project.projectUrl =
      projectUrl?.trim() || "";
    project.services = services;

    /*
     * Si une nouvelle image principale
     * est envoyée, on supprime l'ancienne
     * de Cloudinary.
     */

    if (req.file) {
      if (project.image?.publicId) {
        try {
          await cloudinary.uploader.destroy(
            project.image.publicId
          );
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression ancienne image:",
            cloudinaryError
          );
        }
      }

      project.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await realisations.save();

    res.status(200).json({
      message:
        "Projet modifié avec succès.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur updateProject:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la modification.",
    });
  }
};

/* ================================================================
   ADD GALLERY IMAGES
================================================================ */

export const addGalleryImages = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID projet invalide.",
      });
    }

    const realisations =
      await Realisations.findOne();

    if (!realisations) {
      return res.status(404).json({
        message:
          "Section Realisations introuvable.",
      });
    }

    const project =
      realisations.projects.id(id);

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable.",
      });
    }

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        message:
          "Aucune image sélectionnée.",
      });
    }

    const images = req.files.map(
      (file) => ({
        url: file.path,
        publicId: file.filename,
      })
    );

    project.gallery.push(...images);

    await realisations.save();

    res.status(200).json({
      message:
        "Images ajoutées à la galerie.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur addGalleryImages:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de l'ajout des images.",
    });
  }
};

/* ================================================================
   DELETE GALLERY IMAGE
================================================================ */

export const deleteGalleryImage =
  async (req, res) => {
    try {
      const { id, imageId } =
        req.params;

      const realisations =
        await Realisations.findOne();

      if (!realisations) {
        return res.status(404).json({
          message:
            "Section Realisations introuvable.",
        });
      }

      const project =
        realisations.projects.id(id);

      if (!project) {
        return res.status(404).json({
          message: "Projet introuvable.",
        });
      }

      const image =
        project.gallery.id(imageId);

      if (!image) {
        return res.status(404).json({
          message:
            "Image introuvable.",
        });
      }

      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(
            image.publicId
          );
        } catch (cloudinaryError) {
          console.error(
            "Erreur Cloudinary:",
            cloudinaryError
          );
        }
      }

      image.deleteOne();

      await realisations.save();

      res.status(200).json({
        message:
          "Image supprimée avec succès.",
        data: realisations,
      });
    } catch (error) {
      console.error(
        "Erreur deleteGalleryImage:",
        error
      );

      res.status(500).json({
        message:
          "Erreur lors de la suppression.",
      });
    }
  };

/* ================================================================
   DELETE PROJECT
================================================================ */

export const deleteProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const realisations =
      await Realisations.findOne();

    if (!realisations) {
      return res.status(404).json({
        message:
          "Section Realisations introuvable.",
      });
    }

    const project =
      realisations.projects.id(id);

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable.",
      });
    }

    /*
     * Supprimer image principale
     */

    if (project.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(
          project.image.publicId
        );
      } catch (error) {
        console.error(
          "Erreur suppression image principale:",
          error
        );
      }
    }

    /*
     * Supprimer toutes les images
     * de la galerie
     */

    for (const image of project.gallery) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(
            image.publicId
          );
        } catch (error) {
          console.error(
            "Erreur suppression galerie:",
            error
          );
        }
      }
    }

    project.deleteOne();

    /*
     * Recalculer les ordres
     */

    realisations.projects.forEach(
      (item, index) => {
        item.order = index;
      }
    );

    await realisations.save();

    res.status(200).json({
      message:
        "Projet supprimé avec succès.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur deleteProject:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la suppression.",
    });
  }
};

/* ================================================================
   REORDER
================================================================ */

export const reorderProjects = async (
  req,
  res
) => {
  try {
    const { projects } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json({
        message:
          "Format de réorganisation invalide.",
      });
    }

    const realisations =
      await Realisations.findOne();

    if (!realisations) {
      return res.status(404).json({
        message:
          "Section Realisations introuvable.",
      });
    }

    projects.forEach((item) => {
      const project =
        realisations.projects.id(item.id);

      if (project) {
        project.order = item.order;
      }
    });

    await realisations.save();

    realisations.projects.sort(
      (a, b) => a.order - b.order
    );

    res.status(200).json({
      message:
        "Ordre des projets mis à jour.",
      data: realisations,
    });
  } catch (error) {
    console.error(
      "Erreur reorderProjects:",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la réorganisation.",
    });
  }
};