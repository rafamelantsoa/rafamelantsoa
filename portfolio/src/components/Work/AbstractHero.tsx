import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  getAbstractCarousel,
  type CarouselSlide,
} from "./abstractCarouselApi";

/* =========================================================
   ABSTRACT HERO

   Fond : un ruban courbé (zigzag) bleu -> orange en SVG,
   qui ondule tout seul (animation native du navigateur sur
   l'attribut "d", aucun JS par frame pour ça) + une forte
   lueur bleue séparée qui suit le curseur de façon marquée.

   Le mouvement au curseur est un seul calcul de lerp par
   frame, écrit directement sur le DOM via des refs — aucun
   re-render React.

   Toute la logique du carrousel (fetch, autoplay,
   navigation, sécurité d'index) est inchangée.
========================================================= */

const AbstractHero: React.FC = () => {
  /* =======================================================
     PARALLAX — suit la souris

     Un seul calcul de lerp par frame. Le ruban bouge peu
     (discret), la lueur bleue bouge beaucoup (effet de
     projecteur qui suit le curseur).
  ======================================================= */

  const sectionRef = useRef<HTMLElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const blueGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wave = waveRef.current;
    const blueGlow = blueGlowRef.current;

    if (!section || !wave || !blueGlow) {
      return;
    }

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId = 0;

    const step = () => {
      currentX += (targetX - currentX) / 12;
      currentY += (targetY - currentY) / 12;

      wave.style.transform = `translate(${currentX * 0.35}px, ${currentY * 0.35}px)`;

      blueGlow.style.transform = `translate(${currentX * 1.3}px, ${currentY * 1.3}px)`;

      frameId = requestAnimationFrame(step);
    };

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const rect =
        section.getBoundingClientRect();

      const relX =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const relY =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      targetX = relX * 220;
      targetY = relY * 140;
    };

    section.addEventListener(
      "mousemove",
      handleMouseMove
    );

    frameId = requestAnimationFrame(step);

    return () => {
      section.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(frameId);
    };
  }, []);

  /* =======================================================
     CAROUSEL
  ======================================================= */

  const [carouselSlides, setCarouselSlides] =
    useState<CarouselSlide[]>([]);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  /* =======================================================
     CHARGEMENT CAROUSEL
  ======================================================= */

  useEffect(() => {
    const loadCarousel = async () => {
      try {
        const data =
          await getAbstractCarousel();

        if (
          Array.isArray(data?.slides) &&
          data.slides.length > 0
        ) {
          setCarouselSlides(data.slides);
        }
      } catch (error) {
        console.error(
          "Erreur chargement carousel :",
          error
        );
      }
    };

    loadCarousel();
  }, []);

  /* =======================================================
     AUTO PLAY
  ======================================================= */

  useEffect(() => {
    if (carouselSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => {
        return (
          (prev + 1) %
          carouselSlides.length
        );
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [carouselSlides.length]);

  /* =======================================================
     SÉCURITÉ INDEX
  ======================================================= */

  useEffect(() => {
    if (
      carouselSlides.length > 0 &&
      currentSlide >=
        carouselSlides.length
    ) {
      setCurrentSlide(0);
    }
  }, [
    carouselSlides.length,
    currentSlide,
  ]);

  /* =======================================================
     SLIDE ACTUEL
  ======================================================= */

  const slide =
    carouselSlides[
      currentSlide
    ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-screen
        left-1/2
        -translate-x-1/2
        h-[620px]
        sm:h-[680px]
        md:h-[760px]
        lg:h-[820px]
        overflow-hidden
        hero-aurora-bg
      "
    >
      {/* ===================================================
          RUBAN COURBÉ — bleu -> orange, ondule tout seul
      =================================================== */}

      <div
        ref={waveRef}
        className="hero-wave-wrap"
      >
        <svg
          className="hero-wave-svg"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="heroWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3a63ff" />
              <stop offset="48%" stopColor="#4440ff" />
              <stop offset="100%" stopColor="#d600e2" />
            </linearGradient>

            <filter
              id="heroWaveBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="38" />
            </filter>
          </defs>

          <path
            fill="none"
            stroke="url(#heroWaveGradient)"
            strokeWidth="260"
            strokeLinecap="round"
            filter="url(#heroWaveBlur)"
            d="M -150 560 C 120 320, 340 700, 560 420 S 880 60, 1150 180"
          >
            <animate
              attributeName="d"
              dur="16s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
              keyTimes="0; 0.33; 0.66; 1"
              values="
                M -150 560 C 120 320, 340 700, 560 420 S 880 60, 1150 180;
                M -150 480 C 180 680, 320 260, 560 520 S 840 280, 1150 340;
                M -150 600 C 100 260, 380 620, 560 320 S 900 140, 1150 100;
                M -150 560 C 120 320, 340 700, 560 420 S 880 60, 1150 180
              "
            />
          </path>
        </svg>
      </div>

      {/* ===================================================
          LUEUR BLEUE FORTE — suit le curseur
      =================================================== */}

      <div
        ref={blueGlowRef}
        className="hero-blue-glow-wrap"
      >
        <div className="hero-blue-glow" />
      </div>

      {/* ===================================================
          VIGNETTE — assombrit les bords, comme la
          référence (bandes noires autour du visuel)
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.7)_100%)]
        "
      />

      {/* ===================================================
          CARROUSEL TEXTE — ANIMÉ
      =================================================== */}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full px-8 md:px-16 flex justify-center">
          <div
            className="
              w-full
              max-w-3xl
              text-center
              p-8
              backdrop-blur-[3px]
              rounded-xl
              border
              border-white/30
              bg-black/10
            "
          >
            {/* =================================================
                CONTENU DU SLIDE
            ================================================= */}

            {slide && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide._id}
                  initial={{
                    opacity: 0,
                    x: 45,
                    y: 10,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    x: -30,
                    filter: "blur(6px)",
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >
                  {/* TITRE */}

                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.08,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      font-extrabold
                      text-white
                      leading-[1.05]
                      tracking-tight
                      text-3xl
                      md:text-5xl
                    "
                  >
                    {slide.title}
                  </motion.h1>

                  {/* DESCRIPTION */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                      ease: [
                        0.12,
                        1,
                        0.26,
                        1,
                      ],
                    }}
                    className="
                      inline-flex
                      items-center
                      mt-6
                      px-5
                      py-2.5
                      rounded-full
                      bg-white/10
                      border
                      border-white/15
                      text-white/80
                      text-sm
                    "
                  >
                    {slide.description}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* =================================================
                NAVIGATION DU CARROUSEL
            ================================================= */}

            {carouselSlides.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-8
                  pointer-events-auto
                "
              >
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Afficher la slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        currentSlide === index
                          ? "w-8 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }
                    `}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          BOTTOM FADE
      =================================================== */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-32
          pointer-events-none
          bg-gradient-to-t
          from-black/80
          to-transparent
        "
      />

      {/* ===================================================
          STYLES DU FOND

          À terme, tu peux déplacer ce bloc dans ton CSS
          global (index.css) — rien ne change visuellement.
      =================================================== */}

      <style>{`
        .hero-aurora-bg {
          background: #050507;
        }

        .hero-wave-wrap {
          position: absolute;
          inset: -12%;
          will-change: transform;
        }

        .hero-wave-svg {
          width: 100%;
          height: 100%;
        }

        .hero-blue-glow-wrap {
          position: absolute;
          top: 18%;
          left: 8%;
          width: 42%;
          height: 55%;
          will-change: transform;
        }

        .hero-blue-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(70, 130, 255, 0.95) 0%,
            rgba(55, 110, 255, 0.55) 38%,
            rgba(50, 100, 255, 0.30) 72%
          );
          filter: blur(55px);
          mix-blend-mode: screen;
          animation: heroBlueGlowPulse 7s ease-in-out infinite;
        }

        @keyframes heroBlueGlowPulse {
          0%, 100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-blue-glow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default AbstractHero;