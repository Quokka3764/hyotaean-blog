---
title: "Next.js로 블로그만들기 2일차임"
date: "2025-03-20"
thumbnail: "/harpSeal.jpg"
tags:
  - Next.js
  - React
  - 블로그
excerpt: "아 생각보다 또 어렵긴하네요"
---

# 이렇게 해야된다고?

왜냐하면 모든 것이 다 그런것임.

## 적용이 안되는 이유?

나도 모르겠음
**모른다고 가만히 있으면 안되지 ㅎㅎ**

![이미지 테스트](/Dev_Thumnail_Front-End_major_.png)

### 테스트할 마크다운 요소들

1. **굵은 글씨** 와 _기울임체_ 그리고 **_두 가지 다_** 적용한 텍스트
2. ~~취소선~~ 텍스트도 테스트해보자

#### 목록 테스트

- 비순서 목록 1
  - 중첩된 항목 1
  - 중첩된 항목 2
- 비순서 목록 2

1. 순서 목록 첫 번째
2. 순서 목록 두 번째
   1. 중첩된 순서 목록
   2. 이것도 잘 되나?

> 인용문은 이렇게 표시됩니다.
>
> 여러 줄로 작성할 수도 있습니다.
>
> > 중첩된 인용문도 가능합니다.

### 코드 블록 테스트

```javascript
// JavaScript 코드 예시
function testFunction() {
  const greeting = "안녕하세요!";
  console.log(greeting);
  return {
    message: greeting,
    timestamp: new Date(),
  };
}

// 객체 선언 예시
const user = {
  name: "홍길동",
  age: 30,
  isAdmin: false,
};
```
