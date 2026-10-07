import React from 'react';
import { ShieldCheck, Award, Lock, Phone, MapPin } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface FooterProps {
  lang: Language;
  t: TranslationContent;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="relative bg-[#080808] border-t border-[#D4AF37]/20 pt-16 pb-12 text-[#C0B7A6]">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-[1px] bg-gold-gradient">
                <div className="w-full h-full bg-[#0D0D0D] rounded-full overflow-hidden flex items-center justify-center">
                  <img src="/images/logo.jpg" alt="MAYSORA Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-2xl font-serif-en text-gold-gradient font-bold tracking-wider">
                MAYSORA
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#C0B7A6]/80 font-light">
              {t.footer.tagline}
            </p>

            <a
              href="#contact"
              className="flex items-start gap-2 text-xs text-[#FFF0B3] hover:text-[#D4AF37] transition-colors group"
            >
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span className="leading-relaxed">مدينة برج العرب الجديدة، حوض سكرة وأبو حمد، الإسكندرية</span>
            </a>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[11px] text-[#FFF0B3]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.footer.shariahBadge}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold font-arabic-heading text-[#F8F5F0] mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#home" className="hover:text-[#D4AF37] transition-colors">{t.nav.home}</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D4AF37] transition-colors">{t.nav.services}</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#D4AF37] transition-colors">{t.nav.whyUs}</a>
              </li>
              <li>
                <a href="#packages" className="hover:text-[#D4AF37] transition-colors">{t.nav.packages}</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D4AF37] transition-colors">{t.nav.contact}</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-sm font-bold font-arabic-heading text-[#F8F5F0] mb-4">
              {t.footer.servicesHeader}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-[#D4AF37] transition-colors">{t.services.hajjTitle}</li>
              <li className="hover:text-[#D4AF37] transition-colors">{t.services.finTitle}</li>
              <li className="hover:text-[#D4AF37] transition-colors">حجز أجنحة فندق الصفوة رويال أوركيد</li>
              <li className="hover:text-[#D4AF37] transition-colors">طيران خاص وخدمات كونسيرج 24/7</li>
            </ul>
          </div>

          {/* Col 4: Certifications & Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-arabic-heading text-[#F8F5F0] mb-4">
              الترخيص والاعتمادات
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#C0B7A6]">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>مرخص من وزارة الحج والعمرة برقم VIP-9920</span>
              </div>
              <div className="flex items-center gap-2 text-[#C0B7A6]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>شراكة ضيافة معتمدة مع أجنحة الحرم الفاخرة</span>
              </div>
              <div className="flex items-center gap-2 text-[#C0B7A6]">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>حماية وخصوصية تامة لبيانات كبار الشخصيات VIP</span>
              </div>
              <div className="pt-2 border-t border-white/10 mt-3 space-y-1.5">
                <span className="text-[11px] text-[#C0B7A6] block mb-1">فريق التواصل والمستشارين:</span>
                <a
                  href="tel:01011860173"
                  className="flex items-center gap-2 text-xs font-bold text-[#FFF0B3] hover:text-[#D4AF37] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>المهندس أحمد رمضان: <span className="font-mono">01011860173</span></span>
                </a>
                <a
                  href="tel:01017776863"
                  className="flex items-center gap-2 text-xs font-bold text-[#FFF0B3] hover:text-[#D4AF37] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>الأستاذة سومة شعبان: <span className="font-mono">01017776863</span></span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E2DACB] gap-4">
          <p>{t.footer.rights}</p>
          <p className="text-[11px] text-[#E2DACB]">{t.footer.legal}</p>
        </div>

      </div>
    </footer>
  );
};
