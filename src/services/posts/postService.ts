import fs from "fs/promises";
import { parseISO, format } from "date-fns";
import { toDate } from "date-fns-tz";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, PostInsert } from "@/types/database";
import {
  parseMarkdownContent,
  generateValidSlug,
} from "../../utils/markdownParser";
import { resetFileToTemplate } from "../../utils/fileReset";
import { tagService } from "../tags/tagService";
import {
  uploadContentImages,
  cleanupUnusedImages,
  uploadThumbnail,
} from "../image";

export async function postService(
  filePath: string,
  supabase: SupabaseClient<Database>
): Promise<void> {
  try {
    // 파일 읽기 및 마크다운 파싱
    const content = await fs.readFile(filePath, "utf-8");
    const { frontmatter, markdownContent } = parseMarkdownContent(content);

    // 슬러그 생성 (파일명과 frontmatter의 title 기반)
    const slug = generateValidSlug(filePath, frontmatter.title);

    // 기존 포스트 데이터 조회
    const { data: existingPost } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    // 날짜 처리, 아시아 & 서울
    let dateValue: string;
    if (frontmatter.date) {
      try {
        const seoulTime = toDate(frontmatter.date, { timeZone: "Asia/Seoul" });
        dateValue = seoulTime.toISOString();
      } catch (error) {
        console.warn(
          `날짜 파싱 오류 (${frontmatter.date}), 현재 시간 사용:`,
          error
        );
        dateValue = existingPost?.date || new Date().toISOString();
      }
    } else if (existingPost?.date) {
      dateValue = existingPost.date;
    } else {
      // 날짜 정보가 없으면 현재 시간 사용
      dateValue = new Date().toISOString();
    }

    // 이미지 처리를 위한 날짜 형식 설정 (기존 함수와의 호환성 유지)
    const postDate = format(parseISO(dateValue), "yyyy-MM-dd HH:mm");

    // 이미지처리는 병렬로 진행
    const [processedContent, processedThumbnail] = await Promise.all([
      // 컨텐츠 내 이미지 처리
      uploadContentImages(markdownContent, filePath, postDate, supabase),
      // 썸네일 처리 (존재하는 경우에만)
      frontmatter.thumbnail
        ? uploadThumbnail(
            frontmatter.thumbnail,
            filePath,
            supabase,
            existingPost?.thumbnail || null
          )
        : Promise.resolve(null),
    ]);

    // 사용되지 않는 이미지 삭제 (기존 포스트가 있는 경우)
    if (existingPost?.content) {
      // 이미지 정리는 포스트 저장과 병렬로 처리 가능
      cleanupUnusedImages(
        existingPost.content,
        processedContent,
        supabase
      ).catch((error) => {
        // 이미지 정리 실패는 심각한 오류가 아니므로 로그만 남기고 계속 진행
        console.warn(`사용되지 않는 이미지 정리 실패: ${error.message}`);
      });
    }

    // 포스트 데이터 구성
    const post: PostInsert = {
      title: frontmatter.title,
      slug,
      content: processedContent,
      excerpt: frontmatter.excerpt ?? null,
      thumbnail: processedThumbnail,
      date: dateValue, // 일관된 UTC ISO 형식 사용
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

    // 태그 처리 - 포스트 저장 후 비동기로 처리
    if (
      frontmatter.tags &&
      Array.isArray(frontmatter.tags) &&
      frontmatter.tags.length > 0
    ) {
      await tagService(slug, frontmatter.tags, supabase);
    }

    // 파일 내용을 템플릿으로 초기화
    await resetFileToTemplate(filePath);
  } catch (error) {
    console.error(
      `파일 처리 실패 (${filePath}):`,
      error instanceof Error ? error.message : String(error)
    );
    // CI 파이프라인에 오류 전파를 위해 예외 다시 던지기
    throw error;
  }
}
