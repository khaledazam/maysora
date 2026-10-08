import React, { useState } from 'react';
import { X, Download, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';
import { submitLeadToGoogleSheets } from '../services/leadService';
import { trackEvent } from '../services/analytics';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: TranslationContent;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  lang,
  t
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const isEn = lang === 'en';

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Submit lead to Google Sheets & track conversion
    await submitLeadToGoogleSheets({
      name: name || (isEn ? 'Brochure Request' : 'طلب بروشور'),
      phone,
      email,
      serviceOrPackage: isEn ? 'Digital VIP Brochure 2026' : 'الكتيب الرقمي للباقات الملكية 2026',
      source: 'Booking Modal',
      lang,
      messageOrNotes: 'تم طلب وتحميل الكتيب الرقمي للباقات الملكية والخدمات الخاصة',
    });

    trackEvent('brochure_downloaded', {
      lang,
      phone,
      hasEmail: !!email,
    });

    setIsSubmitting(false);
    setIsDownloaded(true);

    // 2. Trigger synthetic luxury PDF brochure download
    triggerBrochureDownload();
  };

  const triggerBrochureDownload = () => {
    // Generate an executive HTML/Printable document that automatically opens print/PDF dialog
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rtlDir = isEn ? 'ltr' : 'rtl';
    const titleText = isEn
      ? 'MAYSORA Luxury Concierge - Executive Portfolio 2026'
      : 'مكتب ميسورا - دليل باقات الحج والعمرة الفاخرة والخدمات الملكية 2026';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${rtlDir}" lang="${isEn ? 'en' : 'ar'}">
      <head>
        <meta charset="utf-8">
        <title>${titleText}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
          body {
            font-family: ${isEn ? "'Playfair Display', serif" : "'Cairo', sans-serif"};
            background-color: #0D0D0D;
            color: #F8F5F0;
            padding: 40px;
            margin: 0;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .gold-text {
            color: #D4AF37;
          }
          .title {
            font-size: 28px;
            font-weight: 800;
            margin: 15px 0 5px 0;
          }
          .subtitle {
            font-size: 14px;
            color: #C0B7A6;
          }
          .badge {
            display: inline-block;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid #D4AF37;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 12px;
            color: #FFF0B3;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .card {
            background: #141414;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 16px;
            padding: 24px;
          }
          .card h3 {
            margin-top: 0;
            color: #D4AF37;
            font-size: 18px;
          }
          .card p {
            color: #C0B7A6;
            font-size: 13px;
          }
          .footer {
            text-align: center;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
            padding-top: 20px;
            font-size: 12px;
            color: #C0B7A6;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">MAYSORA PRIVATE CLIENT CONCIERGE</div>
          <div class="title">${titleText}</div>
          <div class="subtitle">المقر الرئيسي: مدينة برج العرب الجديدة، حوض سكرة وأبو حمد • هاتف: 01011860173</div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>باقة الحج الملكي VIP</h3>
            <p>• طيران خاص مباشر إلى مطار الملك عبد العزيز بجدة.</p>
            <p>• جناح ملكي بإطلالة مباشرة على الكعبة المشرفة في أبراج الساعة.</p>
            <p>• مخيمات VIP خاصة ومكيفة في منى وعرفات مع كونسيرج ومستشار ديني 24/7.</p>
            <p>• أسطول سيارات فارهة وسائق خاص طول فترة المشاعر المقدسة.</p>
          </div>
          <div class="card">
            <h3>باقة العمرة التنفيذية لكبار الشخصيات</h3>
            <p>• استقبال VIP من صالة الطيران الخاص وتسهيل كافة إجراءات الجوازات.</p>
            <p>• سيارات فاخرة وسائق خاص على مدار الساعة.</p>
            <p>• حجز وتنسيق تصاريح الروضة الشريفة والعمرة في أوقات الطمأنينة عبر نسك.</p>
            <p>• إقامة صف أول أمام الكعبة المشرفة في أرقى الفنادق الملكية.</p>
          </div>
          <div class="card">
            <h3>أجنحة الحرم الفاخرة والضيافة الملكية</h3>
            <p>• أجنحة مطلة بالكامل على الكعبة المشرفة في دار التوحيد وأبراج الساعة.</p>
            <p>• خدمة طاهٍ خاص وقوائم طعام معدّة حسب رغبتكم الخاصة.</p>
            <p>• إشراف ميداني ومساعد شخصي لتلبية كافة المتطلبات اليومية والعائلية.</p>
          </div>
          <div class="card">
            <h3>خدمات الطيران الخاص والكونسيرج 24/7</h3>
            <p>• جدولة طيران خاص (Private Jet) بمرونة مطلقة دون أي قيود.</p>
            <p>• فريق استقبال وتشريفات مرافق على مدار الساعة.</p>
            <p>• خصوصية تامة واهتمام فائق بأدق تفاصيل رحلتكم المباركة.</p>
          </div>
        </div>

        <div class="footer">
          <p>جميع الحقوق محفوظة © مكتب ميسورا 2026 • للتواصل المباشر: 01011860173 - 01017776863</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleClose = () => {
    setIsDownloaded(false);
    setName('');
    setPhone('');
    setEmail('');
    onClose();
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

        {isDownloaded ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center text-[#0D0D0D]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-arabic-heading text-gold-gradient">
              {isEn ? 'Brochure Download Ready' : 'تم تجهيز الكتيب الرقمي بنجاح'}
            </h3>
            <p className="text-sm text-[#C0B7A6] leading-relaxed max-w-sm mx-auto">
              {isEn
                ? 'Your PDF brochure has been generated. A copy has also been registered with your concierge advisor.'
                : 'تم فتح وتجهيز نسختك الرقمية. كما تم إشعار فريق كونسيرج ميسورا للتواصل وتقديم أي استشارات إضافية.'}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={triggerBrochureDownload}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isEn ? 'Re-Download PDF' : 'إعادة تحميل الكتيب'}</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#F8F5F0] bg-black/50 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 cursor-pointer"
              >
                <span>{isEn ? 'Close' : 'إغلاق'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                {isEn ? 'EXECUTIVE PORTFOLIO 2026' : 'الدليل الرقمي الحصري 2026'}
              </span>
            </div>

            <h3 className="text-2xl font-bold font-arabic-heading text-[#F8F5F0] mb-2">
              {isEn ? 'Download Royal Packages Brochure' : 'تحميل الكتيب التعريفي للباقات الملكية'}
            </h3>
            <p className="text-xs text-[#C0B7A6] leading-relaxed mb-6 font-light">
              {isEn
                ? 'Get comprehensive details of our Royal Hajj, Executive Umrah, Private Aviation, and VIP Concierge services in an elegant PDF.'
                : 'احصل على تفاصيل شاملة لرحلات الحج الملكي، العمرة التنفيذية، الطيران الخاص، وخدمات الكونسيرج الملكية في ملف رقمي فاخر.'}
            </p>

            <form onSubmit={handleDownload} className="space-y-4">
              <div>
                <label htmlFor="brochureFullName" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.fullName} *
                </label>
                <input
                  id="brochureFullName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.modal.fullNamePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="brochurePhone" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.phone} (WhatsApp) *
                </label>
                <input
                  id="brochurePhone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="brochureEmail" className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  {t.modal.email} ({isEn ? 'Optional' : 'اختياري للإرسال'})
                </label>
                <input
                  id="brochureEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
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
                    <span>{isEn ? 'Generating Portfolio...' : 'جاري إعداد وتحميل الكتيب...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{isEn ? 'Download PDF Brochure' : 'تحميل الكتيب الرقمي (PDF)'}</span>
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
