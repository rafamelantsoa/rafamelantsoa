import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { Download, ArrowRight } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

import { getHero, type Hero as HeroData } from "./heroApi";

import FloatingBadge from "./FloatingBadge";

const Hero = () => {
  const { theme } = useTheme();

  const navigate = useNavigate();

  // --------------------------------------------------------------------------
  // REF IMAGE HERO
  // --------------------------------------------------------------------------

  const heroImageRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------

  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------------------------------
  // LOAD HERO
  // --------------------------------------------------------------------------

  useEffect(() => {
    const loadHero = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHero();

        setHero(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);



  // --------------------------------------------------------------------------
  // ERROR
  // --------------------------------------------------------------------------

  if (loading) {
    return null;
  }
  
  if (error) {
    return (
      <section
        id="work"
        className="
          min-h-screen
          flex
          items-center
          pt-28
          pb-20
        "
      >
        <div className="max-w-7xl mx-auto w-full px-8">
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
        </div>
      </section>
    );
  }
  
  if (!hero) {
    return null;
  }

  // --------------------------------------------------------------------------
  // IMAGE CURRENT THEME
  // --------------------------------------------------------------------------

  const currentImage =
    theme === "dark"
      ? hero.darkImage?.url
      : hero.lightImage?.url;

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <section
      id="work"
      className="
        min-h-screen
        flex
        items-center
        pt-28
        pb-20
      "
    >
      <div className="max-w-7xl mx-auto w-full px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* =========================================================
              LEFT
          ========================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              order-2
              lg:order-1
              ml-0
              lg:ml-10
            "
          >

            {/* ================= STATUS BADGE ================= */}

            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-primary/20
                bg-primary/10
                px-5
                py-2
              "
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-500
                  animate-pulse
                "
              />

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                Disponible pour de nouveaux projets
              </span>
            </div>

            {/* ================= TITLE ================= */}

            <h1
              className="
                mt-4
                font-title
                text-5xl
                sm:text-6xl
                lg:text-7xl
                font-black
              "
            >
              {hero.title}
            </h1>

            {/* ================= DESCRIPTION ================= */}

            <p
              className="
                mt-4
                max-w-xl
                text-lg
                leading-8
                text-zinc-600
                dark:text-zinc-400
              "
            >
              {hero.description}
            </p>

            {/* ================= BUTTONS ================= */}

            <div
              className="
                flex
                flex-wrap
                gap-5
                mt-10
              "
            >

              {/* ================= PROJECTS ================= */}

              <button
                type="button"
                onClick={() => navigate("/portfolio")}
                className="
                  flex
                  items-center
                  gap-3
                  bg-primary
                  text-white
                  px-7
                  py-4
                  rounded-md
                  hover:scale-105
                  transition
                  cursor-pointer
                "
              >
                Voir mes projets

                <ArrowRight size={18} />
              </button>

              {/* ================= CV ================= */}

              {hero.cvUrl && (
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      "/cv-Rafamelantsoa",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    px-7
                    py-4
                    rounded-md
                    hover:border-primary
                    hover:text-primary
                    transition
                    cursor-pointer
                  "
                >
                  CV (PDF)

                  <Download size={18} />
                </button>
              )}

            </div>
          </motion.div>

          {/* =========================================================
              RIGHT
          ========================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              flex
              justify-center
              order-1
              lg:order-2
            "
          >

            {/* =====================================================
                IMAGE CONTAINER
            ===================================================== */}

            <div
              ref={heroImageRef}
              className="
                relative
                w-full
                max-w-xl
              "
            >

              {/* =================================================
                  FLOATING NAME BADGE
              ================================================= */}

              <FloatingBadge
                containerRef={heroImageRef}
                text="Annicolas Rafamelantsoa"
              />

              {/* =================================================
                  HERO IMAGE
              ================================================= */}

              <AnimatePresence mode="wait">
                {currentImage ? (
                  <motion.img
                    key={theme}
                    src={currentImage}
                    alt="Annicolas Rafamelantsoa"
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="
                      w-full
                      max-w-xl
                    "
                  />
                ) : (
                  /* =================================================
                     EMPTY IMAGE
                  ================================================= */

                  <motion.div
                    key="empty"
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="
                      w-full
                      max-w-xl
                      min-h-[400px]
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-zinc-100
                      dark:bg-zinc-900
                    "
                  >
                    <p
                      className="
                        text-sm
                        text-zinc-400
                      "
                    >
                      Aucune image disponible
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;