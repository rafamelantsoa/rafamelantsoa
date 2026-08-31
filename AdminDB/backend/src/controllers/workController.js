import Work from "../models/workModel.js";

/*
|--------------------------------------------------------------------------
| GET WORK
|--------------------------------------------------------------------------
*/

export const getWork = async (req, res) => {
  try {
    let work = await Work.findOne();

    if (!work) {
      work = await Work.create({});
    }

    work.stats.sort((a, b) => a.order - b.order);

    res.status(200).json(work);
  } catch (error) {
    console.error("Erreur récupération Work:", error);

    res.status(500).json({
      message: "Impossible de récupérer les données Work.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE WORK
|--------------------------------------------------------------------------
*/

export const updateWork = async (req, res) => {
  try {
    const {
      stats,
      marquee,
      title,
      description,
    } = req.body;

    let work = await Work.findOne();

    if (!work) {
      work = new Work();
    }

    if (Array.isArray(stats)) {
      work.stats = stats.map((stat, index) => ({
        _id: stat._id,
        number: Number(stat.number) || 0,
        label: String(stat.label || "").trim(),
        order: index,
      }));
    }

    if (Array.isArray(marquee)) {
      work.marquee = marquee
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof title === "string") {
      work.title = title.trim();
    }

    if (typeof description === "string") {
      work.description = description.trim();
    }

    await work.save();

    work.stats.sort((a, b) => a.order - b.order);

    res.status(200).json({
      message: "Section Work mise à jour avec succès.",
      data: work,
    });
  } catch (error) {
    console.error("Erreur mise à jour Work:", error);

    res.status(500).json({
      message: "Erreur lors de la mise à jour de la section Work.",
    });
  }
};