const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Calendex AI <onboarding@resend.dev>'; // Use resend.dev until you verify your domain

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
}

// ── Guest confirmation email ──────────────────────
function guestConfirmationHTML({ guestName, hostName, title, startTime, endTime, notes }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0066ff;padding:36px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">📅</div>
      <h1 style="color:white;margin:0;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;">Booking Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:0.9rem;">Your meeting has been scheduled</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="color:#3d3c38;font-size:1rem;margin:0 0 28px;">Hi <strong>${guestName}</strong>, your meeting with <strong>${hostName}</strong> is confirmed! 🎉</p>

      <!-- Meeting card -->
      <div style="background:#f3f2ef;border-radius:12px;padding:24px;margin-bottom:28px;">
        <h2 style="color:#1a1916;font-size:1.1rem;margin:0 0 16px;font-weight:700;">${title}</h2>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1rem;">📆</span>
            <span style="color:#3d3c38;font-size:0.9375rem;">${formatDate(startTime)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1rem;">🕐</span>
            <span style="color:#3d3c38;font-size:0.9375rem;">${formatTime(startTime)} – ${formatTime(endTime)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1rem;">👤</span>
            <span style="color:#3d3c38;font-size:0.9375rem;">with ${hostName}</span>
          </div>
          ${notes ? `<div style="display:flex;align-items:flex-start;gap:10px;margin-top:4px;"><span style="font-size:1rem;">📝</span><span style="color:#3d3c38;font-size:0.9375rem;">${notes}</span></div>` : ''}
        </div>
      </div>

      <p style="color:#8a8880;font-size:0.875rem;margin:0 0 24px;line-height:1.6;">
        Need to reschedule or cancel? Reply to this email and we'll take care of it.
      </p>

      <div style="border-top:1px solid #e2e1dc;padding-top:24px;text-align:center;">
        <p style="color:#b5b3ae;font-size:0.8rem;margin:0;">Powered by <strong style="color:#8b0000;">Kaltum LLC</strong> · The intelligent scheduling platform</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Host notification email ───────────────────────
function hostNotificationHTML({ hostName, guestName, guestEmail, title, startTime, endTime, notes }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1a1916;padding:36px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">🔔</div>
      <h1 style="color:white;margin:0;font-size:1.5rem;font-weight:700;">New Booking!</h1>
      <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.9rem;">Someone just booked time with you</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="color:#3d3c38;font-size:1rem;margin:0 0 28px;">Hi <strong>${hostName}</strong>, you have a new meeting booked!</p>

      <!-- Guest info -->
      <div style="background:#f3f2ef;border-radius:12px;padding:24px;margin-bottom:20px;">
        <h3 style="color:#8a8880;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 12px;">Guest</h3>
        <p style="color:#1a1916;font-size:1rem;font-weight:700;margin:0 0 4px;">${guestName}</p>
        <p style="color:#8a8880;font-size:0.875rem;margin:0;">${guestEmail}</p>
      </div>

      <!-- Meeting details -->
      <div style="background:#f3f2ef;border-radius:12px;padding:24px;margin-bottom:28px;">
        <h3 style="color:#8a8880;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 16px;">Meeting Details</h3>
        <h2 style="color:#1a1916;font-size:1.1rem;margin:0 0 16px;font-weight:700;">${title}</h2>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span>📆</span><span style="color:#3d3c38;font-size:0.9375rem;">${formatDate(startTime)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span>🕐</span><span style="color:#3d3c38;font-size:0.9375rem;">${formatTime(startTime)} – ${formatTime(endTime)}</span>
          </div>
          ${notes ? `<div style="display:flex;align-items:flex-start;gap:10px;"><span>📝</span><span style="color:#3d3c38;font-size:0.9375rem;">${notes}</span></div>` : ''}
        </div>
      </div>

      <div style="border-top:1px solid #e2e1dc;padding-top:24px;text-align:center;">
        <p style="color:#b5b3ae;font-size:0.8rem;margin:0;">Powered by <strong style="color:#8b0000;">Kaltum LLC</strong></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Send both emails ──────────────────────────────
async function sendBookingConfirmation({ booking, hostUser, linkTitle }) {
  const emailData = {
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    hostName: hostUser.name,
    hostEmail: hostUser.email,
    title: linkTitle,
    startTime: booking.start_time,
    endTime: booking.end_time,
    notes: booking.notes,
  };

  const results = await Promise.allSettled([
    // Email to guest
    resend.emails.send({
      from: FROM,
      to: booking.guest_email,
      subject: `✅ Confirmed: ${linkTitle} with ${hostUser.name}`,
      html: guestConfirmationHTML(emailData),
    }),
    // Email to host
    resend.emails.send({
      from: FROM,
      to: hostUser.email,
      subject: `🔔 New booking: ${booking.guest_name} – ${linkTitle}`,
      html: hostNotificationHTML(emailData),
    }),
  ]);

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`Email ${i} failed:`, r.reason);
    else console.log(`✅ Email ${i} sent:`, r.value?.data?.id);
  });

  return results;
}

module.exports = { sendBookingConfirmation };
