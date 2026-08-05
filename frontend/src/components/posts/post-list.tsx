"use client";

import { useEffect } from "react";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { usePostStore } from "@/store/post-store";
import { PostCard } from "./post-card";
import { PostStatus } from "@/lib/validations/post";
import { useUIStore } from "@/store/ui-store";

const FILTERS: { value: PostStatus | "ALL"; label: string; color: string; bg: string }[] = [
  { value: "ALL",       label: "All",       color: "#F8FAFC", bg: "rgba(255,255,255,0.08)"  },
  { value: "DRAFT",     label: "Drafts",    color: "#94A3B8", bg: "rgba(148,163,184,0.12)"  },
  { value: "SCHEDULED", label: "Scheduled", color: "#F59E0B", bg: "rgba(245,158,11,0.12)"   },
  { value: "PUBLISHED", label: "Published", color: "#22C55E", bg: "rgba(34,197,94,0.12)"    },
  { value: "FAILED",    label: "Failed",    color: "#EF4444", bg: "rgba(239,68,68,0.12)"    },
];

export function PostList() {
  const {
    isLoading, error, filter, setFilter,
    setPosts, setLoading, setError, filteredPosts,
  } = usePostStore();
  const { setCreatePostDialogOpen } = useUIStore();

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
  const activeFilter = FILTERS.find(f => f.value === filter) || FILTERS[0];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24,
        padding: "6px", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, width: "fit-content",
      }}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as PostStatus | "ALL")}
              style={{
                padding: "8px 18px",
                borderRadius: 9,
                border: active ? `1px solid ${f.color}40` : "1px solid transparent",
                background: active ? f.bg : "transparent",
                color: active ? f.color : "#475569",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = "#475569";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {filter !== "ALL" && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 20, marginBottom: 20,
          background: activeFilter.bg,
          border: `1px solid ${activeFilter.color}30`,
          fontSize: 12, color: activeFilter.color, fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeFilter.color, display: "inline-block" }} />
          Showing {activeFilter.label}
          <button
            onClick={() => setFilter("ALL")}
            style={{ background: "none", border: "none", color: activeFilter.color, cursor: "pointer", fontSize: 14, padding: "0 0 0 4px", lineHeight: 1 }}
          >×</button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0", flexDirection: "column", gap: 12 }}>
          <Loader2 size={28} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: 13, color: "#475569" }}>Loading posts…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : error ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "64px 0", gap: 12,
        }}>
          <AlertCircle size={32} color="#EF4444" />
          <p style={{ fontSize: 14, color: "#EF4444", fontWeight: 600 }}>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "64px 24px", gap: 16,
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16, textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={24} color="#7C3AED" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 6 }}>
              No {filter === "ALL" ? "" : activeFilter.label.toLowerCase() + " "}posts yet
            </p>
            <p style={{ fontSize: 13, color: "#475569" }}>
              {filter === "ALL"
                ? "Create your first post to get started!"
                : `No ${activeFilter.label.toLowerCase()} posts found.`}
            </p>
          </div>
          {filter === "ALL" && (
            <button
              onClick={() => setCreatePostDialogOpen(true)}
              style={{
                padding: "10px 24px", borderRadius: 10,
                background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                border: "none", color: "white",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                fontFamily: "inherit",
              }}
            >
              Create First Post →
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 16,
        }}>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
