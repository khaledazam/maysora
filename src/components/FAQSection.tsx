import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, PhoneCall } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';
import { trackEvent } from '../services/analytics';

interface FAQSectionProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultationModal: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  lang,
  t,
  onOpenConsultationModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hajj' | 'financial'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const filteredItems = t.faq.items.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { location: 'faq_section', lang });
    const text = encodeURIComponent(
      lang === 'ar-sa'
        ? 'السلام عليكم، عندي استفسار خاص وأود الحديث مع مستشار ميسورة.'
        : (lang === 'en'
          ? 'Hello MAYSORA, I have a specific question regarding your VIP services.'
          : 'السلام عليكم، أود الاستفسار عن تفاصيل خدمات ميسورة.')
    );
    window.open(`https://wa.me/201011860173?text=${text}`, '_blank');
  };

  return (
    <section id="faq" className="relative py-24 bg-[#0D0D0D] overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.faq.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.faq.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setOpenIndex(0);
            }}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                : 'bg-black/50 border border-[#D4AF37]/25 text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {t.faq.allTab}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('hajj');
              setOpenIndex(0);
            }}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hajj'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                : 'bg-black/50 border border-[#D4AF37]/25 text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {t.faq.hajjTab}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('financial');
              setOpenIndex(0);
            }}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                : 'bg-black/50 border border-[#D4AF37]/25 text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {t.faq.financialTab}
          </button>
        </div>

        {/* Accordion Items List */}
        <div className="space-y-4 mb-16">
          {filteredItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`glass-gold-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#D4AF37]/60 shadow-lg shadow-[#D4AF37]/10 bg-gradient-to-b from-[#1A1A1A] to-[#121212]'
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">
                      {item.q}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#C0B7A6] leading-relaxed border-t border-[#D4AF37]/10 animate-fadeIn">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="glass-gold-card rounded-3xl p-8 border border-[#D4AF37]/30 text-center flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#181818] via-[#141414] to-[#181818]">
          <div className="text-start">
            <h3 className="text-lg font-bold font-arabic-heading text-[#F8F5F0] mb-1">
              {t.faq.stillHaveQuestions}
            </h3>
            <p className="text-xs text-[#C0B7A6]">
              {lang === 'ar-sa'
                ? 'فريق كونسيرج ميسورة ومستشارونا الماليون متاحون لخدمتك على مدار الساعة.'
                : (lang === 'en'
                  ? 'MAYSORA concierge chiefs and senior wealth advisors are on standby 24/7.'
                  : 'فريق كونسيرج ميسورة متاح للإجابة على استفساراتكم على مدار الساعة.')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#25D366] bg-black/60 border border-[#25D366]/40 hover:bg-[#25D366]/10 flex items-center gap-2 cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onOpenConsultationModal}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.faq.talkToUs}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
