"use client";

import React, { useState, useEffect } from "react";
import { useTagStore } from "@/store/useTagStore";
import { TaggedPostList } from "./TaggedPostList";

interface PostsContainerProps {
  initialTag: string;
}

export function PostsContainer({ initialTag }: PostsContainerProps) {
  const [isClientFiltering, setIsClientFiltering] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const selectedTag = useTagStore((state) => state.selectedTag);
  const setSelectedTag = useTagStore((state) => state.setSelectedTag);

  // 하이드레이션 완료 확인
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 초기 태그 설정 (localStorage에서 복원된 상태가 없을 때만)
  useEffect(() => {
    if (isHydrated && selectedTag === "All" && initialTag !== "All") {
      setSelectedTag(initialTag);
    }
  }, [isHydrated, initialTag, selectedTag, setSelectedTag]);

  // 태그 변경 감지
  useEffect(() => {
    if (!isHydrated) return;

    if (selectedTag && selectedTag !== "All") {
      setIsClientFiltering(true);

      // 서버 컴포넌트 숨기기
      const serverPosts = document.getElementById("server-posts");
      if (serverPosts) {
        serverPosts.style.display = "none";
      }
    }
  }, [selectedTag, isHydrated]);

  // 하이드레이션 전이거나 클라이언트 필터링이 활성화되지 않았을 때는 아무것도 렌더링하지 않음
  if (!isHydrated || !isClientFiltering) {
    return null;
  }

  // 클라이언트 필터링 활성화시 TaggedPostList 렌더링
  return <TaggedPostList />;
}
