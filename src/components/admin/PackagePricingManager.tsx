import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Save,
  CheckCircle2,
  Building2,
  PlaneTakeoff,
  ShieldCheck,
  Eye,
  Trash2,
  Calendar
} from 'lucide-react';
import {
  type ManagedPackage,
  getManagedPackages,
  saveManagedPackages,
  clearAllManagedPackages
} from '../../services/pricingService';
import { getManagedHotels } from '../../services/hotelService';

interface PackagePricingManagerProps {
  onBackToSite?: () => void;
}

const BLANK_PACKAGE: ManagedPackage = {
  id: '',
  name: '',
  category: 'عمرة فاخرة VIP',
  price: '',
  currency: 'ر.س',
  duration: '',
  hotel: '',
  flight: '',
  financialPerk: '',
  badge: '',
  isAvailable: true,
  features: [
    'إقامة في أجنحة مطلة على الحرم',
    'استقبال وتوديع خاص في المطار بسيارة VIP',
    'بوفيه مفتوح لكامل الوجبات',
    'جولات خاصة للمزارات الشريفة'
  ]
};

export const PackagePricingManager: React.FC<PackagePricingManagerProps> = ({ onBackToSite }) => {
  const [packages, setPackages] = useState<ManagedPackage[]>([]);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New package form state
  const [newPackage, setNewPackage] = useState<ManagedPackage>(BLANK_PACKAGE);

  useEffect(() => {
    setPackages(getManagedPackages());
  }, []);

  const handleUpdateField = (id: string, field: keyof ManagedPackage, value: any) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          return { ...pkg, [field]: value };
        }
        return pkg;
      })
    );
  };

  const handleSaveAll = () => {
    saveManagedPackages(packages);
    setSavedSuccessMessage('تم حفظ وتحديث جميع أسعار وبيانات الباقات في الموقع فوراً.');
    setTimeout(() => setSavedSuccessMessage(null), 4000);
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من تفريغ ومسح جميع الباقات؟ سيبدأ النظام كنسخة إنتاج نظيفة تماماً دون أي بيانات تجريبية.')) {
      clearAllManagedPackages();
      setPackages([]);
      setSavedSuccessMessage('تم تفريغ ومسح جميع الباقات بنجاح. النظام الآن جاهز للإنتاج.');
      setTimeout(() => setSavedSuccessMessage(null), 3000);
    }
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف [${name}] من قائمة الباقات؟`)) {
      const filtered = packages.filter((p) => p.id !== id);
      setPackages(filtered);
      saveManagedPackages(filtered);
      setSavedSuccessMessage(`تم حذف الباقة بنجاح.`);
      setTimeout(() => setSavedSuccessMessage(null), 3000);
    }
  };

  const handleAddNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.price) {
      alert('يرجى كتابة اسم الباقة وسعرها.');
      return;
    }

    const packageId = newPackage.id || `pkg-${Date.now()}`;
    const toAdd: ManagedPackage = {
      ...newPackage,
      id: packageId
    };

    const updated = [...packages, toAdd];
    setPackages(updated);
    saveManagedPackages(updated);
    setIsAddModalOpen(false);
    setSavedSuccessMessage(`تمت إضافة [${newPackage.name}] وعرضها في الموقع فوراً.`);
    setTimeout(() => setSavedSuccessMessage(null), 4000);

    // Reset form
    setNewPackage(BLANK_PACKAGE);
  };

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#1E190F] via-[#161616] to-[#0E0E0E] border-2 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                لوحة إدارة الباقات والأسعار • PACKAGES PRICING HUB
              </span>
              <span className="text-[11px] text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full border border-[#25D366]/30 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                ربط لحظي بالـ Landing Page
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic-heading text-[#F8F5F0]">
              التحكم في أسعار باقات الحج والعمرة والرحلات
            </h2>
            <p className="text-xs sm:text-sm text-[#C0B7A6] max-w-2xl font-light leading-relaxed">
              تحديد وإدارة أسعار الباقات بالكامل من خلال الإدارة بدون أي أسعار افتراضية. ما تقوم بإضافته هنا يظهر مباشرة لزوار الموقع.
            </p>
          </div>

          {/* Action Buttons Top */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setNewPackage(BLANK_PACKAGE);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة باقة جديدة</span>
            </button>

            {packages.length > 0 && (
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-lg shadow-[#25D366]/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-4 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{savedSuccessMessage}</span>
          </div>
          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة في الموقع</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">إجمالي الباقات المضافة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8F5F0]">{packages.length}</span>
            <span className="text-xs text-[#D4AF37]">باقات مسجلة</span>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">الباقات المعروضة للزوار</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gold-gradient font-mono">
              {packages.filter((p) => p.isAvailable).length}
            </span>
            <span className="text-xs text-[#25D366]">نشطة في الموقع</span>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">وضع نظام التسعير</span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-emerald-400">
              تسعير يدوي مخصص (Production)
            </span>
          </div>
        </div>
      </div>

      {/* PACKAGES EDIT CARDS LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F8F5F0] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#D4AF37]" />
            <span>قائمة الباقات والأسعار التفاعلية</span>
          </h3>
          {packages.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-300 underline transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ وحذف جميع الباقات</span>
            </button>
          )}
        </div>

        {packages.length === 0 ? (
          <div className="bg-[#121212] rounded-3xl p-12 text-center border border-[#D4AF37]/30 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 mx-auto flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/25">
              <Tag className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold font-arabic-heading text-[#F8F5F0]">
              لا توجد باقات أو أسعار مسجلة حالياً
            </h4>
            <p className="text-xs sm:text-sm text-[#C0B7A6] max-w-lg mx-auto leading-relaxed">
              تم تجهيز النظام لوضع الإنتاج (Production) ومسح كافة الأسعار الافتراضية. يمكنك الآن إضافة باقاتك المعتمدة وتحديد أسعارها بكل سهولة لتظهر لزوار الموقع فوراً.
            </p>
            <button
              type="button"
              onClick={() => {
                setNewPackage(BLANK_PACKAGE);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول باقة وتحديد سعرها</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl p-6 sm:p-7 border-2 transition-all relative overflow-hidden flex flex-col justify-between bg-[#121212] border-white/10 hover:border-[#D4AF37]/50 shadow-xl"
            >
              {/* Badge & Category */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {pkg.category}
                  </span>
                  {pkg.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#FFF0B3] border border-white/15">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Package Name */}
                <h4 className="text-xl font-bold font-arabic-heading text-[#F8F5F0] mb-4">
                  {pkg.name}
                </h4>

                {/* LIVE PRICE INPUT BOX */}
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#D4AF37]/30 mb-6 space-y-3">
                  <span className="text-[11px] text-[#C0B7A6] font-semibold block">
                    السعر المعروض للعميل في الموقع:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => handleUpdateField(pkg.id, 'price', e.target.value)}
                        placeholder="18,500 أو حسب الطلب"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-[#D4AF37]/40 text-lg font-bold text-gold-gradient font-mono focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <input
                      type="text"
                      value={pkg.currency}
                      onChange={(e) => handleUpdateField(pkg.id, 'currency', e.target.value)}
                      placeholder="ر.س"
                      className="w-16 px-2 py-2.5 rounded-xl bg-[#141414] border border-white/15 text-xs text-center text-[#FFF0B3] font-bold focus:outline-none focus:border-[#D4AF37]"
                      title="العملة"
                    />
                  </div>

                  {/* Duration input */}
                  <div className="flex items-center gap-2 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <input
                      type="text"
                      value={pkg.duration}
                      onChange={(e) => handleUpdateField(pkg.id, 'duration', e.target.value)}
                      placeholder="7 أيام / 6 ليالٍ"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10 text-xs text-[#E2DACB] focus:outline-none focus:border-[#D4AF37]"
                      title="مدة الرحلة"
                    />
                  </div>
                </div>

                {/* Hotel & Flight Details inputs */}
                <div className="space-y-3 mb-6 text-xs text-[#C0B7A6]">
                  <div>
                    <label className="text-[10px] text-[#A0937D] block mb-1">الفندق والإقامة المعتمدة:</label>
                    <div className="flex items-center gap-2 bg-[#0D0D0D] px-3 py-2 rounded-xl border border-white/5">
                      <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <input
                        type="text"
                        list="managed-hotels-list"
                        value={pkg.hotel}
                        onChange={(e) => handleUpdateField(pkg.id, 'hotel', e.target.value)}
                        className="w-full bg-transparent text-xs text-[#F8F5F0] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A0937D] block mb-1">فئة الطيران والتنقل:</label>
                    <div className="flex items-center gap-2 bg-[#0D0D0D] px-3 py-2 rounded-xl border border-white/5">
                      <PlaneTakeoff className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <input
                        type="text"
                        value={pkg.flight}
                        onChange={(e) => handleUpdateField(pkg.id, 'flight', e.target.value)}
                        className="w-full bg-transparent text-xs text-[#F8F5F0] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A0937D] block mb-1">ميزة الكونسيرج المرفقة:</label>
                    <div className="flex items-center gap-2 bg-[#0D0D0D] px-3 py-2 rounded-xl border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <input
                        type="text"
                        value={pkg.financialPerk}
                        onChange={(e) => handleUpdateField(pkg.id, 'financialPerk', e.target.value)}
                        className="w-full bg-transparent text-xs text-[#FFF0B3] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions per card */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex-1 py-2 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#D4AF37]/10"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ التعديلات</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                  className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 transition-all cursor-pointer"
                  title="حذف الباقة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* MODAL: ADD NEW CUSTOM PACKAGE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/50 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl animate-scaleUp my-8">
            <h3 className="text-xl font-bold font-arabic-heading text-gold-gradient mb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF37]" />
              <span>إضافة باقة جديدة للموقع</span>
            </h3>
            <p className="text-xs text-[#C0B7A6] mb-6">
              أدخل بيانات الباقة الجديدة لتظهر تلقائياً في صفحة الباقات والمقارنة.
            </p>

            <form onSubmit={handleAddNewPackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">اسم الباقة *</label>
                  <input
                    type="text"
                    required
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    placeholder="مثال: باقة عمرة رمضان الذهبية"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">تصنيف الباقة</label>
                  <input
                    type="text"
                    value={newPackage.category}
                    onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                    placeholder="عمرة فاخرة VIP / حج النخبة / سياحة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">السعر *</label>
                  <input
                    type="text"
                    required
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    placeholder="25,000"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#FFF0B3] font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">العملة</label>
                  <input
                    type="text"
                    value={newPackage.currency}
                    onChange={(e) => setNewPackage({ ...newPackage, currency: e.target.value })}
                    placeholder="ر.س"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">المدة</label>
                  <input
                    type="text"
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                    placeholder="10 أيام"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">الفندق والإقامة</label>
                <input
                  type="text"
                  list="managed-hotels-list"
                  value={newPackage.hotel}
                  onChange={(e) => setNewPackage({ ...newPackage, hotel: e.target.value })}
                  placeholder="أجنحة فندق فيرمونت مكة أو فندق الصفوة"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">ميزة الكونسيرج المرفقة</label>
                <input
                  type="text"
                  value={newPackage.financialPerk}
                  onChange={(e) => setNewPackage({ ...newPackage, financialPerk: e.target.value })}
                  placeholder="تصاريح نسك رسمية وخدمة كونسيرج 24/7"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C1C1C] text-xs text-[#C0B7A6] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer"
                >
                  إضافة الباقة وحفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Datalist for Dynamic Hotels Selection */}
      <datalist id="managed-hotels-list">
        {getManagedHotels().map((h) => (
          <option key={h.id} value={h.name} />
        ))}
      </datalist>
    </div>
  );
};
