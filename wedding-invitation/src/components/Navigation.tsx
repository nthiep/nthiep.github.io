import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Image as ImageIcon,
  VolumeX,
  Volume2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { audioEngine } from '../utils/sound';
import { LanguageMode } from '../types';

interface NavigationProps {
  brideName: string;
  groomName: string;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
  onOpenCustomizer: () => void;
  onOpenEnvelope: () => void;
  lang?: LanguageMode;
}

export const Navigation: React.FC<NavigationProps> = ({
  brideName,
  groomName,
  petalsEnabled,
  onTogglePetals,
  onOpenCustomizer,
  onOpenEnvelope,
  lang = 'vi',
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = ['hero', 'story', 'schedule', 'venue', 'attire', 'gallery', 'rsvp', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    const playing = audioEngine.toggle();
    setIsPlayingSound(playing);
  };

  const navLinks = [
    {
      name: lang === 'vi' ? 'Lịch Trình' : lang === 'zh' ? '流程' : 'Schedule',
      href: '#schedule',
      icon: Calendar,
    },
    {
      name: lang === 'vi' ? 'Địa Điểm' : lang === 'zh' ? '酒店' : 'Venue',
      href: '#venue',
      icon: MapPin,
    },
    {
      name: lang === 'vi' ? 'Album Ảnh' : lang === 'zh' ? '相册' : 'Gallery',
      href: '#gallery',
      icon: ImageIcon,
    },
  ];

  const getMonogram = () => {
    const b = brideName.trim().charAt(0) || 'E';
    const g = groomName.trim().charAt(0) || 'A';
    return `${b} & ${g}`;
  };

  return (
    <>
      <header
        id="main-navigation-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#faf8f5]/95 backdrop-blur-md shadow-sm border-b border-[#ebdcd0]/70 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a
            href="#hero"
            id="nav-logo-link"
            className="group flex items-center space-x-2 text-[#4a3b32] transition-colors"
          >
            <span className="w-8 h-8 rounded-full border border-[#c4a480] flex items-center justify-center text-xs font-cinzel font-semibold tracking-wider bg-[#f5efe6] group-hover:bg-[#ebdcd0] transition">
              {getMonogram()}
            </span>
            <span className="font-serif italic text-lg sm:text-xl font-medium tracking-wide">
              {brideName.split(' ')[0]} & {groomName.split(' ')[0]}
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                id={`desktop-nav-${item.href.replace('#', '')}`}
                className={`text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 ${
                  activeSection === item.href.replace('#', '')
                    ? 'text-[#8c5e3d] font-semibold border-b border-[#8c5e3d] pb-0.5'
                    : 'text-[#6b5d52] hover:text-[#2c221a]'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="sound-toggle-btn"
              onClick={toggleMusic}
              title={isPlayingSound ? 'Tắt nhạc nền' : 'Bật nhạc nền lãng mạn'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isPlayingSound
                  ? 'bg-[#ede3d8] border-[#cbb29b] text-[#543b27] shadow-inner'
                  : 'bg-[#faf6f0] border-[#e5d8cb] text-[#786657] hover:bg-[#f3ece2]'
              }`}
            >
              {isPlayingSound ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#8c5e3d] animate-pulse" />
                  <span className="hidden sm:inline">{lang === 'vi' ? 'Nhạc Bật' : 'Melody On'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#9a897b]" />
                  <span className="hidden sm:inline">{lang === 'vi' ? 'Phát Nhạc' : 'Play Melody'}</span>
                </>
              )}
            </button>

            <button
              id="petals-toggle-btn"
              onClick={onTogglePetals}
              title={petalsEnabled ? 'Tắt hiệu ứng hoa rơi' : 'Bật hiệu ứng cánh hoa'}
              className={`p-1.5 rounded-full border transition-all ${
                petalsEnabled
                  ? 'bg-[#ede3d8] border-[#cbb29b] text-[#8c5e3d]'
                  : 'bg-[#faf6f0] border-[#e5d8cb] text-[#9a897b] hover:bg-[#f3ece2]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              id="open-envelope-header-btn"
              onClick={onOpenEnvelope}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-cinzel font-semibold tracking-wider text-white bg-[#5c4636] hover:bg-[#433124] rounded-full transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd778]" />
              <span>{lang === 'vi' ? 'Mở Thiệp Cưới' : lang === 'zh' ? '专属请柬' : 'Wax Seal Invite'}</span>
            </button>

            <button
              id="open-customizer-btn"
              onClick={onOpenCustomizer}
              title="Tùy biến thông tin thiệp cưới"
              className="p-1.5 rounded-full bg-[#faf6f0] border border-[#e5d8cb] text-[#786657] hover:bg-[#f3ece2] transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-bottom-navbar"
        className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center"
      >
        <div className="bg-[#ffffff]/92 backdrop-blur-lg border border-[#ebdcd0] shadow-lg rounded-full px-4 py-2 flex items-center space-x-5 max-w-sm justify-around w-full">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.href}
                href={item.href}
                id={`mobile-nav-${item.href.replace('#', '')}`}
                className={`flex flex-col items-center py-1 px-1 transition-all ${
                  isCurrent ? 'text-[#8c5e3d] scale-110' : 'text-[#8b7d72] hover:text-[#4a3b32]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};
