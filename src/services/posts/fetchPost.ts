import fs from "fs";
import path from "path";
import { supabaseClient } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostWithTags } from "@/types/database";

// 공통 경로 상수
export const POSTS_DIR = path.join(process.cwd(), "src/contents/posts");
export const EDIT_FILE = path.join(POSTS_DIR, "edit.md");

// frontmatter + 본문 합치기
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

// 파일 저장
function saveContent(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

// 기존 .md 파일 삭제 유틸
function clearOldPosts(
  directory: string,
  exclude: string[] = ["edit.md"]
): void {
  const files = fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".md") && !exclude.includes(f));
  for (const file of files) {
    const full = path.join(directory, file);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      console.log(`기존 파일 삭제: ${full}`);
    }
  }
}

// Supabase에서 단일 포스트 데이터 가져오기 (RPC)
async function getPostData(slug: string) {
  const { data, error } = (await supabaseClient.rpc("get_post_by_slug", {
    post_slug: slug,
  })) as { data: PostWithTags[] | null; error: PostgrestError | null };

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(`${slug} 포스트를 찾을 수 없습니다.`);
  }

  const post = data[0];
  return {
    frontmatter: {
      title: post.title,
      date: post.date,
      excerpt: post.excerpt || "",
      thumbnail: post.thumbnail || "",
      tags: post.tags || [],
    },
    content: post.content,
  };
}

// 실제 파일 생성 흐름
export async function fetchPost(slug: string): Promise<void> {
  try {
    console.log(`Fetching post "${slug}" from Supabase...`);

    const postData = await getPostData(slug);
    const markdown = buildMarkdownContent(postData);

    // 기존 파일 정리
    clearOldPosts(POSTS_DIR);

    // 새 파일 저장
    const postPath = path.join(POSTS_DIR, `${slug}.md`);
    saveContent(postPath, markdown);
    console.log(`Post "${slug}" saved to ${postPath}.`);

    // edit.md 백업
    saveContent(EDIT_FILE, markdown);
    console.log(`Backup for post "${slug}" saved to ${EDIT_FILE}.`);
  } catch (err) {
    console.error("An error occurred while fetching the post:", err);
    process.exit(1);
  }
}
