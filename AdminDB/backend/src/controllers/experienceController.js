import Experience from "../models/experienceModel.js";
import ExperienceSection from "../models/experienceSectionModel.js";

/*
|--------------------------------------------------------------------------
| GET SECTION
|--------------------------------------------------------------------------
*/

export const getExperienceSection = async (req, res) => {
  try {
    let section = await ExperienceSection.findOne();

    if (!section) {
      section = await ExperienceSection.create({
        title: "Expériences professionnelles",
      });
    }

    res.status(200).json(section);
  } catch (error) {
    console.error(
      "Erreur récupération section expériences :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SECTION TITLE
|--------------------------------------------------------------------------
*/

export const updateExperienceSection = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Le titre est obligatoire",
      });
    }

    let section = await ExperienceSection.findOne();

    if (!section) {
      section = await ExperienceSection.create({
        title: title.trim(),
      });
    } else {
      section.title = title.trim();
      await section.save();
    }

    res.status(200).json(section);
  } catch (error) {
    console.error(
      "Erreur modification titre expériences :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL EXPERIENCES
|--------------------------------------------------------------------------
*/

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json(experiences);
  } catch (error) {
    console.error(
      "Erreur récupération expériences :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ONE EXPERIENCE
|--------------------------------------------------------------------------
*/

export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(
      req.params.id
    );

    if (!experience) {
      return res.status(404).json({
        message: "Expérience introuvable",
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error(
      "Erreur récupération expérience :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE EXPERIENCE
|--------------------------------------------------------------------------
*/

export const createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      date,
      missions,
      order,
    } = req.body;

    if (!company || !role || !date) {
      return res.status(400).json({
        message:
          "La société, le poste et la date sont obligatoires",
      });
    }

    const experience = await Experience.create({
      company: company.trim(),
      role: role.trim(),
      date: date.trim(),
      missions: Array.isArray(missions)
        ? missions
        : [],
      order:
        typeof order === "number"
          ? order
          : 0,
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error(
      "Erreur création expérience :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE EXPERIENCE
|--------------------------------------------------------------------------
*/

export const updateExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      date,
      missions,
      order,
    } = req.body;

    const experience =
      await Experience.findById(
        req.params.id
      );

    if (!experience) {
      return res.status(404).json({
        message: "Expérience introuvable",
      });
    }

    if (company !== undefined) {
      experience.company = company.trim();
    }

    if (role !== undefined) {
      experience.role = role.trim();
    }

    if (date !== undefined) {
      experience.date = date.trim();
    }

    if (missions !== undefined) {
      experience.missions =
        Array.isArray(missions)
          ? missions
          : [];
    }

    if (order !== undefined) {
      experience.order = order;
    }

    await experience.save();

    res.status(200).json(experience);
  } catch (error) {
    console.error(
      "Erreur modification expérience :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE EXPERIENCE
|--------------------------------------------------------------------------
*/

export const deleteExperience = async (req, res) => {
  try {
    const experience =
      await Experience.findByIdAndDelete(
        req.params.id
      );

    if (!experience) {
      return res.status(404).json({
        message: "Expérience introuvable",
      });
    }

    res.status(200).json({
      message: "Expérience supprimée avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur suppression expérience :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};