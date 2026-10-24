import { fetchPackagesFromSupabase, syncPackagesToSupabase } from './supabaseClient';

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

export const DEFAULT_PACKAGES: ManagedPackage[] = [
  {
    id: 'pkg-october-13-safwat-albait',
    name: 'رحلة 13 أكتوبر • مكة: صفوة البيت',
    category: 'برنامج اقتصادي • مطار برج العرب',
    price: '37,500',
    currency: 'ج.م',
    duration: 'شامل الطيران والإقامة',
    hotel: 'مكة: فندق صفوة البيت • المدينة: فندق روابي الزهراء',
    flight: 'برج العرب ➔ جدة / جدة ➔ برج العرب',
    financialPerk: 'رباعي: 37,500 | ثلاثي: 39,500 | ثنائي: 42,500 ج.م',
    badge: 'إقلاع برج العرب (الإسكندرية)',
    isAvailable: true,
    features: [
      'طيران مباشر ذهاب وعودة من مطار برج العرب بالإسكندرية (برج العرب ⇌ جدة)',
      'إقامة مكة المكرمة: فندق صفوة البيت (قرب الحرم وخدمات متميزة)',
      'إقامة المدينة المنورة: فندق روابي الزهراء',
      'أسعار الغرف: رباعي 37,500 ج.م • ثلاثي 39,500 ج.م • ثنائي 42,500 ج.م',
      'شامل التأشيرة الرسمية والتأمين الطبي وتأمين باركود بوابة العمرة',
      'إشراف كامل وتيسير للمناسك وجولات مزارات مكة والمدينة'
    ]
  },
  {
    id: 'pkg-october-20-abraj-alkiswa',
    name: 'رحلة 20 أكتوبر • مكة: أبراج الكسوة',
    category: 'برنامج اقتصادي • مطار سفنكس / القاهرة',
    price: '38,500',
    currency: 'ج.م',
    duration: 'شامل الطيران والإقامة',
    hotel: 'مكة: فندق أبراج الكسوة • المدينة: فندق روابي الزهراء',
    flight: 'سفنكس ➔ المدينة / جدة ➔ القاهرة',
    financialPerk: 'رباعي: 38,500 | ثلاثي: 41,500 | ثنائي: 45,000 ج.م',
    badge: 'نزول مباشر بالمدينة المنورة',
    isAvailable: true,
    features: [
      'خط سير مباشر ومريح: سفنكس ➔ المدينة (نزول مباشر) / جدة ➔ القاهرة',
      'إقامة مكة المكرمة: فندق أبراج الكسوة (باصات ترددية للحرم 24 ساعة)',
      'إقامة المدينة المنورة: فندق روابي الزهراء',
      'أسعار الغرف: رباعي 38,500 ج.م • ثلاثي 41,500 ج.م • ثنائي 45,000 ج.م',
      'شامل التأشيرة وتصاريح الروضة الشريفة ونسك والتأمين الطبي',
      'مشرف ومرافق ديني معتمد طوال الرحلة'
    ]
  },
  {
    id: 'pkg-october-21-safwat-albait',
    name: 'رحلة 21 أكتوبر • مكة: صفوة البيت',
    category: 'برنامج اقتصادي • مطار القاهرة الدولي',
    price: '37,500',
    currency: 'ج.م',
    duration: 'شامل الطيران والإقامة',
    hotel: 'مكة: فندق صفوة البيت • المدينة: فندق روابي الزهراء',
    flight: 'القاهرة ➔ جدة / جدة ➔ القاهرة',
    financialPerk: 'رباعي: 37,500 | ثلاثي: 39,500 | ثنائي: 42,500 ج.م',
    badge: 'طيران مباشر (مطار القاهرة)',
    isAvailable: true,
    features: [
      'طيران مباشر ذهاب وعودة من مطار القاهرة الدولي (القاهرة ⇌ جدة)',
      'إقامة مكة المكرمة: فندق صفوة البيت',
      'إقامة المدينة المنورة: فندق روابي الزهراء',
      'أسعار الغرف: رباعي 37,500 ج.م • ثلاثي 39,500 ج.م • ثنائي 42,500 ج.م',
      'شامل التأشيرة وباركود وزارة السياحة والتأمين الصحي الشامل',
      'انتقالات بحافلات حديثة ومكيفة بين مكة والمدينة والمزارات'
    ]
  },
  {
    id: 'pkg-october-27-abraj-alkiswa',
    name: 'رحلة 27 أكتوبر • مكة: أبراج الكسوة',
    category: 'برنامج اقتصادي • القاهرة / مطار سفنكس',
    price: '38,500',
    currency: 'ج.م',
    duration: 'شامل الطيران والإقامة',
    hotel: 'مكة: فندق أبراج الكسوة • المدينة: فندق روابي الزهراء',
    flight: 'القاهرة ➔ جدة / المدينة ➔ سفنكس',
    financialPerk: 'رباعي: 38,500 | ثلاثي: 41,500 | ثنائي: 45,000 ج.م',
    badge: 'عودة مباشرة من المدينة لسفنكس',
    isAvailable: true,
    features: [
      'خط سير ذكي ومريح: القاهرة ➔ جدة / المدينة ➔ سفنكس (عودة مباشرة)',
      'إقامة مكة المكرمة: فندق أبراج الكسوة (باصات ترددية مجانية للحرم 24 ساعة)',
      'إقامة المدينة المنورة: فندق روابي الزهراء',
      'أسعار الغرف: رباعي 38,500 ج.م • ثلاثي 41,500 ج.م • ثنائي 45,000 ج.م',
      'شامل التأشيرة والتأمين الطبي الشامل وباركود البوابة الرسمية',
      'فريق إداري وميداني من ميسورا يرافقكم على مدار الساعة'
    ]
  }
];

export const TEMPLATE_PACKAGES: ManagedPackage[] = DEFAULT_PACKAGES;

const STORAGE_KEY = 'maysora_managed_packages_pricing_prod_v1';
const EVENT_NAME = 'maysora_prices_updated';

let hasStartedCloudFetch = false;

export const getManagedPackages = (): ManagedPackage[] => {
  // Trigger background cloud fetch on first access
  if (typeof window !== 'undefined' && !hasStartedCloudFetch) {
    hasStartedCloudFetch = true;
    loadManagedPackagesFromCloud().catch(() => {});
  }

  try {
    localStorage.removeItem('maysora_managed_packages_pricing_v1');
    localStorage.removeItem('maysora_managed_packages_pricing_v2');
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PACKAGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PACKAGES;
  } catch (e) {
    console.error('Error loading managed packages:', e);
  }
  return DEFAULT_PACKAGES;
};

/**
 * Loads packages directly from Supabase Cloud Database.
 * Updates local cache and dispatches update event so UI updates immediately.
 */
export const loadManagedPackagesFromCloud = async (): Promise<ManagedPackage[]> => {
  try {
    const cloudPkgs = await fetchPackagesFromSupabase();
    if (cloudPkgs && cloudPkgs.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudPkgs));
      } catch {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cloudPkgs }));
      }
      return cloudPkgs;
    }

    // If cloud is empty but local has items, upload local items to cloud
    const local = getManagedPackages();
    if (local.length > 0) {
      await syncPackagesToSupabase(local);
    }
    return local;
  } catch (err) {
    console.warn('Could not load packages from cloud:', err);
    return getManagedPackages();
  }
};

export const saveManagedPackages = (packages: ManagedPackage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: packages }));
  } catch (e) {
    console.error('Error saving managed packages:', e);
  }

  // Persist to Supabase Cloud Database
  syncPackagesToSupabase(packages).catch((err) => {
    console.warn('Failed to sync packages to Supabase cloud:', err);
  });
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
  saveManagedPackages(DEFAULT_PACKAGES);
  return DEFAULT_PACKAGES;
};

export const clearAllManagedPackages = (): ManagedPackage[] => {
  saveManagedPackages([]);
  return [];
};

export const subscribeToPriceUpdates = (listener: (packages: ManagedPackage[]) => void): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ManagedPackage[]>;
    listener(custom.detail || getManagedPackages());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
