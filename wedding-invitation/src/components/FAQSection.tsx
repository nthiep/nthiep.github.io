import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Facebook } from 'lucide-react';
import { CoupleInfo, FAQItem, LanguageMode } from '../types';

interface FAQSectionProps {
  faqs: FAQItem[];
  couple: CoupleInfo;
  lang?: LanguageMode;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, couple, lang = 'vi' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-[#f0e6dc]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {lang === 'vi' ? 'Thông Tin Cần Biết' : lang === 'zh' ? '宾客须知' : 'Frequently Asked Questions'}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto mt-4" />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg text-[#2d221a] font-medium pr-4">
                    {lang === 'vi' ? faq.questionVi || faq.question : lang === 'zh' ? faq.questionZh || faq.question : faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-[#ebdcd0] flex items-center justify-center text-[#8c6b4e] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#f2e7dc]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#665446] leading-relaxed border-t border-[#f0e6dc]">
                        {lang === 'vi' ? faq.answerVi || faq.answer : lang === 'zh' ? faq.answerZh || faq.answer : faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#f5ede3] border border-[#e2d2c1] rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto">
          <h4 className="font-serif text-xl text-[#2d221a] mb-1">
            {lang === 'vi' ? 'Quý Khách Cần Hỗ Trợ Thêm?' : lang === 'zh' ? '还有疑问？' : 'Still Have Questions?'}
          </h4>
          <p className="text-xs sm:text-sm text-[#6e5d50] mb-4">
            {lang === 'vi'
              ? 'Đừng ngần ngại liên hệ trực tiếp với cô dâu hoặc chú rể để được hỗ trợ chu đáo nhất.'
              : lang === 'zh'
              ? '欢迎随时联系新人，我们将悉心协助。'
              : 'Feel free to reach out to the couple anytime.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-cinzel font-semibold text-[#5c4636]">
            <a
              href={couple.groomFacebook || 'https://www.facebook.com/hiepzg'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#d6c4b2] hover:bg-[#fbf7f2] transition"
            >
              <Facebook className="w-3.5 h-3.5 text-[#9c6843]" />
              <span>{lang === 'vi' ? 'Chú Rể: Facebook' : lang === 'zh' ? '新郎：Facebook' : 'Groom: Facebook'}</span>
            </a>
            <a
              href={couple.brideFacebook || 'https://www.facebook.com/dung.thuy.740804'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#d6c4b2] hover:bg-[#fbf7f2] transition"
            >
              <Facebook className="w-3.5 h-3.5 text-[#9c6843]" />
              <span>{lang === 'vi' ? 'Cô Dâu: Facebook' : lang === 'zh' ? '新娘：Facebook' : 'Bride: Facebook'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
