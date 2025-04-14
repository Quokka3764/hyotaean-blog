import fs from "fs";
import path from "path";
import { getPostBySlug } from "@/lib/posts";

// 로컬 저장 경로 설정
const postsDirectory = path.join(process.cwd(), "src/contents/posts");
const editFilePath = path.join(process.cwd(), "src/contents/posts/edit.md");

/**
 * buildMarkdownContent
 * - 입력 받은 post 데이터를 기반으로 YAML frontmatter와 본문을 하나의 Markdown 문자열로 구성하기
 * - getPostBySlug가 반환하는 객체의 구조는 { frontmatter: { title, date, excerpt?, thumbnail?, tags? }, content }
 */
function buildMarkdownContent(postData: {
  frontmatter: {
    title: string;
    date: string;
    excerpt?: string;
    thumbnail?: string;
    tags?: string[];
  };
  content: string;
}): string {
  const { frontmatter, content } = postData;
  // 기본값 할당: tags는 undefined일 수 있으므로 빈 배열을 기본값으로 사용하기
  const tags = frontmatter.tags ?? [];
  return `---
title: "${frontmatter.title}"
date: "${frontmatter.date}"
excerpt: "${frontmatter.excerpt || ""}"
thumbnail: "${frontmatter.thumbnail || ""}"
tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]
---

${content}`;
}

/**
 * saveContent
 * - 지정한 filePath에 content를 저장
 * - 상위 디렉토리가 존재하지 않을 경우 생성
 */
function saveContent(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

/**
 * fetchPost
 * - Supabase에서 slug에 해당하는 게시글 데이터를 가져옴
 *   edit.md 파일과 수정하려는 md파일 두군 데에 내용이 불러와짐
 */
export async function fetchPost(slug: string): Promise<void> {
  try {
    console.log(`Fetching post "${slug}" from Supabase...`);

    // Supabase에서 게시글 데이터를 가져옴
    const postData = await getPostBySlug(slug);
    if (!postData || !postData.content) {
      console.error(`Error: Post "${slug}" not found or content is missing.`);
      process.exit(1);
    }

    // Markdown 콘텐츠 구성
    const markdownContent = buildMarkdownContent(postData);

    // 디렉토리 내 md 파일 순회 및 처리
    const mdFiles = fs
      .readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".md") && file !== "edit.md");

    // 기존 md 파일 삭제
    for (const file of mdFiles) {
      const filePath = path.join(postsDirectory, file);

      // 파일 존재 확인 후 삭제
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`기존 파일 삭제: ${filePath}`);
      }
    }

    // 새 포스트 파일 저장
    const postFilePath = path.join(postsDirectory, `${slug}.md`);
    saveContent(postFilePath, markdownContent);
    console.log(`Post "${slug}" saved to ${postFilePath}.`);

    // edit.md 에도 저장
    saveContent(editFilePath, markdownContent);
    console.log(`Backup for post "${slug}" saved to ${editFilePath}.`);
  } catch (error) {
    console.error("An error occurred while fetching the post:", error);
    process.exit(1);
  }
}
