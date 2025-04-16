/**
 * 지정한 시간(ms) 동안 대기하는 함수
 * @param ms 대기 시간 (밀리초)
 * @returns Promise<void>
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 지정한 함수 실행 중 오류 발생 시, 재시도 로직을 수행합니다.
 * @param fn 재시도할 비동기 함수
 * @param description 작업에 대한 설명 (로깅 용도)
 * @param retries 재시도 횟수 (기본값: 3회)
 * @param delayMs 각 재시도 사이의 대기 시간 (밀리초, 기본값: 1000ms)
 * @returns 함수 실행 결과 Promise<T>
 * @throws 최종 시도에서 오류 발생 시 해당 오류를 throw
 */
export async function retry<T>(
  fn: () => Promise<T>,
  description = "Operation",
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(
        `${description} 실패, 재시도 중... (${retries - attempt}회 남음)`
      );
      await sleep(delayMs);
      attempt++;
    }
  }
  // 이 코드는 도달하지 않습니다.
  throw new Error("retry: unexpected error");
}
