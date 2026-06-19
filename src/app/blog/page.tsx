import Link from "next/link";
import type { Metadata } from "next";

import { C, FONT } from "@/app/_components/portfolio/tokens";
import {
  listPublishedPosts,
  listTags,
  type BlogListItem,
} from "@/server/blog";

export const metadata: Metadata = {
  title: "Blog · Ruan Bueno",
  description: "Artigos sobre desenvolvimento, automação, IA e café.",
};

// Always reflect the latest published posts from the blog DB.
export const dynamic = "force-dynamic";

// Placeholder cover gradients (used when a post has no imageUrl), cycled by index.
const COVERS = [
  "radial-gradient(120% 130% at 22% 18%, rgba(181,123,255,.32), rgba(49,16,92,0) 58%), linear-gradient(140deg,#3a1469,#160826)",
  "radial-gradient(120% 130% at 82% 22%, rgba(122,53,201,.44), rgba(49,16,92,0) 60%), linear-gradient(140deg,#2a0e4f,#120620)",
  "radial-gradient(130% 130% at 50% 2%, rgba(139,92,246,.30), rgba(49,16,92,0) 62%), linear-gradient(140deg,#311060,#1a0a32)",
  "radial-gradient(120% 130% at 15% 84%, rgba(181,123,255,.28), rgba(49,16,92,0) 60%), linear-gradient(140deg,#250c48,#100520)",
  "radial-gradient(120% 130% at 78% 80%, rgba(122,53,201,.38), rgba(49,16,92,0) 60%), linear-gradient(140deg,#341266,#170828)",
  "radial-gradient(120% 130% at 40% 30%, rgba(181,123,255,.30), rgba(49,16,92,0) 58%), linear-gradient(140deg,#2d0f54,#140724)",
] as const;

function fmtDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function fmtViews(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

function ghostFor(p: BlogListItem) {
  const base = p.tags[0]?.name ?? p.title.split(/\s+/)[0] ?? "Blog";
  return base.toUpperCase().slice(0, 6);
}

/** Cover layer shared by the featured banner and the grid cards. */
function Cover({
  post,
  idx,
  variant,
}: {
  post: BlogListItem;
  idx: number;
  variant: "feat" | "card";
}) {
  const feat = variant === "feat";
  return (
    <>
      <div
        className={feat ? "b-feat-img" : "b-post-img"}
        style={{ position: "absolute", inset: 0, background: C.brandDeep }}
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
              background: COVERS[idx % COVERS.length],
            }}
          />
        )}
      </div>
      {!post.imageUrl && (
        <span
          style={{
            position: "absolute",
            right: feat ? 26 : 16,
            bottom: feat ? 8 : -8,
            fontFamily: FONT.anton,
            fontSize: feat ? "clamp(90px,11vw,180px)" : 84,
            lineHeight: 0.8,
            textTransform: "uppercase",
            color: feat ? "rgba(244,242,236,.09)" : "rgba(244,242,236,.08)",
            letterSpacing: "-.02em",
            pointerEvents: "none",
          }}
        >
          {ghostFor(post)}
        </span>
      )}
    </>
  );
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [all, tags] = await Promise.all([listPublishedPosts(), listTags()]);

  const active = tag ?? null;
  const showFeatured = !active && all.length > 0;
  const featured = all[0];
  const grid = active
    ? all.filter((p) => p.tags.some((t) => t.slug === active))
    : all.slice(1);
  const count = String(all.length).padStart(2, "0");
  const resultLabel = active
    ? `${grid.length} artigo${grid.length === 1 ? "" : "s"}`
    : "Todos os artigos";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: FONT.grotesk,
        overflowX: "hidden",
      }}
    >
      {/* top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 5vw",
          background: "rgba(31,31,31,.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border2}`,
        }}
      >
        <Link
          href="/"
          className="kp-hover"
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: C.textSecondary,
            textDecoration: "none",
          }}
        >
          ← Ruan Bueno
        </Link>
        <span
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".34em",
            textTransform: "uppercase",
            color: C.text,
          }}
        >
          Blog
        </span>
        <span style={{ color: C.accent, fontSize: 14 }}>✦</span>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 5vw 120px" }}>
        {/* hero */}
        <div
          className="b-up b-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 40,
            alignItems: "end",
            marginBottom: 72,
          }}
        >
          <div>
            <div
              style={{
                font: `700 13px/1 ${FONT.mono}`,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 22,
              }}
            >
              Notas &amp; ideias
            </div>
            <h1
              className="b-hero-h1"
              style={{
                fontFamily: FONT.anton,
                fontSize: "clamp(56px,9vw,128px)",
                lineHeight: 0.84,
                letterSpacing: "-.01em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Notas,
              <br />
              ideias &amp;
              <br />
              <span style={{ color: C.accent }}>café.</span>
            </h1>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p
              style={{
                font: `400 16px/1.65 ${FONT.grotesk}`,
                color: C.textMuted,
                margin: "0 0 22px",
                maxWidth: 340,
              }}
            >
              Onde eu escrevo sobre desenvolvimento, automação e IA — e o ritual de
              café que mantém tudo isso de pé.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                font: `700 12px/1 ${FONT.mono}`,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              <span
                style={{
                  fontFamily: FONT.anton,
                  fontSize: 34,
                  letterSpacing: 0,
                  color: C.text,
                  lineHeight: 1,
                }}
              >
                {count}
              </span>
              <span>artigos publicados</span>
            </div>
          </div>
        </div>

        {/* featured */}
        {showFeatured && featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="b-feat b-up-delay"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 0,
              marginBottom: 60,
              border: `1px solid ${C.border2}`,
              borderRadius: 20,
              overflow: "hidden",
              background: "rgba(255,255,255,.015)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                padding: "clamp(28px,4vw,52px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  font: `700 11px/1 ${FONT.mono}`,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: C.accent,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.accent,
                  }}
                />
                <span>✦ Em destaque</span>
              </div>
              <h2
                style={{
                  fontFamily: FONT.anton,
                  fontSize: "clamp(34px,3.6vw,58px)",
                  lineHeight: 0.96,
                  letterSpacing: "-.005em",
                  textTransform: "uppercase",
                  margin: "0 0 20px",
                }}
              >
                {featured.title}
              </h2>
              <p
                style={{
                  font: `400 17px/1.6 ${FONT.grotesk}`,
                  color: C.textMuted,
                  margin: "0 0 26px",
                  maxWidth: 480,
                }}
              >
                {featured.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 18,
                  font: `700 11px/1 ${FONT.mono}`,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: C.textFaint,
                  marginBottom: 30,
                }}
              >
                {featured.tags[0] && (
                  <span style={{ color: C.textMuted2 }}>{featured.tags[0].name}</span>
                )}
                <span>{fmtDate(featured.publishedAt ?? featured.createdAt)}</span>
                <span>{featured.readMinutes} min de leitura</span>
                <span>{fmtViews(featured.viewCount)} views</span>
              </div>
              <div
                className="b-feat-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  font: `700 13px/1 ${FONT.mono}`,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: C.accent,
                }}
              >
                Ler artigo <span>→</span>
              </div>
            </div>
            <div
              className="b-feat-cover"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: 380,
                background: C.brandDeep,
                borderLeft: `1px solid ${C.border2}`,
              }}
            >
              <Cover post={featured} idx={0} variant="feat" />
            </div>
          </Link>
        )}

        {/* filter row */}
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 18,
              marginBottom: 36,
              paddingBottom: 22,
              borderBottom: `1px solid ${C.border2}`,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              <TagChip label="Todos" href="/blog" active={!active} />
              {tags.map((t) => (
                <TagChip
                  key={t.slug}
                  label={t.name}
                  href={`/blog?tag=${t.slug}`}
                  active={active === t.slug}
                />
              ))}
            </div>
            <span
              style={{
                font: `700 11px/1 ${FONT.mono}`,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              {resultLabel}
            </span>
          </div>
        )}

        {/* grid */}
        {grid.length === 0 ? (
          <p
            style={{
              font: `400 16px/1.6 ${FONT.grotesk}`,
              color: C.textSecondary,
              padding: "40px 0",
            }}
          >
            Nenhum artigo com essa tag por aqui ainda. Volte em breve. ☕
          </p>
        ) : (
          <div
            className="b-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
              gap: 26,
            }}
          >
            {grid.map((p, i) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="b-post"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${C.border2}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.015)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "16 / 10",
                    background: C.brandDeep,
                  }}
                >
                  <Cover post={p} idx={i + 1} variant="card" />
                  {p.tags[0] && (
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: 14,
                        font: `700 10px/1 ${FONT.mono}`,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        padding: "7px 11px",
                        borderRadius: 999,
                        background: "rgba(26,10,50,.7)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        border: `1px solid ${C.border3}`,
                        color: C.text,
                      }}
                    >
                      {p.tags[0].name}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    padding: "22px 22px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      font: `700 10px/1 ${FONT.mono}`,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: C.textFaint,
                    }}
                  >
                    <span>{fmtDate(p.publishedAt ?? p.createdAt)}</span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: C.textFaint,
                      }}
                    />
                    <span>{fmtViews(p.viewCount)} views</span>
                  </div>
                  <h3
                    style={{
                      font: `700 22px/1.25 ${FONT.grotesk}`,
                      color: C.text,
                      margin: 0,
                      letterSpacing: "-.01em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      font: `400 14.5px/1.55 ${FONT.grotesk}`,
                      color: C.textSecondary,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {p.excerpt}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 6,
                      paddingTop: 16,
                      borderTop: `1px solid ${C.border2}`,
                    }}
                  >
                    <span
                      style={{
                        font: `700 10px/1 ${FONT.mono}`,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: C.textFaint,
                      }}
                    >
                      {p.readMinutes} min
                    </span>
                    <span
                      className="b-post-cta"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        font: `700 11px/1 ${FONT.mono}`,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: C.textSecondary,
                      }}
                    >
                      Ler <span className="b-post-arrow">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* closing strip */}
        <div
          style={{
            marginTop: 80,
            padding: "44px clamp(28px,4vw,56px)",
            border: `1px solid ${C.border2}`,
            borderRadius: 18,
            background:
              "linear-gradient(135deg, rgba(49,16,92,.45), rgba(255,255,255,.01))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                font: `700 12px/1 ${FONT.mono}`,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 14,
              }}
            >
              Bora trocar ideia?
            </div>
            <div
              style={{
                fontFamily: FONT.anton,
                fontSize: "clamp(26px,3vw,42px)",
                lineHeight: 0.96,
                textTransform: "uppercase",
              }}
            >
              Tem um projeto em mente?
            </div>
          </div>
          <Link
            href="/contato"
            className="b-chip"
            style={{
              font: `700 12px/1 ${FONT.mono}`,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              padding: "16px 26px",
              borderRadius: 999,
              textDecoration: "none",
              border: `1px solid ${C.accent}`,
              background: "rgba(139,92,246,.14)",
              color: C.text,
            }}
          >
            Falar comigo →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TagChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="b-chip"
      style={{
        font: `700 11px/1 ${FONT.mono}`,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        padding: "9px 15px",
        borderRadius: 999,
        textDecoration: "none",
        border: `1px solid ${active ? C.accent : C.border3}`,
        background: active ? "rgba(139,92,246,.16)" : "transparent",
        color: active ? C.text : C.textSecondary,
      }}
    >
      {label}
    </Link>
  );
}
