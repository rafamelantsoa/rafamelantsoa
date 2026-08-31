import { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderKanban,
  BarChart3,
  List,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  BriefcaseBusiness,
  CheckCircle2,
} from "lucide-react";

type Project = {
  _id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  year: string;
  services: string[];
  projectUrl: string;
  image: {
    url: string;
    publicId?: string | null;
  };
  gallery: {
    _id?: string;
    url: string;
    publicId?: string | null;
  }[];
  order: number;
};

type RealisationsData = {
  _id: string;
  title: string;
  description: string;
  projects: Project[];
};

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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const REALISATIONS_API =
  `${API_URL}/api/realisations`;

const WORK_API =
  `${API_URL}/api/work`;

  
const Dashboard = () => {
  const [realisations, setRealisations] =
    useState<RealisationsData | null>(null);

  const [work, setWork] =
    useState<WorkData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchDashboard = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        realisationsResponse,
        workResponse,
      ] = await Promise.all([
        axios.get(REALISATIONS_API),
        axios.get(WORK_API),
      ]);

      setRealisations(
        realisationsResponse.data
      );

      setWork(workResponse.data);
    } catch (error) {
      console.error(
        "Erreur récupération Dashboard:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={38}
            className="animate-spin text-[#2464cc]"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!realisations || !work) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Impossible de charger les données
            du dashboard.
          </p>

          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d55b0]"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const projects = [
    ...realisations.projects,
  ].sort(
    (a, b) => a.order - b.order
  );

  const projectCount =
    projects.length;

  const marqueeCount =
    work.marquee.length;

  const statsCount =
    work.stats.length;

  const galleryCount = projects.reduce(
    (total, project) =>
      total + (project.gallery?.length || 0),
    0
  );

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#2464cc]">
            Portfolio
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Bienvenue dans votre espace
            d'administration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Actualiser
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* PROJECTS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Projets
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {projectCount}
              </p>
            </div>

            <div className="rounded-lg bg-[#2464cc]/10 p-3 text-[#2464cc]">
              <FolderKanban size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Projets publiés dans les
            réalisations
          </p>
        </div>

        {/* WORK STATS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Statistiques Work
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {statsCount}
              </p>
            </div>

            <div className="rounded-lg bg-[#2464cc]/10 p-3 text-[#2464cc]">
              <BarChart3 size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Statistiques configurées
          </p>
        </div>

        {/* MARQUEE */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Marquee
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {marqueeCount}
              </p>
            </div>

            <div className="rounded-lg bg-[#2464cc]/10 p-3 text-[#2464cc]">
              <List size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Éléments affichés dans le défilement
          </p>
        </div>

        {/* GALLERY */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Galerie
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {galleryCount}
              </p>
            </div>

            <div className="rounded-lg bg-[#2464cc]/10 p-3 text-[#2464cc]">
              <BriefcaseBusiness size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Images supplémentaires des projets
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* RECENT PROJECTS */}
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projets
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Vos réalisations actuelles.
              </p>
            </div>

            <a
              href="/realisations"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2464cc] transition hover:text-[#1d55b0]"
            >
              Gérer
              <ArrowUpRight size={15} />
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
              <FolderKanban
                size={30}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 text-sm text-gray-500">
                Aucun projet pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects
                .slice(0, 5)
                .map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                  >
                    {/* IMAGE */}
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="h-16 w-24 shrink-0 rounded-lg object-cover"
                    />

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#2464cc]">
                        {project.category}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {project.year || "—"}
                        {" · "}
                        {project.gallery?.length || 0}{" "}
                        image
                        {(project.gallery?.length ||
                          0) > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <CheckCircle2
                      size={18}
                      className="hidden shrink-0 text-green-500 sm:block"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* WORK SUMMARY */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Work
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Résumé de la section.
              </p>
            </div>

            <a
              href="/Experiences"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2464cc] transition hover:text-[#1d55b0]"
            >
              Gérer
              <ArrowUpRight size={15} />
            </a>
          </div>

          {/* TITLE */}
          <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Grand titre
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {work.title}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {work.description}
            </p>
          </div>

          {/* STATS */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {work.stats.map(
              (stat, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                >
                  <p className="text-xl font-semibold text-[#2464cc]">
                    {stat.number}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Marquee
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Éléments actuellement configurés.
            </p>
          </div>

          <a
            href="/stats"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2464cc] transition hover:text-[#1d55b0]"
          >
            Modifier
            <ArrowUpRight size={15} />
          </a>
        </div>

        {work.marquee.length === 0 ? (
          <p className="rounded-lg bg-gray-50 px-4 py-5 text-center text-sm text-gray-500 dark:bg-gray-800/50">
            Aucun élément dans le marquee.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {work.marquee.map(
              (item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {item}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;