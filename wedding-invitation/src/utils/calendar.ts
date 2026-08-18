import { CoupleInfo } from '../types';

export function generateGoogleCalendarUrl(couple: CoupleInfo): string {
  const title = encodeURIComponent(`${couple.brideName} & ${couple.groomName}'s Wedding`);
  const details = encodeURIComponent(
    `We are delighted to invite you to celebrate the wedding of ${couple.brideName} and ${couple.groomName} at ${couple.venueName}.\n\nDress Code: Formal / Botanical Earth Tones.\nLocation: ${couple.venueAddress}, ${couple.venueCity}`
  );
  const location = encodeURIComponent(`${couple.venueName}, ${couple.venueAddress}, ${couple.venueCity}`);
  
  // Format: YYYYMMDDTHHmmssZ
  const startTime = '20261024T223000Z'; // 3:30 PM PDT is 22:30 UTC
  const endTime = '20261025T070000Z';   // Midnight PDT is 07:00 UTC

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`;
}

export function downloadIcsFile(couple: CoupleInfo) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eleanor and Arthur Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-eleanor-arthur-20261024',
    'DTSTAMP:20260815T000000Z',
    'DTSTART:20261024T223000Z',
    'DTEND:20261025T070000Z',
    `SUMMARY:${couple.brideName} & ${couple.groomName} Wedding Celebration`,
    `DESCRIPTION:Celebrate the wedding of ${couple.brideName} and ${couple.groomName} at ${couple.venueName}.`,
    `LOCATION:${couple.venueName}\\, ${couple.venueAddress}\\, ${couple.venueCity}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Wedding Tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Wedding-${couple.brideName}-${couple.groomName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
