import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

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

const Realisations = () => {
  const [data, setData] =
    useState<RealisationsData | null>(null);

  /**
   * |--------------------------------------------------------------------------
   * | GET DATA
   * |--------------------------------------------------------------------------
   */
  const fetchRealisations = async () => {
    try {
      const url = `${API_URL}/realisations`;

      console.log(
        "GET REALISATIONS URL:",
        url
      );

      const response =
        await axios.get<RealisationsData>(url);

      console.log(
        "REALISATIONS DATA:",
        response.data
      );

      setData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erreur récupération réalisations:",
          {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
          }
        );
      } else {
        console.error(
          "Erreur récupération réalisations:",
          error
        );
      }
    }
  };

  /**
   * |--------------------------------------------------------------------------
   * | LOAD DATA
   * |--------------------------------------------------------------------------
   */
  useEffect(() => {
    // Retour en haut lors du chargement de la page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    fetchRealisations();
  }, []);

  /**
   * |--------------------------------------------------------------------------
   * | WAIT DATA
   * |--------------------------------------------------------------------------
   */
  if (!data) {
    return null;
  }

  /**
   * |--------------------------------------------------------------------------
   * | RENDER
   * |--------------------------------------------------------------------------
   */
  return (
    <section
      id="realisations"
      className="py-36 px-5 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto"
    >
      {/* TITLE */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
          {data.title}
        </h2>

        <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-2xl">
          {data.description}
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-16">
        {data.projects.map((project, index) => (
          <MotionLink
            key={project._id}
            to={`/realisations/${project._id}`}
            initial={{
              opacity: 0,
              y: 40,
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
            className="group block"
          >
            {/* IMAGE */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <img
                src={project.image.url}
                alt={project.title}
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

      {/* CTA */}
      <motion.div
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
          duration: 0.6,
        }}
        className="flex justify-center mt-20"
      >
        <a
          href="#contact"
          className="group inline-flex items-center gap-4 rounded-full bg-[#2464cc] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1d55b0] hover:px-8"
        >
          <span>
            Discutons de nos projets
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight
              size={17}
              strokeWidth={1.8}
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
};

export default Realisations;