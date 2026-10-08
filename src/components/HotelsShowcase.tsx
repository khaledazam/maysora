import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Star,
  MapPin,
  Compass,
  Images,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Building2
} from 'lucide-react';
import type { Language, TranslationContent } from '../data/translations';
import {
  type ManagedHotel,
  getManagedHotels,
  subscribeToHotelUpdates,
  loadManagedHotelsFromCloud
} from '../services/hotelService';

interface HotelsShowcaseProps {
  lang: Language;
  t: TranslationContent;
  onBookHotel?: (hotelName: string) => void;
}

export const HotelsShowcase: React.FC<HotelsShowcaseProps> = ({
  lang,
  onBookHotel
}) => {
  const [hotels, setHotels] = useState<ManagedHotel[]>([]);
  const [activeHotelId, setActiveHotelId] = useState<string>('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxHotel, setLightboxHotel] = useState<ManagedHotel | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const isRtl = lang !== 'en';

  useEffect(() => {
    const list = getManagedHotels();
    setHotels(list);
    if (list.length > 0) {
      setActiveHotelId(list[0].id);
    }

    loadManagedHotelsFromCloud().then((cloud) => {
      if (cloud && cloud.length > 0) {
        setHotels(cloud);
        if (!activeHotelId) setActiveHotelId(cloud[0].id);
      }
    });

    const unsubscribe = subscribeToHotelUpdates((updated) => {
      setHotels(updated);
      if (updated.length > 0 && !updated.some(h => h.id === activeHotelId)) {
        setActiveHotelId(updated[0].id);
      }
    });

    return unsubscribe;
  }, []);

  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0];

  const handleOpenLightbox = (hotel: ManagedHotel, startIdx = 0) => {
    setLightboxHotel(hotel);
    setActivePhotoIdx(startIdx);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    if (!lightboxHotel || lightboxHotel.gallery.length === 0) return;
    setActivePhotoIdx((prev) => (prev + 1) % lightboxHotel.gallery.length);
  };

  const handlePrevPhoto = () => {
    if (!lightboxHotel || lightboxHotel.gallery.length === 0) return;
    setActivePhotoIdx((prev) =>
      prev === 0 ? lightboxHotel.gallery.length - 1 : prev - 1
    );
  };

  if (!hotels || hotels.length === 0) return null;

  return (
    <section id="hotels" className="relative py-24 bg-[#0A0A0A] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8C7335]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إقامات الصف الأول أمام الكعبة المشرفة' : 'Front-Row Haram Accommodations'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-arabic-heading font-serif-en text-[#F8F5F0] mb-5 tracking-tight">
            {isRtl ? 'فنادق النخبة وأجنحة الحرم الملكية' : 'Elite Haram Hotels & Royal Suites'}
          </h2>

          <p className="text-base sm:text-lg text-[#C0B7A6] font-light leading-relaxed">
            {isRtl
              ? 'شراكات حصرية مع أرقى فنادق وأبراج الحرم المكي الشريف، بإطلالات مباشرة لا تحجبها حواجز على الكعبة المشرفة وبوفيهات ملكية فاخرة.'
              : 'Exclusive partnerships with the most prestigious hotels facing the Holy Kaaba, offering unobstructed panoramic views and private Haram access.'}
          </p>
        </div>

        {/* Dynamic Hotel Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-black/70 border border-[#D4AF37]/30 backdrop-blur-xl max-w-full overflow-x-auto gap-1">
            {hotels.map((h) => {
              const isSelected = h.id === activeHotel?.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHotelId(h.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gold-gradient text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/25 font-bold'
                      : 'text-[#C0B7A6] hover:text-[#D4AF37] hover:bg-white/5'
                  }`}
                >
                  <Hotel className="w-4 h-4 shrink-0" />
                  <span>{isRtl ? h.name : (h.nameEn || h.name)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Hotel Featured Showcase Card */}
        {activeHotel && (
          <div className="rounded-3xl bg-[#121212] border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left/Right Interactive Gallery Column (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-white/10 rtl:lg:border-l-0 rtl:lg:border-r">
                <div>
                  {/* Main Large Photo */}
                  <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 mb-4 group cursor-pointer"
                       onClick={() => handleOpenLightbox(activeHotel, 0)}>
                    <img
                      src={activeHotel.coverImage}
                      alt={`${activeHotel.name} - إطلالة الكعبة المشرفة وأجنحة الحرم الفاخرة`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Overlay Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/85 border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                        <span>{activeHotel.stars} {isRtl ? 'نجوم ديولكس VIP' : 'Stars Deluxe'}</span>
                      </span>

                      {activeHotel.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-gold-gradient text-[#0D0D0D] text-xs font-bold shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{isRtl ? 'إقامة معتمدة' : 'Verified'}</span>
                        </span>
                      )}
                    </div>

                    {/* View Full Album Button */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="text-white">
                        <span className="text-[11px] text-[#D4AF37] font-semibold block">
                          {isRtl ? 'إطلالة حصرية موثقة' : 'Verified View'}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold font-arabic-heading">
                          {isRtl ? activeHotel.name : activeHotel.nameEn}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLightbox(activeHotel, 0);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-black/80 hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                      >
                        <Images className="w-4 h-4" />
                        <span>{isRtl ? `استعراض ${activeHotel.gallery.length} صور` : `View ${activeHotel.gallery.length} Photos`}</span>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {activeHotel.gallery.slice(0, 6).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleOpenLightbox(activeHotel, idx)}
                        className="relative h-16 sm:h-20 rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37] cursor-pointer group/thumb transition-all hover:scale-105"
                      >
                        <img
                          src={img}
                          alt={`${activeHotel.name} - صورة ${idx + 1} - إطلالة الحرم والخدمات`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-transparent transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/50">
                          <Eye className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#C0B7A6]">
                  <span className="flex items-center gap-1 text-[#D4AF37]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeHotel.location}</span>
                  </span>
                  <span className="font-semibold text-white">
                    {activeHotel.ratingScore}
                  </span>
                </div>
              </div>

              {/* Right Details & Specs Column (5 cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#141414]">
                <div className="space-y-6">
                  {/* Distance Pill */}
                  <div className="p-4 rounded-2xl bg-gold-subtle-gradient border border-[#D4AF37]/35 space-y-1">
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      <span>{isRtl ? 'الموقع بالنسبة للحرم المكي' : 'Distance To Haram'}</span>
                    </span>
                    <p className="text-sm font-bold text-[#FFF0B3]">
                      {activeHotel.distanceToHaram}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-arabic-heading text-[#F8F5F0] mb-2">
                      {isRtl ? activeHotel.name : activeHotel.nameEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#C0B7A6] leading-relaxed font-light">
                      {activeHotel.description}
                    </p>
                  </div>

                  {/* Key Amenities */}
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] block mb-3 uppercase tracking-wider">
                      {isRtl ? 'مزايا الإقامة والضيافة المشمولة:' : 'Included Royal Amenities:'}
                    </span>
                    <ul className="space-y-2.5">
                      {activeHotel.amenities.map((am, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F8F5F0]/90">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{am}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Room Types */}
                  {activeHotel.roomTypes && activeHotel.roomTypes.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-[#A0937D] block mb-2">
                        {isRtl ? 'فئات الأجنحة والغرف المعتمدة:' : 'Available Suite Categories:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeHotel.roomTypes.map((rt, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-3 py-1 rounded-full bg-[#1C1C1C] border border-white/10 text-[#E2DACB]"
                          >
                            {rt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking CTA Button */}
                <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onBookHotel && onBookHotel(activeHotel.name)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Hotel className="w-4 h-4" />
                    <span>{isRtl ? `طلب حجز إقامة في ${activeHotel.name}` : `Book Stay at ${activeHotel.nameEn || activeHotel.name}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(activeHotel, 0)}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#1C1C1C] hover:bg-[#252525] border border-white/15 text-xs text-[#E2DACB] hover:text-[#D4AF37] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Images className="w-4 h-4" />
                    <span>{isRtl ? 'معرض الصور' : 'Gallery'}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= LIGHTBOX MODAL: FULL RESOLUTION HOTEL GALLERY ================= */}
      {lightboxOpen && lightboxHotel && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          
          {/* Top Header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-base sm:text-lg font-bold text-[#FFF0B3] font-arabic-heading">
                  {isRtl ? lightboxHotel.name : lightboxHotel.nameEn}
                </h3>
              </div>
              <p className="text-xs text-[#C0B7A6]">
                {isRtl
                  ? `صورة ${activePhotoIdx + 1} من إجمالي ${lightboxHotel.gallery.length} صور موثقة`
                  : `Photo ${activePhotoIdx + 1} of ${lightboxHotel.gallery.length}`}
              </p>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Large Photo with Nav Arrows */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
            <button
              onClick={handlePrevPhoto}
              className="absolute right-4 p-3.5 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] transition-all cursor-pointer z-10 border border-white/10"
              aria-label="السابق"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <img
              src={lightboxHotel.gallery[activePhotoIdx]}
              alt={lightboxHotel.name}
              className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <button
              onClick={handleNextPhoto}
              className="absolute left-4 p-3.5 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] transition-all cursor-pointer z-10 border border-white/10"
              aria-label="التالي"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Carousel Strip */}
          <div className="w-full max-w-4xl overflow-x-auto py-2">
            <div className="flex items-center justify-center gap-2">
              {lightboxHotel.gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                    activePhotoIdx === idx
                      ? 'border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/40'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
