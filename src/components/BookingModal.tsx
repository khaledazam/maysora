import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import type { TranslationContent } from '../data/translations';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialPackage?: string;
  t: TranslationContent;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  title,
  initialPackage
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-gold-card rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/40 text-[#C0B7A6] hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center text-[#0D0D0D]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-arabic-heading text-gold-gradient">
              تم استلام طلبك بنجاح
            </h3>
            <p className="text-sm text-[#C0B7A6] leading-relaxed">
              سيتواصل معك مستشار ميسورة الخاص لتأكيد كافة التفاصيل وتلبية متطلباتك.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                MAYSORA PRIVATE CLIENT
              </span>
            </div>

            <h3 className="text-2xl font-bold font-arabic-heading text-[#F8F5F0] mb-2">
              {title}
            </h3>

            {initialPackage && (
              <div className="inline-block px-3 py-1 rounded-full bg-gold-subtle-gradient border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF0B3] mb-6">
                الباقة المحددة: {initialPackage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد العبدالله"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  رقم الجوال *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  ملاحظات أو متطلبات خاصة
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="حدد التاريخ المفضل أو أي تفاصيل استشارية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-sm font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب الآن</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#C0B7A6]/70 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>خصوصيتك محمية وطلبك مباشر لمستشارينا</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
