import { useRef } from "react";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  Palette,
  PenTool,
  Box,
  Code2,
  Monitor,
  Globe,
  Camera,
  Database,
  Layout,
  Layers,
  Smartphone,
  Laptop,
  Server,
  Brush,
  Code,
  type LucideIcon,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ExpertiseItem = {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  tags?: string[];
};

type ExpertiseProps = {
  title: string;
  expertise: ExpertiseItem[];
};

/* =========================================================
   ICON MAP
========================================================= */

const iconMap: Record<string, LucideIcon> = {
  Palette,
  PenTool,
  Box,
  Code2,
  Monitor,
  Globe,
  Camera,
  Database,
  Layout,
  Layers,
  Smartphone,
  Laptop,
  Server,
  Brush,
  Code,
};

/* =========================================================
   GET ICON
========================================================= */

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Code2;
};

/* =========================================================
   PANEL THEMES
========================================================= */

const PANEL_THEMES = [
  {
    bg: "bg-[#1a1a1a]",
    text: "text-[#f2ede4]",
    accent: "text-[#2464cc]",
  },
  {
    bg: "bg-[#2464cc]",
    text: "text-black",
    accent: "text-white",
  },
  {
    bg: "bg-[#f2ede4]",
    text: "text-black",
    accent: "text-[#2464cc]",
  },
];

/* =========================================================
   EXPERTISE
========================================================= */

const Expertise = ({
  title,
  expertise,
}: ExpertiseProps) => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const count = expertise.length;

  /*
   * =======================================================
   * DESKTOP
   * =======================================================
   *
   * Le scroll vertical est transformé en déplacement
   * horizontal.
   *
   * Exemple avec 4 blocs :
   *
   * 01 → 0vw
   * 02 → -100vw
   * 03 → -200vw
   * 04 → -300vw
   *
   * =======================================================
   */

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(count - 1) * 100}vw`]
  );

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET
          SCROLL HORIZONTAL
      ===================================================== */}

      <section
        ref={containerRef}
        style={{
          height: `${count * 100}vh`,
        }}
        className="relative hidden md:block w-full"
      >
        {/* =================================================
            STICKY VIEWPORT
        ================================================= */}

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* =================================================
              TITRE
          ================================================= */}

          <div className="absolute top-8 left-8 md:left-12 z-30 mix-blend-difference pointer-events-none">
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {title}
            </p>
          </div>

          {/* =================================================
              RAIL HORIZONTAL
          ================================================= */}

          <motion.div
            style={{
              x,
              width: `${count * 100}vw`,
            }}
            className="flex h-full"
          >
            {expertise.map(
              (item, index) => {
                const Icon = getIcon(
                  item.icon
                );

                const theme =
                  PANEL_THEMES[
                    index %
                      PANEL_THEMES.length
                  ];

                const number =
                  String(index + 1).padStart(
                    2,
                    "0"
                  );

                return (
                  <div
                    key={
                      item._id ||
                      `${item.title}-${index}`
                    }
                    className={`
                      relative
                      w-screen
                      min-w-screen
                      h-full
                      shrink-0
                      flex
                      flex-col
                      justify-center
                      px-8
                      sm:px-12
                      md:px-20
                      lg:px-32
                      ${theme.bg}
                      ${theme.text}
                    `}
                  >
                    {/* =====================================
                        ICON
                    ===================================== */}

                    <div className="mb-8">
                      <Icon
                        size={80}
                        strokeWidth={1.4}
                        className={`
                          ${theme.accent}
                          md:w-[110px]
                          md:h-[110px]
                        `}
                      />
                    </div>

                    {/* =====================================
                        NUMÉRO
                    ===================================== */}

                    <div
                      className="
                        text-7xl
                        sm:text-8xl
                        md:text-[10rem]
                        font-black
                        font-title
                        leading-none
                        tracking-[-0.06em]
                        mb-8
                      "
                    >
                      {number}
                    </div>

                    {/* =====================================
                        LABEL
                    ===================================== */}

                    <div className="absolute top-8 right-8 md:right-12">
                      <span
                        className={`
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          ${theme.accent}
                        `}
                      >
                        Expertise
                      </span>
                    </div>

                    {/* =====================================
                        TITRE
                    ===================================== */}

                    <h3
                      className="
                        text-4xl
                        sm:text-5xl
                        md:text-7xl
                        font-black
                        font-title
                        uppercase
                        leading-[0.95]
                        mb-6
                        max-w-4xl
                      "
                    >
                      {item.title}
                    </h3>

                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <p
                      className="
                        text-sm
                        md:text-base
                        leading-relaxed
                        max-w-md
                        opacity-90
                      "
                    >
                      {item.description}
                    </p>

                    {/* =====================================
                        TAGS
                    ===================================== */}

                    {item.tags &&
                      item.tags.length >
                        0 && (
                        <div className="flex flex-wrap gap-3 mt-8">
                          {item.tags.map(
                            (tag) => (
                              <span
                                key={tag}
                                className={`
                                  text-xs
                                  uppercase
                                  tracking-wide
                                  border
                                  rounded-full
                                  px-3
                                  py-1
                                  ${theme.text}
                                  border-current
                                  opacity-80
                                `}
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      )}

                    {/* =====================================
                        COMPTEUR
                    ===================================== */}

                    <div
                      className="
                        absolute
                        bottom-10
                        right-8
                        md:right-12
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        opacity-50
                      "
                    >
                      {number} /{" "}
                      {String(count).padStart(
                        2,
                        "0"
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </motion.div>

          {/* =================================================
              PROGRESSION
          ================================================= */}

          <div className="absolute bottom-8 left-8 right-8 z-30 flex gap-2 text-white">
            {expertise.map(
              (_, index) => (
                <ProgressDot
                  key={index}
                  index={index}
                  count={count}
                  scrollYProgress={
                    scrollYProgress
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE
          AFFICHAGE VERTICAL
          AUCUN SCROLL HORIZONTAL
      ===================================================== */}

      <section className="block md:hidden w-full">
        {/* =================================================
            TITRE MOBILE
        ================================================= */}

        <div className="px-5 pt-16 pb-10">
          <motion.p
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
              duration: 0.5,
            }}
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-zinc-400
            "
          >
            {title}
          </motion.p>
        </div>

        {/* =================================================
            EXPERTISES
        ================================================= */}

        <div className="w-full">
          {expertise.map(
            (item, index) => {
              const Icon = getIcon(
                item.icon
              );

              const theme =
                PANEL_THEMES[
                  index %
                    PANEL_THEMES.length
                ];

              const number =
                String(index + 1).padStart(
                  2,
                  "0"
                );

              return (
                <motion.div
                  key={
                    item._id ||
                    `${item.title}-${index}`
                  }
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
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.05,
                  }}
                  className={`
                    relative
                    w-full
                    min-h-[620px]
                    flex
                    flex-col
                    justify-center
                    px-6
                    py-16
                    ${theme.bg}
                    ${theme.text}
                  `}
                >
                  {/* =====================================
                      ICON MOBILE
                  ===================================== */}

                  <div className="mb-8">
                    <Icon
                      size={75}
                      strokeWidth={1.4}
                      className={
                        theme.accent
                      }
                    />
                  </div>

                  {/* =====================================
                      NUMÉRO
                  ===================================== */}

                  <div
                    className="
                      text-[6rem]
                      leading-none
                      font-black
                      font-title
                      tracking-[-0.07em]
                      mb-8
                    "
                  >
                    {number}
                  </div>

                  {/* =====================================
                      LABEL
                  ===================================== */}

                  <div className="absolute top-6 right-6">
                    <span
                      className={`
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        ${theme.accent}
                      `}
                    >
                      Expertise
                    </span>
                  </div>

                  {/* =====================================
                      TITRE
                  ===================================== */}

                  <h3
                    className="
                      text-4xl
                      sm:text-5xl
                      font-black
                      font-title
                      uppercase
                      leading-[0.95]
                      mb-6
                    "
                  >
                    {item.title}
                  </h3>

                  {/* =====================================
                      DESCRIPTION
                  ===================================== */}

                  <p
                    className="
                      text-sm
                      leading-relaxed
                      max-w-md
                      opacity-90
                    "
                  >
                    {item.description}
                  </p>

                  {/* =====================================
                      TAGS
                  ===================================== */}

                  {item.tags &&
                    item.tags.length >
                      0 && (
                      <div className="flex flex-wrap gap-2 mt-8">
                        {item.tags.map(
                          (tag) => (
                            <span
                              key={tag}
                              className={`
                                text-[10px]
                                uppercase
                                tracking-wide
                                border
                                rounded-full
                                px-3
                                py-1
                                ${theme.text}
                                border-current
                                opacity-80
                              `}
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  {/* =====================================
                      COMPTEUR
                  ===================================== */}

                  <div
                    className="
                      absolute
                      bottom-6
                      right-6
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      opacity-50
                    "
                  >
                    {number} /{" "}
                    {String(count).padStart(
                      2,
                      "0"
                    )}
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </section>
    </>
  );
};

/* =========================================================
   PROGRESS DOT
========================================================= */

const ProgressDot = ({
  index,
  count,
  scrollYProgress,
}: {
  index: number;
  count: number;
  scrollYProgress: ReturnType<
    typeof useScroll
  >["scrollYProgress"];
}) => {
  const start = index / count;
  const middle =
    (index + 0.5) / count;
  const end =
    (index + 1) / count;

  const opacity = useTransform(
    scrollYProgress,
    [start, middle, end],
    [0.25, 1, 0.25]
  );

  return (
    <motion.div
      style={{
        opacity,
      }}
      className="
        h-1
        flex-1
        rounded-full
        bg-current
      "
    />
  );
};

export default Expertise;