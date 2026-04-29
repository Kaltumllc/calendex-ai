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
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.login(form);
      localStorage.setItem('calendex_token', data.token);
      localStorage.setItem('calendex_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ background: 'var(--accent)', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'white' }}>Calendex <em>AI</em></span>
        </Link>
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            Your calendar,<br /><em>intelligently managed.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            AI-powered scheduling that eliminates back-and-forth and keeps you focused on what matters.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, right: 24 }}>
          <ThemeToggle />
        </div>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: '0.9375rem' }}>
            Don't have an account? <Link href="/auth/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>

          {error && (
            <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(222,53,11,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 24, color: 'var(--danger)', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Email address</label>
              <input style={{ width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-body)' }}
                type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>Password</label>
                <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input style={{ width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-body)' }}
                type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 'var(--radius-full)',
              background: loading ? 'var(--surface-3)' : 'var(--accent)', color: 'white',
              border: 'none', fontSize: '0.9375rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px var(--accent-glow)',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ThemeProvider><LoginPage /></ThemeProvider>;
}
