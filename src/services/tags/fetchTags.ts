import { getSupabaseClient } from "@/lib/supabaseClient";

export async function fetchTags() {
  const supabase = getSupabaseClient();

  // 태그 테이블에서 모든 태그 가져오기
  const { data, error } = await supabase.from("tags").select("*").order("name"); // 이름 순으로 정렬

  if (error) {
    console.error("태그 가져오기 오류:", error);
    return [];
  }

  return data || [];
}
