// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
//   ],
//   darkMode: "class",
// };

//5열 레이아웃 설정

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//       screens: {
//         "3xl": "1920px", // 1920px 이상의 화면에서 3xl 적용
//       },
//     },
//   },
// };

// next-themes 적용

// tailwind.config.mjs
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//       screens: {
//         "3xl": "1920px",
//       },
//       colors: {
//         "light-bg": "#f9fafb", // Tailwind의 gray-50와 유사
//         "light-text": "#111827", // Tailwind의 gray-900와 유사
//         "dark-bg": "#0f1729", // 기존에 사용하던 dark 배경 색상
//         "dark-text": "#f3f4f6", // Tailwind의 gray-100와 유사
//       },
//       backgroundImage: {
//         "space-pattern": "url('/images/space-pattern.png')", // 실제 이미지 경로에 맞게 수정
//       },
//       keyframes: {
//         fadeInUp: {
//           "0%": { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         rotateYIn: {
//           "0%": { opacity: "0", transform: "rotateY(90deg)" },
//           "100%": { opacity: "1", transform: "rotateY(0deg)" },
//         },
//       },
//       animation: {
//         "fade-in-up": "fadeInUp 0.4s ease-out forwards",
//         "rotate-y-in": "rotateYIn 0.5s ease-out forwards",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      colors: {
        "light-bg": "#f9fafb",
        "light-text": "#111827",
        "dark-bg": "#0f1729",
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
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "rotate-y-in": "rotateYIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
