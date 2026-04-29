'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../lib/api';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function toDateStr(d) {
  return d.toISOString().split('T')[0];
}

export default function BookPage() {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));
  const [slots, setSlots] = useState([]);
  const [linkInfo, setLinkInfo] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [step, setStep] = useState('pick'); // pick | confirm | done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) loadSlots(selectedDate);
  }, [slug, selectedDate]);

  async function loadSlots(date) {
    setLoading(true); setSlots([]);
    try {
      const data = await api.getAvailability(slug, date);
      setSlots(data.slots || []);
      setLinkInfo({ title: data.title, duration: data.duration });
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  async function handleBook(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.createBooking({
        slug,
        guest_name: form.name,
        guest_email: form.email,
        start_time: selectedSlot.start,
        notes: form.notes,
      });
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { str: toDateStr(d), label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 12 }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
            <strong style={{ color: 'var(--text)' }}>{linkInfo?.title}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{formatDate(selectedSlot?.start)}</p>
          <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{formatTime(selectedSlot?.start)} – {formatTime(selectedSlot?.end)}</p>
          <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '0.875rem' }}>
            A confirmation has been noted. Check your email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>
            Calendex <span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
          {linkInfo && (
            <div style={{ marginTop: 12 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem' }}>{linkInfo.title}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{linkInfo.duration} minute meeting</p>
            </div>
          )}
        </div>

        {step === 'pick' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Date picker */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Select a Date</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {days.map(d => (
                  <button key={d.str} onClick={() => setSelectedDate(d.str)} style={{
                    padding: '10px 16px', borderRadius: 8, border: '1px solid',
                    borderColor: selectedDate === d.str ? 'var(--accent)' : 'var(--border)',
                    background: selectedDate === d.str ? 'var(--accent-soft)' : 'transparent',
                    color: selectedDate === d.str ? 'var(--accent)' : 'var(--text)',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem',
                    transition: 'all 0.15s',
                  }}>{d.label}</button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>
                {formatDate(selectedDate)}
              </h3>
              {loading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading slots...</p>
              ) : slots.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No available slots on this day.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {slots.map((s, i) => (
                    <button key={i} onClick={() => { setSelectedSlot(s); setStep('confirm'); }} style={{
                      padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--surface-2)', color: 'var(--text)',
                      cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                    >
                      {formatTime(s.start)} – {formatTime(s.end)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
            <button onClick={() => setStep('pick')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20, fontSize: '0.875rem' }}>← Back</button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>Confirm your booking</h3>
            <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: 24 }}>
              {formatDate(selectedSlot?.start)} · {formatTime(selectedSlot?.start)} – {formatTime(selectedSlot?.end)}
            </p>

            {error && (
              <div style={{ background: 'rgba(255,79,110,0.1)', border: '1px solid rgba(255,79,110,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="label">Your Name</label>
                <input className="input" type="text" placeholder="John Smith" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="john@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <textarea className="input" placeholder="Any context for the meeting..." value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
