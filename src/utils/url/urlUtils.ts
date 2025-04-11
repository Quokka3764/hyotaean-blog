/**
 * Supabase 이미지 URL들을 추출합니다.
 *
 * @param content - URL들이 포함된 문자열
 * @returns 추출된 고유 Supabase 이미지 URL 배열
 */

export function extractSbImgUrls(content: string): string[] {
  const pattern =
    /https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/blog-images\/[^)\s"]*/g;
  const matches = content.match(pattern);
  return matches ? Array.from(new Set(matches)) : [];
}

// Supabase Storage URL을 환경 변수에 맞게 변환
export function transformStorageUrl(url: string): string {
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
  if (storageUrl && storageUrl.trim() !== "") {
    return url.replace(/^https?:\/\/[^/]+/, storageUrl.trim());
  }
  return url;
}

// Supabase URL 패턴 확인
export function isSupabaseStorageUrl(url: string): boolean {
  return (
    url.includes("/storage/v1/object/public/") ||
    url.includes(".supabase.co/storage/v1/")
  );
}

// 파일 경로에서 Supabase 스토리지 경로 추출 (삭제용)
export function extractStoragePath(url: string, bucket: string): string | null {
  try {
    const regex = new RegExp(`/storage/v1/object/public/${bucket}/+([^?#]+)`);
    const match = url.match(regex);

    if (!match) return null;

    // 경로에서 선행 슬래시 제거 및 정규화
    return decodeURIComponent(match[1]).replace(/^\/+/, "");
  } catch (error) {
    return null;
  }
}

// URL이 외부 URL인지 확인
export function isExternalUrl(url: string): boolean {
  return (
    url.startsWith("http") || url.startsWith("https") || url.startsWith("data:")
  );
}
