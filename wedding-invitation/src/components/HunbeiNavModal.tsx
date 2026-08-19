import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink } from 'lucide-react';
import { CoupleInfo, LanguageMode } from '../types';
import { AppleLogo } from './AppleLogo';

interface HunbeiNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  lang?: LanguageMode;
}

export const HunbeiNavModal: React.FC<HunbeiNavModalProps> = ({
  isOpen,
  onClose,
  couple,
  lang = 'vi',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const venueName = lang === 'vi' ? couple.venueNameVi || couple.venueName : lang === 'zh' ? couple.venueNameZh || couple.venueName : couple.venueName;
  const venueAddress = lang === 'vi' ? couple.venueAddressVi || couple.venueAddress : lang === 'zh' ? couple.venueAddressZh || couple.venueAddress : couple.venueAddress;

  const handleCopy = () => {
    const fullAddress = `${venueName}, ${venueAddress}, ${couple.venueCity}`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedAddress = encodeURIComponent(`${couple.venueName}, ${couple.venueAddress}, ${couple.venueCity}`);

  const titleText = lang === 'vi' ? 'Chỉ Đường Đến Nhà Hàng' : lang === 'zh' ? '一键导航 · 前往婚礼酒店' : 'One-Click Navigation';
  const chooseAppText = lang === 'vi' ? 'Chọn ứng dụng bản đồ dẫn đường:' : lang === 'zh' ? '选择地图导航应用：' : 'Open in Navigation App:';
  const copyBtnText = copied
    ? (lang === 'vi' ? 'Đã sao chép địa chỉ!' : lang === 'zh' ? '地址已复制到剪贴板' : 'Address Copied!')
    : (lang === 'vi' ? 'Sao chép địa chỉ chi tiết' : lang === 'zh' ? '复制详细地址' : 'Copy Full Address');
  const closeText = lang === 'vi' ? 'Hủy / Đóng' : lang === 'zh' ? '取消' : 'Cancel';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#221b16] border border-[#c4a480]/50 rounded-3xl p-6 text-[#f5ebd9] shadow-2xl animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#3b2d24] mb-4">
          <div className="flex items-center space-x-2 text-base font-semibold text-[#ffd778]">
            <Navigation className="w-4 h-4 text-[#ffd778]" />
            <span>{titleText}</span>
          </div>
          <button onClick={onClose} className="text-[#998] hover:text-white p-1">
            ✕
          </button>
        </div>

        {/* Venue Info Card */}
        <div className="p-4 rounded-2xl bg-[#2e241e] border border-[#4a392d] space-y-2 mb-4">
          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-[#ffd778] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {venueName}
              </h4>
              <p className="text-xs text-[#c4b3a3] mt-1 leading-relaxed">
                {venueAddress}, {couple.venueCity}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-1.5 rounded-xl bg-[#3d3026] text-xs text-[#ffd778] hover:bg-[#4d3d30] flex items-center justify-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            <span>{copyBtnText}</span>
          </button>
        </div>

        {/* Map App Choices */}
        <div className="space-y-2.5">
          <span className="text-[11px] text-[#a69280] font-medium block">
            {chooseAppText}
          </span>

          <a
            href={couple.venueMapUrl || 'https://maps.app.goo.gl/ZVYe1nAELmTukXBL9'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#2e241e] hover:bg-[#3d3026] border border-[#4a392d] flex items-center justify-between text-xs font-semibold text-white transition hover:border-[#ffd778]/40 shadow-sm"
          >
            <div className="flex items-center space-x-2.5">
              <MapPin className="h-[18px] w-[18px] shrink-0 text-white" />
              <span className="text-sm">Google Maps</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#ffd778]" />
          </a>

          <a
            href={couple.venueAppleMapUrl || 'https://maps.apple.com/place?place-id=I58FBBA16B0C03C6A'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#2e241e] hover:bg-[#3d3026] border border-[#4a392d] flex items-center justify-between text-xs font-semibold text-white transition hover:border-[#ffd778]/40 shadow-sm"
          >
            <div className="flex items-center space-x-2.5">
              <AppleLogo className="h-[18px] w-[18px] shrink-0" />
              <span className="text-sm">Apple Maps</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#ffd778]" />
          </a>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#362a22] text-[#e0d3c5] text-xs hover:bg-[#45362c]"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};
