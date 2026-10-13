"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { C, FONT } from "./tokens";
import { eventos } from "./eventos-data";

// three.js + rapier are heavy: load them only on the client, on demand.
const Lanyard = dynamic(() => import("@/app/_components/lanyard/lanyard"), {
  ssr: false,
});

const reveal = (delay = 0) => ({
  opacity: 0,
  transform: "translateY(28px)",
  transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}s,transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
});

export function Eventos() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  // Mount the canvas shortly before it scrolls into view and pause the
  // render loop / physics whenever it's off-screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        setInView(visible);
        if (visible) setMounted(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="eventos"
      className="kp-section"
      style={{
        position: "relative",
        background: C.bg,
        color: C.text,
        padding: "120px 4vw 80px",
        overflow: "hidden",
        borderTop: `1px solid ${C.border1}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "30%",
          width: "50vw",
          height: "50vh",
          background:
            "radial-gradient(circle, rgba(181,123,255,.1), transparent 65%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              data-reveal
              style={{
                ...reveal(),
                font: `700 13px/1 ${FONT.mono}`,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 24,
              }}
            >
              04 / Eventos
            </div>
            <h2
              data-reveal
              style={{
                ...reveal(0.08),
                font: `700 clamp(34px,5vw,72px)/.98 ${FONT.grotesk}`,
                letterSpacing: "-.035em",
              }}
            >
              Onde eu <span style={{ color: C.accent }}>marquei presença.</span>
            </h2>
          </div>
          <div
            data-reveal
            style={{
              ...reveal(0.15),
              font: `400 14px/1.5 ${FONT.mono}`,
              color: C.textSecondary,
              maxWidth: 300,
              textAlign: "right",
            }}
          >
            Um crachá por evento.
            <br />
            Arraste pra balançar.
          </div>
        </div>

        <div
          ref={stageRef}
          className="kp-lanyard-stage"
          style={{
            position: "relative",
            height: "min(78vh, 760px)",
            minHeight: 560,
            marginTop: 24,
            touchAction: "pan-y",
          }}
        >
          {mounted && <Lanyard events={eventos} active={inView} />}
        </div>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "20px 0 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 28px",
            borderTop: `1px solid ${C.border2}`,
            font: `700 12px/1.4 ${FONT.mono}`,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: C.textSecondary,
          }}
        >
          {eventos.map((ev) => (
            <li key={ev.id} style={ev.highlight ? { color: C.accent } : undefined}>
              {ev.highlight ? "★ " : ""}
              {ev.name}
              {ev.edition ? ` · ${ev.edition}` : ""}
              {ev.highlight ? ` · ${ev.role}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
