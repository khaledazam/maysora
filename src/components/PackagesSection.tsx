import React from 'react';
import { CheckCircle2, Star, Sparkles, Building2, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface PackagesSectionProps {
  lang: Language;
  t: TranslationContent;
  onSelectPackage: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  t,
  onSelectPackage
}) => {
  return (
    <section id="packages" className="relative py-24 bg-[#0D0D0D]">
      
      {/* Decorative center background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.packages.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.packages.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.packages.subtitle}
          </p>
        </div>

        {/* 3 Packages Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.packages.items.map((pkg, index) => {
            const isFeatured = index === 1; // Royal Hajj featured

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 ${
                  isFeatured
                    ? 'glass-gold-card border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 scale-105 z-20 bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A] to-[#141414]'
                    : 'glass-gold-card border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}
              >
                {/* Most Popular Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gold-gradient text-[#0D0D0D] text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#0D0D0D]" />
                    <span>{t.packages.mostPopular}</span>
                  </div>
                )}

                <div>
                  {/* Category & Name */}
                  <div className="mb-6">
                    <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase block mb-1">
                      {pkg.category}
                    </span>
                    <h3 className="text-2xl font-bold font-arabic-heading text-[#F8F5F0]">
                      {pkg.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#D4AF37]/20 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-gold-gradient">
                      {pkg.price}
                    </span>
                    {pkg.price !== 'حسب الطلب' && pkg.price !== 'Bespoke Quote' && (
                      <span className="text-sm font-semibold text-[#C0B7A6]">
                        {t.packages.currency}
                      </span>
                    )}
                    <span className="text-xs text-[#C0B7A6]/70 ml-2">
                      / {pkg.duration}
                    </span>
                  </div>

                  {/* Top Highlights */}
                  <div className="space-y-3 mb-6 bg-[#0D0D0D]/60 p-4 rounded-2xl border border-[#D4AF37]/10">
                    <div className="flex items-center gap-3 text-xs text-[#F8F5F0]">
                      <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{pkg.hotel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#F8F5F0]">
                      <PlaneTakeoff className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{pkg.flight}</span>
                    </div>
                  </div>

                  {/* Included Financial Perk Highlight */}
                  <div className="mb-6 p-3 rounded-xl bg-gold-subtle-gradient border border-[#D4AF37]/30 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-xs font-medium text-[#FFF0B3]">
                      {pkg.financialPerk}
                    </span>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F8F5F0]/90">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPackage(pkg.name)}
                  className={`w-full py-3.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-gold-gradient text-[#0D0D0D] hover:brightness-110 shadow-[#D4AF37]/30'
                      : 'bg-black/50 border border-[#D4AF37]/40 text-[#F8F5F0] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.packages.bookNow}</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
