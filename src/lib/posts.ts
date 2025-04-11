import { PostgrestError } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabaseClient";
import { PostWithTags } from "@/types/database";
import { cache } from "react";

// 모든 포스트 정보 가져오기 (캐싱 적용)
export const getAllPosts = cache(async () => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = (await supabase.rpc("get_all_posts")) as {
      data: PostWithTags[] | null;
      error: PostgrestError | null;
    };

    if (error) throw error;
    if (!data) return [];

    // 원래 형식과 유사하게 데이터 변환
    return data.map((post) => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        date: post.date,
        excerpt: post.excerpt || "",
        thumbnail: post.thumbnail || "",
        tags: post.tags || [],
      },
    }));
  } catch (error) {
    console.error("포스트 목록 가져오기 오류:", error);
    throw error;
  }
});

// 특정 슬러그의 포스트 정보 가져오기
export async function getPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = (await supabase.rpc("get_post_by_slug", {
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
