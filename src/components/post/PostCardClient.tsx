"use client";

import Link from "next/link";
import TiltCard from "../TiltCard";
import PostCardSkeleton from "./PostCardSkeleton";
import { useTheme } from "next-themes";
import { useMemo, memo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PostCardClientProps {
  slug: string;
  children: React.ReactNode;
  index?: number;
}

function PostCardClient({ slug, children, index = 0 }: PostCardClientProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트되도록 처리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다크모드
  const isDarkMode =
    mounted && (theme === "system" ? systemTheme : theme) === "dark";

  // IntersectionObserver를 위한 상태 및 참조
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  //메모이제이션
  const cardStyles = useMemo(() => {
    return isDarkMode
      ? "backdrop-blur-sm bg-white/10 text-white"
      : "group backdrop-blur-sm bg-gray-50 text-gray-800";
  }, [isDarkMode]);

  // 애니메이션 변수 메모이제이션
  const animations = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: {
        duration: 0.2,
        delay: index * 0.05,
        ease: "easeOut",
      },
    }),
    [index, isVisible]
  );

  // IntersectionObserver 설정
  useEffect(() => {
    if (!cardRef.current || !mounted) return;
    //변수에 저장
    const currentElement = cardRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(currentElement);

    return () => {
      observer.unobserve(currentElement);
    };
  }, [mounted]);

  if (!mounted) {
    return <PostCardSkeleton />;
  }

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        initial={animations.initial}
        animate={animations.animate}
        transition={animations.transition}
        className="h-full"
        style={{ willChange: "transform, opacity" }}
      >
        <TiltCard
          maxTilt={10}
          perspective={800}
          transitionSpeed={0.3}
          className="h-full"
        >
          <Link
            href={`/blog/${slug}`}
            className="block h-full"
            prefetch={false}
          >
            <div
              className={`${cardStyles} rounded-2xl overflow-hidden h-full flex flex-col transition-colors`}
            >
              {children}
            </div>
          </Link>
        </TiltCard>
      </motion.div>
    </div>
  );
}

export default memo(PostCardClient);
