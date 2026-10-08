import React, { useState, useEffect, useMemo } from 'react';
import { Star, Sparkles, Sparkle, Building2, PlaneTakeoff, ShieldCheck, CheckCircle2, SlidersHorizontal, TableProperties, ArrowRight, ArrowLeft, FileDown } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';
import { PackageCustomizer } from './PackageCustomizer';
import { PackageComparison } from './PackageComparison';
import {
  getManagedPackages,
  subscribeToPriceUpdates,
  loadManagedPackagesFromCloud,
  type ManagedPackage
} from '../services/pricingService';

interface PackagesHubProps {
  lang: Language;
  t: TranslationContent;
  onSelectPackage: (packageName: string) => void;
  onSelectCustomPackage: (customSpecs: string) => void;
  onOpenBrochureModal: () => void;
}

export const PackagesHub: React.FC<PackagesHubProps> = ({
  lang,
  t,
  onSelectPackage,
  onSelectCustomPackage,
  onOpenBrochureModal
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'customizer' | 'comparison'>('packages');
  const [managedPackages, setManagedPackages] = useState<ManagedPackage[]>(getManagedPackages());
  const isRtl = lang !== 'en';

  useEffect(() => {
    loadManagedPackagesFromCloud().then((cloud) => {
      if (cloud && cloud.length > 0) {
        setManagedPackages(cloud);
      }
    });
    return subscribeToPriceUpdates(setManagedPackages);
  }, []);

  const displayedPackages = useMemo(() => {
    return managedPackages.map((managed) => {
      const transItem = t.packages.items.find((item) => item.id === managed.id);
      return {
        id: managed.id,
        name: isRtl ? (managed.name || transItem?.name || '') : (transItem?.name || managed.name || ''),
        category: isRtl ? (managed.category || transItem?.category || '') : (transItem?.category || managed.category || ''),
        price: managed.price,
        currency: managed.currency || t.packages.currency,
        duration: managed.duration || transItem?.duration || '',
        hotel: managed.hotel || transItem?.hotel || '',
        flight: managed.flight || transItem?.flight || '',
        financialPerk: managed.financialPerk || transItem?.financialPerk || '',
        badge: managed.badge,
        features: managed.features && managed.features.length > 0 ? managed.features : (transItem?.features || [])
      };
    });
  }, [managedPackages, t.packages.items, isRtl, t.packages.currency]);

  return (
    <section id="packages" className="relative py-24 bg-[#0D0D0D] overflow-hidden">
      
      {/* Decorative center ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.packages.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-4">
            {t.packages.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed mb-6">
            {t.packages.subtitle}
          </p>

          {/* Action Bar: Download VIP Brochure Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOpenBrochureModal}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] text-[#FFF0B3] text-xs font-bold hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-lg shadow-black/60 cursor-pointer group"
            >
              <FileDown className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>{t.packages.downloadBrochure}</span>
            </button>
          </div>
        </div>

        {/* Master Tabbed Switcher (Segmented Luxury Pill) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 rounded-full bg-black/70 border border-[#D4AF37]/35 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto">
            
            {/* Tab 1: Ready Packages */}
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-gold-gradient text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/25'
                  : 'text-[#C0B7A6] hover:text-[#D4AF37]'
              }`}
            >
              <Sparkle className="w-4 h-4" />
              <span>{t.packages.tabReadyPackages}</span>
            </button>

            {/* Tab 2: Customizer */}
            <button
              type="button"
              onClick={() => setActiveTab('customizer')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'customizer'
                  ? 'bg-gold-gradient text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/25'
                  : 'text-[#C0B7A6] hover:text-[#D4AF37]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t.packages.tabCustomizer}</span>
            </button>

            {/* Tab 3: Comparison Matrix */}
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'bg-gold-gradient text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/25'
                  : 'text-[#C0B7A6] hover:text-[#D4AF37]'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>{t.packages.tabComparison}</span>
            </button>

          </div>
        </div>

        {/* Tab 1 Content: Ready Featured Packages Cards */}
        {activeTab === 'packages' && (
          <div className="animate-fadeIn space-y-12">
            {displayedPackages.length === 0 ? (
              <div className="glass-gold-card rounded-3xl p-12 text-center max-w-xl mx-auto border border-[#D4AF37]/30 my-6">
                <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold font-arabic-heading text-[#F8F5F0] mb-2">
                  {lang === 'ar-eg' ? 'لا توجد عروض جاهزة حالياً' : (lang === 'en' ? 'No Active Packages at the Moment' : 'لا توجد عروض نشطة حالياً')}
                </h3>
                <p className="text-sm text-[#C0B7A6] mb-6 leading-relaxed">
                  {lang === 'ar-eg'
                    ? 'يتم تحديث العروض والأسعار من لوحة التحكم، وتقدر دلوقتي تفصّل باقتك المخصصة على مزاجك بكل سهولة.'
                    : (lang === 'en'
                      ? 'Packages are being updated by the concierge office. You can build your custom package right now.'
                      : 'يتم تحديث الباقات من لوحة التحكم، أو يمكنك تصميم باقتك الخاصة فوراً.')}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('customizer')}
                  className="px-6 py-3 rounded-full bg-gold-gradient text-[#0D0D0D] font-bold text-xs shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 transition-all cursor-pointer"
                >
                  {lang === 'ar-eg' ? 'فصّل باقتك على مزاجك' : (lang === 'en' ? 'Customize Your Itinerary' : 'صمّم باقتك الخاصة')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {displayedPackages.map((pkg, index) => {
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
                    {/* Badge */}
                    {(pkg.badge || isFeatured) && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gold-gradient text-[#0D0D0D] text-xs font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 fill-[#0D0D0D]" />
                        <span>{pkg.badge || t.packages.mostPopular}</span>
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
                        <span className="text-4xl sm:text-5xl font-extrabold text-gold-gradient font-mono">
                          {pkg.price}
                        </span>
                        {pkg.price !== 'حسب الطلب' && pkg.price !== 'Bespoke Quote' && (
                          <span className="text-sm font-semibold text-[#C0B7A6]">
                            {pkg.currency}
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
            )}

            {/* Quick Interactive Prompt to Customizer or Comparison */}
            <div className="glass-gold-card rounded-2xl p-6 border border-[#D4AF37]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start bg-black/40">
              <div>
                <h4 className="text-base font-bold text-[#F8F5F0] mb-1">
                  {lang === 'ar-eg'
                    ? 'عايز تفصل باقتك بمواصفات معينة على مزاجك؟'
                    : (lang === 'ar-sa'
                      ? 'ودّك بمواصفات خاصة أو مقارنة دقيقة؟'
                      : (lang === 'en'
                        ? 'Need a fully customized itinerary or detailed matrix?'
                        : 'هل ترغب في باقة مخصصة بالكامل؟'))}
                </h4>
                <p className="text-xs text-[#C0B7A6]">
                  {lang === 'ar-eg'
                    ? 'تقدر تظبط كل تفصيلة في رحلتك أو تقارن بين كل المزايا بضغطة زر واحدة.'
                    : (lang === 'ar-sa'
                      ? 'تقدر تصمم باقتك بكل تفاصيلها أو تقارن بين كل المزايا بضغطة زر.'
                      : (lang === 'en'
                        ? 'You can configure every aspect or compare tiers side-by-side with one click.'
                        : 'يمكنك تصميم باقتك أو مقارنة كافة الخدمات بسهولة.'))}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('customizer')}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t.packages.tabCustomizer}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#F8F5F0] bg-black/60 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <TableProperties className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.packages.tabComparison}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Interactive Package Customizer */}
        {activeTab === 'customizer' && (
          <div className="animate-fadeIn">
            <PackageCustomizer
              lang={lang}
              t={t}
              onSelectCustomPackage={onSelectCustomPackage}
              isEmbedded={true}
            />
          </div>
        )}

        {/* Tab 3 Content: Package Comparison Matrix */}
        {activeTab === 'comparison' && (
          <div className="animate-fadeIn">
            <PackageComparison
              lang={lang}
              t={t}
              onSelectPackage={onSelectPackage}
              isEmbedded={true}
            />
          </div>
        )}

      </div>
    </section>
  );
};
