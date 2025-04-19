"use client";

import { useState, useEffect, useCallback } from "react";
import { useTagStore } from "@/store/useTagStore";
import HeroMainTitle from "./HeroMainTitle";
import HeroTagline from "./HeroTagline";
import HeroDescriptionSearch from "./HeroDescriptionSearch";
import HeroTagFilters from "./HeroTagFilters";

interface HeroSectionClientProps {
  taglines: string[];
  tags?: string[];
}

export default function HeroSectionClient({
  taglines,
  tags = [],
}: HeroSectionClientProps) {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  const selectedTag = useTagStore((s) => s.selectedTag);
  const setSelectedTag = useTagStore((s) => s.setSelectedTag);

  const handleTagSelection = useCallback(
    (idx: number) => setSelectedTag(tags[idx]),
    [setSelectedTag, tags]
  );

  // 태그라인 자동 전환
  useEffect(() => {
    const iv = setInterval(
      () => setCurrentTaglineIndex((i) => (i + 1) % taglines.length),
      4000
    );
    return () => clearInterval(iv);
  }, [taglines.length]);

  const selectedTagIndex = Math.max(0, tags.indexOf(selectedTag));

  return (
    <>
      <HeroMainTitle />
      <HeroTagline
        taglines={taglines}
        currentTaglineIndex={currentTaglineIndex}
      />
      <HeroDescriptionSearch />
      <HeroTagFilters
        tags={tags}
        selectedTagIndex={selectedTagIndex}
        setSelectedTagIndex={handleTagSelection}
      />
    </>
  );
}
