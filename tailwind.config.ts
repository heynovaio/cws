import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "600px",
      md: "905px",
      lg: "1240px",
      xl: "1440px",
    },
    fontFamily: {
      title: ["var(--font-outfit)"],
      body: ["var(--font-outfit)"],
      accent: ["var(--font-roboto-condensed)"],
    },
    colors: {
      primary: colors.ultraPink,
      secondary: colors.neonViolet,
      transparent: "transparent",
      current: "currentColor",
      dark: colors.midnight,

      white: "#FFFFFF",
      "dove-grey": "#6D00FF",
      "ultra-pink": "#DD0748",
      aqua: "#02BBFF",
      "electric-blue": "#0300E9",
      midnight: "#00002D",
      "neon-violet": "#6D00FF",
      "light-violet": "#E5D8FF",
      "navy-background": "#00002D",
      "dark-purple-background": "#180451",
      "soft-purple": "#D4C6FD40",
      "menu-purple": "#360096",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "600",
      extraBold: "700",
    },
    fontSize: {
      base: "1rem",
      h1: "4.1875rem",
      h2: "3.5625rem",
      h3: "2.5rem",
      h4: "1.875rem",
      label: "1.5rem",
      button: "1.25rem",
      bodyLarge: "1.25rem",
      md: "1.125rem",
    },
    lineHeight: {
      h1: "1.3",
      h2: "1.3",
      h3: "1.3",
      h4: "1.3",
      p: "1.5",
    },

    extend: {
      borderRadius: {
        DEFAULT: "1.25rem",
      },
      boxShadow: {
        DEFAULT: "0px 0px 30px 0px rgba(99, 15, 249, 0.80)",
      },
      backdropBlur: {
        DEFAULT: "8px",
      },
      maxWidth: {
        content: "700px",
        wide: "782px",
        standard: "685px",
        narrow: "452px",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(90deg, #3802a7 0%, #3c1253 98.73%)",
        "gradient-dark":
          "linear-gradient(90deg, rgba(99, 15, 249, 0.8) 0%, rgba(51, 23, 153, 0.8) 100%)",
        "gradient-overlay":
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 0, 233, 0.5) 61.5%)",
      },
      dropShadow: {
        glow: "0 0 30px #630FF9CC",
      },
    },
  },
  plugins: [],
} satisfies Config;
