'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeProvider, ThemeToggle } from './lib/theme';

const FEATURES = [
  { icon: '⚡', title: 'Instant Scheduling', desc: 'Share one link. Guests pick a time. No emails, no confusion.' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Kaltum AI helps you optimize your calendar and suggests the best meeting times.' },
  { icon: '🔄', title: 'Smart Reschedule', desc: 'AI analyzes your schedule and suggests 3 optimal alternatives automatically.' },
  { icon: '📝', title: 'Meeting Summaries', desc: 'Paste any transcript and get structured notes with action items instantly.' },
  { icon: '🛡️', title: 'Buffer Protection', desc: 'Auto-add prep and recovery time between meetings. No more back-to-back chaos.' },
  { icon: '🌍', title: 'Timezone Aware', desc: 'Everyone sees their local time. Zero confusion, zero missed meetings.' },
];

const STATS = [
  { value: '10k+', label: 'Meetings scheduled' },
  { value: '98%', label: 'On-time rate' },
  { value: '3min', label: 'Avg setup time' },
  { value: '4.9★', label: 'User rating' },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 32px',
      background: scrolled ? 'var(--surface)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📅</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--text)' }}>
            Calendex <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>AI</em>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <Link href="/auth/login" style={{
            padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)',
            background: 'transparent', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600,
            textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
          }}>Sign In</Link>
          <Link href="/auth/register" style={{
            padding: '8px 18px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600,
            textDecoration: 'none', fontFamily: 'var(--font-body)',
            boxShadow: '0 2px 8px var(--accent-glow)', transition: 'all 0.2s',
          }}>Get Started Free</Link>
        </div>
      </div>
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
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '140px 24px 100px' }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 500, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-soft) 0%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className={`animate-fade-up ${mounted ? '' : 'delay-1'}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)', padding: '5px 14px 5px 8px',
            marginBottom: 36, boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{ background: 'var(--accent)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>NEW</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>AI-powered meeting summaries now live</span>
          </div>

          <h1 className="animate-fade-up delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--text)', maxWidth: 820, margin: '0 auto 12px',
          }}>
            Scheduling that <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>thinks</em><br />
            for you.
          </h1>

          <p className="animate-fade-up delay-2" style={{
            fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: 500,
            margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 400,
          }}>
            The intelligent Calendly alternative. AI-powered scheduling, smart rescheduling, and meeting summaries — all in one beautiful platform.
          </p>

          <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 'var(--radius-full)',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 16px var(--accent-glow)', transition: 'all 0.2s',
            }}>
              Start for free →
            </Link>
            <Link href="/book/demo" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 'var(--radius-full)',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              color: 'var(--text-2)', fontSize: '0.9375rem', fontWeight: 600,
              textDecoration: 'none', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
            }}>
              See a live demo
            </Link>
          </div>

          <p className="animate-fade-up delay-4" style={{ marginTop: 20, fontSize: '0.8125rem', color: 'var(--text-faint)' }}>
            Free forever · No credit card required · Setup in 3 minutes
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Everything you need</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1 }}>
              Built for professionals<br />who value their time.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '28px 28px 32px',
                transition: 'all 0.2s', cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: 16, lineHeight: 1.1 }}>
            Ready to take back<br />your calendar?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: '1rem' }}>
            Join thousands of professionals who schedule smarter with Calendex AI.
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent)', color: 'white',
            fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}>
            Get started for free →
          </Link>
          <p style={{ marginTop: 16, fontSize: '0.8125rem', color: 'var(--text-faint)' }}>No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)' }}>Calendex <em>AI</em></span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-faint)' }}>© 2026 Kaltum LLC · All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}
