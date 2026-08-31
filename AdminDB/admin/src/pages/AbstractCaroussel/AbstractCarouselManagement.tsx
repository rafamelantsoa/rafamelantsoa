import React, { useEffect, useState } from "react";

import {
  Plus,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getAbstractCarousel,
  addAbstractSlide,
  updateAbstractSlide,
  deleteAbstractSlide,
  type CarouselSlide,
} from "./abstractCarouselApi";

import { useLoading } from "../../context/LoadingContext";

const AbstractCarouselManagement: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);

  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] =
    useState("");

  const { startLoading, stopLoading } = useLoading();

  /* =========================================================
     LOAD
  ========================================================= */

  const loadCarousel = async () => {
    try {
      startLoading();

      const data = await getAbstractCarousel();

      setSlides(
        Array.isArray(data?.slides)
          ? data.slides
          : []
      );
    } catch (error) {
      console.error(
        "Erreur chargement carousel :",
        error
      );

      setSlides([]);

      toast.error(
        "Impossible de charger le carrousel."
      );
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadCarousel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     UPDATE LOCAL
  ========================================================= */

  const updateLocalSlide = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide._id === id
          ? {
              ...slide,
              [field]: value,
            }
          : slide
      )
    );
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async (
    slide: CarouselSlide
  ) => {
    if (!slide._id) return;

    const title = slide.title.trim();
    const description =
      slide.description.trim();

    if (!title) {
      toast.error(
        "Le grand titre est obligatoire."
      );
      return;
    }

    if (!description) {
      toast.error(
        "Le petit texte est obligatoire."
      );
      return;
    }

    try {
      setSaving(slide._id);

      const data =
        await updateAbstractSlide(
          slide._id,
          title,
          description
        );

      /*
       * On met uniquement à jour la slide
       * concernée.
       */
      if (data?.slide) {
        setSlides((prev) =>
          prev.map((item) =>
            item._id === slide._id
              ? data.slide
              : item
          )
        );
      } else {
        /*
         * Si le backend retourne le carousel
         * complet, on le récupère uniquement
         * s'il contient réellement des slides.
         */
        if (
          Array.isArray(data?.slides)
        ) {
          setSlides(data.slides);
        }
      }

      toast.success(
        "Slide modifiée avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur sauvegarde :",
        error
      );

      toast.error(
        "Erreur lors de la modification."
      );
    } finally {
      setSaving(null);
    }
  };

  /* =========================================================
     ADD
  ========================================================= */

  const handleAdd = async () => {
    const title = newTitle.trim();
    const description =
      newDescription.trim();

    if (!title) {
      toast.error(
        "Veuillez saisir un grand titre."
      );
      return;
    }

    if (!description) {
      toast.error(
        "Veuillez saisir un petit texte."
      );
      return;
    }

    try {
      setAdding(true);

      const data =
        await addAbstractSlide(
          title,
          description
        );

      /*
       * On ajoute uniquement la nouvelle slide.
       */
      if (data?.slide) {
        setSlides((prev) => [
          ...prev,
          data.slide,
        ]);
      } else if (
        Array.isArray(data?.slides)
      ) {
        setSlides(data.slides);
      } else {
        /*
         * Sécurité si le backend ne retourne
         * ni slide ni slides.
         */
        await loadCarousel();
      }

      setNewTitle("");
      setNewDescription("");

      toast.success(
        "Nouvelle slide ajoutée avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur ajout :",
        error
      );

      toast.error(
        "Erreur lors de l'ajout de la slide."
      );
    } finally {
      setAdding(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (
    id: string
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette slide ?"
      );

    if (!confirmed) return;

    try {
      setDeleting(id);

      await deleteAbstractSlide(id);

      /*
       * IMPORTANT :
       * On retire uniquement la slide supprimée
       * de l'état local.
       */
      setSlides((prev) =>
        prev.filter(
          (slide) => slide._id !== id
        )
      );

      toast.success(
        "Slide supprimée avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error
      );

      toast.error(
        "Erreur lors de la suppression."
      );

      /*
       * En cas d'erreur, on recharge
       * les données du serveur.
       */
      await loadCarousel();
    } finally {
      setDeleting(null);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold">
          Abstract Carousel
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Gérez les contenus du carrousel du Hero.
        </p>
      </div>

      {/* =====================================================
          ADD NEW SLIDE
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 dark:bg-gray-900 dark:border-gray-800">

        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-5 h-5" />

          <h2 className="font-semibold">
            Ajouter une slide
          </h2>
        </div>

        <div className="grid gap-4">

          {/* GRAND TITRE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Grand titre
            </label>

            <textarea
              value={newTitle}
              onChange={(e) =>
                setNewTitle(e.target.value)
              }
              placeholder="Ex: 3D Abstract Iridescent Composition"
              rows={3}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                outline-none
                focus:border-blue-500
                dark:bg-gray-800
                dark:border-gray-700
              "
            />
          </div>

          {/* PETIT TEXTE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Petit texte
            </label>

            <input
              type="text"
              value={newDescription}
              onChange={(e) =>
                setNewDescription(
                  e.target.value
                )
              }
              placeholder="Ex: Creative 3D visual exploration"
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                outline-none
                focus:border-blue-500
                dark:bg-gray-800
                dark:border-gray-700
              "
            />
          </div>

          {/* BUTTON */}

          <div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={
                adding ||
                !newTitle.trim() ||
                !newDescription.trim()
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-5
                py-3
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}

              {adding
                ? "Ajout..."
                : "Ajouter"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          SLIDES EXISTANTES
      ===================================================== */}

      <div className="space-y-4">

        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className="
              rounded-xl
              border
              bg-white
              p-6
              dark:bg-gray-900
              dark:border-gray-800
            "
          >

            {/* HEADER */}

            <div className="flex items-center justify-between mb-5">

              <h2 className="font-semibold">
                Slide {index + 1}
              </h2>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    slide._id
                  )
                }
                disabled={
                  deleting === slide._id
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  text-red-600
                  hover:bg-red-50
                  dark:hover:bg-red-950/30
                  disabled:opacity-50
                "
              >
                {deleting ===
                slide._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}

                {deleting ===
                slide._id
                  ? "Suppression..."
                  : "Supprimer"}
              </button>
            </div>

            <div className="grid gap-4">

              {/* GRAND TITRE */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Grand titre
                </label>

                <textarea
                  value={slide.title}
                  onChange={(e) =>
                    updateLocalSlide(
                      slide._id,
                      "title",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                    dark:bg-gray-800
                    dark:border-gray-700
                  "
                />
              </div>

              {/* PETIT TEXTE */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Petit texte
                </label>

                <input
                  type="text"
                  value={slide.description}
                  onChange={(e) =>
                    updateLocalSlide(
                      slide._id,
                      "description",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                    dark:bg-gray-800
                    dark:border-gray-700
                  "
                />
              </div>

              {/* SAVE */}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    handleSave(slide)
                  }
                  disabled={
                    saving === slide._id
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-white
                    hover:bg-blue-700
                    disabled:opacity-50
                  "
                >
                  {saving ===
                  slide._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  {saving ===
                  slide._id
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>

            </div>
          </div>
        ))}

        {/* EMPTY */}

        {slides.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              p-10
              text-center
              text-gray-500
            "
          >
            Aucune slide.
          </div>
        )}

      </div>
    </div>
  );
};

export default AbstractCarouselManagement;