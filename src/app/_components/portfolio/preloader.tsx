"use client";

import { useEffect, useRef, useState } from "react";
import { C, FONT } from "./tokens";

export function Preloader() {
  const [count, setCount] = useState(0);
  const [phraseIn, setPhraseIn] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion:reduce)",
    ).matches;

    const hide = () => {
      setExiting(true);
      window.setTimeout(() => setHidden(true), 750);
    };

    if (reduce) {
      setCount(100);
      hide();
      return;
    }

    const phraseTimer = window.setTimeout(() => setPhraseIn(true), 350);

    const dur = 1500;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = p < 1 ? 1 - Math.pow(1 - p, 3) : 1; // easeOutCubic
      setCount(Math.round(eased * 100));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        window.setTimeout(hide, 260);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.clearTimeout(phraseTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(-100%)" : "none",
        transition:
          "opacity .6s ease, transform .7s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div
        style={{
          font: `700 12px/1 ${FONT.mono}`,
          letterSpacing: ".3em",
          textTransform: "uppercase",
          color: C.accent,
        }}
      >
        Ruan Bueno · Portfólio
      </div>
      <div
        style={{
          fontFamily: FONT.anton,
          fontSize: "clamp(40px,7vw,104px)",
          lineHeight: 0.9,
          textTransform: "uppercase",
          color: C.text,
          textAlign: "center",
          opacity: phraseIn ? 1 : 0,
          transition: "opacity .5s",
        }}
      >
        Negócios → Software
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 46,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 4vw",
        }}
      >
        <span
          style={{
            fontFamily: FONT.anton,
            fontSize: "clamp(48px,9vw,120px)",
            lineHeight: 0.8,
            color: C.accent,
          }}
        >
          {String(count).padStart(3, "0")}
        </span>
        <span
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: C.textFaint,
          }}
        >
          Carregando experiência
        </span>
      </div>
    </div>
  );
}
