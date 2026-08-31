import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { toast } from "react-hot-toast";

interface ContactData {
  title: string;
  paragraph: string;
  checklist: string[];
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Contact = () => {
  /* =========================================================
     CONTACT CONTENT
  ========================================================= */

  const [contact, setContact] =
    useState<ContactData>({
      title: "Travaillons Ensemble",

      paragraph:
        "Envoyez votre demande directement dans mon dashboard admin. Je vous répondrai rapidement avec une proposition adaptée à votre projet.",

      checklist: [
        "Réponse rapide sous 24–48h",
        "Collaboration freelance ou long terme",
        "Design, branding & développement web",
      ],
    });

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] =
    useState<ContactForm>({
      name: "",
      email: "",
      message: "",
    });

  const [sending, setSending] =
    useState(false);

  /* =========================================================
     LOAD CONTACT
  ========================================================= */

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await fetch(
          `${API_URL}/contact`
        );

        if (!response.ok) {
          throw new Error(
            "Impossible de charger le Contact."
          );
        }

        const data: ContactData =
          await response.json();

        setContact({
          title:
            data.title ||
            "Travaillons Ensemble",

          paragraph:
            data.paragraph || "",

          checklist:
            Array.isArray(
              data.checklist
            )
              ? data.checklist
              : [],
        });
      } catch (error) {
        console.error(
          "CONTACT LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!form.name.trim()) {
      toast.error(
        "Veuillez renseigner votre nom."
      );
      return;
    }

    if (!form.email.trim()) {
      toast.error(
        "Veuillez renseigner votre email."
      );
      return;
    }

    if (!form.message.trim()) {
      toast.error(
        "Veuillez écrire votre message."
      );
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `${API_URL}/contact/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),

            email:
              form.email.trim(),

            message:
              form.message.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'envoyer le message."
        );
      }

      toast.success(
        "Votre message a été envoyé avec succès."
      );

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "CONTACT SUBMIT ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section
        id="contact"
        className="py-24 px-16 max-w-7xl mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-start bg-white p-16 dark:bg-white/5 rounded-xl">

          <div className="space-y-6 animate-pulse">

            <div className="h-14 w-3/4 rounded-xl bg-zinc-200 dark:bg-zinc-800" />

            <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />

            <div className="h-5 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />

          </div>

          <div className="space-y-6 animate-pulse">

            <div className="h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

            <div className="h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

            <div className="h-40 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

          </div>

        </div>
      </section>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      id="contact"
      className="py-0 md:py-16 px-2 md:px-12 lg:px-16 max-w-7xl mx-auto"
    >

      <div className="grid lg:grid-cols-2 gap-16 items-start bg-white p-8 md:p-16 dark:bg-white/5 rounded-xl">

        {/* =================================================
            LEFT
        ================================================= */}

        <div>

          <h2 className="text-4xl md:text-6xl font-semibold">
            {contact.title}
          </h2>

          <p className="mt-6 text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg">
            {contact.paragraph}
          </p>

          <div className="mt-10 space-y-4 text-zinc-600 dark:text-zinc-400">

            {contact.checklist.map(
              (item, index) => (
                <p key={index}>
                  ✔ {item}
                </p>
              )
            )}

          </div>

        </div>

        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="space-y-6"
        >

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={form.name}
            onChange={handleChange}
            disabled={sending}
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              border
              border-zinc-200
              dark:border-zinc-800
              bg-transparent
              focus:outline-none
              focus:border-zinc-400
              dark:focus:border-zinc-600
              transition
              disabled:opacity-50
            "
            required
          />

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={form.email}
            onChange={handleChange}
            disabled={sending}
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              border
              border-zinc-200
              dark:border-zinc-800
              bg-transparent
              focus:outline-none
              focus:border-zinc-400
              dark:focus:border-zinc-600
              transition
              disabled:opacity-50
            "
            required
          />

          {/* MESSAGE */}

          <textarea
            name="message"
            placeholder="Votre message..."
            value={form.message}
            onChange={handleChange}
            disabled={sending}
            rows={6}
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              border
              border-zinc-200
              dark:border-zinc-800
              bg-transparent
              focus:outline-none
              focus:border-zinc-400
              dark:focus:border-zinc-600
              transition
              resize-none
              disabled:opacity-50
            "
            required
          />

          {/* BUTTON */}

          <button
            type="submit"
            disabled={sending}
            className="
              w-full
              py-4
              rounded-2xl
              bg-black
              text-white
              dark:bg-white
              dark:text-black
              font-medium
              hover:opacity-90
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {sending
              ? "Envoi en cours..."
              : "Envoyer le message"}
          </button>

        </motion.form>

      </div>

    </section>
  );
};

export default Contact;