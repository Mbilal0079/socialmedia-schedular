"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/landing-data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
      {/* Logo */}
      <Link href="/" className="lp-logo">
        <span className="lp-logo__icon">⚡</span>
        <span className="lp-logo__text">PostPilot</span>
      </Link>

      {/* Desktop links */}
      <div className="lp-nav__links">
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} className="lp-nav__link">
            {l.label}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="lp-nav__actions">
        <Link href="/login" className="lp-nav__login">Log in</Link>
        <Link href="/register" className="lp-btn lp-btn--primary">
          Start Free Trial
        </Link>
        <button
          className="lp-nav__burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lp-nav__drawer">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="lp-nav__link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link href="/login" className="lp-nav__login" onClick={() => setOpen(false)}>Log in</Link>
          <Link href="/register" className="lp-btn lp-btn--primary" onClick={() => setOpen(false)}>
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
