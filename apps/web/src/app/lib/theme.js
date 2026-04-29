'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const saved = localStorage.getItem('calendex_theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);
  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('calendex_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }

export function ThemeToggle({ style = {} }) {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, borderRadius: 'var(--radius-sm)',
      border: '1.5px solid var(--border)', background: 'var(--surface-2)',
      cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-muted)', fontSize: '1rem',
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export function Logo({ size = 'md' }) {
  const sizes = { sm: { icon: 26, text: '1rem', ai: '0.875rem' }, md: { icon: 32, text: '1.25rem', ai: '1rem' }, lg: { icon: 40, text: '1.6rem', ai: '1.2rem' } };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Geometric C orbit logo mark */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="85 28" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="11" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="50 20" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3.5" fill="var(--accent)"/>
        <circle cx="32" cy="14" r="2.5" fill="var(--cream)"/>
        <circle cx="29" cy="8" r="1.5" fill="var(--cream)" opacity="0.7"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: s.text, color: 'var(--text)', letterSpacing: '-0.01em' }}>
        Calendex <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>AI</em>
      </span>
    </div>
  );
}
