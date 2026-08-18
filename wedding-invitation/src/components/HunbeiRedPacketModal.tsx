import React, { useState } from 'react';
import { Heart, Check, Copy, Sparkles, QrCode, Download, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleInfo, LanguageMode } from '../types';

interface HunbeiRedPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  lang?: LanguageMode;
  onSendWish?: (name: string, message: string) => void;
}

export const HunbeiRedPacketModal: React.FC<HunbeiRedPacketModalProps> = ({
  isOpen,
  onClose,
  couple,
  lang = 'vi',
}) => {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCompleteGift = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff4d4f', '#faad14', '#f5222d'],
    });
    setShowThankYou(true);
  };

  const groomName = lang === 'vi' ? (couple.groomNameVi || couple.groomName) : lang === 'zh' ? (couple.groomNameZh || couple.groomName) : couple.groomName;
  const brideName = lang === 'vi' ? (couple.brideNameVi || couple.brideName) : lang === 'zh' ? (couple.brideNameZh || couple.brideName) : couple.brideName;

  // Bank Account Profiles
  const groomBank = {
    owner: groomName,
    ownerZh: couple.groomNameZh || '阮清协',
    bankName: 'Techcombank',
    bankShort: 'TCB',
    accountNumber: '19038888999966',
    accountDisplay: '1903 8888 9999 66',
    qrUrl: 'https://api.vietqr.io/image/970407-19038888999966-compact2.jpg?accountName=NGUYEN%20THANH%20HIEP&addInfo=Mung%20Cuoi%20Hiep%20Dung',
    memo: `Mung cuoi ${groomName.split(' ').pop()}`,
  };

  const brideBank = {
    owner: brideName,
    ownerZh: couple.brideNameZh || '吴氏垂容',
    bankName: 'Vietcombank',
    bankShort: 'VCB',
    accountNumber: '998877665544',
    accountDisplay: '9988 7766 5544',
    qrUrl: 'https://api.vietqr.io/image/970436-998877665544-compact2.jpg?accountName=NGO%20THI%20THUY%20DUNG&addInfo=Mung%20Cuoi%20Thuy%20Dung',
    memo: `Mung cuoi ${brideName.split(' ').pop()}`,
  };

  const currentBank = activeTab === 'groom' ? groomBank : brideBank;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-gradient-to-b from-[#b81d22] via-[#9e161a] to-[#780f12] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#f5d78e] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Motifs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border-4 border-[#f5d78e]/20 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full border-4 border-[#f5d78e]/15 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#fae0a5] hover:text-white bg-black/25 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        {!showThankYou ? (
          <div className="space-y-4 text-center">
            {/* Header */}
            <div className="pt-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-b from-[#ffd778] to-[#d4af37] text-[#851215] flex items-center justify-center text-xl font-bold shadow-lg border border-[#fff2b2] mb-2">
                囍
              </div>
              <h3 className="font-chinese text-2xl font-bold text-[#fae0a5] tracking-wider">
                {lang === 'vi' ? 'Mừng Cưới Online' : (lang === 'en' ? 'Wedding Cash Gift' : '电子喜礼 · 扫码随礼')}
              </h3>
              <p className="text-xs text-[#fedcb0] mt-0.5 font-serif">
                {groomName} & {brideName}
              </p>
            </div>

            {/* Groom / Bride Tabs */}
            <div className="flex bg-[#680b0e] p-1 rounded-2xl border border-[#e5a95d]/50 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setActiveTab('groom')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'groom'
                    ? 'bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#6e0b0e] shadow-md font-bold'
                    : 'text-[#fdecd2] hover:text-white'
                }`}
              >
                {lang === 'vi' ? 'Chú Rể' : lang === 'en' ? 'Groom' : '新郎'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bride')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'bride'
                    ? 'bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#6e0b0e] shadow-md font-bold'
                    : 'text-[#fdecd2] hover:text-white'
                }`}
              >
                {lang === 'vi' ? 'Cô Dâu' : lang === 'en' ? 'Bride' : '新娘'}
              </button>
            </div>

            {/* QR Code Card Display */}
            <div className="bg-white p-4 rounded-2xl max-w-[260px] mx-auto shadow-2xl text-slate-800 space-y-2 border-2 border-[#f5d78e]">
              <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 aspect-square flex items-center justify-center p-1">
                <img
                  src={currentBank.qrUrl}
                  alt={`QR Mừng Cưới - ${currentBank.owner}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to QR server if VietQR image is temporarily unavailable
                    (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`STK: ${currentBank.accountNumber} - ${currentBank.bankName} - ${currentBank.owner}`)}`;
                  }}
                />
              </div>

              <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 pt-0.5">
                <QrCode className="w-3.5 h-3.5 text-[#961c1e]" />
                <span>{lang === 'vi' ? `Quét mã QR chuyển khoản ${currentBank.bankName}` : lang === 'en' ? `Scan QR to transfer via ${currentBank.bankName}` : `扫码转账 / ${currentBank.bankName}`}</span>
              </div>
            </div>

            {/* Bank Info Card with 1-Click Copy */}
            <div className="bg-[#6b0d10]/95 p-3.5 rounded-2xl text-left text-xs space-y-2 border border-[#d48c48]/50 shadow-inner">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#fce4b8]">{lang === 'vi' ? 'Chủ tài khoản:' : lang === 'en' ? 'Account name:' : '开户姓名:'}</span>
                <span className="font-semibold text-white tracking-wide">{currentBank.owner}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#fce4b8]">{lang === 'vi' ? 'Ngân hàng:' : lang === 'en' ? 'Bank:' : '开户银行:'}</span>
                <span className="font-semibold text-[#ffd778]">{currentBank.bankName}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                <span className="text-[#fce4b8]">{lang === 'vi' ? 'Số tài khoản:' : lang === 'en' ? 'Account number:' : '银行账号:'}</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-white font-mono font-bold tracking-wider">{currentBank.accountDisplay}</span>
                  <button
                    onClick={() => handleCopy(currentBank.accountNumber, 'account')}
                    className="p-1 rounded-md bg-[#8f1519] hover:bg-[#a61c21] text-[#ffd778] transition cursor-pointer"
                    title={lang === 'vi' ? 'Sao chép số tài khoản' : lang === 'en' ? 'Copy' : '复制账号'}
                  >
                    {copiedField === 'account' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(currentBank.accountNumber, 'account')}
                className="flex-1 py-2.5 rounded-xl bg-black/40 border border-[#ffd778]/50 text-[#fae0a5] hover:bg-black/60 text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {copiedField === 'account' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'vi' ? 'Đã chép STK' : lang === 'en' ? 'Copied' : '已复制'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Sao Chép STK' : lang === 'en' ? 'Copy Account' : '复制账号'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCompleteGift}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#6e0b0e] font-bold text-xs tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6e0b0e]" />
                <span>{lang === 'vi' ? 'Đã Chuyển Khoản' : lang === 'en' ? 'I’ve Sent the Gift' : '已完成送礼'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Thank You Screen */
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ffd778] to-[#d4af37] text-[#801215] mx-auto flex items-center justify-center text-3xl shadow-xl animate-bounce">
              <Sparkles className="w-8 h-8 text-[#801215]" />
            </div>

            <div>
              <h3 className="font-chinese text-2xl font-bold text-[#fae0a5]">
                {lang === 'vi' ? 'Cảm Ơn Tấm Lòng Của Quý Khách!' : (lang === 'en' ? 'Thank You So Much!' : '新人由衷致谢！')}
              </h3>
              <p className="text-xs text-[#fedcb0] mt-2 max-w-xs mx-auto leading-relaxed">
                {lang === 'vi'
                  ? 'Món quà mừng và tình cảm của quý khách là niềm vui to lớn đối với chúng tôi. Kính chúc quý khách và gia đình luôn dồi dào sức khỏe, may mắn và hạnh phúc!'
                  : (lang === 'en'
                  ? 'Thank you for your blessings and generous gift! Wishing you and your family joy and prosperity.'
                  : '十分感谢您的深情厚意与吉利喜礼！愿福气与喜乐常伴您与家人左右。')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffd778] to-[#d4af37] text-[#6e0b0e] font-bold text-sm shadow-xl hover:brightness-110 cursor-pointer"
            >
              {lang === 'vi' ? 'Đóng & Tiếp Tục Xem Thiệp' : (lang === 'en' ? 'Close & Continue' : '收下谢意 · 关闭弹窗')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
