---
title: '비밀 코드 해독 재귀함수로 다시 구현'
date: '2025-04-29 23:40'
thumbnail: '/programmers.png'
tags: ["재귀함수", "Algorithm"]
excerpt: '지난 시간에 풀었던 비밀코드해독 문제를 재귀함수로 다시 풀었습니다'
---

# 비밀 코드 해독 lv.2


1. 조합 생성: 1부터 n까지의 숫자 중 5개를 선택하는 모든 조합을 재귀적으로 생성. `comb` 배열과 `start` 변수를 통해 중복없는 조합을 생성한다.
2. 조건 검증: `comb` 의 길이가 5가 되면 각 q[i]와 생성된 조합간의 일치하는 요소의 갯수를 계산하고 ans[i] 와 일치하는지 확인.
3. 가지 치기: 조건에 만족하지 않으면 즉시 return하여 불필요한 탐색을 줄인다.
4. 백트래킹: 재귀 호출 후 `comb.pop()` 을 통해서 이전 상태로 돌아가 다른 선택지를 탐색한다.

```javascript

function solution (n, q, ans){
  let count = 0;

  function recursion(comb, start){
    //기저사례
    if(comb.length === 5){
      //arr와 matches가 일치하는 값을 찾기
      for(let i = 0; i< q.length; i++){
        let arr = q[i];
        let matches = ans[i];
        let actual = 0;

        for (let j = 0; j < 5; j++){
          if(arr.includes(comb[j])){
            actual++
          }
        }

        if(matches !== actual){
          return;
        }
      }
      count++;
      return;
    }
    //스택을 활용한 백트래킹
    for(let i = start; i <= n ; i++){
      comb.push(i);
      recursion(comb, i + 1);
      comb.pop();
    }
  }
    //재귀 호출문
    recursion([],1);
    return count;
}
```