import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { RefObject } from "react";

import { ChevronRight } from "lucide-react";

interface FloatingBadgeProps {
  containerRef: RefObject<HTMLDivElement | null>;
  text?: string;
}

const FloatingBadge = ({
  containerRef,
  text = "Annicolas Rafamelantsoa",
}: FloatingBadgeProps) => {
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);

  const springX = useSpring(badgeX, {
    stiffness: 120,
    damping: 15,
    mass: 0.5,
  });

  const springY = useSpring(badgeY, {
    stiffness: 120,
    damping: 15,
    mass: 0.5,
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const mouseX =
        event.clientX - (rect.left + rect.width / 2);

      const mouseY =
        event.clientY - (rect.top + rect.height / 2);

      /*
       * Intensité du déplacement du badge.
       *
       * 0.12 = déplacement subtil
       * 0.20 = déplacement plus visible
       * 0.30 = déplacement important
       */

      badgeX.set(mouseX * 0.12);
      badgeY.set(mouseY * 0.12);
    };

    const handleMouseLeave = () => {
      badgeX.set(0);
      badgeY.set(0);
    };

    container.addEventListener(
      "mousemove",
      handleMouseMove
    );

    container.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      container.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, [containerRef, badgeX, badgeY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
      }}
      className="
        absolute
        z-20
        md:left-[60%] left-[40%]
        md:top-[65%] top-[75%]
        flex
        items-center
        gap-2
        rounded-full
        border
        border-blue-300/60 dark:border-violet-400/30
        bg-blue-600 dark:bg-violet-700
        px-5
        py-2.5
        text-sm
        font-bold
        text-white
        pointer-events-none
        select-none
        whitespace-nowrap
      "
    >
        <ChevronRight
            size={18}
            strokeWidth={4}
        />

      <span>
        {text}
      </span>
    </motion.div>
  );
};

export default FloatingBadge;