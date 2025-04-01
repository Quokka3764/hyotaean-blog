// scripts/utils/fileUtils.ts

import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

const POSTS_DIR = "src/contents/posts";

/**
 * Git 변경 사항을 기반으로 변경된 마크다운 파일 경로 배열을 반환합니다.
 * @returns {Promise<string[]>} 변경된 마크다운 파일 경로 목록
 */
export async function findChangedMarkdownFiles(): Promise<string[]> {
  try {
    // Git diff 명령어로 최근 변경된 파일 목록을 가져옵니다.
    const gitOutput = execSync("git diff --name-only HEAD", {
      encoding: "utf-8",
    }).trim();
    if (!gitOutput) return [];

    const changedFiles = gitOutput.split("\n");
    const markdownFiles: string[] = [];

    for (const file of changedFiles) {
      if (file.startsWith(POSTS_DIR) && file.endsWith(".md")) {
        try {
          await fs.access(file);
          markdownFiles.push(file);
        } catch (error) {
          console.debug(`파일 접근 불가: ${file}`);
        }
      }
    }

    return markdownFiles;
  } catch (error) {
    console.warn(
      "Git 변경 파일 확인 실패, 전체 폴더 스캔으로 대체합니다:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

/**
 * 지정된 폴더 내의 모든 마크다운 파일 경로를 반복적 DFS 방식으로 검색합니다.
 * @returns {Promise<string[]>} 모든 마크다운 파일 경로 목록
 */
export async function findAllMarkdownFiles(): Promise<string[]> {
  const postsDir = path.join(process.cwd(), POSTS_DIR);
  const markdownFiles: string[] = [];
  const stack: string[] = [postsDir];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir) continue;
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      console.error(`디렉토리 읽기 실패: ${currentDir}`, error);
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        markdownFiles.push(fullPath);
      }
    }
  }

  return markdownFiles;
}
