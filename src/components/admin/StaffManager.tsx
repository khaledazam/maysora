import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  KeyRound
} from 'lucide-react';
import {
  type StaffMember,
  type StaffRole,
  type StaffPermissions,
  getStaffMembers,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  toggleStaffStatus,
  ROLE_PRESETS
} from '../../services/staffService';
import { getCurrentAdmin } from '../../services/authService';

export const StaffManager: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentAdmin = getCurrentAdmin();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    title: '',
    department: 'قسم الحجوزات والعمليات',
    role: 'bookings_officer' as StaffRole,
    permissions: ROLE_PRESETS.bookings_officer.permissions,
    isActive: true
  });

  useEffect(() => {
    setStaffList(getStaffMembers());
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      title: '',
      department: 'قسم الحجوزات والعمليات',
      role: 'bookings_officer',
      permissions: { ...ROLE_PRESETS.bookings_officer.permissions },
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      password: staff.password,
      title: staff.title,
      department: staff.department,
      role: staff.role,
      permissions: { ...staff.permissions },
      isActive: staff.isActive
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (newRole: StaffRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: { ...ROLE_PRESETS[newRole].permissions }
    }));
  };

  const handlePermissionToggle = (permKey: keyof StaffPermissions) => {
    setFormData((prev) => ({
      ...prev,
      role: 'custom',
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('يرجى تعبئة الحقول الأساسية: الاسم، البريد الإلكتروني، وكلمة المرور.');
      return;
    }

    if (editingStaff) {
      const updated: StaffMember = {
        ...editingStaff,
        ...formData
      };
      const list = updateStaffMember(updated);
      setStaffList(list);
      showNotification(`تم تحديث بيانات وصلاحيات [${formData.name}] بنجاح.`);
    } else {
      const list = addStaffMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        title: formData.title || 'موظف ميسورة',
        department: formData.department,
        role: formData.role,
        permissions: formData.permissions,
        isActive: formData.isActive
      });
      setStaffList(list);
      showNotification(`تمت إضافة الموظف الجديد [${formData.name}] ومنحه الصلاحيات المحددة.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string, name: string) => {
    if (id === 'staff-khaled') {
      alert('لا يمكن تعطيل حساب المدير العام الرئيسي.');
      return;
    }
    const list = toggleStaffStatus(id);
    setStaffList(list);
    showNotification(`تم تغيير حالة حساب الموظف [${name}].`);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'staff-khaled') {
      alert('لا يمكن حذف حساب المدير العام الرئيسي.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف الموظف [${name}] نهائياً من النظام؟`)) {
      const list = deleteStaffMember(id);
      setStaffList(list);
      showNotification(`تم حذف الموظف [${name}] من النظام.`);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const totalActive = staffList.filter((s) => s.isActive).length;
  const totalSuper = staffList.filter((s) => s.role === 'super_admin').length;

  const permissionLabels: Record<keyof StaffPermissions, string> = {
    canViewBookings: 'عرض الحجوزات والطلبات',
    canEditBookings: 'تعديل بيانات الحجوزات',
    canDeleteBookings: 'حذف الحجوزات والأرشفة',
    canViewClients: 'استعراض ملفات وسجل العملاء',
    canEditClients: 'تعديل وحفظ بيانات العملاء',
    canUseWhatsApp: 'استخدام وإرسال رسائل الواتساب',
    canManagePrices: 'التحكم في أسعار باقات الحج والعمرة',
    canManageHotels: 'إدارة الفنادق وصور الأجنحة والغاليري',
    canExportData: 'تصدير كشوفات الإكسل (CSV)',
    canManageStaff: 'إدارة الموظفين وتعديل الصلاحيات'
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#1E190F] via-[#161616] to-[#0E0E0E] border-2 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                إدارة الصلاحيات وفريق العمل • ROLE-BASED ACCESS
              </span>
              <span className="text-[11px] text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full border border-[#25D366]/30 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                نظام أمان متعدد الصلاحيات
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic-heading text-[#F8F5F0]">
              إدارة الموظفين وتحديد صلاحيات الوصول
            </h2>
            <p className="text-xs sm:text-sm text-[#C0B7A6] max-w-2xl font-light leading-relaxed">
              عيّن لكل موظف حساباً مستقلاً ببريد إلكتروني وكلمة مرور، وحدد الصلاحيات الدقيقة التي يستطيع الوصول إليها في الداشبورد (الحجوزات، ملفات العملاء، الأسعار، أو الواتساب).
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-xl">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* KPIs Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">إجمالي الموظفين المسجلين</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8F5F0]">{staffList.length}</span>
            <span className="text-xs text-[#D4AF37]">موظف</span>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">الحسابات النشطة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#25D366]">{totalActive}</span>
            <span className="text-xs text-[#C0B7A6]">من أصل {staffList.length}</span>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-[#C0B7A6] block mb-1">المدراء أصحاب الصلاحيات الكاملة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gold-gradient">{totalSuper}</span>
            <span className="text-xs text-[#C0B7A6]">مدير عام</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#C0B7A6] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الموظف، البريد الإلكتروني، رقم الهاتف، أو المسمى الوظيفي..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="text-xs text-[#C0B7A6] shrink-0">
          المسجل حالياً: <strong className="text-[#FFF0B3]">{currentAdmin?.name}</strong>
        </div>
      </div>

      {/* Staff Members List */}
      <div className="space-y-4">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] rounded-3xl border border-white/10">
            <Users className="w-12 h-12 text-[#C0B7A6]/40 mx-auto mb-3" />
            <p className="text-sm text-[#C0B7A6]">لم يتم العثور على موظفين يطابقون البحث.</p>
          </div>
        ) : (
          filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className={`rounded-2xl p-5 border transition-all ${
                staff.isActive
                  ? 'bg-[#121212] border-white/10 hover:border-[#D4AF37]/40 shadow-lg'
                  : 'bg-[#0E0E0E] border-red-900/30 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Employee Info Header */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                    staff.role === 'super_admin'
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#8C7335] text-[#0D0D0D]'
                      : 'bg-[#1C1C1C] border border-[#D4AF37]/30 text-[#FFF0B3]'
                  }`}>
                    {staff.name.slice(0, 2)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-[#F8F5F0]">
                        {staff.name}
                      </h4>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                        staff.role === 'super_admin'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                          : 'bg-white/10 text-[#C0B7A6] border-white/15'
                      }`}>
                        {ROLE_PRESETS[staff.role]?.label || staff.role}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        staff.isActive
                          ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}>
                        {staff.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </div>

                    <p className="text-xs text-[#C0B7A6]">
                      {staff.title} • <span className="text-[#A0937D]">{staff.department}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#A0937D] pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-[#D4AF37]" />
                        {staff.email}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-[#25D366]" />
                        {staff.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Permissions Badges Matrix */}
                <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                  {Object.entries(staff.permissions).map(([key, isAllowed]) => {
                    if (!isAllowed) return null;
                    return (
                      <span
                        key={key}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#181818] border border-[#D4AF37]/20 text-[#FFF0B3] flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-[#25D366]" />
                        {permissionLabels[key as keyof StaffPermissions]}
                      </span>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-2.5 rounded-xl bg-[#1C1C1C] border border-white/10 hover:border-[#D4AF37]/50 text-xs text-[#FFF0B3] hover:text-[#D4AF37] transition-all cursor-pointer flex items-center gap-1.5"
                    title="تعديل الصلاحيات والبيانات"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(staff.id, staff.name)}
                    className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      staff.isActive
                        ? 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                        : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                    }`}
                    title={staff.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                  >
                    {staff.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>{staff.isActive ? 'تعطيل' : 'تفعيل'}</span>
                  </button>

                  {staff.id !== 'staff-khaled' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(staff.id, staff.name)}
                      className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs transition-all cursor-pointer"
                      title="حذف الموظف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD / EDIT STAFF MEMBER & PERMISSIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/50 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl animate-scaleUp my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-6 top-6 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-arabic-heading text-gold-gradient mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <span>{editingStaff ? 'تعديل بيانات وصلاحيات الموظف' : 'إضافة موظف جديد وتحديد صلاحياته'}</span>
            </h3>
            <p className="text-xs text-[#C0B7A6] mb-6">
              حدد الدور الوظيفي للموظف أو اختر الصلاحيات الفردية يدوياً بدقة.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">اسم الموظف *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: أحمد عبدالسلام"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أخصائي حج وعمرة / مستشار مبيعات"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">البريد الإلكتروني (لتسجيل الدخول) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmed@maysoragroup.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01011860173 أو +966..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">كلمة المرور للدخول *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="كلمة مرور قوية للموظف"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#FFF0B3] font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-[#C0B7A6] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-1">القسم</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="قسم الحجوزات / خدمة العملاء / الكونسيرج VIP"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Role Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-2">الدور الوظيفي الرئيسي والصلاحيات الجاهزة:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(ROLE_PRESETS) as StaffRole[]).map((rKey) => {
                    const preset = ROLE_PRESETS[rKey];
                    const isSelected = formData.role === rKey;
                    return (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => handleRoleChange(rKey)}
                        className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1810] border-[#D4AF37] text-[#FFF0B3] shadow-md'
                            : 'bg-[#0A0A0A] border-white/10 text-[#C0B7A6] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold block mb-0.5">{preset.label}</span>
                        <span className="text-[10px] text-[#A0937D] line-clamp-2 leading-relaxed">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Checkboxes Matrix */}
              <div className="bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#F8F5F0] block mb-2">
                  الصلاحيات التفصيلية (يمكنك التخصيص اليدوي):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {(Object.keys(permissionLabels) as (keyof StaffPermissions)[]).map((permKey) => {
                    const isChecked = formData.permissions[permKey];
                    return (
                      <label
                        key={permKey}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121212] border border-white/5 hover:border-[#D4AF37]/30 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(permKey)}
                          className="w-4 h-4 rounded text-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                        />
                        <span className={`text-[11px] ${isChecked ? 'text-[#FFF0B3] font-semibold' : 'text-[#8E877A]'}`}>
                          {permissionLabels[permKey]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C1C1C] text-xs text-[#C0B7A6] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{editingStaff ? 'حفظ التعديلات' : 'إضافة الموظف وتفعيل الصلاحيات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
