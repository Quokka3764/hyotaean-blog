module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  safelist: ["animate-rotate-y-in", "animate-fade-in-up"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      colors: {
        "light-bg": "#f9fafb",
        "light-text": "#111827",
        "dark-bg": "#0f0f0f",
        "dark-text": "#f3f4f6",
      },

      backgroundImage: {
        "space-pattern": "url('/images/space-pattern.png')",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rotateYIn: {
          "0%": { opacity: "0", transform: "rotateY(90deg)" },
          "100%": { opacity: "1", transform: "rotateY(0deg)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 1.0s ease-out forwards",
        "rotate-y-in": "rotateYIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
