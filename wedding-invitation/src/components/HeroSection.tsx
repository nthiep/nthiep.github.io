import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, MapPin, Download, Check, Sparkles, ChevronDown } from 'lucide-react';
import { CoupleInfo, LanguageMode } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface HeroSectionProps {
  couple: CoupleInfo;
  onOpenEnvelope: () => void;
  lang?: LanguageMode;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  couple,
  onOpenEnvelope,
  lang = 'vi',
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [copiedDate, setCopiedDate] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(couple.weddingDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [couple.weddingDate]);

  const handleCopyDate = () => {
    navigator.clipboard.writeText(
      `${couple.brideName} & ${couple.groomName} Wedding - ${couple.weddingDateFormatted} at ${couple.venueName}`
    );
    setCopiedDate(true);
    setTimeout(() => setCopiedDate(false), 2000);
  };

  const groomName = lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomName;
  const brideName = lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideName;
  const dateFormatted = lang === 'vi' ? couple.weddingDateFormattedVi || couple.weddingDateFormatted : lang === 'zh' ? couple.weddingDateFormattedZh || couple.weddingDateFormatted : couple.weddingDateFormatted;
  const lunarDate = lang === 'vi' ? couple.lunarDateVi : lang === 'zh' ? couple.lunarDateZh : null;
  const venueName = lang === 'vi' ? couple.venueNameVi || couple.venueName : lang === 'zh' ? couple.venueNameZh || couple.venueName : couple.venueName;
  const venueAddress = lang === 'vi' ? couple.venueAddressVi || couple.venueAddress : lang === 'zh' ? couple.venueAddressZh || couple.venueAddress : couple.venueAddress;
  const quoteText = lang === 'vi' ? (couple.coupleQuoteVi || couple.coupleQuote) : lang === 'zh' ? (couple.coupleQuoteZh || couple.coupleQuote) : couple.coupleQuote;
  const headerQuote = lang === 'vi' ? (couple.headerQuoteVi || 'Lễ Báo Hỷ • Trân Trọng Kính Mời') : lang === 'zh' ? (couple.headerQuoteZh || '喜结良缘 • 婚礼邀请函') : 'Save The Date • Wedding Celebration';

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-[#faf7f2]"
    >
      <div className="absolute inset-0 bg-radial from-[#ffffff]/70 via-[#faf7f2]/90 to-[#f2ede4] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#f2e7dc] border border-[#ddcdbf] text-[#6e5039] text-xs uppercase tracking-[0.22em] font-cinzel font-medium mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#a8744f]" />
          <span>{`“ ${headerQuote} ”`}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-4"
        >
          <div className="font-signature text-5xl sm:text-7xl md:text-8xl text-[#2d221a] tracking-tight leading-[1.1] mb-2 select-none">
            <span>{couple.groomLastNameEn || groomName}</span>
            <span className="text-3xl sm:text-5xl text-[#9c6843] mx-3">&</span>
            <span>{couple.brideLastNameEn || brideName}</span>
          </div>
          <div className="font-serif text-sm sm:text-base text-[#6b5849] tracking-[0.15em] mt-1">
            {lang === 'vi' ? 'Chú Rể' : lang === 'zh' ? '新郎' : 'Groom'} ｜ {groomName} &nbsp;&nbsp;•&nbsp;&nbsp; {lang === 'vi' ? 'Cô Dâu' : lang === 'zh' ? '新娘' : 'Bride'} ｜ {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl mx-auto space-y-2 mb-8"
        >
          <p className="text-sm sm:text-base text-[#6b5849] italic font-serif leading-relaxed">
            {quoteText}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm text-[#4d3c30] font-medium tracking-wide">
            <span className="inline-flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-[#a8744f]" />
              <strong className="font-semibold">{dateFormatted}</strong>
              {lunarDate && <span className="text-xs text-[#8c7460]">({lunarDate})</span>}
            </span>
            <span className="text-[#c9b7a7] hidden sm:inline">•</span>
            <a
              href="#venue"
              className="inline-flex items-center space-x-1.5 text-[#5e4b3d] hover:text-[#2d221a] transition underline decoration-[#cbb5a2] underline-offset-4"
            >
              <MapPin className="w-4 h-4 text-[#a8744f]" />
              <span>{venueName}, {venueAddress}</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="max-w-lg mx-auto bg-white/90 backdrop-blur-xs border border-[#ebdcd0] rounded-2xl p-4 sm:p-6 shadow-sm mb-9"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] block mb-3 font-semibold">
            {timeLeft.isPast
              ? (lang === 'vi' ? 'Đã Đến Ngày Vui Của Chúng Mình' : 'Celebrating Our New Chapter')
              : (lang === 'vi' ? 'Đếm Ngược Tới Ngày Lễ Báo Hỷ' : 'Counting Down To Forever')}
          </span>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="bg-[#faf6f0] border border-[#eee4d8] rounded-xl p-2.5 sm:p-3.5">
              <span className="block text-2xl sm:text-4xl font-serif font-semibold text-[#3d2e24]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-wider text-[#8b796d]">
                {lang === 'vi' ? 'Ngày' : 'Days'}
              </span>
            </div>

            <div className="bg-[#faf6f0] border border-[#eee4d8] rounded-xl p-2.5 sm:p-3.5">
              <span className="block text-2xl sm:text-4xl font-serif font-semibold text-[#3d2e24]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-wider text-[#8b796d]">
                {lang === 'vi' ? 'Giờ' : 'Hours'}
              </span>
            </div>

            <div className="bg-[#faf6f0] border border-[#eee4d8] rounded-xl p-2.5 sm:p-3.5">
              <span className="block text-2xl sm:text-4xl font-serif font-semibold text-[#3d2e24]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-wider text-[#8b796d]">
                {lang === 'vi' ? 'Phút' : 'Mins'}
              </span>
            </div>

            <div className="bg-[#faf6f0] border border-[#eee4d8] rounded-xl p-2.5 sm:p-3.5">
              <span className="block text-2xl sm:text-4xl font-serif font-semibold text-[#9c6843]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-wider text-[#8b796d]">
                {lang === 'vi' ? 'Giây' : 'Secs'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative"
        >
          <button
            id="hero-open-envelope-btn"
            onClick={onOpenEnvelope}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase font-cinzel font-bold tracking-[0.2em] text-white bg-[#4a3525] hover:bg-[#342418] transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffd778]" />
            <span>{lang === 'vi' ? 'Mở Bức Thư Báo Hỷ' : lang === 'zh' ? '开启专属请柬' : 'Open Wax-Seal Invitation'}</span>
          </button>

          <div className="relative w-full sm:w-auto">
            <button
              id="hero-calendar-dropdown-btn"
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full text-xs uppercase font-cinzel font-medium tracking-wider text-[#635144] bg-white hover:bg-[#faf7f2] border border-[#e2d5c7] transition flex items-center justify-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8c6b4e]" />
              <span>{lang === 'vi' ? 'Thêm Vào Lịch' : lang === 'zh' ? '添加至日历' : 'Add to Calendar'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${calendarOpen ? 'rotate-180' : ''}`} />
            </button>

            {calendarOpen && (
              <div
                id="calendar-dropdown-menu"
                className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-56 bg-white border border-[#e5d8cb] rounded-xl shadow-xl p-2 z-30 text-left"
              >
                <a
                  href={generateGoogleCalendarUrl(couple)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalendarOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 text-xs text-[#423429] hover:bg-[#f6efe8] rounded-lg transition"
                >
                  <Calendar className="w-4 h-4 text-[#4285F4]" />
                  <span>Google Calendar</span>
                </a>

                <button
                  onClick={() => {
                    downloadIcsFile(couple);
                    setCalendarOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#423429] hover:bg-[#f6efe8] rounded-lg transition text-left"
                >
                  <Download className="w-4 h-4 text-[#34A853]" />
                  <span>Apple iCal / Outlook (.ics)</span>
                </button>

                <button
                  onClick={() => {
                    handleCopyDate();
                    setCalendarOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#423429] hover:bg-[#f6efe8] rounded-lg transition text-left border-t border-[#f0e6dc] mt-1 pt-2"
                >
                  {copiedDate ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4 text-[#8c6b4e]" />}
                  <span>{copiedDate ? (lang === 'vi' ? 'Đã sao chép!' : 'Details Copied!') : (lang === 'vi' ? 'Sao chép thông tin' : 'Copy Event Summary')}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />
    </section>
  );
};
