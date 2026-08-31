import AbstractCarousel from "../models/abstractCarouselModel.js";

/* =========================================================
   GET — Récupérer le carrousel
   ========================================================= */
export const getCarousel = async (req, res) => {
  try {
    let carousel = await AbstractCarousel.findOne();

    // Création automatique si aucun carrousel n'existe
    if (!carousel) {
      carousel = await AbstractCarousel.create({
        slides: [
          {
            title: "3D Abstract Iridescent Composition",
            description: "Creative 3D visual exploration",
          },
          {
            title: "Digital Creative Direction",
            description: "Visual identity & digital experiences",
          },
          {
            title: "Motion & Visual Design",
            description: "Dynamic compositions and animations",
          },
        ],
      });
    }

    res.status(200).json(carousel);
  } catch (error) {
    console.error("Erreur getCarousel :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération du carrousel",
      error: error.message,
    });
  }
};


/* =========================================================
   POST — Ajouter une slide
   ========================================================= */
export const addSlide = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Vérification
    if (!title || !description) {
      return res.status(400).json({
        message: "Le titre et la description sont obligatoires.",
      });
    }

    let carousel = await AbstractCarousel.findOne();

    // Si aucun carrousel n'existe
    if (!carousel) {
      carousel = await AbstractCarousel.create({
        slides: [
          {
            title,
            description,
          },
        ],
      });

      return res.status(201).json(carousel);
    }

    // Ajouter la nouvelle slide
    carousel.slides.push({
      title,
      description,
    });

    await carousel.save();

    res.status(201).json(carousel);
  } catch (error) {
    console.error("Erreur addSlide :", error);

    res.status(500).json({
      message: "Erreur lors de l'ajout de la slide",
      error: error.message,
    });
  }
};


/* =========================================================
   PUT — Modifier une slide
   ========================================================= */
export const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const carousel = await AbstractCarousel.findOne();

    if (!carousel) {
      return res.status(404).json({
        message: "Carrousel introuvable.",
      });
    }

    const slide = carousel.slides.id(id);

    if (!slide) {
      return res.status(404).json({
        message: "Slide introuvable.",
      });
    }

    // Modification uniquement des champs envoyés
    if (title !== undefined) {
      slide.title = title;
    }

    if (description !== undefined) {
      slide.description = description;
    }

    await carousel.save();

    res.status(200).json(carousel);
  } catch (error) {
    console.error("Erreur updateSlide :", error);

    res.status(500).json({
      message: "Erreur lors de la modification de la slide",
      error: error.message,
    });
  }
};


/* =========================================================
   DELETE — Supprimer une slide
   ========================================================= */
export const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const carousel = await AbstractCarousel.findOne();

    if (!carousel) {
      return res.status(404).json({
        message: "Carrousel introuvable.",
      });
    }

    const slide = carousel.slides.id(id);

    if (!slide) {
      return res.status(404).json({
        message: "Slide introuvable.",
      });
    }

    slide.deleteOne();

    await carousel.save();

    res.status(200).json({
      message: "Slide supprimée avec succès.",
      carousel,
    });
  } catch (error) {
    console.error("Erreur deleteSlide :", error);

    res.status(500).json({
      message: "Erreur lors de la suppression de la slide",
      error: error.message,
    });
  }
};