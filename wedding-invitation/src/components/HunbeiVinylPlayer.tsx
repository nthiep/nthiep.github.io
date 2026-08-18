import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine, AudioTrack } from '../utils/sound';
import { LanguageMode } from '../types';

interface HunbeiVinylPlayerProps {
  themeStyle?: string;
  lang?: LanguageMode;
}

export const HunbeiVinylPlayer: React.FC<HunbeiVinylPlayerProps> = ({ themeStyle = 'chinese_red', lang = 'vi' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(audioEngine.getCurrentTrack());
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });
    return () => unsub();
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.toggle();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.nextTrack();
  };

  const tracks = audioEngine.getTracks();

  // Border & glow color based on theme
  const getThemeAccents = () => {
    if (themeStyle === 'chinese_red') {
      return {
        diskBorder: 'border-[#f3c87a]',
        centerBg: 'bg-[#961c1e]',
        noteColor: 'text-[#ffd778]',
        glow: 'shadow-[0_0_15px_rgba(243,200,122,0.4)]',
      };
    }
    if (themeStyle === 'forest_green') {
      return {
        diskBorder: 'border-[#b5d5b7]',
        centerBg: 'bg-[#1b3a2a]',
        noteColor: 'text-[#d4f0d6]',
        glow: 'shadow-[0_0_15px_rgba(181,213,183,0.4)]',
      };
    }
    if (themeStyle === 'midnight_star') {
      return {
        diskBorder: 'border-[#e0c57c]',
        centerBg: 'bg-[#0f172a]',
        noteColor: 'text-[#fae59a]',
        glow: 'shadow-[0_0_15px_rgba(224,197,124,0.5)]',
      };
    }
    // Champagne Gold
    return {
      diskBorder: 'border-[#d4af37]',
      centerBg: 'bg-[#5c4636]',
      noteColor: 'text-[#d4af37]',
      glow: 'shadow-[0_0_15px_rgba(212,175,55,0.4)]',
    };
  };

  const style = getThemeAccents();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center">
      {/* Floating Animated Musical Notes when Playing */}
      {isPlaying && (
        <div className="relative pointer-events-none mr-1 select-none">
          <span className={`absolute -top-3 right-1 ${style.noteColor} text-xs animate-bounce opacity-80`}>♪</span>
          <span className={`absolute -top-6 right-3 ${style.noteColor} text-sm animate-pulse opacity-90 delay-150`}>♫</span>
        </div>
      )}

      {/* Main Vinyl Player Disc Button */}
      <div className="relative">
        <button
          id="hunbei-vinyl-music-btn"
          onClick={handleToggle}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          title={isPlaying ? '暂停背景音乐 (右键切换曲目)' : '播放浪漫婚礼背景音乐'}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 ${style.diskBorder} bg-[#181818] text-white flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isPlaying ? `animate-spin-slow ${style.glow}` : 'hover:scale-105 opacity-90'
          }`}
        >
          {/* Vinyl Grooves Pattern */}
          <div className="w-8 h-8 rounded-full border border-[#444] flex items-center justify-center bg-[#222]">
            <div className={`w-4 h-4 rounded-full ${style.centerBg} border border-[#e5c179] flex items-center justify-center`}>
              {isPlaying ? (
                <Music className="w-2.5 h-2.5 text-[#ffd778]" />
              ) : (
                <Play className="w-2.5 h-2.5 text-[#ffd778] ml-0.5" />
              )}
            </div>
          </div>
        </button>

        {/* Small Track Switcher Toggle Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2a241f] border border-[#d4af37] text-[#ffd778] flex items-center justify-center hover:bg-[#3d332c] shadow-xs transition"
          title="选择婚礼音乐曲目"
        >
          <Sparkles className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Dropdown Menu for Track Selection */}
      {showMenu && (
        <div
          className="absolute top-14 right-0 w-64 p-3 rounded-2xl bg-[#1e1b18]/95 backdrop-blur-md border border-[#4a3b30] text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#3d332a] mb-2">
            <div className="flex items-center space-x-1.5 text-xs text-[#d4af37] font-medium">
              <Music className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Nhạc Nền' : lang === 'en' ? 'Wedding Soundtracks' : '婚礼专属背景音乐'}</span>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="text-[#998] hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5">
            {tracks.map((t) => {
              const active = currentTrack.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    audioEngine.setTrack(t.id);
                    if (!isPlaying) audioEngine.play();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                    active
                      ? 'bg-[#3b2e24] text-[#ffd778] border border-[#8a6843]'
                      : 'text-[#ccc] hover:bg-[#2b2520] hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{lang === 'zh' ? t.nameZh : t.name}</span>
                  {active && isPlaying && <Volume2 className="w-3 h-3 text-[#ffd778] shrink-0 animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-[#3d332a] flex items-center justify-between text-[11px]">
            <button
              onClick={handleToggle}
              className="px-2.5 py-1 rounded-md bg-[#332a22] text-[#ffd778] hover:bg-[#47392d] flex items-center space-x-1"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? (lang === 'vi' ? 'Tạm dừng' : lang === 'en' ? 'Pause' : '暂停') : (lang === 'vi' ? 'Phát' : lang === 'en' ? 'Play' : '播放')}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-2.5 py-1 rounded-md bg-[#332a22] text-[#e0d6cc] hover:bg-[#47392d] flex items-center space-x-1"
            >
              <SkipForward className="w-3 h-3" />
              <span>{lang === 'vi' ? 'Bài sau' : lang === 'en' ? 'Next' : '切歌'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
