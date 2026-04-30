'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../lib/api';
import { ThemeProvider, ThemeToggle } from '../lib/theme';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'links', label: 'Links', icon: '🔗' },
  { id: 'availability', label: 'Hours', icon: '🕐' },
  { id: 'ai', label: 'Kaltum AI', icon: '✦' },
];

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function Sidebar({ tab, setTab, user, onLogout, mobileOpen, setMobileOpen }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="85 28" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="3.5" fill="var(--accent)"/>
              <circle cx="32" cy="14" r="2.5" fill="#e8c9a0"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text)' }}>Calendex <em style={{ color: 'var(--accent)' }}>AI</em></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>{user?.name?.[0] || 'U'}</div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', padding: '8px 0 max(8px, env(safe-area-inset-bottom))' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0',
              color: tab === n.id ? 'var(--accent)' : 'var(--text-faint)',
              transition: 'color 0.15s',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{n.icon}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: tab === n.id ? 700 : 500, fontFamily: 'var(--font-body)' }}>{n.label}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div style={{ width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="85 28" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="11" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="50 20" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="3.5" fill="var(--accent)"/>
            <circle cx="32" cy="14" r="2.5" fill="#e8c9a0"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)' }}>Calendex <em style={{ color: 'var(--accent)' }}>AI</em></span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
            textAlign: 'left', width: '100%',
            background: tab === n.id ? 'var(--accent-soft)' : 'transparent',
            color: tab === n.id ? 'var(--accent)' : 'var(--text-muted)',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            fontWeight: tab === n.id ? 600 : 500, transition: 'all 0.15s',
          }}
            onMouseEnter={e => { if (tab !== n.id) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={e => { if (tab !== n.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
          >
            <span style={{ fontSize: '1rem' }}>{n.icon}</span>{n.label}
            {n.id === 'ai' && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>AI</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ThemeToggle style={{ width: '100%', borderRadius: 'var(--radius-sm)', justifyContent: 'flex-start', padding: '9px 12px', gap: 10, fontSize: '0.875rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>{user?.name?.[0] || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-soft)'; e.currentTarget.style.color = 'var(--danger)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >Sign out</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', transition: 'box-shadow 0.2s' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color ? `${color}18` : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', marginBottom: 12 }}>{icon}</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function AIChat({ user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm Kaltum AI. Ask me about your schedule or click the mic to speak.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input needs Chrome browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setInput(transcript);
      if (e.results[0].isFinal) { recognition.stop(); setListening(false); }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    window.speechSynthesis?.cancel();
    try {
      const res = await api.aiChat({ message: msg, context: { userName: user?.name } });
      setMessages(p => [...p, { role: 'assistant', text: res.reply }]);
      setTimeout(() => speak(res.reply), 100);
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: 'Something went wrong. Try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', height: 'clamp(380px, 60vh, 520px)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: listening ? '#ff4444' : speaking ? 'var(--accent)' : 'var(--success)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
          Kaltum AI {listening ? '— Listening...' : speaking ? '— Speaking...' : ''}
        </span>
        {speaking && <button onClick={() => window.speechSynthesis?.cancel()} style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Stop</button>}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.role === 'assistant' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', flexShrink: 0, color: 'white' }}>✦</div>}
            <div style={{ maxWidth: '80%', padding: '9px 14px', borderRadius: 14, fontSize: '0.875rem', lineHeight: 1.6, background: m.role === 'user' ? 'var(--accent)' : 'var(--surface-2)', color: m.role === 'user' ? 'white' : 'var(--text)', borderBottomRightRadius: m.role === 'user' ? 4 : 14, borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14 }}>{m.text}</div>
            {m.role === 'assistant' && i > 0 && <button onClick={() => speak(m.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-faint)', padding: 2, flexShrink: 0 }}>🔊</button>}
          </div>
        ))}
        {loading && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}><div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white' }}>✦</div><div style={{ padding: '9px 14px', borderRadius: 14, borderBottomLeftRadius: 4, background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Thinking...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={toggleListening} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', flexShrink: 0, background: listening ? '#ff4444' : 'var(--accent-soft)', color: listening ? 'white' : 'var(--accent)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 3px rgba(255,68,68,0.2)' : 'none' }}>🎤</button>
        <input style={{ flex: 1, padding: '9px 12px', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)' }}
          placeholder={listening ? 'Listening...' : 'Ask Kaltum AI...'}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: '9px 16px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: loading || !input.trim() ? 0.5 : 1 }}>Send</button>
      </div>
    </div>
  );
}

function CreateLinkModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', slug: '', duration_minutes: 30, buffer_before: 0, buffer_after: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function autoSlug(title) { return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30); }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError('');
    try { const link = await api.createLink(form); onCreated(link); onClose(); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'var(--font-body)' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 0 }} onClick={onClose}>
      <div style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)' }}>New Booking Link</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>
        {error && <div style={{ background: 'var(--danger-soft)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontSize: '0.875rem' }}>⚠️ {error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Meeting title</label><input style={inputStyle} type="text" placeholder="30 Min Consultation" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: autoSlug(e.target.value) }))} required /></div>
          <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Slug</label><input style={inputStyle} type="text" placeholder="your-link" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required /></div>
          <div><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Duration</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: Number(e.target.value) }))}>{[15,20,30,45,60,90].map(d => <option key={d} value={d}>{d} minutes</option>)}</select></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Buffer before</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.buffer_before} onChange={e => setForm(p => ({ ...p, buffer_before: Number(e.target.value) }))}>{[0,5,10,15].map(d => <option key={d} value={d}>{d} min</option>)}</select></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Buffer after</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.buffer_after} onChange={e => setForm(p => ({ ...p, buffer_after: Number(e.target.value) }))}>{[0,5,10,15].map(d => <option key={d} value={d}>{d} min</option>)}</select></div>
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: loading ? 0.7 : 1 }}>{loading ? 'Creating...' : 'Create Link'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AvailabilityTab() {
  const [availability, setAvailability] = useState(DAYS.map((_, i) => ({ day_of_week: i, enabled: i >= 1 && i <= 5, start_time: '09:00', end_time: '17:00' })));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try { await api.setAvailability({ availability: availability.filter(a => a.enabled) }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { alert('Failed: ' + e.message); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', color: 'var(--text)', marginBottom: 4 }}>Availability</h1><p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Set your weekly hours.</p></div>
        <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: 'var(--radius-full)', border: 'none', background: saved ? 'var(--success)' : 'var(--accent)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>{saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save'}</button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {availability.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < 6 ? '1px solid var(--border)' : 'none', flexWrap: 'wrap' }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, border: `2px solid ${a.enabled ? 'var(--accent)' : 'var(--border)'}`, background: a.enabled ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '0.7rem', color: 'white' }} onClick={() => setAvailability(p => p.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}>{a.enabled ? '✓' : ''}</div>
            <span style={{ width: 80, fontWeight: 600, color: a.enabled ? 'var(--text)' : 'var(--text-faint)', fontSize: '0.875rem' }}>{DAYS[i].slice(0,3)}</span>
            {a.enabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="time" value={a.start_time} onChange={e => setAvailability(p => p.map((x, j) => j === i ? { ...x, start_time: e.target.value } : x))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.8125rem', outline: 'none' }} />
                <span style={{ color: 'var(--text-muted)' }}>–</span>
                <input type="time" value={a.end_time} onChange={e => setAvailability(p => p.map((x, j) => j === i ? { ...x, end_time: e.target.value } : x))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.8125rem', outline: 'none' }} />
              </div>
            ) : <span style={{ color: 'var(--text-faint)', fontSize: '0.8125rem' }}>Unavailable</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [links, setLinks] = useState([]);
  const [tab, setTab] = useState('overview');
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const token = localStorage.getItem('calendex_token');
    if (!token) { router.push('/auth/login'); return; }
    setUser(JSON.parse(localStorage.getItem('calendex_user') || '{}'));
    Promise.all([api.getBookings(), api.getLinks()]).then(([b, l]) => { setBookings(b); setLinks(l); }).catch(() => {});
  }, []);

  function logout() { localStorage.removeItem('calendex_token'); localStorage.removeItem('calendex_user'); router.push('/'); }
  function copyLink(slug, id) { navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.start_time) > new Date());
  const completed = bookings.filter(b => b.status === 'completed');

  const mainPadding = isMobile ? '72px 16px 80px' : '40px 40px 40px 40px';
  const mainMargin = isMobile ? '0' : '0 0 0 240px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {showCreateLink && <CreateLinkModal onClose={() => setShowCreateLink(false)} onCreated={l => setLinks(p => [l, ...p])} />}
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={logout} mobileOpen={false} setMobileOpen={() => {}} />
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : 240, padding: mainPadding, minHeight: '100vh' }}>

        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', color: 'var(--text)', marginBottom: 4 }}>
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Here's your schedule overview.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              <StatCard label="Upcoming" value={upcoming.length} icon="📅" color="#8b0000" />
              <StatCard label="Total" value={bookings.length} icon="📊" />
              <StatCard label="Completed" value={completed.length} icon="✅" color="#1a6b3c" />
              <StatCard label="Links" value={links.length} icon="🔗" color="#8b4e00" />
            </div>
            <AIChat user={user} />
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', color: 'var(--text)', marginBottom: 20 }}>Bookings</h1>
            {bookings.length === 0 ? (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>📅</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No bookings yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Share a booking link to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{b.guest_name}</p>
                      <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600, background: b.status === 'confirmed' ? 'var(--success-soft)' : 'var(--surface-2)', color: b.status === 'confirmed' ? 'var(--success)' : 'var(--text-muted)' }}>{b.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.guest_email}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{new Date(b.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'links' && (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', color: 'var(--text)' }}>Booking Links</h1>
              <button onClick={() => setShowCreateLink(true)} style={{ padding: '9px 16px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>+ New</button>
            </div>
            {links.length === 0 ? (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔗</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>No links yet</p>
                <button onClick={() => setShowCreateLink(true)} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Create first link</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(l => (
                  <div key={l.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{l.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontFamily: 'monospace', marginBottom: 12 }}>/book/{l.slug}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => copyLink(l.slug, l.id)} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: copiedId === l.id ? 'var(--success-soft)' : 'transparent', color: copiedId === l.id ? 'var(--success)' : 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{copiedId === l.id ? '✓ Copied!' : 'Copy Link'}</button>
                      <a href={`/book/${l.slug}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', textDecoration: 'none', textAlign: 'center' }}>Preview ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'availability' && <AvailabilityTab />}

        {tab === 'ai' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', color: 'var(--text)', marginBottom: 4 }}>Kaltum AI</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>🎤 Speak or type · 🔊 AI responds with voice · Best in Chrome</p>
            </div>
            <AIChat user={user} />
            {!isMobile && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Also try: <strong style={{ color: 'var(--text)' }}>"What meetings do I have?"</strong> · <strong style={{ color: 'var(--text)' }}>"Help me schedule for tomorrow"</strong>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Page() {
  return <ThemeProvider><Dashboard /></ThemeProvider>;
}
