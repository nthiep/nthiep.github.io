import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Car, Hotel, Copy, Check } from 'lucide-react';
import { CoupleInfo, LanguageMode } from '../types';
import { AppleLogo } from './AppleLogo';

interface VenueGuideProps {
  couple: CoupleInfo;
  lang?: LanguageMode;
}

export const VenueGuide: React.FC<VenueGuideProps> = ({ couple, lang = 'vi' }) => {
  const [copied, setCopied] = useState(false);

  const venueName = lang === 'vi' ? couple.venueNameVi || couple.venueName : lang === 'zh' ? couple.venueNameZh || couple.venueName : couple.venueName;
  const venueAddress = lang === 'vi' ? couple.venueAddressVi || couple.venueAddress : lang === 'zh' ? couple.venueAddressZh || couple.venueAddress : couple.venueAddress;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${venueAddress}, ${couple.venueCity}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="venue" className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {lang === 'vi' ? 'Trung Tâm Tiệc Cưới & Hướng Dẫn' : 'Venue & Travel Guide'}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif">
            {lang === 'vi'
              ? 'Không gian tiệc cưới lộng lẫy và ấm cúng tại Sảnh IMPERIAL - Tầng 5A, sẵn sàng chào đón quý khách tới chung vui.'
              : 'A luxurious banquet hall ready to welcome our dearest guests for a joyful celebration.'}
          </p>
        </div>

        {/* Main Venue Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Image & Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-[#ebdcd0] relative min-h-[320px] sm:min-h-[420px]"
          >
            <img
              src={couple.venueImageUrl}
              alt={venueName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="text-xs uppercase tracking-[0.2em] font-cinzel font-semibold text-[#f5ebd9] mb-1">
                {lang === 'vi' ? 'Sảnh Tiệc Hoàng Gia' : 'Grand Ballroom'}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-white font-medium mb-2">
                {venueName}
              </h3>
              <p className="text-xs sm:text-sm text-[#f0e6dc] flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#f0caa0]" />
                <span>{venueAddress}</span>
              </p>
            </div>
          </motion.div>

          {/* Location Action & Transport Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#faf7f2] border border-[#ebdcd0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#2d221a] mb-2">
                {lang === 'vi' ? 'Hướng Dẫn Di Chuyển' : 'Getting to the Celebration'}
              </h4>
              <p className="text-xs sm:text-sm text-[#665446] leading-relaxed mb-6">
                {lang === 'vi'
                  ? 'Nhà hàng Gold Palace nằm ngay trên tuyến đường Nơ Trang Long thuận tiện, dễ dàng tiếp cận bằng ô tô, taxi hoặc phương tiện cá nhân.'
                  : 'Gold Palace is centrally located with easy access via taxi, ride-share, and private vehicles.'}
              </p>

              {/* Address details card */}
              <div className="bg-white border border-[#e5d8cb] rounded-2xl p-4 mb-6 space-y-2 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-cinzel text-[#8c6b4e] font-semibold block">
                  {lang === 'vi' ? 'Địa Chỉ Chính Thức' : 'Official GPS Navigation Address'}
                </span>
                <p className="text-sm font-medium text-[#2d221a]">
                  {venueName}
                </p>
                <p className="text-xs text-[#6e5d50]">
                  {venueAddress}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                <a
                  href={couple.venueMapUrl || 'https://maps.app.goo.gl/ZVYe1nAELmTukXBL9'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl text-xs uppercase font-cinzel font-semibold tracking-wider text-white bg-[#5c4636] hover:bg-[#433124] transition shadow-xs flex items-center justify-center space-x-1.5 text-center"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={couple.venueAppleMapUrl || 'https://maps.apple.com/place?place-id=I58FBBA16B0C03C6A'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl text-xs uppercase font-cinzel font-semibold tracking-wider text-[#2d221a] bg-white border border-[#d6c4b2] hover:bg-[#faf6f0] transition shadow-xs flex items-center justify-center space-x-1.5 text-center"
                >
                  <AppleLogo className="h-[22px] w-auto shrink-0" />
                  <span>Apple Maps</span>
                </a>
              </div>

              <div className="mb-6">
                <button
                  onClick={handleCopyAddress}
                  className="w-full px-4 py-2.5 rounded-xl text-xs uppercase font-cinzel font-semibold tracking-wider text-[#5c4636] bg-[#f2ebe2] border border-[#d6c4b2] hover:bg-[#eae1d6] transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'vi' ? 'Đã sao chép địa chỉ!' : 'Copied Address!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Sao Chép Địa Chỉ' : 'Copy Address'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Parking & Shuttle Summary */}
            <div className="space-y-3 border-t border-[#ebdcd0] pt-4">
              <div className="flex items-start space-x-3 text-xs text-[#665446]">
                <Car className="w-4 h-4 text-[#9c6843] shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'vi' ? 'Hỗ Trợ Đỗ Xe:' : 'Parking:'}</strong> {lang === 'vi' ? 'Khách sạn có dịch vụ hỗ trợ đỗ xe (xe máy và ô tô) dưới tầng hầm' : 'Complimentary basement parking available for motorbikes and cars.'}
                </span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-[#665446]">
                <Hotel className="w-4 h-4 text-[#9c6843] shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'vi' ? 'Thang Máy Lên Tầng 5A:' : 'Elevator Access:'}</strong> {lang === 'vi' ? 'Hệ thống thang máy tốc độ cao dẫn trực tiếp lên sảnh IMPERIAL tại Tầng 5A.' : 'Direct elevator access to IMPERIAL Hall on Floor 5A.'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
