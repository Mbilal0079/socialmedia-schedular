import { create } from "zustand";
import { Platform, PostStatus } from "@/lib/validations/post";

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  platforms: Platform[];
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  errorMsg: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PostStore {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  filter: PostStatus | "ALL";

  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  removePost: (id: string) => void;
  setFilter: (filter: PostStatus | "ALL") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  filteredPosts: () => Post[];
  stats: () => {
    total: number;
    draft: number;
    scheduled: number;
    published: number;
    failed: number;
  };
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  filter: "ALL",

  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
  setFilter: (filter) => set({ filter }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  filteredPosts: () => {
    const { posts, filter } = get();
    if (filter === "ALL") return posts;
    return posts.filter((p) => p.status === filter);
  },

  stats: () => {
    const { posts } = get();
    return {
      total: posts.length,
      draft: posts.filter((p) => p.status === "DRAFT").length,
      scheduled: posts.filter((p) => p.status === "SCHEDULED").length,
      published: posts.filter((p) => p.status === "PUBLISHED").length,
      failed: posts.filter((p) => p.status === "FAILED").length,
    };
  },
}));
