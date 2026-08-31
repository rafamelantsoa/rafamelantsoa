import {
  useEffect,
  useState,
} from "react";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

interface CursorState {
  visible: boolean;
  active: boolean;
}

/* =========================================================
   CUSTOM CURSOR
========================================================= */

const CustomCursor = () => {
  const [isDesktop, setIsDesktop] =
    useState(false);

  const [cursorState, setCursorState] =
    useState<CursorState>({
      visible: false,
      active: false,
    });

  /* =======================================================
     POSITION
  ======================================================= */

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  /* =======================================================
     POINT CENTRAL
  ======================================================= */

  const dotX = useSpring(mouseX, {
    stiffness: 1200,
    damping: 45,
    mass: 0.08,
  });

  const dotY = useSpring(mouseY, {
    stiffness: 1200,
    damping: 45,
    mass: 0.08,
  });

  /* =======================================================
     CERCLE
  ======================================================= */

  const ringX = useSpring(mouseX, {
    stiffness: 220,
    damping: 24,
    mass: 0.3,
  });

  const ringY = useSpring(mouseY, {
    stiffness: 220,
    damping: 24,
    mass: 0.3,
  });

  /* =======================================================
     DESKTOP DETECTION
  ======================================================= */

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

      const desktop =
        window.innerWidth >= 1024 &&
        !hasTouch;

      setIsDesktop(desktop);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  /* =======================================================
     MOUSE EVENTS
  ======================================================= */

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      setCursorState((prev) => ({
        ...prev,
        visible: true,
      }));
    };

    const handleMouseEnter = () => {
      setCursorState((prev) => ({
        ...prev,
        visible: true,
      }));
    };

    const handleMouseLeave = () => {
      setCursorState((prev) => ({
        ...prev,
        visible: false,
      }));
    };

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target) return;

      const interactive =
        target.closest(
          "a, [data-cursor], p, span, h1, h2, h3, h4, h5, h6, li"
        ) as HTMLElement | null;

      setCursorState((prev) => ({
        ...prev,
        active: Boolean(interactive),
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handlePointerOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handlePointerOver);
    };
  }, [isDesktop, mouseX, mouseY]);

  /* =======================================================
     MOBILE / TABLET
  ======================================================= */

  if (!isDesktop) {
    return null;
  }

  /* =======================================================
     COULEURS & MODE DE FUSION
     — le curseur reste toujours blanc, mais mix-blend-mode
       inverse la couleur perçue selon le fond (clair/sombre)
  ======================================================= */

  const CURSOR_COLOR = "#FFFFFF";
  const BLEND_MODE = "exclusion"; // essaie aussi "exclusion"

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* OUTER CURSOR */}
      <motion.div
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]
          rounded-full
        "
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: BLEND_MODE,
        }}
        animate={{
          width: cursorState.active ? 72 : 38,
          height: cursorState.active ? 72 : 38,
          opacity: cursorState.visible ? 1 : 0,
          backgroundColor: cursorState.active
            ? CURSOR_COLOR
            : "transparent",
          borderWidth: cursorState.active ? 0 : 1.5,
          borderColor: CURSOR_COLOR,
          scale: cursorState.active ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
        }}
      />

      {/* CENTER DOT */}
      <motion.div
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10000]
          h-[5px]
          w-[5px]
          rounded-full
        "
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: CURSOR_COLOR,
          mixBlendMode: BLEND_MODE,
        }}
        animate={{
          scale: cursorState.active ? 0 : cursorState.visible ? 1 : 0,
          opacity: cursorState.visible ? 1 : 0,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
      />
    </>
  );
};

export default CustomCursor;