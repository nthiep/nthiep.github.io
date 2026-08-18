import React, { useState } from 'react';
import {
  Smartphone,
  Scroll,
  Languages,
  Mail,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { HunbeiTheme, LanguageMode, ViewMode } from '../types';

interface HunbeiControlBarProps {
  currentTheme: HunbeiTheme;
  onChangeTheme: (theme: HunbeiTheme) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  lang: LanguageMode;
  onChangeLang: (lang: LanguageMode) => void;
  onOpenRedPacket: () => void;
  onOpenEnvelope: () => void;
  onOpenCustomizer: () => void;
}

export const HunbeiControlBar: React.FC<HunbeiControlBarProps> = ({
  currentTheme,
  onChangeTheme,
  viewMode,
  onChangeViewMode,
  lang,
  onChangeLang,
  onOpenRedPacket,
  onOpenEnvelope,
  onOpenCustomizer,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const themeOptions: { id: HunbeiTheme; nameZh: string; nameEn: string; nameVi: string; color: string; iconEmoji: string }[] = [
    { id: 'minimal_poster', nameZh: '极简画报 · 好久不见', nameEn: 'Cinematic Alpine Poster', nameVi: 'Bìa Tạp Chí Tối Giản', color: 'bg-[#3b4c3f]', iconEmoji: '⛰️' },
    { id: 'chinese_red', nameZh: '新中式 · 喜结良缘', nameEn: 'Imperial Chinese 囍', nameVi: 'Tân Cổ Điển · Hỷ Sự', color: 'bg-[#961c1e]', iconEmoji: '🏮' },
    { id: 'champagne_gold', nameZh: '法式浪漫 · 香槟白金', nameEn: 'Champagne Ivory', nameVi: 'Lãng Mạn · Champagne', color: 'bg-[#bfa378]', iconEmoji: '🥂' },
    { id: 'forest_green', nameZh: '绿野仙踪 · 森系庄园', nameEn: 'Botanical Emerald', nameVi: 'Khu Vườn Xanh · Emerald', color: 'bg-[#2a4d38]', iconEmoji: '🌿' },
    { id: 'midnight_star', nameZh: '暮光之城 · 星空璀璨', nameEn: 'Midnight Starlight', nameVi: 'Bầu Trời Sao · Dạ Yến', color: 'bg-[#15233e]', iconEmoji: '🌌' },
  ];

  const currentThemeObj = themeOptions.find((t) => t.id === currentTheme) || themeOptions[0];

  const getThemeDisplayName = () => {
    if (lang === 'vi') return currentThemeObj.nameVi;
    if (lang === 'en') return currentThemeObj.nameEn;
    return currentThemeObj.nameZh;
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] sm:w-auto">
      <div className="bg-[#1e1b18]/90 backdrop-blur-xl border border-[#544336] rounded-full p-1.5 shadow-2xl flex items-center justify-between sm:space-x-2 text-xs text-white">
        <div className="flex items-center bg-[#110e0c] rounded-full p-0.5 border border-[#3b2f26]">
          <button
            onClick={() => onChangeViewMode('h5_slide')}
            title={lang === 'vi' ? 'Chế độ thiệp H5 di động cuộn dọc mượt mà' : (lang === 'en' ? 'H5 Single Page Mobile Mode' : 'H5 手机长页模式')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              viewMode === 'h5_slide'
                ? 'bg-linear-to-r from-[#d4af37] to-[#ffd778] text-[#3d2005] font-bold shadow-xs'
                : 'text-[#bbb] hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'H5 Di Động' : (lang === 'en' ? 'H5 Mobile' : 'H5长页')}</span>
          </button>

          <button
            onClick={() => onChangeViewMode('scroll')}
            title={lang === 'vi' ? 'Chế độ cuộn dọc trang dài' : (lang === 'en' ? 'Scroll Mode' : '长页展开浏览模式')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              viewMode === 'scroll'
                ? 'bg-linear-to-r from-[#d4af37] to-[#ffd778] text-[#3d2005] font-bold shadow-xs'
                : 'text-[#bbb] hover:text-white'
            }`}
          >
            <Scroll className="w-3 h-3" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'Cuộn Dọc' : (lang === 'en' ? 'Scroll' : '长页')}</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowLangMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#2c231c] hover:bg-[#382d24] border border-[#4d3d30] transition text-[11px]"
          >
            <span>{currentThemeObj.iconEmoji}</span>
            <span className="hidden md:inline font-medium">{getThemeDisplayName()}</span>
            <span className="md:hidden font-medium">{getThemeDisplayName().split('·')[0]}</span>
            <ChevronDown className="w-3 h-3 text-[#ffd778]" />
          </button>

          {showThemeMenu && (
            <div
              className="absolute top-9 left-0 w-52 bg-[#1f1a16] border border-[#524134] rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[10px] text-[#a69280] font-semibold uppercase tracking-wider">
                {lang === 'vi' ? 'Chủ Đề Thiệp Cưới' : (lang === 'en' ? 'Template Styles' : '婚贝请柬精选模版')}
              </div>
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChangeTheme(opt.id);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left text-xs transition ${
                    currentTheme === opt.id
                      ? 'bg-[#3b2e24] text-[#ffd778] font-bold border border-[#8a6a45]'
                      : 'text-[#ddd] hover:bg-[#2b241e]'
                  }`}
                >
                  <span>{opt.iconEmoji}</span>
                  <div className="truncate">
                    <div>{lang === 'vi' ? opt.nameVi : (lang === 'en' ? opt.nameEn : opt.nameZh)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowThemeMenu(false);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#2c231c] hover:bg-[#382d24] border border-[#4d3d30] text-[11px] text-[#fae0a5]"
            title={lang === 'vi' ? 'Đổi ngôn ngữ' : 'Switch language'}
          >
            <Languages className="w-3.5 h-3.5 text-[#ffd778]" />
            <span className="uppercase font-semibold">{lang}</span>
          </button>

          {showLangMenu && (
            <div
              className="absolute top-9 right-0 w-36 bg-[#1f1a16] border border-[#524134] rounded-xl p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-0.5 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onChangeLang('vi');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                  lang === 'vi' ? 'bg-[#3b2e24] text-[#ffd778] font-bold' : 'text-[#ccc] hover:bg-[#2b241e]'
                }`}
              >
                <span>🇻🇳</span>
                <span>Tiếng Việt</span>
              </button>
              <button
                onClick={() => {
                  onChangeLang('zh');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                  lang === 'zh' ? 'bg-[#3b2e24] text-[#ffd778] font-bold' : 'text-[#ccc] hover:bg-[#2b241e]'
                }`}
              >
                <span>🇨🇳</span>
                <span>中文</span>
              </button>
              <button
                onClick={() => {
                  onChangeLang('en');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                  lang === 'en' ? 'bg-[#3b2e24] text-[#ffd778] font-bold' : 'text-[#ccc] hover:bg-[#2b241e]'
                }`}
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
              <button
                onClick={() => {
                  onChangeLang('bilingual');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                  lang === 'bilingual' ? 'bg-[#3b2e24] text-[#ffd778] font-bold' : 'text-[#ccc] hover:bg-[#2b241e]'
                }`}
              >
                <span>🌐</span>
                <span>{lang === 'vi' ? 'Song Ngữ' : lang === 'zh' ? '双语' : 'Bilingual'}</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenRedPacket}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-linear-to-r from-[#b81d22] to-[#db282e] hover:brightness-110 border border-[#f5d78e] text-[#ffe8a8] text-[11px] font-bold shadow-sm transition animate-pulse"
          title={lang === 'vi' ? 'Mừng cưới / Phong bao đỏ' : (lang === 'en' ? 'Red Packet Blessing' : '送礼金 / 份子钱')}
        >
          <span>🧧</span>
          <span className="hidden sm:inline">{lang === 'vi' ? 'Mừng Cưới' : (lang === 'en' ? 'Red Packet' : '送礼金')}</span>
        </button>

        <button
          onClick={onOpenEnvelope}
          className="p-1 rounded-full bg-[#2c231c] hover:bg-[#382d24] border border-[#4d3d30] text-[#fae0a5] transition"
          title={lang === 'vi' ? 'Mở thiệp sáp niêm phong trang trọng' : 'Open sealed formal wax invitation'}
        >
          <Mail className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenCustomizer}
          className="p-1 rounded-full bg-[#2c231c] hover:bg-[#382d24] border border-[#4d3d30] text-[#fae0a5] transition"
          title={lang === 'vi' ? 'Chỉnh sửa thông tin thiệp & đôi uyên ương' : 'Edit wedding & couple info'}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

