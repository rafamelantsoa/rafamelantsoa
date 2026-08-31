import {
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "react-hot-toast";

import { useLoading } from "../../context/LoadingContext";

import {
  createExperience,
  deleteExperience,
  getExperiences,
  getExperienceSection,
  updateExperience,
  updateExperienceSection,
} from "./experienceApi";

import type {
  Experience,
} from "./types/experience";

const ExperienceManagement = () => {
  // ============================================================
  // GLOBAL LOADING
  // ============================================================

  const { setLoading } = useLoading();

  // ============================================================
  // STATE
  // ============================================================

  const [title, setTitle] = useState(
    "Expériences professionnelles"
  );

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [savingTitle, setSavingTitle] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    missions: [""],
  });

  // ============================================================
  // SORT EXPERIENCES BY DATE
  // Plus récente -> plus ancienne
  // ============================================================

  const sortExperiences = (
    experiencesList: Experience[]
  ): Experience[] => {
    return [...experiencesList].sort(
      (a, b) => {
        const dateA = a.date
          .trim()
          .toLowerCase();

        const dateB = b.date
          .trim()
          .toLowerCase();

        // --------------------------------------------------------
        // "Present" / "Présent" / "Aujourd'hui"
        // toujours avant les autres expériences
        // --------------------------------------------------------

        const isCurrentA =
          dateA.includes("present") ||
          dateA.includes("présent") ||
          dateA.includes("aujourd");

        const isCurrentB =
          dateB.includes("present") ||
          dateB.includes("présent") ||
          dateB.includes("aujourd");

        if (isCurrentA && !isCurrentB) {
          return -1;
        }

        if (!isCurrentA && isCurrentB) {
          return 1;
        }

        // --------------------------------------------------------
        // Récupération de la première année
        // Exemple :
        // "2025 — Present" => 2025
        // "2024 — 2025"   => 2024
        // --------------------------------------------------------

        const yearA = Number(
          dateA.match(/\b(19|20)\d{2}\b/)?.[0] ||
            0
        );

        const yearB = Number(
          dateB.match(/\b(19|20)\d{2}\b/)?.[0] ||
            0
        );

        // Plus grande année = plus récente
        return yearB - yearA;
      }
    );
  };

  // ============================================================
  // LOAD
  // ============================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        section,
        experiencesData,
      ] = await Promise.all([
        getExperienceSection(),
        getExperiences(),
      ]);

      setTitle(section.title);

      // Tri automatique dès le chargement
      setExperiences(
        sortExperiences(experiencesData)
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger les expériences"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================================================
  // TITLE
  // ============================================================

  const handleSaveTitle = async () => {
    if (!title.trim()) {
      toast.error(
        "Le titre de la section est obligatoire"
      );
      return;
    }

    try {
      setSavingTitle(true);
      setLoading(true);

      await updateExperienceSection(
        title.trim()
      );

      toast.success(
        "Titre mis à jour"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors de la modification du titre"
      );
    } finally {
      setSavingTitle(false);
      setLoading(false);
    }
  };

  // ============================================================
  // FORM RESET
  // ============================================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      company: "",
      role: "",
      date: "",
      missions: [""],
    });
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (
    field:
      | "company"
      | "role"
      | "date",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // MISSIONS
  // ============================================================

  const handleMissionChange = (
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const missions = [
        ...prev.missions,
      ];

      missions[index] = value;

      return {
        ...prev,
        missions,
      };
    });
  };

  const addMission = () => {
    setForm((prev) => ({
      ...prev,
      missions: [
        ...prev.missions,
        "",
      ],
    }));
  };

  const removeMission = (
    index: number
  ) => {
    setForm((prev) => {
      const missions =
        prev.missions.filter(
          (_, i) => i !== index
        );

      return {
        ...prev,
        missions:
          missions.length > 0
            ? missions
            : [""],
      };
    });
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (
    experience: Experience
  ) => {
    setEditingId(
      experience._id
    );

    setForm({
      company: experience.company,
      role: experience.role,
      date: experience.date,
      missions:
        experience.missions.length > 0
          ? experience.missions
          : [""],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // SAVE EXPERIENCE
  // ============================================================

  const handleSave = async () => {
    // ----------------------------------------------------------
    // VALIDATION SOCIÉTÉ
    // ----------------------------------------------------------

    if (!form.company.trim()) {
      toast.error(
        "Le nom de la société est obligatoire"
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDATION POSTE
    // ----------------------------------------------------------

    if (!form.role.trim()) {
      toast.error(
        "Le poste est obligatoire"
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDATION DATE
    // ----------------------------------------------------------

    if (!form.date.trim()) {
      toast.error(
        "La date est obligatoire"
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDATION MISSIONS
    // Toutes les missions doivent être remplies
    // ----------------------------------------------------------

    const hasEmptyMission =
      form.missions.some(
        (mission) =>
          !mission.trim()
      );

    if (hasEmptyMission) {
      toast.error(
        "Toutes les activités sont obligatoires"
      );
      return;
    }

    try {
      setLoading(true);

      // --------------------------------------------------------
      // Nettoyage des missions
      // --------------------------------------------------------

      const cleanedMissions =
        form.missions.map(
          (mission) =>
            mission.trim()
        );

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------

      if (editingId) {
        const updated =
          await updateExperience(
            editingId,
            {
              company:
                form.company.trim(),

              role:
                form.role.trim(),

              date:
                form.date.trim(),

              missions:
                cleanedMissions,
            }
          );

        setExperiences(
          (prev) =>
            sortExperiences(
              prev.map(
                (experience) =>
                  experience._id ===
                  editingId
                    ? updated
                    : experience
              )
            )
        );

        toast.success(
          "Expérience modifiée"
        );
      }

      // --------------------------------------------------------
      // CREATE
      // --------------------------------------------------------

      else {
        const created =
          await createExperience({
            company:
              form.company.trim(),

            role:
              form.role.trim(),

            date:
              form.date.trim(),

            missions:
              cleanedMissions,

            // Gardé pour rester compatible
            // avec ton API existante.
            order:
              experiences.length,
          });

        setExperiences(
          (prev) =>
            sortExperiences([
              ...prev,
              created,
            ])
        );

        toast.success(
          "Expérience ajoutée"
        );
      }

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette expérience ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteExperience(id);

      setExperiences(
        (prev) =>
          prev.filter(
            (experience) =>
              experience._id !== id
          )
      );

      toast.success(
        "Expérience supprimée"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de supprimer l'expérience"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="p-8 space-y-8">

      {/* ========================================================
          TITLE
      ======================================================== */}

      <div className="bg-white rounded-xl border border-zinc-200 p-6">

        <div className="flex items-center justify-between gap-4 mb-4">

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Titre de la section
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Grand titre affiché sur le portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveTitle}
            disabled={savingTitle}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-zinc-900
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-zinc-800
              disabled:opacity-50
            "
          >
            <Save size={16} />

            {savingTitle
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>

        </div>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="
            w-full
            rounded-lg
            border
            border-zinc-200
            px-4
            py-3
            text-sm
            outline-none
            focus:border-zinc-400
          "
          placeholder="Expériences professionnelles"
        />

      </div>

      {/* ========================================================
          FORM
      ======================================================== */}

      <div className="bg-white rounded-xl border border-zinc-200 p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {editingId
                ? "Modifier l'expérience"
                : "Ajouter une expérience"}
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Gérez les informations affichées
              sur votre parcours professionnel.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-zinc-200
                px-4
                py-2
                text-sm
                text-zinc-600
                hover:bg-zinc-50
              "
            >
              <X size={16} />
              Annuler
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* COMPANY */}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Nom de société *
            </label>

            <input
              type="text"
              value={form.company}
              onChange={(e) =>
                handleChange(
                  "company",
                  e.target.value
                )
              }
              required
              className="
                w-full
                rounded-lg
                border
                border-zinc-200
                px-4
                py-3
                text-sm
                outline-none
                focus:border-zinc-400
              "
              placeholder="Mirasa Association"
            />
          </div>

          {/* ROLE */}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Poste *
            </label>

            <input
              type="text"
              value={form.role}
              onChange={(e) =>
                handleChange(
                  "role",
                  e.target.value
                )
              }
              required
              className="
                w-full
                rounded-lg
                border
                border-zinc-200
                px-4
                py-3
                text-sm
                outline-none
                focus:border-zinc-400
              "
              placeholder="Frontend Developer & UI Designer"
            />
          </div>

          {/* DATE */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Date *
            </label>

            <input
              type="text"
              value={form.date}
              onChange={(e) =>
                handleChange(
                  "date",
                  e.target.value
                )
              }
              required
              className="
                w-full
                rounded-lg
                border
                border-zinc-200
                px-4
                py-3
                text-sm
                outline-none
                focus:border-zinc-400
              "
              placeholder="2025 — Present"
            />

          </div>

        </div>

        {/* MISSIONS */}

        <div className="mt-6">

          <div className="flex items-center justify-between mb-3">

            <label className="block text-sm font-medium text-zinc-700">
              Sommaire d'activités *
            </label>

            <button
              type="button"
              onClick={addMission}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-zinc-700
                hover:text-zinc-900
              "
            >
              <Plus size={16} />
              Ajouter
            </button>

          </div>

          <div className="space-y-3">

            {form.missions.map(
              (mission, index) => (

                <div
                  key={index}
                  className="flex gap-3"
                >

                  <input
                    type="text"
                    value={mission}
                    onChange={(e) =>
                      handleMissionChange(
                        index,
                        e.target.value
                      )
                    }
                    required
                    className="
                      flex-1
                      rounded-lg
                      border
                      border-zinc-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-zinc-400
                    "
                    placeholder={`Activité ${index + 1} *`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeMission(index)
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

        {/* SAVE */}

        <div className="flex justify-end mt-6">

          <button
            type="button"
            onClick={handleSave}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-zinc-900
              px-5
              py-3
              text-sm
              font-medium
              text-white
              hover:bg-zinc-800
            "
          >

            {editingId ? (
              <>
                <Save size={16} />
                Modifier
              </>
            ) : (
              <>
                <Plus size={16} />
                Ajouter l'expérience
              </>
            )}

          </button>

        </div>

      </div>

      {/* ========================================================
          LIST
      ======================================================== */}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-zinc-200">

          <h2 className="text-lg font-semibold text-zinc-900">
            Expériences
          </h2>

        </div>

        <div className="divide-y divide-zinc-200">

          {experiences.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-sm text-zinc-500">
                Aucune expérience enregistrée.
              </p>

            </div>

          ) : (

            experiences.map(
              (experience) => (

                <div
                  key={experience._id}
                  className="
                    p-6
                    flex
                    flex-col
                    md:flex-row
                    md:items-start
                    md:justify-between
                    gap-5
                  "
                >

                  {/* CONTENT */}

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="font-semibold text-zinc-900">
                        {experience.company}
                      </h3>

                      <span className="text-sm text-zinc-500">
                        {experience.date}
                      </span>

                    </div>

                    <p className="text-sm text-zinc-600 mt-1">
                      {experience.role}
                    </p>

                    <ul className="mt-3 space-y-1">

                      {experience.missions.map(
                        (
                          mission,
                          index
                        ) => (

                          <li
                            key={index}
                            className="text-sm text-zinc-500"
                          >
                            — {mission}
                          </li>

                        )
                      )}

                    </ul>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          experience
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
                        hover:bg-zinc-50
                      "
                    >
                      <Pencil size={15} />
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          experience._id
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
                        hover:bg-zinc-50
                        hover:text-red-500
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
};

export default ExperienceManagement;