"use client";

import { useEffect, useState } from "react";
import {
  FileText, Clock, CheckCircle2, TrendingUp,
  PenSquare, ArrowUpRight, Zap,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useUIStore } from "@/store/ui-store";

interface AnalyticsData {
  overview: {
    totalPosts: number;
    drafts: number;
    scheduled: number;
    published: number;
    failed: number;
    successRate: string;
  };
  recentPosts: Array<{
    id: string;
    content: string;
    platforms: string[];
    status: string;
    scheduledAt: string | null;
    publishedAt: string | null;
    createdAt: string;
  }>;
  upcomingPosts: Array<{
    id: string;
    content: string;
    platforms: string[];
    scheduledAt: string;
  }>;
}

const PLATFORM_COLORS: Record<string, string> = {
  TWITTER:   "#1DA1F2",
  LINKEDIN:  "#0A66C2",
  FACEBOOK:  "#1877F2",
  INSTAGRAM: "#E1306C",
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PUBLISHED: { bg: "rgba(34,197,94,0.12)",  color: "#22C55E", label: "Published" },
  SCHEDULED: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", label: "Scheduled" },
  DRAFT:     { bg: "rgba(148,163,184,0.12)",color: "#94A3B8", label: "Draft"     },
  FAILED:    { bg: "rgba(239,68,68,0.12)",  color: "#EF4444", label: "Failed"    },
};

function StatCard({
  title, value, icon: Icon, grad, glow,
}: {
  title: string; value: string | number;
  icon: React.ElementType; grad: string; glow: string;
}) {
  return (
    <div style={{
      background: "#111827",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      cursor: "default",
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "translateY(-3px)";
      el.style.borderColor = "rgba(124,58,237,0.4)";
      el.style.boxShadow = `0 8px 32px ${glow}`;
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "translateY(0)";
      el.style.borderColor = "rgba(255,255,255,0.08)";
      el.style.boxShadow = "none";
    }}
    >
      {/* bg glow */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 100, height: 100, borderRadius: "50%",
        background: glow, filter: "blur(30px)", opacity: 0.5,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: grad,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 4px 16px ${glow}`,
        }}>
          <Icon size={22} color="white" />
        </div>
        <div>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, fontWeight: 500 }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function PostRow({ content, createdAt, status }: {
  content: string; createdAt: string; status: string;
}) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      transition: "background 0.2s, border-color 0.2s",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.06)";
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.2)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
    }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {content.substring(0, 60)}{content.length > 60 ? "…" : ""}
        </p>
        <p style={{ fontSize: 11, color: "#475569" }}>
          {format(new Date(createdAt), "MMM d, h:mm a")}
        </p>
      </div>
      <div style={{
        marginLeft: 12, padding: "3px 10px", borderRadius: 20,
        background: s.bg, color: s.color,
        fontSize: 11, fontWeight: 700, flexShrink: 0,
        border: `1px solid ${s.color}30`,
      }}>
        {s.label}
      </div>
    </div>
  );
}

function UpcomingRow({ content, scheduledAt, platforms }: {
  content: string; scheduledAt: string; platforms: string[];
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      transition: "background 0.2s, border-color 0.2s",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.06)";
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.2)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
    }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {content.substring(0, 60)}{content.length > 60 ? "…" : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569" }}>
          <Clock size={10} />
          {format(new Date(scheduledAt), "MMM d, h:mm a")}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginLeft: 12, flexWrap: "wrap" }}>
        {platforms.map(p => (
          <span key={p} style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            border: `1px solid ${PLATFORM_COLORS[p] || "#475569"}50`,
            color: PLATFORM_COLORS[p] || "#475569",
            background: `${PLATFORM_COLORS[p] || "#475569"}12`,
          }}>
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DashboardContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCreatePostDialogOpen } = useUIStore();

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setAnalytics(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: "Total Posts",  value: analytics?.overview.totalPosts  || 0, icon: FileText,     grad: "linear-gradient(135deg,#3B82F6,#06B6D4)", glow: "rgba(59,130,246,0.35)"  },
    { title: "Scheduled",    value: analytics?.overview.scheduled   || 0, icon: Clock,        grad: "linear-gradient(135deg,#F59E0B,#EF4444)", glow: "rgba(245,158,11,0.35)" },
    { title: "Published",    value: analytics?.overview.published   || 0, icon: CheckCircle2, grad: "linear-gradient(135deg,#22C55E,#06B6D4)", glow: "rgba(34,197,94,0.35)"  },
    { title: "Success Rate", value: `${analytics?.overview.successRate || 0}%`, icon: TrendingUp, grad: "linear-gradient(135deg,#7C3AED,#A855F7)", glow: "rgba(124,58,237,0.35)" },
  ];

  if (loading) {
    return (
      <div style={{ padding: "32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 96, borderRadius: 16, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .dash-fade { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Header */}
      <div className="dash-fade" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "#64748B" }}>Overview of your social media posts</p>
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

      {/* Stats */}
      <div className="dash-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28, animationDelay: "0.1s" }}>
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Quick tip banner */}
      <div className="dash-fade" style={{
        background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(59,130,246,0.08))",
        border: "1px solid rgba(124,58,237,0.25)",
        borderRadius: 14, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 28, animationDelay: "0.15s",
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#C4B5FD", marginBottom: 2 }}>Queue Worker Active</p>
          <p style={{ fontSize: 12, color: "#64748B" }}>Posts scheduled here will be published automatically at the exact time you choose via BullMQ.</p>
        </div>
        <button
          onClick={() => setCreatePostDialogOpen(true)}
          style={{
            marginLeft: "auto", flexShrink: 0,
            padding: "7px 16px", borderRadius: 8,
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            border: "none", color: "white",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Schedule a Post →
        </button>
      </div>

      {/* Two column grid */}
      <div className="dash-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, animationDelay: "0.2s" }}>
        {/* Recent Posts */}
        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Recent Posts</h2>
            <Link href="/dashboard/posts" style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 12, color: "#7C3AED", fontWeight: 600, textDecoration: "none",
              padding: "5px 10px", borderRadius: 7,
              background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
              transition: "background 0.2s",
            }}>
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {!analytics?.recentPosts.length ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <FileText size={32} color="#334155" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: "#475569" }}>No posts yet. Create your first one!</p>
              </div>
            ) : analytics.recentPosts.map(p => (
              <PostRow key={p.id} content={p.content} createdAt={p.createdAt} status={p.status} />
            ))}
          </div>
        </div>

        {/* Upcoming Scheduled */}
        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 16px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Upcoming Scheduled</h2>
          </div>
          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {!analytics?.upcomingPosts.length ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <Clock size={32} color="#334155" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: "#475569" }}>No upcoming posts scheduled</p>
                <button
                  onClick={() => setCreatePostDialogOpen(true)}
                  style={{
                    marginTop: 12, padding: "7px 16px", borderRadius: 8,
                    background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                    border: "none", color: "white",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Schedule Now →
                </button>
              </div>
            ) : analytics.upcomingPosts.map(p => (
              <UpcomingRow key={p.id} content={p.content} scheduledAt={p.scheduledAt} platforms={p.platforms} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
