// import fs from "fs/promises";
// import { SupabaseClient } from "@supabase/supabase-js";
// import { Database, PostInsert } from "@/types/database";
// import {
//   parseMarkdownContent,
//   generateValidSlug,
// } from "../utils/markdownParser";
// import { resetFileToTemplate } from "../utils/fileReset";
// import { processPostTags } from "./tagProcessor";
// import imageProcessor from "../utils/imageProcessor";

// export async function postProcessor(
//   filePath: string,
//   supabase: SupabaseClient<Database>
// ): Promise<void> {
//   try {
//     // 파일 읽기 및 마크다운 파싱
//     const content = await fs.readFile(filePath, "utf-8");
//     const { frontmatter, markdownContent } = parseMarkdownContent(content);
//     const { processImages, uploadThumbnail } = imageProcessor;

//     // 이미지 처리: 마크다운 본문에 있는 로컬 이미지 업로드 후 URL 대체
//     const processedContent = await processImages(
//       markdownContent,
//       filePath,
//       supabase
//     );

//     // 썸네일 처리: frontmatter.thumbnail이 있을 경우에만 업로드, 없으면 null로 지정
//     let processedThumbnail: string | null = null;
//     if (frontmatter.thumbnail) {
//       processedThumbnail = await uploadThumbnail(
//         frontmatter.thumbnail,
//         filePath,
//         supabase
//       );
//     }

//     // 슬러그 생성 (파일명과 frontmatter의 title 기반)
//     const slug = generateValidSlug(filePath, frontmatter.title);

//     // 포스트 데이터 구성 (PostInsert 타입에 맞게)
//     const post: PostInsert = {
//       title: frontmatter.title,
//       slug,
//       content: processedContent,
//       excerpt: frontmatter.excerpt ?? null,
//       thumbnail: processedThumbnail,
//       date: frontmatter.date ?? new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };

//     // Supabase에 포스트 데이터 upsert (슬러그 기준)
//     const { error } = await supabase
//       .from("posts")
//       .upsert(post, { onConflict: "slug" });

//     if (error) {
//       throw new Error(`포스트 저장 실패: ${error.message}`);
//     }

//     console.log(`포스트 저장 성공: ${slug}`);

//     // 태그 처리
//     if (
//       frontmatter.tags &&
//       Array.isArray(frontmatter.tags) &&
//       frontmatter.tags.length > 0
//     ) {
//       await processPostTags(slug, frontmatter.tags, supabase);
//     }

//     // 파일 내용을 템플릿으로 초기화
//     await resetFileToTemplate(filePath);
//   } catch (error) {
//     console.error(
//       `파일 처리 실패 (${filePath}):`,
//       error instanceof Error ? error.message : String(error)
//     );
//   }
// }

//이미지 저장방식 변경

import fs from "fs/promises";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, PostInsert } from "@/types/database";
import {
  parseMarkdownContent,
  generateValidSlug,
} from "../utils/markdownParser";
import { resetFileToTemplate } from "../utils/fileReset";
import { processPostTags } from "./tagProcessor";
import imageProcessor from "../utils/imageProcessor";

export async function postProcessor(
  filePath: string,
  supabase: SupabaseClient<Database>
): Promise<void> {
  try {
    // 파일 읽기 및 마크다운 파싱
    const content = await fs.readFile(filePath, "utf-8");
    const { frontmatter, markdownContent } = parseMarkdownContent(content);
    const { processImages, uploadThumbnail, isSupabaseStorageUrl } =
      imageProcessor;

    // 슬러그 생성 (파일명과 frontmatter의 title 기반)
    const slug = generateValidSlug(filePath, frontmatter.title);

    // 기존 포스트 데이터 조회 (수정 모드 확인)
    const { data: existingPost } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    // 이미지 처리: 마크다운 본문에 있는 로컬 이미지 업로드 후 URL 대체
    const processedContent = await processImages(
      markdownContent,
      filePath,
      supabase
    );

    // 썸네일 처리: 기존 썸네일 URL 전달하여 변경 여부 확인
    let processedThumbnail: string | null = null;
    if (frontmatter.thumbnail) {
      // 기존 썸네일 URL 전달 (있는 경우)
      const oldThumbnailUrl = existingPost?.thumbnail || null;

      // 썸네일 URL이 이미 Supabase URL이고 변경되지 않았으면 그대로 사용
      if (
        frontmatter.thumbnail === oldThumbnailUrl &&
        isSupabaseStorageUrl(oldThumbnailUrl)
      ) {
        processedThumbnail = oldThumbnailUrl;
        console.log(`기존 썸네일 URL 유지: ${oldThumbnailUrl}`);
      } else {
        // 새 썸네일 또는 변경된 썸네일 처리
        processedThumbnail = await uploadThumbnail(
          frontmatter.thumbnail,
          filePath,
          supabase,
          oldThumbnailUrl
        );
        console.log(`썸네일 처리 완료: ${processedThumbnail}`);
      }
    }

    // 포스트 데이터 구성 (PostInsert 타입에 맞게)
    const post: PostInsert = {
      title: frontmatter.title,
      slug,
      content: processedContent,
      excerpt: frontmatter.excerpt ?? null,
      thumbnail: processedThumbnail,
      date: existingPost?.date ?? frontmatter.date ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Supabase에 포스트 데이터 upsert (슬러그 기준)
    const { error } = await supabase
      .from("posts")
      .upsert(post, { onConflict: "slug" });

    if (error) {
      throw new Error(`포스트 저장 실패: ${error.message}`);
    }

    const mode = existingPost ? "수정" : "생성";
    console.log(`포스트 ${mode} 성공: ${slug}`);

    // 태그 처리
    if (
      frontmatter.tags &&
      Array.isArray(frontmatter.tags) &&
      frontmatter.tags.length > 0
    ) {
      await processPostTags(slug, frontmatter.tags, supabase);
    }

    // 파일 내용을 템플릿으로 초기화
    await resetFileToTemplate(filePath);
  } catch (error) {
    console.error(
      `파일 처리 실패 (${filePath}):`,
      error instanceof Error ? error.message : String(error)
    );
  }
}
