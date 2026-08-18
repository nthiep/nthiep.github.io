import React from 'react';
import { Heart, ArrowUp, Sparkles } from 'lucide-react';
import { CoupleInfo, LanguageMode } from '../types';

interface FooterProps {
  couple: CoupleInfo;
  onOpenEnvelope: () => void;
  onChangeLang: (lang: LanguageMode) => void;
  lang?: LanguageMode;
}

export const Footer: React.FC<FooterProps> = ({
  couple,
  onOpenEnvelope,
  onChangeLang,
  lang = 'vi',
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brideDisplayName = lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideName;
  const groomDisplayName = lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomName;
  const weddingDateStr = lang === 'vi' ? couple.weddingDateFormattedVi || couple.weddingDateFormatted : lang === 'zh' ? couple.weddingDateFormattedZh || couple.weddingDateFormatted : couple.weddingDateFormatted;

  const getMonogram = () => 'H&D';

  const footerQuote = lang === 'vi'
    ? '“Chân thành cảm ơn sự hiện diện và những lời chúc phúc của quý khách. Chúng tôi vô cùng trân quý và háo hức được đón tiếp mọi người.”'
    : lang === 'zh'
    ? '“感谢您见证我们爱情长跑中最重要的时刻。期待在婚礼当天与您相聚分享喜悦。”'
    : '“Thank you for being an indispensable part of our story. We cannot wait to celebrate with each and every one of you.”';

  return (
    <footer className="bg-[#261f1a] text-[#ded3c7] pt-16 pb-28 md:pb-16 px-4 sm:px-6 border-t border-[#3d332c] relative">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Monogram Crest */}
        <div className="w-14 h-14 rounded-full border border-[#8a705a] mx-auto flex items-center justify-center text-sm font-cinzel font-semibold tracking-widest text-[#f5ebd9] bg-[#332a23]">
          {getMonogram()}
        </div>

        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f5ede4] tracking-wide font-normal">
            {brideDisplayName} & {groomDisplayName}
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#b49880] mt-1">
            {weddingDateStr} • {lang === 'vi' ? couple.venueCity : lang === 'zh' ? '胡志明市' : 'Ho Chi Minh City'}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[#b8aba0] italic font-serif max-w-md mx-auto">
          {footerQuote}
        </p>

        {/* Quick Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs uppercase font-cinzel tracking-wider text-[#a8998d]">
          <a href="#schedule" className="hover:text-white transition">
            {lang === 'vi' ? 'Lịch Trình' : lang === 'zh' ? '流程' : 'Schedule'}
          </a>
          <span>•</span>
          <a href="#venue" className="hover:text-white transition">
            {lang === 'vi' ? 'Địa Điểm' : lang === 'zh' ? '酒店' : 'Venue & Stay'}
          </a>
          <span>•</span>
          <a href="#gallery" className="hover:text-white transition">
            {lang === 'vi' ? 'Album Ảnh' : lang === 'zh' ? '相册' : 'Gallery'}
          </a>
          <span>•</span>
          <button onClick={onOpenEnvelope} className="hover:text-white transition cursor-pointer">
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

        {/* Back to Top */}
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
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 text-[#ded3c7] hover:text-white transition"
            >
              <span>{lang === 'vi' ? 'Lên Đầu Trang' : lang === 'zh' ? '返回顶部' : 'Back to Top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
