import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Coffee, MapPin, Sparkles, Quote, Calendar } from 'lucide-react';
import { CoupleInfo, StoryMilestone } from '../types';

interface CoupleStoryProps {
  couple: CoupleInfo;
  milestones: StoryMilestone[];
}

export const CoupleStory: React.FC<CoupleStoryProps> = ({ couple, milestones }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string>(milestones[0]?.id || '1');

  const getMilestoneIcon = (icon: string) => {
    switch (icon) {
      case 'coffee':
        return Coffee;
      case 'map-pin':
        return MapPin;
      case 'heart':
        return Heart;
      case 'sparkles':
      default:
        return Sparkles;
    }
  };

  return (
    <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#ffffff]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#8c6b4e] font-semibold block mb-2">
            The Two Souls
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2c211a] font-normal tracking-tight">
            Meet the Bride & Groom
          </h2>
          <div className="w-16 h-[1px] bg-[#d9c8b8] mx-auto my-4" />
          <p className="text-sm sm:text-base text-[#6f5e51] italic font-serif leading-relaxed">
            Two distinct paths, one serendipitous coffee spill in Florence, and a thousand beautiful memories leading to forever.
          </p>
        </div>

        {/* Couple Portraits & Bio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-24 max-w-4xl mx-auto">
          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs hover:shadow-md transition group"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={couple.brideImage}
                alt={couple.brideName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] font-semibold block mb-1">
              {couple.brideRole}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d221a] mb-3">
              {couple.brideName}
            </h3>
            <p className="text-xs sm:text-sm text-[#665446] leading-relaxed relative z-10">
              {couple.brideBio}
            </p>
            <div className="mt-4 pt-4 border-t border-[#ebdcd0] flex justify-center items-center space-x-1.5 text-xs text-[#8c6b4e] font-serif italic">
              <Quote className="w-3.5 h-3.5" />
              <span>“He makes ordinary days feel like poetry.”</span>
            </div>
          </motion.div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs hover:shadow-md transition group"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={couple.groomImage}
                alt={couple.groomName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] font-semibold block mb-1">
              {couple.groomRole}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d221a] mb-3">
              {couple.groomName}
            </h3>
            <p className="text-xs sm:text-sm text-[#665446] leading-relaxed relative z-10">
              {couple.groomBio}
            </p>
            <div className="mt-4 pt-4 border-t border-[#ebdcd0] flex justify-center items-center space-x-1.5 text-xs text-[#8c6b4e] font-serif italic">
              <Quote className="w-3.5 h-3.5" />
              <span>“Her smile is my absolute home.”</span>
            </div>
          </motion.div>
        </div>

        {/* Love Story Journey Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#8c6b4e] font-semibold block mb-1">
              Our Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#2c211a]">
              How Love Unfolded
            </h3>
          </div>

          <div className="relative">
            {/* Center Vertical Line (on desktop) */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1.5px] bg-[#e2d5c7] -translate-x-1/2" />

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => {
                const IconComponent = getMilestoneIcon(milestone.icon);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    } gap-6 md:gap-10`}
                  >
                    {/* Content Box */}
                    <div className="w-full md:w-1/2">
                      <div
                        className={`bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl p-5 sm:p-6 shadow-xs hover:border-[#cbb5a2] transition cursor-pointer ${
                          selectedMilestone === milestone.id ? 'ring-1 ring-[#a8744f]/60' : ''
                        }`}
                        onClick={() => setSelectedMilestone(milestone.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f2e5d8] text-[#785338] text-[11px] font-cinzel font-semibold tracking-wider">
                            {milestone.year}
                          </span>
                          <span className="text-xs text-[#8c7b6d] flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{milestone.date}</span>
                          </span>
                        </div>

                        <h4 className="font-serif text-xl sm:text-2xl text-[#2d221a] mb-2">
                          {milestone.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#665446] leading-relaxed mb-3">
                          {milestone.description}
                        </p>

                        {milestone.image && (
                          <div className="rounded-xl overflow-hidden h-36 sm:h-44 mt-3">
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Node Point (Center) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#f4ebe1] border-2 border-[#8c6b4e] items-center justify-center text-[#8c6b4e] shadow-sm z-10">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Spacer for alternate side */}
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
