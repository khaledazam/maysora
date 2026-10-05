import React, { useState } from 'react';
import { Plane, Landmark, Calculator, CheckCircle2, ChevronRight, ChevronLeft, X } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface ServicesSectionProps {
  lang: Language;
  t: TranslationContent;
  onSelectService: (serviceKey: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  t,
  onSelectService
}) => {
  const isRtl = lang !== 'en';
  const [activeModalService, setActiveModalService] = useState<number | null>(null);

  const servicesData = [
    {
      id: 1,
      key: 'hajj-umrah',
      icon: Plane,
      title: t.services.hajjTitle,
      desc: t.services.hajjDesc,
      features: t.services.hajjFeatures,
      image: '/images/hajj_vip.jpg',
      accentColor: 'from-[#D4AF37] to-[#C9A227]'
    },
    {
      id: 2,
      key: 'financial-consulting',
      icon: Landmark,
      title: t.services.finTitle,
      desc: t.services.finDesc,
      features: t.services.finFeatures,
      image: '/images/fin_consult.jpg',
      accentColor: 'from-[#FFF0B3] to-[#D4AF37]'
    },
    {
      id: 3,
      key: 'accounting-zakat',
      icon: Calculator,
      title: t.services.accTitle,
      desc: t.services.accDesc,
      features: t.services.accFeatures,
      image: '/images/hero_bg.jpg',
      accentColor: 'from-[#D4AF37] to-[#9A7B1C]'
    }
  ];

  return (
    <section id="services" className="relative py-24 bg-[#0D0D0D]">
      {/* Subtle gold line separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.services.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* 3 Luxury Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative rounded-3xl glass-gold-card overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/15"
              >
                {/* Card Top Image & Overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
                  
                  {/* Floating Gold Icon */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accentColor} p-[1px] shadow-lg shadow-black/60`}>
                      <div className="w-full h-full bg-[#0D0D0D] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                        <IconComponent className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#C0B7A6] font-light leading-relaxed mb-6">
                      {service.desc}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 border-t border-[#D4AF37]/15 pt-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F8F5F0]/90">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Button */}
                  <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalService(service.id)}
                      className="text-xs sm:text-sm font-bold text-[#D4AF37] hover:text-[#FFF0B3] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t.services.learnMore}</span>
                      {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onSelectService(service.key)}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 transition-all cursor-pointer shadow-md"
                    >
                      {t.nav.bookConsultation}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {activeModalService !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-gold-card rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-[#C0B7A6] hover:text-[#D4AF37] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {(() => {
              const item = servicesData.find(s => s.id === activeModalService);
              if (!item) return null;
              return (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gold-gradient p-[1px]">
                      <div className="w-full h-full bg-[#0D0D0D] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <item.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold font-arabic-heading text-[#F8F5F0]">
                      {item.title}
                    </h3>
                  </div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-2xl mb-6 border border-[#D4AF37]/20"
                  />

                  <p className="text-base text-[#C0B7A6] leading-relaxed mb-6">
                    {item.desc}
                  </p>

                  <h4 className="text-lg font-bold text-gold-gradient mb-4">
                    {lang !== 'en' ? 'أبرز مميزات الخدمة:' : 'Key Service Highlights:'}
                  </h4>

                  <ul className="space-y-3 mb-8">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-[#F8F5F0]">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setActiveModalService(null);
                      onSelectService(item.key);
                    }}
                    className="w-full py-3 rounded-full font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg text-center cursor-pointer"
                  >
                    {t.nav.bookConsultation}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};
