import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Calendar, MapPin, Sparkles, CheckCircle2, XCircle, ArrowLeft, Send, Users, User, Check, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleInfo, LanguageMode, RSVPData } from '../types';
import { submitRsvpToSheet } from '../utils/rsvpSheet';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleInfo;
  lang?: LanguageMode;
  onJumpToRsvp?: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onClose,
  couple,
  lang = 'vi',
}) => {
  const [isSealed, setIsSealed] = useState(true);
  const [modalView, setModalView] = useState<'letter' | 'rsvp' | 'success'>('letter');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    attending: 'yes' as 'yes' | 'no',
    guestsCount: 1,
    message: '',
  });

  const [savedRSVP, setSavedRSVP] = useState<RSVPData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_rsvp_submission');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedRSVP(parsed);
        setFormData({
          fullName: parsed.fullName || '',
          attending: parsed.attending || 'yes',
          guestsCount: parsed.guestsCount || 1,
          message: parsed.message || '',
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const handleOpenEnvelope = () => {
    setIsSealed(false);
    setModalView('letter');
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setIsSealed(true);
      setModalView('letter');
    }, 300);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffd778', '#d4af37', '#b81d22', '#a3b18a', '#ffffff'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || submitting) return;

    const rsvpRecord: RSVPData = {
      id: savedRSVP?.id || `rsvp-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: savedRSVP?.email || 'guest@wedding.local',
      attending: formData.attending,
      guestsCount: formData.attending === 'yes' ? Number(formData.guestsCount) : 0,
      mealChoice: 'Tiêu chuẩn',
      dietaryRestrictions: '',
      songRequest: '',
      message: formData.message.trim(),
      submittedAt: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitRsvpToSheet({
        id: rsvpRecord.id,
        fullName: rsvpRecord.fullName,
        attending: rsvpRecord.attending,
        guestsCount: rsvpRecord.guestsCount,
        message: rsvpRecord.message,
        submittedAt: rsvpRecord.submittedAt,
        lang,
      });

      localStorage.setItem('wedding_rsvp_submission', JSON.stringify(rsvpRecord));
      setSavedRSVP(rsvpRecord);
      setModalView('success');

      if (formData.attending === 'yes') {
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : '';
      const unconfigured = message === 'RSVP_WEBAPP_UNCONFIGURED';
      const forbidden = message === 'RSVP_SHEET_HTTP_403';
      setSubmitError(
        unconfigured
          ? (lang === 'vi'
            ? 'Chưa cấu hình Google Sheet. Thêm VITE_RSVP_WEBAPP_URL sau khi Deploy Apps Script.'
            : lang === 'zh'
            ? '尚未配置 Google 表格，请先部署 Apps Script。'
            : 'Google Sheet is not configured. Set VITE_RSVP_WEBAPP_URL after deploying the Apps Script.')
          : forbidden
          ? (lang === 'vi'
            ? 'Web app Google đang khóa (403). Deploy lại: Execute as Me, Who has access = Bất kỳ ai (Anyone).'
            : lang === 'zh'
            ? 'Google 网页应用返回 403。请重新部署为 Anyone（任何人）。'
            : 'Google web app returned 403. Redeploy with Execute as Me and Who has access = Anyone.')
          : (lang === 'vi'
            ? 'Không gửi được xác nhận. Quý khách vui lòng thử lại.'
            : lang === 'zh'
            ? '提交失败，请再试一次。'
            : 'Could not submit your RSVP. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const groomName = lang === 'vi' ? couple.groomNameVi || couple.groomName : lang === 'zh' ? couple.groomNameZh || couple.groomName : couple.groomName;
  const brideName = lang === 'vi' ? couple.brideNameVi || couple.brideName : lang === 'zh' ? couple.brideNameZh || couple.brideName : couple.brideName;
  const weddingDateStr = lang === 'vi' ? couple.weddingDateFormattedVi || couple.weddingDateFormatted : lang === 'zh' ? couple.weddingDateFormattedZh || couple.weddingDateFormatted : couple.weddingDateFormatted;
  const venueName = lang === 'vi' ? couple.venueNameVi || couple.venueName : lang === 'zh' ? couple.venueNameZh || couple.venueName : couple.venueName;
  const venueAddress = lang === 'vi' ? couple.venueAddressVi || couple.venueAddress : lang === 'zh' ? couple.venueAddressZh || couple.venueAddress : couple.venueAddress;

  const getInitials = () => {
    const g = couple.groomNameVi?.split(' ').pop()?.charAt(0) || 'H';
    const b = couple.brideNameVi?.split(' ').pop()?.charAt(0) || 'D';
    return `${g}&${b}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="envelope-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={handleResetAndClose}
        >
          <motion.div
            id="envelope-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#faf6f0] border border-[#d8c8b6] rounded-2xl shadow-2xl p-6 sm:p-8 text-center scrollbar-thin"
          >
            {/* Close Button */}
            <button
              id="close-envelope-btn"
              onClick={handleResetAndClose}
              className="absolute top-3 right-3 p-1.5 text-[#8c7b6d] hover:text-[#3d2e24] bg-[#ebdcd0]/80 rounded-full transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {isSealed ? (
              /* Sealed Envelope State */
              <div className="py-8 sm:py-12 flex flex-col items-center">
                <div className="mb-4 inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ebdcd0] text-[#6b5344] text-xs uppercase tracking-wider font-sans font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#9c6a46]" />
                  <span>{lang === 'vi' ? 'Thiệp Mời Riêng' : lang === 'zh' ? '专属请柬' : 'Personal Invitation'}</span>
                </div>

                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#3d2e24] mb-2">
                  {lang === 'vi' ? 'Trân Trọng Kính Mời' : lang === 'zh' ? '诚挚邀请' : 'You are Cordially Invited'}
                </h3>
                <p className="text-sm text-[#7a6b5e] max-w-xs mb-8">
                  {lang === 'vi' ? `Tới dự lễ báo hỷ của ${groomName} & ${brideName}` : lang === 'zh' ? `参加 ${groomName} & ${brideName} 的浪漫婚礼` : `To celebrate the wedding announcement of ${groomName} & ${brideName}`}
                </p>

                {/* Wax Seal Button */}
                <div className="relative group cursor-pointer flex flex-col items-center justify-center" onClick={handleOpenEnvelope}>
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9c382b] via-[#822418] to-[#59140b] shadow-xl flex flex-col items-center justify-center border-4 border-[#b4483a]/70 text-[#f5ebd9] transition-transform mx-auto"
                  >
                    <div className="flex items-center justify-center w-full text-center">
                      <span className="font-cinzel text-xl font-bold tracking-wider drop-shadow text-[#f5ebd9] text-center inline-block">
                        {getInitials()}
                      </span>
                    </div>
                    <Heart className="w-3.5 h-3.5 text-[#f5ebd9] fill-[#f5ebd9] mt-1 shrink-0" />
                  </motion.div>
                  <span className="block mt-4 text-xs font-semibold uppercase tracking-wider text-[#8c5e3d] group-hover:text-[#5c3e26] transition text-center font-sans">
                    {lang === 'vi' ? 'Bấm để mở thiệp' : lang === 'zh' ? '拆开火漆印信' : 'Break Seal to Open'}
                  </span>
                </div>
              </div>
            ) : modalView === 'letter' ? (
              /* Unfolded Formal Letter State */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="py-4"
              >
                {/* Botanical Crest */}
                <div className="flex justify-center items-center space-x-3 mb-4 text-[#a37956]">
                  <span className="h-[1px] w-10 bg-[#cfb9a5]"></span>
                  <Heart className="w-4 h-4 fill-[#c4a480] text-[#c4a480]" />
                  <span className="h-[1px] w-10 bg-[#cfb9a5]"></span>
                </div>

                {/* Names First */}
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2d221a] mt-2 mb-1.5 leading-tight flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1">
                  <span>{groomName}</span>
                  <span className="text-xl sm:text-2xl font-script text-[#9c6a46] italic font-serif">&</span>
                  <span>{brideName}</span>
                </h2>

                {/* Subtitle / Families */}
                <span className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-[#8c6d53] block mb-4">
                  {lang === 'vi' ? 'CÙNG GIA ĐÌNH HAI HỌ' : lang === 'zh' ? '两姓联姻 · 谨定于' : 'Together With Their Families'}
                </span>

                <p className="text-xs sm:text-sm text-[#736356] italic max-w-md mx-auto mb-6">
                  {lang === 'vi'
                    ? 'Trân trọng kính mời quý khách tới tham dự lễ báo hỷ và chung vui cùng gia đình chúng tôi'
                    : lang === 'zh'
                    ? '诚邀您莅临见证我们的婚礼，分享这份爱与幸福。'
                    : 'Invite you to share in the joy and blessings of our wedding celebration as we exchange sacred vows.'}
                </p>

                <div className="bg-[#ffffff] border border-[#e8dcd0] rounded-xl p-4 sm:p-5 mb-6 text-left shadow-xs space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-[#4a3c31]">
                    <Calendar className="w-4 h-4 text-[#9c6a46] shrink-0" />
                    <div>
                      <span className="font-medium block">{weddingDateStr}</span>
                      <span className="text-xs text-[#8c7b6d]">{lang === 'vi' ? 'Đón khách lúc 18:00' : lang === 'zh' ? '迎宾时间 18:00' : 'Welcome guests at 6:00 PM'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-[#4a3c31]">
                    <MapPin className="w-4 h-4 text-[#9c6a46] shrink-0" />
                    <div>
                      <span className="font-medium block">{venueName}</span>
                      <span className="text-xs text-[#8c7b6d]">{venueAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setModalView('rsvp')}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-sans font-bold tracking-wider text-[#331c00] bg-gradient-to-r from-[#ffd778] to-[#d4af37] hover:brightness-110 active:scale-98 rounded-full transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#331c00]" />
                    <span>{lang === 'vi' ? 'Xác Nhận Tham Dự' : lang === 'zh' ? '确认出席 · 宾客回执' : 'RSVP · Confirm Attendance'}</span>
                  </button>
                </div>
              </motion.div>
            ) : modalView === 'rsvp' ? (
              /* RSVP Form State */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="py-2 text-left"
              >
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 pb-3 mb-4 border-b border-[#ebdcd0]">
                  <button
                    type="button"
                    onClick={() => setModalView('letter')}
                    className="justify-self-start inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8c6d53] hover:text-[#433124] transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">{lang === 'vi' ? 'Xem lại thiệp' : lang === 'zh' ? '返回请函' : 'Back to Invitation'}</span>
                  </button>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8c6d53] text-center px-1 whitespace-nowrap">
                    {lang === 'vi' ? 'Xác Nhận Tham Dự' : lang === 'zh' ? '出席回执' : 'RSVP'}
                  </span>
                  <span aria-hidden="true" />
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  {/* Attendance choice */}
                  <div>
                    <label className="block text-xs font-semibold text-[#665446] uppercase tracking-wider mb-2 text-center">
                      {lang === 'vi' ? 'Quý khách sẽ tham dự chứ?' : lang === 'zh' ? '您是否能够出席？' : 'Will you attend?'}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'yes' })}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                          formData.attending === 'yes'
                            ? 'bg-[#5c4636] text-white border-[#5c4636] shadow-sm'
                            : 'bg-white text-[#6b584a] border-[#d8c8b6] hover:bg-[#f3ece2]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{lang === 'vi' ? 'Sẽ Tham Dự' : lang === 'zh' ? '欣然出席' : 'Accept with Pleasure'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'no' })}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                          formData.attending === 'no'
                            ? 'bg-[#8c6b4e] text-white border-[#8c6b4e] shadow-sm'
                            : 'bg-white text-[#6b584a] border-[#d8c8b6] hover:bg-[#f3ece2]'
                        }`}
                      >
                        <XCircle className="w-4 h-4 text-rose-300 shrink-0" />
                        <span>{lang === 'vi' ? 'Không Thể Đến' : lang === 'zh' ? '遗憾缺席' : 'Declines with Regret'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c4636] mb-1">
                      {lang === 'vi' ? 'Họ và tên của quý khách *' : lang === 'zh' ? '您的姓名 *' : 'Your Full Name *'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={lang === 'vi' ? 'Ví dụ: Nguyễn Văn A' : lang === 'zh' ? '请输入姓名' : 'e.g. Nguyen Van A'}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#d8c8b6] bg-white text-xs sm:text-sm text-[#2d221a] focus:ring-1 focus:ring-[#8c6b4e] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-[#9c8470] absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Guests count if attending */}
                  {formData.attending === 'yes' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#5c4636] mb-1">
                        {lang === 'vi' ? 'Số lượng khách tham dự' : lang === 'zh' ? '出席人数' : 'Number of Guests'}
                      </label>
                      <div className="relative">
                        <select
                          value={formData.guestsCount}
                          onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#d8c8b6] bg-white text-xs sm:text-sm text-[#2d221a] focus:ring-1 focus:ring-[#8c6b4e] focus:outline-none"
                        >
                          <option value={1}>{lang === 'vi' ? '1 người (Đi một mình)' : lang === 'zh' ? '1位宾客' : '1 guest (just me)'}</option>
                          <option value={2}>{lang === 'vi' ? '2 người (Đi cùng người thương/bạn)' : lang === 'zh' ? '2位宾客' : '2 guests (with a plus-one)'}</option>
                          <option value={3}>{lang === 'vi' ? '3 người (Gia đình nhỏ)' : lang === 'zh' ? '3位宾客' : '3 guests (small family)'}</option>
                        </select>
                        <Users className="w-4 h-4 text-[#9c8470] absolute left-3 top-3" />
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c4636] mb-1">
                      {lang === 'vi' ? 'Lời chúc gửi đến cô dâu chú rể (Tùy chọn)' : lang === 'zh' ? '祝福寄语（选填）' : 'Wishes for the couple'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={lang === 'vi' ? 'Chúc hai bạn trăm năm hạnh phúc, mãi mãi bên nhau!' : lang === 'zh' ? '送上真挚祝福...' : 'Wishing you a lifetime of happiness together!'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c8b6] bg-white text-xs sm:text-sm text-[#2d221a] focus:ring-1 focus:ring-[#8c6b4e] focus:outline-none"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#5c4636] hover:bg-[#433124] active:scale-98 text-white font-bold text-xs sm:text-sm tracking-wider transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    <Send className={`w-4 h-4 ${submitting ? 'animate-pulse' : ''}`} />
                    <span>
                      {submitting
                        ? (lang === 'vi' ? 'Đang gửi...' : lang === 'zh' ? '提交中...' : 'Sending...')
                        : (lang === 'vi' ? 'Gửi Xác Nhận Tham Dự' : lang === 'zh' ? '提交回执' : 'Submit RSVP')}
                    </span>
                  </button>
                </form>
              </motion.div>
            ) : (
              /* RSVP Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2d221a]">
                    {lang === 'vi' ? 'Xác Nhận Thành Công!' : lang === 'zh' ? '回执已成功提交！' : 'RSVP Confirmed!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665446] mt-1 max-w-sm mx-auto">
                    {lang === 'vi'
                      ? `Cảm ơn ${savedRSVP?.fullName || formData.fullName}, chúng tôi đã ghi nhận phản hồi của quý khách.`
                      : `Thank you, we have recorded your attendance response.`}
                  </p>
                </div>

                <div className="bg-white border border-[#e8dcd0] rounded-xl p-4 text-xs sm:text-sm text-left max-w-sm mx-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8c7b6d]">{lang === 'vi' ? 'Trạng thái:' : 'Status:'}</span>
                    <span className="font-bold text-emerald-700">
                      {savedRSVP?.attending === 'yes' ? (lang === 'vi' ? 'Sẽ tham dự' : lang === 'zh' ? '欣然出席' : 'Attending') : (lang === 'vi' ? 'Không thể tham dự' : lang === 'zh' ? '遗憾缺席' : 'Declined')}
                    </span>
                  </div>
                  {savedRSVP?.attending === 'yes' && (
                    <div className="flex justify-between">
                      <span className="text-[#8c7b6d]">{lang === 'vi' ? 'Số lượng khách:' : 'Party size:'}</span>
                      <span className="font-medium text-[#2d221a]">{savedRSVP?.guestsCount} {lang === 'vi' ? 'người' : lang === 'zh' ? '位宾客' : 'guest(s)'}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => setModalView('rsvp')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#d8c8b6] bg-white text-xs font-semibold text-[#5c4636] hover:bg-[#f5ede2] transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Sửa Phản Hồi' : lang === 'zh' ? '修改回执' : 'Edit Response'}</span>
                  </button>

                  <button
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#5c4636] hover:bg-[#433124] text-xs font-bold text-white transition shadow-md cursor-pointer"
                  >
                    {lang === 'vi' ? 'Hoàn Tất & Đóng' : lang === 'zh' ? '完成并关闭' : 'Done & Close'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

