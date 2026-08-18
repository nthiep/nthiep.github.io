import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, MapPin, Maximize2 } from 'lucide-react';
import { GalleryPhoto, LanguageMode } from '../types';

interface GallerySectionProps {
  photos: GalleryPhoto[];
  lang?: LanguageMode;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos, lang = 'vi' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'engagement' | 'travel' | 'moments'>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const showNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
  };

  const showPrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const tPhoto = (photo: GalleryPhoto) => ({
    title: lang === 'vi' ? photo.titleVi || photo.title : lang === 'zh' ? photo.titleZh || photo.title : photo.title,
    caption: lang === 'vi' ? photo.captionVi || photo.caption : lang === 'zh' ? photo.captionZh || photo.caption : photo.caption,
    location: lang === 'vi' ? photo.locationVi || photo.location : lang === 'zh' ? photo.locationZh || photo.location : photo.location,
  });

  const categories = lang === 'vi' ? [
    { id: 'all', label: 'Tất Cả Khoảnh Khắc' },
    { id: 'engagement', label: 'Ảnh Cưới & Đính Hôn' },
    { id: 'travel', label: 'Du Lịch Cùng Nhau' },
    { id: 'moments', label: 'Khoảnh Khắc Đời Thường' },
  ] : lang === 'zh' ? [
    { id: 'all', label: '全部瞬间' },
    { id: 'engagement', label: '婚纱与订婚' },
    { id: 'travel', label: '旅途同行' },
    { id: 'moments', label: '日常点滴' },
  ] : [
    { id: 'all', label: 'All Moments' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'travel', label: 'Travel & Trips' },
    { id: 'moments', label: 'Everyday Candids' },
  ];

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {lang === 'vi' ? 'Album Ảnh Kỷ Niệm' : lang === 'zh' ? '纪念相册' : 'Photo Gallery'}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif">
            {lang === 'vi'
              ? 'Từng khung hình lưu giữ những nụ cười, những chuyến đi và tình yêu đong đầy của chúng mình.'
              : lang === 'zh'
              ? '每一帧都收藏着微笑、旅程，以及我们满溢的爱。'
              : 'A glimpse into our cherished travels, quiet mornings, and favorite moments together.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase font-cinzel font-medium tracking-wider transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#5c4636] text-white shadow-xs'
                  : 'bg-[#faf7f2] border border-[#ebdcd0] text-[#786657] hover:bg-[#f2e7dc]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => {
            const copy = tPhoto(photo);
            return (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(index)}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer bg-[#faf7f2] border border-[#ebdcd0] aspect-[4/5]"
            >
              <img
                src={photo.url}
                alt={copy.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-end">
                  <span className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  {copy.location && (
                    <span className="text-[11px] uppercase tracking-wider font-cinzel text-[#f0caa0] flex items-center space-x-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{copy.location}</span>
                    </span>
                  )}
                  <h4 className="font-serif text-lg font-medium">{copy.title}</h4>
                  <p className="text-xs text-stone-200 line-clamp-2 mt-0.5">{copy.caption}</p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
            <div
              id="gallery-lightbox-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
              onClick={closeLightbox}
            >
              <button
                id="close-lightbox-btn"
                onClick={closeLightbox}
                className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                id="lightbox-prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                id="lightbox-next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Lightbox Content */}
              <div
                className="relative max-w-4xl max-h-[88vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredPhotos[activePhotoIndex].url}
                  alt={tPhoto(filteredPhotos[activePhotoIndex]).title}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />

                <div className="text-center mt-4 text-white max-w-lg px-4">
                  <h4 className="font-serif text-xl sm:text-2xl font-medium">
                    {tPhoto(filteredPhotos[activePhotoIndex]).title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    {tPhoto(filteredPhotos[activePhotoIndex]).caption}
                  </p>
                  {tPhoto(filteredPhotos[activePhotoIndex]).location && (
                    <span className="inline-flex items-center space-x-1 text-[11px] text-[#f0caa0] font-cinzel mt-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3" />
                      <span>{tPhoto(filteredPhotos[activePhotoIndex]).location}</span>
                    </span>
                  )}
                  <span className="block text-[11px] text-stone-400 mt-2">
                    {activePhotoIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
