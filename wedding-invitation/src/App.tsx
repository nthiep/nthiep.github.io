import React, { useState } from 'react';
import { CoupleInfo, HunbeiTheme, LanguageMode, ViewMode } from './types';
import {
  initialCoupleInfo,
  storyMilestones,
  scheduleEvents,
  dressCodeColors,
  galleryPhotos,
  faqList,
} from './data/weddingData';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { EventsSchedule } from './components/EventsSchedule';
import { VenueGuide } from './components/VenueGuide';
import { DressCodeSection } from './components/DressCodeSection';
import { GallerySection } from './components/GallerySection';
import { GiftRegistrySection } from './components/GiftRegistrySection';
import { FAQSection } from './components/FAQSection';
import { EnvelopeModal } from './components/EnvelopeModal';
import { CustomizerModal } from './components/CustomizerModal';
import { FloatingPetals } from './components/FloatingPetals';
import { FallingHearts } from './components/FallingHearts';
import { Footer } from './components/Footer';
import { HunbeiVinylPlayer } from './components/HunbeiVinylPlayer';
import { HunbeiRedPacketModal } from './components/HunbeiRedPacketModal';
import { HunbeiControlBar } from './components/HunbeiControlBar';
import { HunbeiH5SlideContainer } from './components/HunbeiH5SlideContainer';
import { HunbeiCallModal } from './components/HunbeiCallModal';
import { HunbeiNavModal } from './components/HunbeiNavModal';

export default function App() {
  const [couple, setCouple] = useState<CoupleInfo>(() => {
    const saved = localStorage.getItem('wedding_couple_info_v5');
    if (saved) {
      try {
        return { ...initialCoupleInfo, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return initialCoupleInfo;
  });

  const [themeStyle, setThemeStyle] = useState<HunbeiTheme>('minimal_poster');
  const [viewMode, setViewMode] = useState<ViewMode>('h5_slide');
  const [lang, setLang] = useState<LanguageMode>('vi');

  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [redPacketOpen, setRedPacketOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const handleSaveCoupleInfo = (updated: CoupleInfo) => {
    setCouple(updated);
    localStorage.setItem('wedding_couple_info_v5', JSON.stringify(updated));
  };

  const getThemeScrollBg = () => {
    if (themeStyle === 'minimal_poster') return 'bg-[#18231c] text-[#f0f7f0]';
    if (themeStyle === 'chinese_red') return 'bg-[#8a1317] text-[#fff]';
    if (themeStyle === 'forest_green') return 'bg-[#183024] text-[#e0f2e2]';
    if (themeStyle === 'midnight_star') return 'bg-[#0e1628] text-[#e5edff]';
    return 'bg-[#faf8f5] text-[#2c2825]';
  };

  return (
    <div className={`min-h-screen relative font-sans selection:bg-[#f3c87a] selection:text-[#5e090b] ${getThemeScrollBg()}`}>
      <HunbeiVinylPlayer themeStyle={themeStyle} lang={lang} />

      <HunbeiControlBar
        currentTheme={themeStyle}
        onChangeTheme={setThemeStyle}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        lang={lang}
        onChangeLang={setLang}
        onOpenRedPacket={() => setRedPacketOpen(true)}
        onOpenEnvelope={() => setEnvelopeOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
      />

      {viewMode === 'h5_slide' ? (
        <>
          <FallingHearts enabled />
          <HunbeiH5SlideContainer
          couple={couple}
          milestones={storyMilestones}
          events={scheduleEvents}
          gallery={galleryPhotos}
          dressColors={dressCodeColors}
          faqs={faqList}
          themeStyle={themeStyle}
          lang={lang}
          onOpenCallModal={() => setCallModalOpen(true)}
          onOpenNavModal={() => setNavModalOpen(true)}
          onOpenRedPacket={() => setRedPacketOpen(true)}
          onOpenEnvelope={() => setEnvelopeOpen(true)}
          onChangeLang={setLang}
          onNewWishAdded={() => {}}
        />
        </>
      ) : (
        <div className="flex flex-col min-h-screen pt-14">
          <FloatingPetals enabled={petalsEnabled} />

          <Navigation
            brideName={lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideName}
            groomName={lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomName}
            petalsEnabled={petalsEnabled}
            onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
            onOpenCustomizer={() => setCustomizerOpen(true)}
            onOpenEnvelope={() => setEnvelopeOpen(true)}
            lang={lang}
          />

          <main className="flex-1">
            <HeroSection
              couple={couple}
              onOpenEnvelope={() => setEnvelopeOpen(true)}
              lang={lang}
            />

            <EventsSchedule
              events={scheduleEvents}
              couple={couple}
              lang={lang}
            />

            <VenueGuide couple={couple} lang={lang} />

            <DressCodeSection colors={dressCodeColors} lang={lang} />

            <GallerySection photos={galleryPhotos} lang={lang} />

            <GiftRegistrySection lang={lang} />

            <FAQSection faqs={faqList} couple={couple} lang={lang} />
          </main>

          <Footer
            couple={couple}
            onOpenEnvelope={() => setEnvelopeOpen(true)}
            onChangeLang={setLang}
            lang={lang}
          />
        </div>
      )}

      <HunbeiRedPacketModal
        isOpen={redPacketOpen}
        onClose={() => setRedPacketOpen(false)}
        couple={couple}
        lang={lang}
        onSendWish={() => {}}
      />

      <HunbeiCallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        couple={couple}
        lang={lang}
      />

      <HunbeiNavModal
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        couple={couple}
        lang={lang}
      />

      <EnvelopeModal
        isOpen={envelopeOpen}
        onClose={() => setEnvelopeOpen(false)}
        couple={couple}
        lang={lang}
      />

      <CustomizerModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        couple={couple}
        onSave={handleSaveCoupleInfo}
      />
    </div>
  );
}


