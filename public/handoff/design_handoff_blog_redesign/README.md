# Handoff: Blog — Redesign do Layout (Ruan Bueno)

## Overview
Redesenho da página de índice do blog (`/blog`) do portfólio do Ruan Bueno. O objetivo
é substituir o layout atual (header + grid simples de cards) por um layout estilo
**revista editorial** que combina com a identidade do site: fundo escuro, acento roxo,
títulos em Anton (condensado, caixa-alta) e kickers/metas em Space Mono.

A nova página entrega: barra fixa de topo, faixa marquee animada, hero editorial, um
post **em destaque** em banner split, filtro de tags interativo, grid de cards com
microinterações de hover, e uma faixa de CTA de fechamento.

## About the Design Files
O arquivo `Blog.dc.html` deste pacote é uma **referência de design feita em HTML** —
um protótipo que mostra a aparência e o comportamento pretendidos, **não** código de
produção para copiar e colar. Ele foi escrito como um "Design Component" isolado
(streaming, com fontes via Google Fonts) só para visualização.

A tarefa é **recriar este design no codebase existente** — um app **Next.js (App Router)
+ TypeScript + Tailwind** — usando os padrões que já existem ali. Concretamente, o
arquivo a reescrever é:

- `src/app/blog/page.tsx` (índice do blog — Server Component que busca posts via
  `listPublishedPosts(tag)` e `listTags()`)

Os dados continuam vindo do banco (Prisma). Os campos exibidos no protótipo
(`title`, `excerpt`, `tag`, `date`, `views`, `read`, `imageUrl`) mapeiam direto para o
modelo de post já usado na página atual (`p.title`, `p.excerpt`, `p.tags`,
`p.publishedAt`, `p.viewCount`, `p.imageUrl`). **Não** adote o conteúdo de exemplo do
protótipo (os 7 posts hardcoded são apenas para preencher a tela).

## Fidelity
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos e interações são finais e
devem ser reproduzidos fielmente. Use os tokens existentes em
`src/app/_components/portfolio/tokens.ts` (objeto `C` e `FONT`) — eles já contêm os
valores abaixo. Reaproveite as fontes já carregadas no `layout.tsx`
(Anton → `var(--font-anton)`, Space Grotesk → `var(--font-grotesk)`,
Space Mono → `var(--font-mono-sp)`).

---

## Screens / Views

### Blog Index (`/blog`)

**Purpose:** listar os artigos publicados, permitir filtrar por tag e destacar o post
mais recente.

**Layout (top → bottom):**
1. **Barra de topo** — `position: sticky; top: 0`, padding `18px 5vw`, fundo
   `rgba(31,31,31,.82)` com `backdrop-filter: blur(12px)`, borda inferior `1px solid #251737`.
   Três colunas: link `← Ruan Bueno` (esq.), label `BLOG` (centro), `✦` em acento (dir.).
2. **Marquee** — faixa de largura total, fundo `#1a0a32`, borda inferior `1px solid #251737`,
   padding vertical `11px`. Texto em loop horizontal infinito (Space Mono, 12px,
   `letter-spacing:.26em`, caixa-alta, cor `#b8b6ad`): `Desenvolvimento ✦ Automação ✦
   Inteligência Artificial ✦ Café ✦` (duplicado para loop sem emenda). Animação
   `translateX(0 → -50%)` em `26s linear infinite`.
3. **Container** — `max-width: 1180px; margin: 0 auto; padding: 64px 5vw 120px`.
4. **Hero** — grid `1.4fr 1fr`, `gap: 40px`, `align-items: end`, `margin-bottom: 72px`.
   - Esquerda: kicker `Notas & ideias` (Space Mono, 13px, `letter-spacing:.26em`, acento)
     + H1 em Anton, `clamp(56px, 9vw, 128px)`, `line-height:.84`, caixa-alta, 3 linhas:
     "Notas," / "ideias &" / "café." (última palavra em acento).
   - Direita: parágrafo (Space Grotesk, 16px/1.65, `#cfcdc4`, max-width 340px) + contador
     "07 artigos publicados" (número em Anton 34px branco; rótulo em Space Mono 12px `#56564f`).
5. **Featured** (banner) — ver componente abaixo. `margin-bottom: 60px`.
6. **Filter row** — flex space-between, borda inferior `1px solid #251737`, `padding-bottom:22px`,
   `margin-bottom:36px`. Esquerda: chips de tag (flex wrap, gap 9px). Direita: label de
   resultado (Space Mono, 11px, `letter-spacing:.16em`, `#56564f`) — "Todos os artigos"
   ou "N artigo(s)".
7. **Grid** — `grid-template-columns: repeat(auto-fill, minmax(330px, 1fr))`, `gap: 26px`.
8. **Closing strip** — `margin-top:80px`, padding `44px clamp(28px,4vw,56px)`, borda
   `1px solid #251737`, `border-radius:18px`, fundo
   `linear-gradient(135deg, rgba(49,16,92,.45), rgba(255,255,255,.01))`. Esquerda: kicker
   "Bora trocar ideia?" + título Anton "Tem um projeto em mente?". Direita: botão pill
   "Falar comigo →" (link p/ `/contato`).

---

## Components

### Featured banner (post em destaque)
- **Tag:** `<a>` levando ao post. Grid `1.05fr 1fr`, `border-radius:20px`, `overflow:hidden`,
  borda `1px solid #251737`, fundo `rgba(255,255,255,.015)`.
- **Coluna de texto** (esq.): padding `clamp(28px,4vw,52px)`, centralizada verticalmente.
  - Badge: ponto `7px` acento + "✦ Em destaque" (Space Mono 11px, `letter-spacing:.2em`, acento).
  - Título: Anton, `clamp(34px,3.6vw,58px)`, `line-height:.96`, caixa-alta.
  - Excerpt: Space Grotesk 17px/1.6, `#cfcdc4`, max-width 480px.
  - Meta (Space Mono 11px, `letter-spacing:.12em`, `#56564f`): tag (em `#b8b6ad`) · data ·
    "{read} de leitura" · "{views} views".
  - CTA: "Ler artigo →" (Space Mono 13px, acento). No hover do banner, o `gap` do CTA
    cresce de 11px → 16px.
- **Coluna de capa** (dir.): `min-height:380px`, `overflow:hidden`, borda esq. `1px solid #251737`.
  Fundo base `#31105C` + camada de gradiente (a capa). Palavra-fantasma em Anton
  `clamp(90px,11vw,180px)`, cor `rgba(244,242,236,.09)`, ancorada bottom-right. No hover
  do banner, a imagem faz `scale(1.05)` em `.9s`.
- **Hover do banner:** `border-color → #4a356a`.
- **Responsivo (`max-width:760px`):** vira 1 coluna; a capa vai para o topo (`order:-1`)
  com `min-height:240px`.

### Post card (grid)
- **Tag:** `<a>` para `/blog/{slug}`. `display:flex; flex-direction:column`,
  `border:1px solid #251737`, `border-radius:16px`, `overflow:hidden`,
  fundo `rgba(255,255,255,.015)`.
- **Capa:** `aspect-ratio:16/10`, `overflow:hidden`, fundo base `#31105C` + camada de
  gradiente. Palavra-fantasma Anton 84px `rgba(244,242,236,.08)` bottom-right. Chip de
  tag flutuante top-left: Space Mono 10px caixa-alta, padding `7px 11px`, `border-radius:999px`,
  fundo `rgba(26,10,50,.7)` + `backdrop-filter: blur(6px)`, borda `1px solid #3a2a54`, texto `#F4F2EC`.
- **Corpo:** padding `22px 22px 24px`, flex coluna, gap 13px.
  - Meta: data · (ponto 3px `#56564f`) · "{views} views" (Space Mono 10px, `letter-spacing:.1em`, `#56564f`).
  - Título: Space Grotesk **700**, 22px/1.25, `letter-spacing:-.01em`, `#F4F2EC`.
  - Excerpt: Space Grotesk 14.5px/1.55, `#8A877F`.
  - Rodapé do card (borda superior `1px solid #251737`, `padding-top:16px`): "{read}" à esq.
    e CTA "Ler →" à dir. (Space Mono 11px, `#8A877F`).
- **Hover do card:** `transform: translateY(-7px)`, `border-color → #4a356a`,
  fundo `→ rgba(139,92,246,.05)` (`transition .45s cubic-bezier(.2,.7,.2,1)`). A imagem da
  capa faz `scale(1.07)` em `.7s`; o CTA "Ler" muda para a cor de acento; a seta `→` desliza
  `translateX(6px)`.

### Tag chips (filtro)
- `<button>` por tag, incluindo "Todos". Space Mono 700 11px, `letter-spacing:.1em`,
  caixa-alta, padding `9px 15px`, `border-radius:999px`, `cursor:pointer`.
- **Inativo:** borda `1px solid #3a2a54`, fundo transparente, texto `#8A877F`.
- **Ativo:** borda `1px solid {acento}`, fundo `rgba(139,92,246,.16)`, texto `#F4F2EC`.
- **Hover:** borda → acento, texto → `#F4F2EC`.
- Clicar filtra o grid pela tag. Com filtro ativo, o **banner de destaque é escondido** e o
  grid mostra **todos** os posts daquela tag (sem reservar o primeiro). Sem filtro ("Todos"),
  o destaque aparece e o grid mostra os posts a partir do segundo.

---

## Interactions & Behavior
- **Filtro por tag:** no codebase atual o filtro já é feito via querystring
  (`/blog?tag={slug}`) num Server Component. Mantenha essa abordagem (links/`<Link>` em vez de
  estado client-side) — o protótipo usa `useState` só por ser estático. A regra de
  esconder o destaque quando há `tag` selecionada deve ser preservada.
- **Marquee:** puramente decorativa, CSS `@keyframes` (`translateX 0 → -50%`, 26s linear infinite).
- **Hovers:** card lift + zoom da capa + cor/seta do CTA; banner zoom da capa + crescimento
  do gap do CTA; chips e botões trocam borda/cor. Todas as transições usam
  `cubic-bezier(.2,.7,.2,1)` (.45–.9s).
- **Entrada:** hero e banner com fade-up (`@keyframes` opacity 0→1 / translateY 22px→0,
  .7s, com pequeno delay no banner). Opcional reproduzir; o site usa `data-reveal` +
  IntersectionObserver em outras seções (ver `use-portfolio-effects.ts`) — preferir esse
  padrão para consistência.
- **Responsivo:** banner colapsa para 1 coluna em `<760px`; H1 do hero reduz; grid usa
  `auto-fill minmax(330px, 1fr)` (reflui sozinho).

## State Management
No codebase real, **sem estado client-side** para o índice: é Server Component que recebe
`searchParams.tag`, chama `listPublishedPosts(tag)` + `listTags()` e renderiza. A "seleção"
de tag = qual `tag` está na URL. (O `useState`/`activeTag` do protótipo existe apenas porque
o DC é estático e isolado.)

## Design Tokens
Reaproveitar `src/app/_components/portfolio/tokens.ts`. Valores usados nesta tela:

| Token | Valor | Uso |
|---|---|---|
| bg | `#1F1F1F` | fundo da página |
| brandDeep | `#31105C` | base das capas, fundo do marquee variante |
| accent | `#8B5CF6` | kickers, links, badges, chip ativo, seta, ✦ |
| text | `#F4F2EC` | títulos e texto primário |
| textMuted | `#cfcdc4` | parágrafos do hero/banner |
| textMuted2 | `#b8b6ad` | tag do banner, texto do marquee |
| textSecondary | `#8A877F` | excerpt dos cards, chip inativo, CTA card |
| textFaint | `#56564f` | metas, contador, label de resultado |
| border (rows/cards) | `#251737` | bordas de cards, banner, divisores, faixa final |
| border (tags/outline) | `#3a2a54` | chip inativo, chip de tag na capa |
| border hover | `#4a356a` | hover de card/banner |
| surface | `rgba(255,255,255,.015)` | fundo de cards e banner |
| marquee bg | `#1a0a32` | fundo da faixa marquee |

**Capas (placeholders):** gradientes roxos sobre `#31105C`, p.ex.
`radial-gradient(120% 130% at 22% 18%, rgba(181,123,255,.32), rgba(49,16,92,0) 58%),
linear-gradient(140deg,#3a1469,#160826)`. São **placeholders** — quando o post tiver
`imageUrl`, renderizar a imagem real (`object-fit:cover`) no lugar do gradiente, mantendo a
palavra-fantasma como fallback quando não houver imagem.

**Tipografia:**
- Display / fantasma / contador: **Anton** (`var(--font-anton)`), 400, caixa-alta,
  `letter-spacing` ~ -.01em.
- Títulos de card / corpo: **Space Grotesk** (`var(--font-grotesk)`), 400–700.
- Kickers / metas / chips / CTAs: **Space Mono** (`var(--font-mono-sp)`), 700, caixa-alta,
  `letter-spacing` .1–.26em.

**Raios:** cards 16px · banner 20px · faixa final 18px · pills/chips 999px.

## Tweaks no protótipo (opcionais, não obrigatórios no app)
O DC expõe 3 controles só de demonstração: `accent` (Roxo/Ametista/Índigo, aplicado via
CSS var `--acc`), `showFeatured` (mostra/esconde o destaque) e `showMarquee` (mostra/esconde
a faixa). No app, manter o acento padrão `#8B5CF6` do design system; os outros dois podem
virar simples condicionais se desejado.

## Assets
Nenhum asset binário novo. As capas são gradientes CSS (placeholders). Imagens reais de
post devem vir de `post.imageUrl` (mesma fonte da página atual). Fontes já carregadas no
`layout.tsx`. Glifos `✦`, `→`, `☕` são caracteres de texto (sem ícones SVG).

## Files
- `Blog.dc.html` — protótipo de referência (este pacote).
- Alvo no codebase: `src/app/blog/page.tsx`.
- Tokens/fonts a reusar: `src/app/_components/portfolio/tokens.ts`, `src/app/layout.tsx`.
- Página de post individual (não alterada aqui): `src/app/blog/[slug]/page.tsx` —
  considerar aplicar o mesmo vocabulário visual depois, para consistência.
