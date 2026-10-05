import { useState } from 'react';
import type { Language } from './data/translations';
import { translations } from './data/translations';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PackagesSection } from './components/PackagesSection';
import { FinancialAccountingSection } from './components/FinancialAccountingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

export function App() {
  const [lang, setLang] = useState<Language>('ar');
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

  const handleSelectService = (serviceKey: string) => {
    setSelectedPreService(serviceKey);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F5F0] selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      
      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Hero Section */}
      <Hero
        lang={lang}
        t={t}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Services Section */}
      <ServicesSection
        lang={lang}
        t={t}
        onSelectService={handleSelectService}
      />

      {/* Why Choose MAYSORA */}
      <WhyChooseUs t={t} />

      {/* Luxury Packages */}
      <PackagesSection
        lang={lang}
        t={t}
        onSelectPackage={handleSelectPackage}
      />

      {/* Financial & Accounting Hub + Calculator */}
      <FinancialAccountingSection
        lang={lang}
        t={t}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Client Testimonials */}
      <TestimonialsSection t={t} />

      {/* Contact Section */}
      <ContactSection
        t={t}
        selectedPreService={selectedPreService}
      />

      {/* Footer */}
      <Footer lang={lang} t={t} />

      {/* Floating WhatsApp Quick Concierge */}
      <FloatingWhatsApp lang={lang} />

      {/* Slide-over / Modal Trigger */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        initialPackage={selectedPackage}
        t={t}
      />

    </div>
  );
}

export default App;
