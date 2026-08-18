import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Sparkles, HeartHandshake, Utensils, Music, GlassWater, Calendar } from 'lucide-react';
import { ScheduleEvent, CoupleInfo, LanguageMode } from '../types';
import { generateGoogleCalendarUrl } from '../utils/calendar';

interface EventsScheduleProps {
  events: ScheduleEvent[];
  couple: CoupleInfo;
  lang?: LanguageMode;
}

export const EventsSchedule: React.FC<EventsScheduleProps> = ({ events, couple, lang = 'vi' }) => {
  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'glass-water':
        return GlassWater;
      case 'heart-handshake':
        return HeartHandshake;
      case 'sparkles':
        return Sparkles;
      case 'utensils':
        return Utensils;
      case 'music':
        return Music;
      default:
        return Clock;
    }
  };

  const dateFormatted = lang === 'vi' ? couple.weddingDateFormattedVi || couple.weddingDateFormatted : lang === 'zh' ? couple.weddingDateFormattedZh || couple.weddingDateFormatted : couple.weddingDateFormatted;

  return (
    <section id="schedule" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#faf7f2] border-t border-[#f0e6dc]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            {lang === 'vi' ? 'Thời Gian & Lịch Trình' : lang === 'zh' ? '婚礼日程 · 良辰吉时' : 'Order of Events'}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            {lang === 'vi' ? 'Chương Trình Lễ Báo Hỷ' : lang === 'zh' ? '婚礼当天详细流程' : 'Wedding Day Itinerary'}
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif">
            {dateFormatted} — {lang === 'vi' ? 'Kính mời quý khách tham dự đúng giờ để cùng chia sẻ trọn vẹn từng khoảnh khắc ngọt ngào.' : 'Join us for every magical chapter from vows to celebration.'}
          </p>
        </div>

        {/* Schedule Cards Grid */}
        <div className="space-y-6 sm:space-y-8">
          {events.map((event, index) => {
            const IconComponent = getEventIcon(event.icon);
            const title = lang === 'vi' ? event.titleVi || event.title : lang === 'zh' ? event.titleZh || event.title : event.title;
            const subtitle = lang === 'vi' ? event.subtitleVi || event.subtitle : lang === 'zh' ? event.subtitleZh || event.subtitle : event.subtitle;
            const description = lang === 'vi' ? event.descriptionVi || event.description : lang === 'zh' ? event.descriptionZh || event.description : event.description;
            const location = lang === 'vi' ? event.locationVi || event.location : lang === 'zh' ? event.locationZh || event.location : event.location;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white border border-[#ebdcd0] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Time & Icon */}
                <div className="flex items-start sm:items-center space-x-4 md:w-1/3 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf5ee] border border-[#e2d5c7] flex items-center justify-center text-[#9c6843] shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 text-[#8c6b4e] font-cinzel text-xs uppercase tracking-wider font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time} {event.endTime ? `– ${event.endTime}` : ''}</span>
                    </div>
                    <span className="text-xs text-[#8c7b6d] font-medium block mt-0.5">
                      {subtitle}
                    </span>
                  </div>
                </div>

                {/* Center Content */}
                <div className="md:w-1/2 space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2d221a]">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665446] leading-relaxed">
                    {description}
                  </p>
                  {event.dressCode && (
                    <div className="inline-block mt-2 px-3 py-1 bg-[#faf4ec] border border-[#ebdccf] rounded-full text-[11px] font-medium text-[#7a593e]">
                      ✨ {event.dressCode}
                    </div>
                  )}
                </div>

                {/* Right Location Spot */}
                <div className="md:w-1/4 flex md:flex-col md:items-end justify-between items-center pt-3 md:pt-0 border-t md:border-t-0 border-[#f2e7dc]">
                  <span className="inline-flex items-center space-x-1 text-xs text-[#6e5d50] bg-[#f9f5f0] px-3 py-1.5 rounded-lg border border-[#ebdcd0]">
                    <MapPin className="w-3.5 h-3.5 text-[#9c6843] shrink-0" />
                    <span>{location}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quick Calendar Reminder */}
        <div className="mt-12 text-center bg-[#f5efe6] border border-[#e0d0c0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif text-lg sm:text-xl text-[#3d2e24]">
              {lang === 'vi' ? 'Đừng Bỏ Lỡ Bất Kỳ Khoảnh Khắc Nào' : 'Don\'t Miss a Single Moment'}
            </h4>
            <p className="text-xs sm:text-sm text-[#736356]">
              {lang === 'vi' ? 'Thêm sự kiện trực tiếp vào Google Calendar hoặc Apple iCal để nhận nhắc nhở đúng giờ.' : 'Sync the schedule directly to your Google Calendar or Apple iCal with automated reminders.'}
            </p>
          </div>
          <a
            href={generateGoogleCalendarUrl(couple)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-xs uppercase font-cinzel font-semibold tracking-wider text-white bg-[#5c4636] hover:bg-[#433124] transition shadow-xs flex items-center space-x-2 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Lưu Lịch Hẹn' : 'Sync to Calendar'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
