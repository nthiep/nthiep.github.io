import React, { useState } from 'react';
import { CoupleInfo, HunbeiTheme, LanguageMode } from './types';
import {
  initialCoupleInfo,
  storyMilestones,
  scheduleEvents,
  dressCodeColors,
  galleryPhotos,
  faqList,
} from './data/weddingData';
import { EnvelopeModal } from './components/EnvelopeModal';
import { FallingHearts } from './components/FallingHearts';
import { HunbeiVinylPlayer } from './components/HunbeiVinylPlayer';
import { HunbeiRedPacketModal } from './components/HunbeiRedPacketModal';
import { HunbeiH5SlideContainer } from './components/HunbeiH5SlideContainer';
import { HunbeiCallModal } from './components/HunbeiCallModal';
import { HunbeiNavModal } from './components/HunbeiNavModal';
import { useLockBodyScroll } from './hooks/useLockBodyScroll';

export default function App() {
  const [couple] = useState<CoupleInfo>(initialCoupleInfo);

  const [themeStyle] = useState<HunbeiTheme>('minimal_poster');
  const [lang, setLang] = useState<LanguageMode>('vi');

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [redPacketOpen, setRedPacketOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  useLockBodyScroll(envelopeOpen || redPacketOpen || callModalOpen || navModalOpen);

  return (
    <div className="min-h-screen relative font-sans selection:bg-[#f3c87a] selection:text-[#5e090b] bg-[#18231c] text-[#f0f7f0]">
      <HunbeiVinylPlayer themeStyle={themeStyle} lang={lang} />
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
    </div>
  );
}
