"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { C, FONT } from "./tokens";

/** Headline split into lines/segments so the typewriter can fill it in order
 *  while preserving the per-segment color/stroke styling. */
const bigLine: React.CSSProperties = {
  fontFamily: FONT.anton,
  fontSize: "clamp(64px,10vw,148px)",
  lineHeight: 0.82,
  letterSpacing: "-.01em",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "flex-end",
  minHeight: "calc(clamp(64px,10vw,148px) * 0.82)",
};
const midLine: React.CSSProperties = {
  fontFamily: FONT.anton,
  fontSize: "clamp(40px,6vw,90px)",
  lineHeight: 0.9,
  letterSpacing: "-.01em",
  textTransform: "uppercase",
  marginTop: 6,
  display: "flex",
  alignItems: "flex-end",
  minHeight: "calc(clamp(40px,6vw,90px) * 0.9)",
};

const headlineLines: {
  lineStyle: React.CSSProperties;
  segments: { text: string; style?: React.CSSProperties }[];
}[] = [
  { lineStyle: bigLine, segments: [{ text: "Traduzo" }] },
  { lineStyle: bigLine, segments: [{ text: "Negócios", style: { color: C.accent } }] },
  {
    lineStyle: midLine,
    segments: [
      { text: "em " },
      {
        text: "software",
        style: { color: "transparent", WebkitTextStroke: `1.5px ${C.strokeWord}` },
      },
      { text: ".", style: { color: C.accent } },
    ],
  },
];

const TOTAL_CHARS = headlineLines.reduce(
  (sum, l) => sum + l.segments.reduce((s, seg) => s + seg.text.length, 0),
  0,
);

const TYPE_MS = 78; // per char while typing in
const ERASE_MS = 38; // per char while typing out
const HOLD_FULL_MS = 2000; // pause at full phrase
const HOLD_EMPTY_MS = 550; // pause before retyping

function TypingHeadline() {
  // start fully typed so SSR/no-JS shows the complete phrase
  const [count, setCount] = useState(TOTAL_CHARS);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    let n = TOTAL_CHARS;
    let erasing = true;

    const tick = () => {
      if (erasing) {
        if (n > 0) {
          n -= 1;
          setCount(n);
          timer.current = setTimeout(tick, ERASE_MS);
        } else {
          erasing = false;
          timer.current = setTimeout(tick, HOLD_EMPTY_MS);
        }
      } else {
        if (n < TOTAL_CHARS) {
          n += 1;
          setCount(n);
          timer.current = setTimeout(tick, TYPE_MS);
        } else {
          erasing = true;
          timer.current = setTimeout(tick, HOLD_FULL_MS);
        }
      }
    };

    timer.current = setTimeout(tick, HOLD_FULL_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // figure out which line currently holds the caret
  let cumEnd = 0;
  const lineEnds = headlineLines.map((l) => {
    cumEnd += l.segments.reduce((s, seg) => s + seg.text.length, 0);
    return cumEnd;
  });
  let caretLine = lineEnds.findIndex((end) => count <= end);
  if (caretLine === -1) caretLine = headlineLines.length - 1;

  let remaining = count;
  return (
    <>
      {headlineLines.map((line, li) => (
        <div key={li} style={line.lineStyle}>
          {line.segments.map((seg, si) => {
            const take = Math.min(seg.text.length, Math.max(0, remaining));
            remaining -= seg.text.length;
            return <span key={si} style={seg.style}>{seg.text.slice(0, take)}</span>;
          })}
          {li === caretLine && <span className="kp-caret" aria-hidden="true" />}
        </div>
      ))}
    </>
  );
}

const marqueeItems = [
  "Projetos sob medida",
  "20+ projetos",
  "MarcaAI · AllProtect · Ethos",
  "TypeScript · PostgreSQL · n8n · Power BI",
];

function MarqueeGroup({ gi }: { gi: number }) {
  return (
    <>
      {marqueeItems.map((item, i) => (
        <span key={`${gi}-${i}`} style={{ display: "flex", alignItems: "center" }}>
          <span style={{ padding: "0 22px" }}>{item}</span>
          <span>✦</span>
        </span>
      ))}
    </>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const optionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 6,
    border: `1px solid ${C.border3}`,
    background: "rgba(255,255,255,.02)",
    color: C.text,
    textDecoration: "none",
    font: `700 14px/1 ${FONT.mono}`,
    letterSpacing: ".04em",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contato"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: C.bg,
          border: `1px solid ${C.border3}`,
          borderRadius: 12,
          padding: "34px 30px 30px",
          boxShadow: "0 24px 70px rgba(0,0,0,.55)",
          fontFamily: FONT.grotesk,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="kp-hover"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: C.textSecondary,
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <div
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 12,
          }}
        >
          Contato
        </div>
        <h3
          style={{
            font: `700 26px/1.1 ${FONT.grotesk}`,
            color: C.text,
            margin: "0 0 22px",
          }}
        >
          Vamos conversar
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a
            href="https://wa.me/5551997365697"
            target="_blank"
            rel="noopener noreferrer"
            className="kp-hover"
            style={optionStyle}
          >
            <MessageCircle size={20} strokeWidth={2} color={C.accent} />
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span>WhatsApp</span>
              <span
                style={{
                  font: `400 12px/1 ${FONT.mono}`,
                  color: C.textSecondary,
                  letterSpacing: ".02em",
                }}
              >
                +55 51 99736-5697
              </span>
            </span>
          </a>
          <a
            href="mailto:comercial@allpines.com.br"
            className="kp-hover"
            style={optionStyle}
          >
            <Mail size={20} strokeWidth={2} color={C.accent} />
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span>Email</span>
              <span
                style={{
                  font: `400 12px/1 ${FONT.mono}`,
                  color: C.textSecondary,
                  letterSpacing: ".02em",
                }}
              >
                comercial@allpines.com.br
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <div
      id="kp-root"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        overflow: "hidden",
        fontFamily: FONT.grotesk,
      }}
    >
      {/* accent grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(181,123,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(181,123,255,.04) 1px,transparent 1px)",
          backgroundSize: "70px 70px",
          zIndex: 1,
        }}
      />

      {/* PHOTO (right) — circular frame, reduced scale */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "40%",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "clamp(280px, 30vw, 480px)",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,.45)",
            marginRight: "8vw",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Foto_Perfil.jpeg"
            alt="Ruan Bueno"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "0% 65%",
              transform: "scale(1.55) translateX(2%)",
              transformOrigin: "50% 50%",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 28,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            font: `700 11px/1 ${FONT.mono}`,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: C.textFaint,
          }}
        >
          Ruan Bueno · Santa Cruz do Sul BR
        </div>
      </div>

      {/* glow behind photo */}
      <div
        className="kp-glow"
        style={{
          position: "absolute",
          right: "18%",
          top: "30%",
          width: "38vw",
          maxWidth: 560,
          height: "60vh",
          zIndex: 2,
          background:
            "radial-gradient(ellipse 56% 50% at 50% 40%, rgba(181,123,255,.32), transparent 66%)",
          filter: "blur(14px)",
          pointerEvents: "none",
        }}
      />

      {/* NAV */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "30px 4vw",
        }}
      >
        <span style={{ font: `700 16px/1 ${FONT.mono}`, letterSpacing: ".1em" }}>
          RUAN BUENO<span style={{ color: C.accent }}>.</span>
        </span>
        <span
          style={{
            display: "flex",
            gap: 34,
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".16em",
            textTransform: "uppercase",
          }}
        >
          <a href="#sobre" className="kp-hover" style={{ color: "inherit", textDecoration: "none" }}>
            Sobre
          </a>
          <a href="#projetos" className="kp-hover" style={{ color: "inherit", textDecoration: "none" }}>
            Projetos
          </a>
          <Link href="/blog" className="kp-hover" style={{ color: "inherit", textDecoration: "none" }}>
            Blog
          </Link>
          <span className="kp-hover" style={{ color: C.accent }}>
            ● Disponível
          </span>
        </span>
      </div>

      {/* GIANT TYPE (left) */}
      <div
        style={{
          position: "absolute",
          left: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 6,
        }}
      >
        <div
          style={{
            font: `700 13px/1 ${FONT.mono}`,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 26,
          }}
        >
          Dev · Café · Automação &amp; IA
        </div>
        <TypingHeadline />
        <p
          style={{
            font: `400 17px/1.5 ${FONT.grotesk}`,
            color: C.textMuted2,
            maxWidth: 440,
            marginTop: 30,
          }}
        >
          Traduzo negócios e problemas em soluções escaláveis e robustas. Você
          traz o problema — eu devolvo o software.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
          <a
            href="#projetos"
            className="kp-hover"
            style={{
              background: C.brandDeep,
              color: C.text,
              padding: "15px 26px",
              borderRadius: 4,
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Ver projetos →
          </a>
          <Link
            href="/blog"
            className="kp-hover"
            style={{
              border: `1px solid ${C.accent}`,
              background: "rgba(139,92,246,.12)",
              color: C.text,
              padding: "15px 26px",
              borderRadius: 4,
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Acessar meu blog →
          </Link>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="kp-hover"
            style={{
              border: `1px solid ${C.border3}`,
              background: "transparent",
              color: "#e6e6e0",
              padding: "15px 26px",
              borderRadius: 4,
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Contatar
          </button>
        </div>
      </div>

      {/* spinning badge */}
      <div
        style={{
          position: "absolute",
          top: "14vh",
          right: "6vw",
          zIndex: 7,
          width: 120,
          height: 120,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="kp-spin"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <path
              id="kpcirc"
              d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            />
          </defs>
          <text
            style={{
              font: `700 15px ${FONT.mono}`,
              letterSpacing: "6px",
              fill: C.text,
              textTransform: "uppercase",
            }}
          >
            <textPath href="#kpcirc">
              FULL-STACK · IA · GROWTH · CAFÉ ·{" "}
            </textPath>
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.accent,
            fontSize: 22,
          }}
        >
          ✦
        </div>
      </div>

      {/* vertical edge label */}
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 120,
          zIndex: 7,
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          font: `700 11px/1 ${FONT.mono}`,
          letterSpacing: ".26em",
          textTransform: "uppercase",
          color: C.textFaint,
        }}
      >
        v.2026 · RS · ● all systems nominal
      </div>

      {/* bottom marquee */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          zIndex: 8,
          background: C.brandDeep,
          color: C.text,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="kp-marq"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            fontFamily: FONT.anton,
            fontSize: 24,
            letterSpacing: ".03em",
            textTransform: "uppercase",
          }}
        >
          {/* track = two identical halves; -50% shifts exactly one half.
              each half = 2 groups so it always exceeds the viewport width,
              preventing the empty gap after the last item. */}
          <MarqueeGroup gi={0} />
          <MarqueeGroup gi={1} />
          <MarqueeGroup gi={2} />
          <MarqueeGroup gi={3} />
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
