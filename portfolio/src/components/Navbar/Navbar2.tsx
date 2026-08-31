import { motion, AnimatePresence } from "framer-motion";

import {
  Sun,
  Moon,
  House,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logoWhite from "../../assets/logo-color-White.svg";
import logoColor from "../../assets/logo-color.svg";

const menu = [
  {
    label: "Accueil",
    icon: House,
    path: "/",
  },
  {
    label: "Réalisations",
    icon: LayoutGrid,
    path: "/portfolio",
  },
  {
    label: "Contact",
    icon: MessageCircle,
    path: "/portfolio#contact2",
  },
];

const Navbar2 = () => {
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  /* =====================================================
     SCROLL VERS CONTACT APRÈS CHARGEMENT DE PORTFOLIO
  ===================================================== */

  useEffect(() => {
    if (
      location.pathname !== "/portfolio" ||
      location.hash !== "#contact2"
    ) {
      return;
    }

    // On attend que React ait terminé le rendu
    // de la page Portfolio et du composant Contact.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById("contact2");

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation = (path: string) => {
    // ==========================================
    // CONTACT
    // ==========================================

    if (path === "/portfolio#contact2") {
      // Si on est déjà sur Portfolio
      if (location.pathname === "/portfolio") {
        const element = document.getElementById("contact2");

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Met à jour l'URL sans recharger la page
          window.history.replaceState(
            null,
            "",
            "/portfolio#contact2"
          );

          return;
        }
      }

      // Si on vient d'une autre page
      navigate("/portfolio#contact2");

      return;
    }

    // ==========================================
    // AUTRES ROUTES
    // ==========================================

    navigate(path);
  };

  return (
    <>
      {/* =====================================================
          TOP NAV
      ===================================================== */}

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          fixed
          top-6
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
            w-[92%]
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
            px-6
            md:px-10
            py-4
            md:py-5
          "
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

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
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                />
              ) : (
                <motion.img
                  key="light"
                  src={logoColor}
                  alt="logo"
                  className="h-10 w-auto"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* =====================================================
              DESKTOP MENU
          ===================================================== */}

          <div className="hidden md:flex items-center gap-8 text-md font-medium">
            {menu.map((item) => {
              const active =
                item.path === "/portfolio#contact2"
                  ? location.pathname === "/portfolio" &&
                    location.hash === "#contact2"
                  : location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    transition
                    duration-300
                    cursor-pointer
                    ${
                      active
                        ? "text-primary"
                        : "text-zinc-700 hover:text-primary dark:text-zinc-300"
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* =====================================================
              THEME
          ===================================================== */}

          <button
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="
              p-2
              rounded-full
              bg-white/10
              hover:bg-primary/20
              transition
              cursor-pointer
            "
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* =====================================================
          MOBILE NAV
      ===================================================== */}

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="
          md:hidden
          fixed
          bottom-5
          left-1/2
          -translate-x-1/2
          z-50
          w-[95%]
          rounded-3xl
          backdrop-blur-md
          bg-white/80
          dark:bg-black/60
          border
          border-white/10
          px-2
          py-2
        "
      >
        <div className="flex justify-around">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === "/portfolio#contact2"
                ? location.pathname === "/portfolio" &&
                  location.hash === "#contact2"
                : location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className="
                  flex
                  flex-col
                  items-center
                  gap-1
                  w-full
                  py-2
                  cursor-pointer
                "
              >
                <motion.div
                  animate={{
                    scale: active ? 1.15 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Icon
                    size={22}
                    className={
                      active
                        ? "text-primary"
                        : "text-zinc-500"
                    }
                  />
                </motion.div>

                <span
                  className={`
                    text-[11px]
                    ${
                      active
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

export default Navbar2;