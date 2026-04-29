import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Cabinet — five values, that's it.
        ink: "hsl(40 11% 5%)", //          #0F0E0C — the walls
        slate: "hsl(33 12% 13%)", //       #28241F — the surfaces
        "slate-2": "hsl(33 11% 17%)", //   slightly elevated
        hairline: "hsl(35 10% 22%)", //    #3A352F — the grid
        paper: "hsl(38 30% 90%)", //       #EFE8DC — type
        "paper-soft": "hsl(38 18% 70%)", //   secondary type
        "paper-dim": "hsl(38 12% 50%)", //    tertiary type
        brass: "hsl(38 49% 60%)", //       #C9A66B — the only break
        "brass-bright": "hsl(38 65% 72%)", //  hot brass
        "brass-dim": "hsl(38 35% 45%)", //     warm brass

        // Legacy aliases — every old token still resolves to a Cabinet value.
        border: "hsl(35 10% 22%)",
        background: "hsl(40 11% 5%)",
        foreground: "hsl(38 30% 90%)",
        muted: "hsl(33 11% 17%)",
        "muted-foreground": "hsl(38 18% 70%)",
        "muted-ink": "hsl(38 18% 70%)",
        "ink-soft": "hsl(38 22% 80%)",
        accent: "hsl(33 11% 17%)",
        primary: "hsl(38 49% 60%)",
        "primary-foreground": "hsl(40 11% 5%)",
        card: "hsl(33 12% 13%)",
        "paper-2": "hsl(33 11% 17%)",
        "paper-3": "hsl(33 11% 21%)",
        // Old palette names collapse to in-cabinet equivalents.
        oxblood: "hsl(38 65% 72%)", //      "danger" → hot brass
        moss: "hsl(38 49% 60%)", //         "good" → brass
        ochre: "hsl(38 35% 45%)", //        "warn" → warm brass
        "slate-quiet": "hsl(38 18% 70%)", // "info" → paper-soft
        "ink-deep": "hsl(40 11% 4%)",
        "ink-card": "hsl(33 12% 13%)",
        "brass-soft": "hsl(38 35% 45%)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "Inter",
          "sans-serif",
        ],
      },
      letterSpacing: {
        eyebrow: "0.18em",
        masthead: "0.32em",
      },
      boxShadow: {
        paper:
          "0 0 0 1px hsl(35 10% 22%), 0 1px 0 0 hsl(40 11% 4%)",
        leaf: "0 24px 64px -32px hsl(0 0% 0% / 0.6)",
        brass: "0 0 0 1px hsl(38 49% 60% / 0.4)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "rule-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        // The Dossier Open — the brass hairline sweeping the page.
        "sweep-in": {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
        "sweep-out": {
          "0%": { transform: "scaleX(1)", opacity: "1" },
          "100%": { transform: "scaleX(0)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        fade: "fade 900ms ease-out both",
        "fade-down":
          "fade-down 700ms 200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
        glow: "glow 5s ease-in-out infinite",
        "rule-in":
          "rule-in 900ms 200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "sweep-in":
          "sweep-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
