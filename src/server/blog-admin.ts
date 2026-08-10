import "server-only";

import { blogDb } from "@/server/blog-db";

/**
 * Camada de ESCRITA do blog, usada apenas pelo dashboard autenticado.
 *
 * O schema em `prisma/blog/schema.prisma` é de propriedade do projeto /dev/blog
 * — nunca rodamos `migrate` contra ele. Aqui só fazemos CRUD nas linhas de
 * `posts` / `tags` / `post_tags`, sem tocar na estrutura.
 */

export type BlogAdminPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorName: string | null;
  tags: string[];
};

export type BlogPostInput = {
  title: string;
  content: string;
  slug?: string | null;
  imageUrl?: string | null;
  published?: boolean;
  tags?: string[];
};

/** Erro esperado (banco indisponível, autor inexistente, slug duplicado…). */
export class BlogAdminError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "BlogAdminError";
  }
}

/** Garante que o client do blog existe, ou lança 503. */
function requireDb() {
  if (!blogDb) {
    throw new BlogAdminError(
      "Banco do blog não configurado (defina BLOG_DATABASE_URL).",
      503,
    );
  }
  return blogDb;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Acrescenta `-2`, `-3`… enquanto o slug já existir em outro post. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const db = requireDb();
  const root = base || "post";
  let candidate = root;
  let n = 1;

  for (;;) {
    const clash = await db.post.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!clash) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

/**
 * Descobre qual usuário do banco do BLOG será o autor do post.
 *
 * O login do portfólio usa outro banco, então casamos pelo e-mail; se não
 * houver correspondência, caímos no primeiro ADMIN e depois em qualquer autor.
 */
async function resolveAuthorId(email?: string | null): Promise<string> {
  const db = requireDb();

  if (email) {
    const byEmail = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (byEmail) return byEmail.id;
  }

  const admin = await db.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (admin) return admin.id;

  const anyUser = await db.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (anyUser) return anyUser.id;

  throw new BlogAdminError(
    "Nenhum usuário no banco do blog para usar como autor do post.",
  );
}

/** Cria/reaproveita as tags pelos nomes e devolve os ids. */
async function upsertTags(names: string[]): Promise<string[]> {
  const db = requireDb();
  const ids: string[] = [];

  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    const slug = slugify(name);
    if (!slug) continue;

    const tag = await db.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
      select: { id: true },
    });
    ids.push(tag.id);
  }

  return ids;
}

/** Reescreve os vínculos post↔tag para exatamente `names`. */
async function syncTags(postId: string, names: string[]): Promise<void> {
  const db = requireDb();
  const tagIds = await upsertTags(names);

  await db.postTag.deleteMany({ where: { postId } });
  if (tagIds.length > 0) {
    await db.postTag.createMany({
      data: tagIds.map((tagId) => ({ postId, tagId })),
      skipDuplicates: true,
    });
  }
}

type PostRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: { name: string | null } | null;
  tags: { tag: { name: string } }[];
};

function toAdminPost(p: PostRow): BlogAdminPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    imageUrl: p.imageUrl,
    published: p.published,
    viewCount: p.viewCount,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    authorName: p.author?.name ?? null,
    tags: p.tags.map((t) => t.tag.name),
  };
}

const postInclude = {
  author: { select: { name: true } },
  tags: { include: { tag: { select: { name: true } } } },
} as const;

/**
 * Todos os posts (inclusive rascunhos), do publicado mais recente para o mais
 * antigo. Rascunhos não têm `publishedAt`, então vão para o fim (`nulls: last`)
 * e se ordenam entre si pela data de criação.
 */
export async function listAllPosts(): Promise<BlogAdminPost[]> {
  const db = requireDb();
  const posts = await db.post.findMany({
    orderBy: [
      { publishedAt: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    include: postInclude,
  });
  return posts.map(toAdminPost);
}

export async function createPost(
  input: BlogPostInput,
  authorEmail?: string | null,
): Promise<BlogAdminPost> {
  const db = requireDb();

  const title = input.title?.trim();
  if (!title) throw new BlogAdminError("Título é obrigatório.");
  if (!input.content?.trim()) throw new BlogAdminError("Conteúdo é obrigatório.");

  const authorId = await resolveAuthorId(authorEmail);
  const slug = await uniqueSlug(slugify(input.slug?.trim() ?? "") || slugify(title));
  const published = input.published ?? false;

  const created = await db.post.create({
    data: {
      title,
      slug,
      content: input.content,
      imageUrl: input.imageUrl?.trim() ? input.imageUrl : null,
      published,
      publishedAt: published ? new Date() : null,
      authorId,
    },
    select: { id: true },
  });

  await syncTags(created.id, input.tags ?? []);

  const post = await db.post.findUniqueOrThrow({
    where: { id: created.id },
    include: postInclude,
  });
  return toAdminPost(post);
}

export async function updatePost(
  id: string,
  input: BlogPostInput,
): Promise<BlogAdminPost> {
  const db = requireDb();

  const existing = await db.post.findUnique({
    where: { id },
    select: { id: true, slug: true, published: true, publishedAt: true },
  });
  if (!existing) throw new BlogAdminError("Post não encontrado.", 404);

  const title = input.title?.trim();
  if (!title) throw new BlogAdminError("Título é obrigatório.");
  if (!input.content?.trim()) throw new BlogAdminError("Conteúdo é obrigatório.");

  const desiredSlug = slugify(input.slug?.trim() ?? "") || slugify(title);
  const slug =
    desiredSlug === existing.slug
      ? existing.slug
      : await uniqueSlug(desiredSlug, id);

  const published = input.published ?? existing.published;
  // Carimba a data na primeira publicação e preserva nas edições seguintes.
  const publishedAt = published ? (existing.publishedAt ?? new Date()) : null;

  await db.post.update({
    where: { id },
    data: {
      title,
      slug,
      content: input.content,
      imageUrl: input.imageUrl?.trim() ? input.imageUrl : null,
      published,
      publishedAt,
    },
  });

  await syncTags(id, input.tags ?? []);

  const post = await db.post.findUniqueOrThrow({
    where: { id },
    include: postInclude,
  });
  return toAdminPost(post);
}

export async function deletePost(id: string): Promise<void> {
  const db = requireDb();
  const existing = await db.post.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new BlogAdminError("Post não encontrado.", 404);
  // comments / views / post_tags saem em cascata pelo schema.
  await db.post.delete({ where: { id } });
}

/** Todas as tags cadastradas, para o autocomplete do formulário. */
export async function listAllTags(): Promise<{ name: string; slug: string }[]> {
  const db = requireDb();
  return db.tag.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });
}
