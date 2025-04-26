import React from "react";
import HeroSectionClient from "./HeroSectionClient";

interface HeroSectionProps {
  tags: string[];
}

export default function HeroSection({ tags }: HeroSectionProps) {
  const taglines = [
    "개발자 지망생의 이야기",
    "프로젝트 리뷰",
    "포트폴리오",
    "알고리즘 문제풀이",
    "기술 트렌드 분석",
  ];

  return (
    <section className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
        <HeroSectionClient taglines={taglines} tags={tags} />
      </div>
    </section>
  );
}
