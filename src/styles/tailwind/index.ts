
import { Config } from "tailwindcss";
import colors from "./colors";
import animations from "./animations";
import typography from "./typography";
import { container, borderRadius, boxShadow, backgroundImage } from "./layout";
import plugins from "./plugins";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container,
    extend: {
      colors,
      borderRadius,
      keyframes: animations.keyframes,
      animation: animations.animation,
      boxShadow,
      backgroundImage,
      typography: typography.config,
    },
  },
  plugins,
} satisfies Config;
