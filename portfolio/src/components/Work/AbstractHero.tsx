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
   TYPES
========================================================= */

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  phase: number;
  depth: number;
}

interface Mist {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speed: number;
  phase: number;
}

/* =========================================================
   ABSTRACT HERO
========================================================= */

const AbstractHero: React.FC = () => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

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
     CANVAS ABSTRACT
  ======================================================= */

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d", {
        alpha: false,
      });

    if (!ctx) {
      return;
    }

    let width =
      window.innerWidth;

    let height =
      window.innerHeight;

    let dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    let animationFrame = 0;

    let time = 0;

    /* =====================================================
       CURSEUR
    ===================================================== */

    let mouseX = 0.5;
    let mouseY = 0.5;

    let smoothMouseX = 0.5;
    let smoothMouseY = 0.5;

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      mouseX =
        event.clientX /
        window.innerWidth;

      mouseY =
        event.clientY /
        window.innerHeight;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    /* =====================================================
       RESIZE
    ===================================================== */

    const resize = () => {
      width =
        window.innerWidth;

      height =
        window.innerHeight;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        width * dpr;

      canvas.height =
        height * dpr;

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    /* =====================================================
       PARTICULES
    ===================================================== */

    const particles: Particle[] =
      [];

    const particleCount =
      width < 768
        ? 160
        : 420;

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      particles.push({
        x: Math.random(),

        y:
          Math.random() *
          0.82,

        size:
          Math.random() *
            1.5 +
          0.25,

        opacity:
          Math.random() *
            0.42 +
          0.04,

        speed:
          Math.random() *
            0.00025 +
          0.000025,

        drift:
          Math.random() *
            0.0003 -
          0.00015,

        phase:
          Math.random() *
          Math.PI *
          2,

        depth:
          Math.random(),
      });
    }

    /* =====================================================
       BRUMES
    ===================================================== */

    const mists: Mist[] = [];

    const mistCount =
      width < 768
        ? 15
        : 32;

    for (
      let i = 0;
      i < mistCount;
      i++
    ) {
      mists.push({
        x:
          Math.random() *
          width,

        y:
          height *
          (0.34 +
            Math.random() *
              0.42),

        width:
          width *
          (0.16 +
            Math.random() *
              0.4),

        height:
          height *
          (0.025 +
            Math.random() *
              0.08),

        opacity:
          0.025 +
          Math.random() *
            0.085,

        speed:
          0.08 +
          Math.random() *
            0.22,

        phase:
          Math.random() *
          Math.PI *
          2,
      });
    }

    /* =====================================================
       RELIEF
    ===================================================== */

    const createLayer = (
      baseY: number,
      amplitude: number,
      frequency: number,
      phase: number,
      speed: number,
      mouseStrength: number
    ) => {
      const points: {
        x: number;
        y: number;
      }[] = [];

      const parallaxX =
        (smoothMouseX - 0.5) *
        mouseStrength;

      const parallaxY =
        (smoothMouseY - 0.5) *
        mouseStrength *
        0.65;

      for (
        let x = -160;
        x <= width + 160;
        x += 7
      ) {
        const nx =
          (x - parallaxX) /
          width;

        const wave1 =
          Math.sin(
            nx * frequency +
              time * speed +
              phase
          );

        const wave2 =
          Math.sin(
            nx *
              frequency *
              1.8 -
              time *
                speed *
                0.55 +
              phase *
                1.5
          );

        const wave3 =
          Math.sin(
            nx *
              frequency *
              3.4 +
              time *
                speed *
                0.3
          );

        const wave4 =
          Math.sin(
            nx *
              frequency *
              6.2 -
              time *
                speed *
                0.2
          );

        const y =
          baseY +
          parallaxY +
          wave1 *
            amplitude +
          wave2 *
            amplitude *
            0.32 +
          wave3 *
            amplitude *
            0.12 +
          wave4 *
            amplitude *
            0.04;

        points.push({
          x,
          y,
        });
      }

      return points;
    };

    /* =====================================================
       DESSIN RELIEF
    ===================================================== */

    const drawLayer = (
      points: {
        x: number;
        y: number;
      }[],
      color: string
    ) => {
      if (!points.length) {
        return;
      }

      ctx.beginPath();

      ctx.moveTo(
        points[0].x,
        height
      );

      for (
        const point of points
      ) {
        ctx.lineTo(
          point.x,
          point.y
        );
      }

      ctx.lineTo(
        points[
          points.length - 1
        ].x,
        height
      );

      ctx.closePath();

      ctx.fillStyle = color;

      ctx.fill();
    };

    /* =====================================================
       LUMIÈRES
    ===================================================== */

    const drawLights = () => {
      ctx.save();

      ctx.globalCompositeOperation =
        "screen";

      /* -----------------------------------------------
         HALO CENTRAL — SUIT LA SOURIS
      ------------------------------------------------ */

      const glowX =
        width *
        (0.5 +
          (smoothMouseX - 0.5) *
            0.32);

      const glowY =
        height *
        (0.48 +
          (smoothMouseY - 0.5) *
            0.18);

      const mainGlow =
        ctx.createRadialGradient(
          glowX,
          glowY,
          0,
          width * 0.5,
          height * 0.5,
          width * 0.68
        );

      mainGlow.addColorStop(
        0,
        "rgba(130,240,255,0.42)"
      );

      mainGlow.addColorStop(
        0.16,
        "rgba(65,215,250,0.29)"
      );

      mainGlow.addColorStop(
        0.34,
        "rgba(30,175,230,0.18)"
      );

      mainGlow.addColorStop(
        0.58,
        "rgba(10,110,175,0.08)"
      );

      mainGlow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        mainGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /* -----------------------------------------------
         LUMIÈRE GAUCHE
      ------------------------------------------------ */

      const leftGlow =
        ctx.createRadialGradient(
          width * 0.05,
          height * 0.48,
          0,
          width * 0.05,
          height * 0.48,
          width * 0.4
        );

      leftGlow.addColorStop(
        0,
        "rgba(65,215,255,0.22)"
      );

      leftGlow.addColorStop(
        0.4,
        "rgba(25,150,215,0.11)"
      );

      leftGlow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        leftGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /* -----------------------------------------------
         LUMIÈRE DROITE
      ------------------------------------------------ */

      const rightGlow =
        ctx.createRadialGradient(
          width * 0.95,
          height * 0.45,
          0,
          width * 0.95,
          height * 0.45,
          width * 0.4
        );

      rightGlow.addColorStop(
        0,
        "rgba(80,220,255,0.24)"
      );

      rightGlow.addColorStop(
        0.4,
        "rgba(25,145,215,0.10)"
      );

      rightGlow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        rightGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /* -----------------------------------------------
         HORIZON
      ------------------------------------------------ */

      const horizon =
        ctx.createRadialGradient(
          width * 0.5,
          height * 0.60,
          0,
          width * 0.5,
          height * 0.60,
          width * 0.65
        );

      horizon.addColorStop(
        0,
        "rgba(145,248,255,0.43)"
      );

      horizon.addColorStop(
        0.14,
        "rgba(75,220,250,0.31)"
      );

      horizon.addColorStop(
        0.32,
        "rgba(30,175,230,0.18)"
      );

      horizon.addColorStop(
        0.55,
        "rgba(10,105,170,0.07)"
      );

      horizon.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        horizon;

      ctx.fillRect(
        0,
        height * 0.42,
        width,
        height * 0.4
      );

      ctx.restore();
    };

    /* =====================================================
       RAYONS
    ===================================================== */

    const drawRays = () => {
      ctx.save();

      ctx.globalCompositeOperation =
        "screen";

      for (
        let i = 0;
        i < 11;
        i++
      ) {
        const baseX =
          width *
          (0.04 +
            i * 0.095);

        const cursorShift =
          (smoothMouseX - 0.5) *
          100;

        const drift =
          Math.sin(
            time * 0.2 + i
          ) *
            45 +
          cursorShift;

        const gradient =
          ctx.createLinearGradient(
            baseX + drift,
            height * 0.16,
            baseX +
              drift +
              100,
            height * 0.72
          );

        gradient.addColorStop(
          0,
          "rgba(120,230,255,0)"
        );

        gradient.addColorStop(
          0.35,
          "rgba(90,210,240,0.035)"
        );

        gradient.addColorStop(
          0.65,
          "rgba(70,185,220,0.05)"
        );

        gradient.addColorStop(
          1,
          "rgba(30,130,180,0)"
        );

        ctx.fillStyle =
          gradient;

        ctx.beginPath();

        ctx.moveTo(
          baseX + drift,
          height * 0.16
        );

        ctx.lineTo(
          baseX +
            drift +
            45,
          height * 0.16
        );

        ctx.lineTo(
          baseX +
            drift +
            180,
          height * 0.72
        );

        ctx.lineTo(
          baseX +
            drift -
            40,
          height * 0.72
        );

        ctx.closePath();

        ctx.fill();
      }

      ctx.restore();
    };

    /* =====================================================
       BRUMES
    ===================================================== */

    const drawMists = () => {
      ctx.save();

      ctx.globalCompositeOperation =
        "screen";

      for (
        const mist of mists
      ) {
        mist.x +=
          Math.sin(
            time * 0.15 +
              mist.phase
          ) *
          0.15;

        const parallaxX =
          (smoothMouseX - 0.5) *
          100;

        const parallaxY =
          (smoothMouseY - 0.5) *
          50;

        const x =
          mist.x +
          parallaxX;

        const y =
          mist.y +
          Math.sin(
            time * 0.18 +
              mist.phase
          ) *
            8 +
          parallaxY;

        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            mist.width / 2
          );

        gradient.addColorStop(
          0,
          `rgba(145,240,255,${
            mist.opacity * 1.8
          })`
        );

        gradient.addColorStop(
          0.3,
          `rgba(80,210,240,${
            mist.opacity * 1.25
          })`
        );

        gradient.addColorStop(
          0.65,
          `rgba(35,150,200,${
            mist.opacity * 0.65
          })`
        );

        gradient.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
          gradient;

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          mist.width / 2,
          mist.height / 2,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.restore();
    };

    /* =====================================================
       PARTICULES
    ===================================================== */

    const drawParticles = () => {
      ctx.save();

      ctx.globalCompositeOperation =
        "screen";

      for (
        const particle of particles
      ) {
        particle.y -=
          particle.speed;

        particle.x +=
          particle.drift;

        particle.y +=
          Math.sin(
            time * 0.7 +
              particle.phase
          ) *
          0.0005;

        if (
          particle.y <
          -0.03
        ) {
          particle.y =
            0.8;

          particle.x =
            Math.random();
        }

        if (
          particle.x >
          1.05
        ) {
          particle.x =
            -0.05;
        }

        if (
          particle.x <
          -0.05
        ) {
          particle.x =
            1.05;
        }

        const parallaxX =
          (smoothMouseX - 0.5) *
          particle.depth *
          85;

        const parallaxY =
          (smoothMouseY - 0.5) *
          particle.depth *
          42;

        const px =
          particle.x * width +
          parallaxX;

        const py =
          particle.y * height +
          parallaxY;

        const twinkle =
          0.5 +
          Math.sin(
            time * 2.2 +
              particle.phase
          ) *
            0.5;

        if (
          particle.size >
          0.8
        ) {
          const glow =
            ctx.createRadialGradient(
              px,
              py,
              0,
              px,
              py,
              particle.size * 11
            );

          glow.addColorStop(
            0,
            `rgba(210,250,255,${
              particle.opacity *
              twinkle *
              0.7
            })`
          );

          glow.addColorStop(
            0.25,
            `rgba(100,225,250,${
              particle.opacity *
              twinkle *
              0.3
            })`
          );

          glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
          );

          ctx.fillStyle =
            glow;

          ctx.beginPath();

          ctx.arc(
            px,
            py,
            particle.size * 11,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          particle.size * 1.25,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(225,250,255,${
            particle.opacity *
            twinkle *
            1.5
          })`;

        ctx.fill();
      }

      ctx.restore();
    };


    /* =====================================================
       ÉTOILES — POINTS SIMPLES
    ===================================================== */
    const drawStars = () => {
      ctx.save();
    
      for (let i = 0; i < 50; i++) {
        const x =
          ((i * 173.73 +
            time * (2 + (i % 3))) %
            (width + 100)) -
          50;
    
        const y =
          height *
          (0.12 +
            ((i * 0.071) % 0.48));
    
        const cursorX =
          (smoothMouseX - 0.5) *
          ((i % 5) + 1) *
          20;
    
        const cursorY =
          (smoothMouseY - 0.5) *
          ((i % 4) + 1) *
          10;
    
        const pulse =
          0.55 +
          Math.sin(
            time * (1.2 + i * 0.08) + i
          ) *
            0.45;
    
        const radius =
          0.45 +
          (i % 4) * 0.25;
    
        /* Petit point uniquement */
        ctx.beginPath();
    
        ctx.arc(
          x + cursorX,
          y + cursorY,
          radius,
          0,
          Math.PI * 2
        );
    
        ctx.fillStyle = `rgba(
          235,
          252,
          255,
          ${0.45 * pulse}
        )`;
    
        ctx.fill();
      }
    
      ctx.restore();
    };
  

    /* =====================================================
       VIGNETTE
    ===================================================== */

    const drawVignette = () => {
      const vignette =
        ctx.createRadialGradient(
          width / 2,
          height / 2,
          height * 0.12,
          width / 2,
          height / 2,
          width * 0.8
        );

      vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      vignette.addColorStop(
        0.6,
        "rgba(0,3,12,0.08)"
      );

      vignette.addColorStop(
        0.82,
        "rgba(0,3,12,0.25)"
      );

      vignette.addColorStop(
        1,
        "rgba(0,3,12,0.62)"
      );

      ctx.fillStyle =
        vignette;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    };

    /* =====================================================
       RENDER
    ===================================================== */

    const render = () => {
      time += 0.006;

      /* -----------------------------------------------
         CURSEUR — TRÈS RÉACTIF
      ------------------------------------------------ */

      smoothMouseX +=
        (mouseX -
          smoothMouseX) *
        0.075;

      smoothMouseY +=
        (mouseY -
          smoothMouseY) *
        0.075;

      /* -----------------------------------------------
         BACKGROUND
      ------------------------------------------------ */

      const background =
        ctx.createLinearGradient(
          0,
          0,
          0,
          height
        );

      background.addColorStop(
        0,
        "#020a18"
      );

      background.addColorStop(
        0.2,
        "#063352"
      );

      background.addColorStop(
        0.43,
        "#075f82"
      );

      background.addColorStop(
        0.6,
        "#087c9e"
      );

      background.addColorStop(
        0.76,
        "#073653"
      );

      background.addColorStop(
        1,
        "#010714"
      );

      ctx.fillStyle =
        background;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /* -----------------------------------------------
         LUMIÈRES
      ------------------------------------------------ */

      drawLights();

      drawRays();

      /* -----------------------------------------------
         7 RELIEFS
      ------------------------------------------------ */

      drawLayer(
        createLayer(
          height * 0.575,
          height * 0.018,
          4.2,
          0.5,
          0.08,
          25
        ),
        "rgba(45,130,165,0.58)"
      );

      drawLayer(
        createLayer(
          height * 0.62,
          height * 0.025,
          5.1,
          2,
          -0.07,
          45
        ),
        "rgba(25,110,150,0.68)"
      );

      drawLayer(
        createLayer(
          height * 0.66,
          height * 0.035,
          5.8,
          1,
          0.06,
          70
        ),
        "rgba(15,90,130,0.78)"
      );

      drawLayer(
        createLayer(
          height * 0.70,
          height * 0.045,
          4.6,
          3,
          -0.045,
          100
        ),
        "rgba(8,68,108,0.88)"
      );

      drawLayer(
        createLayer(
          height * 0.745,
          height * 0.055,
          4.2,
          0,
          0.04,
          135
        ),
        "rgba(5,47,80,0.94)"
      );

      drawLayer(
        createLayer(
          height * 0.80,
          height * 0.07,
          3.7,
          2.5,
          -0.025,
          175
        ),
        "rgba(3,27,52,0.98)"
      );

      drawLayer(
        createLayer(
          height * 0.86,
          height * 0.09,
          3.1,
          4,
          0.02,
          220
        ),
        "rgba(1,10,23,1)"
      );

      /* -----------------------------------------------
         BRUMES
      ------------------------------------------------ */

      drawMists();

      /* -----------------------------------------------
         PARTICULES
      ------------------------------------------------ */

      drawParticles();

      /* -----------------------------------------------
         ÉTOILES
      ------------------------------------------------ */

      drawStars();

      /* -----------------------------------------------
         VIGNETTE
      ------------------------------------------------ */

      drawVignette();

      animationFrame =
        requestAnimationFrame(
          render
        );
    };

    render();

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  /* =======================================================
     SLIDE ACTUEL
  ======================================================= */

  const slide =
    carouselSlides[
      currentSlide
    ];

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const nextSlide = () => {
    if (
      carouselSlides.length ===
      0
    ) {
      return;
    }

    setCurrentSlide(
      (prev) =>
        (prev + 1) %
        carouselSlides.length
    );
  };

  const previousSlide = () => {
    if (
      carouselSlides.length ===
      0
    ) {
      return;
    }

    setCurrentSlide(
      (prev) =>
        (prev -
          1 +
          carouselSlides.length) %
        carouselSlides.length
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
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
        bg-[#010714]
      "
    >
      {/* ===================================================
          CANVAS
      =================================================== */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          w-full
          h-full
        "
      />

      {/* ===================================================
          OVERLAY LUMINEUX
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.18)_75%,rgba(0,0,0,0.5)_100%)]
        "
      />

```tsx
{/* =================================================*
    CARROUSEL TEXTE — ANIMÉ
================================================= */}

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

      {/* =================================================*
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

      {/* =================================================*
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

{/* =================================================*
    VIGNETTE
================================================= */}

<div
  className="
    absolute
    inset-0
    pointer-events-none
    bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.25)_80%,rgba(0,0,0,0.5)_100%)]
  "
/>
```


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
          from-[#010714]/70
          to-transparent
        "
      />
    </section>
  );
};

export default AbstractHero;