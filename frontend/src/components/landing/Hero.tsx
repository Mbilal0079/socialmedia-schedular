"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PLATFORMS } from "@/lib/landing-data";

function DashboardCard() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"Scheduling…" | "Publishing…" | "Published ✓">("Scheduling…");
  const statusColor = status === "Published ✓" ? "#22C55E" : status === "Publishing…" ? "#A855F7" : "#F59E0B";

  useEffect(() => {
    const t1 = setInterval(() => setActive((a) => (a + 1) % PLATFORMS.length), 1500);
    const t2 = setInterval(() => {
      setStatus((s) => {
        if (s === "Scheduling…") return "Publishing…";
        if (s === "Publishing…") return "Published ✓";
        return "Scheduling…";
      });
    }, 2200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="lp-hero__card">
      {/* Header */}
      <div className="lp-card-header">
        <div className="lp-avatar">B</div>
        <div>
          <div className="lp-card-name">Bilal Asghar</div>
          <div className="lp-card-handle">@bilal</div>
        </div>
        <div className="lp-card-status" style={{ color: statusColor }}>
          <span className="lp-status-dot" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
          {status}
        </div>
      </div>

      {/* Post body */}
      <p className="lp-card-body">
        Excited to share my new project — PostPilot lets you schedule posts to all your social accounts from one place 🚀 <span style={{ color: "#A855F7" }}>#buildinpublic</span>
      </p>

      {/* Platform icons */}
      <div className="lp-card-platforms">
        {PLATFORMS.map((p, i) => (
          <div
            key={p.name}
            className={`lp-platform-icon ${active === i ? "lp-platform-icon--active" : ""}`}
            style={{
              background: active === i ? p.bg : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${active === i ? p.color : "rgba(255,255,255,0.1)"}`,
            }}
          >
            <span style={{ color: active === i ? p.color : "#475569", fontWeight: 900, fontSize: 15 }}>{p.symbol}</span>
            {active === i && <span className="lp-check">✓</span>}
          </div>
        ))}
      </div>

      {/* Schedule row */}
      <div className="lp-card-schedule">
        <span style={{ fontSize: 16 }}>📅</span>
        <div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Scheduled for</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9" }}>May 24, 2025 · 10:00 AM</div>
        </div>
        <button className="lp-edit-btn">Edit</button>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="lp-hero">
      {/* Glow blobs */}
      <div className="lp-blob lp-blob--purple" />
      <div className="lp-blob lp-blob--blue" />

      <div className="lp-hero__inner">
        {/* Left */}
        <div className="lp-hero__left">
          {/* Badge */}
          <div className="lp-badge">
            <span className="lp-badge__dot" />
            FREE TO START · NO CREDIT CARD
          </div>

          <h1 className="lp-hero__h1">
            Schedule posts to{" "}
            <span className="lp-gradient-text">every platform</span>{" "}
            at once
          </h1>

          <p className="lp-hero__sub">
            Write your post once. PostPilot publishes it to Twitter, LinkedIn,
            Facebook, and Instagram — automatically, at exactly the time you choose.
          </p>

          <div className="lp-hero__ctas">
            <Link href="/register" className="lp-btn lp-btn--primary lp-btn--lg">
              Get Started Free →
            </Link>
          </div>

          <div className="lp-trust">
            {["No credit card", "Cancel anytime", "Setup in 60 seconds"].map((t) => (
              <span key={t} className="lp-trust__item">
                <span className="lp-trust__check">✓</span> {t}
              </span>
            ))}
          </div>

          <div className="lp-beta-badge">
  🇵🇰 Built by a Pakistani developer · Free during beta · Join and shape the product
          </div>
        {/* Right: mockup */}
        <div className="lp-hero__right">
          <DashboardCard />
        </div>
      </div>

      {/* Works with strip */}
      <div className="lp-works-with">
        <span className="lp-works-with__label">WORKS WITH</span>
        {PLATFORMS.map((p) => (
          <div key={p.name} className="lp-works-with__item">
            <span style={{ color: p.color, fontWeight: 900, fontSize: 16 }}>{p.symbol}</span>
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
