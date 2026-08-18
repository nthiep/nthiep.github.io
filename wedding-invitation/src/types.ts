export type HunbeiTheme = 'minimal_poster' | 'chinese_red' | 'champagne_gold' | 'forest_green' | 'midnight_star';
export type LanguageMode = 'vi' | 'zh' | 'en' | 'bilingual';

export interface CoupleInfo {
  brideName: string;
  groomName: string;
  brideNameZh?: string;
  groomNameZh?: string;
  brideNameVi?: string;
  groomNameVi?: string;
  groomLastNameEn?: string;
  brideLastNameEn?: string;
  signatureText?: string;
  headerQuoteZh?: string;
  headerQuoteVi?: string;
  brideRole: string;
  groomRole: string;
  bridePhone: string;
  groomPhone: string;
  brideFacebook?: string;
  groomFacebook?: string;
  brideBio: string;
  groomBio: string;
  brideImage: string;
  groomImage: string;
  coupleQuote: string;
  coupleQuoteZh?: string;
  coupleQuoteVi?: string;
  weddingDate: string; // ISO string e.g. "2030-05-20T12:00:00"
  weddingDateFormatted: string;
  weddingDateFormattedZh?: string;
  weddingDateFormattedVi?: string;
  lunarDateZh?: string;
  lunarDateVi?: string;
  venueName: string;
  venueNameZh?: string;
  venueNameVi?: string;
  venueAddress: string;
  venueAddressZh?: string;
  venueAddressVi?: string;
  venueCity: string;
  venueMapUrl: string;
  venueAppleMapUrl?: string;
  parkingNote?: string;
  venueImageUrl: string;
  hotelRoomBlock?: string;
  themeStyle?: HunbeiTheme;
}

export interface DanmakuWish {
  id: string;
  text: string;
  sender: string;
  color?: string;
  topPercent: number; // vertical lane 10% - 80%
  speedSec: number;
}

export interface RedPacketGift {
  amount: number;
  label: string;
  meaning: string;
}

export interface StoryMilestone {
  id: string;
  year: string;
  date: string;
  dateZh?: string;
  dateVi?: string;
  title: string;
  titleZh?: string;
  titleVi?: string;
  description: string;
  descriptionZh?: string;
  descriptionVi?: string;
  image?: string;
  icon: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  titleZh?: string;
  titleVi?: string;
  subtitle: string;
  subtitleZh?: string;
  subtitleVi?: string;
  location: string;
  locationZh?: string;
  locationVi?: string;
  description: string;
  descriptionZh?: string;
  descriptionVi?: string;
  icon: string;
  dressCode?: string;
}

export interface RSVPData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  attending: 'yes' | 'no';
  guestsCount: number;
  dietaryRestrictions: string;
  mealChoice: string;
  songRequest?: string;
  message?: string;
  submittedAt: string;
}

export interface GuestWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  createdAt: string;
  avatarBg?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  titleVi?: string;
  titleZh?: string;
  caption: string;
  captionVi?: string;
  captionZh?: string;
  location?: string;
  locationVi?: string;
  locationZh?: string;
  category: 'all' | 'engagement' | 'travel' | 'moments';
}

export interface FAQItem {
  id: string;
  question: string;
  questionZh?: string;
  questionVi?: string;
  answer: string;
  answerZh?: string;
  answerVi?: string;
}

export interface ColorSwatch {
  name: string;
  nameVi?: string;
  nameZh?: string;
  hex: string;
  textColor: string;
  description: string;
  descriptionVi?: string;
  descriptionZh?: string;
}

