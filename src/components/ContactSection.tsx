import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, Send, ShieldCheck, Loader2 } from 'lucide-react';
import type { TranslationContent } from '../data/translations';
import { submitLeadToGoogleSheets } from '../services/leadService';
import { trackEvent } from '../services/analytics';

interface ContactSectionProps {
  t: TranslationContent;
  selectedPreService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  t,
  selectedPreService
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: selectedPreService || 'hajj-umrah',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Find service label
    const selectedServiceObj = t.contact.serviceOptions.find((opt) => opt.value === formData.service);
    const serviceLabel = selectedServiceObj ? selectedServiceObj.label : formData.service;

    await submitLeadToGoogleSheets({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      serviceOrPackage: serviceLabel,
      messageOrNotes: formData.message,
      source: 'Contact Section'
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'hajj-umrah', message: '' });
    }, 5000);
  };

  const handleWhatsAppRedirect = () => {
    trackEvent('whatsapp_click', { location: 'contact_section' });
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله، أود التواصل مع بشمهندس أحمد رمضان بخصوص خدمات ميسورة VIP (حج/عمرة/استشارات مالية).`
    );
    window.open(`https://wa.me/201011860173?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="relative py-24 bg-[#141414] overflow-hidden">
      
      {/* Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-3 block">
            {t.contact.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-6">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Executive Direct Contact Card (بشمهندس أحمد رمضان) */}
            <div className="glass-gold-card rounded-3xl p-6 border-2 border-[#D4AF37]/50 bg-gradient-to-br from-[#1C1810] via-[#141414] to-[#0D0D0D] relative overflow-hidden shadow-2xl">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 block w-fit mb-2">
                    المستشار التنفيذي المباشر
                  </span>
                  <h3 className="text-xl font-bold text-[#F8F5F0] font-arabic-heading">
                    {t.contact.executiveName || 'بشمهندس أحمد رمضان'}
                  </h3>
                  <p className="text-xs text-[#C0B7A6] font-light">
                    {t.contact.executiveRole || 'المسؤول التنفيذي لخدمات كبار الشخصيات والشراكات'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C7335] flex items-center justify-center text-[#0D0D0D] font-bold text-lg shadow-md shrink-0">
                  AR
                </div>
              </div>

              {/* Direct Phone Highlight */}
              <div className="bg-[#0A0A0A]/90 rounded-2xl p-4 border border-[#D4AF37]/30 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C0B7A6] block">رقم الاتصال المباشر والواتساب</span>
                    <a
                      href="tel:01011860173"
                      className="text-lg font-bold text-[#FFF0B3] font-mono tracking-wider hover:text-[#D4AF37] transition-colors dir-ltr block"
                    >
                      01011860173
                    </a>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-[#25D366]/15 text-[#25D366] font-semibold border border-[#25D366]/30">
                  متاح 24/7
                </span>
              </div>

              {/* Buttons Dual: Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>محادثة واتساب</span>
                </button>
                <a
                  href="tel:01011860173"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال هاتفي</span>
                </a>
              </div>
            </div>

            {/* Office Info Details */}
            <div className="glass-gold-card rounded-3xl p-8 space-y-6 border border-[#D4AF37]/20">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">
                    مقر المكتب الرئيسي
                  </h4>
                  <p className="text-xs text-[#C0B7A6] leading-relaxed">
                    {t.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">{t.contact.callUs}</h4>
                  <p className="text-xs text-[#C0B7A6] leading-relaxed space-y-1">
                    <span>مباشر (مصر / دولي): <strong className="text-[#FFF0B3] font-mono">01011860173</strong> (بشمهندس أحمد رمضان)</span>
                    <br />
                    <span>المملكة العربية السعودية: +966 11 800 9000</span>
                    <br />
                    <span>الدولي / الإمارات: +971 4 800 9000</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">البريد الإلكتروني المباشر</h4>
                  <p className="text-xs text-[#C0B7A6]">vip@maysoragroup.com | info@maysoragroup.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">ساعات العمل الرسمية</h4>
                  <p className="text-xs text-[#C0B7A6]">{t.contact.hours}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 glass-gold-card rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/25">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center text-[#0D0D0D]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-arabic-heading text-gold-gradient">
                  تم إرسال الطلب بنجاح
                </h3>
                <p className="text-sm text-[#C0B7A6] max-w-md mx-auto leading-relaxed">
                  {t.contact.successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="contactFormName" className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formName} *
                    </label>
                    <input
                      id="contactFormName"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="عبدالله سليمان"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="contactFormPhone" className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formPhone} *
                    </label>
                    <input
                      id="contactFormPhone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 50 123 4567"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="contactFormEmail" className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formEmail} *
                    </label>
                    <input
                      id="contactFormEmail"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label htmlFor="contactFormService" className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formService}
                    </label>
                    <select
                      id="contactFormService"
                      aria-label={t.contact.formService}
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {t.contact.serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1A1A1A] text-[#F8F5F0]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contactFormMessage" className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                    {t.contact.formMessage}
                  </label>
                  <textarea
                    id="contactFormMessage"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب هنا التفاصيل الخاصة برحلتك أو متطلبات استشارتك المالية..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full text-sm font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري إرسال الطلب وحفظ البيانات...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.contact.formSubmit}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#C0B7A6]/70 pt-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>جميع معلوماتك مشفرة ومحاطة بالسرية التامة وفق الأنظمة المعتمدة</span>
                </div>

              </form>
            )}

          </div>

        </div>

        {/* Map View Placeholder Card */}
        <div className="mt-16 rounded-3xl overflow-hidden glass-gold-card border border-[#D4AF37]/20 p-2 h-72 relative">
          <div className="w-full h-full bg-[#0D0D0D] rounded-2xl relative overflow-hidden flex items-center justify-center">
            {/* Dark Styled Map Overlay Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="relative z-10 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gold-gradient mx-auto flex items-center justify-center text-[#0D0D0D] mb-3 shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-arabic-heading text-[#F8F5F0]">
                مقر مكتب ميسورة الرئيسي
              </h4>
              <p className="text-xs text-[#C0B7A6] mt-1">
                {t.contact.address}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
