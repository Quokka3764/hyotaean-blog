import { cache } from "react";
import { getSupabaseClient } from "./supabaseClient";
import type { PostWithTags } from "@/types/database";
import type { PostCardProps } from "@/types/posts";
import { postTransformers } from "@/utils/postTransformers";
import { PostgrestError } from "@supabase/supabase-js";

export const getAllPosts = cache(async function getAllPosts(): Promise<
  PostCardProps[]
> {
  const supabase = getSupabaseClient();
  const { data, error } = (await supabase.rpc("get_all_posts")) as {
    data: PostWithTags[] | null;
    error: PostgrestError | null;
  };

  if (error) throw error;

  return postTransformers(data);
});

export const getPostsByTagServer = cache(async function getPostsByTagServer(
  tag: string
): Promise<PostCardProps[]> {
  const supabase = getSupabaseClient();
  let data: PostWithTags[] | null;
  let error: PostgrestError | null;

  if (tag === "All") {
    // 모든 포스트를 가져오는 로직 재사용
    return getAllPosts();
  } else {
    ({ data, error } = await supabase
      .from("posts")
      .select("*")
      .contains("tags", [tag]));
  }

  if (error) throw error;

  return postTransformers(data);
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
