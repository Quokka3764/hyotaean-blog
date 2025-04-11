import fs from "fs/promises";
import matter from "gray-matter";

/**
 * 마크다운 파일을 템플릿 상태로 초기화합니다.
 * 초기 템플릿은 프론트매터의 기본 값들만 남기고 내용은 비워둡니다.
 * @param filePath - 초기화할 마크다운 파일 경로
 */
export async function resetFileToTemplate(filePath: string): Promise<void> {
  try {
    // 템플릿 생성: 내용은 빈 문자열, 기본 프론트매터 값 설정
    const template = matter.stringify("", {
      title: "",
      date: "2025-MM-DD hh:mm",
      thumbnail: "",
      tags: [],
      excerpt: "",
    });

    // 파일에 템플릿 내용으로 덮어쓰기
    await fs.writeFile(filePath, template, "utf-8");
    console.log(`파일 초기화 완료: ${filePath}`);
  } catch (error) {
    console.error(
      `파일 초기화 실패 (${filePath}):`,
      error instanceof Error ? error.message : String(error)
    );
  }
}
