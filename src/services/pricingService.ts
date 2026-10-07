export interface ManagedPackage {
  id: string;
  name: string;
  category: string;
  price: string;
  currency: string;
  duration: string;
  hotel: string;
  flight: string;
  financialPerk: string;
  badge?: string;
  isAvailable: boolean;
  features: string[];
}

export const DEFAULT_PACKAGES: ManagedPackage[] = [];

export const TEMPLATE_PACKAGES: ManagedPackage[] = [
  {
    id: 'exec-umrah',
    name: 'باقة العمرة التنفيذية',
    category: 'عمرة فاخرة VIP',
    price: '18,500',
    currency: 'ر.س',
    duration: '7 أيام / 6 ليالٍ',
    hotel: 'فندق فيرمونت برج الساعة مكة (إطلالة مباشرة على الكعبة)',
    flight: 'طيران درجة رجال الأعمال',
    financialPerk: 'تصاريح نسك للروضة الشريفة وخدمة كونسيرج 24/7',
    badge: 'باقة الموسم المميزة',
    isAvailable: true,
    features: [
      'إقامة في جناح فاخر مطل مباشرة على الكعبة المشرفة',
      'استقبال وتوديع خاص في المطار بسيارة VIP خاصة',
      'بوفيه مفتوح إفطار وعشاء فاخر بأعلى المستويات',
      'مزارات خاصة بسيارة فارهة مع مرشد خاص',
      'تصاريح نسك رسمية وإرشاد ديني خاص'
    ]
  },
  {
    id: 'royal-hajj',
    name: 'باقة الحج الملكية الفاخرة',
    category: 'حج النخبة الملكي',
    price: '65,000',
    currency: 'ر.س',
    duration: '12 يوماً',
    hotel: 'أجنحة دار التوحيد إنتركونتيننتال مكة',
    flight: 'طيران خاص أو درجة أولى',
    financialPerk: 'مرافق كونسيرج خاص وطبيب مخصص طوال الرحلة',
    badge: 'الأكثر طلباً للنخبة',
    isAvailable: true,
    features: [
      'مخيمات ملكية خاصة ومكيفة بالكامل في منى وعرفة',
      'بوفيهات عالمية تحت إشراف أشهر الطهاة',
      'طبيب خاص ومرافق ديني مخصص للباقة',
      'تنقلات بسيارات فارهة وسائق خاص طول فترة المشاعر',
      'رعاية متكاملة ومرافق شخصي لتسهيل كافة المناسك'
    ]
  },
  {
    id: 'imperial-custom',
    name: 'باقة ميسورة الإمبراطورية',
    category: 'باقة مخصصة بالكامل',
    price: 'حسب الطلب',
    currency: 'ر.س',
    duration: 'مرنة حسب رغبتك',
    hotel: 'أفخم الأجنحة الملكية الخاصة في مكة والمدينة',
    flight: 'طيران خاص خالي من قيود المواعيد',
    financialPerk: 'طاقم ضيافة متكامل وخدمة كونسيرج ملكية مخصصة',
    badge: 'تخصيص كامل 100%',
    isAvailable: true,
    features: [
      'تخصيص كامل لكافة تفاصيل الرحلة على رغبتك',
      'طائرة خاصة ومروحيات لنقل المشاعر',
      'فريق خدمة كامل (سائق، طباخ، مرشد، حارس)',
      'مرشد ديني ومترجم خاص على مدار 24 ساعة',
      'تنسيق كامل للزيارات والمشاعر بأعلى درجات الخصوصية'
    ]
  }
];

const STORAGE_KEY = 'maysora_managed_packages_pricing_v2';
const EVENT_NAME = 'maysora_prices_updated';

export const getManagedPackages = (): ManagedPackage[] => {
  try {
    localStorage.removeItem('maysora_managed_packages_pricing_v1');
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading managed packages:', e);
  }
  return [];
};

export const saveManagedPackages = (packages: ManagedPackage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: packages }));
  } catch (e) {
    console.error('Error saving managed packages:', e);
  }
};

export const updateSinglePackagePrice = (
  id: string,
  price: string,
  currency?: string,
  duration?: string
): ManagedPackage[] => {
  const current = getManagedPackages();
  const updated = current.map((pkg) => {
    if (pkg.id === id) {
      return {
        ...pkg,
        price,
        currency: currency !== undefined ? currency : pkg.currency,
        duration: duration !== undefined ? duration : pkg.duration
      };
    }
    return pkg;
  });
  saveManagedPackages(updated);
  return updated;
};

export const resetPackagesToDefault = (): ManagedPackage[] => {
  saveManagedPackages(TEMPLATE_PACKAGES);
  return TEMPLATE_PACKAGES;
};

export const subscribeToPriceUpdates = (listener: (packages: ManagedPackage[]) => void): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ManagedPackage[]>;
    listener(custom.detail || getManagedPackages());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
