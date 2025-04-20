import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import { supabaseClient } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostWithTags } from "@/types/database";
import type { PostCardProps } from "@/types/posts";

// 직접 구현한 포스트 변환 함수
function transformPosts(posts: PostWithTags[] | null): PostCardProps[] {
  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt || "",
    tags: post.tags || [],
    thumbnail: post.thumbnail || "",
  }));
}

// getPostBySlug 함수를 직접 구현 (React cache 없이)
async function getPostBySlugDirect(slug: string) {
  try {
    const { data, error } = (await supabaseClient.rpc("get_post_by_slug", {
      post_slug: slug,
    })) as {
      data: PostWithTags[] | null;
      error: PostgrestError | null;
    };

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(`${slug} 포스트를 찾을 수 없습니다.`);
    }

    const post = data[0];

    // 데이터 포맷팅
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
  } catch (error) {
    console.error(`${slug} 포스트 가져오기 오류:`, error);
    throw error;
  }
}

// fetchPost 함수를 직접 구현 (기존 fetchPost.ts와 유사)
async function fetchPostDirect(slug: string): Promise<void> {
  try {
    console.log(`Fetching post "${slug}" from Supabase...`);

    // 직접 구현한 함수 사용
    const postData = await getPostBySlugDirect(slug);
    if (!postData || !postData.content) {
      console.error(`Error: Post "${slug}" not found or content is missing.`);
      process.exit(1);
    }

    // Markdown 콘텐츠 구성
    const markdownContent = buildMarkdownContent(postData);

    // 로컬 저장 경로 설정
    const postsDirectory = path.join(process.cwd(), "src/contents/posts");
    const editFilePath = path.join(process.cwd(), "src/contents/posts/edit.md");

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

// 기존 fetchPost.ts에서 가져온 유틸리티 함수들
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

function saveContent(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

export async function listPosts() {
  try {
    console.log("Supabase에서 포스트 목록 가져오는 중...");

    // supabaseClient 직접 사용
    const { data, error } = (await supabaseClient.rpc("get_all_posts")) as {
      data: PostWithTags[] | null;
      error: PostgrestError | null;
    };

    if (error) throw error;

    const posts = transformPosts(data);

    console.log("=== 블로그 포스트 목록 ===");
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug})`);
    });

    // 사용자 입력 대기
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "가져올 포스트의 번호를 입력하세요 (1-15): ",
      async (answer) => {
        const selectedIndex = parseInt(answer) - 1;

        if (selectedIndex >= 0 && selectedIndex < posts.length) {
          const selectedPost = posts[selectedIndex];
          console.log(`선택된 포스트: ${selectedPost.title}`);

          try {
            // 직접 구현한 함수 사용
            await fetchPostDirect(selectedPost.slug);
            console.log("포스트 가져오기 완료");
          } catch (error) {
            console.error("포스트 가져오기 실패:", error);
          }

          rl.close();
        } else {
          console.log("잘못된 번호입니다.");
          rl.close();
        }
      }
    );

    return posts;
  } catch (error) {
    console.error("포스트 목록 가져오기 오류:", error);
    throw error;
  }
}

// 테스트용 엔트리 포인트 추가
if (require.main === module) {
  listPosts().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
