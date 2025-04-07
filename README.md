#  Hyotaean Blog

> **Next.js + TailwindCSS 기반의 마크다운 블로그 프로젝트**

Next.js, React, TailwindCSS를 활용하여 구축한 개발자 블로그 프로젝트입니다.
마크다운으로 컨텐츠를 작성하고 관리하며, 코드 하이라이팅을 지원해 개발 관련 포스팅에 최적화되어 있습니다. 

---

## 프로젝트 개요

- **기술 스택**: Next.js 15, React 18.3, TailwindCSS, TypeScript
- **마크다운 지원**: `react-markdown`, `gray-matter`를 활용한 정적 블로그
- **코드 하이라이팅**: `rehype-prism-plus` 적용
- **날짜 포맷**: `date-fns` 활용
- **SEO-friendly URL**: `slugify` 적용

---

## **설치된 패키지 목록**

### **기본 프레임워크**

| 패키지      | 설명       |
| ----------- | ---------- |
| `next`      | Next.js 15 |
| `react`     | React 18.3  |
| `react-dom` | React DOM  |

### **스타일링**

| 패키지                 | 설명             |
| ---------------------- | ---------------- |
| `tailwindcss`          | TailwindCSS 4    |
| `@tailwindcss/postcss` | PostCSS 플러그인 |

### **마크다운 처리**

| 패키지              | 설명                          |
| ------------------- | ----------------------------- |
| `gray-matter`       | YAML Frontmatter 파싱         |
| `react-markdown`    | 마크다운 렌더링               |
| `remark-gfm`        | GitHub Flavored Markdown 지원 |
| `rehype-prism-plus` | 코드블록 하이라이팅           |

### **기능 추가**

| 패키지     | 설명                           |
| ---------- | ------------------------------ |
| `date-fns` | 날짜 포맷 처리                 |
| `slugify`  | 제목을 SEO-friendly URL로 변환 |

### **애니메이션**

| 패키지          | 설명                      |
| --------------- | ------------------------- |
| `framer-motion` | 애니메이션 및 인터랙션 처리 |

### **개발 도구**

| 패키지               | 설명                  |
| -------------------- | --------------------- |
| `typescript`         | TypeScript 지원       |
| `eslint`             | 린팅 툴               |
| `eslint-config-next` | Next.js용 ESLint 설정 |

---
