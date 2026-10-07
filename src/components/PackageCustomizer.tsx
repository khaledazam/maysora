import React, { useState } from 'react';
import { Sparkles, Crown, Building2, Check, ArrowRight, ArrowLeft, MessageSquare, ShieldCheck, Hotel, Plane } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';
import { trackEvent } from '../services/analytics';

interface PackageCustomizerProps {
  lang: Language;
  t: TranslationContent;
  onSelectCustomPackage: (customSpecs: string) => void;
  isEmbedded?: boolean;
}

export const PackageCustomizer: React.FC<PackageCustomizerProps> = ({
  lang,
  t,
  onSelectCustomPackage,
  isEmbedded = false
}) => {
  const isRtl = lang !== 'en';

  const [selectedType, setSelectedType] = useState<string>(t.customizer.types[0].id);
  const [selectedAcc, setSelectedAcc] = useState<string>(t.customizer.accommodations[0].id);
  const [selectedTransport, setSelectedTransport] = useState<string>(t.customizer.transports[0].id);
  const [selectedFinancial, setSelectedFinancial] = useState<string>(t.customizer.financialServices[0].id);

  const activeTypeObj = t.customizer.types.find((item) => item.id === selectedType) || t.customizer.types[0];
  const activeAccObj = t.customizer.accommodations.find((item) => item.id === selectedAcc) || t.customizer.accommodations[0];
  const activeTransportObj = t.customizer.transports.find((item) => item.id === selectedTransport) || t.customizer.transports[0];
  const activeFinancialObj = t.customizer.financialServices.find((item) => item.id === selectedFinancial) || t.customizer.financialServices[0];

  const customSummaryText = `${activeTypeObj.label} • ${activeAccObj.label} • ${activeTransportObj.label} • ${activeFinancialObj.label}`;

  const handleBookCustom = () => {
    trackEvent('customizer_book_click', { package: customSummaryText });
    onSelectCustomPackage(customSummaryText);
  };

  const handleWhatsAppCustom = () => {
    trackEvent('whatsapp_click', { location: 'customizer', package: customSummaryText });
    let msg = `السلام عليكم مكتب ميسورة، قمت بتصميم باقة مخصصة عبر الموقع وأود تأكيدها:\n- النوع: ${activeTypeObj.label}\n- الإقامة: ${activeAccObj.label}\n- الطيران والتنقل: ${activeTransportObj.label}\n- المزايا الإضافية: ${activeFinancialObj.label}`;
    if (lang === 'en') {
      msg = `Hello MAYSORA Concierge, I have tailored a bespoke package on your website and would like to confirm availability:\n- Type: ${activeTypeObj.label}\n- Accommodation: ${activeAccObj.label}\n- Transport: ${activeTransportObj.label}\n- Concierge Perk: ${activeFinancialObj.label}`;
    }
    window.open(`https://wa.me/201011860173?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const content = (
    <div>
      {!isEmbedded && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.customizer.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.customizer.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.customizer.subtitle}
          </p>
        </div>
      )}

      {/* Builder Grid: 2 Columns (Selection Controls + Live Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Selectors (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* Step 1: Journey Type */}
            <div className="glass-gold-card rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/20">
              <h3 className="text-base sm:text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.customizer.step1Title}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {t.customizer.types.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gold-subtle-gradient text-[#FFF0B3] shadow-md shadow-[#D4AF37]/15'
                          : 'border-[#D4AF37]/20 bg-black/40 text-[#C0B7A6] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        {type.id === 'hajj' ? (
                          <Crown className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#C0B7A6]'}`} />
                        ) : type.id === 'corporate' ? (
                          <Building2 className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#C0B7A6]'}`} />
                        ) : (
                          <Sparkles className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#C0B7A6]'}`} />
                        )}
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#C0B7A6]/40'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-[#0D0D0D]" />}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#F8F5F0]">
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Accommodation Tier */}
            <div className="glass-gold-card rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/20">
              <h3 className="text-base sm:text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-4 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.customizer.step2Title}</span>
              </h3>
              <div className="space-y-3">
                {t.customizer.accommodations.map((acc) => {
                  const isSelected = selectedAcc === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAcc(acc.id)}
                      className={`w-full p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gold-subtle-gradient shadow-md shadow-[#D4AF37]/15'
                          : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">
                          {acc.label}
                        </h4>
                        <p className="text-xs text-[#C0B7A6] font-light leading-relaxed">
                          {acc.desc}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#C0B7A6]/40'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0D0D0D]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Transport & Aviation */}
            <div className="glass-gold-card rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/20">
              <h3 className="text-base sm:text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.customizer.step3Title}</span>
              </h3>
              <div className="space-y-3">
                {t.customizer.transports.map((trans) => {
                  const isSelected = selectedTransport === trans.id;
                  return (
                    <button
                      key={trans.id}
                      type="button"
                      onClick={() => setSelectedTransport(trans.id)}
                      className={`w-full p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gold-subtle-gradient shadow-md shadow-[#D4AF37]/15'
                          : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">
                          {trans.label}
                        </h4>
                        <p className="text-xs text-[#C0B7A6] font-light leading-relaxed">
                          {trans.desc}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#C0B7A6]/40'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0D0D0D]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Concierge & Spiritual Guidance Perks */}
            <div className="glass-gold-card rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/20">
              <h3 className="text-base sm:text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.customizer.step4Title}</span>
              </h3>
              <div className="space-y-3">
                {t.customizer.financialServices.map((fin) => {
                  const isSelected = selectedFinancial === fin.id;
                  return (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => setSelectedFinancial(fin.id)}
                      className={`w-full p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gold-subtle-gradient shadow-md shadow-[#D4AF37]/15'
                          : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">
                          {fin.label}
                        </h4>
                        <p className="text-xs text-[#C0B7A6] font-light leading-relaxed">
                          {fin.desc}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#C0B7A6]/40'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0D0D0D]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Summary Sticky Card (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
            <div className="glass-gold-card rounded-3xl p-7 border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 bg-gradient-to-b from-[#181818] via-[#141414] to-[#0D0D0D]">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  {t.customizer.selectedPackageBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-gradient text-[#0D0D0D] text-[10px] font-extrabold uppercase">
                  VIP Concierge
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-arabic-heading text-[#F8F5F0] mb-6">
                {t.customizer.summaryTitle}
              </h3>

              {/* Selected List */}
              <div className="space-y-4 mb-8">
                
                <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/20">
                  <span className="text-[10px] text-[#C0B7A6] block uppercase tracking-wider mb-1">
                    {t.customizer.step1Title}
                  </span>
                  <p className="text-sm font-bold text-gold-gradient">
                    {activeTypeObj.label}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/20">
                  <span className="text-[10px] text-[#C0B7A6] block uppercase tracking-wider mb-1">
                    {t.customizer.step2Title}
                  </span>
                  <p className="text-sm font-semibold text-[#F8F5F0]">
                    {activeAccObj.label}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/20">
                  <span className="text-[10px] text-[#C0B7A6] block uppercase tracking-wider mb-1">
                    {t.customizer.step3Title}
                  </span>
                  <p className="text-sm font-semibold text-[#F8F5F0]">
                    {activeTransportObj.label}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/20">
                  <span className="text-[10px] text-[#C0B7A6] block uppercase tracking-wider mb-1">
                    {t.customizer.step4Title}
                  </span>
                  <p className="text-sm font-semibold text-[#F8F5F0]">
                    {activeFinancialObj.label}
                  </p>
                </div>

              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleBookCustom}
                  className="w-full py-3.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>{t.customizer.ctaBtn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppCustom}
                  className="w-full py-3 rounded-full text-xs font-bold text-[#25D366] bg-black/60 border border-[#25D366]/40 hover:bg-[#25D366]/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{t.customizer.whatsAppBtn}</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#C0B7A6]/70 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{t.customizer.estimateNote}</span>
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
    <section id="customizer" className="relative py-24 bg-[#0A0A0A] overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#9A7B1C]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {content}
      </div>
    </section>
  );
};
