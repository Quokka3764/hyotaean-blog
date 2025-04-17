"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import HeroMainTitle from "./HeroMainTitle";
import HeroTagline from "./HeroTagline";
import HeroDescriptionSearch from "./HeroDescriptionSearch";
import HeroTagFilters from "./HeroTagFilters";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
import { useTagStore } from "@/store/useTagStore";

interface HeroSectionClientProps {
  taglines: string[];
  tags?: string[];
}

export default function HeroSectionClient({
  taglines,
  tags = [],
}: HeroSectionClientProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  const selectedTag = useTagStore((s) => s.selectedTag);
  const setSelectedTag = useTagStore((s) => s.setSelectedTag);

  // 모든 훅은 최상단에서 호출
  const isDarkMode = (theme === "system" ? systemTheme : theme) === "dark";

  const handleTagSelection = useCallback(
    (idx: number) => setSelectedTag(tags[idx]),
    [setSelectedTag, tags]
  );

  // 마운트 스켈레톤 제어
  useEffect(() => {
    setMounted(true);
  }, []);

  // 태그라인 자동 전환
  useEffect(() => {
    const iv = setInterval(
      () => setCurrentTaglineIndex((i) => (i + 1) % taglines.length),
      4000
    );
    return () => clearInterval(iv);
  }, [taglines.length]);

  if (!mounted) {
    return <HeroSectionSkeleton />;
  }

  const selectedTagIndex = Math.max(0, tags.indexOf(selectedTag));

  return (
    <>
      <HeroMainTitle />
      <HeroTagline
        isDark={isDarkMode}
        taglines={taglines}
        currentTaglineIndex={currentTaglineIndex}
      />
      <HeroDescriptionSearch isDark={isDarkMode} />
      <HeroTagFilters
        isDark={isDarkMode}
        tags={tags}
        selectedTagIndex={selectedTagIndex}
        setSelectedTagIndex={handleTagSelection}
      />
    </>
  );
}
