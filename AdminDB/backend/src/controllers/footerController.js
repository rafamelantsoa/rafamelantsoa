import Footer from "../models/Footer.js";

/* =========================================================
   DEFAULT SOCIAL LINKS
========================================================= */

const defaultSocialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: "linkedin",
  },
  {
    name: "Behance",
    url: "https://behance.net/yourusername",
    icon: "behance",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/yourusername",
    icon: "instagram",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/yourusername",
    icon: "facebook",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@yourusername",
    icon: "youtube",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/261340000000",
    icon: "whatsapp",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@yourusername",
    icon: "tiktok",
  },
];

/* =========================================================
   EMAIL VALIDATION
========================================================= */

const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

/* =========================================================
   URL VALIDATION
========================================================= */

const isValidUrl = (url = "") => {
  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
};

/* =========================================================
   GET FOOTER
   GET /api/footer
========================================================= */

export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    /* -------------------------------------------------------
       CREATE DEFAULT FOOTER
    ------------------------------------------------------- */

    if (!footer) {
      footer = await Footer.create({
        title: "Lucianno Rafamelantsoa",

        paragraph:
          "Graphiste, UI/UX Designer & Développeur Frontend. Je crée des identités visuelles, des interfaces modernes et des expériences digitales performantes.",

        address:
          "Antananarivo\nMadagascar",

        phone:
          "+261 34 00 000 00",

        email:
          "contact@portfolio.com",

        socialLinks:
          defaultSocialLinks,
      });
    }

    res.status(200).json(footer);
  } catch (error) {
    console.error(
      "GET FOOTER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de récupérer les informations du Footer.",
    });
  }
};

/* =========================================================
   UPDATE FOOTER
   PUT /api/footer
========================================================= */

export const updateFooter = async (
  req,
  res
) => {
  try {
    const {
      title,
      paragraph,
      address,
      phone,
      email,
      socialLinks,
    } = req.body;

    /* -------------------------------------------------------
       TITLE
    ------------------------------------------------------- */

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message:
          "Le grand titre est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       PARAGRAPH
    ------------------------------------------------------- */

    if (
      typeof paragraph !== "string" ||
      !paragraph.trim()
    ) {
      return res.status(400).json({
        message:
          "Le paragraphe est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       ADDRESS
    ------------------------------------------------------- */

    if (
      typeof address !== "string" ||
      !address.trim()
    ) {
      return res.status(400).json({
        message:
          "L'adresse est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       PHONE
    ------------------------------------------------------- */

    if (
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        message:
          "Le numéro de téléphone est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       EMAIL
    ------------------------------------------------------- */

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "L'adresse email est obligatoire.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message:
          "L'adresse email est invalide.",
      });
    }

    /* -------------------------------------------------------
       SOCIAL LINKS
    ------------------------------------------------------- */

    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({
        message:
          "Les réseaux sociaux doivent être une liste.",
      });
    }

    const cleanedSocialLinks =
      socialLinks
        .map((social) => ({
          name:
            typeof social.name === "string"
              ? social.name.trim()
              : "",

          url:
            typeof social.url === "string"
              ? social.url.trim()
              : "",

          icon:
            typeof social.icon === "string"
              ? social.icon.trim().toLowerCase()
              : "globe",
        }))
        .filter(
          (social) =>
            social.name &&
            social.url
        );

    /* -------------------------------------------------------
       VALIDATE SOCIAL URL
    ------------------------------------------------------- */

    for (const social of cleanedSocialLinks) {
      if (!isValidUrl(social.url)) {
        return res.status(400).json({
          message:
            `Le lien du réseau "${social.name}" est invalide.`,
        });
      }
    }

    /* -------------------------------------------------------
       FIND OR CREATE
    ------------------------------------------------------- */

    let footer =
      await Footer.findOne();

    if (!footer) {
      footer = await Footer.create({
        title: title.trim(),
        paragraph: paragraph.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        socialLinks:
          cleanedSocialLinks,
      });
    } else {
      footer.title = title.trim();

      footer.paragraph =
        paragraph.trim();

      footer.address =
        address.trim();

      footer.phone =
        phone.trim();

      footer.email =
        email.trim();

      footer.socialLinks =
        cleanedSocialLinks;

      await footer.save();
    }

    res.status(200).json({
      message:
        "Le Footer a été mis à jour avec succès.",

      footer,
    });
  } catch (error) {
    console.error(
      "UPDATE FOOTER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de mettre à jour le Footer.",
    });
  }
};