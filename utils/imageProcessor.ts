import fs from "fs/promises";
import path from "path";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

// MIME 타입 매핑
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/**
 * 파일 확장자에 따른 MIME 타입 반환
 * @param filePath 파일 경로
 * @returns MIME 타입
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * 마크다운이나 썸네일에서 주어진 이미지 경로를 실제 파일 시스템상의 경로로 변환합니다.
 * 만약 이미지 경로가 "/"로 시작하면, 이는 프로젝트의 public 폴더 내의 파일로 간주합니다.
 * @param basePath 기준 파일 경로 (마크다운 파일의 경로)
 * @param imagePath 마크다운에 작성된 이미지 경로
 * @returns 실제 파일 시스템상의 이미지 절대 경로
 */
function resolveLocalImagePath(basePath: string, imagePath: string): string {
  if (imagePath.startsWith("/")) {
    // "/"로 시작하면 public 폴더 기준으로 처리 ("/"는 public 폴더의 루트를 의미)
    const trimmed = imagePath.replace(/^\/+/, "");
    return path.join(process.cwd(), "public", trimmed);
  }
  // 그 외의 경우는 마크다운 파일의 위치를 기준으로 상대 경로를 해석
  return path.resolve(path.dirname(basePath), imagePath);
}

/**
 * 마크다운 콘텐츠에서 이미지를 추출하여 Supabase Storage에 업로드하고,
 * 이미지 참조를 업로드된 URL로 대체합니다.
 * @param markdownContent - 처리할 마크다운 콘텐츠
 * @param filePath - 마크다운 파일 경로
 * @param supabase - Supabase 클라이언트 인스턴스
 * @param bucket - 스토리지 버킷 이름 (기본값: "blog-images")
 * @returns 이미지 URL이 대체된, 처리된 마크다운 콘텐츠
 */
export async function processImages(
  markdownContent: string,
  filePath: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string> {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let processedContent = markdownContent;
  const matches = [...markdownContent.matchAll(imageRegex)];

  // 모든 이미지 참조 처리
  for (const match of matches) {
    const [fullMatch, altText, imagePath] = match;

    // 로컬 이미지 경로인 경우에만 처리 (URL은 그대로 두기)
    if (!imagePath.startsWith("http") && !imagePath.startsWith("data:")) {
      try {
        // 헬퍼 함수를 사용하여 실제 파일 경로를 계산
        const fullImagePath = resolveLocalImagePath(filePath, imagePath);
        // 파일 존재 확인
        await fs.access(fullImagePath);
        // 파일 읽기
        const imageBuffer = await fs.readFile(fullImagePath);

        // 폴더 구조 유지 (선택적)
        const folderPath = path.dirname(imagePath).replace(/^\.\//, "");
        // 파일 이름에 타임스탬프 추가하여 고유성 보장
        const fileName = `${folderPath}/${Date.now()}_${path.basename(
          imagePath
        )}`.replace(/^\//, "");

        // Supabase Storage에 업로드
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, imageBuffer, {
            contentType: getMimeType(imagePath),
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          console.error(`Storage 업로드 오류 (${imagePath}):`, error);
          continue; // 이 이미지는 건너뛰고 다음 이미지로 진행
        }

        // 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        // 환경변수 NEXT_PUBLIC_SUPABASE_STORAGE가 있다면 도메인을 치환
        let publicUrl = urlData.publicUrl;
        if (process.env.NEXT_PUBLIC_SUPABASE_STORAGE) {
          publicUrl = publicUrl.replace(
            /^https?:\/\/[^/]+/,
            process.env.NEXT_PUBLIC_SUPABASE_STORAGE
          );
        }

        // 마크다운 내용 업데이트
        processedContent = processedContent.replace(
          fullMatch,
          `![${altText}](${publicUrl})`
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

/**
 * 썸네일 이미지를 Supabase Storage에 업로드합니다.
 * @param thumbnailPath - 썸네일 이미지 경로
 * @param basePath - 기준 디렉토리 경로
 * @param supabase - Supabase 클라이언트 인스턴스
 * @param bucket - 스토리지 버킷 이름 (기본값: "blog-images")
 * @returns 업로드된 썸네일의 공개 URL
 */
export async function uploadThumbnail(
  thumbnailPath: string,
  basePath: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string | null> {
  if (!thumbnailPath) return null;

  try {
    // URL이면 그대로 반환
    if (thumbnailPath.startsWith("http")) {
      return thumbnailPath;
    }

    // 헬퍼 함수를 사용하여 실제 파일 경로를 계산
    const fullImagePath = resolveLocalImagePath(basePath, thumbnailPath);
    // 파일 존재 확인
    await fs.access(fullImagePath);
    // 파일 읽기
    const imageBuffer = await fs.readFile(fullImagePath);
    // 썸네일용 경로 생성
    const fileName = `thumbnails/${Date.now()}_${path.basename(thumbnailPath)}`;

    // Supabase Storage에 업로드
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, imageBuffer, {
        contentType: getMimeType(thumbnailPath),
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error(`썸네일 업로드 오류 (${thumbnailPath}):`, error);
      return null;
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    let publicUrl = urlData.publicUrl;
    if (process.env.NEXT_PUBLIC_SUPABASE_STORAGE) {
      publicUrl = publicUrl.replace(
        /^https?:\/\/[^/]+/,
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE
      );
    }

    console.log(`썸네일 업로드 성공: ${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error(
      `썸네일 처리 실패 (${thumbnailPath}):`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}
