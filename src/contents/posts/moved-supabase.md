---
title: 'Supabase로 블로그 운영하기'
date: '2025-04-02 14:28'
thumbnail: '/supabase-logo.png'
tags: ["Next.js", "S3", "CI", "GithubAction", Supabase]
excerpt: '블로그의 내용을 Supabase로 옮기기'
---

> # 정적 블로그에서 서버리스 기반 블로그로 전환!

일반적인 블로그 운영 방식은, 브라우저에 에디터를 구현해서 글을 포스팅하면 바로 supabase에 저장되는 방식으로 구현하는 것이 쉽고 편한 방법이었을 것 같다. 하지만, 데브코스에서 늘 하던 방식이라서 식상하다는 느낌이 있었다. 그래서 색다른 운영방식을 찾다가 선택한 방법이 "MD파일을 기반으로 블로그 포스팅하기" 였다. VScode에서 md 파일로 블로그를 작성하고, push를 넣으면 잔디도 심어지고, 내가 공부한 내용을 포스팅 할 수 있는 1석 2조의 방식이라고 생각했다.

심지어, react-markdown을 사용하면 md파일에서도 쉽게 마크다운 구현 및 코드 하이라이팅도 가능해서 자유도가 높은 글쓰기가 가능했다. 하지만 시간이 지날수록 쌓여가는 블로그 게시글들이 거슬리기 시작했다. 특히 md파일들과 썸네일, 이미지 등...이 계속 로컬에 남으니까 용량이 많지는 않더라도 **"하드코딩"** 같다는 생각이 들었다. 장기적으로도 안 좋아 보였고, 추후의 **확장성**까지 고려해서 Supabase를 활용해서 블로그의 운영을 변경하기로 결정했다.

솔직히 고백하면, 데이터 패칭이 이루어지는 운영이 되어야 개발자의 블로그 운영방식에도 의미가 있는 것 같다는 느낌도 있었다. Supabase는 정규과정에는 없었지만 팀원들의 권유로 지난 프로젝트에서 활용해 본 경험이 있었다. 아쉽게도 그 때는 퍼블리싱을 맡았기 때문에, DB 테이블을 만들 기회가 없었다. 아직 많은 기능이 있진 않아서 DB를 만드는게 어려운 것은 아니었지만, 기존의 코드들을 모드 덜어내고 다시 리팩토링 하는 작업은 역시나 시간이 많이 걸리는 작업이었다.

아직 완전히 끝난 것은 아니지만, 지금까지의 작업단계를 정리하고 느낀점들을 정리하려고 한다.


> # 1. Github Action을 활용한 md파일 정리하기

Github가 왜 개발자들의 필수품이 되었는지 이번에 확실히 알았다. 물론 데브코스의 정규과정에서도 Github 특강을 해주긴 했는데, 솔직히 시간관계상 디테일한 내용을 다루지는 못 하고, 실무적인 내용들은 빠진 느낌이라 아쉬웠다.

Supabase로 운영을 변경하면서 꼭 유지하고 싶었던 것은..

- 현재 Vscode에서 md파일을 작성해서 블로그를 포스팅 하는 방식은 유지하기
- 계속 쌓여가는 md파일과 이미지들을 안전하게 저장할 저장소 찾기


이 두가지가 핵심이었고, 그래서 도입한 것이 **"Github Action의 CI 파이프라인 구성"** 이었다. 여러가지 용도가 있겠지만, 주로 코드 테스팅을 통한 품질 향상 및 배포 전의 에러를 감지해서 알려주는 용도로 많이 사용하는 것 같았다. 나는 블로그의 내용을 commit & push를 하면 자동으로 Supabase에 저장 시키고 md파일의 내용을 템플릿만 남기고 모두 초기화 시키도록 구성했다. 

아래는 Github Actinon을 활용한 yml파일의 내용이다.

```yml
name: Blog CI Pipeline

on:
  push:
    branches: [main]
    paths: ["src/contents/posts/**"]

permissions:
  contents: write

jobs:
  process-content:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3 

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Install tsx
        run: pnpm add -D tsx

      - name: Process markdown files
        run: npx tsx scripts/process-markdown.ts
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL}}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Commit template files
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add src/contents/posts/
          git commit -m "chore: update templates after processing" || echo "No changes to commit"
          git push "https://${{ github.actor }}:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git" HEAD:main

```

총 단계별로 설명하자면, 

## on.push.branches & paths
- main 브랜치에 있는 src/contents/posts 의 파일들 (블로그 md파일이 저장되는 장소)가 변경될 때만 이 파이프라인이 실행된다

## pnpm/ Node.js 세팅 & 의존성 설치
- 블로그의 스크립트를 실행하기위해서 pnpm, Node.js의 버전을 맞춰주고, pnpm install로 필요한 패키지 설치

## Process markdwon files
- tsx를 통해서 scripts/process-markdown.ts 스크립트를 실행한다.
- Supabase에 블로그 내용을 업로드 하고, md파일 초기화를 자동으로 해준다.

## Commit temlate files
- process-markdown.ts 에서 md파일 내용을 처리하고, 템플릿만 남긴뒤 다시 Github에 commit & push를 한다.
- 변경사항이 없다면 커밋이 스킵되도록 설정했다 `|| echo "No changes to commit"`

> # 2. 이미지 파일은 Supabase의 Storage에 별도로 저장

Supabase는 Storage를 제공해서 이미지 파일을 별도로 관리해주는 저장소를 제공해준다. AWS의 S3와 같은 개념이다. 그래서 md 파일의 내용을 별도로 파싱하여 썸네일과 본문의 이미지 파일을 감지해서 그것만 별도로 Storage에 저장하도록 구성했다. 그런데, 이미지 저장까지는 성공했는데, 중복되는 이미지를 다시 업로드 하는 경우, 별도로 캐싱을 하는 등.. 의 별도의 로직이 필요해 보인다. 아직 이 부분은 작업중에 있다 😢


> # 현재 방식의 단점 및 보완해야할 점

- 별도의 관리자 페이지가 없어서 즉각적인 글의 수정이 어렵다.
  - 사실상 반드시 만들어야 할 부분인 것 같다 ㅠㅠ 
- 새롭게 글 작성할 때 마다 `git pull origin main` 을 해줘야 한다.
  - 찾아보면 이것도 VScode의 로컬 환경에도 적용하는 함수를 만들 수 있을 것 같은데, 계속 실패중이다 ㅠ


> # 느낀점

Supabase를 기반으로 블로그의 운영방식을 바꾸면서 중간 과정의 기록을 정리하려고 한다.
많은 느낀 점들이 있는데, 조금은 구체적으로, 기술적으로 서술해보려고 한다. 정말 하고 싶은 말과 궁금증은 많은데
쓰다 보니 가독성도 떨어지고 무슨 말을 하려는건지도 모르겠더라..
그냥 막 쓰다보니 진짜 한탄 가득한 글이 되어서 (의도한건 절대아님!!!) 쓰고 지우고를 몇번 반복하는 건지 모르겠다.
일기장을 별도로 만드는 것도 좋아보인다. 🤣


이건 마지막으로.. 이미지 중복 저장 방지용 테스트!!!!!


![이미지중복테스트](/my-favicon.png)







