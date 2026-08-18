import React, { useState } from 'react';
import { Gift, Heart, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { registryInfo } from '../data/weddingData';
import { LanguageMode } from '../types';

interface GiftRegistrySectionProps {
  lang?: LanguageMode;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({ lang = 'vi' }) => {
  const [copiedIban, setCopiedIban] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(registryInfo.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const badgeText = lang === 'vi' ? 'Quà Cưới & Lời Chúc' : lang === 'zh' ? '随礼与心愿单' : 'Wishing Well & Registry';
  const headlineText = lang === 'vi' ? 'Quà Cưới & Hộp Thư Chúc Phúc' : lang === 'zh' ? '新人礼金与心愿单' : registryInfo.headline;
  const messageText = lang === 'vi'
    ? 'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất đối với chúng tôi. Nếu quý khách muốn gửi thêm quà mừng hoặc đóng góp cho tuần trăng mật, chúng tôi xin chân thành cảm ơn tình cảm của quý khách.'
    : lang === 'zh'
    ? '您的莅临与祝福就是给我们最好的新婚礼物。如果您希望为我们的蜜月或新家添砖加瓦，我们由衷感谢您的这份心意。'
    : registryInfo.message;

  const cardTitle = lang === 'vi' ? 'Quỹ Tuần Trăng Mật & Tổ Ấm Tương Lai' : lang === 'zh' ? '蜜月与筑家心意箱' : 'Honeymoon & Future Home Wishing Well';
  const accountNameLabel = lang === 'vi' ? 'Tên Tài Khoản' : lang === 'zh' ? '账户姓名' : 'Account Name';
  const bankLabel = lang === 'vi' ? 'Ngân Hàng' : lang === 'zh' ? '开户银行' : 'Financial Institution';
  const swiftLabel = lang === 'vi' ? 'Mã SWIFT / BIC' : lang === 'zh' ? 'SWIFT 代码' : 'SWIFT / BIC';
  const ibanLabel = lang === 'vi' ? 'Số Tài Khoản / IBAN' : lang === 'zh' ? '银行卡号 / IBAN' : 'Account / IBAN Number';
  const copyLabel = lang === 'vi' ? 'Sao Chép' : lang === 'zh' ? '复制信息' : 'Copy Info';
  const copiedLabel = lang === 'vi' ? 'Đã Sao Chép!' : lang === 'zh' ? '已复制！' : 'Copied!';

  return (
    <section id="registry" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#faf7f2] border-t border-[#f0e6dc]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 rounded-full bg-[#f2e7dc] border border-[#d6c4b2] flex items-center justify-center text-[#9c6843] mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            {badgeText}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {headlineText}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif leading-relaxed">
            {messageText}
          </p>
        </div>

        {/* Wishing Well Details Card */}
        <div className="bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto mb-10 text-left">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#f0e6dc] mb-4">
            <Sparkles className="w-4 h-4 text-[#9c6843]" />
            <h4 className="font-serif text-lg font-semibold text-[#2d221a]">
              {cardTitle}
            </h4>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#8c7b6d] font-cinzel uppercase text-xs">{accountNameLabel}</span>
              <span className="font-medium text-[#2d221a]">{registryInfo.wishingWellAccount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8c7b6d] font-cinzel uppercase text-xs">{bankLabel}</span>
              <span className="font-medium text-[#2d221a]">{registryInfo.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8c7b6d] font-cinzel uppercase text-xs">{swiftLabel}</span>
              <span className="font-mono text-[#2d221a]">{registryInfo.swift}</span>
            </div>
            <div className="pt-2 border-t border-[#f0e6dc] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[#8c7b6d] font-cinzel uppercase text-xs block">{ibanLabel}</span>
                <span className="font-mono font-semibold text-[#2d221a] text-sm">{registryInfo.iban}</span>
              </div>
              <button
                onClick={handleCopyIban}
                className="px-3.5 py-1.5 rounded-full text-xs font-cinzel font-semibold tracking-wider text-[#5c4636] bg-[#faf7f2] border border-[#ebdcd0] hover:bg-[#f3ece2] transition flex items-center space-x-1.5 self-start sm:self-auto"
              >
                {copiedIban ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{copiedLabel}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copyLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Registry External Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {registryInfo.registryLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target={item.url.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-[#ebdcd0] hover:border-[#8c6b4e] text-xs font-cinzel font-semibold tracking-wider text-[#5c4636] hover:bg-[#faf7f2] transition shadow-xs"
            >
              <span>{item.name}</span>
              {item.url.startsWith('http') ? (
                <ExternalLink className="w-3.5 h-3.5 text-[#8c6b4e]" />
              ) : (
                <Heart className="w-3.5 h-3.5 text-[#8c6b4e]" />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
