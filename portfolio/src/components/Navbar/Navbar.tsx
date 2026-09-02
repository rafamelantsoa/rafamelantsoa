import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  House,
  Code2,
  Briefcase,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { scrollToSection } from "../../lib/lenis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logoWhite from "../../assets/logo-color-White.svg";
import logoColor from "../../assets/logo-color.svg";

const menu = [
  { id: "work", label: "Accueil", icon: House },
  { id: "about", label: "Compétences", icon: Code2 },
  { id: "services", label: "Expériences", icon: Briefcase },
  { id: "realisations", label: "Réalisations", icon: LayoutGrid },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState("work");

  const navigate = useNavigate();

  /* ================= SCROLL SPY ================= */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      const sections = menu
        .filter((item) => item.id !== "realisations")
        .map((item) => document.getElementById(item.id));

      let current = "work";

      sections.forEach((section) => {
        if (!section) return;

        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;

        if (
          scrollPos >= offsetTop &&
          scrollPos < offsetTop + offsetHeight
        ) {
          current = section.id;
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= NAVIGATION ================= */
  const handleNavigation = (id: string) => {
    if (id === "realisations") {
      setActive("realisations");
      navigate("/portfolio");
      return;
    }

    scrollToSection(id);
    setActive(id);
  };

  return (
    <>
      {/* =========================================================
          TOP NAVBAR
          Desktop + Tablette
          md = 768px
          ========================================================= */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          fixed
          top-4
          md:top-5
          lg:top-6
          left-1/2
          -translate-x-1/2
          z-50
          w-full
          flex
          justify-center
        "
      >
        <div
          className="
            relative
            w-[94%]
            md:w-[94%]
            lg:w-[92%]
            max-w-6xl

            flex
            items-center
            justify-between

            backdrop-blur-sm
            bg-white/80
            dark:bg-black/60

            border
            border-white/10

            rounded-full

            px-4
            md:px-5
            lg:px-10

            py-3
            md:py-3.5
            lg:py-5

            gap-3
          "
        >
          {/* ================= LOGO ================= */}
          <div
            className="
              flex
              items-center
              cursor-pointer
              shrink-0
            "
            onClick={() => navigate("/")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.img
                  key="dark"
                  src={logoWhite}
                  alt="logo"
                  className="
                    h-8
                    md:h-8
                    lg:h-10
                    w-auto
                  "
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              ) : (
                <motion.img
                  key="light"
                  src={logoColor}
                  alt="logo"
                  className="
                    h-8
                    md:h-8
                    lg:h-10
                    w-auto
                  "
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* =====================================================
              DESKTOP / TABLET MENU
              ===================================================== */}
          <div
            className="
              hidden
              md:flex

              items-center
              justify-center

              gap-4
              lg:gap-8

              text-sm
              lg:text-md

              font-medium

              flex-1
            "
          >
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="
                  relative
                  cursor-pointer
                  whitespace-nowrap
                "
              >
                <span
                  className={`
                    transition
                    duration-300

                    ${
                      active === item.id
                        ? "text-primary"
                        : "text-zinc-700 hover:text-primary dark:text-zinc-300"
                    }
                  `}
                >
                  {item.label}
                </span>

                <span
                  className={`
                    absolute
                    left-0
                    -bottom-1
                    h-[2px]
                    bg-primary
                    transition-all
                    duration-300

                    ${
                      active === item.id
                        ? "w-full opacity-100"
                        : "w-0 opacity-0"
                    }
                  `}
                />
              </button>
            ))}
          </div>

          {/* ================= THEME TOGGLE ================= */}
          <button
            onClick={toggleTheme}
            className="
              shrink-0

              p-2
              md:p-2
              lg:p-2

              rounded-full

              bg-white/10
              hover:bg-primary/20

              transition

              cursor-pointer
            "
            aria-label="Changer le thème"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <Sun
                    size={17}
                    className="md:w-[18px] md:h-[18px]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <Moon
                    size={17}
                    className="md:w-[18px] md:h-[18px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* =========================================================
          MOBILE NAVBAR
          Uniquement sous 768px
          ========================================================= */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="
          md:hidden

          fixed
          bottom-4
          left-1/2
          -translate-x-1/2

          z-50

          w-[94%]

          rounded-3xl

          backdrop-blur-md
          bg-white/80
          dark:bg-black/60

          border
          border-white/10

          px-1
          py-1.5
        "
      >
        <div className="flex justify-around">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="
                  flex
                  flex-col
                  items-center
                  justify-center

                  gap-1

                  w-full

                  py-1.5

                  cursor-pointer
                "
              >
                <motion.div
                  animate={{
                    scale: active === item.id ? 1.15 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Icon
                    size={21}
                    className={
                      active === item.id
                        ? "text-primary"
                        : "text-zinc-500"
                    }
                  />
                </motion.div>

                <span
                  className={`
                    text-[10px]
                    ${
                      active === item.id
                        ? "text-primary"
                        : "text-zinc-500"
                    }
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;