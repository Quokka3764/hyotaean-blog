---
title: '블로그 제작기 - 이미지 관리하기'
date: '2025-04-16 21:17'
thumbnail: 'nextJs.avif'
tags: ["Next.js", "블로그 제작기", "이미지 관리"]
excerpt: '블로그 관리에서 중요한 이미지 관리를 어떻게 하고 있는지 설명합니다'
---

# 이미지를 관리에 대한 고찰

블로그 서비스를 만드는 것이라면 가장 골치아픈 부분이 이미지 관리일 것이라고 확신한다. 나만의 작은 블로그 일 뿐이지만, 장기적인 관점으로 보았을 때 이미지를 효율적으로 관리하는 체계를 만드는 것은 필수였다. 용량이 큰 이미지, 사이즈가 다른 이미지 들을 어떻게 처리할 것인지 아직도 난감하게만 느껴진다.

예를 들어 **작은 사이즈의 이미지**를 본문에 넣었을 때, 이미지를 억지로 블로그의 사이즈에 맞춰서 늘리게 되면 이미지가 깨지면서 가독성이 저해된다.  이걸 단순하게 포스팅한 유저 혹은 내가 적절한 이미지를 고르는게 맞는건지 아니면 클라이언트단에서 처리해줄 방법이 없는지 여전히 고민이 되고 있다. 여러 블로그 서비스를 참고해 보면 유저가 적절한 이미지를 고르게 하는 것이 맞는 것으로 보이지만, 혹시나 다른 방법이 없나 고민 중이다.

**용량이 큰 이미지**도 문제다. 특히나 작은 규모의 블로그로써는 치명적이었다. 대략 20MB가 넘어가면 사실상 최악에 가까운 렌더링 속도가 나온다. 라이트하우스의 점수도 80~90점대를 웃돌다가 20점대로 확 떨어진다. 객관적인 지표점수도 떨어지고 UX도 떨어지는 이 현상을 어떻게 해야 최적화를 할 수 있을지 고민이다. 마크다운으로 페이지를 렌더링 하다보니 `img`태그로 전환이 되어서 Next에서 지원하는 Image 최적화 기능을 사용하기가 어려운데 어떻게 해야 대체할 수 있을지 다음편에서 서술해보려고 한다. 혹은, 이 방법이 별로 효과적이지 못하다면 다른 라이버리의 활용을 고민해봐야 할 것 같다.

# 이미지 저장방식은 캐싱 & 중복저장 방지

이걸 구현하게 된 것도 블로그의 글을 계속 쓰다보니 깨닫게 된 사실이다. 재사용된 이미지가 계속해서 중복으로 저장되어져 왔고 이와 관련된 대책이 전혀 없었던 것이다. 그래서 아직 이미지 최적화는 덜 되었지만 저장 및 관리 방식은 급하다고 판단이 돼서 나름의 방식을 구현해 보았다.

## 1. 이미지 저장 방식

현재 블로그의 이미지 저장 방식은 Supabase Storage에 저장하도록 구축되어 있다.
- blog-images 라는 버킷에 저장
- 블로그에 사용되었던 이미지를 구분하기 위해서 날짜별 폴더를 형성
- 이미지를 해시 기반 파일명으로 저장해서 중복 방지
- 해시 기반 캐싱으로 중복 업로드를 최소화

> uploadImageToStorage

```typescript
// 단일 이미지를 Supabase Storage에 업로드
export async function uploadImageToStorage(
  originalPath: string,
  imageBuffer: Buffer,
  folder: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string | null> {
  try {
    // 파일 해시 생성
    const fileHash = generateFileHash(imageBuffer).substring(0, 16);
    const cacheKey = fileHash;

    // 캐시 확인
    if (hasInCache(cacheKey)) {
      const cachedUrl = getFromCache(cacheKey);
      console.log(`캐시에서 이미지 URL 사용: ${cachedUrl}`);
      return cachedUrl || null;
    }

    // 파일명 생성 (해시 기반으로 중복 방지)
    const fileExt = path.extname(originalPath).toLowerCase();
    const fileName = `${folder}/${fileHash}${fileExt}`.replace(/^\//, "");

    console.log(`이미지 업로드 시도: ${fileName} (해시: ${fileHash})`);

    // Supabase Storage에 업로드 (재시도 로직 포함)
    await retry(
      async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, imageBuffer, {
            contentType: getMimeType(originalPath),
            cacheControl: "3600",
            upsert: true, // 같은 경로면 덮어쓰기
          });

        if (error) throw error;
      },
      `이미지 업로드 (${originalPath})`,
      3,
      1000
    );

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const publicUrl = transformStorageUrl(urlData.publicUrl);

    // 캐시에 저장
    addToCache(cacheKey, publicUrl);

    console.log(`이미지 업로드 성공: ${originalPath} -> ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`이미지 업로드 실패 (${originalPath}):`, error);
    return null;
  }
}
```

## 2. 이미지 처리 워크 플로우

마크다운 내 이미지를 처리하는 방식은 다음과 같다.
- 마크다운 파일 내의 이미지 삽입 패턴으로 이미지 인식
- 로컬 경로 확인 및 이미지 파일 읽기
- 이미지 해시 생성 및 중복 확인
- Supabase Storage에 업로드
- 마크다운 내 이미지 URL을 Supabase URL로 교체

> uploadContentImages

```typescript
// 마크다운 콘텐츠의 이미지를 날짜 폴더 구조로 업로드
export async function uploadContentImages(
  markdownContent: string,
  filePath: string,
  postDate: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<string> {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let processedContent = markdownContent;
  const matches = [...markdownContent.matchAll(imageRegex)];

  if (matches.length === 0) return markdownContent;

  console.log(`마크다운에서 이미지 ${matches.length}개 발견`);

  // 날짜 기반 폴더 생성
  const dateFolder = formatDateFolder(postDate);

  // 동시성 제한을 위한 배치 처리 (한 번에 최대 5개 이미지 처리)
  const BATCH_SIZE = 5;
  for (let i = 0; i < matches.length; i += BATCH_SIZE) {
    const batch = matches.slice(i, i + BATCH_SIZE);

    // 현재 배치 내 이미지 병렬 처리
    const results = await Promise.all(
      batch.map(async (match) => {
        const [fullMatch, altText, imagePath] = match;

        // 이미 외부 URL이거나 Supabase URL인 경우 처리하지 않음
        if (isExternalUrl(imagePath) || isSupabaseStorageUrl(imagePath)) {
          console.log(`이미 처리된 이미지 URL 유지: ${imagePath}`);
          return { fullMatch, newUrl: imagePath, altText };
        }

        try {
          // 실제 파일 경로 계산 및 파일 읽기
          const fullImagePath = resolveLocalImagePath(filePath, imagePath);
          await fs.access(fullImagePath);
          const imageBuffer = await fs.readFile(fullImagePath);

          // 폴더 구조 추출 (날짜 + 원본 경로)
          const originalFolder = path.dirname(imagePath).replace(/^\.\//, "");
          const folderPath = originalFolder
            ? `${dateFolder}/${originalFolder}`
            : dateFolder;

          // 이미지 업로드
          const publicUrl = await uploadImageToStorage(
            imagePath,
            imageBuffer,
            folderPath,
            supabase,
            bucket
          );

          if (publicUrl) {
            console.log(`이미지 처리 성공: ${imagePath} -> ${publicUrl}`);
            return { fullMatch, newUrl: publicUrl, altText };
          }
        } catch (error) {
          console.error(`이미지 처리 실패 (${imagePath}):`, error);
        }

        return { fullMatch, newUrl: imagePath, altText };
      })
    );

    // 처리된 이미지 URL로 마크다운 업데이트
    for (const { fullMatch, newUrl, altText } of results) {
      processedContent = processedContent.replace(
        fullMatch,
        `![${altText}](${newUrl})`
      );
    }
  }

  return processedContent;
}
```

## 3. 썸네일 이미지 처리

썸네일 이미지는 본문에 사용되는 이미지와 별도로 관리한다.
- 기존 썸네일과의 해시 비교로 변경 여부 확인
- 썸네일이 변경된 경우 기존 썸네일 삭제(Storage)
- 새로운 썸네일을 thumbnails 폴더에 업로드
- 업로드된 썸네일 URL 반환

> uploadThumbnail

```typescript
// 썸네일 이미지를 Supabase Storage에 업로드
export async function uploadThumbnail(
  thumbnailPath: string,
  basePath: string,
  supabase: SupabaseClient<Database>,
  oldThumbnailUrl: string | null = null,
  bucket: string = "blog-images"
): Promise<string | null> {
  if (!thumbnailPath) return null;

  console.log(`썸네일 처리 시작: ${thumbnailPath}`);

  // 이미 Supabase URL이면 그대로 사용
  if (isSupabaseStorageUrl(thumbnailPath)) {
    console.log(`이미 Supabase URL인 썸네일 유지: ${thumbnailPath}`);
    return thumbnailPath;
  }

  // 외부 URL이면 그대로 사용
  if (isExternalUrl(thumbnailPath)) {
    console.log(`외부 URL 썸네일 유지: ${thumbnailPath}`);
    return thumbnailPath;
  }

  // 로컬 파일 경로인 경우에만 처리
  try {
    // 실제 파일 경로 계산 및 파일 읽기
    const fullImagePath = resolveLocalImagePath(basePath, thumbnailPath);
    await fs.access(fullImagePath);
    const imageBuffer = await fs.readFile(fullImagePath);

    // 이미지 해시 계산
    const newImageHash = generateFileHash(imageBuffer).substring(0, 16);

    // 기존 URL이 있고 같은 이미지인지 확인
    if (oldThumbnailUrl && isSupabaseStorageUrl(oldThumbnailUrl)) {
      // URL에 해시가 포함되어 있는지 확인
      if (oldThumbnailUrl.includes(newImageHash)) {
        console.log("동일한 썸네일 이미지 감지: 기존 URL 유지");
        return oldThumbnailUrl;
      }

      // 이미지가 변경된 경우 기존 이미지 삭제
      console.log(
        "썸네일 이미지 변경 감지: 이전 이미지 삭제 후 새 이미지 업로드"
      );
      await deleteOldThumbnail(oldThumbnailUrl, supabase, bucket);
    }

    // 새 이미지 업로드
    const folderPath = "thumbnails";
    return await uploadImageToStorage(
      thumbnailPath,
      imageBuffer,
      folderPath,
      supabase,
      bucket
    );
  } catch (error) {
    console.error(`썸네일 처리 실패 (${thumbnailPath}):`, error);
    return null;
  }
}
```

## 4. 사용되지 않는 이미지 처리

본문 내의 이미지가 수정되어서 더 이상 사용되고 있지 않다면 이미지를 삭제하도록 로직을 구성했다.
- 기존 마크다운과 새 마크다운에서 이미지 URL 추출
- 더 이상 사용되지 않는 URL 목록 생성
- 해당 이미지들을 Supabase Storage에서 삭제

> cleanupUnusedImages, deleteImagesByUrls 

```typescript
// 사용되지 않는 이미지 정리
export async function cleanupUnusedImages(
  oldContent: string | null,
  newContent: string,
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<void> {
  // 기존 이미지 URL 추출
  const oldImageUrls = oldContent ? extractSbImgUrls(oldContent) : [];

  if (oldImageUrls.length === 0) return;

  // 새 콘텐츠에서 이미지 URL 추출
  const newImageUrls = extractSbImgUrls(newContent);

  // 더 이상 사용되지 않는 이미지 찾기
  const unusedImageUrls = oldImageUrls.filter(
    (oldUrl) => !newImageUrls.includes(oldUrl)
  );

  if (unusedImageUrls.length === 0) return;

  await deleteImagesByUrls(unusedImageUrls, supabase, bucket);
}


// URL 목록으로 이미지 삭제
export async function deleteImagesByUrls(
  imageUrls: string[],
  supabase: SupabaseClient<Database>,
  bucket: string = "blog-images"
): Promise<boolean> {
  try {
    console.log(`삭제할 이미지: ${imageUrls.length}개`);

    // 스토리지 경로 추출
    const storagePaths = imageUrls
      .map((url) => extractStoragePath(url, bucket))
      .filter(Boolean) as string[];

    if (storagePaths.length === 0) return true;

    // 이미지 삭제
    await retry(
      async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .remove(storagePaths);

        if (error) throw error;
      },
      `이미지 삭제 (${storagePaths.length}개)`,
      3,
      1000
    );

    console.log(`이미지 ${storagePaths.length}개 삭제 완료`);
    return true;
  } catch (error) {
    console.error("이미지 삭제 중 오류 발생:", error);
    return false;
  }
}
```

## 5. 오류 처리 및 재시도 설정

CI 파이프라인에서 가끔 이미지 업로드나 삭제를 할 때, 실패를 하는 경우가 있었다. 아마도 일시적 오류나 네트워크 오류일 가능성으로 판단돼서 별도의 retry함수를 만들어서 안정적으로 업로드를 시도하도록 하고, 디버깅 로그를 남기게 해서 원인을 알 수 있도록 구성했다.

- 최대 3회 재시도 설정, 실패시 반복 시도
- 각 횟수 사이에 대기시간 적용 (1000ms)
- 실패시 원인과 남은 재시도 횟수 표기
- 모든 재시도가 실패하면 최종 오류 발생

> retry

```typescript
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
```


# 결론

결론적으로, 이미지 관리 시스템은 나름대로 체계적으로 구현했다고 생각한다. Supabase Storage를 활용해 클라우드에 이미지를 저장하고, 해시 기반으로 파일명을 관리하며, 캐싱 시스템으로 중복 업로드를 방지하고 있다. 특히 더 이상 사용하지 않는 이미지를 자동으로 정리하는 기능은 블로그 관리 측면에서 꽤 만족스럽다.

하지만 여전히 아쉬운 점이 있다. 썸네일 이미지는 Next.js의 `<Image>` 컴포넌트를 통해 최적화되어 있지만, 마크다운 본문 내 이미지는 아직 그렇지 못하다. 서론에서 언급했던 것처럼 용량이 큰 이미지와 사이즈가 다른 이미지들의 문제는 여전히 해결해야 할 과제로 남아있다.

다음 글에서는 마크다운 내 이미지를 Next.js의 `<Image>` 컴포넌트로 대체하는 방법을 모색해보거나, 이 방법이 효과적이지 않다면 다른 라이브러리 활용도 검토해보려 한다. 궁극적인 목표는 이미지로 인한 성능 저하 없이 깔끔한 블로그 운영을 하는 것이니까!!! 🔥