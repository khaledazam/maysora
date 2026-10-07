import React from 'react';
import { Award, ShieldCheck, Building2, Plane, CheckCircle2 } from 'lucide-react';
import type { TranslationContent } from '../data/translations';

interface PartnersSectionProps {
  t: TranslationContent;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ t }) => {
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('jet') || category.includes('طيران')) {
      return <Plane className="w-4 h-4 text-[#D4AF37]" />;
    }
    if (category.includes('معايير') || category.includes('امتثال') || category.includes('ترخيص') || category.toLowerCase().includes('compliance')) {
      return <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />;
    }
    if (category.includes('ملكية') || category.toLowerCase().includes('royal')) {
      return <Award className="w-4 h-4 text-[#D4AF37]" />;
    }
    return <Building2 className="w-4 h-4 text-[#D4AF37]" />;
  };

  return (
    <section className="relative py-12 bg-[#0A0A0A] border-y border-[#D4AF37]/15 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-32 bg-[#D4AF37]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Mini Label */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[11px] font-semibold text-[#FFF0B3] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.partners.sectionTag}</span>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-stretch max-w-6xl mx-auto">
          {t.partners.items.map((partner, index) => (
            <div
              key={index}
              className="group glass-gold-card rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#D4AF37]/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D4AF37]/10"
            >
              <div className="w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:border-[#D4AF37] transition-all">
                {getCategoryIcon(partner.category)}
              </div>
              <p className="text-xs font-bold text-[#F8F5F0] mb-1 group-hover:text-[#D4AF37] transition-colors leading-tight">
                {partner.name}
              </p>
              <span className="text-[10px] text-[#C0B7A6]/70 tracking-tight">
                {partner.category}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
