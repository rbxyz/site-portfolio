"use client";

import { C, FONT } from "./tokens";

const revealBase = {
  opacity: 0,
  transform: "translateY(28px)",
} as const;

const headlineWords: { text: string; accent?: boolean }[] = [
  { text: "Entendo" },
  { text: "do" },
  { text: "seu" },
  { text: "negócio.", accent: true },
  { text: "Pego" },
  { text: "qualquer" },
  { text: "problema" },
  { text: "e" },
  { text: "faço" },
  { text: "virar" },
  { text: "software.", accent: true },
];

const stack: { n: string; name: string; tag?: string }[] = [
  { n: "01", name: "TypeScript", tag: "linguagem base" },
  { n: "02", name: "PostgreSQL/MSSQL", tag: "dados" },
  { n: "03", name: "Automação", tag: "n8n" },
  { n: "04", name: "BI & Dados", tag: "Power BI · SQL · Fabric" },
  { n: "05", name: "Arquitetura de sistemas" },
];

export function Sobre() {
  return (
    <section
      id="sobre"
      style={{
        position: "relative",
        background: C.bg,
        color: C.text,
        padding: "140px 4vw 120px",
        overflow: "hidden",
        borderTop: `1px solid ${C.border1}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "20%",
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
          data-reveal
          style={{
            ...revealBase,
            transition:
              "opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)",
            font: `700 13px/1 ${FONT.mono}`,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 40,
          }}
        >
          01 / Sobre
        </div>
        <h2
          style={{
            font: `700 clamp(30px,4.4vw,62px)/1.06 ${FONT.grotesk}`,
            letterSpacing: "-.03em",
            maxWidth: 1080,
          }}
        >
          {headlineWords.map((w, i) => (
            <span
              key={i}
              data-word
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity .6s,transform .6s",
                ...(w.accent ? { color: C.accent } : {}),
              }}
            >
              {w.text}&nbsp;
            </span>
          ))}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            marginTop: 72,
            alignItems: "start",
          }}
        >
          {/* left: paragraphs + stats */}
          <div
            data-reveal
            style={{
              ...revealBase,
              transition:
                "opacity .8s cubic-bezier(.2,.7,.2,1) .1s,transform .8s cubic-bezier(.2,.7,.2,1) .1s",
            }}
          >
            <p
              style={{
                font: `400 19px/1.65 ${FONT.grotesk}`,
                color: C.textMuted,
              }}
            >
              Sou desenvolvedor full-stack com cabeça de produto. Mais do que
              escrever código, eu desenho a solução: entro no problema do
              negócio, mapeio o processo e devolvo um sistema escalável e
              personalizado!
            </p>
            <p
              style={{
                font: `400 19px/1.65 ${FONT.grotesk}`,
                color: C.textSecondary,
                marginTop: 22,
              }}
            >
              Do MVP ao deploy, passando por automação, dados e integração.
            </p>
            <div style={{ display: "flex", gap: 48, marginTop: 48 }}>
              <Stat
                value="20+"
                valueColor={C.accent}
                label={["Projetos", "entregues"]}
              />
              <Stat
                value="04"
                valueColor={C.text}
                label={["Anos de", "experiência"]}
              />
              <Stat
                value="∞"
                valueColor={C.text}
                label={["Xícaras", "de café"]}
              />
            </div>
          </div>

          {/* right: numbered stack list */}
          <div
            data-reveal
            style={{
              ...revealBase,
              transition:
                "opacity .8s cubic-bezier(.2,.7,.2,1) .2s,transform .8s cubic-bezier(.2,.7,.2,1) .2s",
            }}
          >
            <div
              style={{
                font: `700 12px/1 ${FONT.mono}`,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: C.textSecondary,
                marginBottom: 8,
              }}
            >
              Stack &amp; competências
            </div>
            {stack.map((row, i) => (
              <div
                key={row.n}
                className="kp-stack"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  padding: "20px 8px",
                  borderTop: i === 0 ? `1px solid ${C.border2}` : undefined,
                  borderBottom: `1px solid ${C.border2}`,
                }}
              >
                <span
                  style={{ font: `700 12px/1 ${FONT.mono}`, color: C.accent }}
                >
                  {row.n}
                </span>
                <span style={{ font: `600 22px/1 ${FONT.grotesk}` }}>
                  {row.name}
                </span>
                {row.tag && (
                  <span
                    style={{
                      font: `400 13px/1 ${FONT.mono}`,
                      color: C.textSecondary,
                      marginLeft: "auto",
                    }}
                  >
                    {row.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  valueColor,
  label,
}: {
  value: string;
  valueColor: string;
  label: [string, string];
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: FONT.anton,
          fontSize: 54,
          color: valueColor,
          lineHeight: 0.9,
        }}
      >
        {value}
      </div>
      <div
        style={{
          font: `700 11px/1.4 ${FONT.mono}`,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: C.textSecondary,
          marginTop: 10,
        }}
      >
        {label[0]}
        <br />
        {label[1]}
      </div>
    </div>
  );
}
