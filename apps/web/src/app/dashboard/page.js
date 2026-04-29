'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

function NavBar({ user, onLogout }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(16px)',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
          Calendex <span style={{ color: 'var(--accent)' }}>AI</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👋 {user?.name}</span>
          <button className="btn-ghost" onClick={onLogout} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: '24px 28px' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: color || 'var(--text)' }}>{value}</p>
      {sub && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function AIChat({ user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your Calendex AI assistant. Ask me anything about your schedule, or say "show upcoming meetings".` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api.aiChat({ message: msg, context: { userName: user?.name } });
      setMessages(p => [...p, { role: 'assistant', text: res.reply }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>AI Scheduling Assistant</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '10px 16px', borderRadius: 12, fontSize: '0.875rem', lineHeight: 1.6,
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface-2)',
              color: m.role === 'user' ? 'white' : 'var(--text)',
              borderBottomRightRadius: m.role === 'user' ? 4 : 12,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', borderRadius: 12, background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <input className="input" style={{ flex: 1 }} placeholder="Ask about your schedule..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="btn-primary" onClick={send} disabled={loading || !input.trim()} style={{ padding: '10px 20px', opacity: loading || !input.trim() ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [links, setLinks] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('calendex_token');
    if (!token) { router.push('/auth/login'); return; }
    const u = JSON.parse(localStorage.getItem('calendex_user') || '{}');
    setUser(u);
    loadData();
  }, []);

  async function loadData() {
    try {
      const [b, l] = await Promise.all([api.getBookings(), api.getLinks()]);
      setBookings(b);
      setLinks(l);
    } catch { }
  }

  function logout() {
    localStorage.removeItem('calendex_token');
    localStorage.removeItem('calendex_user');
    router.push('/');
  }

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.start_time) > new Date());
  const completed = bookings.filter(b => b.status === 'completed');

  const TABS = ['overview', 'bookings', 'links', 'ai'];

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar user={user} onLogout={logout} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 2rem 3rem' }}>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--surface)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'capitalize',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>{t === 'ai' ? '🤖 AI Chat' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', marginBottom: 28 }}>
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard label="Upcoming" value={upcoming.length} sub="confirmed meetings" color="var(--accent)" />
              <StatCard label="Total Bookings" value={bookings.length} sub="all time" />
              <StatCard label="Completed" value={completed.length} sub="meetings done" color="var(--success)" />
              <StatCard label="Booking Links" value={links.length} sub="active links" />
            </div>
            <AIChat user={user} />
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 24 }}>All Bookings</h2>
            {bookings.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                No bookings yet. Share a booking link to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookings.map(b => (
                  <div key={b.id} className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>{b.guest_name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.guest_email} · {new Date(b.start_time).toLocaleString()}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                      background: b.status === 'confirmed' ? 'rgba(0,212,170,0.1)' : b.status === 'cancelled' ? 'rgba(255,79,110,0.1)' : 'rgba(108,99,255,0.1)',
                      color: b.status === 'confirmed' ? 'var(--success)' : b.status === 'cancelled' ? 'var(--danger)' : 'var(--accent)',
                    }}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'links' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem' }}>Booking Links</h2>
            </div>
            {links.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                No booking links yet. Create one to start accepting meetings.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(l => (
                  <div key={l.id} className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>{l.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>/book/{l.slug}</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l.duration_minutes} min</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'ai' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 24 }}>AI Scheduling Assistant</h2>
            <AIChat user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
