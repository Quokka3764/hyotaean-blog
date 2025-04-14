// src/services/posts/listPosts.ts
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import { fetchPost } from "./fetchPost"; // fetchPost 함수 직접 import

// 환경변수 로드 로직 (이전과 동일)
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContents = fs.readFileSync(envPath, "utf8");
  envContents.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim().replace(/^(['"])(.+)\1$/, "$2");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

import { getAllPosts } from "@/lib/posts";

export async function listPosts() {
  try {
    console.log("Supabase에서 포스트 목록 가져오는 중...");
    const posts = await getAllPosts();
    console.log("=== 블로그 포스트 목록 ===");
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.frontmatter.title} (${post.slug})`);
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
          console.log(`선택된 포스트: ${selectedPost.frontmatter.title}`);

          try {
            // fetchPost 함수 직접 실행
            await fetchPost(selectedPost.slug);
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

// 테스트용 엔트리 포인트 추가 (직접 실행 시 listPosts 함수가 실행됨)
if (require.main === module) {
  listPosts().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
