"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import { C, FONT } from "./tokens";
import type { Evento, EventoImagem } from "./eventos-data";

// three.js + rapier are heavy: load them only on the client, on demand.
const Lanyard = dynamic(() => import("@/app/_components/lanyard/lanyard"), {
  ssr: false,
});

const reveal = (delay = 0) => ({
  opacity: 0,
  transform: "translateY(28px)",
  transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}s,transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
});

export function Eventos({ eventos }: { eventos: Evento[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIndex = eventos.findIndex((ev) => ev.id === selectedId);
  const selected = selectedIndex >= 0 ? eventos[selectedIndex]! : null;

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
        else setSelectedId(null);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setSelectedId(null), []);

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
            Toque pra ver as fotos, arraste pra balançar.
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
          {mounted && (
            <Lanyard
              events={eventos}
              active={inView}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
          <AnimatePresence>
            {selected && (
              <EventoPainel
                key={selected.id}
                evento={selected}
                index={selectedIndex}
                onClose={close}
              />
            )}
          </AnimatePresence>
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
          }}
        >
          {eventos.map((ev) => {
            const isSelected = ev.id === selectedId;
            return (
              <li key={ev.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedId(isSelected ? null : ev.id);
                    stageRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                  }}
                  style={{
                    background: "none",
                    border: 0,
                    padding: "4px 0",
                    cursor: "pointer",
                    font: `700 12px/1.4 ${FONT.mono}`,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: isSelected ? C.text : ev.highlight ? C.accent : C.textSecondary,
                    borderBottom: `1px solid ${isSelected ? C.accent : "transparent"}`,
                  }}
                >
                  {ev.highlight ? "★ " : ""}
                  {ev.name}
                  {ev.edition ? ` · ${ev.edition}` : ""}
                  {ev.highlight ? ` · ${ev.role}` : ""}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Details of the selected badge, shown beside (desktop) or below (mobile) it. */
function EventoPainel({
  evento,
  index,
  onClose,
}: {
  evento: Evento;
  index: number;
  onClose: () => void;
}) {
  const images = evento.images ?? [];
  const [openImage, setOpenImage] = useState<number | null>(null);

  // Esc closes the panel, unless the lightbox is open (it handles Esc itself).
  useEffect(() => {
    if (openImage !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openImage, onClose]);

  const meta = [evento.edition, evento.year, evento.location].filter(Boolean);
  const paragraphs = (evento.description ?? "").split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <motion.aside
      className="kp-evento-panel"
      aria-label={`Detalhes do evento ${evento.name}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        background: "rgba(31,31,31,.9)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        overflowY: "auto",
        overscrollBehavior: "contain",
        padding: "clamp(20px, 3vw, 36px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: C.accent,
            paddingTop: 12,
          }}
        >
          Evento · {String(index + 1).padStart(2, "0")}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes"
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            border: `1px solid ${C.border3}`,
            background: "transparent",
            color: C.text,
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      <h3
        style={{
          font: `700 clamp(28px,3.4vw,46px)/1 ${FONT.grotesk}`,
          letterSpacing: "-.03em",
          margin: "14px 0 0",
        }}
      >
        {evento.name}
      </h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px 14px",
          marginTop: 14,
          font: `700 12px/1.4 ${FONT.mono}`,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: C.textSecondary,
        }}
      >
        <span
          style={{
            padding: "5px 10px",
            borderRadius: 4,
            ...(evento.highlight
              ? { background: C.accent, color: C.text }
              : { border: `1px solid ${C.border3}`, color: C.textMuted }),
          }}
        >
          {evento.highlight ? "★ " : ""}
          {evento.role}
        </span>
        {meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            font: `400 15px/1.65 ${FONT.grotesk}`,
            color: C.textMuted,
            margin: i === 0 ? "22px 0 0" : "12px 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {p}
        </p>
      ))}

      {evento.link && (
        <a
          href={evento.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 18,
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: C.accent,
            textDecoration: "none",
          }}
        >
          Ver mais <ArrowUpRight size={14} />
        </a>
      )}

      <div
        style={{
          marginTop: 26,
          paddingTop: 18,
          borderTop: `1px solid ${C.border2}`,
          font: `700 11px/1 ${FONT.mono}`,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: C.textSecondary,
        }}
      >
        Fotos{images.length > 0 ? ` · ${images.length}` : ""}
      </div>

      {images.length === 0 ? (
        <p style={{ font: `400 14px/1.5 ${FONT.mono}`, color: C.textFaint, margin: "14px 0 0" }}>
          Ainda sem fotos deste evento.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
            gap: 8,
            marginTop: 14,
          }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpenImage(i)}
              aria-label={`Abrir foto ${i + 1} de ${images.length}`}
              style={{
                padding: 0,
                border: `1px solid ${C.border2}`,
                borderRadius: 6,
                overflow: "hidden",
                background: C.border1,
                aspectRatio: "1",
                cursor: "zoom-in",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`${evento.name} — foto ${i + 1}`}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      {openImage !== null && (
        <Lightbox
          images={images}
          index={openImage}
          title={evento.name}
          onChange={setOpenImage}
          onClose={() => setOpenImage(null)}
        />
      )}
    </motion.aside>
  );
}

const lightboxButton = {
  width: 44,
  height: 44,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "1px solid rgba(244,242,236,.25)",
  background: "rgba(0,0,0,.5)",
  color: C.text,
  cursor: "pointer",
} as const;

/** Full-screen photo viewer. Portaled to <body> so it escapes the panel. */
function Lightbox({
  images,
  index,
  title,
  onChange,
  onClose,
}: {
  images: EventoImagem[];
  index: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const image = images[index]!;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index + 1) % count);
      else if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, count, onChange, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${title}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,.92)",
        display: "grid",
        placeItems: "center",
        padding: "64px 16px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={image.id}
        src={image.url}
        alt={`${title} — foto ${index + 1}`}
        width={image.width}
        height={image.height}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100dvh - 128px)",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          borderRadius: 6,
        }}
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar fotos"
        style={{ ...lightboxButton, position: "absolute", top: 12, right: 12 }}
      >
        <X size={20} />
      </button>

      {count > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".14em",
            color: C.text,
          }}
        >
          <button
            type="button"
            onClick={() => onChange((index - 1 + count) % count)}
            aria-label="Foto anterior"
            style={lightboxButton}
          >
            <ChevronLeft size={20} />
          </button>
          <span>
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => onChange((index + 1) % count)}
            aria-label="Próxima foto"
            style={lightboxButton}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
