// scripts/utils/imageProcessor.ts
import fs from "fs/promises";
import path from "path";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
// 이미지 최적화 라이브러리(예: sharp) 추가

/**
 * 마크다운 콘텐츠에서 이미지를 추출하여 Supabase Storage에 업로드하고,
 * 이미지 참조를 업로드된 URL로 대체합니다.
 * @param markdownContent - 처리할 마크다운 콘텐츠
 * @param filePath - 마크다운 파일 경로
 * @param supabase - Supabase 클라이언트 인스턴스
 * @returns 이미지 URL이 대체된, 처리된 마크다운 콘텐츠
 */
export async function processImages(
  markdownContent: string,
  filePath: string,
  supabase: SupabaseClient<Database>
): Promise<string> {
  // 마크다운에서 이미지 참조 패턴 찾기
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  let processedContent = markdownContent;

  // 모든 이미지 참조 처리
  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const [fullMatch, altText, imagePath] = match;

    // 로컬 이미지 경로인 경우에만 처리 (URL은 그대로 두기)
    if (!imagePath.startsWith("http") && !imagePath.startsWith("data:")) {
      const fullImagePath = path.resolve(path.dirname(filePath), imagePath);

      try {
        // 파일 존재 확인
        await fs.access(fullImagePath);

        // 파일 읽기
        const imageBuffer = await fs.readFile(fullImagePath);

        // 이미지 최적화 로직 (여기에 추가)
        // const optimizedImage = await optimizeImage(imageBuffer);

        // 파일 이름 생성 (고유한 이름 사용)
        const fileName = `${Date.now()}_${path.basename(imagePath)}`;

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
          .from("blog-images")
          .upload(fileName, imageBuffer, {
            contentType: `image/${path.extname(imagePath).substring(1)}`,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        // 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        // 마크다운 내용 업데이트
        processedContent = processedContent.replace(
          fullMatch,
          `![${altText}](${urlData.publicUrl})`
        );

        console.log(`이미지 업로드 성공: ${fileName}`);
      } catch (error) {
        console.error(
          `이미지 처리 실패 (${imagePath}):`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }

  return processedContent;
}
