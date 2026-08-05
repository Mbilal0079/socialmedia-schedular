"use client";

import { PenSquare } from "lucide-react";
import { PostList } from "@/components/posts/post-list";
import { useUIStore } from "@/store/ui-store";

export default function PostsPage() {
  const { setCreatePostDialogOpen } = useUIStore();

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 28, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Posts
          </h1>
          <p style={{ fontSize: 14, color: "#64748B" }}>
            Manage all your social media posts
          </p>
        </div>
        <button
          onClick={() => setCreatePostDialogOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px",
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            border: "none", borderRadius: 10,
            color: "white", fontSize: 14, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.55)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)";
          }}
        >
          <PenSquare size={16} />
          New Post
        </button>
      </div>

      <PostList />
    </div>
  );
}
