import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  Plus,
  Save,
  Trash2,
  Mail,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

interface ContactSettings {
  _id?: string;
  title: string;
  paragraph: string;
  checklist: string[];
  contactEmail?: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const ContactManagement = () => {
  const { setLoading } = useLoading();

  /* =========================================================
     SETTINGS
  ========================================================= */

  const [title, setTitle] = useState(
    "Travaillons Ensemble"
  );

  const [paragraph, setParagraph] =
    useState("");

  const [checklist, setChecklist] =
    useState<string[]>([""]);

  // NOUVEAU : email de réception
  const [contactEmail, setContactEmail] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  /* =========================================================
     MESSAGES
  ========================================================= */

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loadingMessages, setLoadingMessages] =
    useState(true);

  /* =========================================================
     LOAD SETTINGS
  ========================================================= */

  const loadContact = async () => {
    try {
      const response = await fetch(
        `${API_URL}/contact`
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de récupérer le Contact."
        );
      }

      const data: ContactSettings =
        await response.json();

      setTitle(data.title || "");

      setParagraph(
        data.paragraph || ""
      );

      setChecklist(
        Array.isArray(data.checklist) &&
          data.checklist.length > 0
          ? data.checklist
          : [""]
      );

      // NOUVEAU : récupérer l'email enregistré
      setContactEmail(
        data.contactEmail || ""
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger le Contact."
      );
    }
  };

  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  const loadMessages = async () => {
    try {
      setLoadingMessages(true);

      const response = await fetch(
        `${API_URL}/contact/messages`
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de récupérer les messages."
        );
      }

      const data: ContactMessage[] =
        await response.json();

      setMessages(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger les messages."
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadContact();
    loadMessages();
  }, []);

  /* =========================================================
     CHECKLIST
  ========================================================= */

  const handleChecklistChange = (
    index: number,
    value: string
  ) => {
    setChecklist((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addChecklist = () => {
    setChecklist((prev) => [
      ...prev,
      "",
    ]);
  };

  const removeChecklist = (
    index: number
  ) => {
    setChecklist((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.length > 0
        ? updated
        : [""];
    });
  };

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const handleSave = async () => {
    const cleanedChecklist =
      checklist
        .map((item) => item.trim())
        .filter(Boolean);

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!title.trim()) {
      toast.error(
        "Le grand titre est obligatoire."
      );
      return;
    }

    if (!paragraph.trim()) {
      toast.error(
        "Le paragraphe est obligatoire."
      );
      return;
    }

    if (
      cleanedChecklist.length === 0
    ) {
      toast.error(
        "Ajoutez au moins un élément à la checklist."
      );
      return;
    }

    // NOUVEAU : validation email
    if (!contactEmail.trim()) {
      toast.error(
        "L'adresse email de réception est obligatoire."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        contactEmail.trim()
      )
    ) {
      toast.error(
        "L'adresse email de réception est invalide."
      );
      return;
    }

    try {
      setSaving(true);
      setLoading(true);

      const response = await fetch(
        `${API_URL}/contact`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),

            paragraph:
              paragraph.trim(),

            checklist:
              cleanedChecklist,

            // NOUVEAU
            contactEmail:
              contactEmail.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'enregistrer."
        );
      }

      setTitle(
        data.contact.title
      );

      setParagraph(
        data.contact.paragraph
      );

      setChecklist(
        data.contact.checklist
      );

      // NOUVEAU : mettre à jour l'email
      setContactEmail(
        data.contact.contactEmail || ""
      );

      toast.success(
        "Contact mis à jour avec succès."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  /* =========================================================
     MARK AS READ
  ========================================================= */

  const handleMarkAsRead = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/contact/messages/${id}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de modifier le message."
        );
      }

      const updated: ContactMessage =
        await response.json();

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? updated
            : message
        )
      );

      toast.success(
        "Message marqué comme lu."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de modifier le message."
      );
    }
  };

  /* =========================================================
     DELETE MESSAGE
  ========================================================= */

  const handleDeleteMessage = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer ce message ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/contact/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer."
        );
      }

      setMessages((prev) =>
        prev.filter(
          (message) =>
            message._id !== id
        )
      );

      toast.success(
        "Message supprimé."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le message."
      );
    }
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (
    date: string
  ) => {
    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Portfolio
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
          Contact
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Gérez le contenu de votre section
          Contact et consultez les messages
          reçus depuis votre portfolio.
        </p>
      </div>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">

        <div className="mb-6 flex items-center justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Contenu du Contact
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Modifiez les textes affichés
              sur votre portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-zinc-950
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer
              </>
            )}
          </button>

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="space-y-2">

          <label className="block text-sm font-medium text-zinc-700">
            Grand titre
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Travaillons Ensemble"
            className="
              w-full
              rounded-lg
              border
              border-zinc-200
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-400
            "
          />

        </div>

        {/* =================================================
            PARAGRAPH
        ================================================= */}

        <div className="mt-6 space-y-2">

          <label className="block text-sm font-medium text-zinc-700">
            Paragraphe
          </label>

          <textarea
            value={paragraph}
            onChange={(e) =>
              setParagraph(
                e.target.value
              )
            }
            rows={5}
            placeholder="Votre paragraphe..."
            className="
              w-full
              resize-none
              rounded-lg
              border
              border-zinc-200
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-400
            "
          />

        </div>

        {/* =================================================
            EMAIL DE RÉCEPTION
        ================================================= */}

        <div className="mt-6 space-y-2">

          <label className="block text-sm font-medium text-zinc-700">
            Adresse email de réception
          </label>

          <p className="mb-2 text-xs text-zinc-500">
            Les messages envoyés depuis votre
            portfolio seront reçus à cette adresse.
          </p>

          <input
            type="email"
            value={contactEmail}
            onChange={(e) =>
              setContactEmail(
                e.target.value
              )
            }
            placeholder="exemple@email.com"
            className="
              w-full
              rounded-lg
              border
              border-zinc-200
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-400
            "
          />

        </div>

        {/* =================================================
            CHECKLIST
        ================================================= */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Checklist
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Ces éléments apparaîtront
                sous le paragraphe.
              </p>
            </div>

            <button
              type="button"
              onClick={addChecklist}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-zinc-700
                hover:text-zinc-950
              "
            >
              <Plus size={16} />
              Ajouter
            </button>

          </div>

          <div className="space-y-3">

            {checklist.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500">
                    <Check size={16} />
                  </div>

                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleChecklistChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Élément ${
                      index + 1
                    }`}
                    className="
                      flex-1
                      rounded-lg
                      border
                      border-zinc-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-zinc-400
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeChecklist(
                        index
                      )
                    }
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-zinc-200
                      text-zinc-500
                      transition
                      hover:bg-zinc-50
                      hover:text-red-500
                    "
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              )
            )}

          </div>
        </div>

      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">

        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Messages reçus
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Messages envoyés depuis le formulaire
              de votre portfolio.
            </p>
          </div>

          <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {messages.length} message
            {messages.length !== 1
              ? "s"
              : ""}
          </div>

        </div>

        {loadingMessages ? (

          <div className="flex min-h-[250px] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <Loader2
                size={25}
                className="animate-spin text-zinc-500"
              />

              <p className="text-sm text-zinc-500">
                Chargement des messages...
              </p>

            </div>

          </div>

        ) : messages.length === 0 ? (

          <div className="p-12 text-center">

            <Mail
              size={32}
              className="mx-auto text-zinc-300"
            />

            <p className="mt-4 text-sm text-zinc-500">
              Aucun message reçu pour le
              moment.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-zinc-200">

            {messages.map(
              (message) => (

                <div
                  key={message._id}
                  className={`
                    p-6
                    transition
                    ${
                      !message.isRead
                        ? "bg-zinc-50"
                        : "bg-white"
                    }
                  `}
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-semibold text-zinc-900">
                          {message.name}
                        </h3>

                        {!message.isRead && (
                          <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-white">
                            Nouveau
                          </span>
                        )}

                      </div>

                      <a
                        href={`mailto:${message.email}`}
                        className="mt-1 block text-sm text-zinc-500 hover:text-zinc-900"
                      >
                        {message.email}
                      </a>

                      <p className="mt-1 text-xs text-zinc-400">
                        {formatDate(
                          message.createdAt
                        )}
                      </p>

                      <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4">

                        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                          {message.message}
                        </p>

                      </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                      {!message.isRead && (

                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              message._id
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-zinc-200
                            px-3
                            py-2
                            text-sm
                            text-zinc-600
                            transition
                            hover:bg-zinc-50
                          "
                        >
                          <Check size={15} />
                          Lu
                        </button>

                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteMessage(
                            message._id
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-zinc-200
                          p-2
                          text-zinc-500
                          transition
                          hover:bg-zinc-50
                          hover:text-red-500
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default ContactManagement;