"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, TrendingUp, BarChart3, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

interface AnalyticsData {
  overview: {
    totalPosts: number;
    drafts: number;
    scheduled: number;
    published: number;
    failed: number;
    successRate: string;
  };
  platformStats: Array<{ platform: string; _count: { _all: number } }>;
}

const STATS = [
  { key: "published",   label: "Published",    icon: CheckCircle2, grad: "linear-gradient(135deg,#22C55E,#06B6D4)", glow: "rgba(34,197,94,0.35)"   },
  { key: "failed",      label: "Failed",       icon: AlertCircle,  grad: "linear-gradient(135deg,#EF4444,#F59E0B)", glow: "rgba(239,68,68,0.35)"   },
  { key: "successRate", label: "Success Rate", icon: TrendingUp,   grad: "linear-gradient(135deg,#7C3AED,#A855F7)", glow: "rgba(124,58,237,0.35)"  },
  { key: "totalPosts",  label: "Total Posts",  icon: BarChart3,    grad: "linear-gradient(135deg,#3B82F6,#06B6D4)", glow: "rgba(59,130,246,0.35)"  },
];

const PLATFORMS = [
  { key: "TWITTER",   label: "Twitter",   icon: Twitter,   color: "#1DA1F2", bg: "rgba(29,161,242,0.12)"  },
  { key: "FACEBOOK",  label: "Facebook",  icon: Facebook,  color: "#1877F2", bg: "rgba(24,119,242,0.12)"  },
  { key: "LINKEDIN",  label: "LinkedIn",  icon: Linkedin,  color: "#0A66C2", bg: "rgba(10,102,194,0.12)"  },
  { key: "INSTAGRAM", label: "Instagram", icon: Instagram, color: "#E1306C", bg: "rgba(225,48,108,0.12)"  },
];

const DISTRIBUTION = [
  { key: "drafts",     label: "Drafts",     color: "#94A3B8", grad: "linear-gradient(90deg,#94A3B8,#64748B)" },
  { key: "scheduled",  label: "Scheduled",  color: "#F59E0B", grad: "linear-gradient(90deg,#F59E0B,#EF4444)" },
  { key: "published",  label: "Published",  color: "#22C55E", grad: "linear-gradient(90deg,#22C55E,#06B6D4)" },
  { key: "failed",     label: "Failed",     color: "#EF4444", grad: "linear-gradient(90deg,#EF4444,#F59E0B)" },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setAnalytics(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ov = analytics?.overview;

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.au{animation:fadeUp 0.5s ease both}`}</style>

      {/* Header */}
      <div className="au" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: "#64748B" }}>Track your social media performance</p>
      </div>

      {/* Stat cards */}
      <div className="au" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24, animationDelay: "0.05s" }}>
        {STATS.map(s => {
          const Icon = s.icon;
          const value = s.key === "successRate"
            ? `${ov?.successRate || 0}%`
            : (ov as any)?.[s.key] ?? 0;
          return (
            <div key={s.key} style={{
              background: "#111827", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 24, position: "relative", overflow: "hidden",
              transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-3px)";
              el.style.borderColor = "rgba(124,58,237,0.4)";
              el.style.boxShadow = `0 8px 32px ${s.glow}`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.boxShadow = "";
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: s.glow, filter: "blur(24px)", opacity: 0.6, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 16px ${s.glow}` }}>
                  <Icon size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4, fontWeight: 500 }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>{loading ? "—" : value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Performance */}
      <div className="au" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 20, animationDelay: "0.1s" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>Platform Performance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            const stat = analytics?.platformStats?.find(s => s.platform === p.key);
            const count = stat?._count._all || 0;
            return (
              <div key={p.key} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px", borderRadius: 12,
                background: p.bg, border: `1px solid ${p.color}25`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${p.color}25`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={p.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 2 }}>{p.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{count} <span style={{ fontSize: 12, fontWeight: 500, color: "#64748B" }}>posts</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Distribution */}
      <div className="au" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, animationDelay: "0.15s" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>Post Distribution</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DISTRIBUTION.map(d => {
            const total = ov?.totalPosts || 1;
            const value = (ov as any)?.[d.key] || 0;
            const pct = Math.round((value / total) * 100);
            return (
              <div key={d.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                    <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 700 }}>{value} <span style={{ color: "#475569", fontWeight: 400 }}>({pct}%)</span></span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: d.grad, borderRadius: 100,
                    transition: "width 0.8s ease",
                    boxShadow: pct > 0 ? `0 0 8px ${d.color}60` : "none",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
