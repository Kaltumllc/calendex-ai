'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ThemeProvider, ThemeToggle } from '../../lib/theme';

function formatTime(hour, min = 0) {
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${h}:${min.toString().padStart(2, '0')} ${ampm}`;
}

const DEMO_SLOTS = [9, 9.5, 10, 10.5, 11, 11.5, 14, 14.5, 15, 15.5, 16].map(h => ({
  hour: Math.floor(h),
  min: h % 1 === 0.5 ? 30 : 0,
  label: formatTime(Math.floor(h), h % 1 === 0.5 ? 30 : 0),
  endLabel: formatTime(Math.floor(h) + (h % 1 === 0.5 ? 0 : 0), h % 1 === 0.5 ? 30 + 30 : 30),
}));

const DEMO_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  if (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + (d.getDay() === 0 ? 1 : 2));
  return {
    str: d.toISOString().split('T')[0],
    label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  };
});

function DemoPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState('pick');
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [done, setDone] = useState(false);

  const inputStyle = { width: '100%', padding: '12px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' };

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center', maxWidth: 480, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 8 }}>Demo complete!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>That's exactly how your guests experience Calendex AI.</p>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.9rem' }}>In a real booking, a confirmation email would be sent automatically.</p>

        {/* Meeting link demo */}
        <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8, fontSize: '0.9rem' }}>🎥 Meeting link included</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 8 }}>In real bookings, guests receive the Zoom/Meet/Teams link directly in their confirmation email.</p>
          <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent)' }}>
            https://meet.google.com/abc-demo-xyz
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/auth/register" style={{ display: 'block', padding: '13px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center', boxShadow: '0 4px 14px var(--accent-glow)' }}>
            Create your free account →
          </Link>
          <button onClick={() => { setDone(false); setStep('pick'); setSelectedSlot(null); setForm({ name: '', email: '', notes: '' }); }} style={{ padding: '13px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Try demo again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.3s' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)' }}>Calendex <em style={{ color: 'var(--accent)' }}>AI</em></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <Link href="/auth/register" style={{ padding: '7px 16px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Demo banner */}
      <div style={{ background: 'linear-gradient(90deg, var(--accent), #c41e1e)', padding: '10px 20px', textAlign: 'center' }}>
        <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
          🎯 This is a <strong>live demo</strong> — experience exactly how your guests book meetings with you
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 14px' }}>📅</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text)', marginBottom: 6 }}>30 Min Consultation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8 }}>with Kaltum LLC</p>
          <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>🕐 30 minutes</span>
            <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>🎥 Google Meet</span>
            <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>🌍 Your timezone</span>
          </div>
        </div>

        {step === 'pick' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
            {/* Date picker */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a date</h3>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {DEMO_DAYS.map((d, i) => (
                  <button key={i} onClick={() => setSelectedDay(i)} style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid',
                    borderColor: selectedDay === i ? 'var(--accent)' : 'var(--border)',
                    background: selectedDay === i ? 'var(--accent-soft)' : 'transparent',
                    color: selectedDay === i ? 'var(--accent)' : 'var(--text-2)',
                    cursor: 'pointer', fontSize: '0.8125rem', fontWeight: selectedDay === i ? 600 : 400,
                    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>{d.label}</button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{DEMO_DAYS[selectedDay].full}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                {DEMO_SLOTS.map((s, i) => (
                  <button key={i} onClick={() => { setSelectedSlot(s); setStep('confirm'); }} style={{
                    padding: '12px 8px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)',
                    background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer',
                    fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s', textAlign: 'center',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)'; }}
                  >{s.label}</button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 12 }}>
                Love what you see? Create your own booking page in 3 minutes.
              </p>
              <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 14px var(--accent-glow)' }}>
                Create free account →
              </Link>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div style={{ maxWidth: 440, margin: '0 auto' }}>
            <button onClick={() => setStep('pick')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20, fontSize: '0.875rem', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ background: 'var(--accent)', padding: '20px 24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', marginBottom: 4 }}>Your selected time</p>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{DEMO_DAYS[selectedDay].full}</p>
                <p style={{ color: 'rgba(255,255,255,0.9)' }}>{selectedSlot?.label} – {selectedSlot?.endLabel}</p>
              </div>
              <div style={{ padding: '24px' }}>
                <form onSubmit={e => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Your name</label><input style={inputStyle} type="text" placeholder="John Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Email address</label><input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Notes <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optional)</span></label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} placeholder="What would you like to discuss?" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} /></div>
                  <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--accent-glow)' }}>
                    Confirm Booking →
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)' }}>This is a demo — no real booking will be made.</p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() { return <ThemeProvider><DemoPage /></ThemeProvider>; }
