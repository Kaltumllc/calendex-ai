'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: '⚡', title: 'Smart Scheduling', desc: 'AI finds the perfect meeting time — no back-and-forth emails ever again.' },
  { icon: '🔄', title: 'Auto-Reschedule', desc: 'Claude AI suggests optimal rescheduling slots based on your patterns.' },
  { icon: '📝', title: 'Meeting Summaries', desc: 'Paste your transcript and get a structured summary with action items instantly.' },
  { icon: '🔗', title: 'Booking Links', desc: 'Share a single link. Guests pick a time. It just works.' },
  { icon: '🛡️', title: 'Buffer Protection', desc: 'Auto-add prep and recovery time between your meetings.' },
  { icon: '🌍', title: 'Timezone Aware', desc: 'Everyone sees times in their own timezone. Zero confusion.' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(16px)',
        padding: '0 2rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Calendex <span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/auth/login" className="btn-ghost" style={{ textDecoration: 'none' }}>Sign In</Link>
            <Link href="/auth/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 160, paddingBottom: 80, textAlign: 'center', padding: '160px 2rem 80px' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-soft)', border: '1px solid var(--accent)',
          borderRadius: 100, padding: '4px 16px', marginBottom: 32,
          fontSize: '0.75rem', fontFamily: 'var(--font-display)',
          color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.6s',
        }}>
          ✦ Powered by Claude AI
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 800, margin: '0 auto 24px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s 0.1s, transform 0.8s 0.1s',
        }}>
          Scheduling that<br />
          <span style={{ color: 'var(--accent)' }}>thinks for you.</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: 520,
          margin: '0 auto 48px', lineHeight: 1.7,
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s 0.25s',
        }}>
          AI-powered scheduling platform that eliminates calendar chaos.
          Smart rescheduling, meeting summaries, and beautiful booking links.
        </p>

        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s 0.4s',
        }}>
          <Link href="/auth/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 32px' }}>
            Start for free →
          </Link>
          <Link href="/book/demo" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 32px' }}>
            See a live demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
          textAlign: 'center', marginBottom: 56, letterSpacing: '-0.02em',
        }}>
          Everything your calendar <span style={{ color: 'var(--accent)' }}>needs</span>
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{
              padding: '28px 28px 32px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, fontSize: '1.1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 2rem', textAlign: 'center' }}>
        <div className="card" style={{
          maxWidth: 600, margin: '0 auto', padding: '56px 40px',
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(108,99,255,0.05) 100%)',
          borderColor: 'var(--accent)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>
            Ready to schedule smarter?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Free to get started. No credit card required.</p>
          <Link href="/auth/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 40px' }}>
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 Calendex AI · Built by Mustapha Ibrahim
        </p>
      </footer>
    </div>
  );
}
