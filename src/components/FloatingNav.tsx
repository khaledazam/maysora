import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import type { Language } from '../data/translations';

interface FloatingNavProps {
  lang: Language;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isEn = lang === 'en';

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 ${isEn ? 'left-6' : 'right-6'} z-30 transition-all duration-300 animate-fadeIn`}>
      <button
        type="button"
        onClick={scrollToTop}
        className="w-11 h-11 rounded-full bg-black/80 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0D0D0D] hover:bg-gold-gradient flex items-center justify-center shadow-xl shadow-black/60 transition-all cursor-pointer group"
        title={lang === 'ar-sa' ? 'الرجوع للأعلى' : (isEn ? 'Scroll to top' : 'الرجوع إلى البداية')}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
