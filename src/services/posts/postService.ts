import fs from "fs/promises";
import { format } from "date-fns";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, PostInsert } from "@/types/database";
import {
  parseMarkdownContent,
  generateValidSlug,
} from "../../utils/markdownParser";
import { resetFileToTemplate } from "../../utils/fileReset";
import { tagService } from "../tagService";
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

    // 기존 포스트 데이터 조회 (수정 모드 확인)
    const { data: existingPost } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    // 이미지 처리: 마크다운 본문에 있는 로컬 이미지 업로드 후 URL 대체

    const postDate =
      existingPost?.date ??
      frontmatter.date ??
      format(new Date(), "yyyy-MM-dd HH:mm");
    const processedContent = await uploadContentImages(
      markdownContent,
      filePath,
      postDate,
      supabase
    );

    // 사용되지 않는 이미지 삭제
    if (existingPost?.content) {
      await cleanupUnusedImages(
        existingPost.content,
        processedContent,
        supabase
      );
    }

    // 썸네일 처리
    let processedThumbnail: string | null = null;
    if (frontmatter.thumbnail) {
      processedThumbnail = await uploadThumbnail(
        frontmatter.thumbnail,
        filePath,
        supabase,
        existingPost?.thumbnail || null
      );
    }

    // 포스트 데이터 구성
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
      await tagService(slug, frontmatter.tags, supabase);
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
