import React from 'react';
import { ShieldCheck, Award, Users, TrendingUp, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface HeroProps {
  lang: Language;
  t: TranslationContent;
  onOpenBookingModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  t,
  onOpenBookingModal
}) => {
  const isRtl = lang !== 'en';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      
      {/* Background Image with Dark & Gold Overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/hero_bg.webp" type="image/webp" />
          <img
            src="/images/hero_bg.jpg"
            alt={isRtl ? "المسجد الحرام والكعبة المشرفة - باقات الحج والعمرة الفاخرة وأجنحة فندق الصفوة ميسورة" : "Masjid al-Haram Kaaba - Luxury Hajj and Umrah Concierge MAYSORA"}
            width={1440}
            height={810}
            loading="eager"
            // @ts-ignore
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          />
        </picture>
        {/* Layered Luxury Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/75 to-[#0D0D0D]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
      </div>

      {/* Decorative Golden Ambient Curves & Lines */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Certification Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold-card mb-8 animate-gold-pulse">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs sm:text-sm font-medium text-[#F8F5F0]">
            {t.hero.badge}
          </span>
        </div>

        {/* Hero Logo Emblem */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#FFF0B3] to-[#9A7B1C] shadow-2xl shadow-[#D4AF37]/30">
            <div className="w-full h-full bg-[#0D0D0D] rounded-full overflow-hidden flex items-center justify-center p-1">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.jpg"
                  alt={isRtl ? "شعار مكتب ميسورة لخدمات الحج والعمرة الفاخرة والكونسيرج الملكي" : "MAYSORA Luxury Hajj & Umrah Concierge Logo"}
                  width={112}
                  height={112}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="block text-[#F8F5F0] font-arabic-heading font-serif-en">
            {t.hero.title}
          </span>
          <span className="block text-gold-gradient font-arabic-heading font-serif-en mt-1">
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-[#C0B7A6] font-light leading-relaxed mb-10">
          {t.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center mb-16">
          <button
            onClick={onOpenBookingModal}
            className="w-full sm:w-auto px-10 py-4.5 rounded-full text-base font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>{t.hero.ctaPackage}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Trust Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-[#D4AF37]/20 glass-gold-card rounded-2xl p-6 sm:p-8">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gold-gradient mb-1">
              {t.hero.trustYears}
            </span>
            <span className="text-xs sm:text-sm text-[#C0B7A6] font-medium">
              {t.hero.trustYearsLabel}
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 text-[#D4AF37]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gold-gradient mb-1">
              {t.hero.trustPilgrims}
            </span>
            <span className="text-xs sm:text-sm text-[#C0B7A6] font-medium">
              {t.hero.trustPilgrimsLabel}
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gold-gradient mb-1">
              {t.hero.trustShariah}
            </span>
            <span className="text-xs sm:text-sm text-[#C0B7A6] font-medium">
              {t.hero.trustShariahLabel}
            </span>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 text-[#D4AF37]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gold-gradient mb-1">
              {t.hero.trustAssets}
            </span>
            <span className="text-xs sm:text-sm text-[#C0B7A6] font-medium">
              {t.hero.trustAssetsLabel}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
