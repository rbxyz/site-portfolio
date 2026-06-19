import "server-only";

import { PrismaClient as BlogPrismaClient } from "@/generated/blog-client";

import { env } from "@/env";

/**
 * Connection string for the blog database. Prefer an explicit
 * `BLOG_DATABASE_URL` override, but by default reuse the Vercel-linked
 * `DATABASE_URL` (the Neon database provisioned for this project) so the blog
 * works both locally (`vercel env pull`) and in production with no extra config.
 */
const blogDatabaseUrl = env.BLOG_DATABASE_URL ?? process.env.DATABASE_URL;

/**
 * Prisma client for the blog tables (posts, tags, …). Read-only from the
 * portfolio's perspective — we never run migrations against it.
 *
 * Returns `null` when no database URL is available so the /blog pages degrade
 * gracefully instead of crashing the whole app.
 */
const createBlogClient = () =>
  new BlogPrismaClient({
    datasourceUrl: blogDatabaseUrl,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

const globalForBlog = globalThis as unknown as {
  blogDb: ReturnType<typeof createBlogClient> | undefined;
};

export const blogDb: BlogPrismaClient | null = blogDatabaseUrl
  ? (globalForBlog.blogDb ?? createBlogClient())
  : null;

if (env.NODE_ENV !== "production" && blogDb) globalForBlog.blogDb = blogDb;
