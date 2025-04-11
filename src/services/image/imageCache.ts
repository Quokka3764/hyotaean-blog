// 업로드 캐시 (해시 기반 키)
const uploadCache = new Map<string, string>();
// 최대 캐시 항목 수 (메모리 관리를 위해)
const MAX_CACHE_SIZE = 100;

// 캐시에 항목 추가 (LRU 방식 관리)
export function addToCache(key: string, value: string): void {
  // 캐시가 최대 크기에 도달한 경우 가장 오래된 항목 제거
  if (uploadCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = uploadCache.keys().next().value;
    if (oldestKey) {
      uploadCache.delete(oldestKey);
    }
  }
  uploadCache.set(key, value);
}

// 캐시에서 항목 가져오기
export function getFromCache(key: string): string | undefined {
  return uploadCache.get(key);
}

// 캐시에 항목이 있는지 확인
export function hasInCache(key: string): boolean {
  return uploadCache.has(key);
}
