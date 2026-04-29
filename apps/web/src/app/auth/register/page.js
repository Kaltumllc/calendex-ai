'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { ThemeProvider, ThemeToggle } from '../../lib/theme';

function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-body)' };
  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 };

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.register({ ...form, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' });
      localStorage.setItem('calendex_token', data.token);
      localStorage.setItem('calendex_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const handleFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; };
  const handleBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(77,142,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(77,142,255,0.08)' }} />
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'white' }}>Calendex <em>AI</em></span>
        </Link>
        <div style={{ zIndex: 1 }}>
          {['Share a booking link in seconds', 'AI finds the best meeting times', 'Auto-summaries after every call', 'Works across all timezones'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem' }}>✓</div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, right: 24 }}><ThemeToggle /></div>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: '0.9375rem' }}>
            Already have one? <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          {error && <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(222,53,11,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 24, color: 'var(--danger)', fontSize: '0.875rem' }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div><label style={labelStyle}>Full name</label><input style={inputStyle} type="text" placeholder="Mustapha Ibrahim" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required onFocus={handleFocus} onBlur={handleBlur} /></div>
            <div><label style={labelStyle}>Work email</label><input style={inputStyle} type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required onFocus={handleFocus} onBlur={handleBlur} /></div>
            <div><label style={labelStyle}>Password <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(min. 8 characters)</span></label><input style={inputStyle} type="password" placeholder="Create a strong password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required onFocus={handleFocus} onBlur={handleBlur} /></div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 'var(--radius-full)',
              background: loading ? 'var(--surface-3)' : 'var(--accent)', color: 'white',
              border: 'none', fontSize: '0.9375rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px var(--accent-glow)',
            }}>{loading ? 'Creating account...' : 'Create free account →'}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ThemeProvider><RegisterPage /></ThemeProvider>;
}
