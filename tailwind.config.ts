import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class", // Habilita o modo escuro via classe "dark"
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx", // Adiciona src como conteúdo
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // Paleta do handoff do portfólio — mesma fonte de
        // `src/app/_components/portfolio/tokens.ts` (C), exposta aqui como
        // utilitários do Tailwind para as telas de admin (login/dashboard).
        primary: {
          DEFAULT: "#8B5CF6", // C.accent — roxo de destaque
          50: "#F3EEFE",
          100: "#E7DEFD",
          200: "#CFBDFB",
          300: "#B79CF9",
          400: "#B57BFF", // hover dos links no site público
          500: "#8B5CF6", // C.accent
          600: "#7A35C9", // C.duotone
          700: "#5F2AA0",
          800: "#31105C", // C.brandDeep
          900: "#1b1233", // C.border1
        },
        dark: {
          DEFAULT: "#1F1F1F",
          bg: "#1F1F1F", // C.bg
          surface: "#262231", // superfície elevada (levemente roxeada)
          card: "#2b2536",
          border: "#3a2a54", // C.border3
          hover: "#3f3357",
        },
        // Texto: escala derivada dos tokens de tipografia do handoff.
        ink: {
          DEFAULT: "#F4F2EC", // C.text — branco quente
          muted: "#cfcdc4", // C.textMuted
          subtle: "#b8b6ad", // C.textMuted2
          secondary: "#8A877F", // C.textSecondary
          faint: "#56564f", // C.textFaint
        },
        accent: {
          purple: "#8B5CF6",
          green: "#00C896",
          yellow: "#FFD700",
          gray: "#cfcdc4", // C.textMuted
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
