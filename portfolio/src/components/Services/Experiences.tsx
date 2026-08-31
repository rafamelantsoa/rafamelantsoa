import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  getExperiences,
  getExperienceSection,
  type Experience as ExperienceData,
} from "./experienceApi";

/* =========================================================
   EXPERIENCE
========================================================= */

const Experience = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [experiences, setExperiences] = useState<
    ExperienceData[]
  >([]);

  const [sectionTitle, setSectionTitle] = useState(
    "Expériences professionnelles"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     SORT EXPERIENCES BY DATE

     Règles :
     - "2026 — Present" est toujours prioritaire
     - "2026 — 2027" commence en 2026
     - "2025 — 2026" commence en 2025
     - "2024 — 2025" commence en 2024

     Donc :
     Present > année de début la plus récente
  ======================================================= */

  const sortExperiencesByDate = (
    experiencesList: ExperienceData[]
  ): ExperienceData[] => {
    return [...experiencesList].sort((a, b) => {
      const dateA = String(a.date || "").trim();
      const dateB = String(b.date || "").trim();

      /* -----------------------------------------------
         PRESENT
         Une expérience avec "Present" est considérée
         comme actuellement active et donc prioritaire.
      ------------------------------------------------ */

      const isPresentA =
        /\b(present|présent|actuel|actuelle|maintenant)\b/i.test(
          dateA
        );

      const isPresentB =
        /\b(present|présent|actuel|actuelle|maintenant)\b/i.test(
          dateB
        );

      if (isPresentA && !isPresentB) {
        return -1;
      }

      if (!isPresentA && isPresentB) {
        return 1;
      }

      /* -----------------------------------------------
         EXTRACTION DE L'ANNÉE DE DÉBUT

         Exemple :
         "2026 — Present" -> 2026
         "2025 — 2026"    -> 2025
         "2024 — 2025"    -> 2024
      ------------------------------------------------ */

      const getStartYear = (
        date: string
      ): number => {
        const match = date.match(
          /\b(19|20)\d{2}\b/
        );

        if (!match) {
          return 0;
        }

        return Number(match[0]);
      };

      const yearA = getStartYear(dateA);
      const yearB = getStartYear(dateB);

      /* -----------------------------------------------
         ANNÉE LA PLUS RÉCENTE EN PREMIER
      ------------------------------------------------ */

      return yearB - yearA;
    });
  };

  /* =======================================================
     LOAD EXPERIENCES
  ======================================================= */

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setLoading(true);
        setError("");

        /* =================================================
           EXPERIENCES
        ================================================= */

        const data = await getExperiences();

        console.log(
          "EXPERIENCES DATA:",
          data
        );

        /* =================================================
           TRI AUTOMATIQUE

           Present en premier,
           puis année de début décroissante.
        ================================================= */

        const safeData = Array.isArray(data)
          ? data
          : [];

        const sortedExperiences =
          sortExperiencesByDate(
            safeData
          );

        console.log(
          "SORTED EXPERIENCES:",
          sortedExperiences
        );

        setExperiences(
          sortedExperiences
        );

        /* =================================================
           SECTION TITLE
           
           Le titre vient du CMS / Admin.
        ================================================= */

        const section =
          await getExperienceSection();

        console.log(
          "EXPERIENCE SECTION:",
          section
        );

        if (
          section &&
          typeof section.title === "string" &&
          section.title.trim()
        ) {
          setSectionTitle(
            section.title
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des expériences :",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        id="services"
        className="py-24 px-16 max-w-7xl mx-auto"
      >
        {/* =================================================
            TITLE SKELETON
        ================================================= */}

        <div className="mb-16">
          <div
            className="
              h-16
              w-[600px]
              max-w-full
              rounded-xl
              bg-zinc-200
              dark:bg-zinc-800
              animate-pulse
            "
          />
        </div>

        {/* =================================================
            EXPERIENCE SKELETON
        ================================================= */}

        <div className="space-y-8">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                  border-l
                  bg-white
                  dark:bg-white/10
                  rounded-xl
                  border-zinc-200
                  dark:border-zinc-800
                  px-12
                  py-10
                  animate-pulse
                "
              >
                {/* COMPANY + ROLE */}

                <div>
                  <div
                    className="
                      h-7
                      w-48
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-5
                      w-40
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />
                </div>

                {/* MISSIONS */}

                <div className="space-y-3">
                  <div
                    className="
                      h-4
                      w-full
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                  <div
                    className="
                      h-4
                      w-11/12
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                  <div
                    className="
                      h-4
                      w-10/12
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                  <div
                    className="
                      h-4
                      w-9/12
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />
                </div>

                {/* DATE */}

                <div className="md:flex md:justify-end">
                  <div
                    className="
                      h-5
                      w-28
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section
        id="services"
        className="py-24 px-16 max-w-7xl mx-auto"
      >
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            dark:border-red-900
            dark:bg-red-950/20
            p-6
            text-sm
            text-red-600
            dark:text-red-400
          "
        >
          {error}
        </div>
      </section>
    );
  }

  /* =======================================================
     NO DATA
  ======================================================= */

  if (!experiences.length) {
    return (
      <section
        id="services"
        className="py-24 px-16 max-w-7xl mx-auto"
      >
        <div className="mb-16">
          <h2
            className="
              text-4xl
              md:text-6xl
              font-semibold
              font-title
            "
          >
            {sectionTitle}
          </h2>
        </div>

        <div
          className="
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-white/10
            px-8
            py-10
            text-sm
            text-zinc-500
            dark:text-zinc-400
          "
        >
          Aucune expérience professionnelle disponible.
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="services"
      className="md:py-24 py-12 px-2 md:px-12 lg:px-16 max-w-7xl mx-auto "
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <div className="mb-8 ml-8 md:ml-0">
        <h2
          className="
            text-4xl
            md:text-6xl
            font-semibold
            font-title
          "
        >
          {sectionTitle}
        </h2>
      </div>

      {/* =================================================
          LIST

          L'ordre est déjà trié au chargement :
          1. Present
          2. Année la plus récente
          3. Année suivante
          etc.
      ================================================= */}

      <div className="md:space-y-8 space-y-2">
        {experiences.map(
          (exp, index) => (
            <motion.div
              key={
                exp._id ||
                `${exp.company}-${exp.role}-${index}`
              }
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
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                border-l
                bg-white
                dark:bg-white/10
                rounded-xl
                border-zinc-200
                dark:border-zinc-800
                md:px-12 px-8
                py-10
              "
            >
              {/* =========================================
                  LEFT: COMPANY + ROLE
              ========================================= */}

              <div>
                <h3
                  className="
                    text-xl
                    font-semibold
                    text-zinc-900
                    dark:text-white
                  "
                >
                  {exp.company}
                </h3>

                <p
                  className="
                    text-sm
                    text-zinc-500
                    dark:text-zinc-400
                    mt-1
                  "
                >
                  {exp.role}
                </p>
              </div>

              {/* =========================================
                  MIDDLE: MISSIONS
              ========================================= */}

              <div className="md:col-span-1">
                <ul
                  className="
                    space-y-2
                    text-sm
                    text-zinc-600
                    dark:text-zinc-400
                    leading-relaxed
                  "
                >
                  {(
                    Array.isArray(exp.missions)
                      ? exp.missions
                      : []
                  ).map(
                    (
                      mission,
                      missionIndex
                    ) => (
                      <li
                        key={`${exp._id || index}-mission-${missionIndex}`}
                        className="flex gap-2"
                      >
                        <span className="text-zinc-400">
                          —
                        </span>

                        {mission}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* =========================================
                  RIGHT: DATE
              ========================================= */}

              <div
                className="
                  md:text-right
                  flex
                  md:justify-end
                  items-start
                "
              >
                <span
                  className="
                    text-sm
                    text-zinc-500
                    dark:text-zinc-400
                    font-medium
                  "
                >
                  {exp.date}
                </span>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
};

export default Experience;