import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/post/PostList";
import HeroSection from "@/components/hero/HeroSection";

export default async function BlogPage() {
  try {
    const posts = await getAllPosts();

    if (posts.length === 0) {
      return (
        <div className="w-full px-4 sm:px-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              아직 작성된 포스트가 없습니다.
            </h2>
            <p className="text-gray-300">나중에 다시 확인해 주세요!</p>
          </div>
        </div>
      );
    }

    const formattedPosts = posts.map((post) => ({
      slug: post.slug,
      title: post.frontmatter.title,
      date: post.frontmatter.date,
      excerpt: post.frontmatter.excerpt,
      thumbnail: post.frontmatter.thumbnail,
      tags: post.frontmatter.tags,
    }));

    return (
      <div className="w-full px-4 sm:px-6">
        <HeroSection />
        <div className="mt-10">
          <PostList posts={formattedPosts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("서버에서 포스트를 가져오는 중 오류 발생:", error);
    return (
      <div className="w-full px-4 sm:px-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            데이터 로드 오류
          </h2>
          <p className="text-white">
            {error instanceof Error
              ? error.message
              : "포스트 데이터를 불러오지 못했습니다"}
          </p>
        </div>
      </div>
    );
  }
}
