import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    fontSize: {
      xs: [
        "0.75rem",
        {
          lineHeight: "1.5",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.6",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.75",
        },
      ],
      lg: [
        "1.125rem",
        {
          lineHeight: "1.8",
        },
      ],
      xl: [
        "1.25rem",
        {
          lineHeight: "1.8",
        },
      ],
      "2xl": [
        "1.5rem",
        {
          lineHeight: "1.85",
        },
      ],
      "3xl": [
        "1.875rem",
        {
          lineHeight: "1.85",
        },
      ],
      "4xl": [
        "2.25rem",
        {
          lineHeight: "1.75",
        },
      ],
      "5xl": [
        "3rem",
        {
          lineHeight: "1.5",
        },
      ],
      "6xl": [
        "3.75rem",
        {
          lineHeight: "1.4",
        },
      ],
    },
    container: {
      center: true,
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      screens: {
        "4xs": "300px",
        "3xs": "320px",
        "2xs": "375px",
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          main: "var(--main-surface-background)",
          message: "var(--message-surface)",
          sidebar: "var(--sidebar-surface)",
          "sidebar-floating": "var(--sidebar-surface-floating)",
        },
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          750: "var(--gray-750)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
        brand: {
          purple: "var(--brand-purple)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "spring-bounce": {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spring-bounce":
          "spring-bounce var(--spring-bounce-duration) cubic-bezier(0.37, 0, 0.63, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
