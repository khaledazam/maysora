import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Language } from '../data/translations';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `السلام عليكم، أود التواصل مع مستشار ميسورة للخدمات الخاصة.`
    );
    window.open(`https://wa.me/966500000000?text=${text}`, '_blank');
  };

  return (
    <div className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-40 group`}>
      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-black/90 border border-[#D4AF37]/30 text-[#FFF0B3] text-xs px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
        {lang === 'ar' ? 'تحدث مباشرة مع مستشار ميسورة 24/7' : 'Chat 24/7 with MAYSORA Concierge'}
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
