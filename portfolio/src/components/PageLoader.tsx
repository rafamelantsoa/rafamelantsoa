import { motion } from "framer-motion";

const PageLoader = () => {
  const bars = Array.from({ length: 12 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-zinc-100
        dark:bg-zinc-950
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-8
        "
      >
        {/* =================================================
            SPINNER (traits rotatifs, style iOS)
        ================================================= */}

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-16 h-16"
        >
          {bars.map((_, i) => {
            const rotation = (360 / bars.length) * i;
            const opacity = 1 - i / bars.length;

            return (
              <span
                key={i}
                className="
                  absolute
                  top-0
                  left-1/2
                  w-[3px]
                  h-[26%]
                  rounded-full
                  bg-zinc-800
                  dark:bg-zinc-200
                "
                style={{
                  transform: `translateX(-50%) rotate(${rotation}deg)`,
                  transformOrigin: "50% 200%",
                  opacity,
                }}
              />
            );
          })}
        </motion.div>

        {/* =================================================
            LOADING TEXT
        ================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            text-sm
            font-medium
            tracking-[0.4em]
            text-zinc-400
            dark:text-zinc-500
            uppercase
          "
        >
          Loading
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageLoader;