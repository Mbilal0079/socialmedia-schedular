"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FEATURES, STEPS, TESTIMONIALS, PLANS, FAQS, STATS } from "@/lib/landing-data";

/* ── SECTION LABEL ── */
function SectionLabel({ color = "#A78BFA", children }: { color?: string; children: React.ReactNode }) {
  return (
    <div className="lp-section-label" style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      {children}
    </div>
  );
}

/* ── ANIMATED COUNTER ── */
function Counter({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`lp-stat__value ${visible ? "lp-stat__value--visible" : ""}`}>
      {value}
    </div>
  );
}

/* ── FEATURES ── */
export function Features() {
  return (
    <section id="features" className="lp-section">
      <div className="lp-blob lp-blob--purple" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="lp-section__head">
        <SectionLabel>What's inside</SectionLabel>
        <h2 className="lp-section__h2">Built on a reliable queue engine</h2>
        <p className="lp-section__sub">Powered by BullMQ + Redis. Posts fire on time, every time.</p>
      </div>
      <div className="lp-features-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="lp-feat-card">
            <div className="lp-feat-icon" style={{ background: f.grad }}>
              {f.icon}
            </div>
            <h3 className="lp-feat-title">{f.title}</h3>
            <p className="lp-feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ── */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="lp-section lp-section--alt">
      <div className="lp-section__head">
        <SectionLabel color="#93C5FD">How it works</SectionLabel>
        <h2 className="lp-section__h2">From post to published in 4 steps</h2>
        <p className="lp-section__sub">Under 5 minutes from sign-up to your first scheduled post.</p>
      </div>
      <div className="lp-steps-grid">
        {STEPS.map((s, i) => (
          <div key={i} className="lp-step-card">
            <div className="lp-step-num">0{i + 1}</div>
            <div className="lp-step-icon">{s.icon}</div>
            <h3 className="lp-step-title">{s.title}</h3>
            <p className="lp-step-desc">{s.desc}</p>
            {i < STEPS.length - 1 && <div className="lp-step-arrow">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── STATS ── */
export function Stats() {
  return (
    <section className="lp-stats-section">
      <div className="lp-blob lp-blob--cyan" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="lp-stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="lp-stat">
            <Counter value={s.value} />
            <div className="lp-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
export function Testimonials() {
  return (
    <section className="lp-section lp-section--alt">
      <div className="lp-section__head">
        <h2 className="lp-section__h2">Loved by creators</h2>
        <div className="lp-stars-row">★★★★★</div>
      </div>
      <div className="lp-testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="lp-testi-card">
            <div className="lp-testi-stars">{"★★★★★"}</div>
            <p className="lp-testi-body">"{t.body}"</p>
            <div className="lp-testi-author">
              <div className="lp-testi-avatar">{t.avatar}</div>
              <div>
                <div className="lp-testi-name">{t.name}</div>
                <div className="lp-testi-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── PRICING ── */
export function Pricing() {
  return (
    <section id="pricing" className="lp-section">
      <div className="lp-blob lp-blob--purple" style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="lp-section__head">
        <SectionLabel>Pricing</SectionLabel>
        <h2 className="lp-section__h2">Start free. Grow on your terms.</h2>
        <p className="lp-section__sub">No hidden fees. Cancel anytime.</p>
      </div>
      <div className="lp-plans-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`lp-plan-card ${plan.highlight ? "lp-plan-card--highlight" : ""}`}
          >
            {plan.tag && <div className="lp-plan-tag">{plan.tag}</div>}
            <div className="lp-plan-name">{plan.name}</div>
            <div className="lp-plan-price">
              <span className="lp-plan-amount">${plan.price}</span>
              <span className="lp-plan-period">/{plan.period}</span>
            </div>
            <p className="lp-plan-desc">{plan.desc}</p>
            <Link
              href={plan.href}
              className={`lp-btn lp-btn--block ${plan.highlight ? "lp-btn--primary" : "lp-btn--ghost"}`}
            >
              {plan.cta}
            </Link>
            <ul className="lp-plan-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <span className="lp-plan-check">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FAQ ── */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="lp-section lp-section--alt">
      <div className="lp-section__head" style={{ maxWidth: 600, margin: "0 auto 48px" }}>
        <h2 className="lp-section__h2">Common questions</h2>
        <p className="lp-section__sub">Something else? Email us anytime.</p>
      </div>
      <div className="lp-faq-list">
        {FAQS.map((faq, i) => (
          <div key={i} className={`lp-faq-item ${open === i ? "lp-faq-item--open" : ""}`}>
            <button className="lp-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {faq.q}
              <span className="lp-faq-icon" style={{ transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {open === i && <div className="lp-faq-a">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FINAL CTA ── */
export function FinalCTA() {
  return (
    <section className="lp-cta-section">
      <div className="lp-blob lp-blob--purple" style={{ top: "10%", left: "20%" }} />
      <div className="lp-blob lp-blob--blue" style={{ bottom: "10%", right: "20%" }} />
      <div className="lp-cta-inner">
        <h2 className="lp-cta-h2">
          Stop posting manually.<br />
          <span className="lp-gradient-text">Start scheduling smarter.</span>
        </h2>
        <p className="lp-cta-sub">
          Set up once. PostPilot handles the rest — every post, every platform, on time.
        </p>
        <Link href="/register" className="lp-btn lp-btn--primary lp-btn--xl">
          Start Scheduling Free →
        </Link>
        <div className="lp-trust" style={{ justifyContent: "center", marginTop: 20 }}>
          {["No credit card", "Free forever plan", "Cancel anytime"].map((t) => (
            <span key={t} className="lp-trust__item">✓ {t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
export function Footer() {
  const cols = [
    { title: "Product",  links: ["Features", "Pricing", "Changelog", "Roadmap"] },
    { title: "Company",  links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal",    links: ["Privacy", "Terms", "Cookies", "Security"] },
  ];
  return (
    <footer className="lp-footer">
      <div className="lp-footer__top">
        <div className="lp-footer__brand">
          <div className="lp-logo">
            <span className="lp-logo__icon">⚡</span>
            <span className="lp-logo__text">PostPilot</span>
          </div>
          <p className="lp-footer__tagline">
            Social media scheduling powered by BullMQ. Posts fire on time, every time.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title} className="lp-footer__col">
            <div className="lp-footer__col-title">{col.title}</div>
            <ul>
              {col.links.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="lp-footer__bottom">
        <span>© {new Date().getFullYear()} PostPilot. All rights reserved.</span>
        <div className="lp-footer__socials">
          {["Twitter", "LinkedIn", "GitHub"].map((s) => (
            <a key={s} href="#">{s}</a>
          ))}
        </div>
        <div className="lp-footer__bottom">
  <div>
    <span style={{ color: "#334155", fontSize: 13 }}>
      © {new Date().getFullYear()} PostPilot. Built by{" "}
      <a href="mailto:bilalasghar@email.com" style={{ color: "#7C3AED" }}>
        Bilal Asghar
      </a>{" "}
      · Currently in beta
    </span>
  </div>
  <div className="lp-footer__socials">
    {["Twitter", "LinkedIn", "GitHub"].map((s) => (
      <a key={s} href="#">{s}</a>
    ))}
  </div>
</div>
      </div>
    </footer>
  );
}
