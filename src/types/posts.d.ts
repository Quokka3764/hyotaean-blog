// types/posts.d.ts
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
}
