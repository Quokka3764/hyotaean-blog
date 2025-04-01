// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";

// // 포스트 디렉토리 경로
// const postsDirectory = path.join(process.cwd(), "src", "contents", "posts");

// // 모든 포스트 정보 가져오기
// export async function getAllPosts() {
//   try {
//     // 디렉토리 존재 여부 확인
//     if (!fs.existsSync(postsDirectory)) {
//       throw new Error("포스트 디렉토리를 찾을 수 없습니다.");
//     }

//     // 모든 마크다운 파일 가져오기
//     const fileNames = fs.readdirSync(postsDirectory);
//     const postFiles = fileNames.filter((fileName) => fileName.endsWith(".md"));

//     // 각 파일에서 메타데이터 추출
//     const posts = postFiles.map((fileName) => {
//       // 파일 내용 읽기
//       const filePath = path.join(postsDirectory, fileName);
//       const fileContent = fs.readFileSync(filePath, "utf8");

//       // frontmatter 추출
//       const { data: frontmatter } = matter(fileContent);

//       // 슬러그 생성 (파일명에서 .md 제거)
//       const slug = fileName.replace(/\.md$/, "");

//       return {
//         slug,
//         frontmatter,
//       };
//     });

//     // 날짜 기준 내림차순 정렬 (최신 글이 먼저 오도록)
//     return posts.sort((a, b) => {
//       const dateA = new Date(a.frontmatter.date || "").getTime();
//       const dateB = new Date(b.frontmatter.date || "").getTime();
//       return dateB - dateA;
//     });
//   } catch (error) {
//     console.error("포스트 목록 가져오기 오류:", error);
//     throw error;
//   }
// }

// // 특정 슬러그의 포스트 정보 가져오기
// export async function getPostBySlug(slug: string) {
//   try {
//     const filePath = path.join(postsDirectory, `${slug}.md`);

//     // 파일 존재 여부 확인
//     if (!fs.existsSync(filePath)) {
//       throw new Error(`${slug} 포스트를 찾을 수 없습니다.`);
//     }

//     // 파일 내용 읽기
//     const fileContent = fs.readFileSync(filePath, "utf8");

//     // matter로 frontmatter와 content 분리
//     const { data: frontmatter, content } = matter(fileContent);

//     return {
//       frontmatter,
//       content,
//     };
//   } catch (error) {
//     console.error(`${slug} 포스트 가져오기 오류:`, error);
//     throw error;
//   }
// }

// lib/posts.ts (타입 오류 수정 버전)
import {
  createSupabaseClient,
  getEnvironmentVariables,
} from "../../db/supabaseClient";
import { PostWithTags } from "@/types/database";

// Supabase 클라이언트 초기화
const initSupabase = () => {
  const { supabaseUrl, supabaseKey } = getEnvironmentVariables();
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

// 모든 포스트 정보 가져오기
export async function getAllPosts() {
  try {
    const supabase = initSupabase();

    // PostgreSQL 함수 호출로 모든 포스트와 태그 가져오기
    const { data, error } = (await supabase.rpc("get_all_posts")) as {
      data: PostWithTags[] | null;
      error: any;
    };

    if (error) throw error;
    if (!data) return [];

    // 원래 형식과 유사하게 데이터 변환
    return data.map((post: PostWithTags) => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        date: post.date,
        excerpt: post.excerpt || "",
        thumbnail: post.thumbnail || "",
        tags: post.tags || [],
      },
    }));
  } catch (error) {
    console.error("포스트 목록 가져오기 오류:", error);
    throw error;
  }
}

// 특정 슬러그의 포스트 정보 가져오기
export async function getPostBySlug(slug: string) {
  try {
    const supabase = initSupabase();

    // PostgreSQL 함수 호출로 특정 포스트와 태그 가져오기
    const { data, error } = (await supabase.rpc("get_post_by_slug", {
      post_slug: slug,
    })) as { data: PostWithTags[] | null; error: any };

    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error(`${slug} 포스트를 찾을 수 없습니다.`);

    const post = data[0];

    // 데이터 포맷팅
    return {
      frontmatter: {
        title: post.title,
        date: post.date,
        excerpt: post.excerpt || "",
        thumbnail: post.thumbnail || "",
        tags: post.tags || [],
      },
      content: post.content,
    };
  } catch (error) {
    console.error(`${slug} 포스트 가져오기 오류:`, error);
    throw error;
  }
}
