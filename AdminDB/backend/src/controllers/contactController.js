import Contact from "../models/Contact.js";
import ContactMessage from "../models/contactMessage.js";
import nodemailer from "nodemailer";

/* =========================================================
   EMAIL VALIDATION
========================================================= */

const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/* =========================================================
   HTML ESCAPE
========================================================= */

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/* =========================================================
   NODEMAILER TRANSPORTER
========================================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================================
   GET CONTACT SETTINGS
   GET /api/contact
========================================================= */

export const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    /* -------------------------------------------------------
       Création automatique si aucun Contact n'existe
    ------------------------------------------------------- */

    if (!contact) {
      contact = await Contact.create({
        title: "Travaillons Ensemble",

        paragraph:
          "Envoyez votre demande directement dans mon dashboard admin. Je vous répondrai rapidement avec une proposition adaptée à votre projet.",

        checklist: [
          "Réponse rapide sous 24–48h",
          "Collaboration freelance ou long terme",
          "Design, branding & développement web",
        ],

        contactEmail:
          process.env.CONTACT_EMAIL || "",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);

    res.status(500).json({
      message:
        "Impossible de récupérer les informations du Contact.",
    });
  }
};

/* =========================================================
   UPDATE CONTACT SETTINGS
   PUT /api/contact

   Modifie :
   - titre
   - paragraphe
   - checklist
   - email de réception
========================================================= */

export const updateContact = async (req, res) => {
  try {
    const {
      title,
      paragraph,
      checklist,
      contactEmail,
    } = req.body;

    /* -------------------------------------------------------
       VALIDATION TITRE
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
       VALIDATION PARAGRAPHE
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
       VALIDATION CHECKLIST
    ------------------------------------------------------- */

    if (
      !Array.isArray(checklist) ||
      checklist.length === 0
    ) {
      return res.status(400).json({
        message:
          "La checklist doit contenir au moins un élément.",
      });
    }

    const cleanedChecklist = checklist
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : ""
      )
      .filter(Boolean);

    if (cleanedChecklist.length === 0) {
      return res.status(400).json({
        message:
          "La checklist ne peut pas être vide.",
      });
    }

    /* -------------------------------------------------------
       VALIDATION EMAIL DE RÉCEPTION
    ------------------------------------------------------- */

    if (
      typeof contactEmail !== "string" ||
      !contactEmail.trim()
    ) {
      return res.status(400).json({
        message:
          "L'adresse email de réception est obligatoire.",
      });
    }

    if (!isValidEmail(contactEmail)) {
      return res.status(400).json({
        message:
          "L'adresse email de réception est invalide.",
      });
    }

    /* -------------------------------------------------------
       UPDATE / CREATE
    ------------------------------------------------------- */

    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        title: title.trim(),
        paragraph: paragraph.trim(),
        checklist: cleanedChecklist,
        contactEmail: contactEmail.trim(),
      });
    } else {
      contact.title = title.trim();
      contact.paragraph = paragraph.trim();
      contact.checklist = cleanedChecklist;
      contact.contactEmail = contactEmail.trim();

      await contact.save();
    }

    res.status(200).json({
      message:
        "Les informations du Contact ont été mises à jour.",
      contact,
    });
  } catch (error) {
    console.error(
      "UPDATE CONTACT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de mettre à jour le Contact.",
    });
  }
};

/* =========================================================
   CREATE CONTACT MESSAGE
   POST /api/contact/messages

   Fonctionnement :

   Portfolio
       ↓
   POST /api/contact/messages
       ↓
   MongoDB
       ↓
   Gmail / Nodemailer
       ↓
   Email configuré dans TailAdmin
========================================================= */

export const createContactMessage = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      message,
    } = req.body;

    /* -------------------------------------------------------
       VALIDATION NOM
    ------------------------------------------------------- */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        message:
          "Le nom est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       VALIDATION EMAIL
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
       VALIDATION MESSAGE
    ------------------------------------------------------- */

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message:
          "Le message est obligatoire.",
      });
    }

    /* -------------------------------------------------------
       RÉCUPÉRER LES PARAMÈTRES CONTACT
    ------------------------------------------------------- */

    let contact = await Contact.findOne();

    /*
     * Si aucun paramètre Contact n'existe,
     * on le crée automatiquement.
     */

    if (!contact) {
      contact = await Contact.create({
        title: "Travaillons Ensemble",

        paragraph:
          "Envoyez votre demande directement dans mon dashboard admin. Je vous répondrai rapidement avec une proposition adaptée à votre projet.",

        checklist: [
          "Réponse rapide sous 24–48h",
          "Collaboration freelance ou long terme",
          "Design, branding & développement web",
        ],

        contactEmail:
          process.env.CONTACT_EMAIL || "",
      });
    }

    /* -------------------------------------------------------
       EMAIL DESTINATAIRE
    ------------------------------------------------------- */

    const receiverEmail =
      contact.contactEmail?.trim();

    if (
      !receiverEmail ||
      !isValidEmail(receiverEmail)
    ) {
      return res.status(500).json({
        message:
          "L'adresse email de réception du Contact n'est pas configurée.",
      });
    }

    /* -------------------------------------------------------
       SAVE TO MONGODB
    ------------------------------------------------------- */

    const newMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

    /* -------------------------------------------------------
       PRÉPARATION HTML
    ------------------------------------------------------- */

    const safeName =
      escapeHtml(name.trim());

    const safeEmail =
      escapeHtml(email.trim());

    const safeMessage =
      escapeHtml(
        message.trim()
      ).replace(
        /\n/g,
        "<br />"
      );

    /* -------------------------------------------------------
       SEND EMAIL WITH NODEMAILER
    ------------------------------------------------------- */

    try {
      await transporter.sendMail({
        from: {
          name: "Portfolio Annicolas Rafamelantsoa",
          address: process.env.EMAIL_USER,
        },

        to: receiverEmail,

        replyTo: email.trim(),

        subject:
          `Nouveau message de ${name.trim()}`,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 700px;
              margin: 0 auto;
              padding: 30px;
              color: #18181b;
            "
          >

            <h2
              style="
                margin-bottom: 25px;
              "
            >
              Nouveau message depuis votre portfolio
            </h2>

            <div
              style="
                padding: 20px;
                border: 1px solid #e4e4e7;
                border-radius: 12px;
              "
            >

              <p>
                <strong>Nom :</strong>
                ${safeName}
              </p>

              <p>
                <strong>Email :</strong>
                ${safeEmail}
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e4e4e7;
                  margin: 20px 0;
                "
              />

              <p>
                <strong>Message :</strong>
              </p>

              <p>
                ${safeMessage}
              </p>

            </div>

            <p
              style="
                margin-top: 25px;
                color: #71717a;
                font-size: 13px;
              "
            >
              Message envoyé depuis le formulaire
              de contact du portfolio.
            </p>

          </div>
        `,
      });

      console.log(
        "Email Gmail envoyé avec succès."
      );

    } catch (emailError) {

      /*
       * Le message reste enregistré dans MongoDB
       * même si Gmail rencontre un problème.
       */

      console.error(
        "NODEMAILER EMAIL ERROR:",
        emailError
      );

      /*
       * On retourne quand même une erreur au frontend
       * pour que l'utilisateur sache que l'email
       * n'a pas pu être envoyé.
       */

      return res.status(500).json({
        message:
          "Le message a été enregistré, mais l'email n'a pas pu être envoyé.",
        saved: true,
      });
    }

    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    return res.status(201).json({
      message:
        "Votre message a été envoyé avec succès.",
      contactMessage: newMessage,
    });

  } catch (error) {

    console.error(
      "CREATE CONTACT MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Impossible d'envoyer votre message.",
    });
  }
};

/* =========================================================
   GET CONTACT MESSAGES
   GET /api/contact/messages
========================================================= */

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "GET CONTACT MESSAGES ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de récupérer les messages.",
    });
  }
};

/* =========================================================
   MARK CONTACT MESSAGE AS READ
   PATCH /api/contact/messages/:id/read
========================================================= */

export const markContactMessageAsRead = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        message:
          "Message introuvable.",
      });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error(
      "MARK CONTACT MESSAGE READ ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de modifier le message.",
    });
  }
};

/* =========================================================
   DELETE CONTACT MESSAGE
   DELETE /api/contact/messages/:id
========================================================= */

export const deleteContactMessage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        message:
          "Message introuvable.",
      });
    }

    res.status(200).json({
      message:
        "Message supprimé avec succès.",
    });
  } catch (error) {
    console.error(
      "DELETE CONTACT MESSAGE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Impossible de supprimer le message.",
    });
  }
};