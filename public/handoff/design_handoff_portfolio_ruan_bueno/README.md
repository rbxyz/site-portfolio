# Handoff: Portfólio Ruan Bueno — Landing Page

## Overview
Single-page personal portfolio (home/landing) for **Ruan Bueno** — full-stack developer (dev, café, automação & IA). One scrolling page, no internal routes. Positioning line / anchor phrase: **"Traduzo negócios e problemas em soluções escaláveis e robustas."** The whole page must communicate: *"eu entendo do teu negócio, pego qualquer problema e faço virar solução em software."* Language: **100% Português (BR)**. Tone: confident, technical, direct — the execution quality is the argument.

Direction: editorial (allpines DNA — marquees with ✦ separators, 01/02/03 numbering, monospace meta) + kinetic (landonorris DNA — epic preloader, giant protagonist typography, scroll reveals). Dark base + one vibrant accent.

## About the Design Files
The files in this bundle are **design references created in HTML** (a streaming "Design Component" prototype) — they show the intended look, motion, and behavior. **They are not production code to ship directly.** The task is to **recreate this design in the target codebase using its established stack and patterns** (e.g. the existing Next.js + React + Tailwind app this came from — see notes below), or, if starting fresh, to pick the most appropriate framework and implement it there.

> Origin context: this redesign replaces an existing **Next.js (App Router) + TypeScript + Tailwind + Framer Motion** portfolio. Recreating it as React components with Framer Motion (or GSAP/ScrollTrigger) + Tailwind is the natural target. Map the tokens below to the Tailwind theme.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion and copy are specified below. Recreate pixel-faithfully with the codebase's libraries. Only the project preview images and the social/CV links are placeholders to be wired up.

---

## Screens / Views
One page, five stacked sections in this order: **Preloader → Hero → Sobre → Projetos → Footer/CTA**. Global background `#0E0720`. Content column max-width `1240px`, horizontal padding `4vw`.

### 0. Preloader (overlay)
- **Purpose**: epic entrance before revealing the hero.
- **Layout**: `position:fixed; inset:0; z-index:100`, flex column centered, background `#0E0720`.
- **Components**:
  - Top label (mono, `#B57BFF`, uppercase, letter-spacing .3em): `Ruan Bueno · Portfólio`
  - Center phrase (Anton, `clamp(40px,7vw,104px)`, `#F4F2EC`): `Negócios → Software` — fades in (opacity 0→1, .5s) ~350ms after load.
  - Bottom-left counter (Anton, `clamp(48px,9vw,120px)`, `#B57BFF`): counts `000 → 100` over **1500ms** with easeOutCubic.
  - Bottom-right (mono, `#56564f`, uppercase): `Carregando experiência`
- **Exit**: after the counter completes (+260ms), overlay animates `opacity:0` (.6s) + `translateY(-100%)` (.7s `cubic-bezier(.7,0,.2,1)`), then `display:none`.
- **Reduced motion**: skip counter, set 100, hide immediately.

### 1. Hero (full viewport, `min-height:100vh`, `overflow:hidden`)
- **Purpose**: state who he is + the anchor phrase as giant typography; photo as editorial duotone.
- **Layout**: relative container. Left zone = giant type + sub + CTAs (vertically centered, anchored `left:4vw`). Right zone = photo panel (`position:absolute; right:0; top:0; bottom:0; width:40%`). Faint accent grid overlay full-bleed (`64px`→`70px` grid, lines `rgba(181,123,255,.04)`). Radial accent glow behind photo (`rgba(181,123,255,.32)`, blurred, pulsing opacity .6↔.95 / 5s).
- **Components**:
  - **Top nav** (`padding:30px 4vw`, flex space-between): left `RUAN BUENO.` (mono 16px, the `.` in `#B57BFF`); right links `Sobre` `Projetos` `● Disponível` (mono 12px uppercase, letter-spacing .16em; the "● Disponível" in `#B57BFF`).
  - **Kicker** (mono 13px, `#B57BFF`, uppercase, letter-spacing .24em): `Dev · Café · Automação & IA`
  - **Giant headline** (Anton, uppercase, line-height .82, letter-spacing -.01em):
    - Line 1 `Traduzo` — `clamp(64px,10vw,148px)`, color `#F4F2EC`
    - Line 2 `Negócios` — `clamp(64px,10vw,148px)`, color **`#B57BFF`** (the eye-catching word)
    - Line 3 `em software.` — `clamp(40px,6vw,90px)`; the word `software` is transparent fill with `-webkit-text-stroke:1.5px #6a6a6e` (outline), the final `.` in `#B57BFF`
  - **Sub** (Space Grotesk 17px, `#b8b6ad`, max-width 440px): `Traduzo negócios e problemas em soluções escaláveis e robustas. Você traz o problema — eu devolvo o software.`
  - **CTAs** (mono 13px uppercase): primary `Ver projetos →` (bg `#31105C`, text `#F4F2EC`, radius 4px, padding 15×26px); secondary `Baixar CV` (1px border `#3a2a54`, text `#e6e6e0`).
  - **Photo panel**: image `assets/foto2.jpeg`, `object-fit:cover`, `object-position:50% 8%`, `transform:scale(1.18)`, `filter:grayscale(1) contrast(1.12) brightness(1)`. **Duotone treatment** = grayscale image + overlay `#7A35C9` `mix-blend-mode:multiply` opacity .8 + overlay `#0E0720` `mix-blend-mode:color` opacity .25. Plus a left-edge fade (`linear-gradient(90deg,#0E0720 0%, transparent 52%)`) and top/bottom fades. Vertical caption (mono, `mix-blend-mode:difference`): `Ruan Bueno · Porto Alegre BR`.
  - **Spinning badge** (top-right, 120px): SVG circular text (`textPath`) `FULL-STACK · IA · GROWTH · CAFÉ ·` (mono 15px, `#F4F2EC`), spins 360° / 18s linear; center `✦` in `#B57BFF`.
  - **Vertical edge label** (left:18px, mono 11px, `#56564f`): `v.2026 · RS · ● all systems nominal`.
  - **Bottom marquee** (`height:50px`, bg `#31105C`, text `#F4F2EC`, Anton 24px uppercase): infinite scroll (22s linear), items separated by `✦`: `Traduzo negócios em software ✦ 20+ projetos ✦ MarcaAI · AllProtect · Ethos ✦ TypeScript · PostgreSQL · n8n · Power BI ✦` (duplicated once for seamless loop).

### 2. Sobre (`padding:140px 4vw 120px`, top border `1px #1b1233`)
- **Purpose**: who he is + anchor phrase unfolded + stack/competências.
- **Layout**: max-width 1240px. Soft radial accent glow top-left. Kicker, then big headline, then a 2-column grid (`1fr 1fr`, gap 64px): left = paragraphs + stats; right = numbered stack list.
- **Components**:
  - Kicker (mono, `#B57BFF`): `01 / Sobre`
  - **Headline** (Space Grotesk 700, `clamp(30px,4.4vw,62px)`, line-height 1.06, letter-spacing -.03em), revealed **word-by-word** (each word `inline-block`, staggered 55ms): `Entendo do seu negócio. Pego qualquer problema e faço virar software.` — the words `negócio.` and `software.` in `#B57BFF`.
  - Left paragraphs (Space Grotesk 19px; first `#cfcdc4`, second `#8A877F`): see exact copy in `Portfolio.dc.html`.
  - **Stats row** (Anton 54px): `20+` (`#B57BFF`) Projetos entregues · `04` Anos de experiência · `∞` Xícaras de café. Labels mono 11px `#8A877F` uppercase.
  - **Stack list** (right col), label `Stack & competências` (mono 12px `#8A877F`). Six rows, each: number (mono, `#B57BFF`) + name (Space Grotesk 600, 22px) + optional tag (mono 13px `#8A877F`, right-aligned). Rows divided by `1px #251737`. **Hover**: `padding-left` 8px→20px + background `rgba(181,123,255,.05)` (.3s).
    1. `01 TypeScript` — linguagem base
    2. `02 PostgreSQL` — dados
    3. `03 Integrações e-commerce & marketplaces`
    4. `04 Automação` — n8n
    5. `05 BI & Dados` — Power BI · SQL
    6. `06 Arquitetura de sistemas`

### 3. Projetos (`padding:120px 4vw 130px`, top border `1px #1b1233`)
- **Purpose**: 3 featured projects with hover preview.
- **Layout**: header row (kicker `02 / Projetos em destaque`, headline `Negócios que viraram software.` with `software.` in `#B57BFF`, and a right-aligned mono note `Selecionados de 20+ entregas. Passe o mouse pra prévia.`). Then 3 full-width project rows, each a 2-column grid (gap 48px, `align-items:center`, `padding:40px 0`, divided by `1px #251737`) that **alternates** image side (text-left / image-left / text-left).
- **Each project card** (an `<a>`):
  - Meta row: number (`#B57BFF`) + a 6px `#B57BFF` dot + `Status · Year · Type` (mono 12px uppercase `#8A877F`).
  - Title (Anton, `clamp(40px,4.6vw,76px)`, uppercase).
  - Description (Space Grotesk 17px `#cfcdc4`, max-width 440px).
  - Tech tags (mono 11px uppercase `#b8b6ad`, 1px border `#3a2a54`, radius 3px, padding 8×12px).
  - CTA line (mono 13px `#B57BFF`, hidden by default `opacity:0; translateX(-8px)`).
  - **Preview** = image inside a wrapper (radius 8px, border `1px #251737`, `overflow:hidden`), `height:400px`.
  - **Hover** (whole card): preview image `transform:scale(1.05)` (.7s `cubic-bezier(.2,.7,.2,1)`) + CTA fades/slides in.
  - **Projects**:
    1. **MarcaAI** — *Em evolução · 2025 · SaaS* — "Plataforma SaaS para prestadores de serviço: integra Google Agenda + WhatsApp + IA para atendimento e agendamento 100% automáticos." Tags: Next.js, TypeScript, Drizzle, IA. Link: `https://marcaaii.vercel.app/`. CTA `Visitar projeto →`.
    2. **AllProtect** — *Shipped · 2023 · SaaS* — "Segurança digital com proteção em tempo real contra estelionato e fraudes online — alertas inteligentes e dashboard administrativo." Tags: Java, Spring Boot, Firebase. Link: TBD. CTA `Ver case →`.
    3. **Ethos** — *Shipped · 2025 · SaaS* — "Gestão pessoal de ponta a ponta: projetos, orçamentos, CRM e precificador por valor/projeto reunidos num só sistema." Tags: Next.js, Prisma, TypeScript. Link: `https://ethos-theta.vercel.app/`. CTA `Visitar projeto →`.

### 4. Footer / CTA (`padding:130px 4vw 0`, top border `1px #1b1233`, centered)
- Kicker (`#B57BFF`): `03 / Contato`.
- Headline (Space Grotesk 700, `clamp(34px,6vw,96px)`): `Tem um problema?` / `Vamos fazer virar software.` (`software.` in `#B57BFF`).
- Email link (Anton, `clamp(24px,3.4vw,52px)`, `#F4F2EC`, bottom border `3px #B57BFF`): **`rbcr4z1@gmail.com`** → `mailto:`. *(In the prototype the address is assembled in JS at runtime to dodge the preview env's email obfuscation; in a real app just render it directly.)*
- Buttons: `Baixar CV ↓` (bg `#31105C`), `LinkedIn ↗` and `GitHub ↗` (border `#3a2a54`) — wire real URLs.
- Giant outline name (Anton, `clamp(80px,17vw,260px)`, transparent + `-webkit-text-stroke:1.5px #1f1f23`): `Ruan Bueno`.
- Bottom bar (mono 11px `#56564f`): `© 2026 Ruan Bueno · Porto Alegre, BR` · `● All systems nominal` (`#B57BFF`) · `Dev · Café · Automação & IA`.

---

## Interactions & Behavior
- **Preloader**: counter + phrase, then slide-up reveal (see §0).
- **Scroll reveals**: every `[data-reveal]` starts `opacity:0; translateY(28px)` and animates to `opacity:1; translateY(0)` (.8–.9s `cubic-bezier(.2,.7,.2,1)`) when it enters the viewport (IntersectionObserver, threshold .14, rootMargin `0px 0px -7% 0px`). One-shot (unobserve after).
- **Word-by-word headline** (Sobre): words reveal staggered 55ms when the `<h2>` reaches 30% visibility.
- **Project hover**: image scale 1.05 + CTA reveal.
- **Stack row hover**: indent + faint accent bg.
- **Marquees**: infinite linear loops (hero 22s; content duplicated for seamlessness).
- **Badge**: continuous 18s rotation. **Glow**: 5s opacity pulse.
- **prefers-reduced-motion: reduce** → all CSS animations disabled; reveals/words shown immediately; preloader skipped. **Honor this.**
- (The earlier custom cursor + mouse-parallax were intentionally removed — do **not** add them back.)

## State Management
Minimal — it's a static landing. Needed runtime state:
- Preloader: `count` (0–100) + `done` flag → unmount/hide overlay.
- Reveal flags per element (or just an IntersectionObserver hook).
- Project hover state (CSS `:hover`/`group-hover` is enough in React+Tailwind).
- Project data is a small static array (title, status, year, type, description, tags[], href, ctaLabel, image). Fetch from CMS/DB only if desired.

## Design Tokens
**Colors**
| Token | Hex | Use |
|---|---|---|
| bg | `#0E0720` | page background (deep purple-black) |
| brand-deep | `#31105C` | solid fills: buttons, marquee bar, photo duotone base |
| photo-duotone | `#7A35C9` | multiply overlay on hero photo |
| accent | `#B57BFF` | headlines highlight, kickers, links, dots, numbers |
| text | `#F4F2EC` | primary text (warm white) |
| text-muted | `#cfcdc4` | body paragraphs |
| text-muted-2 | `#b8b6ad` | hero sub / tag text |
| text-secondary | `#8A877F` | labels, secondary copy |
| text-faint | `#56564f` | meta, copyright |
| border-1 | `#1b1233` | section dividers |
| border-2 | `#251737` | rows / card borders |
| border-3 | `#3a2a54` | tags / outline buttons |
| stroke-name | `#1f1f23` | giant outline name stroke |
| accent-alpha | `rgba(181,123,255,…)` | grid lines (.04), glows (.1–.32), hover bg (.05) |

> Note on `#31105C`: the user's requested brand purple. It's too dark to read as large text on the dark bg, so it's used for **solid blocks** (buttons, marquee, photo tint, glows) while `#B57BFF` (a brighter sibling of the same hue) carries text/headline accents. Adjust if the codebase prefers a single token.

**Typography**
- Display: **Anton** (400) — giant headings, project titles, stats, marquee, outline name.
- Text/headlines: **Space Grotesk** (400/500/600/700).
- Mono/meta: **Space Mono** (400/700) — kickers, labels, nav, tags, meta. Uppercase, letter-spacing .08–.3em.
- Scale: hero `clamp(64px,10vw,148px)` / `clamp(40px,6vw,90px)`; section h2 `clamp(30px,4.4vw,62px)` & `clamp(34px,6vw,96px)`; project h3 `clamp(40px,4.6vw,76px)`; body 17–19px; mono 11–13px.

**Spacing / radius / shadow**
- Section vertical padding 120–140px; horizontal `4vw`; content max-width `1240px`; grid gaps 48–64px.
- Radius: buttons 4px, cards 8px, tags 3px.
- No drop shadows — depth comes from blurred radial glows + borders.

**Motion**
- Reveal ease `cubic-bezier(.2,.7,.2,1)`, .8–.9s; word stagger 55ms; preloader easeOutCubic 1500ms; hover scale .7s; marquee 22s linear; spin 18s; glow pulse 5s.

## Assets
- `assets/foto2.jpeg` — hero portrait (Ruan, shot at South Summit). In the prototype it's heavily duotoned, which intentionally hides the busy event background. **For production, a portrait on a plain/solid backdrop will look cleaner** — swap freely; keep the duotone recipe.
- Project preview images: **placeholders** (drag-drop slots in the prototype). Supply real screenshots of MarcaAI / AllProtect / Ethos at ~16:10, `object-fit:cover`, `height:400px`.
- Fonts: Google Fonts — Anton, Space Grotesk, Space Mono.
- CV (`Baixar CV`), LinkedIn, GitHub: wire real URLs/file.

## Files
- `Portfolio.dc.html` — the full design prototype (markup + inline styles + animation logic). **Primary reference.** It's a "Design Component": markup lives between `<x-dc>…</x-dc>`, the animation logic in the `<script type="text/x-dc">` class at the bottom. Open it with `support.js` present (included).
- `image-slot.js` — the drag-drop image placeholder web component used for project previews (prototype-only; replace with real `<img>`).
- `support.js` — DC runtime so the prototype opens in a browser (prototype-only; not needed in the target app).
- `assets/foto2.jpeg` — hero photo.
