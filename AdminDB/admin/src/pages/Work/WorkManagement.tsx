import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";

// Si ton fichier axiosInstance est dans un autre dossier,
// adapte uniquement ce chemin d'import.

type Stat = {
  number: number;
  label: string;
};

type WorkData = {
  _id: string;
  stats: Stat[];
  marquee: string[];
  title: string;
  description: string;
};

const WorkManagement = () => {
  const [data, setData] = useState<WorkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | GET DATA
   |--------------------------------------------------------------------------
   */

  const fetchWork = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/work");

      setData(response.data);
    } catch (error) {
      console.error("Erreur récupération Work:", error);

      toast.error(
        "Impossible de charger la section Work."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWork();
  }, []);

  /*
   |--------------------------------------------------------------------------
   | UPDATE STAT
   |--------------------------------------------------------------------------
   */

  const updateStat = (
    index: number,
    field: keyof Stat,
    value: string
  ) => {
    if (!data) return;

    const stats = [...data.stats];

    stats[index] = {
      ...stats[index],
      [field]:
        field === "number"
          ? Number(value)
          : value,
    };

    setData({
      ...data,
      stats,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | ADD MARQUEE
   |--------------------------------------------------------------------------
   */

  const addMarquee = () => {
    if (!data) return;

    setData({
      ...data,
      marquee: [
        ...data.marquee,
        "NEW ITEM",
      ],
    });
  };

  /*
   |--------------------------------------------------------------------------
   | UPDATE MARQUEE
   |--------------------------------------------------------------------------
   */

  const updateMarquee = (
    index: number,
    value: string
  ) => {
    if (!data) return;

    const marquee = [...data.marquee];

    marquee[index] = value;

    setData({
      ...data,
      marquee,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | DELETE MARQUEE
   |--------------------------------------------------------------------------
   */

  const deleteMarquee = (index: number) => {
    if (!data) return;

    const marquee = data.marquee.filter(
      (_, i) => i !== index
    );

    setData({
      ...data,
      marquee,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | SAVE
   |--------------------------------------------------------------------------
   */

  const handleSave = async () => {
    if (!data) return;

    if (data.stats.length !== 4) {
      toast.error(
        "La section doit contenir exactement 4 statistiques."
      );
      return;
    }

    for (const stat of data.stats) {
      if (!stat.label.trim()) {
        toast.error(
          "Toutes les statistiques doivent avoir un libellé."
        );
        return;
      }
    }

    if (!data.title.trim()) {
      toast.error(
        "Le grand titre est obligatoire."
      );
      return;
    }

    if (!data.description.trim()) {
      toast.error(
        "Le paragraphe est obligatoire."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await axiosInstance.put(
        "/work",
        {
          stats: data.stats,
          marquee: data.marquee,
          title: data.title.trim(),
          description: data.description.trim(),
        }
      );

      /*
       * Selon ton controller backend,
       * la réponse peut être directement l'objet
       * ou { data: objet }.
       *
       * On gère les deux cas.
       */

      setData(
        response.data?.data ??
          response.data
      );

      toast.success(
        "Section Work mise à jour avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur sauvegarde Work:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de l'enregistrement."
        );
      } else {
        toast.error(
          "Erreur lors de l'enregistrement."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   |--------------------------------------------------------------------------
   | LOADING
   |--------------------------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2
            size={38}
            className="animate-spin text-[#2464cc]"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement de Work...
          </p>
        </div>
      </div>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | ERROR
   |--------------------------------------------------------------------------
   */

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Impossible de charger Work.
          </p>

          <button
            type="button"
            onClick={fetchWork}
            className="mt-4 rounded-lg bg-[#2464cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d55b0]"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Work
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez les statistiques, le marquee et le contenu de la section Work.
        </p>
      </div>

      {/* STATS */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistiques
          </h2>

          <p className="text-sm text-gray-500">
            Les 4 statistiques affichées sur la section Work.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {data.stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-5 dark:border-gray-800"
            >

              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Statistique {index + 1}
                </span>
              </div>

              <div className="space-y-4">

                {/* NUMBER */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre
                  </label>

                  <input
                    type="number"
                    value={stat.number}
                    onChange={(e) =>
                      updateStat(
                        index,
                        "number",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* LABEL */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Libellé
                  </label>

                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) =>
                      updateStat(
                        index,
                        "label",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* MARQUEE */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Marquee
            </h2>

            <p className="text-sm text-gray-500">
              Les éléments qui défilent horizontalement.
            </p>
          </div>

          <button
            type="button"
            onClick={addMarquee}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d55b0]"
          >
            <Plus size={17} />
            Ajouter
          </button>

        </div>

        <div className="space-y-3">

          {data.marquee.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >

              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateMarquee(
                    index,
                    e.target.value
                  )
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() =>
                  deleteMarquee(index)
                }
                className="rounded-lg border border-red-200 p-3 text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20"
              >
                <Trash2 size={17} />
              </button>

            </div>
          ))}

          {data.marquee.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              Aucun élément dans le marquee.
            </p>
          )}

        </div>
      </div>

      {/* SECTION CONTENT */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contenu de la section
            </h2>

            <p className="text-sm text-gray-500">
              Grand titre et paragraphe.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d55b0] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Enregistrement..."
              : "Enregistrer"}

          </button>

        </div>

        <div className="space-y-5">

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Grand titre
            </label>

            <input
              type="text"
              value={data.title}
              onChange={(e) =>
                setData({
                  ...data,
                  title: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Recent Projects"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paragraphe
            </label>

            <textarea
              rows={5}
              value={data.description}
              onChange={(e) =>
                setData({
                  ...data,
                  description: e.target.value,
                })
              }
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Description de la section..."
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default WorkManagement;