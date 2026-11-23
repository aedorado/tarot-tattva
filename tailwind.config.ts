import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          bg: "#f9f8f5",        // Soft warm luminous parchment background
          surface: "#ffffff",   // Pure crisp white card/surface
          elevated: "#f3efe8",  // Gentle warm hover & subtle pill background
          border: "#e5e0d5",    // Crisp light border
          borderHover: "#cfc8bb",
          text: "#1c1b18",      // Deep charcoal primary text
          muted: "#524f46",     // Soft body text
          dim: "#827e74",       // Secondary captions
          brass: "#946b24",     // Elegant antique warm brass
          brassHover: "#7a561b",
          brassTint: "#fbf6ec", // Very soft warm amber tint
        },
        element: {
          fire: "#b84f35",
          fireBg: "#fdf3f0",
          water: "#36668a",
          waterBg: "#eff5f9",
          air: "#466c59",
          airBg: "#f0f5f2",
          earth: "#7d672d",
          earthBg: "#f9f6ee",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)",
        card: "0 2px 8px rgba(60, 50, 35, 0.06), 0 1px 3px rgba(60, 50, 35, 0.04)",
        cardHover: "0 10px 24px -4px rgba(60, 50, 35, 0.12), 0 2px 6px rgba(60, 50, 35, 0.04)",
        modal: "0 20px 45px -10px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
};
export default config;
