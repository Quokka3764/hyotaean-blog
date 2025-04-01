// types/database.d.ts

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: PostRow;
        Insert: PostInsert;
        Update: Partial<PostInsert>;
      };
      tags: {
        Row: TagRow;
        Insert: TagInsert;
        Update: Partial<TagInsert>;
      };
      post_tags: {
        Row: PostTagRow;
        Insert: PostTagInsert;
        Update: Partial<PostTagInsert>;
      };
      Functions: {
        get_all_posts: {
          Args: Record<string, never>; // 인자 없음
          Returns: PostWithTags[];
        };
        get_post_by_slug: {
          Args: { post_slug: string };
          Returns: PostWithTags[];
        };
      };
    };
  };
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  updated_at: string;
  created_at: string;
}

export interface PostInsert {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  date: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  created_at: string;
}

export interface TagInsert {
  name: string;
}

export interface PostTagRow {
  post_id: string;
  tag_id: string;
}

export interface PostTagInsert {
  post_id: string;
  tag_id: string;
}

// PostgreSQL 함수 반환 타입
export interface PostWithTags {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
  date: string;
  tags: string[] | null;
}
