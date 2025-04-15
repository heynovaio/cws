import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
    },
    colors: {
      primary: colors.ultraPink,
      secondary: colors.neonViolet,
      transparent: "transparent",
      current: "currentColor",
      dark: colors.midnight,

      white: "#FFFFFF",
      "dove-grey": "#6D00FF",
      "ultra-pink": "#FF005C",
      aqua: "#02BBFF",
      "electric-blue": "#0300E9",
      midnight: "#01015E",
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
      h4: "1.375rem",
      button: "1.1em",
      bodyLarge: "1.25rem",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
