import path from "path";
import { createHash } from "crypto";
import { format, parse } from "date-fns";

// MIME 타입 매핑
export const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

// 파일 확장자에 따른 MIME 타입 반환
export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

// 이미지 경로를 실제 파일 시스템상의 경로로 변환
export function resolveLocalImagePath(
  basePath: string,
  imagePath: string
): string {
  if (imagePath.startsWith("/")) {
    const trimmed = imagePath.replace(/^\/+/, "");
    return path.join(process.cwd(), "public", trimmed);
  }
  return path.resolve(path.dirname(basePath), imagePath);
}

// 파일 내용 해시 생성
export function generateFileHash(imageBuffer: Buffer): string {
  return createHash("sha256").update(imageBuffer).digest("hex");
}

// 날짜 문자열에서 폴더명 생성 (YYYYMMDD)
export function formatDateFolder(dateString: string): string {
  const parsedDate = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
  return format(parsedDate, "yyyyMMdd");
}
