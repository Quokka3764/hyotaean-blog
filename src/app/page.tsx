import React from "react";
import HeroSection from "@/components/hero/HeroSection";
import { getAllPosts } from "@/lib/posts";
import { TaggedPostList } from "@/components/post/TaggedPostList";

export default async function BlogPage() {
  
  const initialPosts = await getAllPosts();

  const tags = Array.from(
    new Set(["All", ...initialPosts.flatMap((post) => post.tags ?? [])])
  );

  return (
    <main className="w-full px-4 sm:px-6">
      <HeroSection tags={tags} />
      <section className="mt-10">
        <TaggedPostList initialPosts={initialPosts} />
      </section>
    </main>
  );
}
