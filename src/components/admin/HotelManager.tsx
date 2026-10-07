import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Plus,
  Edit3,
  Trash2,
  Star,
  MapPin,
  Image as ImageIcon,
  Images,
  Check,
  X,
  Search,
  RotateCcw,
  Eye,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import {
  type ManagedHotel,
  getManagedHotels,
  addManagedHotel,
  updateManagedHotel,
  deleteManagedHotel,
  resetHotelsToDefault,
  subscribeToHotelUpdates,
  AVAILABLE_LIBRARY_IMAGES
} from '../../services/hotelService';

export const HotelManager: React.FC = () => {
  const [hotels, setHotels] = useState<ManagedHotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<ManagedHotel | null>(null);
  const [galleryPreviewHotel, setGalleryPreviewHotel] = useState<ManagedHotel | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<ManagedHotel, 'id'>>({
    name: '',
    nameEn: '',
    city: 'makkah',
    location: '',
    distanceToHaram: '',
    stars: 5,
    ratingScore: '9.8 / 10',
    description: '',
    coverImage: '/images/648211000.jpg.jpeg',
    gallery: [],
    amenities: [],
    roomTypes: [],
    isFeatured: true,
    order: 1
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newRoomType, setNewRoomType] = useState('');

  useEffect(() => {
    setHotels(getManagedHotels());
    const unsubscribe = subscribeToHotelUpdates((updated) => {
      setHotels(updated);
    });
    return unsubscribe;
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      nameEn: '',
      city: 'makkah',
      location: 'مكة المكرمة - وقف الملك عبد العزيز',
      distanceToHaram: '0 متر (مباشر على الحرم المكي)',
      stars: 5,
      ratingScore: '9.8 / 10',
      description: '',
      coverImage: '/images/648211000.jpg.jpeg',
      gallery: [
        '/images/648211000.jpg.jpeg',
        '/images/534253758.jpg.jpeg',
        '/images/648222270.jpg.jpeg'
      ],
      amenities: [
        'إطلالة مباشرة على الكعبة المشرفة',
        'مصاعد خاصة لساحات الحرم',
        'بوفيه مفتوح إفطار وعشاء 5 نجوم',
        'خدمة كونسيرج واستقبال كبار الشخصيات 24/7'
      ],
      roomTypes: [
        'جناح ملكي مطل على الكعبة',
        'جناح عائلي ديلوكس',
        'غرفة تنفيذية بإطلالة الحرم'
      ],
      isFeatured: true,
      order: hotels.length + 1
    });
    setNewImageUrl('');
    setNewAmenity('');
    setNewRoomType('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hotel: ManagedHotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      nameEn: hotel.nameEn,
      city: hotel.city,
      location: hotel.location,
      distanceToHaram: hotel.distanceToHaram,
      stars: hotel.stars,
      ratingScore: hotel.ratingScore,
      description: hotel.description,
      coverImage: hotel.coverImage,
      gallery: [...hotel.gallery],
      amenities: [...hotel.amenities],
      roomTypes: [...hotel.roomTypes],
      isFeatured: hotel.isFeatured,
      order: hotel.order
    });
    setNewImageUrl('');
    setNewAmenity('');
    setNewRoomType('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingHotel) {
      const updated = updateManagedHotel({
        ...formData,
        id: editingHotel.id
      });
      setHotels(updated);
      showNotification(`تم حفظ وتحديث بيانات فندق [${formData.name}] بنجاح.`);
    } else {
      const updated = addManagedHotel(formData);
      setHotels(updated);
      showNotification(`تم إضافة فندق [${formData.name}] بنجاح.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف فندق [${name}] نهائياً؟`)) {
      const updated = deleteManagedHotel(id);
      setHotels(updated);
      showNotification(`تم حذف فندق [${name}] من القائمة.`);
    }
  };

  const handleReset = () => {
    if (confirm('هل ترغب في استعادة القائمة الافتراضية للفنادق مع ألبوم فندق الصفوة المحدث؟')) {
      const updated = resetHotelsToDefault();
      setHotels(updated);
      showNotification('تمت استعادة الفنادق الافتراضية وصور فندق الصفوة بنجاح.');
    }
  };

  // Add / Remove Gallery Image
  const handleAddImageToGallery = (urlToAdd?: string) => {
    const target = urlToAdd || newImageUrl.trim();
    if (!target) return;
    if (formData.gallery.includes(target)) {
      alert('هذه الصورة موجودة بالفعل في ألبوم الفندق.');
      return;
    }
    setFormData({
      ...formData,
      gallery: [...formData.gallery, target],
      coverImage: formData.coverImage || target
    });
    if (!urlToAdd) setNewImageUrl('');
  };

  const handleRemoveImageFromGallery = (imgUrl: string) => {
    const updatedGallery = formData.gallery.filter((img) => img !== imgUrl);
    setFormData({
      ...formData,
      gallery: updatedGallery,
      coverImage: formData.coverImage === imgUrl ? (updatedGallery[0] || '') : formData.coverImage
    });
  };

  const handleSetAsCover = (imgUrl: string) => {
    setFormData({
      ...formData,
      coverImage: imgUrl
    });
  };

  // Add / Remove Amenities
  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity.trim()]
    });
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  // Add / Remove Room Types
  const handleAddRoomType = () => {
    if (!newRoomType.trim()) return;
    setFormData({
      ...formData,
      roomTypes: [...formData.roomTypes, newRoomType.trim()]
    });
    setNewRoomType('');
  };

  const handleRemoveRoomType = (index: number) => {
    setFormData({
      ...formData,
      roomTypes: formData.roomTypes.filter((_, i) => i !== index)
    });
  };

  // Gallery modal controls
  const handleOpenGalleryPreview = (hotel: ManagedHotel, startIdx = 0) => {
    setGalleryPreviewHotel(hotel);
    setPreviewImageIndex(startIdx);
  };

  const handleNextPreviewImage = () => {
    if (!galleryPreviewHotel || galleryPreviewHotel.gallery.length === 0) return;
    setPreviewImageIndex((prev) => (prev + 1) % galleryPreviewHotel.gallery.length);
  };

  const handlePrevPreviewImage = () => {
    if (!galleryPreviewHotel || galleryPreviewHotel.gallery.length === 0) return;
    setPreviewImageIndex((prev) =>
      prev === 0 ? galleryPreviewHotel.gallery.length - 1 : prev - 1
    );
  };

  const filteredHotels = hotels.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.nameEn.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.distanceToHaram.toLowerCase().includes(q)
    );
  });

  const totalPhotosCount = hotels.reduce((acc, h) => acc + h.gallery.length, 0);
  const totalFeatured = hotels.filter((h) => h.isFeatured).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#1C170E] via-[#141414] to-[#0A0A0A] border-2 border-[#D4AF37]/35 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
              <Hotel className="w-3.5 h-3.5" />
              <span>نظام إدارة الفنادق وألبومات الصور الملكية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic-heading text-[#F8F5F0]">
              إدارة فنادق الحرم والأجنحة الفاخرة
            </h2>
            <p className="text-xs sm:text-sm text-[#C0B7A6] max-w-2xl leading-relaxed">
              تحكم كامل وديناميكي في أسماء الفنادق، ألبومات الصور عالية الدقة (مثل فندق الصفوة رويال أوركيد)، المزايا، والإطلالات المباشرة على الكعبة المشرفة وربطها بالموقع تلقائياً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#C0B7A6] hover:text-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer"
              title="إعادة تعيين القائمة الافتراضية للفنادق"
            >
              <RotateCcw className="w-4 h-4" />
              <span>استعادة الافتراضي</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فندق جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#C0B7A6]">إجمالي الفنادق المسجلة</span>
            <Hotel className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#F8F5F0]">{hotels.length}</div>
          <span className="text-[11px] text-[#A0937D] mt-1 block">فنادق مكة والمدينة والأجنحة</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#C0B7A6]">ألبوم الصور المحملة</span>
            <Images className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#FFF0B3]">{totalPhotosCount}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">صور عالية الدقة معتمدة</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#C0B7A6]">فنادق مميزة في الواجهة</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#D4AF37]">{totalFeatured}</div>
          <span className="text-[11px] text-[#A0937D] mt-1 block">تظهر في قائمة النخبة المميزة</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#C0B7A6]">إطلالة مباشرة على الكعبة</span>
            <Compass className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#F8F5F0]">100%</div>
          <span className="text-[11px] text-amber-400 mt-1 block">موقع استراتيجي أول صف للحرم</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الفندق، الموقع، أو الإطلالة..."
            className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F5F0] placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] pr-10 rtl:pr-10 rtl:pl-4"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="text-xs text-[#C0B7A6]">
          عرض <strong className="text-[#D4AF37]">{filteredHotels.length}</strong> من أصل{' '}
          <strong className="text-white">{hotels.length}</strong> فنادق
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-3xl bg-[#141414] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group"
          >
            <div>
              {/* Hotel Header Image & Badges */}
              <div className="relative h-60 rounded-2xl overflow-hidden mb-5 border border-white/10">
                <img
                  src={hotel.coverImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>{hotel.stars} نجوم فاخر</span>
                  </span>
                  {hotel.isFeatured && (
                    <span className="px-3 py-1 rounded-full bg-gold-gradient text-[#0D0D0D] text-[11px] font-bold shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>إقامة معتمدة VIP</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 left-3">
                  <button
                    onClick={() => handleOpenGalleryPreview(hotel)}
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>{hotel.gallery.length} صور</span>
                  </button>
                </div>

                {/* Bottom title over image */}
                <div className="absolute bottom-3 right-3 left-3">
                  <h3 className="text-lg sm:text-xl font-bold font-arabic-heading text-[#F8F5F0] mb-1">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#E2DACB]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </div>
                </div>
              </div>

              {/* Proximity Pill */}
              <div className="mb-4 p-3 rounded-xl bg-gold-subtle-gradient border border-[#D4AF37]/25 flex items-center justify-between text-xs">
                <span className="text-[#FFF0B3] font-semibold flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>المسافة للحرم:</span>
                </span>
                <span className="text-[#D4AF37] font-bold">{hotel.distanceToHaram}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#C0B7A6] leading-relaxed mb-4 line-clamp-3">
                {hotel.description}
              </p>

              {/* Photo Gallery Strip */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#A0937D] flex items-center gap-1">
                    <Images className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>ألبوم صور الفندق المعتمد ({hotel.gallery.length}):</span>
                  </span>
                  <button
                    onClick={() => handleOpenGalleryPreview(hotel)}
                    className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    عرض الألبوم بالكامل &larr;
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {hotel.gallery.slice(0, 6).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenGalleryPreview(hotel, idx)}
                      className="relative h-14 rounded-lg overflow-hidden border border-white/10 hover:border-[#D4AF37] cursor-pointer group/thumb"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                      {img === hotel.coverImage && (
                        <div className="absolute inset-0 bg-[#D4AF37]/30 border-2 border-[#D4AF37] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#0D0D0D] font-bold" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities chips */}
              <div className="mb-6">
                <span className="text-[11px] font-semibold text-[#A0937D] block mb-2">
                  أبرز الخدمات والمزايا:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 4).map((am, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-[#1C1C1C] border border-white/10 text-[#E2DACB]"
                    >
                      {am}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-[#A0937D]">
                      +{hotel.amenities.length - 4} أخرى
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => handleOpenGalleryPreview(hotel)}
                type="button"
                className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E2DACB] hover:text-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>استعراض الصور ({hotel.gallery.length})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(hotel)}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل الفندق والصور</span>
                </button>

                <button
                  onClick={() => handleDelete(hotel.id, hotel.name)}
                  type="button"
                  className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 transition-all cursor-pointer"
                  title="حذف الفندق"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL: ADD / EDIT HOTEL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl w-full max-w-4xl p-6 sm:p-8 relative shadow-2xl animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-6 top-6 text-neutral-400 hover:text-white p-1 rounded-xl"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-[#0D0D0D]">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-arabic-heading text-[#F8F5F0]">
                  {editingHotel ? `تعديل بيانات فندق: ${editingHotel.name}` : 'إضافة فندق جديد للأجنحة الملكية'}
                </h3>
                <p className="text-xs text-[#C0B7A6]">
                  قم بضبط الاسم العربي والإنجليزي، موقع الحرم، وإدارة ألبوم صور الفندق بدقة.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hotel Names & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    اسم الفندق بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: فندق الصفوة رويال أوركيد مكة المكرمة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    الاسم بالإنجليزية (Hotel English Name) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Al Safwah Royale Orchid Makkah"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] font-sans focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Location & Distance to Haram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    الموقع الدقيق والشارع *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="مثال: وقف الملك عبد العزيز أمام بوابة الملك عبد العزيز مباشرة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    المسافة للحرم والإطلالة *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distanceToHaram}
                    onChange={(e) => setFormData({ ...formData, distanceToHaram: e.target.value })}
                    placeholder="مثال: 0 متر (إطلالة ومصاعد مباشرة على الكعبة وصحن الطواف)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Stars & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    التصنيف الفندقي (النجوم)
                  </label>
                  <select
                    value={formData.stars}
                    onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#D4AF37] font-bold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value={5}>5 نجوم ديولكس ملكي VIP</option>
                    <option value={4}>4 نجوم ممتاز</option>
                    <option value={3}>3 نجوم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                    التقييم العام
                  </label>
                  <input
                    type="text"
                    value={formData.ratingScore}
                    onChange={(e) => setFormData({ ...formData, ratingScore: e.target.value })}
                    placeholder="مثال: 9.8 / 10 استثنائي"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-xs text-[#F8F5F0] font-semibold">عرض في قائمة الفنادق المميزة VIP</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-1.5">
                  الوصف التعريفي بالفندق ومميزات الإقامة
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف شامل للإطلالة، المصاعد، البوفيهات، وأسلوب الراحة المقدم لضيوف الرحمن..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              {/* Cover Image */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>الصورة الرئيسية للغلاف (Cover Image):</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-[#D4AF37]/40 shrink-0 bg-black">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">لا توجد صورة</div>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="رابط الصورة e.g. /images/648211000.jpg.jpeg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#FFF0B3] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Hotel Gallery Manager */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    <span>ألبوم صور الفندق (Gallery Album) - [{formData.gallery.length} صورة حالياً]:</span>
                  </label>
                  <span className="text-[11px] text-[#A0937D]">
                    يمكنك تعيين أي صورة كغلاف رئيسي أو حذفها
                  </span>
                </div>

                {/* Add Image Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="أدخل مسار صورة جديدة أو رابط URL خارجي..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageToGallery()}
                    className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] border border-white/15 text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة للألبوم</span>
                  </button>
                </div>

                {/* Quick Add from Uploaded Library Photos */}
                <div>
                  <span className="text-[11px] text-[#C0B7A6] font-semibold block mb-2">
                    اختر صور جاهزة من مكتبة صور فندق الصفوة المرفوعة (بنقرة واحدة):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {AVAILABLE_LIBRARY_IMAGES.map((libImg, idx) => {
                      const alreadyInGallery = formData.gallery.includes(libImg.url);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleAddImageToGallery(libImg.url)}
                          className={`relative w-20 h-16 rounded-xl overflow-hidden border shrink-0 cursor-pointer transition-all ${
                            alreadyInGallery
                              ? 'border-[#D4AF37] opacity-60'
                              : 'border-white/10 hover:border-[#D4AF37] hover:scale-105'
                          }`}
                          title={libImg.label}
                        >
                          <img src={libImg.url} alt={libImg.label} className="w-full h-full object-cover" />
                          {alreadyInGallery && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Check className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gallery Grid in Form */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {formData.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-24 rounded-xl overflow-hidden border border-white/15 group/item bg-black"
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromGallery(imgUrl)}
                          className="self-end p-1 rounded-md bg-red-900/80 text-white hover:bg-red-700 cursor-pointer"
                          title="حذف الصورة من الألبوم"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetAsCover(imgUrl)}
                          className={`w-full py-1 rounded text-[9px] font-bold ${
                            formData.coverImage === imgUrl
                              ? 'bg-[#D4AF37] text-[#0D0D0D]'
                              : 'bg-white/20 text-white hover:bg-[#D4AF37] hover:text-[#0D0D0D]'
                          }`}
                        >
                          {formData.coverImage === imgUrl ? 'الغلاف الحالي' : 'تعيين كغلاف'}
                        </button>
                      </div>

                      {formData.coverImage === imgUrl && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0D0D0D] text-[8px] font-bold">
                          غلاف
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Manager */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-[#D4AF37]">
                  المزايا والخدمات الفندقية (Amenities):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="مثال: مصاعد خاصة لصحن الطواف مباشرة"
                    className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2 rounded-xl bg-[#222222] text-white hover:text-[#D4AF37] border border-white/15 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    إضافة ميزة
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.amenities.map((am, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#1C1C1C] border border-white/10 text-xs text-[#FFF0B3] flex items-center gap-1.5"
                    >
                      <span>{am}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="text-neutral-400 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Room Types Manager */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-[#D4AF37]">
                  فئات الغرف والأجنحة المتاحة:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    placeholder="مثال: جناح ملكي بنتهاوس بإطلالة كاملة على الكعبة"
                    className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddRoomType}
                    className="px-4 py-2 rounded-xl bg-[#222222] text-white hover:text-[#D4AF37] border border-white/15 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    إضافة فئة
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.roomTypes.map((rt, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#1C1C1C] border border-white/10 text-xs text-[#E2DACB] flex items-center gap-1.5"
                    >
                      <span>{rt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoomType(idx)}
                        className="text-neutral-400 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-xs text-[#C0B7A6] hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingHotel ? 'حفظ وتحديث الفندق' : 'تأكيد إضافة الفندق'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL GALLERY PREVIEW LIGHTBOX ================= */}
      {galleryPreviewHotel && galleryPreviewHotel.gallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFF0B3] font-arabic-heading">
                ألبوم صور: {galleryPreviewHotel.name}
              </h3>
              <p className="text-xs text-[#C0B7A6]">
                الصورة {previewImageIndex + 1} من أصل {galleryPreviewHotel.gallery.length}
              </p>
            </div>

            <button
              onClick={() => setGalleryPreviewHotel(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Display */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
            <button
              onClick={handlePrevPreviewImage}
              className="absolute right-4 p-3 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] transition-all cursor-pointer z-10"
              aria-label="السابق"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <img
              src={galleryPreviewHotel.gallery[previewImageIndex]}
              alt={galleryPreviewHotel.name}
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <button
              onClick={handleNextPreviewImage}
              className="absolute left-4 p-3 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-[#0D0D0D] transition-all cursor-pointer z-10"
              aria-label="التالي"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="w-full max-w-4xl overflow-x-auto py-2">
            <div className="flex items-center justify-center gap-2">
              {galleryPreviewHotel.gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                    previewImageIndex === idx
                      ? 'border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/30'
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
    </div>
  );
};
