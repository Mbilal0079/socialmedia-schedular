"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";

export function TopBar() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "there";
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20,
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
      background: "rgba(5,8,22,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'Inter',-apple-system,sans-serif",
    }}>
      {/* Left: greeting */}
      <div>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>
          Welcome back, <span style={{
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{name}</span>! 👋
        </span>
      </div>

      {/* Right: search + bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            placeholder="Search posts..."
            style={{
              paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9,
              color: "#F1F5F9", fontSize: 13,
              outline: "none", width: 220,
              fontFamily: "inherit",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(124,58,237,0.5)";
              (e.target as HTMLInputElement).style.background = "rgba(124,58,237,0.06)";
            }}
            onBlur={e => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.target as HTMLInputElement).style.background = "rgba(255,255,255,0.05)";
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: 9,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
        >
          <Bell size={16} color="#94A3B8" />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 7, height: 7, borderRadius: "50%",
            background: "#EF4444",
            boxShadow: "0 0 6px rgba(239,68,68,0.6)",
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg,#7C3AED,#A855F7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "white",
          boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          cursor: "pointer",
          flexShrink: 0,
        }}>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={name}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : initials}
        </div>
      </div>
    </header>
  );
}
