import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import * as path from "path";
import * as fs from "fs";

// 환경변수 로드 로직
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContents = fs.readFileSync(envPath, "utf8");
  envContents.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim().replace(/^(['"])(.+)\1$/, "$2");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// 환경 변수 로드
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// URL이 반드시 설정되어야 합니다
if (!supabaseUrl) {
  throw new Error(
    "Supabase URL(NEXT_PUBLIC_SUPABASE_URL)이 설정되지 않았습니다."
  );
}

// 실행 환경에 따라 키를 선택합니다
let supabaseKey: string | undefined;

if (typeof window === "undefined") {
  // 서버: 서비스 롤 키 우선, 없으면 익명 키 사용
  if (serviceKey) {
    supabaseKey = serviceKey;
  } else if (anonKey) {
    supabaseKey = anonKey;
  }
} else {
  // 클라이언트: 익명 키만 사용
  if (anonKey) {
    supabaseKey = anonKey;
  }
}

// 키가 선택되지 않으면 에러
if (!supabaseKey) {
  const env = typeof window === "undefined" ? "서버" : "클라이언트";
  const missing =
    typeof window === "undefined"
      ? "SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY"
      : "NEXT_PUBLIC_SUPABASE_ANON_KEY";
  throw new Error(`${env}용 Supabase 키(${missing})가 설정되지 않았습니다.`);
}

// Supabase 클라이언트 싱글톤 생성
const client: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseKey
);

/**
 * test, 구버전 전용
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  return client;
}

/**
 * test2
 */
export const supabaseClient = client;
