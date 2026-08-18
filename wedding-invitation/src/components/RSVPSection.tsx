import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Heart,
  Users,
  Utensils,
  Music,
  Send,
  Sparkles,
  Edit3,
  Calendar,
  MapPin,
  Check,
} from 'lucide-react';
import { RSVPData, CoupleInfo } from '../types';

interface RSVPSectionProps {
  couple: CoupleInfo;
  onNewWishAdded?: (name: string, message: string) => void;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ couple, onNewWishAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attending: 'yes' as 'yes' | 'no',
    guestsCount: 1,
    mealChoice: 'Filet Mignon & Herb Butter',
    dietaryRestrictions: '',
    songRequest: '',
    message: '',
  });

  const [savedRSVP, setSavedRSVP] = useState<RSVPData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_rsvp_submission');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedRSVP(parsed);
        setFormData(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a3b18a', '#ddbea9', '#cb997e', '#b39268', '#f3ede2'],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    const rsvpRecord: RSVPData = {
      id: savedRSVP?.id || `rsvp-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      attending: formData.attending,
      guestsCount: formData.attending === 'yes' ? Number(formData.guestsCount) : 0,
      mealChoice: formData.attending === 'yes' ? formData.mealChoice : 'N/A',
      dietaryRestrictions: formData.dietaryRestrictions.trim(),
      songRequest: formData.songRequest.trim(),
      message: formData.message.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    localStorage.setItem('wedding_rsvp_submission', JSON.stringify(rsvpRecord));
    setSavedRSVP(rsvpRecord);
    setIsEditing(false);
    setSubmittedMessage(true);

    if (formData.attending === 'yes') {
      triggerConfetti();
    }

    if (formData.message && onNewWishAdded) {
      onNewWishAdded(formData.fullName, formData.message);
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#faf7f2] border-t border-[#f0e6dc]">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            Will You Join Us?
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            RSVP & Attendance
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif">
            Kindly respond by <strong>September 15, 2026</strong>. We look forward to creating everlasting memories together!
          </p>
        </div>

        {/* Confirmation Card if already submitted and not editing */}
        {savedRSVP && !isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-10 shadow-md text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#f4ece3] border border-[#d6c4b2] flex items-center justify-center text-[#8c5e3d] mx-auto mb-4">
              {savedRSVP.attending === 'yes' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              ) : (
                <Heart className="w-8 h-8 text-[#8c5e3d]" />
              )}
            </div>

            <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] font-semibold block mb-1">
              Response Confirmed
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d221a] mb-2">
              Thank You, {savedRSVP.fullName}!
            </h3>

            <p className="text-sm text-[#665446] max-w-md mx-auto mb-6">
              {savedRSVP.attending === 'yes'
                ? `We are overjoyed that you will be joining our wedding celebration! We have recorded ${savedRSVP.guestsCount} attending guest(s).`
                : 'Thank you for letting us know. You will be missed dearly and will be in our thoughts on our special day.'}
            </p>

            {/* Ticket Summary */}
            <div className="bg-[#faf7f2] border border-[#e5d8cb] rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3 mb-8 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-[#ebdcd0]">
                <span className="text-[#8c7b6d] font-cinzel text-xs uppercase">Attendance</span>
                <span className={`font-semibold ${savedRSVP.attending === 'yes' ? 'text-emerald-700' : 'text-[#8c5e3d]'}`}>
                  {savedRSVP.attending === 'yes' ? 'Joyfully Attending' : 'Regretfully Declining'}
                </span>
              </div>

              {savedRSVP.attending === 'yes' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-[#ebdcd0]">
                    <span className="text-[#8c7b6d] font-cinzel text-xs uppercase">Party Size</span>
                    <span className="font-medium text-[#2d221a]">{savedRSVP.guestsCount} Guest(s)</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#ebdcd0]">
                    <span className="text-[#8c7b6d] font-cinzel text-xs uppercase">Selected Entrée</span>
                    <span className="font-medium text-[#2d221a]">{savedRSVP.mealChoice}</span>
                  </div>

                  {savedRSVP.dietaryRestrictions && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#ebdcd0]">
                      <span className="text-[#8c7b6d] font-cinzel text-xs uppercase">Dietary Notes</span>
                      <span className="font-medium text-[#2d221a]">{savedRSVP.dietaryRestrictions}</span>
                    </div>
                  )}

                  {savedRSVP.songRequest && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#ebdcd0]">
                      <span className="text-[#8c7b6d] font-cinzel text-xs uppercase">Song Request</span>
                      <span className="font-medium text-[#2d221a]">"{savedRSVP.songRequest}"</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between items-center pt-1 text-[11px] text-[#99887a]">
                <span>Confirmed on: {savedRSVP.submittedAt}</span>
                <span>ID: #{savedRSVP.id.slice(-6)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="edit-rsvp-btn"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase font-cinzel font-semibold tracking-wider text-[#5c4636] bg-[#faf7f2] border border-[#d8c5b3] hover:bg-[#f3ece2] transition flex items-center justify-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modify Response</span>
              </button>

              <a
                href="#schedule"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase font-cinzel font-bold tracking-wider text-white bg-[#5c4636] hover:bg-[#433124] transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Review Schedule</span>
              </a>
            </div>
          </motion.div>
        ) : (
          /* Interactive RSVP Form */
          <form
            id="wedding-rsvp-form"
            onSubmit={handleSubmit}
            className="bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6"
          >
            {/* Attendance Toggle Pill */}
            <div className="text-center pb-4 border-b border-[#f0e6dc]">
              <label className="text-xs uppercase font-cinzel tracking-[0.2em] font-semibold text-[#8c6b4e] block mb-3">
                Will you be attending? *
              </label>
              <div className="inline-flex p-1 bg-[#faf7f2] border border-[#ebdcd0] rounded-full max-w-md w-full">
                <button
                  type="button"
                  id="rsvp-attend-yes"
                  onClick={() => setFormData({ ...formData, attending: 'yes' })}
                  className={`flex-1 py-3 px-4 rounded-full text-xs font-cinzel font-semibold tracking-wider transition flex items-center justify-center space-x-2 ${
                    formData.attending === 'yes'
                      ? 'bg-[#5c4636] text-white shadow-xs'
                      : 'text-[#6b584a] hover:text-[#2d221a]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Joyfully Accepts</span>
                </button>
                <button
                  type="button"
                  id="rsvp-attend-no"
                  onClick={() => setFormData({ ...formData, attending: 'no' })}
                  className={`flex-1 py-3 px-4 rounded-full text-xs font-cinzel font-semibold tracking-wider transition flex items-center justify-center space-x-2 ${
                    formData.attending === 'no'
                      ? 'bg-[#8c6b4e] text-white shadow-xs'
                      : 'text-[#6b584a] hover:text-[#2d221a]'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Regretfully Declines</span>
                </button>
              </div>
            </div>

            {/* Guest Name & Attending Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                  Full Name(s) *
                </label>
                <input
                  type="text"
                  id="rsvp-input-name"
                  required
                  placeholder="e.g. Dr. Arthur & Eleanor Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
                />
              </div>

              {formData.attending === 'yes' ? (
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                    Number of Guests Attending *
                  </label>
                  <select
                    id="rsvp-select-guests"
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
                  >
                    <option value={1}>1 Guest (Just myself)</option>
                    <option value={2}>2 Guests (Plus-One / Couple)</option>
                    <option value={3}>3 Guests</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="rsvp-input-email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
                  />
                </div>
              )}
            </div>

            {/* Attending Specific Fields (Entree, Dietary, Songs) */}
            {formData.attending === 'yes' && (
              <div className="space-y-4 pt-2 border-t border-[#f0e6dc]">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                    Main Entrée Preference *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Filet Mignon & Herb Butter', label: 'Prime Filet Mignon', desc: 'Truffle potato purée & asparagus' },
                      { id: 'Pan-Seared Chilean Sea Bass', label: 'Chilean Sea Bass', desc: 'Citrus beurre blanc & saffron risotto' },
                      { id: 'Wild Mushroom Truffle Risotto (V/GF)', label: 'Botanical Risotto', desc: 'Vegetarian & Gluten-Free' },
                    ].map((meal) => (
                      <div
                        key={meal.id}
                        onClick={() => setFormData({ ...formData, mealChoice: meal.id })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition text-left ${
                          formData.mealChoice === meal.id
                            ? 'bg-[#f7efe6] border-[#8c6b4e] ring-1 ring-[#8c6b4e]'
                            : 'bg-[#faf7f2] border-[#ebdcd0] hover:border-[#cfbca8]'
                        }`}
                      >
                        <span className="font-serif text-sm font-semibold text-[#2d221a] block">
                          {meal.label}
                        </span>
                        <span className="text-[11px] text-[#736356] leading-tight block mt-0.5">
                          {meal.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                    Dietary Restrictions & Allergies
                  </label>
                  <input
                    type="text"
                    id="rsvp-input-dietary"
                    placeholder="e.g. Nut allergy, Gluten-free, Vegan, Dairy sensitivity..."
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                    Song to Get You on the Dance Floor
                  </label>
                  <input
                    type="text"
                    id="rsvp-input-song"
                    placeholder="e.g. Earth, Wind & Fire – September"
                    value={formData.songRequest}
                    onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
                  />
                </div>
              </div>
            )}

            {/* Note to the Couple */}
            <div>
              <label className="block text-xs uppercase font-cinzel font-semibold text-[#665446] tracking-wider mb-1.5">
                A Note or Blessing for the Couple (Optional)
              </label>
              <textarea
                id="rsvp-input-message"
                rows={3}
                placeholder="Share your sweet wishes, favorite memory, or words of wisdom..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-[#faf7f2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8c6b4e] text-sm text-[#2d221a]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="rsvp-submit-btn"
                className="w-full py-4 rounded-full text-xs uppercase font-cinzel font-bold tracking-[0.2em] text-white bg-[#4a3525] hover:bg-[#342418] transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Wedding RSVP</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
