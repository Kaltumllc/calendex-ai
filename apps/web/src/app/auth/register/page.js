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

  const inputStyle = { width: '100%', padding: '12px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; };
  const onBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)' }}>Calendex <em style={{ color: 'var(--accent)' }}>AI</em></span>
        </Link>
        <ThemeToggle />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', color: 'var(--text)', marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9375rem' }}>
            Already have one?{' '}
            <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          {/* Benefits */}
          <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 28 }}>
            {['Share booking links instantly', 'AI schedules for you', 'Google Calendar sync', 'Free forever'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{t}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(139,0,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 24, color: 'var(--danger)', fontSize: '0.875rem' }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Full name</label><input style={inputStyle} type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Work email</label><input style={inputStyle} type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Password <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(min. 8 chars)</span></label><input style={inputStyle} type="password" placeholder="Create a strong password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required onFocus={onFocus} onBlur={onBlur} /></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-full)', border: 'none', background: loading ? 'var(--surface-3)' : 'var(--accent)', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px var(--accent-glow)' }}>
              {loading ? 'Creating account...' : 'Create free account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service.<br />© 2026 Kaltum LLC
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() { return <ThemeProvider><RegisterPage /></ThemeProvider>; }

