import type { Config } from "tailwindcss";

import animations from "./animations";
import colors from "./colors";
import { container, borderRadius, boxShadow, backgroundImage } from "./layout";
import plugins from "./plugins";
import typography from "./typography";

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
