import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { CoupleInfo } from '../types';
import { initialCoupleInfo, couplePresets } from '../data/weddingData';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  onSave: (updated: CoupleInfo) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  couple,
  onSave,
}) => {
  const [formData, setFormData] = useState<CoupleInfo>({ ...couple });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({ ...initialCoupleInfo });
    onSave({ ...initialCoupleInfo });
  };

  const applyPreset = (preset: CoupleInfo) => {
    setFormData({ ...preset });
    onSave({ ...preset });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="customizer-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            id="customizer-modal-box"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white border border-[#ebdcd0] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f0e6dc] mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f4ece3] border border-[#d6c4b2] flex items-center justify-center text-[#8c5e3d]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#2d221a]">
                    个性化请柬设置 (Customize)
                  </h3>
                  <span className="text-[11px] text-[#8c7b6d] block font-chinese">
                    修改新人姓名、婚礼日期、酒店地址与标语
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#8c7b6d] hover:text-[#3d2e24] bg-[#faf7f2] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Quick Switch */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-2">
                Quick Template Presets (快速预设)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {couplePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.info)}
                    className="text-left px-3 py-2 rounded-xl text-xs border border-[#ebdcd0] hover:border-[#8c5e3d] hover:bg-[#faf6f0] transition font-chinese flex items-center justify-between"
                  >
                    <span className="font-medium text-[#3d2e24]">{preset.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#8c5e3d]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Header Quote (Poster Title) */}
              <div>
                <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                  Header Quote / 顶部标语 (e.g. 好久不见，婚礼见)
                </label>
                <input
                  type="text"
                  value={formData.headerQuoteZh || ''}
                  onChange={(e) => setFormData({ ...formData, headerQuoteZh: e.target.value })}
                  placeholder="好久不见，婚礼见"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                />
              </div>

              {/* English Last Names for Poster Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Groom Signature / Tên Tiếng Anh (e.g. Thanh Hiep)
                  </label>
                  <input
                    type="text"
                    value={formData.groomLastNameEn || ''}
                    onChange={(e) => setFormData({ ...formData, groomLastNameEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Bride Signature / Tên Tiếng Anh (e.g. Thuy Dung)
                  </label>
                  <input
                    type="text"
                    value={formData.brideLastNameEn || ''}
                    onChange={(e) => setFormData({ ...formData, brideLastNameEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a]"
                  />
                </div>
              </div>

              {/* Photo Uploads for Groom & Bride */}
              <div className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dacd] space-y-3">
                <div className="text-xs font-bold text-[#5c4636] flex items-center justify-between">
                  <span>📸 Ảnh Cô Dâu & Chú Rể (Original Photos)</span>
                  <span className="text-[10px] font-normal text-[#8c7b6d]">Tải ảnh gốc từ thiết bị</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Groom Photo */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#665446]">
                      Ảnh Chú Rể (NAM_0112)
                    </label>
                    <div className="flex items-center space-x-2">
                      {formData.groomImage && (
                        <img
                          src={formData.groomImage}
                          alt="Groom preview"
                          className="w-10 h-10 rounded-lg object-cover border border-[#d6c4b2] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <span className="block text-center py-1.5 px-2.5 rounded-xl border border-[#ebdcd0] bg-white hover:bg-[#f5ede3] text-xs font-medium text-[#5c4636] transition shadow-2xs">
                          Chọn file gốc...
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    groomImage: event.target!.result as string,
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Bride Photo */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#665446]">
                      Ảnh Cô Dâu (NAM_0638)
                    </label>
                    <div className="flex items-center space-x-2">
                      {formData.brideImage && (
                        <img
                          src={formData.brideImage}
                          alt="Bride preview"
                          className="w-10 h-10 rounded-lg object-cover border border-[#d6c4b2] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <span className="block text-center py-1.5 px-2.5 rounded-xl border border-[#ebdcd0] bg-white hover:bg-[#f5ede3] text-xs font-medium text-[#5c4636] transition shadow-2xs">
                          Chọn file gốc...
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    brideImage: event.target!.result as string,
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chinese Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Groom Chinese Name (新郎姓名)
                  </label>
                  <input
                    type="text"
                    value={formData.groomNameZh || ''}
                    onChange={(e) => setFormData({ ...formData, groomNameZh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Bride Chinese Name (新娘姓名)
                  </label>
                  <input
                    type="text"
                    value={formData.brideNameZh || ''}
                    onChange={(e) => setFormData({ ...formData, brideNameZh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                  />
                </div>
              </div>

              {/* Wedding Date Display and Lunar Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Date & Time Display (日期时间)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.weddingDateFormattedZh || formData.weddingDateFormatted}
                    onChange={(e) => setFormData({ ...formData, weddingDateFormattedZh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                    Lunar Date (农历日期)
                  </label>
                  <input
                    type="text"
                    value={formData.lunarDateZh || ''}
                    onChange={(e) => setFormData({ ...formData, lunarDateZh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                  Venue Name / 酒店宴会厅
                </label>
                <input
                  type="text"
                  required
                  value={formData.venueNameZh || formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueNameZh: e.target.value, venueName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                  Venue Address / 详细地址
                </label>
                <input
                  type="text"
                  value={formData.venueAddressZh || formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddressZh: e.target.value, venueAddress: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1">
                  Quote / 婚礼誓言与浪漫诗句
                </label>
                <textarea
                  rows={2}
                  value={formData.coupleQuoteZh || formData.coupleQuote}
                  onChange={(e) => setFormData({ ...formData, coupleQuoteZh: e.target.value, coupleQuote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white text-xs text-[#2d221a] font-chinese"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#f0e6dc] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-full text-xs font-cinzel font-semibold text-[#7a685b] hover:bg-[#f5ede3] transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs uppercase font-cinzel font-bold tracking-wider text-white bg-[#5c4636] hover:bg-[#433124] transition shadow-xs flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
