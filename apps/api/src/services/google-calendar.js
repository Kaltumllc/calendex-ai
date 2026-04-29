const { google } = require('googleapis');

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function getAuthUrl() {
  const oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
}

async function getTokensFromCode(code) {
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

function getCalendarClient(tokens) {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(tokens);
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Add booking to Google Calendar
async function createCalendarEvent({ tokens, booking, hostName, guestName, guestEmail, title }) {
  const calendar = getCalendarClient(tokens);
  const event = {
    summary: `${title} with ${guestName}`,
    description: `Booked via Calendex AI\nGuest: ${guestName} (${guestEmail})${booking.notes ? '\nNotes: ' + booking.notes : ''}`,
    start: { dateTime: booking.start_time, timeZone: 'UTC' },
    end: { dateTime: booking.end_time, timeZone: 'UTC' },
    attendees: [
      { email: guestEmail, displayName: guestName },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
    conferenceData: null,
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    sendUpdates: 'all',
  });

  return response.data;
}

// Check for busy slots in Google Calendar
async function getBusySlots({ tokens, timeMin, timeMax }) {
  const calendar = getCalendarClient(tokens);
  const response = await calendar.freebusy.query({
    resource: {
      timeMin,
      timeMax,
      items: [{ id: 'primary' }],
    },
  });
  return response.data.calendars.primary.busy || [];
}

module.exports = { getAuthUrl, getTokensFromCode, createCalendarEvent, getBusySlots };
