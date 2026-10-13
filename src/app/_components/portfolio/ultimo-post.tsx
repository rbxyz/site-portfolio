import Link from "next/link";

import type { BlogListItem } from "@/server/blog";
import { C, FONT } from "./tokens";

const reveal = (delay = 0) => ({
  opacity: 0,
  transform: "translateY(28px)",
  transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}s,transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
});

function fmtDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function UltimoPost({ post }: { post: BlogListItem }) {
  const date = fmtDate(post.publishedAt ?? post.createdAt);
  const ghost = (post.tags[0]?.name ?? post.title.split(/\s+/)[0] ?? "Blog")
    .toUpperCase()
    .slice(0, 6);

  return (
    <section
      id="blog"
      className="kp-section"
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 56,
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
              03 / Do blog
            </div>
            <h2
              data-reveal
              style={{
                ...reveal(0.08),
                font: `700 clamp(34px,5vw,72px)/.98 ${FONT.grotesk}`,
                letterSpacing: "-.035em",
              }}
            >
              Último artigo <span style={{ color: C.accent }}>publicado.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            data-reveal
            className="kp-hover"
            style={{
              ...reveal(0.15),
              font: `700 13px/1 ${FONT.mono}`,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: C.textSecondary,
              textDecoration: "none",
            }}
          >
            Ver todos os posts →
          </Link>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="kp-proj"
          data-reveal
          style={{
            ...reveal(),
            textDecoration: "none",
            color: "inherit",
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: 48,
            alignItems: "center",
            padding: "40px 0",
            borderTop: `1px solid ${C.border2}`,
            borderBottom: `1px solid ${C.border2}`,
          }}
        >
          {/* cover */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
              border: `1px solid ${C.border2}`,
              height: 380,
              background: C.brandDeep,
            }}
          >
            <div
              className="kp-proj-img"
              style={{
                position: "absolute",
                inset: 0,
                transition: "transform .7s cubic-bezier(.2,.7,.2,1)",
              }}
            >
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(120% 130% at 22% 18%, rgba(181,123,255,.32), rgba(49,16,92,0) 58%), linear-gradient(140deg,#3a1469,#160826)",
                  }}
                />
              )}
            </div>
            {!post.imageUrl && (
              <span
                style={{
                  position: "absolute",
                  right: 22,
                  bottom: 6,
                  fontFamily: FONT.anton,
                  fontSize: "clamp(80px,9vw,150px)",
                  lineHeight: 0.8,
                  color: "rgba(244,242,236,.09)",
                  letterSpacing: "-.02em",
                  pointerEvents: "none",
                }}
              >
                {ghost}
              </span>
            )}
            <span
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                font: `700 11px/1 ${FONT.mono}`,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: C.text,
                background: "rgba(31,31,31,.72)",
                backdropFilter: "blur(6px)",
                padding: "8px 12px",
                borderRadius: 3,
              }}
            >
              ● Novo
            </span>
          </div>

          {/* text */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                font: `700 12px/1 ${FONT.mono}`,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: C.textSecondary,
              }}
            >
              <span style={{ color: C.accent }}>{date}</span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.accent,
                }}
              />
              <span>{post.readMinutes} min de leitura</span>
            </div>
            <h3
              style={{
                font: `700 clamp(28px,3.2vw,46px)/1.05 ${FONT.grotesk}`,
                letterSpacing: "-.025em",
                margin: "22px 0 18px",
              }}
            >
              {post.title}
            </h3>
            <p
              style={{
                font: `400 17px/1.6 ${FONT.grotesk}`,
                color: C.textMuted,
                maxWidth: 480,
              }}
            >
              {post.excerpt}
            </p>
            {post.tags.length > 0 && (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}
              >
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
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
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
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
              Ler artigo →
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
