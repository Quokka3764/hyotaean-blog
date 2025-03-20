// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
//   ],
//   darkMode: "class", // 다크 모드 활성화
//   theme: {
//     extend: {
//       typography: (theme) => ({
//         DEFAULT: {
//           css: {
//             color: "var(--tw-prose-body)",
//             maxWidth: "none",
//             h1: {
//               color: "var(--tw-prose-headings)",
//               fontWeight: "800",
//               fontSize: "2.25em",
//               marginTop: "0",
//               marginBottom: "0.8888889em",
//               lineHeight: "1.1111111",
//             },
//             h2: {
//               color: "var(--tw-prose-headings)",
//               fontWeight: "700",
//               fontSize: "1.5em",
//               marginTop: "2em",
//               marginBottom: "1em",
//               lineHeight: "1.3333333",
//             },
//             h3: {
//               color: "var(--tw-prose-headings)",
//               fontWeight: "600",
//               fontSize: "1.25em",
//               marginTop: "1.6em",
//               marginBottom: "0.6em",
//               lineHeight: "1.6",
//             },
//             p: {
//               marginTop: "1.25em",
//               marginBottom: "1.25em",
//             },
//             li: {
//               marginTop: "0.5em",
//               marginBottom: "0.5em",
//             },
//             "ul > li": {
//               paddingLeft: "1.75em",
//               position: "relative",
//             },
//             "ul > li::before": {
//               content: '""',
//               width: "0.375em",
//               height: "0.375em",
//               position: "absolute",
//               top: "calc(0.875em - 0.1875em)",
//               left: "0.25em",
//               borderRadius: "50%",
//               backgroundColor: "var(--tw-prose-bullets)",
//             },
//             code: {
//               color: "var(--tw-prose-code)",
//               backgroundColor: "var(--tw-prose-code-bg)",
//               padding: "0.25em 0.4em",
//               borderRadius: "0.25rem",
//               fontWeight: "500",
//             },
//             "code::before": {
//               content: '""',
//             },
//             "code::after": {
//               content: '""',
//             },
//             blockquote: {
//               fontWeight: "500",
//               fontStyle: "italic",
//               color: "var(--tw-prose-quotes)",
//               borderLeftWidth: "0.25rem",
//               borderLeftColor: "var(--tw-prose-quote-borders)",
//               paddingLeft: "1em",
//             },
//           },
//         },
//         // 다크 모드 설정 - 명시적인 색상값 지정
//         invert: {
//           css: {
//             color: theme("colors.gray.300"),
//             a: {
//               color: theme("colors.blue.400"),
//               "&:hover": {
//                 color: theme("colors.blue.300"),
//               },
//             },
//             h1: {
//               color: theme("colors.white"),
//             },
//             h2: {
//               color: theme("colors.white"),
//             },
//             h3: {
//               color: theme("colors.white"),
//             },
//             h4: {
//               color: theme("colors.white"),
//             },
//             blockquote: {
//               color: theme("colors.gray.300"),
//               borderLeftColor: theme("colors.gray.700"),
//             },
//             "ul > li::before": {
//               backgroundColor: theme("colors.gray.500"),
//             },
//             strong: {
//               color: theme("colors.white"),
//             },
//             code: {
//               color: theme("colors.white"),
//               backgroundColor: theme("colors.gray.800"),
//             },
//             pre: {
//               backgroundColor: theme("colors.gray.900"),
//             },
//           },
//         },
//       }),
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
// };

import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  darkMode: false, // 다크 모드 사용 안함
  safelist: ["prose", "prose-lg"], // 다크모드 관련 클래스는 필요 없음
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // 어두운 배경에 어울리는 밝은 텍스트 색상 설정
            color: "#d1d5db", // 본문 텍스트: 밝은 회색
            maxWidth: "none",
            h1: {
              color: "#ffffff", // H1은 흰색
              fontWeight: "800",
              fontSize: "2.25em",
            },
            h2: {
              color: "#f3f4f6", // H2는 약간 덜 밝은 흰색
              fontWeight: "700",
              fontSize: "1.5em",
              marginTop: "2em",
              marginBottom: "1em",
              lineHeight: "1.3333333",
            },
            h3: {
              color: "#f3f4f6",
              fontWeight: "600",
              fontSize: "1.25em",
              marginTop: "1.6em",
              marginBottom: "0.6em",
              lineHeight: "1.6",
            },
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            li: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            "ul > li": {
              paddingLeft: "1.75em",
              position: "relative",
            },
            "ul > li::before": {
              content: '""',
              width: "0.375em",
              height: "0.375em",
              position: "absolute",
              top: "calc(0.875em - 0.1875em)",
              left: "0.25em",
              borderRadius: "50%",
              backgroundColor: "#9ca3af", // 리스트 아이콘 색상
            },
            code: {
              color: "#f9fafb",
              backgroundColor: "#374151",
              padding: "0.25em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "500",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            blockquote: {
              fontWeight: "500",
              fontStyle: "italic",
              color: "#e5e7eb",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "#4b5563",
              paddingLeft: "1em",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
