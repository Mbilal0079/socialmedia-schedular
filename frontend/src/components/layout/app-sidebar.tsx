"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: PenSquare },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-60 flex flex-col
          bg-[#0B1023] border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-[15px] shadow-lg shadow-violet-500/40">
              ⚡
            </div>
            <span className="text-base font-extrabold text-slate-50 tracking-tight">
              PostPilot
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (sidebarOpen) toggleSidebar();
                }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 no-underline
                  ${
                    active
                      ? "bg-gradient-to-r from-violet-600/25 to-purple-500/15 text-violet-300 border border-violet-500/30 shadow-md shadow-violet-500/10"
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-white/5 mx-3" />

        {/* User Section */}
        <div className="p-4 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-xs font-extrabold text-white shadow-md shadow-violet-500/40 overflow-hidden">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {session?.user?.email}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed left-4 top-3.5 z-30 w-9 h-9 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-purple-400"
      >
        <Menu size={18} />
      </button>
    </>
  );
}