---
title: '블로그 제작기 - 다크모드 적용'
date: '2025-04-05 13:40'
thumbnail: '/nextJs.avif'
tags: ["블로그","Blog","next-themes","Next.js","tailwindCSS"]
excerpt: 'Next에서 다크모드 적용 및 수정'
---

> # next-themes를 설치하게 된 이유

결론부터 말하자면, `next-themes`를 사용하고 싶은 생각은 없었다. 
이미 `tailwindcss`를 사용해서 기본적인 다크모드 적용 시켰기 때문이다. 그런데 가장 큰 문제는 "플래시" 현상이었다

다크모드인 상태에서 새로고침시 라이트모드로 변경되었다가 다시 다크모드로 돌아오는 문제가 발생하는 것이었다.
전형적인 hydration 타이밍 불일치 문제로 보였는데, 기존의 방식은 인라인 `script`를 활용해서 `hydration` 불일치 및 경고를
최소화 시키는 방법을 사용하고 있었다.

app/page.tsx에 아래와 같이 인라인 `script`태그를 넣어서 `hydration` 경고 및 렌더링과의 타이밍 불일치를 최소화 하려고 시도했었다.
거기에 더해서 `Zustand`를 통한 전역 상태관리를 활용해서 일관성 있는 테마 관리를 시도했지만,
플래시 현상은 전혀 고쳐지지 않았다.

인라인 스크립트 :
```Javascript
<head>
<script>
  dangerouslySetInnerHTML={{
             __html: `
               try {
                 // 기본값으로 isDarkMode: true를 적용 (themeStore의 기본값과 일치)
                 let isDarkMode = true;
 
                 // 로컬 스토리지 확인
                 const storedTheme = localStorage.getItem('theme-storage');
                 if (storedTheme) {
                   const theme = JSON.parse(storedTheme);
                   isDarkMode = theme.state && theme.state.isDarkMode;
                 } else {
                   // 사용자 시스템 설정 확인
                   isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                 }
 
                 // 클래스 적용
                 if (isDarkMode) {
                   document.documentElement.classList.add('dark');
                 } else {
                   document.documentElement.classList.remove('dark');
                 }
               } catch (e) {
                 // 오류 발생 시 기본값(dark) 적용
                 document.documentElement.classList.add('dark');
                 console.error('Failed to apply theme:', e);
               }
             `,
           }}
</script>
</head>
```

> # 결국 원인은 hydration 타이밍 불일치

위에서 설명한 인라인 `script` 태그는 임시적으로 `hydration` 을 최소화 시켜주는 것은 맞지만
플래시 현상까지 세밀하게 `hydration` 관리를 해주는 것은 아니었다. 최종 원인은, html정적 문서가 파싱되기 전에
위의 인라인 스크립트 태그가 먼저 파싱되어야 브라우저의 테마 상태관리를 일관되게 관리를 할 수가 있었다.

즉, **브라우저에서는 내가 라이트모드인지 다크모드인지 정확하게 구분하지 못 하는 상황인 것이다.**
처음 킬 때는 라이트모드가 기본값이기 때문에 상관이 없었다. 하지만, 서버를 구동한 다음 다크모드에서 새로고침을 하게 되면 렌더링시 `script` 태그를 먼저 읽어내어 테마의 상태를 파악해야 하는데 html의 규칙으로 인해서 테마의 상태를 알 수 없는 상황이 된 것이다.

실제로, 개발자 도구에서는 html규칙으로 인한 오류가 나오지만 위의 인라인 `script`를 순서를 바꿔서 먼저 파싱되도록 하면 플래시 현상은 사라졌었다. 그럼에도, Next의 SSR 환경에서 권장하지 않는 방식이면서도, 어떤 오류가 발생할 지 모르기 때문에 장기적으로 좋지 않을 것이라고 판단했다. 

결국 `next-themes` 라이브러리를 설치했다. SSR환경에 최적화 되어있고 `hydration` 불일치 문제도 많이 해결해준다고 하였다.
`next-themes` 가 자동으로 다크모드/라이트모드를 전부 적용시켜주는 것은 아니다. className 속성에 `dark` 를 토글 할 수 있도록 해주는
라이브러리다. 테마에 대한 설정은 별도로 taiwlindcss에 구성해두어야 하는 것은 변함이 없다.

재밌는 사실은, `next-themes`가 SSR 환경에서 `hydration` 관리를 하는 원리도 결국은 인라인 `script` 태그를 활용한 타이밍 조절이었다.
다만 개발자들이 구체적으로 파악하기 힘든 부분까지 자동으로 관리를 해줘서 많은 불편함을 해소해준다는 것이 핵심이다.

> # `useTheme` 적용하기

눈물을 머금고 Zustand로 적용 시켰던 다크모드 테마들을 제거하고, `next-themes` 의 방식으로 컴포넌트들을 변경시켰다.
`useTheme`은 `ThemeProvider`에서 제공하는 테마 상태를 읽고, 테마 변경 함수인 `setTheme`을 사용할 수 있게 해주는 훅이다.

이미 다크모드 셋팅은 `tailwind.config.js` 에 구성을 해 뒀고, 
여기서는 SSR에서 발생하는 플래시 현상을 줄이기 위한 목적(`hydration` 문제 해결)으로만 테마를 읽어서 브라우저 환경이 dark인지 아닌지만 판별하도록 구성했다.

아래 예시는 PostCardClient.tsx에 `useTheme`를 적용한 일부 코드다:

```javascript
import { useTheme } from "next-themes";

function PostCardClient({ slug, children, index = 0 }: PostCardClientProps) {
  // 1. useTheme 훅을 사용해서 테마상태를 읽기 위한 준비
  const { theme, systemTheme } = useTheme();
 
  //2. mounted 상태 체크
  const [mounted, setMounted] = useState(false);

  //3. 클라이언트 사이드에서만 마운트되도록 처리
  useEffect(() => {
  setMounted(true);
}, []);

//4. isDarkMode와 mounted 상태를 체크해서 테마의 상태를 판별함
const isDarkMode =
  mounted && (theme === "system" ? systemTheme : theme) === "dark";
}

//이하 생략...
```

### next-themes 라이브러리 사용방식
- 현재 적용된 테마('dark', 'light', 'system')를 조회 가능
- 이를 활용해서 SSR 환경에서도 hydration 문제 없이 다크모드를 안정적으로 사용 가능
- useTheme 훅을 통해 theme, systemTheme 값을 가져올 수 있다.


> # 앞으로의 계획 - 컨텐츠 추가 및 최적화

## 1. HeroSection에 들어갈 컨텐츠 추가
  - 자기소개, 최신글 두가지를 먼저 구성할 예정

## 2. 렌더링 최적화
  - 라이트하우스의 퍼포먼스가 상당히 낮은편이다. 50점 전후반대 정도.
  - framer-motion 최적화를 어제 진행했지만 아직은 미완성이라서 더 수정할 예정.
  - Skelton UI가 생각보다 리소스를 많이 사용한다는 것을 깨달았다. 어떻게 최적화 해야될지 찾아보고 적용시켜볼 예정

## 3. CI/CD 파이프라인 구성 완료하기
  - 아직 배포를 어떻게 할지 고민이었는데 일단 `Netlify` 혹은 `Vercel` 을 통해서 배포를 빠르게 진행해 볼 예정
  - 글의 수정, 삭제, Preview 까지 편하게 할 수 있게 CMS 구성을 완료할 예정

