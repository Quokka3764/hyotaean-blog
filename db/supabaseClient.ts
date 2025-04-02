// // db/supabaseClient.ts

// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { Database } from "@/types/database";

// /**
//  * 환경 변수에서 Supabase URL과 Service Role Key를 읽어옵니다.
//  * @returns { supabaseUrl, supabaseKey }
//  */
// export function getEnvironmentVariables(): {
//   supabaseUrl: string;
//   supabaseKey: string;
// } {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

//   if (!supabaseUrl || !supabaseKey) {
//     console.error("Supabase 환경 변수가 설정되지 않았습니다.");
//     process.exit(1);
//   }

//   return { supabaseUrl, supabaseKey };
// }

// /**
//  * Supabase 클라이언트를 생성합니다.
//  * @param supabaseUrl - Supabase 프로젝트 URL
//  * @param supabaseKey - Supabase Service Role Key
//  * @returns SupabaseClient 인스턴스
//  */
// export function createSupabaseClient(
//   supabaseUrl: string,
//   supabaseKey: string
// ): SupabaseClient<Database> {
//   return createClient<Database>(supabaseUrl, supabaseKey);
// }

//supabase 캐싱

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

// 싱글톤 인스턴스를 저장할 변수
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * 환경 변수에서 Supabase URL과 Service Role Key를 읽어옵니다.
 * @returns { supabaseUrl, supabaseKey }
 */
export function getEnvironmentVariables(): {
  supabaseUrl: string;
  supabaseKey: string;
} {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  return { supabaseUrl, supabaseKey };
}

/**
 * Supabase 클라이언트를 생성합니다. (직접 호출 X)
 * @param supabaseUrl - Supabase 프로젝트 URL
 * @param supabaseKey - Supabase Service Role Key
 * @returns SupabaseClient 인스턴스
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * 싱글톤 Supabase 클라이언트를 가져옵니다.
 * 이 함수를 애플리케이션 전체에서 사용해야 합니다.
 * @returns SupabaseClient 인스턴스
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) return supabaseInstance;

  const { supabaseUrl, supabaseKey } = getEnvironmentVariables();
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}
