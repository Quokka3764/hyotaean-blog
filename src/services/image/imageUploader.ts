import fs from "fs/promises";
import path from "path";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { withRetry } from "@/utils/retry";
import {
  getMimeType,
  generateFileHash,
  resolveLocalImagePath,
  formatDateFolder,
} from "@/utils/image/imageUtils";
import {
  transformStorageUrl,
  isSupabaseStorageUrl,
  isExternalUrl,
} from "@/utils/url/urlUtils";
import { addToCache, hasInCache, getFromCache } from "./imageCache";

// 단일 이미지를 Supabase Storage에 업로드
export async function uploadImageToStorage(
  originalPath: string,
  imageBuffer: Buffer,
  folder: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string | null> {
  try {
    // 파일 해시 생성
    const fileHash = generateFileHash(imageBuffer).substring(0, 16);
    const cacheKey = fileHash;

    // 캐시 확인
    if (hasInCache(cacheKey)) {
      const cachedUrl = getFromCache(cacheKey);
      console.log(`캐시에서 이미지 URL 사용: ${cachedUrl}`);
      return cachedUrl || null;
    }

    // 파일명 생성 (해시 기반으로 중복 방지)
    const fileExt = path.extname(originalPath).toLowerCase();
    const fileName = `${folder}/${fileHash}${fileExt}`.replace(/^\//, "");

    console.log(`이미지 업로드 시도: ${fileName} (해시: ${fileHash})`);

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

    console.log(`이미지 업로드 성공: ${originalPath} -> ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`이미지 업로드 실패 (${originalPath}):`, error);
    return null;
  }
}

// 마크다운 콘텐츠의 이미지를 날짜 폴더 구조로 업로드
export async function uploadContentImages(
  markdownContent: string,
  filePath: string,
  postDate: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string> {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let processedContent = markdownContent;
  const matches = [...markdownContent.matchAll(imageRegex)];

  if (matches.length === 0) return markdownContent;

  console.log(`마크다운에서 이미지 ${matches.length}개 발견`);

  // 날짜 기반 폴더 생성
  const dateFolder = formatDateFolder(postDate);

  // 동시성 제한을 위한 배치 처리 (한 번에 최대 5개 이미지 처리)
  const BATCH_SIZE = 5;
  for (let i = 0; i < matches.length; i += BATCH_SIZE) {
    const batch = matches.slice(i, i + BATCH_SIZE);

    // 현재 배치 내 이미지 병렬 처리
    const results = await Promise.all(
      batch.map(async (match) => {
        const [fullMatch, altText, imagePath] = match;

        // 이미 외부 URL이거나 Supabase URL인 경우 처리하지 않음
        if (isExternalUrl(imagePath) || isSupabaseStorageUrl(imagePath)) {
          console.log(`이미 처리된 이미지 URL 유지: ${imagePath}`);
          return { fullMatch, newUrl: imagePath, altText };
        }

        try {
          // 실제 파일 경로 계산 및 파일 읽기
          const fullImagePath = resolveLocalImagePath(filePath, imagePath);
          await fs.access(fullImagePath);
          const imageBuffer = await fs.readFile(fullImagePath);

          // 폴더 구조 추출 (날짜 + 원본 경로)
          const originalFolder = path.dirname(imagePath).replace(/^\.\//, "");
          const folderPath = originalFolder
            ? `${dateFolder}/${originalFolder}`
            : dateFolder;

          // 이미지 업로드
          const publicUrl = await uploadImageToStorage(
            imagePath,
            imageBuffer,
            folderPath,
            supabase,
            bucket
          );

          if (publicUrl) {
            console.log(`이미지 처리 성공: ${imagePath} -> ${publicUrl}`);
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

// 사용되지 않는 이미지 정리
export async function cleanupUnusedImages(
  oldContent: string | null,
  newContent: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<void> {
  // 기존 이미지 URL 추출
  const oldImageUrls = oldContent ? extractSbImgUrls(oldContent) : [];

  if (oldImageUrls.length === 0) return;

  // 새 콘텐츠에서 이미지 URL 추출
  const newImageUrls = extractSbImgUrls(newContent);

  // 더 이상 사용되지 않는 이미지 찾기
  const unusedImageUrls = oldImageUrls.filter(
    (oldUrl) => !newImageUrls.includes(oldUrl)
  );

  if (unusedImageUrls.length === 0) return;

  await deleteImagesByUrls(unusedImageUrls, supabase, bucket);
}

// URL 목록으로 이미지 삭제
export async function deleteImagesByUrls(
  imageUrls: string[],
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<boolean> {
  try {
    console.log(`삭제할 이미지: ${imageUrls.length}개`);

    // 스토리지 경로 추출
    const storagePaths = imageUrls
      .map((url) => extractStoragePath(url, bucket))
      .filter(Boolean) as string[];

    if (storagePaths.length === 0) return true;

    // 이미지 삭제
    await withRetry(
      async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .remove(storagePaths);

        if (error) throw error;
      },
      `이미지 삭제 (${storagePaths.length}개)`,
      3,
      1000
    );

    console.log(`이미지 ${storagePaths.length}개 삭제 완료`);
    return true;
  } catch (error) {
    console.error("이미지 삭제 중 오류 발생:", error);
    return false;
  }
}

// 내부 구현을 위한 extractSbImgUrls 임포트
import { extractSbImgUrls, extractStoragePath } from "@/utils/url/urlUtils";
