---
title: "블로그 만들기 중간결산"
date: "2025-03-31 12:02"
thumbnail: "/my-favicon.png"
tags: ["Next.js", "블로그", "개발일지"]
excerpt:  "Next.js와 마크다운으로 블로그를 만들면서 느끼는 고민, 그리고 앞으로의 계획 공유"
---

> # Next.js + 마크다운 블로그 만들기: 배운 점 & 계획

블로그를 제작한지 약 2주정도 지나가는 시점에서 Next.js를 통해서 블로그를 만들면서 느낀 점과 앞으로의 계획을 정리하려고 한다. React로는 프로젝트를 계속 진행해와서 익숙했고, 라우팅도 설계도 익숙해서 Next의 서버와 클라이언트 컴포넌트의 개념을 이해하는 것이 그렇게 어렵지는 않았다. 

오히려 효율적인 Next의 라우팅 방식에 감탄했고 SSR과 CSR의 차이를 실감하게 해주었다. 파이널 프로젝트에서 Next를 사용하거나 React로 직접 SSR환경을 구현해보고 싶었는데 그 아쉬움을 블로그를 만들면서 해소가 되엇다.

> # 현재 블로그 프로젝트의 구조

```markdown
.
├── .git/
├── next/
├── node_modules/
├── public/
└── src/
    ├── app/
    │   ├── about/
    │   ├── api/
    │   └── blog/
    │       ├── [slug]/
    │       │   ├── error.tsx
    │       │   ├── loading.tsx
    │       │   └── page.tsx
    │       ├── layout.tsx
    │       └── page.tsx
    ├── components/
    │   ├── post/
    │   │   ├── PostCard.tsx
    │   │   ├── PostCardClient.tsx
    │   │   └── PostList.tsx
    │   ├── HeroSection.tsx
    │   ├── MarkdownRender.tsx
    │   ├── Navbar.tsx
    │   ├── ThemeProvider.tsx
    │   ...
    └── contents/posts/
        ├── awsTechCamp-first-...
        ├── blog-project-p...
        ├── finalProject-PKCE.md
        ├── finalProject-refactor...
        ...
```

> # 서버 컴포넌트와 클라이언트 컴포넌트의 작동 방식과 차이점
Next.js의 가장 큰 특징 중 하나는 서버 컴포넌트와 클라이언트 컴포넌트를 명확히 구분한다는 점이다. 두 컴포넌트의 작동 방식과 렌더링 차이를 명확히 이해하는 것이 Next.js를 효과적으로 활용하는 핵심이라고 생각한다.

## 1. 서버 컴포넌트의 작동 방식

서버 컴포넌트는 **서버에서만 실행되고, 그 결과인 HTML만 클라이언트로 전송**된다. 이 컴포넌트는 다음과 같은 특징이 있다:

1. 브라우저 API 접근 불가 (window, document 등)
2. 이벤트 핸들러 사용 불가 (onClick, onChange 등)
3. React 훅 사용 불가 (useState, useEffect 등)
4. 파일 시스템, 데이터베이스에 직접 접근 가능
5. 환경 변수(process.env)에 안전하게 접근 가능

프로젝트에서의 클라리언트 컴포넌트 예시 :

```javascript
//PostCard.tsx (서버 컴포넌트)
import Image from "next/image";
import PostCardClient from "./PostCardClient";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function PostCard({ post, index = 0 }) {
  // 서버에서 날짜 포맷팅 처리 (클라이언트 JS 번들에 포함되지 않음)
  const formattedDate = format(new Date(post.date), "yyyy년 MM월 dd일", {
    locale: ko,
  });

  return (
    <div className="h-full w-full">
      <PostCardClient slug={post.slug} index={index}>
        {/* 정적 콘텐츠는 서버에서 렌더링 */}
        <div className="rounded-2xl overflow-hidden h-full flex flex-col">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={post.thumbnail || "/defaultImage.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
              priority={true}
            />
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold mb-2 line-clamp-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            )}
            <div className="text-sm mt-auto">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </PostCardClient>
    </div>
  );
}
```

## 2. 클라이언트 컴포넌트의 작동 방식
클라이언트 컴포넌트는 'use client' 지시어를 파일 최상단에 추가하여 선언한다. 
이 컴포넌트는 클라이언트(브라우저)에서 실행되며 다음 특징을 가진다:
1. 브라우저 API 사용 가능
2. 이벤트 핸들러 사용 가능
3. React hook 사용 가능
4. 인터렉티브한 기능 구현 가능
5. 클라이언트 상태 관리 가능

프로젝트에서의 클라리언트 컴포넌트 예시 :

```jsx
// PostCardClient.tsx
"use client";

import Link from "next/link";
import TiltCard from "../TiltCard";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PostCardClient({ slug, children, index = 0 }) {
  // 클라이언트 상태 관리 (서버 컴포넌트에서는 불가능)
  const { isDarkMode } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  // 브라우저 API 사용 (서버 컴포넌트에서는 불가능)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 초기 로딩 상태 처리
  if (!isMounted) {
    return (
      <div className="h-full">
        <div className="rounded-2xl h-full flex flex-col backdrop-blur-sm bg-white/10 border border-white/20 animate-pulse">
          {/* 스켈레톤 UI */}
        </div>
      </div>
    );
  }

  // 인터랙티브 요소 (애니메이션, 호버 효과 등)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full"
    >
      <TiltCard maxTilt={10} perspective={800} transitionSpeed={0.3} className="h-full">
        <Link href={`/blog/${slug}`} className="block h-full">
          <div
            className={`${
              isDarkMode
                ? "backdrop-blur-sm bg-white/10 text-white"
                : "group backdrop-blur-sm text-gray-800"
            } rounded-2xl overflow-hidden h-full flex flex-col transition-colors`}
          >
            {children}
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
```
> # SSR과 CSR의 차이를 확실하게 느꼈다  
  
퍼포먼스에 영향을 주는 JS를 같이 렌더링 해서 초기에 로딩 속도가 느린 CSR. 하지만, 무거운 JS부분은 따로 클라이언트 컴포넌트로 분리해서 정적인 html 부분인 서버컴포넌트를 먼저 렌더링 해주는 SSR. 이미 라이트하우스 점수에서 부터 확연한 차이가 드러났다.
특히 "최적화" 라는 관점에서 컴포넌트를 정말 세밀하게 원하는 만큼 최적화가 가능하다는 점에서 자유도가 높다고 생각했다. 물론 지금은 내 블로그는 기능이 거의 없는 셈이지만, 그런 부분을 감안해도 벌써부터 할 수 있는게 많다는게 느껴진다는게 핵심이다.

## 1. 서버/클라이언트 컴포넌트 분리를 통한 최적화
1. JavaScript 번들 최적화
PostCard 컴포넌트를 서버/클라이언트로 분리하면서 가장 먼저 느낀 점은 클라이언트에서 실행되는 JavaScript의 양을 직접 제어할 수 있다는 것이다. 예를 들어,
```tsx
// PostCard.tsx (서버 컴포넌트)
// 서버에서 미리 처리
const formattedDate = format(new Date(post.date), "yyyy년 MM월 dd일", {
  locale: ko,
});
```
단순한 예시지만, 이런 식으로 date-fns와 같은 라이브러리를 서버에서만 사용하도록 함으로써 클라이언트 번들에서 제외할 수 있다는 점을 깨달았다. 개발자 도구의 Network 탭에서 확인해보니 실제로 JavaScript 리소스 크기가 줄어든 것을 확인할 수 있었다.

## 2. 렌더링 경험 개선
클라이언트 컴포넌트인 PostCardClient에서는 인터랙티브 요소(틸트 효과, 애니메이션)만 처리하고, 이미지나 텍스트 콘텐츠 같은 정적 요소는 모두 서버 컴포넌트인 PostCard에서 처리하도록 분리했다.
```tsx
// PostCardClient.tsx
// 클라이언트 사이드에서만 마운트되는 코드
useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  // 스켈레톤 UI 표시
  return <Skeleton />;
}
```
개발 서버에서 네트워크 스로틀링을 적용해 테스트해 보니, 정적 콘텐츠가 먼저 표시되고 인터랙티브 요소가 나중에 로드되는 것을 확인할 수 있었다. 이전에는 모든 요소가 한꺼번에 로드되기를 기다려야 했던 것과 비교하면 체감상 페이지 로딩 경험이 개선되었다.
React도 불가능 하다는 것은 아니지만, 데이터패칭과 JS 컴포넌트를 Next처럼 나누어서 관리하려고 하면, 수동으로 유지보수를 해야 된다고 생각하면 아찔하다.

실제로 나는 파이널 프로젝트에서 라우팅 방식을 Data Router를 선택해서 데이터 패칭을 먼저 렌더링하고, 추후에 컴포넌트 UI가 그려지는 방식을 구현하려고 했었다. React 18부터 도입된 새로운 라우팅 방식이었고 완전한 SSR은 아니지만, 결국 React가 추구하는 방향은 Next와 같이 SSR과 유사한 환경의 렌더링 방식으로 구현해보기를 권장했던 것이라고 짐작해본다. 왜냐하면 더 이상 새로운 기능이 나올 것이 없는 웹 개발 환경에서 "최적화"의 편리함을 제시해주면 기존의 React만 사용하던 개발자들에게는 매우 환영받을 것이기 때문이다.

처음부터 파이널 프로젝트를 Next로 진행하기를 바랐지만 현실적인 한계에 부딪혔던 나로써는 나름의 집착에 가까운 느낌으로 여기에 매달렸었다. 특히 수동으로 SSR을 구현할 때의 문제는, 여러 기능들이 추가가 되면서 수동으로 직접 데이터 패칭의 순서를 제어하는 것은 사실상 무리였다.

팀원들이 만든 조각 조각 나누어진 기능들의 순서를 제대로 배치하기는 상당히 까다로웠고 에러가 발생해도 디버깅하는 것은 더더욱 불가능에 가까웠다. 단순하게 데이터 패칭의 순서 때문에 일어난 문제인지, 아니면 팀원이 의도한 구현의 방식과 렌더링 타이밍이 충돌하면서 나오는 오류인지 정확하게 파악하기가 어려웠다. 강사님께도 이 부분에 대해 문의를 했었지만 프로젝트 일정의 문제, 복잡한 난이도에 비해 얻는 이점이 별로 없을 것 같다는 이야기에 결국 포기했었다.

> # 제대로 된 최적화를 해본 적이 없었다

일반적인 React 환경에서는 한 컴포넌트에 너무 많은 기능이 몰려 있어서 나중에 최적화를 하려고 하면 코드가 너무 길어서 사실상 불가능했다. 기능구현에만 집중하다보니 아키텍쳐에 대한 이해와 최적화에 대한 관점은 신경을 쓰지 않았던 것이 사실이다.

제일 걱정 되었던 부분은 클라이언트의 상태관리가 기능이 많아지면서 복잡해지고, 배포환경에서 원치 않는 에러를 만나서 기능이 동작하지 않는 상황이었다. 자주 일어나다 보니 일단 기능을 만들고보자라는 생각으로 코드를 만들었고, 그 결과 나중에는 코드의 가독성은 현저히 떨어지고 최적화를 위해서 건들기에는 도대체 어디서 부터 해야할지 난감한 상황이 많았다.

하지만 Next는 처음부터 폴더구조를 제대로 잡고 시작해야하기 때문에, 최적화 관점에서는 Next가 훨씬 편하다는 생각을 할 수 밖에 없었다. 컴포넌트도 사실상 "강제로" 서버컴포넌트와 클라이언트 컴포넌트로 나누어야 한다. 클라이언트 컴포넌트 내에서도 코드 스플리팅을 통한 JS 분리가 쉬운 편이라서 추후 디버깅과 성능 최적화 작업이 한결 수월한 편이었다.

예를 들어, 블로그 글 목록 컴포넌트의 경우는 아래와 같이 효율적으로 구성할 수 있었다.

```tsx
//post/PostList.tsx
import type { PostCardProps } from "@/types/posts";
import PostCard from "./PostCard";

interface PostListProps {
  posts: PostCardProps[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div key={post.slug} className="h-full">
          <PostCard post={post} index={index} />
        </div>
      ))}
    </div>
  );
}

```

> # 앞으로의 계획
블로그의 기본적인 기능은 잡힌 것 같지만, 아직도 해야할 일이 많다.
## 1. HeroSection의 부재
  - 진짜로 어떤 내용이 들어가면 좋을지 고민을 해봤는데, 아직도 정하지는 못 했다.
  - 내가 누구인지 소개해주는 부분(About), 최신글, 그리고 IT News(후순위!!) 같은 것을 구성해보려고 한다.
## 2. 포스팅 방식 변경 ✔
  - .md파일을 로컬에 저장할 것이 아니라 Github Action의 CI 파이프라인을 통해 Supabase에 블로그 내용을 저장하고 .md파일은
  이제는 템플릿만 남기는 방식으로 변경할 예정.
  - 블로그 내용 수정이 어려워 질 수 있는데, 관리자 페이지를 별도로 만들 예정이다.
  - 가장 고민이 되는건 빌드 타이밍과 동기화 부분이다. 지금은 빌드하고 배포하면 그만이겠지만, DB에 글을 저장하면 SSR이나 ISR등 고려해야할 부분이 있다는 것을 알게 되었다. 조금 더 디테일하게 알아봐야겠다.
## 3. 검색기능 및 태그 기반 필터링
  - 글이 많아진다면 검색기능과 필터링이 반드시 필요할 것이다.
  - 댓글 기능은 왠지 모르게 아직 안 만들고 싶은데 이유는 잘 모르겠다.
  - 그런데 관리자 페이지를 만들면서 자연스럽게 만들지 않을까 싶다.
