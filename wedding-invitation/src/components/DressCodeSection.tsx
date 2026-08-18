import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun, Check, Shirt } from 'lucide-react';
import { ColorSwatch, LanguageMode } from '../types';

interface DressCodeSectionProps {
  colors: ColorSwatch[];
  lang?: LanguageMode;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ colors, lang = 'vi' }) => {
  return (
    <section id="attire" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#faf7f2] border-t border-[#f0e6dc]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            {lang === 'vi' ? 'Trang Phục Dự Tiệc' : 'Style Guide'}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {lang === 'vi' ? 'Dress Code & Gam Màu Chủ Đạo' : 'Dress Code & Aesthetic'}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif">
            {lang === 'vi'
              ? 'Trang phục thanh lịch, sang trọng với các tông màu ấm áp, hài hòa cùng không gian sảnh tiệc hoàng gia.'
              : 'Formal & Elegant Attire. We invite our guests to dress in harmony with our joyful celebration.'}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div className="bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-10 shadow-xs mb-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] font-semibold block mb-1">
              {lang === 'vi' ? 'Bảng Màu Gợi Ý' : 'Color Inspiration'}
            </span>
            <h3 className="font-serif text-2xl text-[#2d221a]">
              {lang === 'vi' ? 'Tone Màu Tiệc Cưới' : 'The Wedding Color Palette'}
            </h3>
            <p className="text-xs sm:text-sm text-[#7a6b5e] mt-1 max-w-md mx-auto">
              {lang === 'vi'
                ? 'Khách mời có thể lựa chọn trang phục theo các tone màu gợi ý dưới đây để có những bức ảnh kỷ niệm tuyệt đẹp nhất.'
                : 'Guests are warmly encouraged (though not required) to choose attire inspired by our palette.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {colors.map((color, index) => {
              const colorName = lang === 'vi' ? color.nameVi || color.name : lang === 'zh' ? color.nameZh || color.name : color.name;
              const colorDesc = lang === 'vi' ? color.descriptionVi || color.description : lang === 'zh' ? color.descriptionZh || color.description : color.description;
              return (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#faf7f2] border border-[#eee4d8]"
                >
                  {/* Swatch Circle */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-inner mb-3 border-2 border-white"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-serif text-sm font-medium text-[#2d221a] mb-0.5">
                    {colorName}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#8c7b6d] tracking-wider mb-1">
                    {color.hex}
                  </span>
                  <span className="text-[11px] text-[#736356] leading-tight">
                    {colorDesc}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Attire Recommendations (Ladies & Gentlemen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* For Ladies */}
          <div className="bg-white border border-[#ebdcd0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fbf3ec] border border-[#ebdcd0] flex items-center justify-center text-[#9c6843]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#2d221a]">
                {lang === 'vi' ? 'Dành Cho Quý Cô' : 'For Ladies'}
              </h4>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#665446] leading-relaxed">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Váy dạ hội dài, đầm cocktail trang nhã, hoặc set váy áo thanh lịch.' : 'Floor-length gowns, refined cocktail dresses, or elegant dressy jumpsuits.'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Chất liệu gợi ý: Lụa, satin, voan tơ, ren cao cấp hoặc gấm thêu.' : 'Textures: Silk, satin, chiffon, organza, linen blends, and botanical lace.'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Giày cao gót thanh mảnh hoặc sandal quai mảnh êm chân phù hợp di chuyển và chụp ảnh lưu niệm.' : 'Stylish heels or flats are recommended for ease and comfort.'}</span>
              </li>
            </ul>
          </div>

          {/* For Gentlemen */}
          <div className="bg-white border border-[#ebdcd0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fbf3ec] border border-[#ebdcd0] flex items-center justify-center text-[#9c6843]">
                <Shirt className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#2d221a]">
                {lang === 'vi' ? 'Dành Cho Quý Ông' : 'For Gentlemen'}
              </h4>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#665446] leading-relaxed">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Bộ suit lịch lãm, áo vest phối quần âu, hoặc sơ mi chỉnh chu.' : 'Tuxedos or tailored dark suits.'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Áo sơ mi sáng màu, có thể kết hợp cùng cà vạt hoặc nơ cổ.' : 'Crisp collared dress shirts with necktie or bowtie.'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#8c6b4e] shrink-0 mt-0.5" />
                <span>{lang === 'vi' ? 'Giày tây da bóng hoặc giày lười da sang trọng.' : 'Polished leather dress shoes or elegant loafers.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Note */}
        <div className="bg-[#f5ede3] border border-[#e0d0c0] rounded-2xl p-5 sm:p-6 flex items-center space-x-4 text-xs sm:text-sm text-[#665446]">
          <Sun className="w-5 h-5 text-[#9c6843] shrink-0" />
          <p>
            {lang === 'vi'
              ? 'Sảnh tiệc IMPERIAL có máy lạnh trung tâm mát mẻ. Quý khách vui lòng chuẩn bị trang phục vừa vặn thoải mái để tận hưởng trọn vẹn buổi tiệc.'
              : 'The banquet hall is fully air-conditioned. Please dress comfortably to enjoy the evening celebration.'}
          </p>
        </div>
      </div>
    </section>
  );
};
