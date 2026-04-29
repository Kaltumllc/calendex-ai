'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { ThemeProvider, ThemeToggle } from '../lib/theme';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'links', label: 'Booking Links', icon: '🔗' },
  { id: 'availability', label: 'Availability', icon: '🕐' },
  { id: 'ai', label: 'AI Assistant', icon: '✦' },
];

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <div style={{ width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>📅</div>
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
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-soft)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'transparent'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >Sign out</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color ? `${color}18` : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: 16 }}>{icon}</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text)', lineHeight: 1, marginBottom: 6 }}>{value}</p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function AIChat({ user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm Kaltum AI, your intelligent scheduling assistant. Ask me about your schedule, or try "optimize my week".` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api.aiChat({ message: msg, context: { userName: user?.name } });
      setMessages(p => [...p, { role: 'assistant', text: res.reply }]);
    } catch { setMessages(p => [...p, { role: 'assistant', text: 'Something went wrong. Try again.' }]); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', height: 480 }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>AI Scheduling Assistant</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-faint)' }}>Kaltum AI</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
            {m.role === 'assistant' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, color: 'white' }}>✦</div>}
            <div style={{ maxWidth: '75%', padding: '10px 16px', borderRadius: 16, fontSize: '0.9rem', lineHeight: 1.65, background: m.role === 'user' ? 'var(--accent)' : 'var(--surface-2)', color: m.role === 'user' ? 'white' : 'var(--text)', borderBottomRightRadius: m.role === 'user' ? 4 : 16, borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16 }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white' }}>✦</div><div style={{ padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4, background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Thinking...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <input style={{ flex: 1, padding: '10px 14px', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}
          placeholder="Ask about your schedule..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: loading || !input.trim() ? 0.5 : 1 }}>Send</button>
      </div>
    </div>
  );
}

function CreateLinkModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', slug: '', description: '', duration_minutes: 30, buffer_before: 0, buffer_after: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function autoSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const link = await api.createLink(form);
      onCreated(link);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 };
  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; };
  const onBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 36, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)' }}>New Booking Link</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>×</button>
        </div>

        {error && <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(222,53,11,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontSize: '0.875rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Meeting title</label>
            <input style={inputStyle} type="text" placeholder="e.g. 30 Min Consultation" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: autoSlug(e.target.value) }))}
              required onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Booking link slug</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', color: 'var(--text-faint)', fontSize: '0.875rem', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>calendexai.com/book/</span>
              <input style={{ ...inputStyle, border: 'none', borderRadius: 0, background: 'transparent' }} type="text" placeholder="your-link" value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Duration</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.duration_minutes}
              onChange={e => setForm(p => ({ ...p, duration_minutes: Number(e.target.value) }))}>
              {[15, 20, 30, 45, 60, 90].map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Buffer before</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.buffer_before}
                onChange={e => setForm(p => ({ ...p, buffer_before: Number(e.target.value) }))}>
                {[0, 5, 10, 15].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Buffer after</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.buffer_after}
                onChange={e => setForm(p => ({ ...p, buffer_after: Number(e.target.value) }))}>
                {[0, 5, 10, 15].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optional)</span></label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} placeholder="What's this meeting about?" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px var(--accent-glow)' }}>
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AvailabilityTab({ user }) {
  const [availability, setAvailability] = useState(
    DAYS.map((_, i) => ({ day_of_week: i, enabled: i >= 1 && i <= 5, start_time: '09:00', end_time: '17:00' }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const active = availability.filter(a => a.enabled);
      await api.setAvailability({ availability: active });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert('Failed to save: ' + e.message); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 4 }}>Availability</h1>
          <p style={{ color: 'var(--text-muted)' }}>Set your weekly availability for bookings.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', background: saved ? 'var(--success)' : 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {availability.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${a.enabled ? 'var(--accent)' : 'var(--border)'}`, background: a.enabled ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', fontSize: '0.75rem', color: 'white' }}
              onClick={() => setAvailability(p => p.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}>
              {a.enabled ? '✓' : ''}
            </div>
            <span style={{ width: 100, fontWeight: 600, color: a.enabled ? 'var(--text)' : 'var(--text-faint)', fontSize: '0.9rem' }}>{DAYS[i]}</span>
            {a.enabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="time" value={a.start_time} onChange={e => setAvailability(p => p.map((x, j) => j === i ? { ...x, start_time: e.target.value } : x))}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
                <span style={{ color: 'var(--text-muted)' }}>–</span>
                <input type="time" value={a.end_time} onChange={e => setAvailability(p => p.map((x, j) => j === i ? { ...x, end_time: e.target.value } : x))}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
              </div>
            ) : (
              <span style={{ color: 'var(--text-faint)', fontSize: '0.875rem' }}>Unavailable</span>
            )}
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

  useEffect(() => {
    const token = localStorage.getItem('calendex_token');
    if (!token) { router.push('/auth/login'); return; }
    setUser(JSON.parse(localStorage.getItem('calendex_user') || '{}'));
    Promise.all([api.getBookings(), api.getLinks()]).then(([b, l]) => { setBookings(b); setLinks(l); }).catch(() => {});
  }, []);

  function logout() { localStorage.removeItem('calendex_token'); localStorage.removeItem('calendex_user'); router.push('/'); }

  function copyLink(slug, id) {
    navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  }

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.start_time) > new Date());
  const completed = bookings.filter(b => b.status === 'completed');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {showCreateLink && <CreateLinkModal onClose={() => setShowCreateLink(false)} onCreated={l => setLinks(p => [l, ...p])} />}
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={logout} />
      <main style={{ flex: 1, marginLeft: 240, padding: '40px', minHeight: '100vh' }}>

        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 4 }}>
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your schedule.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              <StatCard label="Upcoming meetings" value={upcoming.length} icon="📅" color="#0066ff" />
              <StatCard label="Total bookings" value={bookings.length} icon="📊" />
              <StatCard label="Completed" value={completed.length} icon="✅" color="#00875a" />
              <StatCard label="Booking links" value={links.length} icon="🔗" color="#ff8b00" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: bookings.length > 0 ? '1fr 1fr' : '1fr', gap: 20 }}>
              {bookings.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text)', fontSize: '0.9375rem' }}>Recent Bookings</h3>
                  {bookings.slice(0, 5).map((b, i) => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < Math.min(bookings.length, 5) - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{b.guest_name?.[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem', marginBottom: 2 }}>{b.guest_name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(b.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(b.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600, background: b.status === 'confirmed' ? 'var(--success-soft)' : 'var(--surface-2)', color: b.status === 'confirmed' ? 'var(--success)' : 'var(--text-muted)' }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
              <AIChat user={user} />
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 4 }}>Bookings</h1>
              <p style={{ color: 'var(--text-muted)' }}>All your scheduled meetings.</p>
            </div>
            {bookings.length === 0 ? (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', padding: '60px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>📅</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No bookings yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create a booking link and share it to start accepting meetings.</p>
              </div>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {bookings.map((b, i) => (
                  <div key={b.id} style={{ padding: '18px 24px', borderBottom: i < bookings.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700 }}>{b.guest_name?.[0]}</div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{b.guest_name}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{b.guest_email} · {new Date(b.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, background: b.status === 'confirmed' ? 'var(--success-soft)' : b.status === 'cancelled' ? 'var(--danger-soft)' : 'var(--surface-2)', color: b.status === 'confirmed' ? 'var(--success)' : b.status === 'cancelled' ? 'var(--danger)' : 'var(--text-muted)' }}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'links' && (
          <div>
            <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 4 }}>Booking Links</h1>
                <p style={{ color: 'var(--text-muted)' }}>Share these links to accept meetings.</p>
              </div>
              <button onClick={() => setShowCreateLink(true)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 2px 8px var(--accent-glow)' }}>
                + New Link
              </button>
            </div>
            {links.length === 0 ? (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', padding: '60px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔗</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No booking links yet</p>
                <button onClick={() => setShowCreateLink(true)} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Create your first link</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(l => (
                  <div key={l.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🔗</div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{l.title}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontFamily: 'monospace' }}>/book/{l.slug}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 2 }}>{l.duration_minutes} min · {l.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => copyLink(l.slug, l.id)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: copiedId === l.id ? 'var(--success-soft)' : 'transparent', color: copiedId === l.id ? 'var(--success)' : 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                        {copiedId === l.id ? '✓ Copied!' : 'Copy Link'}
                      </button>
                      <a href={`/book/${l.slug}`} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>Preview ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'availability' && <AvailabilityTab user={user} />}
        {tab === 'ai' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: 4 }}>AI Assistant</h1>
              <p style={{ color: 'var(--text-muted)' }}>Your intelligent scheduling companion, powered by Kaltum AI.</p>
            </div>
            <AIChat user={user} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Page() {
  return <ThemeProvider><Dashboard /></ThemeProvider>;
}
