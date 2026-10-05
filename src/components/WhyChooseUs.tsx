import React from 'react';
import { Crown, Scale, ShieldCheck, Clock, Compass, Gem } from 'lucide-react';
import type { TranslationContent } from '../data/translations';

interface WhyChooseUsProps {
  t: TranslationContent;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ t }) => {
  const icons = [Crown, Scale, ShieldCheck, Clock, Compass, Gem];

  return (
    <section id="why-us" className="relative py-24 bg-[#141414] overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.whyUs.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.whyUs.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 6 Grid Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.whyUs.items.map((item, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={index}
                className="group glass-gold-card rounded-3xl p-8 transition-all duration-300 hover:border-[#D4AF37]/50 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-[#0D0D0D] transition-all">
                  <IconComponent className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold font-arabic-heading text-[#F8F5F0] mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#C0B7A6] leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
