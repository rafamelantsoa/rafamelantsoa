import { useEffect, useState } from "react";
import axios from "axios";
import { motion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

type Project = {
  _id: string;
  title: string;
  category: string;
  image: {
    url: string;
    publicId?: string | null;
  };
  order: number;
};

type RealisationsData = {
  _id: string;
  title: string;
  description: string;
  projects: Project[];
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Voirplus = () => {
  const [data, setData] =
    useState<RealisationsData | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isDragging, setIsDragging] =
    useState(false);

  /* =========================================================
     GET DATA
  ========================================================= */

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (error) {
        console.error(
          "Erreur récupération des réalisations :",
          error
        );
      }
    };

    fetchRealisations();
  }, []);

  /* =========================================================
     WAIT DATA
  ========================================================= */

  if (!data || data.projects.length === 0) {
    return null;
  }

  const projects = data.projects;
  const total = projects.length;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + total) % total
    );
  };

  const goNext = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % total
    );
  };

  /* =========================================================
     POSITION DES CARTES
  ========================================================= */

  const getOffset = (index: number) => {
    let offset = index - currentIndex;

    if (offset > total / 2) {
      offset -= total;
    }

    if (offset < -total / 2) {
      offset += total;
    }

    return offset;
  };

  /* =========================================================
     DRAG
  ========================================================= */

  const VISIBLE_RANGE = 2;

  const DRAG_DISTANCE_THRESHOLD = 80;
  const DRAG_VELOCITY_THRESHOLD = 400;

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    const { offset, velocity } = info;

    if (
      offset.x < -DRAG_DISTANCE_THRESHOLD ||
      velocity.x < -DRAG_VELOCITY_THRESHOLD
    ) {
      goNext();
    } else if (
      offset.x > DRAG_DISTANCE_THRESHOLD ||
      velocity.x > DRAG_VELOCITY_THRESHOLD
    ) {
      goPrev();
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">



        {/* =====================================================
            TITLE
        ===================================================== */}
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
          className="mb-14 text-center"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Voir plus
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Autres projets
          </h2>
        </motion.div>

        {/* =====================================================
            CARROUSEL
        ===================================================== */}

        <motion.div
          className="
            relative
            h-[430px]
            sm:h-[450px]
            flex
            items-center
            justify-center
            select-none
          "
          style={{
            cursor: isDragging
              ? "grabbing"
              : "grab",
          }}
          drag="x"
          dragConstraints={{
            left: 0,
            right: 0,
          }}
          dragElastic={0.12}
          onDragStart={() =>
            setIsDragging(true)
          }
          onDragEnd={handleDragEnd}
        >

          {projects.map((project, index) => {
            const offset = getOffset(index);

            if (
              Math.abs(offset) >
              VISIBLE_RANGE
            ) {
              return null;
            }

            const isCenter = offset === 0;

            /* ---------------------------------------------
               PROFONDEUR
            --------------------------------------------- */

            const distance =
              Math.abs(offset);

            const scale = isCenter
              ? 1
              : distance === 1
              ? 0.88
              : 0.76;

            const opacity = isCenter
              ? 1
              : distance === 1
              ? 0.65
              : 0.35;

            const translateX =
              offset * 250;

            const zIndex =
              20 - distance;

            return (
              <motion.div
                key={project._id}
                className="
                  absolute
                  w-[270px]
                  sm:w-[300px]
                  md:w-[320px]
                  h-[350px]
                  sm:h-[380px]
                  md:h-[400px]
                "
                animate={{
                  x: translateX,
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{
                  duration: 0.55,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                style={{
                  pointerEvents:
                    isCenter &&
                    !isDragging
                      ? "auto"
                      : "none",
                }}
              >

                <Link
                  to={`/realisations/${project._id}`}
                  className="group block h-full"
                  draggable={false}
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                >

                  {/* =================================================
                      CARD
                  ================================================= */}

                  <div
                    className={`
                      relative
                      w-full
                      h-full
                      overflow-hidden
                      rounded-2xl
                      bg-zinc-900
                      border
                      border-white/10
                      transition-all
                      duration-500

                      ${
                        isCenter
                          ? `
                            shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]
                            dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]
                          `
                          : `
                            shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)]
                            dark:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.55)]
                          `
                      }
                    `}
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <img
                      src={project.image.url}
                      alt={project.title}
                      draggable={false}
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        pointer-events-none
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-105
                      "
                    />

                    {/* =================================================
                        OVERLAY
                    ================================================= */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/75
                        via-black/15
                        to-transparent
                        pointer-events-none
                      "
                    />

                    {/* =================================================
                        TOP BORDER / LIGHT
                    ================================================= */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-px
                        bg-white/20
                      "
                    />

                    {/* =================================================
                        CENTER ICON
                    ================================================= */}

                    {isCenter && (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          pointer-events-none
                        "
                      >
                        <div
                          className="
                            w-14
                            h-14
                            rounded-full
                            bg-white
                            text-zinc-900
                            flex
                            items-center
                            justify-center
                            opacity-0
                            scale-75
                            group-hover:opacity-100
                            group-hover:scale-100
                            transition-all
                            duration-500
                            shadow-xl
                          "
                        >
                          <ArrowUpRight
                            size={21}
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        TEXT
                    ================================================= */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                      "
                    >
                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.18em]
                          text-blue-300
                        "
                      >
                        {project.category}
                      </p>

                      <div
                        className="
                          mt-2
                          flex
                          items-end
                          justify-between
                          gap-4
                        "
                      >
                        <h3
                          className="
                            text-xl
                            font-medium
                            leading-tight
                            text-white
                          "
                        >
                          {project.title}
                        </h3>

                        {isCenter && (
                          <ArrowUpRight
                            size={21}
                            strokeWidth={1.6}
                            className="
                              shrink-0
                              text-white/70
                              transition-all
                              duration-300
                              group-hover:text-white
                              group-hover:rotate-12
                            "
                          />
                        )}
                      </div>
                    </div>

                  </div>

                </Link>

              </motion.div>
            );
          })}
        </motion.div>

        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div className="flex items-center justify-center gap-3 mt-7">

          <button
            type="button"
            onClick={goPrev}
            aria-label="Projet précédent"
            className="
              w-11
              h-11
              rounded-full
              border
              border-zinc-300
              dark:border-zinc-700
              flex
              items-center
              justify-center
              text-zinc-600
              dark:text-zinc-300
              bg-white/50
              dark:bg-zinc-900/40
              hover:bg-[#2464cc]
              hover:text-white
              hover:border-[#2464cc]
              transition-all
              duration-300
              hover:-translate-x-0.5
            "
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.7}
            />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Projet suivant"
            className="
              w-11
              h-11
              rounded-full
              border
              border-zinc-300
              dark:border-zinc-700
              flex
              items-center
              justify-center
              text-zinc-600
              dark:text-zinc-300
              bg-white/50
              dark:bg-zinc-900/40
              hover:bg-[#2464cc]
              hover:text-white
              hover:border-[#2464cc]
              transition-all
              duration-300
              hover:translate-x-0.5
            "
          >
            <ArrowRight
              size={18}
              strokeWidth={1.7}
            />
          </button>

        </div>

      </div>
    </section>
  );
};

export default Voirplus;