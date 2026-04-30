'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeProvider, ThemeToggle, Logo } from './lib/theme';

const FEATURES = [
  { icon: '⚡', title: 'Instant Scheduling', desc: 'Share one link. Guests pick a time. Zero back-and-forth.' },
  { icon: '✦', title: 'Kaltum AI Assistant', desc: 'Speak or type — get smart scheduling answers instantly.' },
  { icon: '🔄', title: 'Smart Reschedule', desc: 'AI suggests optimal alternatives automatically.' },
  { icon: '📝', title: 'Meeting Summaries', desc: 'Paste a transcript — get structured notes in seconds.' },
  { icon: '⭐', title: 'Guest Ratings', desc: 'Guests rate meetings. You see your average score.' },
  { icon: '🌍', title: 'Timezone Smart', desc: 'Everyone sees their local time. Zero confusion.' },
];

const STATS = [
  { value: '10k+', label: 'Meetings scheduled' },
  { value: '98%', label: 'On-time rate' },
  { value: '3min', label: 'Avg setup time' },
  { value: '4.9★', label: 'User rating' },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 20px',
      background: scrolled ? 'var(--surface)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <Link href="/auth/login" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/auth/register" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px var(--accent-glow)' }}>Get Started</Link>
        </div>
        {/* Mobile nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="mobile-nav">
          <ThemeToggle />
          <Link href="/auth/register" style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Start Free</Link>
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) { .mobile-nav { display: none !important; } }
        @media (max-width: 639px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}

function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <NavBar />

      {/* Hero */}
      <section style={{ paddingTop: 100, paddingBottom: 60, textAlign: 'center', padding: '100px 20px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 700, height: 400, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-soft) 0%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--accent), var(--cream), var(--accent), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '5px 14px 5px 8px', marginBottom: 28, boxShadow: 'var(--shadow-sm)', opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}>
            <span style={{ background: 'var(--accent)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>NEW</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Voice AI + Guest ratings now live</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 16, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s 0.1s, transform 0.8s 0.1s' }}>
            Scheduling that <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>thinks</em><br />for you.
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7, opacity: mounted ? 1 : 0, transition: 'opacity 0.8s 0.25s' }}>
            The boldest Calendly alternative. AI scheduling, voice assistant, and meeting ratings — all free.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', opacity: mounted ? 1 : 0, transition: 'opacity 0.8s 0.4s' }}>
            <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 16px var(--accent-glow)' }}>
              Start for free →
            </Link>
            <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 'var(--radius-full)', background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-2)', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-sm)' }}>
              Sign in
            </Link>
          </div>
          <p style={{ marginTop: 16, fontSize: '0.8125rem', color: 'var(--text-faint)' }}>Free forever · No credit card · 3 min setup</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 20px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '24px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--accent)', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 20px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Everything you need</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)', color: 'var(--text)', lineHeight: 1.1 }}>
              Built for professionals<br />who value their time.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 24px 28px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 14, border: '1px solid var(--border)' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)', color: 'var(--text)', marginBottom: 16, lineHeight: 1.1 }}>
            Ready to take back<br />your calendar?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '1rem' }}>Free to use. No credit card needed.</p>
          <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px var(--accent-glow)' }}>
            Get started for free →
          </Link>
        </div>
      </section>

      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent), var(--cream), var(--accent))' }} />
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 20px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
          <Logo size="sm" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-faint)' }}>© 2026 Kaltum LLC · All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return <ThemeProvider><HomePage /></ThemeProvider>;
}
