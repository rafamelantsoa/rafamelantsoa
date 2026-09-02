import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import axios from "axios";

import AbstractHero from "./AbstractHero";

import { Link } from "react-router-dom";

const MotionLink = motion(Link);

/* ==========================================================================
   TYPES
========================================================================== */

type Stat = {
  _id: string;
  number: number;
  label: string;
  order: number;
};

type WorkData = {
  _id: string;
  stats: Stat[];
  marquee: string[];
  title: string;
  description: string;
};

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

/* ==========================================================================
   API
========================================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const WORK_API_URL =
  `${API_URL}/work`;

const REALISATIONS_API_URL =
  `${API_URL}/realisations`;

/* ==========================================================================
   COUNT UP
========================================================================== */

const useCountUp = (
  end: number,
  duration = 2000
) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment =
      end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setValue(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return value;
};

/* ==========================================================================
   STAT COMPONENT
========================================================================== */

type AnimatedStatProps = {
  number: number;
  label: string;
  index: number;
};

const AnimatedStat = ({
  number,
  label,
  index,
}: AnimatedStatProps) => {
  const count = useCountUp(number);

  return (
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
        delay: index * 0.1,
      }}
      className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8"
    >
      <h3 className="text-5xl font-semibold tracking-tight">
        +{count}
      </h3>

      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </motion.div>
  );
};

/* ==========================================================================
   COMPONENT
========================================================================== */

const Work = () => {
  const [work, setWork] =
    useState<WorkData | null>(null);

  const [realisations, setRealisations] =
    useState<RealisationsData | null>(null);

  /* ==========================================================================
     GET WORK
  ========================================================================== */

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await axios.get(
          WORK_API_URL
        );

        setWork(response.data);
      } catch (error) {
        console.error(
          "Erreur récupération Work :",
          error
        );
      }
    };

    fetchWork();
  }, []);

  /* ==========================================================================
     GET REALISATIONS
  ========================================================================== */

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const response = await axios.get(
          REALISATIONS_API_URL
        );

        setRealisations(response.data);
      } catch (error) {
        console.error(
          "Erreur récupération réalisations :",
          error
        );
      }
    };

    fetchRealisations();
  }, []);

  /* ==========================================================================
     WAIT DATA
  ========================================================================== */

  if (!work || !realisations) {
    return null;
  }

  /* ==========================================================================
     3 PROJECTS
  ========================================================================== */

  const recentProjects =
    [...realisations.projects]
      .sort(
        (a, b) =>
          a.order - b.order
      )
      .slice(0, 4);

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <section
      id="work"
      className="pb-32 pt-4 overflow-hidden"
    >


      {/* ================================================================
            ABSTRACT
        ================================================================= */}      
              
      <AbstractHero />


      <div className="max-w-7xl mx-auto px-6">


        {/* ================================================================
            STATS
        ================================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 mb-2 md:mb-16 mx-0 md:mx-10">

          {work.stats
            .sort(
              (a, b) =>
                a.order - b.order
            )
            .slice(0, 4)
            .map((item, index) => (
              <AnimatedStat
                key={item._id}
                number={item.number}
                label={item.label}
                index={index}
              />
            ))}

        </div>


{/* ================================================================
    MARQUEE STACK — DOUBLE SENS / SUPERPOSITION
================================================================ */}

<div className="relative left-1/2 right-1/2 -mx-[50vw] mb-16 w-screen overflow-hidden py-10">

  {/* ================================
      MARQUEE 001 — GAUCHE → DROITE
  ================================= */}

  <div
    className="
      relative
      z-10
      -rotate-[3deg]
      scale-[1.04]
      border-y
      border-white/10
      py-6
      overflow-hidden
      bg-primary
    "
  >



    {/* TEXT */}

    <div className="relative flex w-max animate-[marquee_18s_linear_infinite]">

      {[...work.marquee, ...work.marquee].map(
        (item, index) => (
          <span
            key={`${item}-${index}`}
            className="
              mx-10
              text-2xl
              font-black
              uppercase
              tracking-[0.15em]
              text-zinc-100
              md:text-3xl
              lg:text-4xl
            "
          >
            {item}
          </span>
        )
      )}

    </div>

  </div>


  {/* ================================
      MARQUEE 002 — DROITE → GAUCHE
  ================================= */}

  <div
    className="
      relative
      z-20
      -mt-20
      rotate-[3deg]
      scale-[1.04]
      border-y
      border-white/10
      py-6
      overflow-hidden
      bg-[#0a0a1f]
    "
  >

    {/* BACKGROUND GRADIENT */}

    <div className="absolute inset-0 pointer-events-none">

      {/* Orange glow */}
      <div
        className="
          absolute
          top-[-45%]
          right-[-25%]
          h-[75%]
          w-[55%]
          rounded-full
          bg-orange-500/20
          blur-[130px]
        "
      />

      {/* Blue glow */}
      <div
        className="
          absolute
          top-[5%]
          left-[45%]
          h-[80%]
          w-[60%]
          rounded-full
          bg-indigo-600/30
          blur-[140px]
        "
      />

      {/* Violet glow */}
      <div
        className="
          absolute
          bottom-[-30%]
          right-[10%]
          h-[65%]
          w-[55%]
          rounded-full
          bg-violet-600/20
          blur-[120px]
        "
      />

      {/* Center glow */}
      <div
        className="
          absolute
          top-[30%]
          left-[30%]
          h-[45%]
          w-[40%]
          rounded-full
          bg-blue-500/15
          blur-[120px]
        "
      />

      {/* Vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.25)_70%,rgba(0,0,0,0.55)_100%)]
        "
      />

    </div>

    {/* TEXT — SENS INVERSE */}

    <div className="relative flex w-max animate-[marqueeReverse_18s_linear_infinite]">

      {[...work.marquee, ...work.marquee].map(
        (item, index) => (
          <span
            key={`${item}-${index}`}
            className="
              mx-10
              text-2xl
              font-black
              uppercase
              tracking-[0.15em]
              text-zinc-100
              md:text-3xl
              lg:text-4xl
            "
          >
            {item}
          </span>
        )
      )}

    </div>

  </div>

</div>



        {/* ================================================================
            TITLE
        ================================================================= */}

        <div className="mb-20 md:mx-10 mx-2">

          <h2 className="text-5xl md:text-7xl font-semibold font-title tracking-tight">
            {work.title}
          </h2>

          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400 font-light">
            {work.description}
          </p>

        </div>

{/* ================================================================
    PROJECTS — PROJETS RÉCENTS
================================================================= */}
<div className="grid md:grid-cols-2 gap-x-6 gap-y-16 md:mx-10 mx-2">
  {recentProjects.map((project, index) => (
    <MotionLink
      key={project._id}
      to={`/realisations/${project._id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className="group block"
    >
      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <img
          src={project.image.url}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:blur-xs transition duration-700"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-700" />

        {/* VIEW */}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition duration-500">
            <ArrowUpRight
              size={22}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>

      {/* TEXT */}

      <div className="mt-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-2xl font-medium text-zinc-900 dark:text-white">
              {project.title}
            </h3>

            <p className="text-sm text-[#2464cc] mt-1">
              {project.category}
            </p>
          </div>

          <ArrowUpRight
            size={24}
            strokeWidth={1.6}
            className="text-zinc-400 group-hover:text-[#2464cc] group-hover:rotate-12 transition-all duration-300"
          />
        </div>

        {/* LINE */}

        <div className="mt-6 h-px bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-0 group-hover:w-full bg-[#2464cc] transition-all duration-700" />
        </div>
      </div>
    </MotionLink>
  ))}
</div>

      </div>
    </section>
  );
};

export default Work;