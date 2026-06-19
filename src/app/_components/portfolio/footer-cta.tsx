"use client";

import { C, FONT } from "./tokens";

const EMAIL = "rbcr4z1@gmail.com";

export function FooterCta() {
  return (
    <section
      id="contato"
      className="kp-footer"
      style={{
        position: "relative",
        background: C.bg,
        color: C.text,
        padding: "130px 4vw 0",
        overflow: "hidden",
        borderTop: `1px solid ${C.border1}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
          width: "70vw",
          height: "50vh",
          background:
            "radial-gradient(circle, rgba(181,123,255,.16), transparent 64%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(28px)",
            transition:
              "opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)",
            font: `700 13px/1 ${FONT.mono}`,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 34,
          }}
        >
          03 / Contato
        </div>
        <h2
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(28px)",
            transition:
              "opacity .9s cubic-bezier(.2,.7,.2,1) .06s,transform .9s cubic-bezier(.2,.7,.2,1) .06s",
            font: `700 clamp(34px,6vw,96px)/.96 ${FONT.grotesk}`,
            letterSpacing: "-.04em",
          }}
        >
          Tem um problema?
          <br />
          Vamos fazer virar <span style={{ color: C.accent }}>software.</span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="kp-maillink"
          style={{
            display: "inline-block",
            marginTop: 48,
            fontFamily: FONT.anton,
            fontSize: "clamp(24px,3.4vw,52px)",
            textTransform: "uppercase",
            color: C.text,
            textDecoration: "none",
            borderBottom: `3px solid ${C.accent}`,
            paddingBottom: 6,
            transition: "color .3s",
          }}
        >
          {EMAIL}
        </a>
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(28px)",
            transition:
              "opacity .8s cubic-bezier(.2,.7,.2,1) .12s,transform .8s cubic-bezier(.2,.7,.2,1) .12s",
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginTop: 52,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://linkedin.com/in/rbxyz"
            className="kp-hover"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: `1px solid ${C.border3}`,
              color: "#e6e6e0",
              padding: "16px 30px",
              borderRadius: 4,
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/rbxyz"
            className="kp-hover"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: `1px solid ${C.border3}`,
              color: "#e6e6e0",
              padding: "16px 30px",
              borderRadius: 4,
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* giant outline name */}
      <div
        style={{
          marginTop: 90,
          overflow: "hidden",
          lineHeight: 0.8,
          textAlign: "center",
        }}
      >
        <div
          className="kp-footer-name"
          style={{
            fontFamily: FONT.anton,
            fontSize: "clamp(80px,17vw,260px)",
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: `1.5px ${C.strokeName}`,
            letterSpacing: "-.01em",
            userSelect: "none",
          }}
        >
          Ruan Bueno
        </div>
      </div>

      {/* bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "28px 0 34px",
          borderTop: `1px solid ${C.border1}`,
          font: `700 11px/1 ${FONT.mono}`,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: C.textFaint,
        }}
      >
        <span>
          © 2026 Ruan Bueno · Santa Cruz do Sul, BR ·{" "}
          <a
            href="/login"
            className="kp-hover"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Login
          </a>
        </span>
        <span style={{ color: C.accent }}>● All systems nominal</span>
        <span>Dev · Café · Automação &amp; IA</span>
      </div>
    </section>
  );
}
