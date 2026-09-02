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
          Desktop + Tablette
      ===================================================== */}

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

            gap-3

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
          "
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

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
                  className="
                    h-8
                    md:h-8
                    lg:h-10
                    w-auto
                  "
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
              DESKTOP / TABLET MENU
          ===================================================== */}

          <div
            className="
              hidden
              md:flex

              flex-1

              items-center
              justify-center

              gap-5
              lg:gap-8

              text-sm
              lg:text-md

              font-medium
            "
          >
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
                    whitespace-nowrap

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
              shrink-0

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
                  <Sun
                    size={17}
                    className="lg:w-[18px] lg:h-[18px]"
                  />
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
                  <Moon
                    size={17}
                    className="lg:w-[18px] lg:h-[18px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* =====================================================
          MOBILE NAV
          < 768px
      ===================================================== */}

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
                  justify-center

                  gap-1

                  w-full

                  py-1.5

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
                    size={21}
                    className={
                      active
                        ? "text-primary"
                        : "text-zinc-500"
                    }
                  />
                </motion.div>

                <span
                  className={`
                    text-[10px]

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