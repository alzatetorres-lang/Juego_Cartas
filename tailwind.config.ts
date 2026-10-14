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
        brick: {
          red: "#E53E3E",
          "red-dark": "#C53030",
          yellow: "#ECC94B",
          "yellow-dark": "#D69E2E",
          blue: "#3182CE",
          "blue-dark": "#2B6CB0",
          green: "#38A169",
          "green-dark": "#2F855A",
          orange: "#DD6B20",
          purple: "#805AD5",
          dark: "#1A202C",
          surface: "#2D3748",
          stud: "#D4AF37",
          cream: "#FFFDF5",
        },
        faction: {
          medieval: {
            primary: "#D97706",
            light: "#FDE68A",
            dark: "#92400E",
          },
          heroes: {
            primary: "#DC2626",
            light: "#FECACA",
            dark: "#991B1B",
          },
          ciber: {
            primary: "#059669",
            light: "#A7F3D0",
            dark: "#065F46",
          },
          cavemen: {
            primary: "#4B5563",
            light: "#E5E7EB",
            dark: "#1F2937",
          },
        },
      },
      boxShadow: {
        brick: "0 4px 0 #1A202C, 0 8px 12px rgba(0, 0, 0, 0.35)",
        "brick-sm": "0 2px 0 #1A202C, 0 4px 6px rgba(0, 0, 0, 0.25)",
        "brick-pressed": "inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.2)",
        stud: "inset 0 1px 1px rgba(255,255,255,0.6), 0 2px 3px rgba(0,0,0,0.4)",
        "card-brick": "0 6px 0 #CBD5E0, 0 10px 20px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        brick: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
