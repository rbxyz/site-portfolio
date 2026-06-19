"use client";

import { useEffect } from "react";

/**
 * Reproduces the handoff's scroll-reveal + word-by-word logic.
 * - `[data-reveal]` elements fade/slide in (one-shot) via IntersectionObserver.
 * - `[data-word]` spans inside an <h2> reveal staggered (55ms) once the heading
 *   reaches 30% visibility.
 * Honors prefers-reduced-motion by showing everything immediately.
 *
 * Project-hover and stack-row-hover are handled in CSS (see globals.css).
 */
export function usePortfolioEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const reveals =
      document.querySelectorAll<HTMLElement>("[data-reveal]");
    const words = document.querySelectorAll<HTMLElement>("[data-word]");

    if (reduce) {
      reveals.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      words.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );
    reveals.forEach((el) => io.observe(el));

    const wordObservers: IntersectionObserver[] = [];
    document.querySelectorAll<HTMLHeadingElement>("h2").forEach((h) => {
      const ws = h.querySelectorAll<HTMLElement>("[data-word]");
      if (!ws.length) return;
      const wio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              ws.forEach((w, i) => {
                setTimeout(() => {
                  w.style.opacity = "1";
                  w.style.transform = "none";
                }, i * 55);
              });
              wio.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );
      wio.observe(h);
      wordObservers.push(wio);
    });

    return () => {
      io.disconnect();
      wordObservers.forEach((w) => w.disconnect());
    };
  }, []);
}
