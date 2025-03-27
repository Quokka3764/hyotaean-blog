// import typography from "@tailwindcss/typography";

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
//   ],
//   darkMode: false, // 다크 모드 사용 안함
//   safelist: ["prose", "prose-lg"], // 다크모드 관련 클래스는 필요 없음
//   theme: {
//     extend: {
//       typography: {
//         DEFAULT: {
//           css: {
//             // 어두운 배경에 어울리는 밝은 텍스트 색상 설정
//             color: "#d1d5db", // 본문 텍스트: 밝은 회색
//             maxWidth: "none",
//             h1: {
//               color: "#ffffff", // H1은 흰색
//               fontWeight: "800",
//               fontSize: "2.25em",
//             },
//             h2: {
//               color: "#f3f4f6", // H2는 약간 덜 밝은 흰색
//               fontWeight: "700",
//               fontSize: "1.5em",
//               marginTop: "2em",
//               marginBottom: "1em",
//               lineHeight: "1.3333333",
//             },
//             h3: {
//               color: "#f3f4f6",
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
//               backgroundColor: "#9ca3af", // 리스트 아이콘 색상
//             },
//             code: {
//               color: "#f9fafb",
//               backgroundColor: "#374151",
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
//               color: "#e5e7eb",
//               borderLeftWidth: "0.25rem",
//               borderLeftColor: "#4b5563",
//               paddingLeft: "1em",
//             },
//           },
//         },
//       },
//     },
//   },
//   plugins: [typography],
// };

//다크모드 적용 시작

import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  darkMode: "class", // 'false'에서 'class'로 변경
  safelist: ["prose", "prose-lg", "dark"], // 'dark' 클래스 추가
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          // 라이트 모드 기본 스타일
          css: {
            color: "#1f2937", // 라이트 모드 본문 색상
            h1: {
              color: "#111827", // 라이트 모드 제목 색상
              fontWeight: "800",
              fontSize: "2.25em",
            },
            h2: {
              color: "#1f2937", // 라이트 모드 H2 색상
              fontWeight: "700",
              fontSize: "1.5em",
              marginTop: "2em",
              marginBottom: "1em",
              lineHeight: "1.3333333",
            },
            h3: {
              color: "#1f2937", // 라이트 모드 H3 색상
              fontWeight: "600",
              fontSize: "1.25em",
              marginTop: "1.6em",
              marginBottom: "0.6em",
              lineHeight: "1.6",
            },
            code: {
              color: "#1f2937",
              backgroundColor: "#f3f4f6",
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
              color: "#4b5563",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "#e5e7eb",
              paddingLeft: "1em",
            },
            // 다른 라이트 모드 스타일 추가
          },
        },
        dark: {
          // 다크 모드 스타일
          css: {
            color: "#d1d5db", // 다크 모드 본문 색상
            h1: {
              color: "#ffffff", // 다크 모드 H1 색상
              fontWeight: "800",
            },
            h2: {
              color: "#f3f4f6", // 다크 모드 H2 색상
              fontWeight: "700",
              fontSize: "1.5em",
              marginTop: "2em",
              marginBottom: "1em",
              lineHeight: "1.3333333",
            },
            h3: {
              color: "#f3f4f6", // 다크 모드 H3 색상
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
