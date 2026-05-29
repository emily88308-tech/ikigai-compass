import { useState, useEffect } from "react";

// Tracks the viewport size. Used to switch between the desktop (sidebar +
// two-column) and mobile (bottom tabs + stacked) layouts.
export function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setSize({ width: window.innerWidth, height: window.innerHeight }),
      );
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return size;
}

// Phones (and narrow windows) get the mobile layout below this width.
export const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const { width } = useWindowSize();
  return width < MOBILE_BREAKPOINT;
}
