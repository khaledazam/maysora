import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Language } from '../data/translations';
import { trackEvent } from '../services/analytics';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const isEn = lang === 'en';

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { location: 'floating_button', lang });
    let text = 'السلام عليكم، أود التواصل مع مستشار ميسورة للخدمات الخاصة.';
    if (lang === 'ar-eg') {
      text = 'مساء الخير، حابب أستفسر عن خدمات ميسورة لباقات الحج والعمرة والاستشارات الخاصة.';
    } else if (lang === 'ar-sa') {
      text = 'السلام عليكم، حيّاك الله.. حاب أستفسر عن خدمات ميسورة الخاصة للحج والعمرة والاستشارات المالية.';
    } else if (isEn) {
      text = 'Hello MAYSORA VIP Concierge, I would like to inquire about your private pilgrimage and wealth advisory services.';
    }
    window.open(`https://wa.me/201011860173?text=${encodeURIComponent(text)}`, '_blank');
  };

  const tooltipText = lang === 'ar-eg'
    ? 'تكلم مع بشمهندس أحمد رمضان مباشرة 24/7'
    : (lang === 'ar-sa'
      ? 'تواصل مباشرة مع بشمهندس أحمد رمضان 24/7'
      : (isEn ? 'Chat with Eng. Ahmed Ramadan (VIP Concierge)' : 'تواصل مباشرة مع بشمهندس أحمد رمضان: 01011860173'));

  return (
    <div className={`fixed bottom-6 ${!isEn ? 'left-6' : 'right-6'} z-40 group`}>
      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-black/90 border border-[#D4AF37]/30 text-[#FFF0B3] text-xs px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
        {tooltipText}
      </div>

      <button
        onClick={handleWhatsAppClick}
        className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#25D366] via-[#D4AF37] to-[#25D366] shadow-2xl shadow-[#25D366]/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        aria-label="WhatsApp Concierge"
      >
        <div className="w-full h-full bg-[#0D0D0D] rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
          <MessageSquare className="w-7 h-7 fill-current" />
        </div>
        
        {/* Ping Animation Dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25D366] rounded-full flex items-center justify-center">
          <span className="w-full h-full rounded-full bg-[#25D366] animate-ping opacity-75" />
        </span>
      </button>
    </div>
  );
};
