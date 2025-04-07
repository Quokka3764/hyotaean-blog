import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { withRetry } from "../utils/retry";

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

// 업로드 캐시 (해시 기반 키)
const uploadCache = new Map<string, string>();
// 최대 캐시 항목 수 (메모리 관리를 위해)
const MAX_CACHE_SIZE = 100;

// 파일 확장자에 따른 MIME 타입 반환
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

// 이미지 경로를 실제 파일 시스템상의 경로로 변환
function resolveLocalImagePath(basePath: string, imagePath: string): string {
  if (imagePath.startsWith("/")) {
    const trimmed = imagePath.replace(/^\/+/, "");
    return path.join(process.cwd(), "public", trimmed);
  }
  return path.resolve(path.dirname(basePath), imagePath);
}

// Supabase Storage URL을 환경 변수에 맞게 변환
function transformStorageUrl(url: string): string {
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
  if (storageUrl && storageUrl.trim() !== "") {
    return url.replace(/^https?:\/\/[^/]+/, storageUrl.trim());
  }
  return url;
}

// Supabase URL 패턴 확인
function isSupabaseStorageUrl(url: string): boolean {
  // Supabase Storage URL 패턴 확인
  return (
    url.includes("/storage/v1/object/public/") ||
    url.includes(".supabase.co/storage/v1/")
  );
}

// 파일 내용 해시 생성
function generateFileHash(imageBuffer: Buffer): string {
  return createHash("sha256").update(imageBuffer).digest("hex");
}

// 파일 경로에서 Supabase 스토리지 경로 추출 (삭제용)
function extractStoragePath(url: string, bucket: string): string | null {
  const regex = new RegExp(`/storage/v1/object/public/${bucket}/([^?#]+)`);
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 캐시에 항목 추가 (LRU 방식 관리)
function addToCache(key: string, value: string): void {
  // 캐시가 최대 크기에 도달한 경우 가장 오래된 항목 제거
  if (uploadCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = uploadCache.keys().next().value;
    if (oldestKey) {
      uploadCache.delete(oldestKey);
    }
  }
  uploadCache.set(key, value);
}

// 단일 이미지를 Supabase Storage에 업로드
async function uploadImageToStorage(
  originalPath: string,
  imageBuffer: Buffer,
  folder: string,
  supabase: SupabaseClient<Database>,
  bucket: string
): Promise<string | null> {
  try {
    // 파일 해시 생성
    const fileHash = generateFileHash(imageBuffer);
    const cacheKey = fileHash;

    // 캐시 확인
    if (uploadCache.has(cacheKey)) {
      return uploadCache.get(cacheKey) || null;
    }

    // 파일명 생성 (UUID 대신 해시 기반 - 중복 방지)
    const fileExt = path.extname(originalPath).toLowerCase();
    const fileName = `${folder}/${fileHash.substring(0, 16)}${fileExt}`.replace(
      /^\//,
      ""
    );

    // Supabase Storage에 업로드 (재시도 로직 포함)
    await withRetry(
      async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, imageBuffer, {
            contentType: getMimeType(originalPath),
            cacheControl: "3600",
            upsert: true, // 같은 경로면 덮어쓰기
          });

        if (error) throw error;
      },
      `이미지 업로드 (${originalPath})`,
      3,
      1000
    );

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const publicUrl = transformStorageUrl(urlData.publicUrl);

    // 캐시에 저장
    addToCache(cacheKey, publicUrl);

    return publicUrl;
  } catch (error) {
    console.error(`이미지 업로드 실패 (${originalPath}):`, error);
    return null;
  }
}

// 마크다운 콘텐츠에서 이미지를 추출하여 Supabase Storage에 업로드
async function processImages(
  markdownContent: string,
  filePath: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string> {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let processedContent = markdownContent;
  const matches = [...markdownContent.matchAll(imageRegex)];

  // 동시성 제한을 위한 배치 처리 (한 번에 최대 5개 이미지 처리)
  const BATCH_SIZE = 5;
  for (let i = 0; i < matches.length; i += BATCH_SIZE) {
    const batch = matches.slice(i, i + BATCH_SIZE);

    // 현재 배치 내 이미지 병렬 처리
    const results = await Promise.all(
      batch.map(async (match) => {
        const [fullMatch, altText, imagePath] = match;

        // 이미 외부 URL이거나 Supabase URL인 경우 처리하지 않음
        if (
          imagePath.startsWith("http") ||
          imagePath.startsWith("https") ||
          imagePath.startsWith("data:") ||
          isSupabaseStorageUrl(imagePath)
        ) {
          return { fullMatch, newUrl: imagePath, altText };
        }

        try {
          // 실제 파일 경로 계산 및 파일 읽기
          const fullImagePath = resolveLocalImagePath(filePath, imagePath);
          await fs.access(fullImagePath);
          const imageBuffer = await fs.readFile(fullImagePath);

          // 폴더 구조 추출
          const folderPath = path.dirname(imagePath).replace(/^\.\//, "");

          // 이미지 업로드
          const publicUrl = await uploadImageToStorage(
            imagePath,
            imageBuffer,
            folderPath,
            supabase,
            bucket
          );

          if (publicUrl) {
            console.log(`이미지 업로드 성공: ${imagePath} -> ${publicUrl}`);
            return { fullMatch, newUrl: publicUrl, altText };
          }
        } catch (error) {
          console.error(`이미지 처리 실패 (${imagePath}):`, error);
        }

        return { fullMatch, newUrl: imagePath, altText };
      })
    );

    // 처리된 이미지 URL로 마크다운 업데이트
    for (const { fullMatch, newUrl, altText } of results) {
      processedContent = processedContent.replace(
        fullMatch,
        `![${altText}](${newUrl})`
      );
    }
  }

  return processedContent;
}

// 썸네일 교체 시 이전 이미지 삭제
async function deleteOldThumbnail(
  oldThumbnailUrl: string | null,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<void> {
  if (!oldThumbnailUrl || !isSupabaseStorageUrl(oldThumbnailUrl)) {
    return;
  }

  const storagePath = extractStoragePath(oldThumbnailUrl, bucket);
  if (!storagePath) {
    return;
  }

  try {
    await withRetry(
      async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([storagePath]);

        if (error) throw error;
      },
      `이전 썸네일 삭제 (${storagePath})`,
      3,
      1000
    );
    console.log(`이전 썸네일 삭제 성공: ${storagePath}`);
  } catch (error) {
    console.error(`이전 썸네일 삭제 실패 (${storagePath}):`, error);
  }
}

// 썸네일 이미지를 Supabase Storage에 업로드 (기존 이미지 관리 포함)
async function uploadThumbnail(
  thumbnailPath: string,
  basePath: string,
  supabase: SupabaseClient<Database>,
  oldThumbnailUrl: string | null = null,
  bucket: string = "blog-images"
): Promise<string | null> {
  if (!thumbnailPath) return null;

  // 이미 Supabase URL이고 수정되지 않은 경우 (경로가 같으면) 기존 URL 유지
  if (isSupabaseStorageUrl(thumbnailPath)) {
    return thumbnailPath;
  }

  // 로컬 파일 경로인 경우에만 처리
  try {
    // 실제 파일 경로 계산 및 파일 읽기
    const fullImagePath = resolveLocalImagePath(basePath, thumbnailPath);
    await fs.access(fullImagePath);
    const imageBuffer = await fs.readFile(fullImagePath);

    // 썸네일 폴더 사용
    const folderPath = "thumbnails";

    // 업로드 전 기존 썸네일 해시 확인
    const newImageHash = generateFileHash(imageBuffer).substring(0, 16);

    // 기존 URL이 있고 같은 이미지인지 확인 (URL에 해시가 포함되어 있는지)
    if (oldThumbnailUrl && isSupabaseStorageUrl(oldThumbnailUrl)) {
      if (oldThumbnailUrl.includes(newImageHash)) {
        console.log("동일한 썸네일 이미지 사용: 기존 URL 유지");
        return oldThumbnailUrl;
      }

      // 이미지가 변경된 경우 기존 이미지 삭제
      await deleteOldThumbnail(oldThumbnailUrl, supabase, bucket);
    }

    // 새 이미지 업로드
    return await uploadImageToStorage(
      thumbnailPath,
      imageBuffer,
      folderPath,
      supabase,
      bucket
    );
  } catch (error) {
    console.error(`썸네일 처리 실패 (${thumbnailPath}):`, error);
    return null;
  }
}

// 외부로 내보낼 API 객체로 묶기
export default {
  processImages,
  uploadThumbnail,
  isSupabaseStorageUrl,
};
