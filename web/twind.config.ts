import presetTailwind from "@twind/preset-tailwind";
import type { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {
      sans: ["Jost", "Helvetica", "sans-serif"],
    },
  },
  presets: [
    presetTailwind(),
  ],
} as Options;