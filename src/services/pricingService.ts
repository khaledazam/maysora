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

export const DEFAULT_PACKAGES: ManagedPackage[] = [];

export const TEMPLATE_PACKAGES: ManagedPackage[] = [];

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
  saveManagedPackages([]);
  return [];
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
