// scripts/db/tagProcessor.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const BATCH_SIZE = 5;

/**
 * 태그를 처리하고 포스트-태그 연결을 수행합니다.
 * @param postSlug - 포스트의 슬러그
 * @param tags - 태그 이름 배열
 * @param supabase - Supabase 클라이언트 인스턴스
 */
export async function processPostTags(
  postSlug: string,
  tags: string[],
  supabase: SupabaseClient<Database>
): Promise<void> {
  try {
    // 포스트 ID 조회
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", postSlug)
      .single();

    if (postError || !postData) {
      throw new Error(
        `포스트 ID 조회 실패: ${postError?.message || "데이터 없음"}`
      );
    }

    const postId = postData.id;

    // 태그 중복 제거 및 공백 제거
    const uniqueTags = Array.from(
      new Set(tags.map((tag) => tag.trim()).filter(Boolean))
    );

    // 배치 처리
    for (let i = 0; i < uniqueTags.length; i += BATCH_SIZE) {
      const tagBatch = uniqueTags.slice(i, i + BATCH_SIZE);

      await Promise.all(
        tagBatch.map(async (tagName) => {
          try {
            // 태그 저장: upsert 후, 체인된 .select()로 결과 데이터를 조회합니다.
            const { data: tagData, error: tagError } = await supabase
              .from("tags")
              .upsert({ name: tagName }, { onConflict: "name" })
              .select();

            if (tagError || !tagData || tagData.length === 0) {
              throw new Error(
                `태그 저장 실패: ${tagError?.message || "데이터 없음"}`
              );
            }

            const tagId = tagData[0].id;

            // 포스트-태그 연결: 포스트와 태그의 관계를 생성합니다.
            const { error: linkError } = await supabase
              .from("post_tags")
              .upsert([{ post_id: postId, tag_id: tagId }], {
                onConflict: "post_id,tag_id",
              });
            if (linkError) {
              throw new Error(`포스트-태그 연결 실패: ${linkError.message}`);
            }
          } catch (error) {
            console.error(
              `태그 처리 실패 (${tagName}):`,
              error instanceof Error ? error.message : String(error)
            );
          }
        })
      );
    }
  } catch (error) {
    console.error(
      `태그 처리 전체 실패 (${postSlug}):`,
      error instanceof Error ? error.message : String(error)
    );
  }
}
