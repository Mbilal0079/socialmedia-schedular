"use client";

import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/posts/post-list";
import { useUIStore } from "@/store/ui-store";

export default function PostsPage() {
  const { setCreatePostDialogOpen } = useUIStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage all your social media posts
          </p>
        </div>
        <Button onClick={() => setCreatePostDialogOpen(true)}>
          <PenSquare className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <PostList />
    </div>
  );
}
