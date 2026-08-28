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

/** Real HTTP .ics URL (Apple-style). Do not use blob + download on iOS Chrome. */
export const ICS_FILE_URL = `${import.meta.env.BASE_URL}le-bao-hy.ics`;
