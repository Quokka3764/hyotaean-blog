---
title: "파이널 프로젝트 회고록 - 프론트가 해야하는 일 - PKCE"
date: "2025-03-24T17:45:00+00:00"
excerpt: "프로그래머스 데브코스의 파이널프로젝트 개선 로그인 구현 및 개선"
thumbnail: "/React.png"
tags: ["Frontend", "FinalProject", "Blog", "Programmers", "React", "JWT", "Login", "PKCE"]
---


# 프론트가 추가적으로 한 일


## 1. CodeVerifier 생성

> Code Verifier(랜덤 문자열) 생성

랜덤 문자열 생성을 위해 브라우저에 내장되어 있는 **Web Crypto API(웹 크립토)** 를 사용해서 생성함.
특히, OAuth 2.0 인증 흐름에서 PKCE 구현할 때, 웹 크립토 API는 업계 표준으로 널리 사용되는 방식임.

```javascript
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
    .substring(0, 128);
}
```

## 2. CodeChallenge 생성

>Code Verifier를 **SHA-256으로 해싱**하고, **BASE64URL로 인코딩**해서 Code Challenge 생성

### SHA-256 해싱
SHA-256(Secure Hash Algorithm 256-bit)은 암호학적 해시 함수다.

- 어떤 길이의 입력이라도 항상 256비트(32바이트) 길이의 출력을 생성한다.
- 단방향성: 해시값에서 원본 데이터를 복원하는 것은 계산적으로 불가능.
- 충돌 저항성: 서로 다른 두 입력이 동일한 해시를 생성할 확률이 극히 낮다.
- 작은 입력 변화에도 출력이 완전히 달라지는 눈사태 효과가 있다.

브라우저 환경에서는 **Web Crypto API**를 사용하여 SHA-256 해싱을 수행할 수 있다.
해싱 후의 결과값은, **이진 데이터(ArrayBuffer)**로 나온 다는 것을 명심해야한다.
즉, 이진 데이터를 텍스트 형식으로 표현하기 위해서 BASE64URL 인코딩을 해줘야 하는 것이다.

### BASE64URL 인코딩
Base64URL은 표준 Base64 인코딩의 변형으로, URL에서 안전하게 사용할 수 있도록 해주고, 아래와 같은 특징이 있다.

- `+` 문자를 `-`로 대체
- `/` 문자를 `_`로 대체
- 끝에 있는 패딩 문자 `=`를 제거

이렇게 하면 URL의 쿼리 파라미터나 경로에 안전하게 포함시킬 수 있다.


```javascript
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // 문자열을 UTF-8 인코딩된 바이트 배열로 변환
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // SHA-256 해싱
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);

  // 해시 결과를 Base64URL로 인코딩
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = String.fromCharCode(...hashArray);
  return btoa(hashString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
```

## 3. Pre-login 요청하기

>이렇게 생성된 CodeChallenge를 백엔드에서 요구한 필드에 맞춰서 api 요청
- 생성한 CodeChallenge와 "S256" 해시 방식을 백엔드에 전송

```javascript
async function requestPreLogin(codeChallenge: string): Promise<string> {
  try {
    const response = await authAxiosInstance.get("/api/auth/tokens/attempts", {
      params: {
        codeChallenge,
        codeChallengeMethod: "S256",
      },
    });

    const jwt = response.data?.data;

    if (!jwt || typeof jwt !== "string") {
      throw new Error("유효한 JWT가 응답에 없습니다");
    }

    return jwt;
  } catch (error) {
    console.error("프리로그인 요청 실패:", error);
    throw error;
  }
}
```

## 4. 최종 로그인 요청

```javascript
async function requestFinalLogin(
  socialPayload: SocialLoginPayload,
  codeVerifier: string,
  preLoginJwt: string
): Promise<string> {
  try {
    const response = await authAxiosInstance.post("/api/auth/tokens", {
      ...socialPayload,
      codeVerifier,
      preLoginJwt,
    });

    const headerToken = response.headers?.authorization?.replace("Bearer ", "");

    return headerToken;
  } catch (error: unknown) {
    // Error 타입으로 안전하게 타입 체크
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
    }

    if (axios.isAxiosError(error) && error.response) {
      console.error("에러 응답 데이터:", error.response.data);
    }
    throw error;
  }
}
```
