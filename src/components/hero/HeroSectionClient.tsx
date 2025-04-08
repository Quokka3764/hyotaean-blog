"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import HeroMainTitle from "./HeroMainTitle";
import HeroTagline from "./HeroTagline";
import HeroDescriptionSearch from "./HeroDescriptionSearch";
import HeroTagFilters from "./HeroTagFilters";
import HeroSectionSkeleton from "./HeroSectionSkeleton";

export default function HeroSectionClient({
  taglines,
  tags,
}: {
  taglines: string[];
  tags: string[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(taglineInterval);
  }, [taglines.length]);

  if (!mounted) {
    return <HeroSectionSkeleton />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <HeroMainTitle />
      <HeroTagline
        isDark={isDark}
        taglines={taglines}
        currentTaglineIndex={currentTaglineIndex}
      />
      <HeroDescriptionSearch isDark={isDark} />
      <HeroTagFilters
        isDark={isDark}
        tags={tags}
        selectedTagIndex={selectedTagIndex}
        setSelectedTagIndex={setSelectedTagIndex}
      />
    </>
  );
}
