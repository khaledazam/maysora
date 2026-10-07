import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface JourneyTimelineProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultationModal?: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  lang,
  t
}) => {
  const isRtl = lang !== 'en';

  return (
    <section id="journey" className="relative py-24 bg-[#0D0D0D] overflow-hidden">
      
      {/* Decorative Golden Line Glow */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.timeline.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.timeline.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.timeline.subtitle}
          </p>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {t.timeline.steps.map((step, index) => (
            <div
              key={index}
              className="group glass-gold-card rounded-3xl p-6 flex flex-col justify-between border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 hover:-translate-y-2 relative"
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-extrabold text-gold-gradient font-serif-en opacity-90 group-hover:scale-110 transition-transform">
                  {step.number}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-gold-gradient group-hover:text-[#0D0D0D] transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-base sm:text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#C0B7A6] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Status pill */}
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 flex items-center gap-1.5 text-[11px] text-[#D4AF37]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar-sa' ? 'معتمد ومنسّق' : (lang === 'en' ? 'VIP Milestone' : 'مرحلة معتمدة')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-16 text-center">
          <a
            href="#packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-xl shadow-[#D4AF37]/20 cursor-pointer transition-all"
          >
            <span>{t.packages.bookNow}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

      </div>
    </section>
  );
};
