import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationContent;
  onOpenConsultationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  t,
  onOpenConsultationModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#services', label: t.nav.services },
    { href: '#why-us', label: t.nav.whyUs },
    { href: '#packages', label: t.nav.packages },
    { href: '#financial-hub', label: t.nav.financial },
    { href: '#testimonials', label: t.nav.testimonials },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-nav py-3' : 'bg-gradient-to-b from-black/90 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full p-[1px] bg-gradient-to-r from-[#D4AF37] via-[#FFF0B3] to-[#9A7B1C] shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0D0D0D] rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/logo.jpg" 
                  alt="MAYSORA Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif-en tracking-wider text-gold-gradient font-bold leading-tight">
                MAYSORA
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#C0B7A6] tracking-widest font-light">
                {lang === 'en' ? 'EST. LUXURY & FINANCE' : (lang === 'ar-sa' ? 'مكتب ميسورة • نخبة الحج والمال' : 'مكتب ميسورة')}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#F8F5F0]/80 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions, Language/Dialect Switcher & CTA */}
          <div className="hidden lg:flex items-center gap-3.5">
            
            {/* Language & Dialect Switcher Segmented Bar */}
            <div className="flex items-center p-1 rounded-full bg-black/60 border border-[#D4AF37]/35 backdrop-blur-md shadow-inner text-xs">
              
              {/* Saudi Dialect Button */}
              <button
                type="button"
                onClick={() => setLang('ar-sa')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'ar-sa'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                    : 'text-[#C0B7A6] hover:text-[#D4AF37]'
                }`}
                title="تغيير اللهجة للسعودية"
              >
                <span>🇸🇦</span>
                <span>لهجة سعودية</span>
              </button>

              {/* Standard Arabic Button */}
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                    : 'text-[#C0B7A6] hover:text-[#D4AF37]'
                }`}
                title="العربية (الفصحى)"
              >
                <span>فصحى</span>
              </button>

              {/* English Switch Button */}
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md font-bold'
                    : 'text-[#C0B7A6] hover:text-[#D4AF37]'
                }`}
                title="Switch Language to English"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>

            {/* Free Consultation CTA */}
            <button
              onClick={onOpenConsultationModal}
              className="relative group overflow-hidden px-4.5 py-2.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.nav.bookConsultation}</span>
            </button>
          </div>

          {/* Mobile Header Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Switcher on Mobile Header */}
            <div className="flex items-center p-0.5 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[11px]">
              <button
                type="button"
                onClick={() => setLang(lang === 'ar-sa' ? 'en' : 'ar-sa')}
                className="px-2.5 py-1 rounded-full text-[#FFF0B3] font-medium flex items-center gap-1 cursor-pointer hover:text-[#D4AF37]"
                title="تبديل اللغة / Switch Language"
              >
                {lang === 'ar-sa' ? (
                  <>
                    <span>🇬🇧</span>
                    <span>English</span>
                  </>
                ) : (
                  <>
                    <span>🇸🇦</span>
                    <span>سعودي</span>
                  </>
                )}
              </button>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#D4AF37] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-[#D4AF37]/20 px-6 py-6 transition-all animate-fadeIn">
          
          {/* Mobile Language & Dialect Selector Section */}
          <div className="mb-6 pb-5 border-b border-[#D4AF37]/20">
            <span className="text-xs text-[#C0B7A6] font-medium mb-2.5 block">
              {lang === 'en' ? 'Language & Dialect / لغة الموقع واللهجة:' : 'اختر لغة الموقع واللهجة:'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLang('ar-sa');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  lang === 'ar-sa'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md'
                    : 'bg-black/50 border border-[#D4AF37]/20 text-[#F8F5F0]'
                }`}
              >
                <span className="text-base">🇸🇦</span>
                <span>لهجة سعودية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLang('ar');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md'
                    : 'bg-black/50 border border-[#D4AF37]/20 text-[#F8F5F0]'
                }`}
              >
                <span className="text-base">🌐</span>
                <span>عربية فصحى</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLang('en');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gold-gradient text-[#0D0D0D] shadow-md'
                    : 'bg-black/50 border border-[#D4AF37]/20 text-[#F8F5F0]'
                }`}
              >
                <span className="text-base">🇬🇧</span>
                <span>English</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#F8F5F0]/90 hover:text-[#D4AF37] transition-colors py-1.5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultationModal();
                }}
                className="w-full py-3 rounded-full text-sm font-bold text-[#0D0D0D] bg-gold-gradient text-center shadow-lg cursor-pointer"
              >
                {t.nav.bookConsultation}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
