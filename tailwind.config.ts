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
      "navy-background": "#00002D",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "600",
      extraBold: "700",
    },
    fontSize: {
      base: "1em",
      h1: "4.1875rem",
      h2: "3.5625rem",
      h3: "2.5rem",
      h4: "1.875rem",
      button: "1.25rem",
      bodyLarge: "1.25rem",
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
        DEFAULT: "0px 0px 30px 0px rgba(99, 15, 249, 0.60)",
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
    },
  },
  plugins: [],
} satisfies Config;
