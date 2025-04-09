---
title: '블로그 제작기 - 의존성 충돌 문제'
date: '2025-04-10 03:28'
thumbnail: '/nextJs.avif'
tags: ["Next.js", "Blog", "tailwindcss"]
excerpt: '블로그를 최적화 하는 과정에서 tailwindcss 4 버전에서 발생했던 의존성 충돌 문제를 작성했습니다'
---

> # 블로그 최적화에 대한 고민

블로그의 포스팅 글들이 계속 생겨나면 당연히 최적화 이슈가 생길 것이 뻔해 보였다. 아직 HeroSection이 제대로 완성이 안되었고, 블로그의 글이 많지 않음에도 불구하고 Lighthouse의 퍼포먼스 점수가 평균 55점~ 60점대로 현저하게 낮게 나왔다. 아직 많은 기능들이 구현되지 않았음에도 퍼포먼스의 점수가 낮게 나오는 것이 이상하게 생각되었고, 최적화 할만한 포인트들을 정리했었다.

- 블로그 카드의 썸네일 이미지 최적화
- 블로그 카드에 적용되어 있는 Framer-Motion 제거 및 대체하기 (face-in-up , TiltCard 애니메이션이 적용 중이었음)
- 서버/클라이언트 컴포넌트 철저하게 분리하기
- 클라이언트 컴포넌트 내부의 코드 최적화 & 스플리팅 작업하기

> # 블로그 카드 썸네일 이미지 최적화

썸네일에 사용되는 이미지는 Next에서 제공하는 `Image` 컴포넌트를 사용해서 최적화 했다. Next에서 기본적으로 이미지를 리사이징, lazy loading 같은 최적화 기능을 제공해주고 있어서 너무 편리했다. 이전에 React 환경에서는 SVG 파일을 컴포넌트화 시켜주는 `vite-plugin-svgr`을 설치하고 `vite.config.ts`에 별도의 설정을 해줘야 했기 때문이다. 그리고, 아래의 `PostCard.tsx` 컴포넌트 역시 서버/클라이언트 컴포넌트로 나누어서 렌더링 성능 최적화에 집중했다.

```javascript

//PostCard.tsx의 내용

import Image from "next/image";
import type { PostCardProps as BasePostCardProps } from "@/types/posts";
import PostCardClient from "./PostCardClient";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const defaultImagePath = "/harpSeal.jpg";

export default function PostCard({
  post,
  index = 0,
}: {
  post: BasePostCardProps & { excerpt?: string };
  index?: number;
}) {
  // 서버에서 미리 데이터 가공
  const thumbnailSrc = post.thumbnail || defaultImagePath;
  const formattedDate = format(new Date(post.date), "yyyy년 MM월 dd일", {
    locale: ko,
  });

  return (
    <div className="h-full w-full">
      <PostCardClient slug={post.slug} index={index}>
        <div className="rounded-2xl overflow-hidden h-full flex flex-col">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={thumbnailSrc}
              alt={post.title}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={true}
              quality={80}
            />
          </div>

          <div className="w-full h-px"></div>
          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold mb-3 line-clamp-1 leading-relaxed">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm line-clamp-2 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex justify-between items-center text-sm mt-auto pt-2">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </PostCardClient>
    </div>
  );
}
```

> # Framer-Motion 애니메이션 제거

처음 패키지들을 선택할 때, 무겁지 않고 사용하기 좋다는 추천을 받아서 사용하게 된 **애니메이션 전용 라이브러리**다. Tailwind만으로는 구현하기 어려운 애니메이션들을 훨씬 자연스럽고 자유롭게 구현할 수 있게 해줬다. 관련 자료들도 많아서 많은 개발자분들의 코드를 참고하며, 여러 애니메이션들을 적용하는 즐거움이 있었는데 포기하기가 너무 아쉬웠다.

하지만, 블로그 라는 본질에 맞지 않다는 생각도 하게 되었다. 마우스를 hover 하면 마우스에 위치에 따라 기울어지는 TiltCard의 경우, 사용자가 카드를 확실하게 선택했는지 표시가 되지 않아서 실용적인 애니메이션이 아니었다. 개인적으로 3D 카드, 기울기 효과가 너무 매력적이라 적용시켜 보았지만 실제로 구현해보니 괴리감과 UX의 불편함이 더 부각 되어서 아쉬웠다.

Fade-in-up 애니메이션은, 처음 블로그 카드들이 렌더링 될 때 적용되는 애니메이션 이었다. 렌더링 전에는 스켈레톤 UI를 보여주었고, 컴포넌트가 마운트가 될 때 애니메이션이 적용되어서 블로그 카드들이 자연스럽게 순서대로 나타나도록 구현했었다. 하지만 이 역시도 글을 읽은 후 다시 홈으로 돌아갈 때마다 카드 애니메이션이 반복되어 블로그의 가독성을 저하시킨다고 느꼈다. 예를 들어, 다음 포스팅을 빠르게 보고 싶은데 카드들이 하나씩 나타나는 것을 기다리는 것은 사용자 경험 측면에서 좋지 않았다.

이렇게 UX의 관점에서도 효과적이지 못 하고, 브라우저의 성능까지 저해시킨다는 생각이 들어서 두 애니메이션을 제거하게 됐다.

> # 진짜 원인은 의존성 충돌 및 Tailwind 4 / Next.js 조합 이슈

위의 내용들을 토대로 천천히 최적화를 진행해 나갔지만 여전히 라이트하우스의 점수는 변화가 없었다. 컴포넌트 분리, 코드 스플리팅, 라이브러리 및 애니메이션 제거를 하면 눈에 띄는 개선이 되기를 바랐지만, 큰 차이 없이 계속 평균 55~60점대를 유지했다. `First Contentful Paint(FCP)` 와 `Largest Contentful Paint(LCP)`를 계속 개선해야 된다는 의견이 전혀 변하질 않는 것이다. 애니메이션과 썸네일 이미지 최적화가 되지 않아서 생기는 문제라고만 생각했는데 큰 변화가 없어서 어떻게 해결해야 할 지 갈피를 잡기가 어려웠다.

그래서, 차라리 내용들을 하나 둘 씩 줄여보며 테스트를 진행해 보았다. 그러 던 중에, 스켈레톤 UI를 제거하게 됐는데 갑자기 퍼포먼스의 점수가 평균 70점대로 확 오르게 되었다. UX 의 개선을 위해서 넣어놓은 스켈레톤 UI가 그렇게 많은 성능 저하를 일으킨다고 생각하진 않았다. 블로그 카드의 수가 많았다면 모를까, 그런 것도 아니었다.

이 때가지만 해도, 아 스켈레톤 UI가 생각보다 성능 저하를 일으킬 수도 있구나라고 생각하며 이정도 개선에 만족했다. 그리고, 제거했던 애니메이션을 대체하기 위해서 간단한 수준으로만 구현하기 위해서 Tailwind로 별도의 커스텀 애니메이션을 만들었는데 이게 왠걸... 전혀 적용이 되지 않았다. 심지어 자동완성까지 나오지 않는 것을 보니 `tailwind.config.js`에 문제가 있구나 라고 생각했다. 구글링과 GPT에게 물어보며 여러 설정들을 넣어보아도 도무지 적용이 안되었다.

최후의 수단으로 가장 안정적인 버전으로 평가받는 `tailwind v3.3.5` 버전으로 다운그레이드 했더니 그제서야 모든 설정들이 적용되기 시작했다. 내가 작성한 코드가 불완전한 탓도 있겠지만 이렇게 의존성 충돌 및 호환성 문제로 인해서 많은 시간을 들였다는 것이 너무 허무하게 느껴졌다. 신기하게도, 스켈레톤을 적용시키고 난 후에 다시 라이트하우스 측정을 해본결과 놀랍게도 퍼포먼스 점수가 놀랍게도 평균 90점대로 안정적으로 개선되었다.

> # 최신버전이라고 무조건 좋은게 아니다.

이번에 최적화를 진행하면서 느낀 최종 결론이다. 뿐만 아니라, **복잡한 의존성 패키지 설정들은 개발 경험을 너무 저해시킨다**는 것을 뼈저리게 깨달았다. 여러 설정들을 변경하는 과정에서 원치 않았던 에러가 생기거나 VScode의 설정이 변경되는 등.. 을 다시 원래의 버전으로 되돌리는 데에 시간을 더 많이 소비했다. 의존성 패키지 설정은 필요한 부분만 설정하고 최소화 하는 것이 좋아 보이고, 프로젝트를 구성하기 전에 최신 버전이라고 덜컥 설치해버리는 게 아니라 호환성 이슈를 반드시 체크하는 습관을 가지자는 교훈을 얻게 되었다.

사실, 호환성 이슈를 체크해보긴 했으나 워낙 최신버전들 이어서 관련 자료는 없었고 새롭게 생겨난 기능들, 빌드시 더 최적화가 진행된 `Tailwind v4.0.17` 버전을 체험해보고 싶었는데 이번 블로그 프로젝트에서는 아쉽게도 제대로 사용해보지 못 하게 될 것 같다. 혹은 `Next(15.2.3)` 의 버전을 낮추는 것도 하나의 방법이 될 수도 있겠지만 Next와 Tailwind 모두 최근에 대격변이 있었던 만큼 현재의 설정에 만족하고 다음 기능 구현에 집중하는 것이 더 나은 계획이라고 생각한다. 