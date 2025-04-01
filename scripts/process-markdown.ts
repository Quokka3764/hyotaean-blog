// scripts/process-markdown.ts

import {
  getEnvironmentVariables,
  createSupabaseClient,
} from "../db/supabaseClient";
import { postProcessor } from "../db/postProcessor";
import {
  findChangedMarkdownFiles,
  findAllMarkdownFiles,
} from "../utils/fileUtils";
import { withRetry } from "../utils/retry";

async function processMarkdownFiles(): Promise<void> {
  console.log("마크다운 파일 처리 시작...");

  // 환경 변수와 Supabase 클라이언트 초기화
  const { supabaseUrl, supabaseKey } = getEnvironmentVariables();
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  // Git 변경 파일을 우선 검색
  let files = await findChangedMarkdownFiles();

  // 변경 파일이 없으면 전체 디렉토리 스캔으로 대체
  if (files.length === 0) {
    console.log("Git 변경 파일 없음, 전체 스캔 실행");
    files = await findAllMarkdownFiles();
  }

  if (files.length === 0) {
    console.log("처리할 마크다운 파일이 없습니다.");
    return;
  }

  console.log(`총 ${files.length}개의 파일 처리 중...`);

  // 각 파일에 대해 postProcessor 함수 실행 (재시도 로직 포함)
  for (const file of files) {
    try {
      await withRetry(
        () => postProcessor(file, supabase),
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

processMarkdownFiles().catch((error) => {
  console.error(
    "치명적인 오류 발생:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
