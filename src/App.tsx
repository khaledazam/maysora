import { useState, useEffect } from 'react';
import type { Language } from './data/translations';
import { translations } from './data/translations';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PartnersSection } from './components/PartnersSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PackagesHub } from './components/PackagesHub';
import { HotelsShowcase } from './components/HotelsShowcase';
import { JourneyTimeline } from './components/JourneyTimeline';
import { FinancialAccountingSection } from './components/FinancialAccountingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { BookingModal } from './components/BookingModal';
import { BrochureModal } from './components/BrochureModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FloatingNav } from './components/FloatingNav';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { isAuthenticated } from './services/authService';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('maysora_lang') as Language;
    if (saved && (saved === 'ar-sa' || saved === 'ar' || saved === 'en')) {
      return saved;
    }
    return 'ar-sa'; // Default to Saudi dialect
  });

  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [view, setView] = useState<'site' | 'admin'>(() => {
    if (typeof window !== 'undefined' && (window.location.hash.startsWith('#admin') || window.location.hash.startsWith('#dashboard'))) {
      return 'admin';
    }
    return 'site';
  });
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin') || window.location.hash.startsWith('#dashboard')) {
        setView('admin');
        setIsAdminAuthed(isAuthenticated());
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setView('site');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('maysora_lang', lang);
    const isEn = lang === 'en';
    document.documentElement.dir = isEn ? 'ltr' : 'rtl';
    document.documentElement.lang = isEn ? 'en' : 'ar';
    document.title = isEn
      ? 'MAYSORA | Luxury VIP Hajj & Umrah • Al Safwah Royal Suites & Shariah Advisory'
      : (lang === 'ar-sa'
        ? 'ميسورة | باقات الحج والعمرة الفاخرة • أجنحة فندق الصفوة المطلة على الكعبة • استشارات مالية وزكاة ZATCA'
        : 'مكتب ميسورة | باقات الحج والعمرة الملكية • حجز فندق الصفوة رويال أوركيد مكة • استشارات مالية وزكاة ZATCA');
  }, [lang]);

  const t = translations[lang];

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [selectedPreService, setSelectedPreService] = useState<string | undefined>(undefined);

  const handleOpenBookingModal = () => {
    setModalTitle(t.modal.bookingTitle);
    setSelectedPackage(undefined);
    setIsModalOpen(true);
  };

  const handleOpenConsultationModal = () => {
    setModalTitle(t.modal.consultationTitle);
    setSelectedPackage(undefined);
    setIsModalOpen(true);
  };

  const handleSelectPackage = (packageName: string) => {
    setModalTitle(t.modal.bookingTitle);
    setSelectedPackage(packageName);
    setIsModalOpen(true);
  };

  const handleSelectCustomPackage = (customSpecs: string) => {
    setModalTitle(t.modal.bookingTitle);
    setSelectedPackage(customSpecs);
    setIsModalOpen(true);
  };

  const handleSelectService = (serviceKey: string) => {
    setSelectedPreService(serviceKey);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Admin View
  if (view === 'admin') {
    if (isAdminAuthed) {
      return (
        <AdminDashboard
          onBackToSite={() => {
            setView('site');
            window.location.hash = '#home';
          }}
          onLogout={() => {
            setIsAdminAuthed(false);
          }}
        />
      );
    }
    return (
      <AdminLogin
        onSuccess={() => {
          setIsAdminAuthed(true);
        }}
        onBackToSite={() => {
          setView('site');
          window.location.hash = '#home';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F5F0] selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      
      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
        onOpenAdmin={() => {
          setView('admin');
          window.location.hash = '#admin';
          setIsAdminAuthed(isAuthenticated());
        }}
      />

      {/* Hero Section */}
      <Hero
        lang={lang}
        t={t}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Accreditations & Partners Trust Bar */}
      <PartnersSection t={t} />

      {/* Services Section */}
      <ServicesSection
        lang={lang}
        t={t}
        onSelectService={handleSelectService}
      />

      {/* Why Choose MAYSORA */}
      <WhyChooseUs t={t} />

      {/* Unified Packages Hub (Ready Packages • Customizer • Comparison Matrix) */}
      <PackagesHub
        lang={lang}
        t={t}
        onSelectPackage={handleSelectPackage}
        onSelectCustomPackage={handleSelectCustomPackage}
        onOpenBrochureModal={() => setIsBrochureOpen(true)}
      />

      {/* Dynamic Luxury Hotels & Suites Showcase */}
      <HotelsShowcase
        lang={lang}
        t={t}
        onBookHotel={(hotelName) => {
          setModalTitle(`${t.modal.bookingTitle} - ${hotelName}`);
          setSelectedPackage(`إقامة في ${hotelName}`);
          setIsModalOpen(true);
        }}
      />

      {/* The VIP Journey Steps Timeline */}
      <JourneyTimeline
        lang={lang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Financial & Accounting Hub + Calculator */}
      <FinancialAccountingSection
        lang={lang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Client Testimonials */}
      <TestimonialsSection t={t} />

      {/* FAQ Section */}
      <FAQSection
        lang={lang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Contact Section */}
      <ContactSection
        t={t}
        selectedPreService={selectedPreService}
      />

      {/* Footer */}
      <Footer lang={lang} t={t} />

      {/* Floating WhatsApp Quick Concierge */}
      <FloatingWhatsApp lang={lang} />

      {/* Floating Scroll To Top Button */}
      <FloatingNav lang={lang} />

      {/* Slide-over / Modal Trigger */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        initialPackage={selectedPackage}
        t={t}
      />

      {/* Digital VIP Brochure Modal */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        lang={lang}
        t={t}
      />

    </div>
  );
}

export default App;
