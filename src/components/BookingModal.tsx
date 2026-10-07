import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import type { TranslationContent } from '../data/translations';
import { submitLeadToGoogleSheets } from '../services/leadService';

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
  initialPackage,
  t
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setSubmitted(false);
    setIsSubmitting(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitLeadToGoogleSheets({
      name,
      phone,
      email,
      serviceOrPackage: initialPackage || title,
      messageOrNotes: notes,
      source: initialPackage ? 'Package Customizer' : 'Booking Modal'
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-gold-card rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/40 text-[#C0B7A6] hover:text-[#D4AF37] transition-colors cursor-pointer"
          aria-label={t.modal.close}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center text-[#0D0D0D]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-arabic-heading text-gold-gradient">
              {t.modal.successTitle}
            </h3>
            <p className="text-sm text-[#C0B7A6] leading-relaxed">
              {t.modal.successDesc}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                {t.modal.clientBadge}
              </span>
            </div>

            <h3 className="text-2xl font-bold font-arabic-heading text-[#F8F5F0] mb-2">
              {title}
            </h3>

            {initialPackage && (
              <div className="inline-block px-3 py-1 rounded-full bg-gold-subtle-gradient border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF0B3] mb-6">
                {t.modal.selectedPackageLabel} {initialPackage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="modalFullName" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.fullName}
                </label>
                <input
                  id="modalFullName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.modal.fullNamePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="modalPhone" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.phone}
                </label>
                <input
                  id="modalPhone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="modalEmail" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.email}
                </label>
                <input
                  id="modalEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="modalNotes" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.notes}
                </label>
                <textarea
                  id="modalNotes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.modal.notesPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full text-sm font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تأكيد وتسجيل الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.modal.submitBtn}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#C0B7A6]/70 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.modal.privacyBadge}</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
