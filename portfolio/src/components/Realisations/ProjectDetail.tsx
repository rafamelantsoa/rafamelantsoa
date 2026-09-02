import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Voirplus from "./VoirPlus";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import Navbar2 from "../Navbar/Navbar2";
import Footer from "../Footer/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PageLoader from "../PageLoader";

/* ==========================================================================
   TYPES
========================================================================== */

type ImageData = {
  _id?: string;
  url: string;
  publicId?: string | null;
};

type Project = {
  _id: string;

  title: string;

  category: string;

  description?: string;

  client?: string;

  year?: string;

  projectUrl?: string;

  services?: string[];

  image: ImageData;

  gallery?: ImageData[];

  order: number;
};

/* ==========================================================================
   API
========================================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* ==========================================================================
   COMPONENT
========================================================================== */

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] =
    useState<Project | null>(null);

    const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState(false);

    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  /* ==========================================================================
     GET PROJECT
  ========================================================================== */

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `${API_URL}/realisations`
        );
        const projects: Project[] =
          response.data?.projects || [];

        const foundProject =
          projects.find(
            (item) => item._id === id
          );

        if (!foundProject) {
          setError(true);
          setProject(null);
          return;
        }

        setProject(foundProject);
      } catch (error) {
        console.error(
          "Erreur récupération projet :",
          error
        );

        setError(true);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  /* ==========================================================================
     LOADING
  ========================================================================== */

if (loading) {
  return <PageLoader />;
}

if (error || !project) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-zinc-200 dark:bg-zinc-800">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Projet introuvable
        </h1>

        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          Ce projet n'est plus disponible.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#2464cc] px-6 py-3 text-sm font-medium text-white hover:bg-[#1d55b0] transition"
        >
          <ArrowLeft size={17} />
          Retour au portfolio
        </Link>
      </div>
    </section>
  );
}
  /* ==========================================================================
     ERROR
  ========================================================================== */

  if (error || !project) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 bg-zinc-200 dark:bg-zinc-800">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Projet introuvable
          </h1>

          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Ce projet n'est plus disponible.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#2464cc] px-6 py-3 text-sm font-medium text-white hover:bg-[#1d55b0] transition"
          >
            <ArrowLeft size={17} />

            Retour au portfolio
          </Link>
        </div>
      </section>
    );
  }

  /* ==========================================================================
     GALLERY
  ========================================================================== */

  const gallery = project.gallery || [];

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <main className="min-h-screen bg-zinc-200 dark:bg-zinc-800">

      <Navbar2 />

      <section className="max-w-7xl mx-auto w-full px-4 md:px-8">

        {/* ================================================================
            HERO
        ================================================================= */}

        <section className="pt-14 md:pt-32 md:pb-20 pb-6 px-0 sm:px-8 md:px-12 lg:px-16">

        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
  
          {/* BACK */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="shrink-0"
          >
            <Link
              to="/portfolio"
              aria-label="Retour aux réalisations"
              className="group inline-flex flex-row items-center gap-3 whitespace-nowrap text-sm text-zinc-500 transition hover:text-[#2464cc]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2464cc] text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-[#1d55b0]">
                <ArrowLeft
                  size={18}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </span>

              <span>Retour aux réalisations</span>
            </Link>
          </motion.div>

          {/* TITLE */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="max-w-5xl lg:text-right"
          >
            <h1 className="md:mt-5 mt-0 text-4xl font-black leading-[0.95] tracking-tight text-zinc-900 dark:text-white md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
          </motion.div>

        </div>

        </section>

        {/* ================================================================
            IMAGE PRINCIPALE
        ================================================================= */}

        <section className="px-0 sm:px-8 md:px-12 lg:px-16">

          <div className="max-w-7xl mx-auto ">

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <img
                src={project.image.url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

          </div>

        </section>

        {/* ================================================================
            INFORMATIONS
        ================================================================= */}

        <section className="md:py-24 py-12 px-5 sm:px-8 md:px-12 lg:px-16">

          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-2 md:grid-cols-5 gap-1">

              {/* CATEGORY */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Catégorie
                </p>

                <p className="mt-3 text-lg text-primary dark:text-blue-200 font-bold">
                  {project.category}
                </p>
              </motion.div>

              {/* CLIENT */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Client
                </p>

                <p className="mt-3 text-lg text-primary dark:text-blue-200 font-bold">
                  {project.client ||
                    "—"}
                </p>
              </motion.div>

              {/* YEAR */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Année
                </p>

                <p className="mt-3 text-lg text-primary dark:text-blue-200 font-bold ">
                  {project.year ||
                    "—"}
                </p>
              </motion.div>

                {/* SERVICES */}

                <div >
                {project.services &&
                  project.services.length >
                    0 && (
                    <motion.div
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
                      transition={{
                        duration: 0.6,
                        delay: 0.1,
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Services
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">

                        {project.services.map(
                          (
                            service,
                            index
                          ) => (
                            <span
                              key={`${service}-${index}`}
                              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white"
                            >
                              {service}
                            </span>
                          )
                        )}

                      </div>

                    </motion.div>
                  )}
              </div>

              {/* PROJECT LINK */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Projet
                </p>

                {project.projectUrl ? (
                  <a
                  href={
                    project.projectUrl.startsWith("http://") ||
                    project.projectUrl.startsWith("https://")
                      ? project.projectUrl
                      : `https://${project.projectUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-lg text-[#2464cc] hover:underline"
                >
                    Voir le projet

                    <ExternalLink
                      size={17}
                    />
                  </a>
                ) : (
                  <p className="mt-3 text-lg text-zinc-900 dark:text-white">
                    —
                  </p>
                )}
              </motion.div>

            </div>

          </div>

        </section>

        {/* ================================================================
            DESCRIPTION + SERVICES
        ================================================================= */}

        {(project.description ||
          project.services?.length) && (

          <section className="md:pb-24 pb-8 px-5 sm:px-8 md:px-12 lg:px-16">

            <div className="max-w-7xl mx-auto">

              <div>

                {/* DESCRIPTION */}

                {project.description && (
                  <motion.div
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
                    transition={{
                      duration: 0.6,
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      À propos du projet
                    </p>

                    <p className="mt-6 text-sm md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-light whitespace-pre-line">
                      {project.description}
                    </p>
                  </motion.div>
                )}



              </div>

            </div>

          </section>
        )}

        {/* ================================================================
            GALERIE — SIMPLE CAROUSEL + MINIATURES
        ================================================================ */}

        <section>
        {gallery.length > 0 && (
          <section className="relative -mx-5 sm:-mx-8 md:-mx-12 lg:-mx-8 py-2 md:py-8">
            <div className="px-5 sm:px-8 md:px-12 lg:px-16">

              {/* IMAGE PRINCIPALE */}
              <div className="relative h-[55vw] min-h-[280px] max-h-[620px] overflow-hidden">

                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={activeGalleryIndex}
                    initial={{
                      x: 80,
                    }}
                    animate={{
                      x: 0,
                    }}
                    exit={{
                      x: -80,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={gallery[activeGalleryIndex].url}
                      alt={`${project.title} - ${activeGalleryIndex + 1}`}
                      draggable={false}
                      className="
                        w-full
                        h-full
                        object-cover
                        rounded-xl
                      "
                    />
                  </motion.div>
                </AnimatePresence>

{/* FLÈCHE GAUCHE */}
{gallery.length > 1 && (
  <button
    type="button"
    aria-label="Image précédente"
    onClick={() =>
      setActiveGalleryIndex((prev) =>
        prev === 0 ? gallery.length - 1 : prev - 1
      )
    }
    className="
      absolute
      left-3
      md:left-6
      top-1/2
      -translate-y-1/2
      z-20
      w-10
      h-10
      rounded-full
      flex
      items-center
      justify-center
      bg-white/20
      dark:bg-zinc-900/20
      text-zinc-900
      dark:text-white
      border
      border-zinc-200/30
      dark:border-zinc-700/30
      backdrop-blur-sm
      transition-transform
      duration-200
      hover:scale-105
    "
  >
    <ChevronLeft
      size={50}
      strokeWidth={3}
    />
  </button>
)}

{/* FLÈCHE DROITE */}
{gallery.length > 1 && (
  <button
    type="button"
    aria-label="Image suivante"
    onClick={() =>
      setActiveGalleryIndex((prev) =>
        prev === gallery.length - 1 ? 0 : prev + 1
      )
    }
    className="
      absolute
      right-3
      md:right-6
      top-1/2
      -translate-y-1/2
      z-20
      w-10
      h-10
      rounded-full
      flex
      items-center
      justify-center
      bg-white/20
      dark:bg-zinc-900/20
      text-zinc-900
      dark:text-white
      border
      border-zinc-200/30
      dark:border-zinc-700/30
      backdrop-blur-sm
      transition-transform
      duration-200
      hover:scale-105
    "
  >
    <ChevronRight
      size={50}
      strokeWidth={3}
    />
  </button>
)}

              </div>

                  {/* MINIATURES */}
                  {gallery.length > 1 && (
                    <div className="mt-4 flex justify-center">

                      <div className="flex items-center justify-center gap-2.5 max-w-full overflow-x-auto scrollbar-none px-2 pb-1">

                        {gallery.map((image, index) => (
                          <button
                            key={image._id || `${image.url}-${index}`}
                            type="button"
                            onClick={() => setActiveGalleryIndex(index)}
                            aria-label={`Voir l'image ${index + 1}`}
                            className={`
                              relative
                              flex-none
                              w-16
                              h-12
                              sm:w-20
                              sm:h-14
                              md:w-24
                              md:h-16
                              overflow-hidden
                              rounded-lg
                              transition-all
                              duration-300
                              ${
                                activeGalleryIndex === index
                                  ? "opacity-100 ring-2 ring-blue-500 dark:ring-white"
                                  : "opacity-45 hover:opacity-80"
                              }
                            `}
                          >
                            <img
                              src={image.url}
                              alt=""
                              draggable={false}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}

                      </div>
                    </div>
                  )}
            </div>
          </section>
        )}
        </section>

        {/* ================================================================
            CTA
        ================================================================= */}

      <section className="pb-4 md:pb-12 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12 flex items-center justify-center">
            
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-4 rounded-full bg-[#2464cc] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1d55b0] hover:px-8"
            >
              <span>
                Démarrer un projet
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.8}
                />
              </span>
            </Link>

          </div>
        </div>
      </section>


      </section>

      <Voirplus />

      <Footer />

    </main>
  );
};

export default ProjectDetail;