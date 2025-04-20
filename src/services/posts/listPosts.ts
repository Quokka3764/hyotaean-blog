import { supabaseClient } from "@/lib/supabaseClient";
import * as readline from "readline";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostWithTags } from "@/types/database";
import type { PostCardProps } from "@/types/posts";

import { fetchPost } from "./fetchPost";

// Supabase 결과를 CLI용 형태로 변환
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

export async function listPosts(): Promise<PostCardProps[]> {
  try {
    console.log("Supabase에서 포스트 목록 가져오는 중...");
    const { data, error } = (await supabaseClient.rpc("get_all_posts")) as {
      data: PostWithTags[] | null;
      error: PostgrestError | null;
    };
    if (error) throw error;

    const posts = transformPosts(data);
    console.log("=== 블로그 포스트 목록 ===");
    posts.forEach((p, i) => console.log(`${i + 1}. ${p.title} (${p.slug})`));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("가져올 포스트의 번호를 입력하세요: ", async (answer) => {
      const idx = parseInt(answer, 10) - 1;
      if (idx >= 0 && idx < posts.length) {
        console.log(`선택된 포스트: ${posts[idx].title}`);
        try {
          await fetchPost(posts[idx].slug);
          console.log("포스트 가져오기 완료");
        } catch {
          console.error("포스트 가져오기 실패");
        }
      } else {
        console.log("잘못된 번호입니다.");
      }
      rl.close();
    });

    return posts;
  } catch (err) {
    console.error("포스트 목록 가져오기 오류:", err);
    throw err;
  }
}

if (require.main === module) {
  listPosts().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
