import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Save,
  Trash2,
  Phone,
  Youtube,
} from "lucide-react";
import {
  FaGithub,
  FaBehance,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

interface SocialLink {
  _id?: string;
  name: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  _id?: string;
  title?: string;
  paragraph?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

/* =========================================================
   AVAILABLE ICONS
========================================================= */

const iconOptions = [
  {
    value: "github",
    label: "GitHub",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "behance",
    label: "Behance",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
  },
  {
    value: "tiktok",
    label: "TikTok",
  },
  {
    value: "globe",
    label: "Autre",
  },
];

/* =========================================================
   ICON COMPONENT
========================================================= */

const SocialIcon = ({
  icon,
}: {
  icon?: string;
}) => {
  const size = 18;

  switch (icon) {
    case "github":
      return <FaGithub size={size} />;

    case "linkedin":
      return <Linkedin size={size} />;

    case "behance":
      return <FaBehance size={size} />;

    case "instagram":
      return <Instagram size={size} />;

    case "facebook":
      return <Facebook size={size} />;

    case "youtube":
      return <Youtube size={size} />;

    case "whatsapp":
      return <FaWhatsapp size={size} />;

    case "tiktok":
      return <FaTiktok size={size} />;

    default:
      return <Globe size={size} />;
  }
};

/* =========================================================
   NORMALIZE SOCIAL
========================================================= */

const normalizeSocial = (
  social: Partial<SocialLink> | null | undefined
): SocialLink => {
  return {
    _id:
      typeof social?._id === "string"
        ? social._id
        : undefined,

    name:
      typeof social?.name === "string"
        ? social.name
        : "",

    url:
      typeof social?.url === "string"
        ? social.url
        : "",

    icon:
      typeof social?.icon === "string" &&
      social.icon.trim() !== ""
        ? social.icon
        : "globe",
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const FooterManagement = () => {
  const { setLoading } = useLoading();

  /* =======================================================
     SETTINGS
  ======================================================= */

  const [title, setTitle] = useState(
    "Lucianno Rafamelantsoa"
  );

  const [paragraph, setParagraph] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  /* =======================================================
     SOCIALS
  ======================================================= */

  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [loadingFooter, setLoadingFooter] =
    useState(true);

  /* =======================================================
     LOAD FOOTER
  ======================================================= */

  const loadFooter = async () => {
    try {
      setLoadingFooter(true);

      const response = await fetch(
        `${API_URL}/footer`
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de récupérer le Footer."
        );
      }

      const data: FooterSettings =
        await response.json();

      setTitle(
        typeof data.title === "string"
          ? data.title
          : ""
      );

      setParagraph(
        typeof data.paragraph === "string"
          ? data.paragraph
          : ""
      );

      setAddress(
        typeof data.address === "string"
          ? data.address
          : ""
      );

      setPhone(
        typeof data.phone === "string"
          ? data.phone
          : ""
      );

      setEmail(
        typeof data.email === "string"
          ? data.email
          : ""
      );

      const normalizedSocials =
        Array.isArray(data.socialLinks)
          ? data.socialLinks.map(
              normalizeSocial
            )
          : [];

      setSocialLinks(
        normalizedSocials
      );
    } catch (error) {
      console.error(
        "LOAD FOOTER ERROR:",
        error
      );

      toast.error(
        "Impossible de charger le Footer."
      );
    } finally {
      setLoadingFooter(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadFooter();
  }, []);

  /* =======================================================
     ADD SOCIAL
  ======================================================= */

  const addSocial = () => {
    setSocialLinks((prev) => [
      ...prev,
      {
        name: "",
        url: "",
        icon: "globe",
      },
    ]);
  };

  /* =======================================================
     UPDATE SOCIAL
  ======================================================= */

  const updateSocial = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setSocialLinks((prev) => {
      const updated = [...prev];

      if (!updated[index]) {
        updated[index] = {
          name: "",
          url: "",
          icon: "globe",
        };
      }

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  /* =======================================================
     DELETE SOCIAL
  ======================================================= */

  const removeSocial = (
    index: number
  ) => {
    setSocialLinks((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    /*
     * On sécurise toutes les valeurs avant .trim()
     */

    const safeTitle =
      typeof title === "string"
        ? title.trim()
        : "";

    const safeParagraph =
      typeof paragraph === "string"
        ? paragraph.trim()
        : "";

    const safeAddress =
      typeof address === "string"
        ? address.trim()
        : "";

    const safePhone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    const safeEmail =
      typeof email === "string"
        ? email.trim()
        : "";

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!safeTitle) {
      toast.error(
        "Le grand titre est obligatoire."
      );
      return;
    }

    if (!safeParagraph) {
      toast.error(
        "Le paragraphe est obligatoire."
      );
      return;
    }

    if (!safeAddress) {
      toast.error(
        "L'adresse est obligatoire."
      );
      return;
    }

    if (!safePhone) {
      toast.error(
        "Le téléphone est obligatoire."
      );
      return;
    }

    if (!safeEmail) {
      toast.error(
        "L'email est obligatoire."
      );
      return;
    }

    /* =====================================================
       CLEAN SOCIAL LINKS
    ===================================================== */

    const cleanedSocialLinks =
      (Array.isArray(socialLinks)
        ? socialLinks
        : []
      )
        .map((social) => {
          const safeSocial =
            normalizeSocial(social);

          return {
            ...(safeSocial._id
              ? {
                  _id: safeSocial._id,
                }
              : {}),

            name:
              typeof safeSocial.name ===
              "string"
                ? safeSocial.name.trim()
                : "",

            url:
              typeof safeSocial.url ===
              "string"
                ? safeSocial.url.trim()
                : "",

            icon:
              typeof safeSocial.icon ===
                "string" &&
              safeSocial.icon.trim() !== ""
                ? safeSocial.icon.trim()
                : "globe",
          };
        })
        .filter(
          (social) =>
            social.name.length > 0 &&
            social.url.length > 0
        );

    /* =====================================================
       REQUEST
    ===================================================== */

    try {
      setSaving(true);
      setLoading(true);

      const response = await fetch(
        `${API_URL}/footer`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: safeTitle,

            paragraph:
              safeParagraph,

            address:
              safeAddress,

            phone:
              safePhone,

            email:
              safeEmail,

            socialLinks:
              cleanedSocialLinks,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'enregistrer le Footer."
        );
      }

      /*
       * Selon ton backend, le footer peut
       * être directement dans data ou dans data.footer.
       */

      const savedFooter =
        data.footer || data;

      setTitle(
        typeof savedFooter.title ===
          "string"
          ? savedFooter.title
          : safeTitle
      );

      setParagraph(
        typeof savedFooter.paragraph ===
          "string"
          ? savedFooter.paragraph
          : safeParagraph
      );

      setAddress(
        typeof savedFooter.address ===
          "string"
          ? savedFooter.address
          : safeAddress
      );

      setPhone(
        typeof savedFooter.phone ===
          "string"
          ? savedFooter.phone
          : safePhone
      );

      setEmail(
        typeof savedFooter.email ===
          "string"
          ? savedFooter.email
          : safeEmail
      );

      setSocialLinks(
        Array.isArray(
          savedFooter.socialLinks
        )
          ? savedFooter.socialLinks.map(
              normalizeSocial
            )
          : cleanedSocialLinks
      );

      toast.success(
        "Footer mis à jour avec succès."
      );
    } catch (error) {
      console.error(
        "SAVE FOOTER ERROR:",
        error
      );

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

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingFooter) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={25}
            className="animate-spin text-zinc-500"
          />

          <p className="text-sm text-zinc-500">
            Chargement du Footer...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Portfolio
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Footer
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Gérez le contenu, les coordonnées et
              les réseaux sociaux de votre Footer.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
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
      </div>

      {/* =================================================
          GENERAL CONTENT
      ================================================= */}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            Contenu du Footer
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Modifiez les informations principales
            affichées dans votre Footer.
          </p>
        </div>

        {/* TITLE */}

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
            placeholder="Lucianno Rafamelantsoa"
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

        {/* PARAGRAPH */}

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
      </div>

      {/* =================================================
          CONTACT INFORMATION
      ================================================= */}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            Informations de contact
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Ces informations apparaîtront dans la
            colonne Contact du Footer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* ADDRESS */}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Adresse
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-4 top-3.5 text-zinc-400"
              />

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                rows={3}
                placeholder={
                  "Antananarivo\nMadagascar"
                }
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-zinc-200
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-zinc-400
                "
              />
            </div>
          </div>

          {/* PHONE */}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Téléphone
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-4 top-3.5 text-zinc-400"
              />

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="+261 34 00 000 00"
                className="
                  w-full
                  rounded-lg
                  border
                  border-zinc-200
                  px-11
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-zinc-400
                "
              />
            </div>
          </div>

          {/* EMAIL */}

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700">
              Adresse email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-3.5 text-zinc-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="contact@portfolio.com"
                className="
                  w-full
                  rounded-lg
                  border
                  border-zinc-200
                  px-11
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-zinc-400
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          SOCIAL NETWORKS
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">

        <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Réseaux sociaux
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Ajoutez, modifiez ou supprimez vos
              réseaux sociaux.
            </p>
          </div>

          <button
            type="button"
            onClick={addSocial}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-zinc-200
              px-4
              py-2.5
              text-sm
              font-medium
              text-zinc-700
              transition
              hover:bg-zinc-50
              hover:text-zinc-950
            "
          >
            <Plus size={16} />
            Ajouter un réseau
          </button>
        </div>

        <div className="divide-y divide-zinc-200">

          {socialLinks.length === 0 ? (
            <div className="p-12 text-center">
              <Globe
                size={30}
                className="mx-auto text-zinc-300"
              />

              <p className="mt-4 text-sm text-zinc-500">
                Aucun réseau social configuré.
              </p>
            </div>
          ) : (
            socialLinks.map(
              (social, index) => {

                /*
                 * Sécurité supplémentaire pour
                 * éviter undefined dans le rendu.
                 */

                const safeSocial =
                  normalizeSocial(
                    social
                  );

                return (
                  <div
                    key={
                      safeSocial._id ||
                      index
                    }
                    className="p-6"
                  >
                    <div className="grid gap-4 lg:grid-cols-[180px_1fr_1fr_auto] lg:items-end">

                      {/* ICON */}

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-600">
                          Icône
                        </label>

                        <div className="flex items-center gap-2">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600">
                            <SocialIcon
                              icon={
                                safeSocial.icon
                              }
                            />
                          </div>

                          <select
                            value={
                              safeSocial.icon
                            }
                            onChange={(e) =>
                              updateSocial(
                                index,
                                "icon",
                                e.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-lg
                              border
                              border-zinc-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              focus:border-zinc-400
                            "
                          >
                            {iconOptions.map(
                              (option) => (
                                <option
                                  key={
                                    option.value
                                  }
                                  value={
                                    option.value
                                  }
                                >
                                  {
                                    option.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      {/* NAME */}

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-600">
                          Nom
                        </label>

                        <input
                          type="text"
                          value={
                            safeSocial.name
                          }
                          onChange={(e) =>
                            updateSocial(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="GitHub"
                          className="
                            h-11
                            w-full
                            rounded-lg
                            border
                            border-zinc-200
                            px-4
                            text-sm
                            outline-none
                            transition
                            focus:border-zinc-400
                          "
                        />
                      </div>

                      {/* URL */}

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-600">
                          Lien
                        </label>

                        <div className="relative">
                          <ArrowUpRight
                            size={16}
                            className="absolute left-4 top-3.5 text-zinc-400"
                          />

                          <input
                            type="url"
                            value={
                              safeSocial.url
                            }
                            onChange={(e) =>
                              updateSocial(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                            className="
                              h-11
                              w-full
                              rounded-lg
                              border
                              border-zinc-200
                              pl-10
                              pr-4
                              text-sm
                              outline-none
                              transition
                              focus:border-zinc-400
                            "
                          />
                        </div>
                      </div>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeSocial(
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
                        title="Supprimer"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterManagement;
