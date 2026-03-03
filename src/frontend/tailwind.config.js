import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        figtree: ["Figtree", "system-ui", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // Gratitude-specific semantic tokens
        sage: {
          50:  "oklch(0.97 0.02  145)",
          100: "oklch(0.93 0.03  145)",
          200: "oklch(0.86 0.055 150)",
          300: "oklch(0.76 0.085 152)",
          400: "oklch(0.64 0.1   153)",
          500: "oklch(0.52 0.09  155)",
          600: "oklch(0.42 0.09  155)",
        },
        blush: {
          50:  "oklch(0.97 0.02   10)",
          100: "oklch(0.93 0.04   10)",
          200: "oklch(0.87 0.07   12)",
          300: "oklch(0.78 0.1    12)",
        },
        cream: {
          50:  "oklch(0.99 0.005 85)",
          100: "oklch(0.97 0.012 85)",
          200: "oklch(0.93 0.018 75)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 oklch(0.3 0.03 60 / 0.06)",
        sm: "0 2px 6px 0 oklch(0.3 0.03 60 / 0.08)",
        md: "0 4px 14px 0 oklch(0.3 0.03 60 / 0.10)",
        lg: "0 8px 24px 0 oklch(0.3 0.03 60 / 0.12)",
        card: "0 2px 8px oklch(0.3 0.03 60 / 0.07), 0 1px 2px oklch(0.3 0.03 60 / 0.05)",
        "card-hover": "0 6px 20px oklch(0.3 0.03 60 / 0.12), 0 2px 4px oklch(0.3 0.03 60 / 0.06)",
        glow: "0 0 20px oklch(0.52 0.09 155 / 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
