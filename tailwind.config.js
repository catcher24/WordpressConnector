/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  important: "#catcher24Connector",
  darkMode: "selector",
  content: [
    "./src/admin/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      hero: {
        DEFAULT: "#ef7a24",
        light: "#f6b587",
        lighter: "#fad6bc",
        dark: "#D16010",
        darker: "#AB4F0D",
        background: "#162333",
      },
      primary: {
        /*        DEFAULT: colors.sky['500'],
                light: colors.sky['100'],
                lighter: colors.sky['50'],
                dark: colors.sky['800'],
                darker: colors.sky['900'],*/
        DEFAULT: "#ef7a24",
        light: "#f6b587",
        lighter: "#fad6bc",
        dark: "#D16010",
        darker: "#AB4F0D",
      },
      secondary: {
        DEFAULT: colors.gray["400"],
        light: colors.gray["200"],
        lighter: colors.gray["100"],
        dark: colors.gray["700"],
        darker: colors.gray["900"],
      },
      tertiary: {
        DEFAULT: colors.neutral["200"],
        light: colors.neutral["100"],
        lighter: colors.neutral["50"],
        dark: colors.neutral["800"],
        darker: colors.neutral["900"],
      },
      success: {
        DEFAULT: colors.emerald["500"],
        light: colors.emerald["200"],
        lighter: colors.emerald["100"],
        dark: colors.emerald["800"],
        darker: colors.emerald["900"],
      },
      warning: {
        DEFAULT: colors.orange["500"],
        light: colors.orange["200"],
        lighter: colors.orange["100"],
        dark: colors.orange["800"],
        darker: colors.orange["900"],
      },
      danger: {
        DEFAULT: colors.red["500"],
        light: colors.red["100"],
        lighter: colors.red["50"],
        dark: colors.red["800"],
        darker: colors.red["900"],
      },
      info: {
        DEFAULT: colors.cyan["500"],
        light: colors.cyan["100"],
        lighter: colors.cyan["50"],
        dark: colors.cyan["800"],
        darker: colors.cyan["900"],
      },
      gray: {
        ...colors.gray,
        DEFAULT: colors.gray["500"],
        light: colors.gray["200"],
        lighter: colors.gray["100"],
        dark: colors.gray["800"],
        darker: colors.gray["900"],
      },
      severity: {
        critical: {
          DEFAULT: colors.red["500"],
          light: colors.red["200"],
          lighter: colors.red["100"],
          dark: colors.red["800"],
          darker: colors.red["900"],
        },
        high: {
          DEFAULT: colors.orange["500"],
          light: colors.orange["200"],
          lighter: colors.orange["100"],
          dark: colors.orange["800"],
          darker: colors.orange["900"],
        },
        medium: {
          DEFAULT: colors.amber["500"],
          light: colors.amber["200"],
          lighter: colors.amber["100"],
          dark: colors.amber["800"],
          darker: colors.amber["900"],
        },
        low: {
          DEFAULT: colors.teal["500"],
          light: colors.teal["100"],
          lighter: colors.teal["50"],
          dark: colors.teal["800"],
          darker: colors.teal["900"],
        },
        noise: {
          DEFAULT: colors.neutral["200"],
          light: colors.neutral["200"],
          lighter: colors.neutral["100"],
          dark: colors.neutral["800"],
          darker: colors.neutral["900"],
        },
      },
      white: colors.white,
      black: colors.black,
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      boxShadow: {
        card: "0 1px 6px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};
