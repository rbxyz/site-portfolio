// Design tokens from the portfolio handoff.
// NOTE: the handoff's deep purple-black background (#0E0720) is intentionally
// swapped here for a neutral dark (#1F1F1F). The purple accents are kept since
// they carry the headline/link highlights and can't be replaced by a dark gray.
export const C = {
  bg: "#1F1F1F", // page / section background (was #0E0720)
  brandDeep: "#31105C", // solid fills: buttons, marquee bar, photo duotone base
  duotone: "#7A35C9", // multiply overlay on hero photo
  accent: "#8B5CF6", // headlines highlight, kickers, links, dots, numbers (vivid standard purple)
  text: "#F4F2EC", // primary text (warm white)
  textMuted: "#cfcdc4", // body paragraphs
  textMuted2: "#b8b6ad", // hero sub / tag text
  textSecondary: "#8A877F", // labels, secondary copy
  textFaint: "#56564f", // meta, copyright
  border1: "#1b1233", // section dividers
  border2: "#251737", // rows / card borders
  border3: "#3a2a54", // tags / outline buttons
  strokeName: "#343438", // giant outline name stroke (lightened to read on #1F1F1F)
  strokeWord: "#6a6a6e", // outlined "software" word in the hero
} as const;

export const FONT = {
  anton: "var(--font-anton), sans-serif",
  grotesk: "var(--font-grotesk), sans-serif",
  mono: "var(--font-mono-sp), monospace",
} as const;
