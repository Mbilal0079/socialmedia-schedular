"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, PenSquare, Calendar,
  BarChart3, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";

const NAV = [
  { href: "/dashboard",            label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/posts",      label: "Posts",     icon: PenSquare       },
  { href: "/dashboard/calendar",   label: "Calendar",  icon: Calendar        },
  { href: "/dashboard/analytics",  label: "Analytics", icon: BarChart3       },
  { href: "/dashboard/settings",   label: "Settings",  icon: Settings        },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: "fixed", left: 0, top: 0, zIndex: 50,
        height: "100%", width: 240,
        display: "flex", flexDirection: "column",
        background: "#0B1023",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        fontFamily: "'Inter',-apple-system,sans-serif",
      }}
      className="lg-sidebar"
      >
        <style>{`
          @media(min-width:1024px){
            .lg-sidebar{ transform: translateX(0) !important; }
            .mobile-toggle{ display: none !important; }
          }
        `}</style>

        {/* Logo */}
        <div style={{
          height: 64, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#7C3AED,#A855F7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}>⚡</div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              PostPilot
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}
            className="mobile-toggle"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (sidebarOpen) toggleSidebar(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  textDecoration: "none", fontSize: 14, fontWeight: 500,
                  transition: "all 0.2s ease",
                  background: active ? "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))" : "transparent",
                  color: active ? "#C4B5FD" : "#64748B",
                  border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  boxShadow: active ? "0 2px 8px rgba(124,58,237,0.15)" : "none",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#64748B";
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 12px" }} />

        {/* User */}
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "white",
            boxShadow: "0 0 10px rgba(124,58,237,0.4)",
            overflow: "hidden",
          }}>
            {session?.user?.image
              ? <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session?.user?.name || "User"}
            </p>
            <p style={{ fontSize: 11, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", padding: 6, borderRadius: 6,
              transition: "color 0.2s, background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = "#EF4444";
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = "#475569";
              (e.currentTarget as HTMLElement).style.background = "none";
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="mobile-toggle"
        style={{
          position: "fixed", left: 16, top: 14, zIndex: 30,
          width: 36, height: 36, borderRadius: 9,
          background: "rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#A855F7",
        }}
      >
        <Menu size={18} />
      </button>
    </>
  );
}
