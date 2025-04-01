// scripts/utils/markdownParser.ts

import matter from "gray-matter";
import slugify from "slugify";
import path from "path";

/**
 * 마크다운 파일의 프론트매터에서 필요한 정보를 추출하기 위한 타입입니다.
 */
export interface PostFrontmatter {
  title: string;
  date?: string;
  thumbnail?: string;
  tags?: string[];
  excerpt?: string;
  [key: string]: unknown;
}

/**
 * 마크다운 콘텐츠를 파싱하여 프론트매터와 마크다운 본문을 분리합니다.
 * @param content - 마크다운 파일의 전체 텍스트
 * @returns { frontmatter, markdownContent } 객체
 */
export function parseMarkdownContent(content: string): {
  frontmatter: PostFrontmatter;
  markdownContent: string;
} {
  const parsed = matter(content);

  const frontmatter: PostFrontmatter = {
    title: typeof parsed.data.title === "string" ? parsed.data.title : "",
    date: typeof parsed.data.date === "string" ? parsed.data.date : undefined,
    thumbnail:
      typeof parsed.data.thumbnail === "string"
        ? parsed.data.thumbnail
        : undefined,
    excerpt:
      typeof parsed.data.excerpt === "string" ? parsed.data.excerpt : undefined,
  };

  // tags 필드는 배열로 처리
  if (Array.isArray(parsed.data.tags)) {
    frontmatter.tags = parsed.data.tags.filter(
      (tag): tag is string => typeof tag === "string"
    );
  }

  // title, date, thumbnail, excerpt, tags 이외의 필드를 모두 복사
  for (const [key, value] of Object.entries(parsed.data)) {
    if (!["title", "date", "thumbnail", "excerpt", "tags"].includes(key)) {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, markdownContent: parsed.content };
}

/**
 * 파일 경로와 선택적으로 전달된 제목을 이용하여 유효한 슬러그를 생성합니다.
 * @param filePath - 마크다운 파일 경로
 * @param title - (선택) 프론트매터의 제목
 * @returns 유효한 슬러그 문자열
 */
export function generateValidSlug(filePath: string, title?: string): string {
  const fileSlug = path.basename(filePath, ".md");
  const titleSlug = title ? slugify(title, { lower: true, strict: true }) : "";
  const slug = fileSlug || titleSlug;

  if (!slug) {
    throw new Error(`유효한 슬러그를 생성할 수 없습니다: ${filePath}`);
  }

  return slug;
}
