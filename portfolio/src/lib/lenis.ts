import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

export const initLenis = () => {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};

export const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el || !lenis) return;

  lenis.scrollTo(el, {
    duration: 1.2,
  });
};