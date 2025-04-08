import HeroSectionClient from "./HeroSectionClient";

export default function HeroSection() {
  const taglines = [
    "개발자의 성장 이야기",
    "프로젝트 리뷰",
    "웹 개발 인사이트",
    "알고리즘 문제풀이",
    "기술 트렌드 분석",
  ];

  const tags = [
    "All",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Algorithm",
    "Performance",
  ];

  return (
    <section className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
        <HeroSectionClient taglines={taglines} tags={tags} />
      </div>
    </section>
  );
}
