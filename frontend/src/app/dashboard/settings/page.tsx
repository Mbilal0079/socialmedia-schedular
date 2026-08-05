"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Twitter, Facebook, Linkedin, Instagram, LinkIcon, Loader2, Check, User, Shield, AlertTriangle } from "lucide-react";

const PLATFORMS = [
  { key: "TWITTER",   label: "Twitter/X",  icon: Twitter,   color: "#1DA1F2", bg: "rgba(29,161,242,0.1)"  },
  { key: "FACEBOOK",  label: "Facebook",   icon: Facebook,  color: "#1877F2", bg: "rgba(24,119,242,0.1)"  },
  { key: "LINKEDIN",  label: "LinkedIn",   icon: Linkedin,  color: "#0A66C2", bg: "rgba(10,102,194,0.1)"  },
  { key: "INSTAGRAM", label: "Instagram",  icon: Instagram, color: "#E1306C", bg: "rgba(225,48,108,0.1)"  },
];

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "#0B1023",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 9, color: "#F8FAFC", fontSize: 14,
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.2s",
};

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) { setSaveError("Name cannot be empty"); return; }
    setIsSaving(true); setSaveError(""); setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      await updateSession();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This permanently deletes all your posts and data.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) await signOut({ callbackUrl: "/" });
      else alert("Failed to delete account.");
    } catch { alert("Failed to delete account."); }
    finally { setIsDeleting(false); }
  };

  const initials = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", maxWidth: 800 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.su{animation:fadeUp 0.5s ease both}`}</style>

      {/* Header */}
      <div className="su" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "#64748B" }}>Manage your account and connected platforms</p>
      </div>

      {/* Profile Card */}
      <div className="su" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, marginBottom: 20, animationDelay: "0.05s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={15} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Profile</h2>
            <p style={{ fontSize: 12, color: "#475569" }}>Your account information</p>
          </div>
        </div>

        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white", flexShrink: 0, overflow: "hidden", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
            {session?.user?.image
              ? <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 2 }}>{session?.user?.name || "User"}</p>
            <p style={{ fontSize: 13, color: "#64748B" }}>{session?.user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 6 }}>Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(124,58,237,0.6)"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 6 }}>Email</label>
            <input
              value={session?.user?.email || ""}
              disabled
              style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
            />
          </div>
        </div>

        {saveError && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 12 }}>{saveError}</p>}
        {saveSuccess && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#22C55E", marginBottom: 12 }}>
            <Check size={14} /> Profile saved successfully!
          </div>
        )}

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 9,
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            border: "none", color: "white", fontSize: 13, fontWeight: 700,
            cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1,
            fontFamily: "inherit", boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { if (!isSaving) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(124,58,237,0.5)"; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(124,58,237,0.35)"; }}
        >
          {isSaving ? <><Loader2 size={14} /> Saving…</> : "Save Changes"}
        </button>
      </div>

      {/* Connected Platforms */}
      <div className="su" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, marginBottom: 20, animationDelay: "0.1s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#3B82F6,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LinkIcon size={15} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Connected Platforms</h2>
            <p style={{ fontSize: 12, color: "#475569" }}>Connect your social accounts to start publishing</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${p.color}30`; (e.currentTarget as HTMLElement).style.background = p.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: p.bg, border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={p.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0", marginBottom: 2 }}>{p.label}</p>
                    <p style={{ fontSize: 12, color: "#475569" }}>Not connected</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    Disconnected
                  </span>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8,
                    background: `linear-gradient(135deg,#7C3AED,#A855F7)`,
                    border: "none", color: "white", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                  }}>
                    <LinkIcon size={12} /> Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 11, color: "#334155", marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
          ⚠️ Social media API integrations require platform developer accounts. Configure your API keys in the .env file.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="su" style={{ background: "#111827", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: 28, animationDelay: "0.15s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#EF4444,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={15} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#EF4444" }}>Danger Zone</h2>
            <p style={{ fontSize: 12, color: "#475569" }}>Irreversible actions for your account</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
          Once you delete your account, all posts, schedules, and data will be permanently removed. This cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 9,
            background: "linear-gradient(135deg,#EF4444,#DC2626)",
            border: "none", color: "white", fontSize: 13, fontWeight: 700,
            cursor: isDeleting ? "not-allowed" : "pointer", opacity: isDeleting ? 0.7 : 1,
            fontFamily: "inherit", boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
          }}
        >
          {isDeleting ? <><Loader2 size={14} /> Deleting…</> : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
