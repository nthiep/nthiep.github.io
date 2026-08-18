import React, { useState } from 'react';
import { Facebook, Copy, Check } from 'lucide-react';
import { CoupleInfo, LanguageMode } from '../types';

interface HunbeiCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  lang?: LanguageMode;
}

export const HunbeiCallModal: React.FC<HunbeiCallModalProps> = ({
  isOpen,
  onClose,
  couple,
  lang = 'vi',
}) => {
  const [copiedPerson, setCopiedPerson] = useState<string | null>(null);

  if (!isOpen) return null;

  const groomFacebook = couple.groomFacebook || 'https://www.facebook.com/hiepzg';
  const brideFacebook = couple.brideFacebook || 'https://www.facebook.com/dung.thuy.740804';

  const facebookHandle = (url: string) => url.replace(/^https?:\/\/(www\.)?facebook\.com\//i, '');

  const handleCopy = (url: string, person: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPerson(person);
    setTimeout(() => setCopiedPerson(null), 2000);
  };

  const groomDisplayName = lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomName;
  const brideDisplayName = lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideName;

  const titleText = lang === 'vi' ? 'Liên Hệ Cô Dâu & Chú Rể' : lang === 'zh' ? '联系新人 · Facebook' : 'Contact the Couple';
  const groomLabel = lang === 'vi' ? 'Chú Rể' : lang === 'zh' ? '新郎' : 'The Groom';
  const brideLabel = lang === 'vi' ? 'Cô Dâu' : lang === 'zh' ? '新娘' : 'The Bride';
  const facebookText = 'Facebook';
  const copyText = lang === 'vi' ? 'Sao chép' : lang === 'zh' ? '复制' : 'Copy';
  const copiedText = lang === 'vi' ? 'Đã sao chép' : lang === 'zh' ? '已复制' : 'Copied';
  const closeText = lang === 'vi' ? 'Đóng' : lang === 'zh' ? '关闭' : 'Close';

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
            <Facebook className="w-4 h-4 text-[#ffd778]" />
            <span>{titleText}</span>
          </div>
          <button onClick={onClose} className="text-[#998] hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#2e241e] border border-[#4a392d] flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={couple.groomImage}
                alt="Groom"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="text-xs text-[#a69280] font-medium">{groomLabel}</div>
                <div className="text-sm font-bold text-white truncate">{groomDisplayName}</div>
                <div className="text-xs text-[#ffd778] truncate">{facebookHandle(groomFacebook)}</div>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 shrink-0 ml-3">
              <a
                href={groomFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-linear-to-r from-[#d4af37] to-[#ffd778] text-[#3b2005] text-xs font-bold flex items-center space-x-1 hover:brightness-110 shadow-xs"
              >
                <Facebook className="w-3 h-3" />
                <span>{facebookText}</span>
              </a>
              <button
                onClick={() => handleCopy(groomFacebook, 'groom')}
                className="px-2 py-0.5 rounded-lg bg-[#3d3026] text-[11px] text-[#ddd] hover:text-white flex items-center justify-center space-x-1"
              >
                {copiedPerson === 'groom' ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedPerson === 'groom' ? copiedText : copyText}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#2e241e] border border-[#4a392d] flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={couple.brideImage}
                alt="Bride"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="text-xs text-[#a69280] font-medium">{brideLabel}</div>
                <div className="text-sm font-bold text-white truncate">{brideDisplayName}</div>
                <div className="text-xs text-[#ffd778] truncate">{facebookHandle(brideFacebook)}</div>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 shrink-0 ml-3">
              <a
                href={brideFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-linear-to-r from-[#d4af37] to-[#ffd778] text-[#3b2005] text-xs font-bold flex items-center space-x-1 hover:brightness-110 shadow-xs"
              >
                <Facebook className="w-3 h-3" />
                <span>{facebookText}</span>
              </a>
              <button
                onClick={() => handleCopy(brideFacebook, 'bride')}
                className="px-2 py-0.5 rounded-lg bg-[#3d3026] text-[11px] text-[#ddd] hover:text-white flex items-center justify-center space-x-1"
              >
                {copiedPerson === 'bride' ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedPerson === 'bride' ? copiedText : copyText}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
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
