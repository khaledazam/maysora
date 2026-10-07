/**
 * Luxury Hotels & Accommodations Management Service
 * Manages dynamic hotel listings, photos galleries, room amenities, and Haram proximity.
 */

export interface ManagedHotel {
  id: string;
  name: string;
  nameEn: string;
  city: 'makkah' | 'madinah' | 'international';
  location: string;
  distanceToHaram: string;
  stars: number;
  ratingScore: string;
  description: string;
  coverImage: string;
  gallery: string[];
  amenities: string[];
  roomTypes: string[];
  isFeatured: boolean;
  order: number;
}

// Available local library images for quick selection in the dashboard
export const AVAILABLE_LIBRARY_IMAGES = [
  { url: '/images/648211000.jpg.jpeg', label: 'إطلالة الجناح البانورامية على الكعبة المشرفة' },
  { url: '/images/534253758.jpg.jpeg', label: 'واجهة فندق الصفوة رويال أوركيد أمام الحرم' },
  { url: '/images/648222270.jpg.jpeg', label: 'بوفيه الحلويات والمخبوزات الفاخر' },
  { url: '/images/648222260.jpg.jpeg', label: 'بوفيه الأطباق والمأكولات الملكية الساخنة' },
  { url: '/images/648222272.jpg.jpeg', label: 'بوفيه السلطات والمقبلات الطازجة' },
  { url: '/images/648210979.jpg.jpeg', label: 'جناح النوم الفاخر مع إطلالة الحرم' },
  { url: '/images/648210275.jpg.jpeg', label: 'صالون الجلوس والاستراحة الملكية' },
  { url: '/images/648210065.jpg.jpeg', label: 'مستلزمات الحمام والرخام الإيطالي' },
  { url: '/images/648211000.jpg_1.jpeg', label: 'إطلالة الصباح المباشرة على صحن الطواف' },
  { url: '/images/648216898.jpg.jpeg', label: 'بهو الاستقبال وكونسيرج كبار الشخصيات' },
  { url: '/images/648216901.jpg.jpeg', label: 'صالة المطعم والإطلالة الزجاجية' },
  { url: '/images/534253756.jpg.jpeg', label: 'مدخل الأجنحة والممرات الفندقية' },
  { url: '/images/hajj_vip.webp', label: 'أبراج الحرم المكي الشريف' },
  { url: '/images/hero_bg.webp', label: 'المسجد الحرام والكعبة المشرفة' },
];

export const DEFAULT_HOTELS: ManagedHotel[] = [
  {
    id: 'hotel-safwah',
    name: 'فندق الصفوة رويال أوركيد مكة المكرمة',
    nameEn: 'Al Safwah Royale Orchid Makkah',
    city: 'makkah',
    location: 'مكة المكرمة - وقف الملك عبد العزيز أمام بوابة الملك عبد العزيز مباشرة',
    distanceToHaram: '0 متر (إطلالة ومصاعد مباشرة على ساحات الحرم والكعبة)',
    stars: 5,
    ratingScore: '9.8 / 10',
    description: 'يقع فندق الصفوة رويال أوركيد في موقع استثنائي ومباشر أمام الحرم المكي الشريف، ويوفر إطلالات ساحرة ومباشرة على الكعبة المشرفة ومصاعد سريعة تنقلك إلى صحن الطواف في لحظات، مع مطاعم وبوفيهات عالمية فاخرة.',
    coverImage: '/images/648211000.jpg.jpeg',
    gallery: [
      '/images/648211000.jpg.jpeg',
      '/images/534253758.jpg.jpeg',
      '/images/648222270.jpg.jpeg',
      '/images/648222260.jpg.jpeg',
      '/images/648222272.jpg.jpeg',
      '/images/648210979.jpg.jpeg',
      '/images/648210275.jpg.jpeg',
      '/images/648210065.jpg.jpeg',
      '/images/648211000.jpg_1.jpeg',
      '/images/648216898.jpg.jpeg',
      '/images/648216901.jpg.jpeg',
      '/images/534253756.jpg.jpeg',
    ],
    amenities: [
      'إطلالة بانورامية مباشرة على الكعبة المشرفة',
      'مصاعد خاصة وسريعة متصلة بساحات الحرم مباشرة',
      'بوفيه مفتوح إفطار وعشاء 5 نجوم بأيدي طهاة عالميين',
      'أجنحة رئاسية وعائلية فسيحة ذات تصميم ملكي',
      'خدمة كونسيرج واستقبال كبار الشخصيات على مدار 24 ساعة',
      'إنترنت عالي السرعة فائق الجودة في كافة الأجنحة',
      'خدمة تنظيف وغسيل على مدار اليوم',
      'مواقف سيارات خاصة ومصلى داخلي مطل على الحرم'
    ],
    roomTypes: [
      'جناح ملكي مطل مباشرة على الكعبة المشرفة',
      'جناح عائلي ديلوكس (غرفتين وصالة)',
      'غرفة تنفيذية بإطلالة بانورامية على الحرم',
      'استوديو فاخر مطل على الساحات'
    ],
    isFeatured: true,
    order: 1
  },
  {
    id: 'hotel-fairmont',
    name: 'فندق فيرمونت برج الساعة مكة',
    nameEn: 'Fairmont Makkah Clock Royal Tower',
    city: 'makkah',
    location: 'مكة المكرمة - مجمع أبراج البيت',
    distanceToHaram: 'ملاصق لصحن الحرم الشريف',
    stars: 5,
    ratingScore: '9.7 / 10',
    description: 'أحد أشهر المعالم الفندقية في العالم الإسلامي، يرتفع في قلب الحرم المكي الشريف موفراً إطلالات استثنائية وأجنحة مجهزة بأفخم وسائل الراحة وخدمة طاقم كونسيرج مخصص.',
    coverImage: '/images/hajj_vip.webp',
    gallery: [
      '/images/hajj_vip.webp',
      '/images/hero_bg.webp'
    ],
    amenities: [
      'إطلالة استثنائية من أعلى أبراج مكة',
      'طوابق ذهبية مخصصة لكبار الشخصيات Fairmont Gold',
      'خيارات طعام متعددة ومطاعم حائزة على جوائز',
      'خدمات استقبال كبار الشخصيات من المطار'
    ],
    roomTypes: [
      'جناح رئاسي فاخر مطل على الكعبة',
      'جناح فيرمونت جولد التنفيذي',
      'غرفة ديلوكس مطلة على الحرم'
    ],
    isFeatured: true,
    order: 2
  },
  {
    id: 'hotel-dar-tawhid',
    name: 'أجنحة دار التوحيد إنتركونتيننتال مكة',
    nameEn: 'Dar Al Tawhid InterContinental',
    city: 'makkah',
    location: 'مكة المكرمة - شارع إبراهيم الخليل أمام الحرم',
    distanceToHaram: 'خطوات معدودة من بوابة الملك فهد',
    stars: 5,
    ratingScore: '9.9 / 10',
    description: 'يُعد عنواناً للخصوصية والسكينة لنخبة الشخصيات والعائلات الكريمة، يتميز بموقعه الأمامي الحصري وأجوائه الروحانية العريقة مع مصلى خاص ينقل صلاة الحرم مباشرة.',
    coverImage: '/images/hero_bg.webp',
    gallery: [
      '/images/hero_bg.webp',
      '/images/hajj_vip.webp'
    ],
    amenities: [
      'أقرب موقع لبوابة الملك فهد',
      'مصلى خاص فسيح مع سماع خطبة وصلاة الحرم',
      'أرقى معايير الضيافة العربية الأصيلة',
      'بوفيهات النخبة الملكية اليومية'
    ],
    roomTypes: [
      'جناح الأمراء الملكي',
      'جناح الدار المزدوج',
      'غرفة كلوب إنتركونتيننتال'
    ],
    isFeatured: true,
    order: 3
  },
  {
    id: 'hotel-raffles',
    name: 'فندق قصر مكة رافلز',
    nameEn: 'Raffles Makkah Palace',
    city: 'makkah',
    location: 'مكة المكرمة - أبراج البيت',
    distanceToHaram: 'إطلالة مباشرة على الكعبة',
    stars: 5,
    ratingScore: '9.8 / 10',
    description: 'فندق أجنحة حصري مستوحى من التراث والضيافة الرفيعة، يوفر خدمة المساعد الشخصي (Butler Service) على مدار الساعة لكل جناح لضمان أعلى درجات الراحة والرفاهية.',
    coverImage: '/images/648211000.jpg.jpeg',
    gallery: [
      '/images/648211000.jpg.jpeg'
    ],
    amenities: [
      'خدمة خادم شخصي خاص (Private Butler)',
      'أجنحة حصرية واسعة بالكامل',
      'مكتبة روحانية وثقافية إسلامية خاصة',
      'سبا رجالي ونسائي منفصل ونادي صحي'
    ],
    roomTypes: [
      'جناh القصر الرئاسي',
      'جناح سيغنتشر مطل على الكعبة'
    ],
    isFeatured: false,
    order: 4
  },
  {
    id: 'hotel-address',
    name: 'فندق العنوان جبل عمر مكة',
    nameEn: 'Address Jabal Omar Makkah',
    city: 'makkah',
    location: 'مكة المكرمة - مشروع جبل عمر',
    distanceToHaram: 'متصل بساحات الحرم عبر جسور مشاة ومصاعد',
    stars: 5,
    ratingScore: '9.6 / 10',
    description: 'تحفة ضيافة عصرية بأعلى مصلى معلق في العالم موثق برقم غينيس للأرقام القياسية، يجمع بين الفخامة المعمارية وأحدث مرافق الراحة لضيوف الرحمن.',
    coverImage: '/images/534253758.jpg.jpeg',
    gallery: [
      '/images/534253758.jpg.jpeg'
    ],
    amenities: [
      'أعلى مصلى معلق في العالم مطل على الكعبة',
      'تصميم فندقي حديث ومرافق عالمية',
      'مراكز تسوق ومطاعم راقية',
      'خدمة نقل سريعة ومصاعد متعددة'
    ],
    roomTypes: [
      'جناح بريزيدنشال بإطلالة ساحرة',
      'غرفة ديلوكس مطلة على الحرم'
    ],
    isFeatured: false,
    order: 5
  }
];

const HOTELS_STORAGE_KEY = 'maysora_managed_hotels_v1';
const HOTELS_EVENT_NAME = 'maysora_hotels_updated';

export const getManagedHotels = (): ManagedHotel[] => {
  try {
    const raw = localStorage.getItem(HOTELS_STORAGE_KEY);
    if (!raw) return DEFAULT_HOTELS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading hotels from storage:', e);
  }
  return DEFAULT_HOTELS;
};

export const saveManagedHotels = (hotels: ManagedHotel[]): void => {
  try {
    localStorage.setItem(HOTELS_STORAGE_KEY, JSON.stringify(hotels));
    window.dispatchEvent(new CustomEvent(HOTELS_EVENT_NAME, { detail: hotels }));
  } catch (e) {
    console.error('Error saving hotels to storage:', e);
  }
};

export const addManagedHotel = (newHotel: Omit<ManagedHotel, 'id'>): ManagedHotel[] => {
  const current = getManagedHotels();
  const id = `hotel-${Date.now()}`;
  const created: ManagedHotel = { ...newHotel, id };
  const updated = [created, ...current];
  saveManagedHotels(updated);
  return updated;
};

export const updateManagedHotel = (updatedHotel: ManagedHotel): ManagedHotel[] => {
  const current = getManagedHotels();
  const updated = current.map((h) => (h.id === updatedHotel.id ? updatedHotel : h));
  saveManagedHotels(updated);
  return updated;
};

export const deleteManagedHotel = (hotelId: string): ManagedHotel[] => {
  const current = getManagedHotels();
  const updated = current.filter((h) => h.id !== hotelId);
  saveManagedHotels(updated);
  return updated;
};

export const resetHotelsToDefault = (): ManagedHotel[] => {
  saveManagedHotels(DEFAULT_HOTELS);
  return DEFAULT_HOTELS;
};

export const subscribeToHotelUpdates = (callback: (hotels: ManagedHotel[]) => void): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ManagedHotel[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getManagedHotels());
    }
  };

  window.addEventListener(HOTELS_EVENT_NAME, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === HOTELS_STORAGE_KEY) {
      callback(getManagedHotels());
    }
  });

  return () => {
    window.removeEventListener(HOTELS_EVENT_NAME, handler);
  };
};
