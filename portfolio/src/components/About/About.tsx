import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";



import {
  getAbout,
  type About as AboutData,
} from "./aboutApi";

import Expertise from "./Expertise";



/* =========================================================
   ABOUT
========================================================= */

const About = () => {

  /* =======================================================
     STATE
  ======================================================= */

  const [about, setAbout] =
    useState<AboutData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =======================================================
     LOAD ABOUT
  ======================================================= */

  useEffect(() => {

    const loadAbout = async () => {

      try {

        setLoading(true);

        setError("");

        const data =
          await getAbout();

        console.log(
          "ABOUT DATA:",
          data
        );

        setAbout(data);

      } catch (error) {

        console.error(
          "Erreur lors du chargement de About :",
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

    loadAbout();

  }, []);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <section
        id="about"
        className="py-10"
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-16
          "
        >

          {/* ================= TITLE SKELETON ================= */}

          <div className="mb-16">

            <div
              className="
                h-16
                w-96
                max-w-full
                rounded-xl
                bg-zinc-200
                dark:bg-zinc-800
                animate-pulse
              "
            />

          </div>


          {/* ================= CARDS SKELETON ================= */}

          <div
            className="
              grid
              md:grid-cols-2
              lg:grid-cols-2
              gap-8
            "
          >

            {[1, 2, 3, 4].map(
              (item) => (

                <div
                  key={item}
                  className="
                    bg-white
                    dark:bg-white/10
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-3xl
                    p-8
                    animate-pulse
                  "
                >

                  <div
                    className="
                      mb-6
                      w-10
                      h-10
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                  <div
                    className="
                      h-8
                      w-48
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                      mb-4
                    "
                  />

                  <div
                    className="
                      h-5
                      w-full
                      rounded
                      bg-zinc-200
                      dark:bg-zinc-800
                    "
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !about) {

    return (

      <section
        id="about"
        className="py-10"
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-16
          "
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

            {error ||
              "Impossible de charger les informations de la section About."}

          </div>

        </div>

      </section>

    );

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      id="about"
      className="py-10"
    >

      <div
        className="
          w-full
          mx-auto
        "
      >


        {/* =================================================
            EXPERTISE
        ================================================= */}

        <Expertise
          title={about.title}
          expertise={about.expertise}
        />


      <section className="max-w-7xl px-16 mx-auto">
        
      {/* =================================================
            TOOLS TITLE
      ================================================= */}

       <div
          className="
            mt-24
            mb-10
          "
        >

          <h2
            className="
              text-4xl
              md:text-6xl
              font-semibold
              font-title
            "
          >

            {about.toolsTitle}

          </h2>

        </div>


        {/* =================================================
            TOOLS GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-4
            gap-6
          "
        >

          {about.tools.map(
            (tool, index) => (

              <motion.div
                key={
                  tool._id ||
                  `${tool.name}-${index}`
                }

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}

                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-white
                  dark:bg-white/90
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-3xl
                  p-6
                  hover:border-zinc-400
                  dark:hover:border-zinc-600
                  transition
                  group
                "
              >


                {/* =========================================
                    TOOL LOGO
                ========================================= */}

                <img
                  src={tool.logo.url}
                  alt={tool.name}
                  className="
                    w-12
                    h-12
                    object-contain
                    group-hover:scale-110
                    transition
                  "
                />


                {/* =========================================
                    TOOL NAME
                ========================================= */}

                <p
                  className="
                    mt-4
                    text-sm
                    text-zinc-600
                    dark:text-zinc-400
                  "
                >

                  {tool.name}

                </p>

              </motion.div>

            )
          )}

        </div>

      </section>

      </div>

    </section>

  );

};

export default About;