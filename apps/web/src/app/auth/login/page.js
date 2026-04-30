'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { ThemeProvider, ThemeToggle } from '../../lib/theme';

function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const data = await api.login(form);
      localStorage.setItem('calendex_token', data.token);
      localStorage.setItem('calendex_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, box-shadow 0.2s' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)' }}>Calendex <em style={{ color: 'var(--accent)' }}>AI</em></span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Desktop split - accent panel */}
          <div style={{ display: 'none' }} className="desktop-accent-panel" />

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', color: 'var(--text)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9375rem' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>

          {error && <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(139,0,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 24, color: 'var(--danger)', fontSize: '0.875rem' }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-full)', border: 'none', background: loading ? 'var(--surface-3)' : 'var(--accent)', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px var(--accent-glow)' }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.8125rem', color: 'var(--text-faint)' }}>
            © 2026 Kaltum LLC · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() { return <ThemeProvider><LoginPage /></ThemeProvider>; }
