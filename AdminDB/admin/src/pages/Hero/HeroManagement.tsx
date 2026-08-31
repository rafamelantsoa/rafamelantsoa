import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  Save,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Loader2,
  FileCheck2,
} from "lucide-react";

import { toast } from "react-hot-toast";

import {
  getHero,
  updateHero,
  updateLightImage,
  updateDarkImage,
  updateCV,
  deleteLightImage,
  deleteDarkImage,
} from "./heroApi";

import type { Hero } from "./types/hero";

import { useLoading } from "../../context/LoadingContext";

/* =========================================================
   TYPES
========================================================= */

interface ImageUploadProps {
  title: string;
  description: string;
  preview: string;
  file: File | null;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onDelete: () => void;
  deleting: boolean;
  required?: boolean;
}

/* =========================================================
   CONSTANTES
========================================================= */

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 Mo
const MAX_CV_SIZE = 20 * 1024 * 1024; // 20 Mo

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function HeroManagement() {
  const { setLoading } = useLoading();

  const [hero, setHero] =
    useState<Hero | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [lightImage, setLightImage] =
    useState<File | null>(null);

  const [darkImage, setDarkImage] =
    useState<File | null>(null);

  const [cv, setCV] =
    useState<File | null>(null);

  const [lightPreview, setLightPreview] =
    useState("");

  const [darkPreview, setDarkPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deletingLight, setDeletingLight] =
    useState(false);

  const [deletingDark, setDeletingDark] =
    useState(false);

  /* =========================================================
     LOAD HERO
  ========================================================= */

  const loadHero = async (): Promise<void> => {
    try {
      setLoading(true);

      const data = await getHero();

      setHero(data);

      setTitle(data.title || "");

      setDescription(
        data.description || ""
      );

      setLightPreview(
        data.lightImage?.url || ""
      );

      setDarkPreview(
        data.darkImage?.url || ""
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de charger le Hero."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  /* =========================================================
     IMAGE VALIDATION
  ========================================================= */

  const validateImage = (
    file: File
  ): string | null => {
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      return "Format invalide. Utilisez uniquement JPG, PNG ou WebP.";
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return "L'image ne doit pas dépasser 2 Mo.";
    }

    return null;
  };

  /* =========================================================
     LIGHT IMAGE
  ========================================================= */

  const handleLightImage = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const validationError =
      validateImage(file);

    if (validationError) {
      toast.error(validationError);

      event.target.value = "";

      return;
    }

    if (
      lightPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        lightPreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setLightImage(file);

    setLightPreview(previewUrl);
  };

  /* =========================================================
     DARK IMAGE
  ========================================================= */

  const handleDarkImage = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const validationError =
      validateImage(file);

    if (validationError) {
      toast.error(validationError);

      event.target.value = "";

      return;
    }

    if (
      darkPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        darkPreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setDarkImage(file);

    setDarkPreview(previewUrl);
  };

  /* =========================================================
     CV
  ========================================================= */

  const handleCV = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      toast.error(
        "Le CV doit être au format PDF."
      );

      event.target.value = "";

      return;
    }

    if (file.size > MAX_CV_SIZE) {
      toast.error(
        "Le CV ne doit pas dépasser 20 Mo."
      );

      event.target.value = "";

      return;
    }

    setCV(file);
  };

  /* =========================================================
     DELETE LIGHT IMAGE
  ========================================================= */

  const handleDeleteLight =
    async (): Promise<void> => {
      try {
        /*
         * Si c'est seulement une nouvelle image
         * sélectionnée, on la retire du frontend.
         */

        if (
          lightImage &&
          lightPreview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(
            lightPreview
          );

          setLightImage(null);

          setLightPreview(
            hero?.lightImage?.url || ""
          );

          toast.success(
            "La nouvelle image Light a été retirée."
          );

          return;
        }

        if (
          !hero?.lightImage?.publicId
        ) {
          toast.error(
            "Aucune image Light à supprimer."
          );

          return;
        }

        const confirmed =
          window.confirm(
            "Voulez-vous vraiment supprimer l'image Light actuelle ?"
          );

        if (!confirmed) return;

        setDeletingLight(true);

        setLoading(true);

        await deleteLightImage();

        setLightImage(null);

        setLightPreview("");

        setHero((current) => {
          if (!current) return current;

          return {
            ...current,

            lightImage: {
              url: "",
              publicId: "",
            },
          };
        });

        toast.success(
          "L'image Light a été supprimée."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible de supprimer l'image Light."
        );
      } finally {
        setDeletingLight(false);

        setLoading(false);
      }
    };

  /* =========================================================
     DELETE DARK IMAGE
  ========================================================= */

  const handleDeleteDark =
    async (): Promise<void> => {
      try {
        /*
         * Si c'est seulement une nouvelle image
         * sélectionnée, on la retire du frontend.
         */

        if (
          darkImage &&
          darkPreview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(
            darkPreview
          );

          setDarkImage(null);

          setDarkPreview(
            hero?.darkImage?.url || ""
          );

          toast.success(
            "La nouvelle image Dark a été retirée."
          );

          return;
        }

        if (
          !hero?.darkImage?.publicId
        ) {
          toast.error(
            "Aucune image Dark à supprimer."
          );

          return;
        }

        const confirmed =
          window.confirm(
            "Voulez-vous vraiment supprimer l'image Dark actuelle ?"
          );

        if (!confirmed) return;

        setDeletingDark(true);

        setLoading(true);

        await deleteDarkImage();

        setDarkImage(null);

        setDarkPreview("");

        setHero((current) => {
          if (!current) return current;

          return {
            ...current,

            darkImage: {
              url: "",
              publicId: "",
            },
          };
        });

        toast.success(
          "L'image Dark a été supprimée."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible de supprimer l'image Dark."
        );
      } finally {
        setDeletingDark(false);

        setLoading(false);
      }
    };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm =
    (): boolean => {
      if (!title.trim()) {
        toast.error(
          "Le grand titre est obligatoire."
        );

        return false;
      }

      if (!description.trim()) {
        toast.error(
          "La description est obligatoire."
        );

        return false;
      }

      if (!lightPreview) {
        toast.error(
          "L'image Light est obligatoire."
        );

        return false;
      }

      if (!darkPreview) {
        toast.error(
          "L'image Dark est obligatoire."
        );

        return false;
      }

      if (!hero?.cvUrl && !cv) {
        toast.error(
          "Le CV est obligatoire."
        );

        return false;
      }

      return true;
    };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave =
    async (): Promise<void> => {
      if (!validateForm()) {
        return;
      }

      try {
        setSaving(true);

        setLoading(true);

        /*
         * Texte
         */

        await updateHero({
          title: title.trim(),

          description:
            description.trim(),
        });

        /*
         * Image Light
         */

        if (lightImage) {
          await updateLightImage(
            lightImage
          );
        }

        /*
         * Image Dark
         */

        if (darkImage) {
          await updateDarkImage(
            darkImage
          );
        }

        /*
         * CV
         */

        if (cv) {
          await updateCV(cv);
        }

        /*
         * Rechargement des données
         */

        const data =
          await getHero();

        setHero(data);

        setTitle(
          data.title || ""
        );

        setDescription(
          data.description || ""
        );

        setLightPreview(
          data.lightImage?.url || ""
        );

        setDarkPreview(
          data.darkImage?.url || ""
        );

        /*
         * Nettoyage des previews blob
         */

        if (
          lightPreview.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            lightPreview
          );
        }

        if (
          darkPreview.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            darkPreview
          );
        }

        setLightImage(null);

        setDarkImage(null);

        setCV(null);

        toast.success(
          "Les modifications ont été enregistrées avec succès."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de l'enregistrement."
        );
      } finally {
        setSaving(false);

        setLoading(false);
      }
    };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="mx-auto w-full max-w-7xl">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">

              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              Portfolio

            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Hero
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Gérez le contenu principal affiché
              sur la page d'accueil de votre
              portfolio.
            </p>

          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              deletingLight ||
              deletingDark
            }
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-zinc-950
              px-6
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
                  size={17}
                  className="animate-spin"
                />

                Enregistrement...
              </>
            ) : (
              <>
                <Save size={17} />

                Enregistrer
              </>
            )}

          </button>

        </div>

      </div>

      <div className="space-y-6">

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

          <div className="border-b border-zinc-200 px-6 py-5 md:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">

                <FileText size={19} />

              </div>

              <div>

                <h2 className="font-semibold text-zinc-950">
                  Contenu principal
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Les textes affichés dans la
                  section Hero.
                </p>

              </div>

            </div>

          </div>

          <div className="space-y-6 p-6 md:p-8">

            {/* TITLE */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="hero-title"
                  className="text-sm font-medium text-zinc-800"
                >
                  Grand titre

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <span className="text-xs text-zinc-400">
                  {title.length}/120
                </span>

              </div>

              <input
                id="hero-title"
                type="text"
                maxLength={120}
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Graphiste & Développeur Web"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  px-4
                  text-sm
                  text-zinc-950
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-zinc-950
                  focus:bg-white
                "
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="hero-description"
                  className="text-sm font-medium text-zinc-800"
                >
                  Description

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <span className="text-xs text-zinc-400">
                  {description.length}/500
                </span>

              </div>

              <textarea
                id="hero-description"
                maxLength={500}
                rows={6}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Présentez votre activité..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-zinc-950
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-zinc-950
                  focus:bg-white
                "
              />

            </div>

          </div>

        </section>

        {/* =================================================
            CV
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

          <div className="border-b border-zinc-200 px-6 py-5 md:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">

                <FileCheck2 size={19} />

              </div>

              <div>

                <h2 className="font-semibold text-zinc-950">

                  Curriculum Vitae

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  PDF utilisé par le bouton
                  « Download CV ».
                </p>

              </div>

            </div>

          </div>

          <div className="p-6 md:p-8">

            <div className="flex flex-col gap-5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm">

                  <FileText size={21} />

                </div>

                <div>

                  <p className="text-sm font-medium text-zinc-900">

                    {cv
                      ? cv.name
                      : hero?.cvUrl
                        ? "CV actuellement enregistré"
                        : "Aucun CV sélectionné"}

                  </p>

                  <p className="mt-1 text-xs text-zinc-500">

                    {cv
                      ? `${(
                          cv.size /
                          1024 /
                          1024
                        ).toFixed(2)} Mo`
                      : hero?.cvUrl
                        ? "Document PDF disponible"
                        : "Le CV est obligatoire"}

                  </p>

                  {hero?.cvUrl && !cv && (

                    <a
                      href={hero.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                    >
                      Voir le CV actuel
                    </a>

                  )}

                </div>

              </div>

              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950">

                <Upload size={17} />

                {cv
                  ? "Changer le CV"
                  : "Choisir un CV"}

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleCV}
                />

              </label>

            </div>

            <p className="mt-3 text-xs text-zinc-400">
              Format accepté : PDF · Taille
              maximale : 20 Mo
            </p>

          </div>

        </section>

        {/* =================================================
            IMAGES
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

          <div className="border-b border-zinc-200 px-6 py-5 md:px-8">

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">

                  <ImageIcon size={19} />

                </div>

                <div>

                  <h2 className="font-semibold text-zinc-950">
                    Images du Hero
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Une image pour chaque thème
                    de votre portfolio.
                  </p>

                </div>

              </div>

              <span className="text-xs text-zinc-400">
                JPG · PNG · WebP · Max. 2 Mo
              </span>

            </div>

          </div>

          <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-2">

            <ImageUpload
              title="Image Light"
              description="Image affichée avec le thème clair."
              preview={lightPreview}
              file={lightImage}
              onChange={handleLightImage}
              onDelete={handleDeleteLight}
              deleting={deletingLight}
              required
            />

            <ImageUpload
              title="Image Dark"
              description="Image affichée avec le thème sombre."
              preview={darkPreview}
              file={darkImage}
              onChange={handleDarkImage}
              onDelete={handleDeleteDark}
              deleting={deletingDark}
              required
            />

          </div>

        </section>

      </div>

    </div>
  );
}

/* =========================================================
   IMAGE UPLOAD COMPONENT
========================================================= */

function ImageUpload({
  title,
  description,
  preview,
  file,
  onChange,
  onDelete,
  deleting,
  required = false,
}: ImageUploadProps) {
  const hasImage =
    Boolean(preview);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="text-sm font-semibold text-zinc-900">
              {title}
            </h3>

            {required && (
              <span className="text-red-500">
                *
              </span>
            )}

          </div>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {description}
          </p>

        </div>

        {hasImage && (

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            title="Supprimer l'image"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-red-100
              bg-red-50
              text-red-500
              transition
              hover:border-red-200
              hover:bg-red-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {deleting ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={16} />
            )}

          </button>

        )}

      </div>

      {/* PREVIEW */}

      <div className="p-5">

        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-[#F6F3EE] p-5">

          {hasImage ? (

            <img
              src={preview}
              alt={title}
              className="
                max-h-[250px]
                max-w-full
                rounded-lg
                object-contain
              "
            />

          ) : (

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-zinc-300 shadow-sm">

                <ImageIcon size={26} />

              </div>

              <p className="mt-4 text-sm font-medium text-zinc-500">
                Aucune image
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Cette image est obligatoire.
              </p>

            </div>

          )}

        </div>

        {/* FILE INFO */}

        {file && (

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3">

            <ImageIcon
              size={16}
              className="shrink-0 text-zinc-500"
            />

            <div className="min-w-0">

              <p className="truncate text-xs font-medium text-zinc-700">
                {file.name}
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-400">

                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                Mo

              </p>

            </div>

          </div>

        )}

        {/* BUTTON */}

        <label className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950">

          <Upload size={17} />

          {hasImage
            ? "Remplacer l'image"
            : "Choisir une image"}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onChange}
          />

        </label>

        <p className="mt-3 text-center text-[11px] text-zinc-400">
          JPG, PNG ou WebP · 2 Mo maximum
        </p>

      </div>

    </div>
  );
}