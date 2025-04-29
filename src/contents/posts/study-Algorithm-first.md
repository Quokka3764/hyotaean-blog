---
 title: '알고리즘 - 유연근무제, 비밀 코드 해독'
 date: '2025-04-27 01:20'
 thumbnail: '/programmers.png'
 tags: ["Algorithm", "Programmers"]
 excerpt: '프로그래머스의 유연 근무제와 비밀 코드 해독 문제를 풀었던 내용을 공유합니다'
---
 
 
 # 유연근무제 lv.1
 
 1. 평일 출근 기록 검증하기 : 직원들의 출근 시각(timelogs)을 순회하고, 출근 희망 시각(schedules) + 10분의 마감 시간 내에 모두 출근을 했는지 검증.
 
 2. 모든 평일에 대해 조건을 만족한 직원의 수를 최종 카운트해서 반환.
 
 
 ```javascript
 function solution(schedules, timelogs, startday) {
     //결과값 계산
     let count = 0;
     
     const n = schedules.length;
     
     for (let i = 0; i < n; i++) {
         //출근시간
         const time = schedules[i];
         const hour = Math.floor(time / 100);
         const minutes = time % 100;
         const totalMinutes = hour * 60 + minutes + 10;
         //마감시간
         const deadlineHour = Math.floor(totalMinutes / 60);
         const deadlineMinute = totalMinutes % 60;
         const deadlineTime = deadlineHour * 100 + deadlineMinute; 
         
         let isQualified = true;
 
         for (let j = 0; j < 7; j++) {
             const currentWeek = (startday - 1 + j) % 7;
 
             if (currentDayOfWeek >= 5) {
                 continue;
             }
 
             const actualArrivalTime = timelogs[i][j];
 
             if (actualArrivalTime > deadlineTime) {
                 isQualified = false;
                 break;
             }
         }
         if (isQualified) {
             count++;
         }
     }
     return count;
 }
 ```
 
 
 # 비밀 코드 해독 lv.2
 
 1. 비밀 코드 후보 생성: 1부터 n까지의 수 중에서 5개를 오름차순으로 뽑아 만들 수 있는 모든 가능한 조합을 생성하기
 2. 결과 검증: 각 후보 조합이 모든 시도(q)와 비교했을 때, 일치하는 숫자의 갯수가 해당 q의 시스템 응답(ans)과 정확히 동일한지 검증하고 이 조건을 모두 만족하는 조합의 수(count)만 찾기.
 
 ```javascript
 function solution(n, q, ans) {
     
     let count = 0;
     const m = q.length;
     
     // 1부터 n-4까지, 오름차순
     for (let c1 = 1; c1 <= n - 4; c1++) {
         // c1보다 크고, n-3까지
         for (let c2 = c1 + 1; c2 <= n - 3; c2++) {
             for (let c3 = c2 + 1; c3 <= n - 2; c3++) {
                 for (let c4 = c3 + 1; c4 <= n - 1; c4++) {
                     //마지막..
                     for (let c5 = c4 + 1; c5 <= n; c5++) {
                         //
                         const comb = [c1, c2, c3, c4, c5];
                         //통과
                         let result = true;
                         //겹치는 갯수 교차검증
                         for (let i = 0; i < m; i++) {
                             const arr = q[i];
                             const matches = ans[i];
                             let actual = 0;
                             
                             for (const num of comb) {
                                 if (arr.includes(num)) {
                                     actual++;
                                 }
                             }
                             //일치하는지 확인
                             if (actual !== matches) {   
                                 // console.log({actual, matches}, comb)
                                 result = false;
                                 break;
                             }
                         }
                         if (result) {
                             console.log(result)
                             count++;
                         }
                     }
                 }
             }
         }
     }
     return count;
 }
 ```

