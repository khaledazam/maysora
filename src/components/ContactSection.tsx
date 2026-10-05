import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import type { TranslationContent } from '../data/translations';

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

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'hajj-umrah', message: '' });
    }, 5000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `السلام عليكم مكتب ميسورة، أود الاستفسار عن الخدمات الخاصة بكم (حج/عمرة/استشارات مالية).`
    );
    window.open(`https://wa.me/966500000000?text=${text}`, '_blank');
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
            
            {/* Quick WhatsApp Direct Button */}
            <div className="glass-gold-card rounded-3xl p-6 border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#F8F5F0]">
                  {t.contact.whatsAppBtn}
                </h3>
              </div>
              <p className="text-xs text-[#C0B7A6] mb-6 font-light leading-relaxed">
                تحدث فوراً مع مستشار المشتريات والخدمات الخاصة لكبار الشخصيات عبر تطبيق WhatsApp على مدار الساعة.
              </p>
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>فتح المحادثة الفورية في WhatsApp</span>
              </button>
            </div>

            {/* Office Info Details */}
            <div className="glass-gold-card rounded-3xl p-8 space-y-6 border border-[#D4AF37]/20">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">المقر الرئيسي والأفراع</h4>
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
                  <p className="text-xs text-[#C0B7A6] leading-relaxed">
                    المملكة العربية السعودية: +966 11 800 9000
                    <br />
                    الدولي / الإمارات: +971 4 800 9000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5F0] mb-1">البريد الإلكتروني المباشر</h4>
                  <p className="text-xs text-[#C0B7A6]">vip@maysora.com | info@maysora.com</p>
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
                    <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formName} *
                    </label>
                    <input
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
                    <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formPhone} *
                    </label>
                    <input
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
                    <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formEmail} *
                    </label>
                    <input
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
                    <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                      {t.contact.formService}
                    </label>
                    <select
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
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                    {t.contact.formMessage}
                  </label>
                  <textarea
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
                  className="w-full py-4 rounded-full text-sm font-bold text-[#0D0D0D] bg-gold-gradient hover:brightness-110 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.formSubmit}</span>
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
                مقر ميسورة الرياض • أبراج البيت مكة
              </h4>
              <p className="text-xs text-[#C0B7A6] mt-1">
                King Fahd Road Financial District, Riyadh & Clock Tower, Makkah
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
