import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { C, FONT } from "@/app/_components/portfolio/tokens";
import { getPostBySlug } from "@/server/blog";
import { Markdown } from "@/app/blog/_components/markdown";
import { ViewTracker } from "@/app/blog/_components/view-tracker";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado · Blog" };
  const description = post.content
    .replace(/[#*`_>~[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return {
    title: `${post.title} · Blog · Ruan Bueno`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readMins = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: FONT.grotesk,
      }}
    >
      <ViewTracker postId={post.id} />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5vw 110px" }}>
        <Link
          href="/blog"
          className="kp-hover"
          style={{
            font: `700 12px/1 ${FONT.mono}`,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: C.textSecondary,
            textDecoration: "none",
          }}
        >
          ← Todos os posts
        </Link>

        <div style={{ marginTop: 36 }}>
          {post.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {post.tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog?tag=${t.slug}`}
                  className="kp-hover"
                  style={{
                    font: `700 10px/1 ${FONT.mono}`,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: `1px solid ${C.border3}`,
                    color: t.color ?? C.textMuted2,
                    textDecoration: "none",
                  }}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}

          <h1
            style={{
              fontFamily: FONT.grotesk,
              fontWeight: 700,
              fontSize: "clamp(32px,5vw,52px)",
              lineHeight: 1.1,
              letterSpacing: "-.01em",
              margin: "0 0 18px",
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              font: `700 12px/1 ${FONT.mono}`,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: C.textFaint,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 30,
            }}
          >
            {post.authorName && <span>{post.authorName}</span>}
            <span>{fmtDate(post.publishedAt ?? post.createdAt)}</span>
            <span>· {readMins} min de leitura</span>
            <span>· {post.viewCount} views</span>
          </div>
        </div>

        {post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{
              width: "100%",
              borderRadius: 14,
              marginBottom: 40,
              border: `1px solid ${C.border2}`,
            }}
          />
        )}

        <Markdown>{post.content}</Markdown>
      </article>
    </div>
  );
}
