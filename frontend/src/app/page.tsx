"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const PLATFORMS = [
  { name: "Twitter", color: "#1DA1F2", icon: "𝕏" },
  { name: "LinkedIn", color: "#0A66C2", icon: "in" },
  { name: "Facebook", color: "#1877F2", icon: "f" },
  { name: "Instagram", color: "#E1306C", icon: "◈" },
];

const FEATURES = [
  {
    icon: "⏰",
    title: "Schedule Once, Post Everywhere",
    desc: "Write your post once and send it to Twitter, LinkedIn, Facebook, and Instagram simultaneously — at exactly the time you choose.",
  },
  {
    icon: "📅",
    title: "Visual Content Calendar",
    desc: "See all your upcoming posts in a clean calendar view. Drag, reschedule, or cancel with one click.",
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    desc: "Track which posts published successfully, which failed, and your overall success rate across all platforms.",
  },
  {
    icon: "🔄",
    title: "Smart Retry System",
    desc: "If a post fails to publish, PostPilot automatically retries up to 3 times with exponential backoff — so nothing gets lost.",
  },
  {
    icon: "🖼️",
    title: "Media Uploads",
    desc: "Attach images to your posts. Media is stored securely and delivered fast via Cloudinary CDN.",
  },
  {
    icon: "🔒",
    title: "Secure OAuth Login",
    desc: "Sign in with Google, GitHub, or a demo account. Your social tokens are encrypted and never shared.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    desc: "Perfect for individuals just getting started.",
    cta: "Get Started Free",
    ctaHref: "/register",
    highlight: false,
    features: [
      "3 scheduled posts per day",
      "2 social accounts",
      "Twitter & LinkedIn",
      "7-day post history",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: "9",
    period: "per month",
    desc: "For creators and freelancers who post consistently.",
    cta: "Start Pro Free Trial",
    ctaHref: "/register?plan=pro",
    highlight: true,
    features: [
      "Unlimited scheduled posts",
      "All 4 platforms",
      "Image attachments",
      "Full analytics dashboard",
      "Priority retry queue",
      "30-day post history",
    ],
  },
  {
    name: "Agency",
    price: "29",
    period: "per month",
    desc: "For teams managing multiple brands.",
    cta: "Contact Us",
    ctaHref: "mailto:hello@postpilot.app",
    highlight: false,
    features: [
      "Everything in Pro",
      "5 team members",
      "20 social accounts",
      "Client reporting",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

const FAQS = [
  {
    q: "Do I need to enter a credit card to start?",
    a: "No. The Free plan requires no credit card. You can upgrade to Pro anytime from your settings.",
  },
  {
    q: "Which social media platforms are supported?",
    a: "PostPilot currently supports Twitter/X, LinkedIn, Facebook Pages, and Instagram Business accounts.",
  },
  {
    q: "What happens if a post fails to publish?",
    a: "PostPilot retries automatically up to 3 times. If it still fails, you'll see the error in your analytics dashboard so you can fix and reschedule.",
  },
  {
    q: "Can I schedule posts in advance?",
    a: "Yes — pick any future date and time. PostPilot's background worker will publish at exactly the scheduled moment.",
  },
];

function AnimatedPostCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const stepLabels = ["Composing…", "Scheduling…", "Publishing…", "Published ✓"];
  const stepColors = ["#6366F1", "#F59E0B", "#3B82F6", "#22C55E"];

  return (
    <div
      style={{
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: "16px",
        padding: "28px",
        maxWidth: "420px",
        width: "100%",
        fontFamily: "inherit",
      }}
    >
      {/* Post content preview */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            B
          </div>
          <div>
            <div style={{ color: "#F8FAFC", fontSize: "13px", fontWeight: "600" }}>Bilal Asghar</div>
            <div style={{ color: "#64748B", fontSize: "11px" }}>@bilal · Just now</div>
          </div>
        </div>
        <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
          Excited to share my new project — PostPilot lets you schedule posts to all your social
          accounts from one place 🚀 #buildinpublic
        </p>
      </div>

      {/* Platform targets */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {PLATFORMS.map((p, i) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "20px",
              border: `1px solid ${step >= 2 ? p.color : "rgba(148,163,184,0.2)"}`,
              background: step >= 2 ? `${p.color}18` : "transparent",
              transition: "all 0.4s ease",
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            <span style={{ fontSize: "11px", color: step >= 2 ? p.color : "#475569", fontWeight: "700" }}>
              {p.icon}
            </span>
            <span style={{ fontSize: "11px", color: step >= 2 ? "#CBD5E1" : "#475569" }}>{p.name}</span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "8px",
          background: `${stepColors[step]}15`,
          border: `1px solid ${stepColors[step]}30`,
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: stepColors[step],
              boxShadow: step === 3 ? `0 0 8px ${stepColors[step]}` : "none",
              animation: step < 3 ? "pulse 1s infinite" : "none",
            }}
          />
          <span style={{ color: stepColors[step], fontSize: "12px", fontWeight: "600" }}>
            {stepLabels[step]}
          </span>
        </div>
        {step === 3 && (
          <span style={{ color: "#22C55E", fontSize: "12px" }}>4 / 4 platforms ✓</span>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F1629",
        color: "#F8FAFC",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(15,22,41,0.95)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.3s ease",
          maxWidth: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#F8FAFC" }}>
            PostPilot
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: "#94A3B8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F8FAFC")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#94A3B8")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/login"
            style={{
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              padding: "8px 16px",
            }}
          >
            Login
          </Link>
          <Link
            href="/register"
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "8px 20px",
              borderRadius: "8px",
              transition: "opacity 0.2s",
            }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: copy */}
          <div style={{ flex: "1", minWidth: "300px", maxWidth: "560px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(99,102,241,0.4)",
                background: "rgba(99,102,241,0.1)",
                color: "#A5B4FC",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.05em",
                marginBottom: "24px",
                textTransform: "uppercase",
              }}
            >
              <span>✦</span> Free to start · No credit card
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: "800",
                lineHeight: "1.1",
                margin: "0 0 24px",
                letterSpacing: "-0.03em",
              }}
            >
              Schedule posts to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#6366F1,#A78BFA,#60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                every platform
              </span>{" "}
              at once
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#94A3B8",
                lineHeight: "1.7",
                margin: "0 0 36px",
                maxWidth: "460px",
              }}
            >
              Write your post once. PostPilot publishes it to Twitter, LinkedIn, Facebook,
              and Instagram — automatically, at exactly the time you choose.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "700",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(99,102,241,0.4)";
                }}
              >
                Get Started Free →
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "#94A3B8",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  border: "1px solid rgba(148,163,184,0.2)",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.5)";
                  (e.currentTarget as HTMLElement).style.color = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                }}
              >
                Try Demo
              </Link>
            </div>

            {/* Social proof */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "36px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                {["🟣", "🔵", "🟢", "🟡", "🔴"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "2px solid #0F1629",
                      background: `hsl(${i * 60},70%,60%)`,
                      marginLeft: i > 0 ? "-8px" : "0",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
              <p style={{ color: "#64748B", fontSize: "13px", margin: 0 }}>
                Trusted by <strong style={{ color: "#94A3B8" }}>200+ creators</strong> and
                growing
              </p>
            </div>
          </div>

          {/* Right: animated card */}
          <div
            style={{
              flex: "1",
              minWidth: "300px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AnimatedPostCard />
          </div>
        </div>
      </section>

      {/* ── PLATFORM LOGOS STRIP ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "48px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#475569", fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Publishes to
        </span>
        {PLATFORMS.map((p) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748B",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <span style={{ fontSize: "18px", color: p.color, fontWeight: "900" }}>{p.icon}</span>
            {p.name}
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ color: "#6366F1", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Everything you need
          </p>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: "800", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Built for people who post seriously
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "17px", maxWidth: "500px", margin: "0 auto" }}>
            No bloat. Just the tools you actually use every day.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "28px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)",
                transition: "border-color 0.2s, background 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)";
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 10px", color: "#F1F5F9" }}>
                {f.title}
              </h3>
              <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{
          padding: "100px 24px",
          background: "rgba(99,102,241,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ color: "#6366F1", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
              Simple pricing
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: "800", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              Start free. Upgrade when ready.
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "17px", margin: 0 }}>
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  border: plan.highlight
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: plan.highlight
                    ? "linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))"
                    : "rgba(255,255,255,0.03)",
                  position: "relative",
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "4px 14px",
                      borderRadius: "20px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px" }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: "#64748B", fontSize: "13px", margin: "0 0 20px" }}>
                    {plan.desc}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontSize: "42px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                      ${plan.price}
                    </span>
                    <span style={{ color: "#64748B", fontSize: "14px" }}>/{plan.period}</span>
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    textDecoration: "none",
                    marginBottom: "24px",
                    background: plan.highlight
                      ? "linear-gradient(135deg,#6366F1,#8B5CF6)"
                      : "transparent",
                    color: plan.highlight ? "white" : "#94A3B8",
                    border: plan.highlight ? "none" : "1px solid rgba(148,163,184,0.25)",
                    transition: "opacity 0.2s",
                  }}
                >
                  {plan.cta}
                </Link>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        color: "#94A3B8",
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ color: "#22C55E", flexShrink: 0, marginTop: "2px" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        style={{ padding: "100px 24px", maxWidth: "720px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: "800", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            Common questions
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "16px", margin: 0 }}>
            Everything else — just email us.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                border: "1px solid",
                borderColor: openFaq === i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#F1F5F9",
                  fontSize: "15px",
                  fontWeight: "600",
                  textAlign: "left",
                  gap: "16px",
                }}
              >
                {faq.q}
                <span
                  style={{
                    color: "#6366F1",
                    fontSize: "20px",
                    flexShrink: 0,
                    transition: "transform 0.2s",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 24px 20px",
                    color: "#64748B",
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
          borderTop: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px,4vw,48px)",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}
        >
          Start scheduling in 2 minutes
        </h2>
        <p style={{ color: "#94A3B8", fontSize: "17px", margin: "0 0 36px" }}>
          Free forever plan. No credit card. No setup fees.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            color: "white",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "700",
            padding: "16px 36px",
            borderRadius: "12px",
            boxShadow: "0 4px 32px rgba(99,102,241,0.45)",
          }}
        >
          Get Started Free →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>PostPilot</span>
          <span style={{ color: "#334155", fontSize: "14px", marginLeft: "8px" }}>
            © {new Date().getFullYear()}
          </span>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: "#475569", fontSize: "13px", textDecoration: "none" }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
