import { LanguageMode, RSVPData } from '../types';

export type RsvpSheetPayload = Pick<
  RSVPData,
  'id' | 'fullName' | 'attending' | 'guestsCount' | 'message' | 'submittedAt'
> & {
  lang: LanguageMode;
};

export async function submitRsvpToSheet(payload: RsvpSheetPayload): Promise<void> {
  const url = import.meta.env.VITE_RSVP_WEBAPP_URL;
  if (!url) {
    throw new Error('RSVP_WEBAPP_UNCONFIGURED');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      // text/plain avoids a CORS preflight against Google Apps Script
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
    redirect: 'follow',
    credentials: 'omit',
  });

  if (!response.ok) {
    throw new Error('RSVP_SHEET_HTTP_' + response.status);
  }

  const text = await response.text();
  if (!text) return;

  try {
    const parsed = JSON.parse(text) as { ok?: boolean; error?: string };
    if (parsed.ok === false) {
      throw new Error(parsed.error || 'RSVP_SHEET_REJECTED');
    }
  } catch (err) {
    if (err instanceof SyntaxError) return;
    throw err;
  }
}
