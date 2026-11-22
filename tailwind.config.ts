import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        parchment: {
          base: "#0f1013",       // Deep warm charcoal base
          surface: "#17181d",    // Card & container surface
          elevated: "#1f2027",   // Hover & active surface
          border: "#292b35",     // Quiet, refined border
          borderLight: "#383b48",
          text: "#f0ece1",       // Warm ivory primary text
          muted: "#9e9a90",      // Muted linen secondary text
          dim: "#67645d",        // Subtle captions
          brass: "#c8a562",      // Antique brass / warm ochre accent
          brassHover: "#dbc082",
          brassMuted: "rgba(200, 165, 98, 0.12)",
        },
        element: {
          fire: "#bf6e53",       // Muted terracotta for Wands
          water: "#688aa6",      // Dusty slate for Cups
          air: "#8a9e94",        // Soft sage for Swords
          earth: "#a39265",      // Antique moss for Pentacles
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
        brass: "0 0 20px -5px rgba(200, 165, 98, 0.18)",
      }
    },
  },
  plugins: [],
};
export default config;
