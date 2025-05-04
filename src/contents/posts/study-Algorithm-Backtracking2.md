---
title: "백트래킹 - 2편 (순열과 조합)"
date: "2025-05-04T14:00:00+00:00"
excerpt: "백트래킹 알고리즘을 활용한 순열과 조합 생성 패턴을 학습하고 정리한 내용입니다."
thumbnail: "/programmers.png"
tags: ["Algorithm", "Backtracking", "Permutation", "Combination", "재귀함수"]
---

# 백트래킹 활용: 순열과 조합 생성

> 1편에서는 백트래킹의 기본 개념과 동작 원리를 살펴보았다. 2편에서는 백트래킹의 대표적인 활용 사례인 **순열(Permutation)** 과 **조합(Combination)** 에 대해 알아본다.

## 순열(Permutation)

> 정의: 서로 다른 n개의 원소에서 r개를 **순서대로** 뽑아 나열하는 경우의 수. (예: [1, 2, 3]으로 만들 수 있는 길이 2의 순열은 [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2])

백트래킹을 이용한 순열 생성의 핵심은 각 단계에서 **아직 사용하지 않은 원소**를 선택하는 것이다.

1.  **상태 관리**:
    *   `path`: 현재까지 만들어진 순열을 저장하는 배열.
    *   `visited`: 각 원소의 사용 여부를 기록하는 불리언 배열. (중복 선택 방지)

2.  **백트래킹 기본 흐름 적용**:
    *   **재귀 함수 정의**: `generatePermutation(path)`
    *   **종료 조건**: `path`의 길이가 목표하는 길이(r)가 되면, 완성된 순열을 결과에 기록하고 `return`.
    *   **후보 순회**: 주어진 n개의 원소를 순회 (`for i = 0 to n-1`).
    *   **가지치기 (선택 조건)**: `if (!visited[i])` 즉, 아직 사용되지 않은 원소인지 확인.
        1.  **선택**: `visited[i] = true`, `path.push(elements[i])`.
        2.  **재귀 호출**: `generatePermutation(path)`.
        3.  **되돌아가기**: `path.pop()`, `visited[i] = false`. (다음 탐색을 위해 상태 복원)

### 예제 코드 - 숫자 배열로 순열 만들기

n개의 숫자 중 r개를 뽑아 만들 수 있는 모든 순열을 생성하는 함수.

```javascript
function generatePermutations(elements, r) {
  const result = [];
  const path = [];
  const visited = Array(elements.length).fill(false);
  const n = elements.length;

  function backtrack() {
    // 종료 조건: 목표 길이에 도달
    if (path.length === r) {
      result.push([...path]); // 현재 경로 복사하여 결과에 추가
      return;
    }

    // 후보 순회
    for (let i = 0; i < n; i++) {
      // 가지치기: 사용하지 않은 원소만 선택
      if (!visited[i]) {
        // 선택
        visited[i] = true;
        path.push(elements[i]);

        // 재귀 호출
        backtrack();

        // 되돌아가기 (상태 복원)
        path.pop();
        visited[i] = false;
      }
    }
  }

  backtrack();
  return result;
}

// 사용 예시: [1, 2, 3] 중 2개를 뽑는 순열
// const nums = [1, 2, 3];
// console.log(generatePermutations(nums, 2));
// 출력: [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
```

## 조합(Combination)

> 정의: 서로 다른 n개의 원소에서 **순서에 상관없이** r개를 뽑는 경우의 수. (예: [1, 2, 3]으로 만들 수 있는 길이 2의 조합은 [1, 2], [1, 3], [2, 3])

조합 생성의 핵심은 중복 선택을 피하고 순서가 다른 동일한 조합을 만들지 않는 것이다. 이는 다음 원소를 선택할 때 **현재 선택한 원소보다 뒤에 있는(혹은 인덱스가 큰) 원소들만** 고려함으로써 구현할 수 있다.

1.  **상태 관리**:
    *   `path`: 현재까지 만들어진 조합을 저장하는 배열.
    *   `start`: 탐색을 시작할 인덱스. 이 값보다 작은 인덱스의 원소는 고려하지 않음.

2.  **백트래킹 기본 흐름 적용**:
    *   **재귀 함수 정의**: `generateCombination(path, start)`
    *   **종료 조건**: `path`의 길이가 목표하는 길이(r)가 되면, 완성된 조합을 결과에 기록하고 `return`.
    *   **후보 순회**: `start` 인덱스부터 n개의 원소 끝까지 순회 (`for i = start; i < n; i++`).
    *   **가지치기**: `start` 인덱스를 통해 탐색 범위를 제한하는 것 자체가 중복 조합 방지 메커니즘.
        1.  **선택**: `path.push(elements[i])`.
        2.  **재귀 호출**: `generateCombination(path, i + 1)`. 다음 탐색은 `i + 1` 부터 시작.
        3.  **되돌아가기**: `path.pop()`.

### 예제 코드 - 숫자 배열로 조합 만들기

n개의 숫자 중 r개를 뽑아 만들 수 있는 모든 조합을 생성하는 함수.

```javascript
function generateCombinations(elements, r) {
  const result = [];
  const path = [];
  const n = elements.length;

  function backtrack(start) {
    // 종료 조건
    if (path.length === r) {
      result.push([...path]);
      return;
    }

    // 후보 순회 (start 부터)
    for (let i = start; i < n; i++) {
      // 선택
      path.push(elements[i]);

      // 재귀 호출 (다음 시작은 i + 1)
      backtrack(i + 1);

      // 상태 복원
      path.pop();
    }
  }

  backtrack(0); // 0번 인덱스부터 시작
  return result;
}

// 사용 예시
// const nums = [1, 2, 3];
// console.log(generateCombinations(nums, 2));
// 출력: [[1, 2], [1, 3], [2, 3]]
```

