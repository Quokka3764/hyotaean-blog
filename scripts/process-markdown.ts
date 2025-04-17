import { supabaseClient } from "../src/lib/supabaseClient";
import { postService } from "@/services/posts/postService";
import {
  findChangedMarkdownFiles,
  findAllMarkdownFiles,
} from "../src/utils/fileUtils";
import { retry } from "../src/utils/retry";

async function processMarkdownFiles(): Promise<void> {
  console.log("마크다운 파일 처리 시작...");

  // 변경된 파일 검색 (없으면 전체 스캔)
  let files = await findChangedMarkdownFiles();
  if (files.length === 0) {
    console.log("Git 변경 파일 없음, 전체 스캔 실행");
    files = await findAllMarkdownFiles();
  }

  if (files.length === 0) {
    console.log("처리할 마크다운 파일이 없습니다.");
    return;
  }

  console.log(`총 ${files.length}개의 파일 처리 중...`);

  for (const file of files) {
    try {
      await retry(
        () => postService(file, supabaseClient),
        `파일 처리 ${file}`,
        3,
        1000
      );
    } catch (error) {
      console.error(
        `파일 처리 실패 (${file}):`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  console.log("모든 마크다운 파일 처리 완료");
}

// 스크립트 실행
processMarkdownFiles().catch((error) => {
  console.error(
    "치명적인 오류 발생:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
