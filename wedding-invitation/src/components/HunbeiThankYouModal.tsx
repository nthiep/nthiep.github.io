import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleInfo, LanguageMode } from '../types';

interface HunbeiThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  lang?: LanguageMode;
}

interface BurstHeart {
  id: number;
  dx: number;
  rot: number;
  delay: number;
  size: number;
  left: string;
  top: string;
}

export const HunbeiThankYouModal: React.FC<HunbeiThankYouModalProps> = ({
  isOpen,
  onClose,
  couple,
  lang = 'vi',
}) => {
  const [closing, setClosing] = useState(false);
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      setBurstHearts([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const titleText =
    lang === 'vi' ? 'Tiệc Báo Hỷ đã được tổ chức' : lang === 'zh' ? '喜宴圆满举办' : 'The Celebration Is Complete';
  const bodyText =
    lang === 'vi'
      ? 'Tiệc Báo Hỷ đã được tổ chức thành công tốt đẹp. Cảm ơn quý khách đã đến tham dự và gửi lời chúc phúc đến gia đình chúng tôi.'
      : lang === 'zh'
      ? '喜宴已圆满举办。衷心感谢各位亲朋好友莅临见证，并送上真诚祝福。'
      : 'The wedding celebration was held successfully. Thank you for attending and sharing your blessings with our family.';
  const closeText = lang === 'vi' ? 'Xin cảm ơn' : lang === 'zh' ? '谢谢' : 'Thank you';
  const groomName = lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomLastNameEn || couple.groomName;
  const brideName = lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideLastNameEn || couple.brideName;

  const fireThanksConfetti = (origin: { x: number; y: number }) => {
    const colors = ['#ffd778', '#d4af37', '#b81d22', '#f5ebd9', '#ffffff', '#ff8fab'];
    const base = {
      origin,
      colors,
      zIndex: 9999,
      gravity: 0.85,
      decay: 0.9,
      ticks: 260,
    };

    confetti({
      ...base,
      particleCount: 55,
      spread: 80,
      startVelocity: 38,
      shapes: ['star', 'circle'],
      scalar: 1,
    });
    confetti({
      ...base,
      particleCount: 36,
      angle: 60,
      spread: 55,
      startVelocity: 42,
      origin: { x: Math.max(0.12, origin.x - 0.18), y: origin.y },
      shapes: ['star', 'square'],
      scalar: 0.9,
    });
    confetti({
      ...base,
      particleCount: 36,
      angle: 120,
      spread: 55,
      startVelocity: 42,
      origin: { x: Math.min(0.88, origin.x + 0.18), y: origin.y },
      shapes: ['star', 'square'],
      scalar: 0.9,
    });
  };

  const handleThanks = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (closing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    setBurstHearts(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 240,
        rot: (Math.random() - 0.5) * 70,
        delay: Math.random() * 0.16,
        size: 14 + Math.random() * 18,
        left: `${origin.x * 100}%`,
        top: `${origin.y * 100}%`,
      })),
    );

    try {
      fireThanksConfetti(origin);
    } catch (err) {
      console.error(err);
    }

    setClosing(true);
    window.setTimeout(onClose, 1100);
  };

  const handleDismiss = () => {
    if (closing) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleDismiss}
    >
      {burstHearts.map((heart) => (
        <span
          key={heart.id}
          className="thanks-heart z-[60]"
          style={{
            left: heart.left,
            top: heart.top,
            bottom: 'auto',
            fontSize: heart.size,
            animationDelay: `${heart.delay}s`,
            ['--dx']: `${heart.dx}px`,
            ['--rot']: `${heart.rot}deg`,
          } as React.CSSProperties}
        >
          ♥
        </span>
      ))}

      <div
        className={`relative w-full max-w-sm bg-[#221b16] border border-[#c4a480]/50 rounded-3xl p-6 text-[#f5ebd9] shadow-2xl transition-all duration-500 ${
          closing ? 'scale-90 opacity-0' : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#3b2d24] mb-5">
          <div className="flex items-center space-x-2 text-base font-semibold text-[#ffd778]">
            <Heart className="w-4 h-4 text-[#ffd778] fill-[#ffd778]" />
            <span>{titleText}</span>
          </div>
          <button type="button" onClick={handleDismiss} className="text-[#998] hover:text-white p-1" aria-label={closeText}>
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-5">
          <img
            src={couple.groomImage}
            alt={groomName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37]"
          />
          <Heart className="w-4 h-4 text-[#ffd778] fill-[#ffd778] shrink-0" />
          <img
            src={couple.brideImage}
            alt={brideName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37]"
          />
        </div>

        <p className="text-sm leading-relaxed text-center text-[#e8dccf]">
          {bodyText}
        </p>

        <p className="mt-4 text-center font-signature text-2xl text-[#ffd778]">
          {couple.signatureText || `${groomName} & ${brideName}`}
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleThanks}
            disabled={closing}
            className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#d4af37] to-[#ffd778] text-[#3b2005] text-sm font-semibold hover:brightness-110 active:scale-95 transition-transform duration-150 disabled:opacity-80"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};
