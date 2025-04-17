"use client";

import { useTagStore } from "@/store/useTagStore";
import { useEffect, useState } from "react";

export function ClientFilterIndicator() {
  const selectedTag = useTagStore((state) => state.selectedTag);
  const [isHydrated, setIsHydrated] = useState(false);

  // 하이드레이션 완료 확인
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // 하이드레이션 완료 후에만 실행
    if (!isHydrated) return;

    const serverPostsElement = document.getElementById("server-posts");
    if (!serverPostsElement) return;

    // 초기 All 태그가 아닌 다른 태그가 선택되면 서버 컴포넌트 숨김
    if (selectedTag && selectedTag !== "All") {
      serverPostsElement.style.display = "none";
    } else {
      serverPostsElement.style.display = "block";
    }
  }, [selectedTag, isHydrated]);

  return null;
}
