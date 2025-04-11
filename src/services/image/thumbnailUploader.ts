import fs from "fs/promises";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { withRetry } from "@/utils/retry";
import {
  generateFileHash,
  resolveLocalImagePath,
} from "@/utils/image/imageUtils";
import {
  isSupabaseStorageUrl,
  isExternalUrl,
  extractStoragePath,
} from "@/utils/url/urlUtils";
import { uploadImageToStorage } from "./imageUploader";

// 썸네일 이미지를 Supabase Storage에서 삭제
export async function deleteOldThumbnail(
  oldThumbnailUrl: string | null,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<void> {
  if (!oldThumbnailUrl || !isSupabaseStorageUrl(oldThumbnailUrl)) {
    return;
  }

  const storagePath = extractStoragePath(oldThumbnailUrl, bucket);
  if (!storagePath) {
    console.log(`스토리지 경로 추출 실패: ${oldThumbnailUrl}`);
    return;
  }

  try {
    console.log(`이전 썸네일 삭제 시도: ${storagePath}`);

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

// 썸네일 이미지를 Supabase Storage에 업로드
export async function uploadThumbnail(
  thumbnailPath: string,
  basePath: string,
  supabase: SupabaseClient<Database>,
  oldThumbnailUrl: string | null = null,
  bucket: string = "blog-images"
): Promise<string | null> {
  if (!thumbnailPath) return null;

  console.log(`썸네일 처리 시작: ${thumbnailPath}`);

  // 이미 Supabase URL이면 그대로 사용
  if (isSupabaseStorageUrl(thumbnailPath)) {
    console.log(`이미 Supabase URL인 썸네일 유지: ${thumbnailPath}`);
    return thumbnailPath;
  }

  // 외부 URL이면 그대로 사용
  if (isExternalUrl(thumbnailPath)) {
    console.log(`외부 URL 썸네일 유지: ${thumbnailPath}`);
    return thumbnailPath;
  }

  // 로컬 파일 경로인 경우에만 처리
  try {
    // 실제 파일 경로 계산 및 파일 읽기
    const fullImagePath = resolveLocalImagePath(basePath, thumbnailPath);
    await fs.access(fullImagePath);
    const imageBuffer = await fs.readFile(fullImagePath);

    // 이미지 해시 계산
    const newImageHash = generateFileHash(imageBuffer).substring(0, 16);

    // 기존 URL이 있고 같은 이미지인지 확인
    if (oldThumbnailUrl && isSupabaseStorageUrl(oldThumbnailUrl)) {
      // URL에 해시가 포함되어 있는지 확인
      if (oldThumbnailUrl.includes(newImageHash)) {
        console.log("동일한 썸네일 이미지 감지: 기존 URL 유지");
        return oldThumbnailUrl;
      }

      // 이미지가 변경된 경우 기존 이미지 삭제
      console.log(
        "썸네일 이미지 변경 감지: 이전 이미지 삭제 후 새 이미지 업로드"
      );
      await deleteOldThumbnail(oldThumbnailUrl, supabase, bucket);
    }

    // 새 이미지 업로드
    const folderPath = "thumbnails";
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
