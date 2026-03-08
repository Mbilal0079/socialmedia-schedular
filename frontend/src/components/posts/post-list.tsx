"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePostStore } from "@/store/post-store";
import { PostCard } from "./post-card";
import { PostStatus } from "@/lib/validations/post";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filterOptions: { value: PostStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Drafts" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "PUBLISHED", label: "Published" },
  { value: "FAILED", label: "Failed" },
];

export function PostList() {
  const {
    isLoading,
    error,
    filter,
    setFilter,
    setPosts,
    setLoading,
    setError,
    filteredPosts,
  } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts, setLoading, setError]);

  const posts = filteredPosts();

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as PostStatus | "ALL")}
      >
        <TabsList>
          {filterOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="py-12 text-center text-destructive">{error}</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No posts yet
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first post to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
