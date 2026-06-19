import "server-only";

import { blogDb } from "@/server/blog-db";

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  excerpt: string;
  readMinutes: number;
  authorName: string | null;
  tags: { name: string; slug: string; color: string | null }[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  authorName: string | null;
  tags: { name: string; slug: string; color: string | null }[];
};

/** Strip markdown syntax for a plain-text excerpt. */
function makeExcerpt(content: string, len = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*`_>~[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > len ? plain.slice(0, len).trimEnd() + "…" : plain;
}

/** Estimated reading time in minutes (~200 words/min), floored at 1. */
function readMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Published posts, newest first. Optionally filtered by tag slug.
 * Returns [] when the blog DB is unconfigured or unreachable.
 */
export async function listPublishedPosts(
  tagSlug?: string,
): Promise<BlogListItem[]> {
  if (!blogDb) return [];
  try {
    const posts = await blogDb.post.findMany({
      where: {
        published: true,
        ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        author: { select: { name: true } },
        tags: { include: { tag: { select: { name: true, slug: true, color: true } } } },
      },
    });
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      imageUrl: p.imageUrl,
      viewCount: p.viewCount,
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      excerpt: makeExcerpt(p.content),
      readMinutes: readMinutes(p.content),
      authorName: p.author?.name ?? null,
      tags: p.tags.map((t) => t.tag),
    }));
  } catch (err) {
    console.error("[blog] listPublishedPosts failed:", err);
    return [];
  }
}

/** A single published post by slug, or null if missing/unreachable. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!blogDb) return null;
  try {
    const p = await blogDb.post.findFirst({
      where: { slug, published: true },
      include: {
        author: { select: { name: true } },
        tags: { include: { tag: { select: { name: true, slug: true, color: true } } } },
      },
    });
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      imageUrl: p.imageUrl,
      viewCount: p.viewCount,
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      authorName: p.author?.name ?? null,
      tags: p.tags.map((t) => t.tag),
    };
  } catch (err) {
    console.error("[blog] getPostBySlug failed:", err);
    return null;
  }
}

/** Tags that have at least one published post. */
export async function listTags(): Promise<
  { name: string; slug: string; color: string | null }[]
> {
  if (!blogDb) return [];
  try {
    const tags = await blogDb.tag.findMany({
      where: { posts: { some: { post: { published: true } } } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true, color: true },
    });
    return tags;
  } catch (err) {
    console.error("[blog] listTags failed:", err);
    return [];
  }
}

/**
 * Best-effort view increment. Deduped per browser session via the post_views
 * unique (postId, sessionId) constraint. Never throws.
 */
export async function recordView(postId: string, sessionId: string): Promise<void> {
  if (!blogDb || !sessionId) return;
  try {
    await blogDb.postView.create({ data: { postId, sessionId } });
    await blogDb.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Unique-constraint violation = already viewed this session; ignore.
  }
}
