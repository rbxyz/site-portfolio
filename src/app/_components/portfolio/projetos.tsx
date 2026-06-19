"use client";

import { C, FONT } from "./tokens";

type Project = {
  n: string;
  meta: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  cta: string;
  imageLeft: boolean;
  lastRow?: boolean;
};

const projects: Project[] = [
  {
    n: "01",
    meta: "Em evolução · 2025 · SaaS",
    title: "MarcaAI",
    description:
      "Plataforma SaaS para prestadores de serviço: integra Google Agenda + WhatsApp + IA para atendimento e agendamento 100% automáticos.",
    tags: ["Next.js", "TypeScript", "Drizzle", "IA"],
    href: "https://marcaaii.vercel.app/",
    cta: "Visitar projeto →",
    imageLeft: false,
  },
  {
    n: "02",
    meta: "Shipped · 2023 · SaaS",
    title: "AllProtect",
    description:
      "Segurança digital com proteção em tempo real contra estelionato e fraudes online — alertas inteligentes e dashboard administrativo.",
    tags: ["Java", "Spring Boot", "Firebase"],
    href: "#",
    cta: "Ver case →",
    imageLeft: true,
  },
  {
    n: "03",
    meta: "Shipped · 2025 · SaaS",
    title: "Ethos",
    description:
      "Gestão pessoal de ponta a ponta: projetos, orçamentos, CRM e precificador por valor/projeto reunidos num só sistema.",
    tags: ["Next.js", "Prisma", "TypeScript"],
    href: "https://ethos-theta.vercel.app/",
    cta: "Visitar projeto →",
    imageLeft: false,
    lastRow: true,
  },
];

export function Projetos() {
  return (
    <section
      id="projetos"
      style={{
        position: "relative",
        background: C.bg,
        color: C.text,
        padding: "120px 4vw 130px",
        overflow: "hidden",
        borderTop: `1px solid ${C.border1}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 64,
          }}
        >
          <div>
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
                marginBottom: 24,
              }}
            >
              02 / Projetos em destaque
            </div>
            <h2
              data-reveal
              style={{
                opacity: 0,
                transform: "translateY(28px)",
                transition:
                  "opacity .8s cubic-bezier(.2,.7,.2,1) .08s,transform .8s cubic-bezier(.2,.7,.2,1) .08s",
                font: `700 clamp(34px,5vw,72px)/.98 ${FONT.grotesk}`,
                letterSpacing: "-.035em",
              }}
            >
              Negócios que viraram{" "}
              <span style={{ color: C.accent }}>software.</span>
            </h2>
          </div>
          <div
            data-reveal
            style={{
              opacity: 0,
              transform: "translateY(28px)",
              transition:
                "opacity .8s cubic-bezier(.2,.7,.2,1) .15s,transform .8s cubic-bezier(.2,.7,.2,1) .15s",
              font: `400 14px/1.5 ${FONT.mono}`,
              color: C.textSecondary,
              maxWidth: 300,
              textAlign: "right",
            }}
          >
            Selecionados de 20+ entregas.
            <br />
            Passe o mouse pra prévia.
          </div>
        </div>

        {projects.map((p) => (
          <ProjectRow key={p.n} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project: p }: { project: Project }) {
  const isExternal = p.href.startsWith("http");
  const text = (
    <div style={{ order: p.imageLeft ? 2 : 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          font: `700 12px/1 ${FONT.mono}`,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: C.textSecondary,
        }}
      >
        <span style={{ color: C.accent }}>{p.n}</span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.accent,
          }}
        />
        <span>{p.meta}</span>
      </div>
      <h3
        style={{
          fontFamily: FONT.anton,
          fontSize: "clamp(40px,4.6vw,76px)",
          lineHeight: 0.92,
          textTransform: "uppercase",
          letterSpacing: "-.01em",
          margin: "22px 0 18px",
        }}
      >
        {p.title}
      </h3>
      <p
        style={{
          font: `400 17px/1.6 ${FONT.grotesk}`,
          color: C.textMuted,
          maxWidth: 440,
        }}
      >
        {p.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
        {p.tags.map((tag) => (
          <span
            key={tag}
            style={{
              font: `700 11px/1 ${FONT.mono}`,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: C.textMuted2,
              border: `1px solid ${C.border3}`,
              padding: "8px 12px",
              borderRadius: 3,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="kp-proj-cta"
        style={{
          opacity: 0,
          transform: "translateX(-8px)",
          transition: "opacity .4s,transform .4s",
          marginTop: 28,
          font: `700 13px/1 ${FONT.mono}`,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: C.accent,
        }}
      >
        {p.cta}
      </div>
    </div>
  );

  const preview = (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        border: `1px solid ${C.border2}`,
        order: p.imageLeft ? 1 : 2,
      }}
    >
      <div
        className="kp-proj-img"
        style={{ transition: "transform .7s cubic-bezier(.2,.7,.2,1)" }}
      >
        <PreviewPlaceholder title={p.title} />
      </div>
    </div>
  );

  return (
    <a
      href={p.href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="kp-proj"
      data-reveal
      style={{
        opacity: 0,
        transform: "translateY(36px)",
        transition:
          "opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)",
        textDecoration: "none",
        color: "inherit",
        display: "grid",
        gridTemplateColumns: p.imageLeft ? "1.15fr 1fr" : "1fr 1.15fr",
        gap: 48,
        alignItems: "center",
        padding: "40px 0",
        borderTop: `1px solid ${C.border2}`,
        borderBottom: p.lastRow ? `1px solid ${C.border2}` : undefined,
      }}
    >
      {text}
      {preview}
    </a>
  );
}

// Placeholder preview — swap for a real screenshot (<img>) at ~16:10.
function PreviewPlaceholder({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 30% 20%, rgba(181,123,255,.16), transparent 60%), ${C.brandDeep}`,
      }}
    >
      <span
        style={{
          fontFamily: FONT.anton,
          fontSize: "clamp(28px,3vw,48px)",
          textTransform: "uppercase",
          letterSpacing: ".02em",
          color: "rgba(244,242,236,.18)",
        }}
      >
        {title}
      </span>
    </div>
  );
}
