import React, { useState } from 'react';
import { Landmark, Calculator, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface FinancialAccountingSectionProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultationModal: () => void;
}

export const FinancialAccountingSection: React.FC<FinancialAccountingSectionProps> = ({
  lang,
  t,
  onOpenConsultationModal
}) => {
  const isRtl = lang === 'ar';

  // Calculator State
  const [wealthAmount, setWealthAmount] = useState<number>(500000);
  const [targetYears, setTargetYears] = useState<number>(2);

  // Calculations
  const zakatDue = Math.round(wealthAmount * 0.025);
  const estimatedHajjPackage = 65000;
  const totalMonths = Math.max(targetYears * 12, 1);
  const monthlySavings = Math.round(estimatedHajjPackage / totalMonths);

  return (
    <section id="financial-hub" className="relative py-24 bg-[#141414] overflow-hidden">
      
      {/* Ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.financialHub.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.financialHub.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.financialHub.subtitle}
          </p>
        </div>

        {/* 2 Column Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: Financial Consulting */}
          <div className="glass-gold-card rounded-3xl p-8 flex flex-col justify-between border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 transition-all">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient p-[1px] shadow-lg">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                    <Landmark className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-arabic-heading text-[#F8F5F0]">
                    {t.financialHub.consultingTitle}
                  </h3>
                  <span className="text-xs text-[#D4AF37] font-medium">
                    {lang === 'ar' ? 'إدارة الثروات وحوكمة الأوقاف' : 'Wealth & Endowment Governance'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#C0B7A6] leading-relaxed mb-6">
                {t.financialHub.consultingDesc}
              </p>

              <ul className="space-y-3 mb-8">
                {t.financialHub.consultingList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F8F5F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onOpenConsultationModal}
              className="w-full py-3 rounded-full text-xs font-bold text-[#F8F5F0] bg-black/60 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.nav.bookConsultation}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Card 2: Accounting & Zakat Auditing */}
          <div className="glass-gold-card rounded-3xl p-8 flex flex-col justify-between border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 transition-all">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient p-[1px] shadow-lg">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                    <Calculator className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-arabic-heading text-[#F8F5F0]">
                    {t.financialHub.accountingTitle}
                  </h3>
                  <span className="text-xs text-[#D4AF37] font-medium">
                    {lang === 'ar' ? 'اعتماد هيئة الزكاة والضريبة (ZATCA)' : 'ZATCA & Audit Certified'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#C0B7A6] leading-relaxed mb-6">
                {t.financialHub.accountingDesc}
              </p>

              <ul className="space-y-3 mb-8">
                {t.financialHub.accountingList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F8F5F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onOpenConsultationModal}
              className="w-full py-3 rounded-full text-xs font-bold text-[#F8F5F0] bg-black/60 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.nav.bookConsultation}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Interactive Zakat & Hajj Savings Calculator */}
        <div className="relative glass-gold-card rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37]/40 shadow-2xl bg-gradient-to-r from-[#1A1A1A] via-[#141414] to-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-2xl sm:text-3xl font-bold font-arabic-heading text-gold-gradient">
              {t.financialHub.calcTitle}
            </h3>
          </div>
          <p className="text-sm text-[#C0B7A6] mb-8 font-light">
            {t.financialHub.calcSubtitle}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="space-y-6">
              
              {/* Wealth Input */}
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-[#F8F5F0]">
                  <label>{t.financialHub.calcInputWealth}</label>
                  <span className="text-gold-gradient font-bold text-lg">
                    {wealthAmount.toLocaleString()} {t.packages.currency}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={wealthAmount}
                  onChange={(e) => setWealthAmount(Number(e.target.value))}
                  className="w-full h-2 bg-[#0D0D0D] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[11px] text-[#C0B7A6]/60 mt-1">
                  <span>50,000</span>
                  <span>2,500,000</span>
                  <span>5,000,000+</span>
                </div>
              </div>

              {/* Target Years Input */}
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-[#F8F5F0]">
                  <label>{t.financialHub.calcInputYears}</label>
                  <span className="text-gold-gradient font-bold text-lg">
                    {targetYears} {lang === 'ar' ? 'سنوات' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={targetYears}
                  onChange={(e) => setTargetYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#0D0D0D] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[11px] text-[#C0B7A6]/60 mt-1">
                  <span>1 {lang === 'ar' ? 'سنة' : 'Year'}</span>
                  <span>3 {lang === 'ar' ? 'سنوات' : 'Years'}</span>
                  <span>5 {lang === 'ar' ? 'سنوات' : 'Years'}</span>
                </div>
              </div>

            </div>

            {/* Live Calculation Output Display */}
            <div className="bg-[#0D0D0D]/90 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 flex flex-col justify-between">
              
              <div className="space-y-4 mb-6">
                
                {/* Zakat Result */}
                <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/20">
                  <span className="text-xs sm:text-sm text-[#C0B7A6]">
                    {t.financialHub.calcZakatDue}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#FFF0B3]">
                    {zakatDue.toLocaleString()} {t.packages.currency}
                  </span>
                </div>

                {/* Hajj Target Result */}
                <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/20">
                  <span className="text-xs sm:text-sm text-[#C0B7A6]">
                    {t.financialHub.calcHajjTarget}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#F8F5F0]">
                    {estimatedHajjPackage.toLocaleString()} {t.packages.currency}
                  </span>
                </div>

                {/* Monthly Savings Result */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-semibold text-gold-gradient">
                    {t.financialHub.calcMonthlySave}
                  </span>
                  <span className="text-2xl font-extrabold text-gold-gradient">
                    {monthlySavings.toLocaleString()} {t.packages.currency}
                  </span>
                </div>

              </div>

              <button
                onClick={onOpenConsultationModal}
                className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg cursor-pointer"
              >
                {t.financialHub.calcCta}
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
