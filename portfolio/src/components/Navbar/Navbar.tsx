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
      {/* ================= TOP NAV ================= */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center"
      >
        <div className="relative w-[92%] max-w-6xl flex items-center justify-between backdrop-blur-sm bg-white/80 dark:bg-black/60 border border-white/10 rounded-full px-6 md:px-10 py-4 md:py-5">

          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.img
                  key="dark"
                  src={logoWhite}
                  alt="logo"
                  className="h-10 w-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              ) : (
                <motion.img
                  key="light"
                  src={logoColor}
                  alt="logo"
                  className="h-10 w-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-md font-medium">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="relative cursor-pointer"
              >
                <span
                  className={`transition duration-300 ${
                    active === item.id
                      ? "text-primary"
                      : "text-zinc-700 hover:text-primary dark:text-zinc-300"
                  }`}
                >
                  {item.label}
                </span>

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 ${
                    active === item.id
                      ? "w-full opacity-100"
                      : "w-0 opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-primary/20 transition"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ================= MOBILE NAV ================= */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] rounded-3xl backdrop-blur-md bg-white/80 dark:bg-black/60 border border-white/10 px-2 py-2"
      >
        <div className="flex justify-around">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="flex flex-col items-center gap-1 w-full py-2"
              >
                <motion.div
                  animate={{ scale: active === item.id ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    size={22}
                    className={
                      active === item.id
                        ? "text-primary"
                        : "text-zinc-500"
                    }
                  />
                </motion.div>

                <span
                  className={`text-[11px] ${
                    active === item.id
                      ? "text-primary"
                      : "text-zinc-500"
                  }`}
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