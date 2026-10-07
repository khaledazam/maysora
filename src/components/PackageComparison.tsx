import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface PackageComparisonProps {
  lang: Language;
  t: TranslationContent;
  onSelectPackage: (packageName: string) => void;
  isEmbedded?: boolean;
}

export const PackageComparison: React.FC<PackageComparisonProps> = ({
  lang,
  t,
  onSelectPackage,
  isEmbedded = false
}) => {
  const content = (
    <div>
      {!isEmbedded && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.comparison.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.comparison.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>
      )}

      {/* Comparison Table Container */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[760px] glass-gold-card rounded-3xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-black/60 border-b border-[#D4AF37]/25 p-5 text-sm font-bold text-[#F8F5F0]">
            <div className="col-span-3 text-start text-[#D4AF37]">
              {t.comparison.colFeature}
            </div>
            
            <div className="col-span-3 text-center">
              <span>{t.comparison.colExec}</span>
            </div>
            
            <div className="col-span-3 text-center relative">
              <span className="text-gold-gradient font-bold">{t.comparison.colRoyal}</span>
              <span className="block text-[10px] text-[#D4AF37] font-normal tracking-wide">
                {t.packages.mostPopular}
              </span>
            </div>
            
            <div className="col-span-3 text-center">
              <span>{t.comparison.colImperial}</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#D4AF37]/15">
            {t.comparison.features.map((feat, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center transition-colors ${
                  idx % 2 === 0 ? 'bg-black/20' : 'bg-transparent'
                } hover:bg-[#D4AF37]/5`}
              >
                <div className="col-span-3 font-semibold text-[#F8F5F0] pr-2">
                  {feat.name}
                </div>
                
                <div className="col-span-3 text-center text-[#C0B7A6] px-2 leading-relaxed">
                  {feat.exec}
                </div>
                
                <div className="col-span-3 text-center font-medium text-[#FFF0B3] bg-[#D4AF37]/5 py-2 rounded-xl px-2 leading-relaxed border border-[#D4AF37]/15">
                  {feat.royal}
                </div>
                
                <div className="col-span-3 text-center text-[#C0B7A6] px-2 leading-relaxed">
                  {feat.imperial}
                </div>
              </div>
            ))}
          </div>

          {/* Table Action Footers */}
          <div className="grid grid-cols-12 bg-black/70 border-t border-[#D4AF37]/25 p-5 items-center gap-4">
            <div className="col-span-3 text-xs text-[#C0B7A6] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar-sa' ? 'ضمان الخصوصية والراحة' : (lang === 'en' ? 'Private & Certified' : 'ضمان الراحة والاعتماد')}</span>
            </div>

            <div className="col-span-3">
              <button
                type="button"
                onClick={() => onSelectPackage(t.comparison.colExec)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-[#F8F5F0] bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer"
              >
                {t.packages.bookNow}
              </button>
            </div>

            <div className="col-span-3">
              <button
                type="button"
                onClick={() => onSelectPackage(t.comparison.colRoyal)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg shadow-[#D4AF37]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-[#0D0D0D]" />
                <span>{t.packages.bookNow}</span>
              </button>
            </div>

            <div className="col-span-3">
              <button
                type="button"
                onClick={() => onSelectPackage(t.comparison.colImperial)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-[#F8F5F0] bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer"
              >
                {t.packages.bookNow}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <section id="comparison" className="relative py-24 bg-[#141414] overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {content}
      </div>
    </section>
  );
};
