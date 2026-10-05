import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import type { TranslationContent } from '../data/translations';

interface TestimonialsSectionProps {
  t: TranslationContent;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ t }) => {
  return (
    <section id="testimonials" className="relative py-24 bg-[#0D0D0D]">
      
      {/* Gold line decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.testimonials.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item, index) => (
            <div
              key={index}
              className="glass-gold-card rounded-3xl p-8 flex flex-col justify-between relative border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#D4AF37]/15 pointer-events-none" />

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-[#D4AF37] mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-sm sm:text-base text-[#F8F5F0]/95 font-light leading-relaxed mb-8 italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-6 border-t border-[#D4AF37]/15 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold font-arabic-heading text-gold-gradient">
                    {item.name}
                  </h4>
                  <span className="text-xs text-[#C0B7A6] block mt-0.5">
                    {item.role}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] font-medium bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
