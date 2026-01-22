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
        // Design system baseado nas imagens
        primary: {
          DEFAULT: "#00C896", // Teal/Green principal
          50: "#E6F9F5",
          100: "#CCF3EB",
          200: "#99E7D7",
          300: "#66DBC3",
          400: "#33CFAF",
          500: "#00C896",
          600: "#00A078",
          700: "#00785A",
          800: "#00503C",
          900: "#00281E",
        },
        dark: {
          DEFAULT: "#000000",
          bg: "#000000",
          surface: "#0A0A0A",
          card: "#111111",
          border: "#1A1A1A",
          hover: "#1F1F1F",
        },
        accent: {
          green: "#00C896",
          yellow: "#FFD700",
          gray: "#CCCCCC",
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
