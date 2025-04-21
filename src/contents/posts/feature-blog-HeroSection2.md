---
title: "개발 블로그 제작기 - 매력적인 메인화면을 위한 고민 (2편)"
date: "2025-04-15T08:30:00+00:00"
excerpt: "개인 블로그의 HeroSection(메인화면)을 구현한 과정을 구체적으로 담아봤어요!"
thumbnail: "https://lnjeboxqchlxszsitnfp.supabase.co/storage/v1/object/public/blog-images/thumbnails/7df92f4d9a8854bc.avif"
tags: ["UI/UX", "Next.js", "블로그 제작기"]
---



# HeroSection 현재의 모습

Figma로 전체 디자인을 하고, 여러 레퍼런스들을 참조하되 아래와 같은 조건을 지키려고 노력했다.
- **"안효태, 나의 블로그"** 임이 확실하게 표시되어야 한다.
- 블로그라는 정체성을 잊지 말아야 한다. 가독성이 최우선이다.
- 화려한 디자인과 애니메이션은 오히려 가독성을 해친다.
- **반드시 코드로 구현해보기.**


> # HeroSection

![HeroSection_white](https://lnjeboxqchlxszsitnfp.supabase.co/storage/v1/object/public/blog-images/20250415///a038edc7e205f491.png)
*라이트모드

![HeroSection_dark](https://lnjeboxqchlxszsitnfp.supabase.co/storage/v1/object/public/blog-images/20250415///605ec9ba24884c1a.png)
*다크모드

# 최적화는 필수

메인화면을 구성하고 나니, 역시나 성능 점수가 많이 내려갔다. 원인은 이름과 배경 구현에 여러 레이어의 CSS와 motion.div를 사용한 것이었다. JS번들링 최소화를 위해 코드 스플리팅은 필수였다. 특히 배경 구현에서 많은 고민이 있었다. 가장 단순한 해결책은 적절한 이미지를 넣는 것이었지만, 개발자의 아집이 발동해서 코드로 직접 구현해보고 싶었다. Tailwind와 CSS를 조합하고 Framer-Motion은 최소한으로 활용해서 별이 반짝이는 듯한 배경효과를 만들었다.

단색 배경은 너무 단조로운 것 같아서 추가적인 약간의 취향을 더했다. 라이트모드와 다크모드 모두 적절해 보이는 그라데이션을 적용해서 최대한 심심해 보이지 않게 노력했다. 이렇게 성능과 시각적인 부분, 그리고 가독성 사이에서 균형을 찾다보니 생각보다 많은 시간이 걸리게 됐다.

서버/클라이언트 렌더링 간의 불일치를 해결하면서도 테마에 따른 동적 변화를 구현하는데 초점을 뒀다. 배경 효과를 넣으면서도 불필요한 리렌더링이나 레이아웃 시프트가 발생하지 않도록 신경썼다. 앞으로도 추가적인 코드 스플리팅과 최적화가 필요해 보이지만, 일단은 균형 잡힌 버전을 완성했다.

## 배경 컴포넌트

```javascript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// 개별 컴포넌트들 명시적 임포트
import Stars from "./Stars";
import BackgroundGradient from "./BackgroundGradient";
import LightEffects from "./LightEffects";
import NebulaTerrain from "./NebulaTerrain";
import GridPattern from "./GridPattern";
import DecorativeLines from "./DecorativeLines";

export default function SpaceBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 커스텀 디바운스 처리
  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current);
    }

    resizeTimerRef.current = setTimeout(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);
  }, []);

  useEffect(() => {
    // 클라이언트 사이드에서 마운트 시 초기 크기 설정
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // 리사이즈 이벤트 리스너 설정
    window.addEventListener("resize", handleResize);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [handleResize]);

  // 서버 사이드 렌더링 대응
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <BackgroundGradient isDark={isDark} />

      <Stars
        isDark={isDark}
        windowWidth={dimensions.width}
        windowHeight={dimensions.height}
      />

      {isDark ? (
        <>
          <LightEffects />
          <NebulaTerrain />
        </>
      ) : (
        <GridPattern />
      )}

      <DecorativeLines isDark={isDark} />
    </>
  );
}
```

# 블로그의 메인, HeroSection 구현하기

블로그의 정체성을 보여주는 곳이라 매우 중요하다고 생각했다. 글리치효과를 넣고 약간의 그라데이션 차이를 통해서 라이트모드와 다크모드일 때의 모습이 살짝 다르게 구성했다. 마찬가지로 여러겹의 CSS와 tailwind가 있어서 서버/클라이언트 컴포넌트로 많이 나누게 되었고 최종적으로는 아래와 같은 방식으로 작성하게 됐다.

```javascript
//HeroSection.tsx
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

//HeroSectionClient.tsx

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
```

최대한 집중한 부분은 서버/클라이언트 컴포넌트의 깔끔한 분리였다. 서버 컴포넌트인 HeroSection에서는 데이터와 레이아웃만 관리하고, 실제 인터랙션과 상태 관리는 클라이언트 컴포넌트인 HeroSectionClient로 최대한 위임시켰다.

tagline의 경우에는 4초마다 변경되도록 수동으로 구현했다. `useEffect`와 `setInterval`을 활용해 tagline이 순환되도록 했고, 마운트 해제 시 interval을 정리하는 클린업 함수를 넣어줬다. 메모리 누수를 방지하고 컴포넌트가 언마운트된 후에도 불필요한 상태 업데이트가 발생하지 않도록 노력했다. 또한 배경 컴포넌트에서도 그랬지만 `mounted` 상태를 통해 하이드레이션 이슈를 처리했다. 차이점은 배경과는 달리 이름 부분과 tagline, tags 들은 마운트 되기 전에는 스켈레톤 UI를 보여주도록 구성했다.


# 앞으로의 계획

생각보다 블로그를 만드는게 쉽진 않은 것 같다. Next라는 새로운 환경 때문만은 아니다. 단순하게 글을 올리고 포스팅하고 배포하는 과정 자체는 기존의 React와 똑같아서 큰 어려움은 없다. 나의 취향을 넣으면서도 아이디어와 디자인, 컨텐츠에 대한 고민이 지금까지도 이어지고 있다. 기본 MVP기능들은 구성된 것 처럼 보이지만 여전히 갈길이 먼 것 같다.

🔥 계획
- 블로그 운영방식과 그 방향에 대한 포스팅 자세하게 작성하기
  - 글의 포스팅 및 수정은 어떻게 하는가?  등등..
  - 배포는 왜 안해?
- 태그 필터링 기능 및 검색기능 구현하기
 - 현재 UI사이즈 및 라우팅과 관련된 고민으로 추상화에 고민이 있음.
- 나에 대한 소개 페이지 간단하게라도 작성하기