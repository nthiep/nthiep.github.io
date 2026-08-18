import { CoupleInfo } from '../types';

const TIMEZONE_OFFSET = '+07:00';
const DURATION_MS = 3 * 60 * 60 * 1000;

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function getEventTimes(couple: CoupleInfo): { start: string; end: string } {
  const start = new Date(`${couple.weddingDate}${TIMEZONE_OFFSET}`);
  const end = new Date(start.getTime() + DURATION_MS);
  return { start: toIcsUtc(start), end: toIcsUtc(end) };
}

function getEventMeta(couple: CoupleInfo) {
  const groom = couple.groomNameVi || couple.groomName;
  const bride = couple.brideNameVi || couple.brideName;
  const venue = couple.venueNameVi || couple.venueName;
  const address = couple.venueAddressVi || couple.venueAddress;
  const title = `Lễ Báo Hỷ · ${groom} & ${bride}`;
  const details = `Trân trọng kính mời quý khách đến chung vui trong ngày Lễ Báo Hỷ của ${groom} & ${bride} tại ${venue}.\n\nĐịa chỉ: ${address}, ${couple.venueCity}`;
  const location = `${venue}, ${address}, ${couple.venueCity}`;
  return { title, details, location };
}

export function generateGoogleCalendarUrl(couple: CoupleInfo): string {
  const { start, end } = getEventTimes(couple);
  const { title, details, location } = getEventMeta(couple);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
    location
  )}&sf=true&output=xml`;
}

export function downloadIcsFile(couple: CoupleInfo) {
  const { start, end } = getEventTimes(couple);
  const { title, details, location } = getEventMeta(couple);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hiep and Dung Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${start}@hiep.vn`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Nhắc nhở: Lễ Báo Hỷ ngày mai!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Le-Bao-Hy-${couple.groomLastNameEn || 'Hiep'}-${couple.brideLastNameEn || 'Dung'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
