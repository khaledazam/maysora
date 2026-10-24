import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Users,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import type { Language } from '../data/translations';

export interface OctoberTripItem {
  id: string;
  dateStr: string;
  dayNumber: string;
  monthName: string;
  departure: {
    from: string;
    to: string;
    label: string;
  };
  returnFlight: {
    from: string;
    to: string;
    label: string;
  };
  makkahHotel: {
    name: string;
    type: string;
    shuttle: boolean;
  };
  madinahHotel: {
    name: string;
  };
  prices: {
    quad: string;   // رباعي
    triple: string; // ثلاثي
    double: string; // ثنائي
  };
  airportBadge: string;
  routeHighlight: string;
}

export const OCTOBER_TRIPS: OctoberTripItem[] = [
  {
    id: 'oct-13-safwat-albait',
    dateStr: '13 أكتوبر',
    dayNumber: '13',
    monthName: 'أكتوبر',
    departure: {
      from: 'مطار برج العرب',
      to: 'مطار جدة الدولي',
      label: 'برج العرب ➔ جدة'
    },
    returnFlight: {
      from: 'مطار جدة الدولي',
      to: 'مطار برج العرب',
      label: 'جدة ➔ برج العرب'
    },
    makkahHotel: {
      name: 'فندق صفوة البيت',
      type: 'مكة المكرمة • قرب الحرم وخدمات متميزة',
      shuttle: true
    },
    madinahHotel: {
      name: 'فندق روابي الزهراء'
    },
    prices: {
      quad: '37,500',
      triple: '39,500',
      double: '42,500'
    },
    airportBadge: 'مطار برج العرب بالإسكندرية',
    routeHighlight: 'مباشر ذهاب وعودة من الإسكندرية'
  },
  {
    id: 'oct-20-abraj-alkiswa',
    dateStr: '20 أكتوبر',
    dayNumber: '20',
    monthName: 'أكتوبر',
    departure: {
      from: 'مطار سفنكس الدولي',
      to: 'مطار المدينة المنورة',
      label: 'سفنكس ➔ المدينة'
    },
    returnFlight: {
      from: 'مطار جدة الدولي',
      to: 'مطار القاهرة الدولي',
      label: 'جدة ➔ القاهرة'
    },
    makkahHotel: {
      name: 'فندق أبراج الكسوة',
      type: 'مكة المكرمة • باصات ترددية على مدار 24 ساعة',
      shuttle: true
    },
    madinahHotel: {
      name: 'فندق روابي الزهراء'
    },
    prices: {
      quad: '38,500',
      triple: '41,500',
      double: '45,000'
    },
    airportBadge: 'مطار سفنكس / القاهرة',
    routeHighlight: 'نزول مباشر بالمدينة المنورة أولاً'
  },
  {
    id: 'oct-21-safwat-albait',
    dateStr: '21 أكتوبر',
    dayNumber: '21',
    monthName: 'أكتوبر',
    departure: {
      from: 'مطار القاهرة الدولي',
      to: 'مطار جدة الدولي',
      label: 'القاهرة ➔ جدة'
    },
    returnFlight: {
      from: 'مطار جدة الدولي',
      to: 'مطار القاهرة الدولي',
      label: 'جدة ➔ القاهرة'
    },
    makkahHotel: {
      name: 'فندق صفوة البيت',
      type: 'مكة المكرمة • فندقة راقية ومريحة',
      shuttle: true
    },
    madinahHotel: {
      name: 'فندق روابي الزهراء'
    },
    prices: {
      quad: '37,500',
      triple: '39,500',
      double: '42,500'
    },
    airportBadge: 'مطار القاهرة الدولي',
    routeHighlight: 'طيران منتظم مباشر ذهاب وعودة'
  },
  {
    id: 'oct-27-abraj-alkiswa',
    dateStr: '27 أكتوبر',
    dayNumber: '27',
    monthName: 'أكتوبر',
    departure: {
      from: 'مطار القاهرة الدولي',
      to: 'مطار جدة الدولي',
      label: 'القاهرة ➔ جدة'
    },
    returnFlight: {
      from: 'مطار المدينة المنورة',
      to: 'مطار سفنكس الدولي',
      label: 'المدينة ➔ سفنكس'
    },
    makkahHotel: {
      name: 'فندق أبراج الكسوة',
      type: 'مكة المكرمة • مجمع فندقي متكامل',
      shuttle: true
    },
    madinahHotel: {
      name: 'فندق روابي الزهراء'
    },
    prices: {
      quad: '38,500',
      triple: '41,500',
      double: '45,000'
    },
    airportBadge: 'القاهرة / مطار سفنكس',
    routeHighlight: 'عودة مباشرة من مطار المدينة إلى سفنكس'
  }
];

interface OctoberProgramsScheduleProps {
  lang: Language;
  onSelectBooking: (packageName: string) => void;
}

export const OctoberProgramsSchedule: React.FC<OctoberProgramsScheduleProps> = ({
  lang,
  onSelectBooking
}) => {
  const [selectedAirport, setSelectedAirport] = useState<string>('all');
  const [selectedRoomType, setSelectedRoomType] = useState<'all' | 'quad' | 'triple' | 'double'>('all');
  const isRtl = lang !== 'en';

  const filteredTrips = OCTOBER_TRIPS.filter((trip) => {
    if (selectedAirport === 'all') return true;
    if (selectedAirport === 'borg' && trip.departure.from.includes('برج العرب')) return true;
    if (selectedAirport === 'sphinx' && (trip.departure.from.includes('سفنكس') || trip.returnFlight.to.includes('سفنكس'))) return true;
    if (selectedAirport === 'cairo' && (trip.departure.from.includes('القاهرة') || trip.returnFlight.to.includes('القاهرة'))) return true;
    return false;
  });

  const handleBookTrip = (trip: OctoberTripItem, roomType?: 'quad' | 'triple' | 'double') => {
    let roomLabel = 'غرفة رباعية';
    let price = trip.prices.quad;

    if (roomType === 'triple') {
      roomLabel = 'غرفة ثلاثية';
      price = trip.prices.triple;
    } else if (roomType === 'double') {
      roomLabel = 'غرفة ثنائية';
      price = trip.prices.double;
    }

    const packageTitle = `عمرة شهر أكتوبر (${trip.dateStr}) - ${trip.makkahHotel.name} [${roomLabel} - ${price} ج.م] • خط سير: ${trip.departure.label} / ${trip.returnFlight.label}`;
    onSelectBooking(packageTitle);
  };

  const handleWhatsAppBooking = (trip: OctoberTripItem) => {
    const text = encodeURIComponent(
      `السلام عليكم مجموعة ميسورا، أود الاستفسار والحجز في برنامج شهر أكتوبر: رحلة (${trip.dateStr}) - إقامة ${trip.makkahHotel.name} بمكة وروابي الزهراء بالمدينة (خط سير: ${trip.departure.label} / ${trip.returnFlight.label}). يرجى إفادتي بالتفاصيل وتأكيد المقاعد المتاحة.`
    );
    window.open(`https://wa.me/201018884949?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Visual Header / Promotion Banner matching the flyer */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0E1A11] via-[#121A15] to-[#14120C] border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#25D366]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-start">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FFF0B3] text-xs font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isRtl ? 'بادر بالحجز • أماكن محدودة جداً' : 'Limited Seats • Book Now'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold font-arabic-heading text-[#F8F5F0] leading-tight">
              {isRtl ? (
                <>
                  برامج شهر <span className="text-gold-gradient">أكتوبر</span> بسعر اقتصادي
                </>
              ) : (
                <>
                  October Umrah Programs at <span className="text-gold-gradient">Economic Rates</span>
                </>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-[#C0B7A6] leading-relaxed">
              {isRtl
                ? 'مجموعة ميسورا تقدم باقة رحلات متكاملة بمستويات تسكين مريحة (صفوة البيت وأبراج الكسوة بمكة • روابي الزهراء بالمدينة المنورة) مع خيارات إقلاع متعددة من برج العرب، سفنكس، والقاهرة.'
                : 'Maysora Group presents comprehensive October packages from Borg El Arab, Sphinx, and Cairo airports with comfortable accommodations in Makkah and Madinah.'}
            </p>
          </div>

          {/* Quick highlight box */}
          <div className="glass-gold-card p-5 rounded-2xl border border-[#D4AF37]/35 shrink-0 bg-black/60 text-center space-y-2 min-w-[240px]">
            <span className="text-[11px] text-[#C0B7A6] block uppercase tracking-wider">
              {isRtl ? 'الأسعار تبدأ من' : 'Prices start from'}
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-mono">
                37,500
              </span>
              <span className="text-xs font-bold text-[#D4AF37]">
                {isRtl ? 'ج.م / للفرد' : 'EGP / Person'}
              </span>
            </div>
            <div className="pt-2 border-t border-[#D4AF37]/20 text-[11px] text-[#25D366] font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'شامل الطيران والتأشيرة والإقامة' : 'All Inclusive'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/25 backdrop-blur-md">
        {/* Airport Filter */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start w-full md:w-auto">
          <span className="text-xs font-bold text-[#D4AF37] px-2 flex items-center gap-1">
            <Plane className="w-3.5 h-3.5" />
            {isRtl ? 'المطار:' : 'Airport:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedAirport('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedAirport === 'all'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37] bg-black/40 border border-[#D4AF37]/20'
            }`}
          >
            {isRtl ? 'جميع المطارات (4 رحلات)' : 'All Airports'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedAirport('borg')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedAirport === 'borg'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37] bg-black/40 border border-[#D4AF37]/20'
            }`}
          >
            {isRtl ? 'مطار برج العرب' : 'Borg El Arab'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedAirport('sphinx')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedAirport === 'sphinx'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37] bg-black/40 border border-[#D4AF37]/20'
            }`}
          >
            {isRtl ? 'مطار سفنكس' : 'Sphinx Airport'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedAirport('cairo')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedAirport === 'cairo'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37] bg-black/40 border border-[#D4AF37]/20'
            }`}
          >
            {isRtl ? 'مطار القاهرة' : 'Cairo Airport'}
          </button>
        </div>

        {/* Room Type Highlight Filter */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full md:w-auto">
          <span className="text-xs font-bold text-[#D4AF37] px-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {isRtl ? 'نوع التسكين:' : 'Room Type:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedRoomType('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedRoomType === 'all'
                ? 'bg-[#D4AF37]/30 text-[#FFF0B3] border border-[#D4AF37]'
                : 'text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {isRtl ? 'الكل' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoomType('quad')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedRoomType === 'quad'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {isRtl ? 'رباعي (اقتصادي)' : 'Quad'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoomType('triple')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedRoomType === 'triple'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {isRtl ? 'ثلاثي' : 'Triple'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoomType('double')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedRoomType === 'double'
                ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                : 'text-[#C0B7A6] hover:text-[#D4AF37]'
            }`}
          >
            {isRtl ? 'ثنائي' : 'Double'}
          </button>
        </div>
      </div>

      {/* Desktop Table View (Exact Mirror of the Official Flyer) */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border-2 border-[#D4AF37]/35 glass-gold-card shadow-2xl">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#17221A] via-[#1A261D] to-[#121814] text-[#D4AF37] border-b-2 border-[#D4AF37]/40 text-sm font-bold">
              <th className="py-4 px-3 w-28">{isRtl ? 'التاريخ' : 'Date'}</th>
              <th className="py-4 px-3 w-44">{isRtl ? 'الذهاب' : 'Departure'}</th>
              <th className="py-4 px-3 w-44">{isRtl ? 'العودة' : 'Return'}</th>
              <th className="py-4 px-3 w-48">{isRtl ? 'الفنادق (مكة)' : 'Hotels (Makkah)'}</th>
              <th className="py-4 px-4 w-72">{isRtl ? 'الأسعار (ج.م / للفرد)' : 'Prices (EGP / Person)'}</th>
              <th className="py-4 px-3 w-36">{isRtl ? 'الإجراء' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/20 text-xs sm:text-sm">
            {filteredTrips.map((trip) => (
              <tr
                key={trip.id}
                className="hover:bg-[#D4AF37]/5 transition-colors group"
              >
                {/* Date */}
                <td className="py-5 px-3">
                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all">
                    <span className="text-2xl font-black text-gold-gradient font-mono">
                      {trip.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-[#F8F5F0]">
                      {trip.monthName}
                    </span>
                  </div>
                </td>

                {/* Departure Flight */}
                <td className="py-5 px-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-[#D4AF37]/20 text-xs font-semibold text-[#F8F5F0]">
                      <Plane className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span>{trip.departure.label}</span>
                    </div>
                    <span className="block text-[11px] text-[#C0B7A6]/80">
                      {trip.departure.from}
                    </span>
                  </div>
                </td>

                {/* Return Flight */}
                <td className="py-5 px-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-[#D4AF37]/20 text-xs font-semibold text-[#F8F5F0]">
                      <Plane className="w-3.5 h-3.5 text-[#D4AF37] rotate-180 shrink-0" />
                      <span>{trip.returnFlight.label}</span>
                    </div>
                    <span className="block text-[11px] text-[#C0B7A6]/80">
                      {trip.returnFlight.to}
                    </span>
                  </div>
                </td>

                {/* Makkah Hotel */}
                <td className="py-5 px-3">
                  <div className="p-3 rounded-2xl bg-black/50 border border-[#D4AF37]/20 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F8F5F0]">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>{trip.makkahHotel.name}</span>
                    </div>
                    <span className="block text-[10px] text-[#25D366]">
                      {trip.makkahHotel.type}
                    </span>
                  </div>
                </td>

                {/* Prices: Quad / Triple / Double */}
                <td className="py-5 px-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Quad */}
                    <button
                      type="button"
                      onClick={() => handleBookTrip(trip, 'quad')}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedRoomType === 'quad'
                          ? 'bg-gold-gradient text-[#0D0D0D] border-white shadow-md scale-105'
                          : 'bg-[#152319] border-[#25D366]/40 text-[#F8F5F0] hover:border-[#25D366]'
                      }`}
                      title={isRtl ? 'احجز غرفة رباعية' : 'Book Quad'}
                    >
                      <span className="block text-[10px] font-bold text-[#25D366] group-hover:text-gold-light uppercase">
                        {isRtl ? 'رباعي' : 'Quad'}
                      </span>
                      <span className="block text-sm font-extrabold font-mono text-gold-gradient">
                        {trip.prices.quad}
                      </span>
                    </button>

                    {/* Triple */}
                    <button
                      type="button"
                      onClick={() => handleBookTrip(trip, 'triple')}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedRoomType === 'triple'
                          ? 'bg-gold-gradient text-[#0D0D0D] border-white shadow-md scale-105'
                          : 'bg-[#17202B] border-[#0099FF]/40 text-[#F8F5F0] hover:border-[#0099FF]'
                      }`}
                      title={isRtl ? 'احجز غرفة ثلاثية' : 'Book Triple'}
                    >
                      <span className="block text-[10px] font-bold text-[#00B4D8] uppercase">
                        {isRtl ? 'ثلاثي' : 'Triple'}
                      </span>
                      <span className="block text-sm font-extrabold font-mono text-[#F8F5F0]">
                        {trip.prices.triple}
                      </span>
                    </button>

                    {/* Double */}
                    <button
                      type="button"
                      onClick={() => handleBookTrip(trip, 'double')}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedRoomType === 'double'
                          ? 'bg-gold-gradient text-[#0D0D0D] border-white shadow-md scale-105'
                          : 'bg-[#261E14] border-[#D4AF37]/40 text-[#F8F5F0] hover:border-[#D4AF37]'
                      }`}
                      title={isRtl ? 'احجز غرفة ثنائية' : 'Book Double'}
                    >
                      <span className="block text-[10px] font-bold text-[#D4AF37] uppercase">
                        {isRtl ? 'ثنائي' : 'Double'}
                      </span>
                      <span className="block text-sm font-extrabold font-mono text-[#FFF0B3]">
                        {trip.prices.double}
                      </span>
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-5 px-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleBookTrip(trip)}
                      className="w-full py-2 px-3 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs shadow-md shadow-[#D4AF37]/20 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'احجز الآن' : 'Book'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppBooking(trip)}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-semibold text-[11px] hover:bg-[#25D366]/25 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="glass-gold-card rounded-3xl p-6 border-2 border-[#D4AF37]/30 shadow-xl space-y-5 relative overflow-hidden"
          >
            {/* Top Date Badge & Airport */}
            <div className="flex items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gold-gradient text-[#0D0D0D] font-bold shadow-md">
                  <span className="text-xl font-black font-mono leading-none">{trip.dayNumber}</span>
                  <span className="text-[10px] leading-tight">{trip.monthName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#D4AF37] block">
                    {trip.airportBadge}
                  </span>
                  <span className="text-[11px] text-[#25D366] font-medium block">
                    {trip.routeHighlight}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Itinerary */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-black/60 border border-[#D4AF37]/15">
              <div className="flex items-center justify-between text-xs text-[#F8F5F0]">
                <span className="text-[#C0B7A6] font-medium">{isRtl ? 'الذهاب:' : 'Outbound:'}</span>
                <span className="font-bold flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-[#25D366]" />
                  {trip.departure.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#F8F5F0]">
                <span className="text-[#C0B7A6] font-medium">{isRtl ? 'العودة:' : 'Inbound:'}</span>
                <span className="font-bold flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-[#D4AF37] rotate-180" />
                  {trip.returnFlight.label}
                </span>
              </div>
            </div>

            {/* Hotels */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/15 flex items-center gap-2 text-[#F8F5F0]">
                <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-bold">{isRtl ? 'مكة المكرمة: ' : 'Makkah: '}</span>
                  <span>{trip.makkahHotel.name}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/15 flex items-center gap-2 text-[#F8F5F0]">
                <Building2 className="w-4 h-4 text-[#25D366] shrink-0" />
                <div>
                  <span className="font-bold">{isRtl ? 'المدينة المنورة: ' : 'Madinah: '}</span>
                  <span>{trip.madinahHotel.name}</span>
                </div>
              </div>
            </div>

            {/* Room Prices Matrix */}
            <div>
              <span className="text-xs font-bold text-[#D4AF37] block mb-2">
                {isRtl ? 'الأسعار حسب نوع الغرفة (ج.م / للفرد):' : 'Prices per room (EGP / person):'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleBookTrip(trip, 'quad')}
                  className="p-2.5 rounded-xl bg-[#152319] border border-[#25D366]/40 text-center hover:border-[#25D366] transition-all cursor-pointer"
                >
                  <span className="block text-[10px] font-bold text-[#25D366] uppercase">
                    {isRtl ? 'رباعي' : 'Quad'}
                  </span>
                  <span className="block text-sm font-extrabold font-mono text-gold-gradient">
                    {trip.prices.quad}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBookTrip(trip, 'triple')}
                  className="p-2.5 rounded-xl bg-[#17202B] border border-[#0099FF]/40 text-center hover:border-[#0099FF] transition-all cursor-pointer"
                >
                  <span className="block text-[10px] font-bold text-[#00B4D8] uppercase">
                    {isRtl ? 'ثلاثي' : 'Triple'}
                  </span>
                  <span className="block text-sm font-extrabold font-mono text-[#F8F5F0]">
                    {trip.prices.triple}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBookTrip(trip, 'double')}
                  className="p-2.5 rounded-xl bg-[#261E14] border border-[#D4AF37]/40 text-center hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <span className="block text-[10px] font-bold text-[#D4AF37] uppercase">
                    {isRtl ? 'ثنائي' : 'Double'}
                  </span>
                  <span className="block text-sm font-extrabold font-mono text-[#FFF0B3]">
                    {trip.prices.double}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleBookTrip(trip)}
                className="flex-1 py-3 rounded-full bg-gold-gradient text-[#0D0D0D] font-bold text-xs shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'احجز هذه الرحلة' : 'Book Itinerary'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppBooking(trip)}
                className="px-4 py-3 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-bold text-xs hover:bg-[#25D366]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title={isRtl ? 'استفسار واتساب' : 'WhatsApp Inquiry'}
              >
                <span>واتساب</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Flyer Bottom Banner: فندق المدينة المنورة للجميع (روابي الزهراء) */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-r from-[#1A180E] via-[#241F10] to-[#1A180E] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#FFF0B3]">
              {isRtl
                ? 'فندق المدينة المنورة لكافة برامج شهر أكتوبر: فندق روابي الزهراء'
                : 'Madinah Hotel for all October Programs: Rawabi Al Zahraa Hotel'}
            </h4>
            <p className="text-xs text-[#C0B7A6]">
              {isRtl
                ? 'إقامة مريحة بالقرب من الحرم النبوي الشريف مع تأمين كامل لتصاريح زيارة الروضة الشريفة ونسك.'
                : 'Comfortable stay near the Prophet’s Mosque with Rawdah visit permits fully secured.'}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] bg-black/50 px-3.5 py-2 rounded-xl border border-[#D4AF37]/30 whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-[#25D366]" />
          <span>{isRtl ? 'مجموعة ميسورا • جودة واعتماد رسمي' : 'Official Licensed'}</span>
        </div>
      </div>
    </div>
  );
};
