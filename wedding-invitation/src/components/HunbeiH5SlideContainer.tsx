import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Facebook,
  Navigation as NavIcon,
  Gift,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Share2,
  Clock,
  Copy,
  Check,
  Music,
  Camera,
  Layers,
  ArrowRight,
  ArrowUp,
  Car,
  Hotel,
  X,
  Maximize2,
  Sun,
} from 'lucide-react';
import {
  CoupleInfo,
  StoryMilestone,
  ScheduleEvent,
  GalleryPhoto,
  ColorSwatch,
  HunbeiTheme,
  LanguageMode,
  FAQItem,
} from '../types';
import { AppleLogo } from './AppleLogo';
import venueHallImg from '../assets/images/venue_sanh_imperial.jpg';
import coverImg from '../assets/images/cover.jpg';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface HunbeiH5SlideContainerProps {
  couple: CoupleInfo;
  milestones: StoryMilestone[];
  events: ScheduleEvent[];
  gallery: GalleryPhoto[];
  dressColors: ColorSwatch[];
  faqs: FAQItem[];
  themeStyle: HunbeiTheme;
  lang: LanguageMode;
  onOpenCallModal: () => void;
  onOpenNavModal: () => void;
  onOpenRedPacket: () => void;
  onOpenEnvelope: () => void;
  onChangeLang: (lang: LanguageMode) => void;
  onNewWishAdded?: (name: string, message: string) => void;
}

export const HunbeiH5SlideContainer: React.FC<HunbeiH5SlideContainerProps> = ({
  couple,
  milestones,
  events,
  gallery,
  dressColors,
  faqs,
  themeStyle,
  lang,
  onOpenCallModal,
  onOpenNavModal,
  onOpenRedPacket,
  onOpenEnvelope,
  onChangeLang,
}) => {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [couplePortrait, setCouplePortrait] = useState<'groom' | 'bride' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const weddingTime = new Date(couple.weddingDate).getTime();
      const now = new Date().getTime();
      const diff = weddingTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [couple.weddingDate]);

  const scrollToSection = (elementId: string) => {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAddress = () => {
    const fullAddr = `${couple.venueNameVi || couple.venueName}, ${couple.venueAddressVi || couple.venueAddress}`;
    navigator.clipboard.writeText(fullAddr);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2200);
  };

  const closeLightbox = () => setLightboxIndex(null);
  const showNextPhoto = () => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.length);
  };
  const showPrevPhoto = () => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    if (couplePortrait === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCouplePortrait(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setCouplePortrait((prev) => (prev === 'groom' ? 'bride' : 'groom'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [couplePortrait]);

  // Theme visual parameters
  const getThemeClasses = () => {
    if (themeStyle === 'minimal_poster') {
      return {
        bg: 'bg-gradient-to-b from-[#141d17] via-[#1a261e] to-[#0f1611]',
        cardBg: 'bg-[#1b261d]/90 border-[#c4d6c5]/30 text-[#f0f7f0]',
        accentText: 'text-[#ffffff]',
        titleFont: 'font-serif',
        goldPill: 'bg-gradient-to-r from-[#d8ead9] to-[#b3ceb5] text-[#121c15]',
        seal: 'H&D',
        border: 'border-[#c4d6c5]/30',
        divider: 'bg-[#c4d6c5]/25',
      };
    }
    if (themeStyle === 'chinese_red') {
      return {
        bg: 'bg-gradient-to-b from-[#7a1013] via-[#8f1719] to-[#54080a]',
        cardBg: 'bg-[#660c0f]/90 border-[#f5d78e]/50 text-[#fae0a5]',
        accentText: 'text-[#ffd778]',
        titleFont: 'font-calligraphy',
        goldPill: 'bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#5e090b]',
        seal: '囍',
        border: 'border-[#f5d78e]/35',
        divider: 'bg-[#f5d78e]/25',
      };
    }
    if (themeStyle === 'forest_green') {
      return {
        bg: 'bg-gradient-to-b from-[#112018] via-[#182e22] to-[#0b1711]',
        cardBg: 'bg-[#183024]/90 border-[#b5d5b7]/30 text-[#e0f2e2]',
        accentText: 'text-[#c2e8c5]',
        titleFont: 'font-serif',
        goldPill: 'bg-gradient-to-r from-[#b5d5b7] to-[#8fb891] text-[#0d1c15]',
        seal: '🌿',
        border: 'border-[#b5d5b7]/30',
        divider: 'bg-[#b5d5b7]/25',
      };
    }
    if (themeStyle === 'midnight_star') {
      return {
        bg: 'bg-gradient-to-b from-[#080c16] via-[#101728] to-[#060911]',
        cardBg: 'bg-[#111a2e]/90 border-[#e0c57c]/30 text-[#e5edff]',
        accentText: 'text-[#fae59a]',
        titleFont: 'font-serif',
        goldPill: 'bg-gradient-to-r from-[#fae59a] to-[#c9a84d] text-[#090e1a]',
        seal: '✨',
        border: 'border-[#e0c57c]/30',
        divider: 'bg-[#e0c57c]/25',
      };
    }
    // Champagne Gold (Default)
    return {
      bg: 'bg-gradient-to-b from-[#261e17] via-[#33281e] to-[#1a140f]',
      cardBg: 'bg-[#33281f]/90 border-[#d4af37]/35 text-[#f5ebd9]',
      accentText: 'text-[#ffd778]',
      titleFont: 'font-serif',
      goldPill: 'bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#331c00]',
      seal: 'H&D',
      border: 'border-[#d4af37]/35',
      divider: 'bg-[#d4af37]/25',
    };
  };

  const theme = getThemeClasses();
  const brideDisplayName = lang === 'vi' ? (couple.brideNameVi || couple.brideName) : lang === 'zh' ? (couple.brideNameZh || couple.brideName) : couple.brideName;
  const groomDisplayName = lang === 'vi' ? (couple.groomNameVi || couple.groomName) : lang === 'zh' ? (couple.groomNameZh || couple.groomName) : couple.groomName;
  const venueNameText = lang === 'vi'
    ? (couple.venueNameVi || couple.venueName)
    : lang === 'zh'
    ? (couple.venueNameZh || couple.venueName)
    : 'Gold Palace Restaurant — IMPERIAL Hall, Floor 5A';
  const venueAddressText = lang === 'vi'
    ? (couple.venueAddressVi || couple.venueAddress)
    : lang === 'zh'
    ? (couple.venueAddressZh || couple.venueAddress)
    : '329 No Trang Long, Binh Loi Trung Ward, Ho Chi Minh City';
  const dateFormattedText = lang === 'vi' ? (couple.weddingDateFormattedVi || couple.weddingDateFormatted) : lang === 'zh' ? (couple.weddingDateFormattedZh || couple.weddingDateFormatted) : couple.weddingDateFormatted;
  const lunarDateText = lang === 'vi' ? couple.lunarDateVi : lang === 'zh' ? couple.lunarDateZh : undefined;
  const coupleQuoteText = lang === 'vi' ? (couple.coupleQuoteVi || couple.coupleQuote) : lang === 'zh' ? (couple.coupleQuoteZh || couple.coupleQuote) : couple.coupleQuote;
  const venueCityText = lang === 'vi' ? couple.venueCity : lang === 'zh' ? '胡志明市' : 'Ho Chi Minh City';
  const groomLabel = lang === 'vi' ? 'Chú Rể' : lang === 'en' ? 'Groom' : '新郎';
  const brideLabel = lang === 'vi' ? 'Cô Dâu' : lang === 'en' ? 'Bride' : '新娘';

  return (
    <div className={`relative w-full min-h-screen ${theme.bg} text-white selection:bg-[#ffd778] selection:text-[#331c00]`}>
      {/* ================= 1. FULL-WIDTH HERO COVER SECTION ================= */}
      <section
        id="h5-cover"
        className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 sm:p-12 overflow-hidden"
      >
        {/* Full-bleed Background Image with Elegant Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={coverImg}
            alt="Wedding Cover"
            className="absolute left-0 -top-[18%] w-full h-[140%] object-cover brightness-[0.82] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
        </div>

        {themeStyle === 'minimal_poster' ? (
          /* Minimalist Alpine Poster Style - Full Width */
          <>
            {/* Top Quote / Header Title */}
            <div className="relative z-10 text-center pt-10 sm:pt-14 pb-4 sm:pb-8 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-white/90 tracking-[0.28em] font-chinese font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] uppercase">
                {lang === 'vi' ? (couple.headerQuoteVi || 'Trân Trọng Kính Mời · Lễ Báo Hỷ') : (lang === 'en' ? 'You Are Cordially Invited' : (couple.headerQuoteZh || '谨定于 · 喜结良缘'))}
              </p>
            </div>

            {/* Center Content Stack: Signature + Info + Couple Names */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 my-auto py-4 max-w-3xl mx-auto w-full px-2 sm:px-4">
              {/* Signature Cursive Script */}
              <div className="font-signature text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] select-none">
                <div className="-rotate-2 tracking-wide">{couple.groomLastNameEn || 'Thanh Hiệp'}</div>
                <div className="text-2xl sm:text-4xl text-amber-200/90 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)] italic py-0.5 sm:py-1 font-serif select-none">&</div>
                <div className="rotate-2 tracking-wide">{couple.brideLastNameEn || 'Thùy Dung'}</div>
              </div>

              {/* Typography Info Stack */}
              <div className="space-y-1.5 text-white font-chinese drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                <div className="text-sm sm:text-base font-medium tracking-wide">
                  {dateFormattedText}
                </div>
                {lunarDateText && (
                  <div className="text-xs sm:text-sm text-white/90 tracking-wide">
                    {lunarDateText}
                  </div>
                )}
                <div className="text-xs sm:text-sm md:text-base text-white font-semibold tracking-wide">
                  {venueNameText}
                </div>
              </div>

              {/* Couple Names Bar */}
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 font-chinese text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] pt-2 tracking-normal">
                <span className="border-b border-white/40 pb-1 whitespace-nowrap inline-flex items-baseline space-x-1">
                  <span className="text-[10px] sm:text-xs text-white/80 font-normal">{groomLabel}</span>
                  <span className="text-[10px] sm:text-xs text-white/50">｜</span>
                  <span className="text-xs sm:text-sm md:text-base font-medium">{groomDisplayName}</span>
                </span>
                <span className="border-b border-white/40 pb-1 whitespace-nowrap inline-flex items-baseline space-x-1">
                  <span className="text-[10px] sm:text-xs text-white/80 font-normal">{brideLabel}</span>
                  <span className="text-[10px] sm:text-xs text-white/50">｜</span>
                  <span className="text-xs sm:text-sm md:text-base font-medium">{brideDisplayName}</span>
                </span>
              </div>
            </div>

            {/* Bottom Countdown & Scroll Down Prompt */}
            <div className="relative z-10 text-center space-y-4 pb-12 sm:pb-16 max-w-md mx-auto w-full">
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-base sm:text-xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Ngày' : (lang === 'en' ? 'Days' : '天')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-base sm:text-xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Giờ' : (lang === 'en' ? 'Hours' : '时')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-base sm:text-xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Phút' : (lang === 'en' ? 'Mins' : '分')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-base sm:text-xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Giây' : (lang === 'en' ? 'Secs' : '秒')}</div>
                </div>
              </div>

              <button
                onClick={() => scrollToSection('h5-invitation')}
                className="inline-flex flex-col items-center text-xs sm:text-sm text-white animate-bounce cursor-pointer hover:opacity-100 drop-shadow-md pt-2"
              >
                <span className="tracking-[0.2em] font-medium font-chinese mb-1">
                  {lang === 'vi' ? 'Cuộn xuống để xem thiệp cưới' : (lang === 'en' ? 'Scroll Down' : '向下滚动 · 开启请柬')}
                </span>
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        ) : (
          /* Classic Theme Cover - Full Width */
          <>
            {/* Top Crest / Double Happiness */}
            <div className="relative z-10 text-center pt-16 sm:pt-20 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffd778]/15 border-2 border-[#ffd778] backdrop-blur-md text-[#ffd778] text-3xl sm:text-4xl font-bold shadow-xl mb-3">
                {theme.seal}
              </div>
              <div className="text-xs sm:text-sm uppercase font-cinzel tracking-[0.35em] text-[#fae0a5] font-semibold">
                {lang === 'vi' ? 'Lễ Báo Hỷ · Thiệp Mời Cưới' : (lang === 'en' ? "We're Getting Married" : '喜结良缘 · 婚礼邀请函')}
              </div>
            </div>

            {/* Center Names & Auspicious Date */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 my-auto py-8 max-w-3xl mx-auto w-full px-4">
              <h1 className={`${theme.titleFont} text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide ${theme.accentText} drop-shadow-lg`}>
                {groomDisplayName}
                <span className="text-3xl sm:text-5xl mx-3 font-serif text-white/80">&</span>
                {brideDisplayName}
              </h1>

              <p className="text-sm sm:text-lg font-serif italic text-white/90 max-w-xl mx-auto leading-relaxed">
                {coupleQuoteText}
              </p>

              <div className="pt-3">
                <div className="inline-block px-5 py-2 rounded-full bg-black/55 backdrop-blur-md border border-[#ffd778]/50 text-xs sm:text-sm text-[#fae0a5] font-medium tracking-wider shadow-lg">
                  {dateFormattedText}
                </div>
                {lunarDateText && (
                  <p className="text-xs sm:text-sm text-[#ffd778]/90 font-chinese mt-2">
                    {lunarDateText}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Countdown & Scroll Down Prompt */}
            <div className="relative z-10 text-center space-y-4 pb-12 sm:pb-16 max-w-md mx-auto w-full">
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-lg sm:text-2xl font-bold text-[#ffd778]">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Ngày' : (lang === 'en' ? 'Days' : '天')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-lg sm:text-2xl font-bold text-[#ffd778]">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Giờ' : (lang === 'en' ? 'Hours' : '时')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-lg sm:text-2xl font-bold text-[#ffd778]">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Phút' : (lang === 'en' ? 'Mins' : '分')}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-lg sm:text-2xl font-bold text-[#ffd778]">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-xs text-white/70">{lang === 'vi' ? 'Giây' : (lang === 'en' ? 'Secs' : '秒')}</div>
                </div>
              </div>

              <button
                onClick={() => scrollToSection('h5-invitation')}
                className="inline-flex flex-col items-center text-xs sm:text-sm text-[#fae0a5] animate-bounce cursor-pointer hover:opacity-100 pt-2"
              >
                <span className="tracking-widest font-medium mb-1">
                  {lang === 'vi' ? 'Cuộn xuống xem thiệp cưới' : (lang === 'en' ? 'Scroll Down' : '向下滑动 · 开启幸福')}
                </span>
                <ChevronDown className="w-5 h-5 text-[#ffd778]" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ================= 2. INVITATION LETTER SECTION ================= */}
      <section id="h5-invitation" className="w-full py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              {lang === 'vi' ? 'Kính Mời' : (lang === 'en' ? 'Formal Invitation' : '谨定于 · 喜结良缘')}
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Thiệp Mời Báo Hỷ' : (lang === 'en' ? 'Our Wedding Invitation' : '诚挚邀请 · 见证良辰')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
          </div>

          <div className={`${theme.cardBg} rounded-3xl p-6 sm:p-10 shadow-2xl border space-y-6 text-center relative overflow-hidden backdrop-blur-md`}>
            <div className="w-14 h-14 mx-auto rounded-full bg-[#ffd778]/20 border border-[#ffd778] flex items-center justify-center text-2xl text-[#ffd778] shadow-inner">
              囍
            </div>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-white/90 font-serif max-w-xl mx-auto">
              <p className="font-bold text-[#ffd778] text-base sm:text-lg">
                {lang === 'vi' ? 'Kính gửi: Quý gia đình, người thân & bạn bè thân thương' : (lang === 'en' ? 'Dearest Family & Friends:' : '各位亲朋好友、至爱挚友：')}
              </p>
              <p>
                {lang === 'vi'
                  ? 'Hòa cùng niềm hạnh phúc vô bờ, chúng tôi trân trọng kính mời quý khách đến chung vui và chứng kiến khoảnh khắc thiêng liêng trong ngày Lễ Báo Hỷ.'
                  : (lang === 'en'
                  ? 'With great joy and gratitude in our hearts, we invite you to celebrate the joyous occasion of our wedding.'
                  : '沉浸在幸福中的我们，怀揣着无尽的喜悦与感恩，诚挚邀请您携家人莅临见证我们的婚礼时刻。')}
              </p>
              <p className="italic text-white/80 font-serif">
                {lang === 'vi'
                  ? '“Hạnh phúc lớn nhất là cùng người mình thương nắm tay đi qua năm tháng bình yên.”'
                  : (lang === 'en'
                  ? '“Two lives, two hearts, joined together in friendship, united forever in love.”'
                  : '“山水一程，三生有幸。执子之手，与子偕老。”')}
              </p>
            </div>

            <div className="pt-5 border-t border-white/15 text-xs sm:text-sm text-[#fae0a5] space-y-1.5">
              <div className="font-bold text-base sm:text-lg">{dateFormattedText}</div>
              <div className="text-white/90">{venueNameText}</div>
            </div>

            <div className="pt-2 max-w-md mx-auto space-y-3">
              <button
                onClick={onOpenEnvelope}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#331c00] text-xs sm:text-sm font-bold tracking-wider shadow-xl hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2"
              >
                <span>📜</span>
                <span>{lang === 'vi' ? 'Bấm Để Mở Thiệp' : (lang === 'en' ? 'Open Golden Wax Seal Letter' : '展开火漆封蜡正式请函')}</span>
              </button>

              <p className="text-xs sm:text-sm text-[#fae0a5] font-cinzel uppercase tracking-[0.2em] pt-2">
                {lang === 'vi' ? 'Thêm Vào Lịch' : (lang === 'en' ? 'Add to Calendar' : '添加到日历')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={generateGoogleCalendarUrl(couple)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-white/10 border border-[#ffd778]/50 text-[#fae0a5] text-xs sm:text-sm font-semibold tracking-wider hover:bg-white/15 active:scale-98 transition flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Google Calendar' : (lang === 'en' ? 'Google Calendar' : '谷歌日历')}</span>
                </a>
                <button
                  onClick={() => downloadIcsFile(couple)}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-[#ffd778]/50 text-[#fae0a5] text-xs sm:text-sm font-semibold tracking-wider hover:bg-white/15 active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Lịch Apple / Outlook' : (lang === 'en' ? 'Apple / Outlook (.ics)' : 'Apple / Outlook 日历')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. THE COUPLE PROFILE SECTION ================= */}
      <section id="h5-couple" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText}`}>
              {lang === 'vi' ? 'Cô Dâu & Chú Rể' : (lang === 'en' ? 'Bride & Groom' : '新郎 & 新娘')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Groom Card */}
            <div className={`${theme.cardBg} rounded-3xl p-6 border shadow-xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left`}>
              <button
                type="button"
                onClick={() => setCouplePortrait('groom')}
                className="relative group shrink-0 cursor-pointer"
              >
                <img
                  src={couple.groomImage}
                  alt="Groom"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#ffd778] shadow-md group-hover:brightness-110 transition"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white" />
                </span>
              </button>
              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <div className="text-xs text-[#ffd778] font-semibold tracking-wider">{lang === 'vi' ? 'Chú Rể · Út Nam' : (lang === 'en' ? 'Groom · Youngest Son' : '新郎 · 幼男')}</div>
                  <h4 className="font-handwriting text-2xl sm:text-2xl font-bold text-white tracking-wide mt-0.5 whitespace-nowrap drop-shadow-sm">{groomDisplayName}</h4>
                </div>

                {/* Nhà Trai info */}
                <div className="space-y-1 text-xs text-white/90 py-1">
                  <div className="text-[11px] font-bold text-[#ffd778] uppercase tracking-widest">
                    {lang === 'vi' ? 'NHÀ TRAI' : lang === 'zh' ? '男方家长' : "GROOM'S FAMILY"}
                  </div>
                  <div className="font-semibold text-white tracking-wide">
                    {lang === 'vi' ? 'ÔNG NGUYỄN VĂN TÂM' : lang === 'zh' ? '阮文心 先生' : 'MR. NGUYEN VAN TAM'}
                  </div>
                  <div className="font-semibold text-white tracking-wide">
                    {lang === 'vi' ? 'BÀ NGUYỄN THỊ HOÀNG' : lang === 'zh' ? '阮氏黄 女士' : 'MRS. NGUYEN THI HOANG'}
                  </div>
                  <div className="text-white/75 text-[11px] leading-snug">
                    {lang === 'vi' ? 'KP. PHÚ HÒA, P. HÀM THẮNG, T. LÂM ĐỒNG' : lang === 'zh' ? '林同省 咸胜坊 富和邑' : 'Phu Hoa Hamlet, Ham Thang Ward, Lam Dong'}
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={couple.groomFacebook || 'https://www.facebook.com/hiepzg'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1877f2] to-[#0d65d9] hover:from-[#166fe5] hover:to-[#0957be] text-white text-xs font-bold shadow-md hover:brightness-110 transition"
                  >
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bride Card */}
            <div className={`${theme.cardBg} rounded-3xl p-6 border shadow-xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left`}>
              <button
                type="button"
                onClick={() => setCouplePortrait('bride')}
                className="relative group shrink-0 cursor-pointer"
              >
                <img
                  src={couple.brideImage}
                  alt="Bride"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#ffd778] shadow-md group-hover:brightness-110 transition"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white" />
                </span>
              </button>
              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <div className="text-xs text-[#ffd778] font-semibold tracking-wider">{lang === 'vi' ? 'Cô Dâu · Út Nữ' : (lang === 'en' ? 'Bride · Youngest Daughter' : '新娘 · 幼女')}</div>
                  <h4 className="font-handwriting text-2xl sm:text-2xl font-bold text-white tracking-wide mt-0.5 whitespace-nowrap drop-shadow-sm">{brideDisplayName}</h4>
                </div>

                {/* Nhà Gái info */}
                <div className="space-y-1 text-xs text-white/90 py-1">
                  <div className="text-[11px] font-bold text-[#ffd778] uppercase tracking-widest">
                    {lang === 'vi' ? 'NHÀ GÁI' : lang === 'zh' ? '女方家长' : "BRIDE'S FAMILY"}
                  </div>
                  <div className="font-semibold text-white tracking-wide">
                    {lang === 'vi' ? 'ÔNG NGÔ TUẤN' : lang === 'zh' ? '吴俊 先生' : 'MR. NGO TUAN'}
                  </div>
                  <div className="font-semibold text-white tracking-wide">
                    {lang === 'vi' ? 'BÀ NGUYỄN THỊ BÍCH HUỆ' : lang === 'zh' ? '阮氏碧惠 女士' : 'MRS. NGUYEN THI BICH HUE'}
                  </div>
                  <div className="text-white/75 text-[11px] leading-snug">
                    {lang === 'vi' ? 'THÔN 2, X. TÂN MINH, T. LÂM ĐỒNG' : lang === 'zh' ? '林同省 新明社 第二村' : 'Hamlet 2, Tan Minh Commune, Lam Dong'}
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={couple.brideFacebook || 'https://www.facebook.com/dung.thuy.740804'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1877f2] to-[#0d65d9] hover:from-[#166fe5] hover:to-[#0957be] text-white text-xs font-bold shadow-md hover:brightness-110 transition"
                  >
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {couplePortrait && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setCouplePortrait(null)}
          >
            <button
              type="button"
              onClick={() => setCouplePortrait(null)}
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCouplePortrait((prev) => (prev === 'groom' ? 'bride' : 'groom'));
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCouplePortrait((prev) => (prev === 'groom' ? 'bride' : 'groom'));
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-3xl max-h-[88vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={couplePortrait === 'groom' ? couple.groomImage : couple.brideImage}
                alt={couplePortrait === 'groom' ? groomDisplayName : brideDisplayName}
                className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="text-center mt-4 text-white px-4">
                <h4 className="font-serif text-xl sm:text-2xl font-medium">
                  {couplePortrait === 'groom' ? groomDisplayName : brideDisplayName}
                </h4>
                <p className="text-xs sm:text-sm text-[#fae0a5] mt-1">
                  {couplePortrait === 'groom'
                    ? (lang === 'vi' ? 'Chú Rể · Út Nam' : (lang === 'en' ? 'Groom' : '新郎'))
                    : (lang === 'vi' ? 'Cô Dâu · Út Nữ' : (lang === 'en' ? 'Bride' : '新娘'))}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ================= 4. WEDDING SCHEDULE SECTION ================= */}
      <section id="h5-schedule" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              {lang === 'vi' ? 'Thời Gian & Lịch Trình' : (lang === 'en' ? 'Wedding Day Itinerary' : '婚礼良辰 · 流程安排')}
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Chương Trình Tiệc' : (lang === 'en' ? 'Order of Events' : '婚礼当天时刻表')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className={`${theme.cardBg} rounded-3xl p-5 sm:p-6 border shadow-xl flex items-start space-x-4 hover:border-[#ffd778]/60 transition`}
              >
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-[#ffd778]/50 flex flex-col items-center justify-center shrink-0 text-[#ffd778] shadow-inner">
                  <span className="text-sm sm:text-base font-bold leading-none">{evt.time}</span>
                  <span className="text-[10px] text-white/70 mt-1">{evt.endTime || (lang === 'vi' ? 'Bắt Đầu' : lang === 'en' ? 'Start' : '开礼')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-white">{lang === 'vi' ? (evt.titleVi || evt.title) : lang === 'zh' ? (evt.titleZh || evt.title) : evt.title}</h4>
                  <div className="text-xs text-[#fae0a5] font-medium mt-0.5">{lang === 'vi' ? (evt.subtitleVi || evt.subtitle) : lang === 'zh' ? (evt.subtitleZh || evt.subtitle) : evt.subtitle}</div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-1.5">{lang === 'vi' ? (evt.descriptionVi || evt.description) : lang === 'zh' ? (evt.descriptionZh || evt.description) : evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. VENUE GUIDE & NAVIGATION SECTION ================= */}
      <section id="h5-venue" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              {lang === 'vi' ? 'Địa Điểm · Di Chuyển' : (lang === 'en' ? 'Venue & Travel Guide' : '相约庄园 · 交通指南')}
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Sảnh Tiệc & Hướng Dẫn' : (lang === 'en' ? 'Wedding Location' : '宴会厅与出行指引')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
            <p className="text-sm sm:text-base text-white/80 italic font-serif">
              {lang === 'vi'
                ? 'Không gian tiệc cưới lộng lẫy và ấm cúng tại Sảnh IMPERIAL - Tầng 5A, sẵn sàng chào đón quý khách tới chung vui.'
                : (lang === 'en'
                  ? 'A luxurious banquet hall ready to welcome our dearest guests for a joyful celebration.'
                  : 'IMPERIAL 宴会厅位于 5A 层，恭候各位亲朋莅临同贺。')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[420px] border border-white/20 shadow-2xl">
              <img
                src={venueHallImg}
                alt="Sảnh IMPERIAL Gold Palace"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  <span className="text-xs uppercase tracking-[0.2em] font-cinzel font-semibold text-[#fae0a5] mb-1 block">
                    {lang === 'vi' ? 'Sảnh IMPERIAL - Tầng 5A' : (lang === 'en' ? 'IMPERIAL Hall - Floor 5A' : '5A层 IMPERIAL 宴会厅')}
                  </span>
                  <h3 className={`${theme.titleFont} text-xl sm:text-3xl font-bold text-white mb-2`}>
                    {lang === 'vi' ? 'Nhà hàng Gold Palace' : venueNameText}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/95 flex items-start space-x-1.5">
                    <MapPin className="w-4 h-4 text-[#ffd778] shrink-0 mt-0.5" />
                    <span>{venueAddressText}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme.cardBg} lg:col-span-5 rounded-3xl p-6 sm:p-8 border shadow-2xl flex flex-col justify-between`}>
              <div>
                <h4 className={`${theme.titleFont} text-xl sm:text-2xl font-bold text-white mb-2`}>
                  {lang === 'vi' ? 'Hướng Dẫn Di Chuyển' : (lang === 'en' ? 'Getting to the Celebration' : '出行指引')}
                </h4>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-5">
                  {lang === 'vi'
                    ? 'Nhà hàng Gold Palace nằm ngay trên tuyến đường Nơ Trang Long thuận tiện, dễ dàng tiếp cận bằng ô tô, taxi hoặc phương tiện cá nhân.'
                    : (lang === 'en'
                      ? 'Gold Palace is centrally located with easy access via taxi, ride-share, and private vehicles.'
                      : 'Gold Palace 位于 Nơ Trang Long 大街，驾车、出租车或私家车均可便捷抵达。')}
                </p>

                <div className="rounded-2xl p-4 mb-5 bg-black/30 border border-white/10 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-cinzel text-[#ffd778] font-semibold block">
                    {lang === 'vi' ? 'Địa Chỉ Chính Thức' : (lang === 'en' ? 'Official Address' : '详细地址')}
                  </span>
                  <p className="text-sm font-medium text-white">{lang === 'vi' ? 'Nhà hàng Gold Palace' : venueNameText}</p>
                  <p className="text-xs text-white/75">{venueAddressText}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  <a
                    href={couple.venueMapUrl || 'https://maps.app.goo.gl/ZVYe1nAELmTukXBL9'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl text-xs font-bold text-[#331c00] bg-gradient-to-r from-[#ffd778] to-[#d4af37] hover:brightness-110 transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <NavIcon className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href={couple.venueAppleMapUrl || 'https://maps.apple.com/place?place-id=I58FBBA16B0C03C6A'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#fae0a5] bg-black/40 border border-[#ffd778]/50 hover:bg-black/60 transition flex items-center justify-center space-x-1.5"
                  >
                    <AppleLogo className="h-[22px] w-auto shrink-0" />
                    <span>Apple Maps</span>
                  </a>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="w-full mb-5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#fae0a5] bg-black/30 border border-white/15 hover:bg-black/50 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {copiedAddr ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'vi' ? 'Đã sao chép địa chỉ!' : (lang === 'en' ? 'Copied Address!' : '已复制地址！')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Sao Chép Địa Chỉ' : (lang === 'en' ? 'Copy Address' : '复制地址')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3 border-t border-white/15 pt-4">
                <div className="flex items-start space-x-3 text-xs text-white/80">
                  <Car className="w-4 h-4 text-[#ffd778] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{lang === 'vi' ? 'Hỗ Trợ Đỗ Xe: ' : (lang === 'en' ? 'Parking: ' : '泊车：')}</strong>
                    {lang === 'vi'
                      ? 'Khách sạn có dịch vụ hỗ trợ đỗ xe (xe máy và ô tô) dưới tầng hầm'
                      : (lang === 'en'
                        ? 'Complimentary basement parking for motorbikes and cars.'
                        : '地下车库提供摩托车及汽车泊车服务。')}
                  </span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-white/80">
                  <Hotel className="w-4 h-4 text-[#ffd778] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{lang === 'vi' ? 'Thang Máy Lên Tầng 5A: ' : (lang === 'en' ? 'Elevator Access: ' : '电梯：')}</strong>
                    {lang === 'vi'
                      ? 'Hệ thống thang máy tốc độ cao dẫn trực tiếp lên sảnh IMPERIAL tại Tầng 5A.'
                      : (lang === 'en'
                        ? 'Direct elevator access to IMPERIAL Hall on Floor 5A.'
                        : '高速电梯直达 5A 层 IMPERIAL 宴会厅。')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. WEDDING PHOTO ALBUM SECTION ================= */}
      <section id="h5-gallery" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText}`}>
              {lang === 'vi' ? 'Album Ảnh Kỷ Niệm' : (lang === 'en' ? 'Memories in Bloom' : '记录爱的每个瞬间')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
            <p className="text-sm sm:text-base text-white/80 italic font-serif">
              {lang === 'vi'
                ? 'Từng khung hình lưu giữ những nụ cười, những chuyến đi và tình yêu đong đầy của chúng mình.'
                : (lang === 'en'
                  ? 'A glimpse into our cherished travels, quiet mornings, and favorite moments together.'
                  : '每一帧都收藏着微笑、旅程，以及我们满溢的爱。')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((photo, index) => {
              const title = lang === 'vi' ? photo.titleVi || photo.title : lang === 'zh' ? photo.titleZh || photo.title : photo.title;
              const caption = lang === 'vi' ? photo.captionVi || photo.caption : lang === 'zh' ? photo.captionZh || photo.caption : photo.caption;
              const location = lang === 'vi' ? photo.locationVi || photo.location : lang === 'zh' ? photo.locationZh || photo.location : photo.location;
              return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-xl aspect-[4/5] cursor-pointer text-left"
              >
                <img
                  src={photo.url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    {location && (
                      <span className="text-[11px] uppercase tracking-wider font-cinzel text-[#fae0a5] flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{location}</span>
                      </span>
                    )}
                    <h4 className="font-serif text-base sm:text-lg font-medium">{title}</h4>
                    <p className="text-xs text-white/80 line-clamp-2 mt-0.5">{caption}</p>
                  </div>
                </div>
              </button>
              );
            })}
          </div>
        </div>

        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrevPhoto();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNextPhoto();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-4xl max-h-[88vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[lightboxIndex].url}
                alt={lang === 'vi' ? gallery[lightboxIndex].titleVi || gallery[lightboxIndex].title : lang === 'zh' ? gallery[lightboxIndex].titleZh || gallery[lightboxIndex].title : gallery[lightboxIndex].title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="text-center mt-4 text-white max-w-lg px-4">
                <h4 className="font-serif text-xl sm:text-2xl font-medium">
                  {lang === 'vi' ? gallery[lightboxIndex].titleVi || gallery[lightboxIndex].title : lang === 'zh' ? gallery[lightboxIndex].titleZh || gallery[lightboxIndex].title : gallery[lightboxIndex].title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  {lang === 'vi' ? gallery[lightboxIndex].captionVi || gallery[lightboxIndex].caption : lang === 'zh' ? gallery[lightboxIndex].captionZh || gallery[lightboxIndex].caption : gallery[lightboxIndex].caption}
                </p>
                {(lang === 'vi' ? gallery[lightboxIndex].locationVi || gallery[lightboxIndex].location : lang === 'zh' ? gallery[lightboxIndex].locationZh || gallery[lightboxIndex].location : gallery[lightboxIndex].location) && (
                  <span className="inline-flex items-center space-x-1 text-[11px] text-[#fae0a5] font-cinzel mt-1 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    <span>{lang === 'vi' ? gallery[lightboxIndex].locationVi || gallery[lightboxIndex].location : lang === 'zh' ? gallery[lightboxIndex].locationZh || gallery[lightboxIndex].location : gallery[lightboxIndex].location}</span>
                  </span>
                )}
                <span className="block text-[11px] text-stone-400 mt-2">
                  {lightboxIndex + 1} / {gallery.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ================= 8. DRESS CODE & PALETTE SECTION ================= */}
      <section id="h5-dresscode" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              {lang === 'vi' ? 'Gợi Ý Trang Phục · Dress Code' : (lang === 'en' ? 'Dress Code & Attire' : '宾客着装 · 配色建议')}
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Bảng Màu Trang Phục Gợi Ý' : (lang === 'en' ? 'Wedding Color Palette' : '共赴浪漫 · 盛装出席')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
          </div>

          <div className={`${theme.cardBg} rounded-3xl p-6 sm:p-10 border shadow-2xl`}>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#ffd778] font-semibold block mb-1">
                {lang === 'vi' ? 'Bảng Màu Gợi Ý' : (lang === 'en' ? 'Color Inspiration' : '配色灵感')}
              </span>
              <p className="text-xs sm:text-sm text-white/75 mt-1 max-w-md mx-auto">
                {lang === 'vi'
                  ? 'Khách mời có thể lựa chọn trang phục theo các tone màu gợi ý dưới đây để có những bức ảnh kỷ niệm tuyệt đẹp nhất.'
                  : (lang === 'en'
                    ? 'Guests are warmly encouraged (though not required) to choose attire inspired by our palette.'
                    : '欢迎宾客参考以下色系着装，留下最美合影。')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {dressColors.map((c) => (
                <div
                  key={c.name}
                  className="flex flex-col items-center text-center p-3 rounded-2xl bg-black/30 border border-white/10"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-inner mb-3 border-2 border-white/30"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-serif text-sm font-medium text-white mb-0.5">
                    {lang === 'vi' ? c.nameVi || c.name : lang === 'zh' ? c.nameZh || c.name : c.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#fae0a5] tracking-wider mb-1">
                    {c.hex}
                  </span>
                  <span className="text-[11px] text-white/70 leading-tight">
                    {lang === 'vi' ? c.descriptionVi || c.description : lang === 'zh' ? c.descriptionZh || c.description : c.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 sm:p-6 flex items-start sm:items-center space-x-4 text-xs sm:text-sm text-white/85 bg-black/30 border border-[#ffd778]/30">
            <Sun className="w-5 h-5 text-[#ffd778] shrink-0 mt-0.5 sm:mt-0" />
            <p>
              {lang === 'vi'
                ? 'Sảnh tiệc IMPERIAL có máy lạnh mát mẻ. Quý khách vui lòng chuẩn bị trang phục vừa vặn thoải mái để tận hưởng trọn vẹn buổi tiệc.'
                : (lang === 'en'
                  ? 'IMPERIAL Hall is fully air-conditioned. Please dress comfortably to enjoy the evening celebration.'
                  : 'IMPERIAL 宴会厅冷气充足，请穿着合身舒适的服装，尽兴享受晚宴。')}
            </p>
          </div>
        </div>
      </section>

      {/* ================= 9. RED PACKET / GIFT SECTION ================= */}
      <section id="h5-redpacket" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              {lang === 'vi' ? 'Gửi Lời Chúc Phúc' : (lang === 'en' ? 'Wedding Red Packet' : '心意相赠 · 电子喜礼')}
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Mừng Cưới Online' : (lang === 'en' ? 'Send Cash Gift' : '添喜添福 · 随礼祈愿')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto my-3" />
          </div>

          <div className="bg-gradient-to-b from-[#b81d22] via-[#9e161a] to-[#780f12] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#f5d78e] text-center space-y-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#ffd778] to-[#d4af37] text-[#801215] mx-auto flex items-center justify-center text-4xl font-bold shadow-2xl border-2 border-white">
              囍
            </div>

            <div className="space-y-2.5 max-w-xl mx-auto">
              <h3 className="font-chinese text-2xl sm:text-3xl font-bold text-[#fae0a5]">
                {lang === 'vi' ? 'Phong Bao Đỏ Chúc Mừng Hạnh Phúc' : (lang === 'en' ? 'Digital Red Envelope' : '新人专属电子红包')}
              </h3>
              <p className="text-xs sm:text-sm text-[#fedcb0] leading-relaxed">
                {lang === 'vi'
                  ? 'Sự hiện diện và lời chúc phúc của quý khách là niềm vinh hạnh lớn nhất của chúng tôi. Quý khách có thể gửi lời chúc và mừng cưới online nhanh chóng tại đây.'
                  : (lang === 'en'
                  ? 'Your blessings and presence are our greatest treasure. If you wish to send a lucky red packet, tap below.'
                  : '各位亲朋好友的心意是给新人最珍贵的祝福，点击下方按钮即可送上吉利份子钱与心愿寄语。')}
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={onOpenRedPacket}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffd778] via-[#f7cb59] to-[#d4af37] text-[#6e0b0e] font-bold text-sm sm:text-base tracking-wider shadow-2xl hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2.5 animate-pulse cursor-pointer"
              >
                <span className="text-xl">🧧</span>
                <span>{lang === 'vi' ? 'Gửi Phong Bao Đỏ Mừng Cưới' : (lang === 'en' ? 'Open Red Packet / Send Gift' : '塞进红包 · 送上礼金')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. FAQ SECTION ================= */}
      <section id="h5-faq" className="w-full py-14 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#ffd778] font-cinzel font-semibold">
              FAQ
            </span>
            <h2 className={`${theme.titleFont} text-3xl sm:text-4xl font-bold ${theme.accentText} mt-1.5`}>
              {lang === 'vi' ? 'Thông Tin Cần Biết' : (lang === 'en' ? 'Frequently Asked Questions' : '宾客须知')}
            </h2>
            <div className="w-16 h-[1px] bg-[#ffd778]/40 mx-auto mt-3" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const question = lang === 'vi' ? faq.questionVi || faq.question : lang === 'zh' ? faq.questionZh || faq.question : faq.question;
              const answer = lang === 'vi' ? faq.answerVi || faq.answer : lang === 'zh' ? faq.answerZh || faq.answer : faq.answer;
              return (
                <div
                  key={faq.id}
                  className={`${theme.cardBg} rounded-2xl overflow-hidden border shadow-xl`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg text-white font-medium pr-4">
                      {question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-black/40 border border-[#ffd778]/40 flex items-center justify-center text-[#ffd778] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/10">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl p-6 sm:p-8 text-center bg-black/30 border border-[#ffd778]/30">
            <h4 className={`${theme.titleFont} text-xl text-white mb-1`}>
              {lang === 'vi' ? 'Quý Khách Cần Hỗ Trợ Thêm?' : (lang === 'en' ? 'Still Have Questions?' : '还有疑问？')}
            </h4>
            <p className="text-xs sm:text-sm text-white/75 mb-4">
              {lang === 'vi'
                ? 'Đừng ngần ngại liên hệ trực tiếp với cô dâu hoặc chú rể để được hỗ trợ chu đáo nhất.'
                : (lang === 'en'
                  ? 'Feel free to reach out to the couple anytime.'
                  : '欢迎随时联系新人，我们将悉心协助。')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#fae0a5]">
              <a
                href={couple.groomFacebook || 'https://www.facebook.com/hiepzg'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-black/40 px-3.5 py-1.5 rounded-full border border-[#ffd778]/40 hover:bg-black/60 transition"
              >
                <Facebook className="w-3.5 h-3.5 text-[#ffd778]" />
                <span>{lang === 'vi' ? 'Chú Rể: Facebook' : (lang === 'en' ? 'Groom: Facebook' : '新郎：Facebook')}</span>
              </a>
              <a
                href={couple.brideFacebook || 'https://www.facebook.com/dung.thuy.740804'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-black/40 px-3.5 py-1.5 rounded-full border border-[#ffd778]/40 hover:bg-black/60 transition"
              >
                <Facebook className="w-3.5 h-3.5 text-[#ffd778]" />
                <span>{lang === 'vi' ? 'Cô Dâu: Facebook' : (lang === 'en' ? 'Bride: Facebook' : '新娘：Facebook')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. FOOTER (same structure as scroll layout) ================= */}
      <footer className="bg-[#261f1a] text-[#ded3c7] pt-16 pb-28 px-4 sm:px-6 border-t border-[#3d332c] relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-full border border-[#8a705a] mx-auto flex items-center justify-center text-sm font-cinzel font-semibold tracking-widest text-[#f5ebd9] bg-[#332a23]">
            H&D
          </div>

          <div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#f5ede4] tracking-wide font-normal">
              {brideDisplayName} & {groomDisplayName}
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#b49880] mt-1">
              {dateFormattedText} • {venueCityText}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#b8aba0] italic font-serif max-w-md mx-auto">
            {lang === 'vi'
              ? '“Chân thành cảm ơn sự hiện diện và những lời chúc phúc của quý khách. Chúng tôi vô cùng trân quý và háo hức được đón tiếp mọi người.”'
              : lang === 'zh'
              ? '“感谢您见证我们爱情长跑中最重要的时刻。期待在婚礼当天与您相聚分享喜悦。”'
              : '“Thank you for being an indispensable part of our story. We cannot wait to celebrate with each and every one of you.”'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs uppercase font-cinzel tracking-wider text-[#a8998d]">
            <a href="#h5-schedule" className="hover:text-white transition">
              {lang === 'vi' ? 'Lịch Trình' : lang === 'zh' ? '流程' : 'Schedule'}
            </a>
            <span>•</span>
            <a href="#h5-venue" className="hover:text-white transition">
              {lang === 'vi' ? 'Địa Điểm' : lang === 'zh' ? '酒店' : 'Venue & Stay'}
            </a>
            <span>•</span>
            <a href="#h5-gallery" className="hover:text-white transition">
              {lang === 'vi' ? 'Album Ảnh' : lang === 'zh' ? '相册' : 'Gallery'}
            </a>
            <span>•</span>
            <button type="button" onClick={onOpenEnvelope} className="hover:text-white transition cursor-pointer">
              {lang === 'vi' ? 'MỞ PHONG BÌ' : lang === 'zh' ? '专属请柬' : 'Wax Seal Invite'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-2">
            {([
              { id: 'vi' as const, label: 'VI' },
              { id: 'zh' as const, label: '中文' },
              { id: 'en' as const, label: 'EN' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeLang(opt.id)}
                className={`min-w-11 px-3 py-1 rounded-full text-[11px] font-cinzel tracking-wider transition cursor-pointer ${
                  lang === opt.id
                    ? 'bg-[#8a705a] text-[#f5ebd9] border border-[#c4a88f]'
                    : 'text-[#a8998d] border border-[#3d3229] hover:text-white hover:border-[#8a705a]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[#3d3229] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7b6f]">
            <span>
              {lang === 'vi'
                ? 'Thiệp cưới của Thùy Dung & Thanh Hiệp'
                : lang === 'zh'
                ? '垂蓉与清协的婚礼请柬'
                : `Made with love for ${brideDisplayName} & ${groomDisplayName}'s Wedding`}
            </span>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center space-x-1 text-[#ded3c7] hover:text-white transition cursor-pointer"
              >
                <span>{lang === 'vi' ? 'Lên Đầu Trang' : lang === 'zh' ? '返回顶部' : 'Back to Top'}</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= FIXED BOTTOM ACTION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#16120f]/95 backdrop-blur-md border-t border-[#47362a] py-2.5 px-4 text-white shadow-2xl">
        <div className="max-w-xl mx-auto flex items-center justify-around text-xs">
          <button
            onClick={onOpenCallModal}
            className="flex flex-col items-center space-y-0.5 text-[#ffd778] hover:scale-105 transition cursor-pointer"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px]">{lang === 'vi' ? 'Liên Hệ' : (lang === 'en' ? 'Contact' : '联系')}</span>
          </button>

          <button
            onClick={onOpenNavModal}
            className="flex flex-col items-center space-y-0.5 text-[#ffd778] hover:scale-105 transition cursor-pointer"
          >
            <NavIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px]">{lang === 'vi' ? 'Chỉ Đường' : (lang === 'en' ? 'Map' : '一键导航')}</span>
          </button>

          <button
            onClick={onOpenEnvelope}
            className="flex flex-col items-center space-y-0.5 text-[#ffd778] hover:scale-105 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px]">{lang === 'vi' ? 'Mở Thiệp' : (lang === 'en' ? 'Invite' : '专属请柬')}</span>
          </button>

          <button
            onClick={onOpenRedPacket}
            className="flex flex-col items-center space-y-0.5 text-[#ffd778] hover:scale-105 transition cursor-pointer"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px]">{lang === 'vi' ? 'Mừng Cưới' : (lang === 'en' ? 'Gift' : '送礼金')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
