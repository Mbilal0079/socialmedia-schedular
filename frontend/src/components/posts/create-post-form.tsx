"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Twitter, Facebook, Linkedin, Instagram, ImagePlus, Send, Clock, X, Loader2, PenSquare, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPostSchema, Platform } from "@/lib/validations/post";
import { usePostStore } from "@/store/post-store";
import { useUIStore } from "@/store/ui-store";

const PLATFORMS: { value: Platform; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "TWITTER",   label: "Twitter/X",  icon: Twitter,   color: "#1DA1F2", bg: "rgba(29,161,242,0.15)"  },
  { value: "FACEBOOK",  label: "Facebook",   icon: Facebook,  color: "#1877F2", bg: "rgba(24,119,242,0.15)"  },
  { value: "LINKEDIN",  label: "LinkedIn",   icon: Linkedin,  color: "#0A66C2", bg: "rgba(10,102,194,0.15)"  },
  { value: "INSTAGRAM", label: "Instagram",  icon: Instagram, color: "#E1306C", bg: "rgba(225,48,108,0.15)"  },
];

// File restrictions
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4"];
const ALLOWED_EXTENSIONS = ".jpg, .jpeg, .png, .gif, .webp, .mp4";
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "#0B1023",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 9, color: "#F8FAFC", fontSize: 13,
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.2s",
};

export function CreatePostForm() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("12:00");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaNames, setMediaNames] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { addPost } = usePostStore();
  const { createPostDialogOpen, setCreatePostDialogOpen } = useUIStore();

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "", platforms: [], mediaUrls: [] },
  });

  const content = watch("content") || "";
  const charCount = content.length;
  const maxChars = 2200;
  const charPct = (charCount / maxChars) * 100;
  const charColor = charCount > maxChars ? "#EF4444" : charCount > maxChars * 0.9 ? "#F59E0B" : "#475569";

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Invalid file type. Allowed: JPG, PNG, GIF, WEBP, MP4`);
      e.target.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`File too large. Maximum size is ${MAX_SIZE_MB}MB. Your file: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMediaFiles(prev => [...prev, data.url]);
      setMediaNames(prev => [...prev, file.name]);
      toast.success("Media uploaded!");
    } catch {
      setUploadError("Upload failed. Please try again.");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeMedia = (i: number) => {
    setMediaFiles(prev => prev.filter((_, idx) => idx !== i));
    setMediaNames(prev => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: any) => {
    if (selectedPlatforms.length === 0) return;
    try {
      let scheduledAt: string | undefined;
      if (isScheduled && schedDate) {
        const [h, m] = schedTime.split(":").map(Number);
        const d = new Date(schedDate);
        d.setHours(h, m, 0, 0);
        if (d <= new Date()) { toast.error("Schedule time must be in the future"); return; }
        scheduledAt = d.toISOString();
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.content, platforms: selectedPlatforms, scheduledAt, mediaUrls: mediaFiles }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed"); }
      const post = await res.json();
      addPost(post);
      toast.success(isScheduled ? "Post scheduled!" : "Post saved as draft!");
      reset();
      setSelectedPlatforms([]);
      setIsScheduled(false);
      setSchedDate("");
      setMediaFiles([]);
      setMediaNames([]);
      setCreatePostDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={createPostDialogOpen} onOpenChange={setCreatePostDialogOpen}>
      <DialogContent style={{ padding: 0, background: "transparent", border: "none", maxWidth: 600, width: "95vw" }}>
        <div style={{
          background: "#111827",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(124,58,237,0.15), 0 24px 64px rgba(0,0,0,0.6)",
          fontFamily: "'Inter',-apple-system,sans-serif",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky", top: 0, background: "#111827", zIndex: 10,
            borderRadius: "20px 20px 0 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PenSquare size={15} color="white" />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>Create New Post</h2>
            </div>
            <button
              onClick={() => setCreatePostDialogOpen(false)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Platform Selection */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Select Platforms
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  const active = selectedPlatforms.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "8px 14px", borderRadius: 10,
                        border: `1.5px solid ${active ? p.color : "rgba(255,255,255,0.08)"}`,
                        background: active ? p.bg : "transparent",
                        color: active ? p.color : "#64748B",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.2s", fontFamily: "inherit",
                      }}
                      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = `${p.color}60`; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; } }}
                      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#64748B"; } }}
                    >
                      <Icon size={15} />
                      {p.label}
                      {active && <span style={{ fontSize: 10, background: p.color, color: "white", borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.length === 0 && (
                <p style={{ fontSize: 11, color: "#EF4444", marginTop: 8 }}>⚠ Select at least one platform</p>
              )}
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Post Content</label>
                <span style={{ fontSize: 12, color: charColor, fontWeight: 600 }}>{charCount}/{maxChars}</span>
              </div>
              <div style={{ position: "relative" }}>
                <textarea
                  placeholder="What's on your mind? Write your post here..."
                  rows={6}
                  {...register("content")}
                  style={{
                    ...inputStyle,
                    resize: "vertical", minHeight: 140,
                    paddingBottom: 24,
                  }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(124,58,237,0.6)"}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.08)"}
                />
                {/* Char progress bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: "0 0 9px 9px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(charPct, 100)}%`, background: charPct > 90 ? "#EF4444" : charPct > 70 ? "#F59E0B" : "linear-gradient(90deg,#7C3AED,#A855F7)", transition: "width 0.2s, background 0.2s" }} />
                </div>
              </div>
              {errors.content && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 6 }}>{errors.content.message as string}</p>}
            </div>

            {/* Media Upload */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Media <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— JPG, PNG, GIF, WEBP, MP4 · max {MAX_SIZE_MB}MB</span>
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Uploaded previews */}
                {mediaFiles.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(124,58,237,0.3)" }}>
                    {url.includes(".mp4") ? (
                      <div style={{ width: "100%", height: "100%", background: "#0B1023", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 20 }}>🎬</span>
                        <span style={{ fontSize: 9, color: "#475569" }}>MP4</span>
                      </div>
                    ) : (
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={10} color="white" />
                    </button>
                  </div>
                ))}

                {/* Upload button */}
                {mediaFiles.length < 4 && (
                  <label style={{
                    width: 80, height: 80, borderRadius: 10,
                    border: "2px dashed rgba(124,58,237,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: 4,
                    cursor: uploading ? "not-allowed" : "pointer",
                    background: "rgba(124,58,237,0.04)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => { if (!uploading) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.6)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.08)"; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.04)"; }}
                  >
                    {uploading
                      ? <Loader2 size={20} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />
                      : <ImagePlus size={20} color="#7C3AED" />}
                    <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 600 }}>{uploading ? "Uploading…" : "Add Media"}</span>
                    <input
                      type="file"
                      accept={ALLOWED_EXTENSIONS}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {uploadError && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, fontSize: 12, color: "#FCA5A5" }}>
                  ⚠ {uploadError}
                </div>
              )}
            </div>

            {/* Schedule Toggle */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isScheduled ? 16 : 0 }}>
                <div
                  onClick={() => setIsScheduled(!isScheduled)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                    background: isScheduled ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.08)",
                    position: "relative", transition: "background 0.3s",
                    boxShadow: isScheduled ? "0 0 12px rgba(124,58,237,0.4)" : "none",
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3, left: isScheduled ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} color={isScheduled ? "#A855F7" : "#475569"} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: isScheduled ? "#C4B5FD" : "#64748B", cursor: "pointer" }} onClick={() => setIsScheduled(!isScheduled)}>
                    Schedule for later
                  </span>
                </div>
              </div>

              {isScheduled && (
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Calendar size={14} color="#A855F7" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#A855F7" }}>Choose date and time</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>Date</label>
                      <input
                        type="date"
                        value={schedDate}
                        min={today}
                        onChange={e => setSchedDate(e.target.value)}
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(124,58,237,0.6)"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                    <div style={{ width: 130 }}>
                      <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>Time</label>
                      <input
                        type="time"
                        value={schedTime}
                        onChange={e => setSchedTime(e.target.value)}
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(124,58,237,0.6)"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                  </div>
                  {schedDate && (
                    <p style={{ fontSize: 11, color: "#7C3AED", marginTop: 10, fontWeight: 500 }}>
                      📅 Will publish: {new Date(`${schedDate}T${schedTime}`).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={() => setCreatePostDialogOpen(false)}
                style={{
                  padding: "11px 20px", borderRadius: 10,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748B", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedPlatforms.length === 0 || charCount === 0 || charCount > maxChars}
                style={{
                  flex: 1, padding: "11px 20px", borderRadius: 10,
                  background: (isSubmitting || selectedPlatforms.length === 0 || charCount === 0)
                    ? "rgba(124,58,237,0.4)"
                    : "linear-gradient(135deg,#7C3AED,#A855F7)",
                  border: "none", color: "white", fontSize: 14, fontWeight: 700,
                  cursor: (isSubmitting || selectedPlatforms.length === 0 || charCount === 0) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { if (!isSubmitting && selectedPlatforms.length > 0) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(124,58,237,0.55)"; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)"; }}
              >
                {isSubmitting
                  ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                  : isScheduled
                  ? <><Clock size={15} /> Schedule Post</>
                  : <><Send size={15} /> Save as Draft</>}
              </button>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
