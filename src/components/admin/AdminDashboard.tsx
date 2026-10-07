import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Calendar,
  Plane,
  Archive,
  Search,
  Download,
  Plus,
  Phone,
  MessageCircle,
  RotateCcw,
  Trash2,
  Edit3,
  X,
  Building,
  TrendingUp,
  LogOut,
  Globe,
  Save,
  Award,
  Palmtree,
  Briefcase,
  UserCheck,
  Tag,
  QrCode,
  ShieldCheck,
  Hotel,
  Crown
} from 'lucide-react';
import { WhatsAppScannerSettings } from './WhatsAppScannerSettings';
import { PackagePricingManager } from './PackagePricingManager';
import { StaffManager } from './StaffManager';
import { HotelManager } from './HotelManager';
import type {
  AdminBooking,
  BookingStatus,
  ClientProfile,
  TripType
} from '../../services/adminService';
import {
  getAdminBookings,
  updateBookingStatus,
  updateBookingDetails,
  toggleArchiveBooking,
  deleteBooking,
  clearAllAdminBookings,
  clearAllClientProfiles,
  addNewAdminBooking,
  exportBookingsToCSV,
  getClientProfiles,
  addTripToClientProfile,
  updateOrCreateClientProfile
} from '../../services/adminService';
import { logoutAdmin, getCurrentAdmin } from '../../services/authService';
import {
  supabase,
  fetchBookingsFromSupabase,
  fetchClientProfilesFromSupabase,
  syncBookingToSupabase,
  syncClientProfileToSupabase,
  deleteBookingFromSupabase,
  clearAllBookingsFromSupabase
} from '../../services/supabaseClient';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout: () => void;
}

type TabType = 'overview' | 'bookings' | 'profiles' | 'travel' | 'archive' | 'settings' | 'pricing' | 'staff' | 'hotels';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tripTypeFilter, setTripTypeFilter] = useState<string>('all');
  
  // Modals state
  const [editingBooking, setEditingBooking] = useState<AdminBooking | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ClientProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  
  // New Booking form state
  const [newBookingData, setNewBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    tripType: 'umrah' as TripType,
    destination: 'مكة المكرمة',
    serviceOrPackage: 'باقة العمرة الميسرة التنفيذية',
    guestsCount: 2,
    travelDate: '',
    returnDate: '',
    flightDetails: '',
    hotelName: '',
    status: 'new' as BookingStatus,
    notes: '',
    source: 'تسجيل يدوي (هاتف / مكتب)'
  });

  // New Trip for existing client form state
  const [newTripData, setNewTripData] = useState({
    tripType: 'luxury_tourism' as TripType,
    title: '',
    destination: '',
    travelDate: '',
    returnDate: '',
    guestsCount: 2,
    flightDetails: '',
    hotelName: '',
    status: 'confirmed' as BookingStatus,
    budgetOrPrice: '',
    notes: '',
  });

  const admin = getCurrentAdmin();

  const loadData = async () => {
    // 1. Instant local load
    const localBookings = getAdminBookings();
    const localProfiles = getClientProfiles();
    setBookings(localBookings);
    setProfiles(localProfiles);

    // 2. Fetch from Supabase cloud database if available
    try {
      const [cloudBookings, cloudProfiles] = await Promise.all([
        fetchBookingsFromSupabase(),
        fetchClientProfilesFromSupabase()
      ]);

      if (cloudBookings && cloudBookings.length > 0) {
        setBookings(cloudBookings);
      }
      if (cloudProfiles && cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
      }
    } catch {
      // Keep local state if network unavailable
    }
  };

  useEffect(() => {
    loadData();

    // 3. Subscribe to real-time changes from Supabase
    const channel = supabase
      .channel('maysora-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_profiles' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const permissions = admin?.permissions;
    if (!permissions) return;
    if (activeTab === 'staff' && !permissions.canManageStaff) setActiveTab('overview');
    if (activeTab === 'hotels' && !(permissions.canManageHotels || permissions.canManagePrices)) setActiveTab('overview');
    if (activeTab === 'pricing' && !permissions.canManagePrices) setActiveTab('overview');
    if (activeTab === 'settings' && !permissions.canUseWhatsApp) setActiveTab('overview');
    if (activeTab === 'profiles' && !permissions.canViewClients) setActiveTab('overview');
    if (activeTab === 'bookings' && !permissions.canViewBookings) setActiveTab('overview');
    if (activeTab === 'travel' && !permissions.canViewBookings) setActiveTab('overview');
    if (activeTab === 'archive' && !(permissions.canDeleteBookings || permissions.canViewBookings)) setActiveTab('overview');
  }, [activeTab, admin]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
    const target = updated.find(b => b.id === id);
    if (target) {
      syncBookingToSupabase(target);
    }
  };

  const handleToggleArchive = (id: string) => {
    const updated = toggleArchiveBooking(id);
    setBookings(updated);
    const target = updated.find(b => b.id === id);
    if (target) {
      syncBookingToSupabase(target);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
      const updated = deleteBooking(id);
      setBookings(updated);
      await deleteBookingFromSupabase(id);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('هل تريد تفريغ ومسح كافة الحجوزات والطلبات التجريبية نهائياً من الذاكرة وقاعدة البيانات لتسليم النظام نظيفاً بالكامل للعميل؟')) {
      clearAllAdminBookings();
      clearAllClientProfiles();
      setBookings([]);
      setProfiles([]);
      await clearAllBookingsFromSupabase();
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const updated = updateBookingDetails(editingBooking.id, editingBooking);
    setBookings(updated);
    syncBookingToSupabase(editingBooking);
    setEditingBooking(null);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.name || !newBookingData.phone) return;
    const updated = addNewAdminBooking(newBookingData);
    setBookings(updated);
    const createdBooking = updated[0];
    if (createdBooking) {
      syncBookingToSupabase(createdBooking);
    }
    setProfiles(getClientProfiles());
    setIsAddModalOpen(false);
    setNewBookingData({
      name: '',
      phone: '',
      email: '',
      tripType: 'umrah',
      destination: 'مكة المكرمة',
      serviceOrPackage: 'باقة العمرة الميسرة التنفيذية',
      guestsCount: 2,
      travelDate: '',
      returnDate: '',
      flightDetails: '',
      hotelName: '',
      status: 'new',
      notes: '',
      source: 'تسجيل يدوي (هاتف / مكتب)'
    });
  };

  const handleAddTripToClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !newTripData.title) return;
    const res = addTripToClientProfile(selectedProfile.phone, newTripData);
    setProfiles(res.updatedProfiles);
    setBookings(res.updatedBookings);
    // Refresh selected profile and sync to Supabase
    const refreshed = res.updatedProfiles.find(p => p.phone === selectedProfile.phone);
    if (refreshed) {
      setSelectedProfile(refreshed);
      syncClientProfileToSupabase(refreshed);
    }
    const createdBooking = res.updatedBookings[0];
    if (createdBooking) {
      syncBookingToSupabase(createdBooking);
    }
    setIsAddTripModalOpen(false);
    setNewTripData({
      tripType: 'luxury_tourism',
      title: '',
      destination: '',
      travelDate: '',
      returnDate: '',
      guestsCount: 2,
      flightDetails: '',
      hotelName: '',
      status: 'confirmed',
      budgetOrPrice: '',
      notes: '',
    });
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    const updated = updateOrCreateClientProfile(selectedProfile);
    setProfiles(updated);
    syncClientProfileToSupabase(selectedProfile);
    alert('تم حفظ وتحديث التفضيلات الدائمة لملف العميل بنجاح.');
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  // Helper to open client profile from phone number
  const handleOpenClientDossier = (phone: string, fallbackName?: string) => {
    const cleanTarget = phone.replace(/[^0-9]/g, '');
    const found = profiles.find(p => p.phone.replace(/[^0-9]/g, '') === cleanTarget);
    if (found) {
      setSelectedProfile(found);
    } else if (fallbackName) {
      // Auto-create initial profile on the fly
      const newProfs = updateOrCreateClientProfile({ name: fallbackName, phone });
      setProfiles(newProfs);
      const created = newProfs.find(p => p.phone.replace(/[^0-9]/g, '') === cleanTarget);
      if (created) setSelectedProfile(created);
    }
  };

  // Filtered lists
  const activeBookings = useMemo(() => {
    return bookings.filter(b => !b.isArchived);
  }, [bookings]);

  const archivedBookings = useMemo(() => {
    return bookings.filter(b => b.isArchived);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const targetList = activeTab === 'archive' ? archivedBookings : activeBookings;
    return targetList.filter(b => {
      const matchesSearch =
        (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.phone || '').includes(searchQuery) ||
        (b.serviceOrPackage || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.id || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesTripType = tripTypeFilter === 'all' || b.tripType === tripTypeFilter;

      return matchesSearch && matchesStatus && matchesTripType;
    });
  }, [activeTab, activeBookings, archivedBookings, searchQuery, statusFilter, tripTypeFilter]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.passportOrNationalId && p.passportOrNationalId.includes(searchQuery))
      );
    });
  }, [profiles, searchQuery]);

  // Travel schedule list (sorted by travel date)
  const travelSchedule = useMemo(() => {
    return activeBookings
      .filter(b => b.travelDate)
      .sort((a, b) => new Date(a.travelDate!).getTime() - new Date(b.travelDate!).getTime());
  }, [activeBookings]);

  // KPIs
  const stats = useMemo(() => {
    const totalLeads = activeBookings.length;
    const totalClients = profiles.length;
    const confirmed = activeBookings.filter(b => b.status === 'confirmed').length;
    const tourismTrips = bookings.filter(b => b.tripType === 'luxury_tourism').length;
    const hajjUmrahTrips = bookings.filter(b => b.tripType === 'hajj' || b.tripType === 'umrah').length;
    
    // Trips coming within next 7 days
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);
    
    const upcomingThisWeek = activeBookings.filter(b => {
      if (!b.travelDate) return false;
      const tDate = new Date(b.travelDate);
      return tDate >= now && tDate <= next7Days;
    }).length;

    return { totalLeads, totalClients, confirmed, tourismTrips, hajjUmrahTrips, upcomingThisWeek };
  }, [activeBookings, profiles, bookings]);

  const statusLabels: Record<BookingStatus, { label: string; color: string; bg: string }> = {
    new: { label: 'جديد', color: 'text-amber-300', bg: 'bg-amber-950/60 border-amber-600/40' },
    contacted: { label: 'تم التواصل', color: 'text-blue-300', bg: 'bg-blue-950/60 border-blue-600/40' },
    confirmed: { label: 'مؤكد', color: 'text-emerald-300', bg: 'bg-emerald-950/60 border-emerald-600/40' },
    in_progress: { label: 'جاري التنسيق', color: 'text-purple-300', bg: 'bg-purple-950/60 border-purple-600/40' },
    completed: { label: 'مكتمل', color: 'text-neutral-300', bg: 'bg-neutral-800 border-neutral-600/40' },
    cancelled: { label: 'ملغي', color: 'text-rose-300', bg: 'bg-rose-950/60 border-rose-600/40' },
  };

  const tripTypeConfig: Record<TripType, { label: string; icon: any; color: string; bg: string }> = {
    hajj: { label: 'حج ملكي فاخر', icon: Building, color: 'text-amber-300', bg: 'bg-amber-950/40 border-amber-500/30' },
    umrah: { label: 'عمرة VIP', icon: Building, color: 'text-emerald-300', bg: 'bg-emerald-950/40 border-emerald-500/30' },
    luxury_tourism: { label: 'سياحة وترفيه عالمي', icon: Palmtree, color: 'text-cyan-300', bg: 'bg-cyan-950/40 border-cyan-500/30' },
    business_travel: { label: 'رحلة عمل واستثمار', icon: Briefcase, color: 'text-indigo-300', bg: 'bg-indigo-950/40 border-indigo-500/30' },
    financial_advisory: { label: 'كونسيرج وخدمات خاصة', icon: Crown, color: 'text-purple-300', bg: 'bg-purple-950/40 border-purple-500/30' },
  };

  const tierConfig: Record<ClientProfile['tier'], { label: string; badge: string; border: string }> = {
    royal_vip: { label: 'عميل ملكي (Royal VIP)', badge: 'bg-[#D4AF37]/20 text-[#D4AF37]', border: 'border-[#D4AF37]/50' },
    diamond: { label: 'عميل ألماسي دائم', badge: 'bg-cyan-500/20 text-cyan-300', border: 'border-cyan-500/40' },
    executive: { label: 'عميل تنفيذي VIP', badge: 'bg-amber-500/20 text-amber-300', border: 'border-amber-500/40' },
    corporate: { label: 'شركات ومكاتب عائلية', badge: 'bg-purple-500/20 text-purple-300', border: 'border-purple-500/40' },
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته، سعادة ${name} المحترم.\nمعكم مكتب ميسورة لخدمات الحج والعمرة الفاخرة والكونسيرج والسياحة الملكية. نسعد بتواصلكم ونود متابعة تفاصيل رحلتكم وتقديم أرقى التسهيلات لكريمتكم.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F8F5F0] flex flex-col selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      {/* Top Executive Bar */}
      <header className="bg-[#121212] border-b border-[#D4AF37]/20 px-6 py-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C7335] flex items-center justify-center text-[#0D0D0D] font-bold shadow-md shadow-[#D4AF37]/20 font-serif">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#F8F5F0] tracking-wider">MAYSORA</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  لوحة الإدارة
                </span>
              </div>
              <p className="text-[11px] text-[#C0B7A6]">
                بوابة إدارة كبار الشخصيات • {admin?.name || 'المشرف العام'} {admin?.title ? `(${admin.title})` : ''}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E2DACB] hover:text-[#D4AF37] transition-all flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>عرض الموقع</span>
            </button>

            <button
              onClick={handleLogout}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 text-xs text-red-300 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <nav className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" aria-label="أقسام لوحة التحكم">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>نظرة عامة</span>
            </button>

            {/* NEW: DEDICATED CLIENT DOSSIER TAB */}
            {admin?.permissions?.canViewClients && (
              <button
                onClick={() => setActiveTab('profiles')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'profiles'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>ملفات وسجل العملاء الدائمة</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'profiles' ? 'bg-[#0D0D0D] text-[#D4AF37]' : 'bg-white/10 text-white'}`}>
                  {profiles.length}
                </span>
              </button>
            )}

            {admin?.permissions?.canViewBookings && (
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'bookings'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>الحجوزات والطلبات النشطة</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'bookings' ? 'bg-[#0D0D0D] text-[#D4AF37]' : 'bg-white/10 text-white'}`}>
                  {activeBookings.length}
                </span>
              </button>
            )}

            {admin?.permissions?.canViewBookings && (
              <button
                onClick={() => setActiveTab('travel')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'travel'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>جدول ومواعيد الرحلات</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'travel' ? 'bg-[#0D0D0D] text-[#D4AF37]' : 'bg-white/10 text-white'}`}>
                  {travelSchedule.length}
                </span>
              </button>
            )}

            {(admin?.permissions?.canDeleteBookings || admin?.permissions?.canViewBookings) && (
              <button
                onClick={() => setActiveTab('archive')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'archive'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>الأرشيف</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'archive' ? 'bg-[#0D0D0D] text-[#D4AF37]' : 'bg-white/10 text-white'}`}>
                  {archivedBookings.length}
                </span>
              </button>
            )}

            {/* TAB: WHATSAPP SCANNER & SYSTEM SETTINGS */}
            {admin?.permissions?.canUseWhatsApp && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>إعدادات وربط واتساب (Scanner)</span>
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              </button>
            )}

            {/* TAB: PACKAGE PRICING MANAGER */}
            {admin?.permissions?.canManagePrices && (
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'pricing'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>إدارة أسعار الحج والعمرة</span>
              </button>
            )}

            {/* TAB: HOTELS & ACCOMMODATIONS MANAGER */}
            {(admin?.permissions?.canManageHotels || admin?.permissions?.canManagePrices) && (
              <button
                onClick={() => setActiveTab('hotels')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'hotels'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <Hotel className="w-4 h-4" />
                <span>إدارة الفنادق والصور</span>
              </button>
            )}

            {/* TAB: STAFF & RBAC PERMISSIONS */}
            {admin?.permissions?.canManageStaff && (
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'staff'
                    ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-[#181818] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#202020]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>الموظفون والصلاحيات</span>
              </button>
            )}
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {admin?.permissions?.canExportData && (
              <button
                onClick={() => exportBookingsToCSV(bookings)}
                type="button"
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37]/50 text-xs text-[#E2DACB] hover:text-[#D4AF37] transition-all flex items-center gap-2 shadow-sm"
                title="تصدير كشف الحجوزات والمسافرين إلى Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير Excel (CSV)</span>
              </button>
            )}

            {admin?.permissions?.canEditBookings && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20"
              >
                <Plus className="w-4 h-4" />
                <span>حجز جديد</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#C0B7A6]">الملفات الدائمة للعملاء</span>
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#F8F5F0] font-serif mb-1">{stats.totalClients}</div>
                <p className="text-[11px] text-amber-400 font-medium">
                  عملاء مسجل تاريخهم وتفضيلاتهم بالكامل
                </p>
              </div>

              <div className="bg-[#141414] border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#C0B7A6]">رحلات سياحة وترفيه VIP</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Palmtree className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#F8F5F0] font-serif mb-1">{stats.tourismTrips}</div>
                <p className="text-[11px] text-cyan-300 font-medium">
                  سويسرا، المالديف، البحر الأحمر، لندن
                </p>
              </div>

              <div className="bg-[#141414] border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#C0B7A6]">حج وعمرة ملكية</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#F8F5F0] font-serif mb-1">{stats.hajjUmrahTrips}</div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  طيران خاص وأجنحة برج الساعة
                </p>
              </div>

              <div className="bg-[#141414] border border-blue-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#C0B7A6]">رحلات قادمة هذا الأسبوع</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#F8F5F0] font-serif mb-1">{stats.upcomingThisWeek}</div>
                <p className="text-[11px] text-blue-300 font-medium">
                  تنسيق طيران واستقبال كبار الشخصيات
                </p>
              </div>
            </div>

            {/* Client Dossier Highlight Section */}
            <div className="bg-gradient-to-r from-[#171309] to-[#121212] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#F8F5F0] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                    <span>ملفات العملاء الدائمة وتاريخ التعاملات (VIP Client Profiles)</span>
                  </h3>
                  <p className="text-xs text-[#C0B7A6] mt-1">
                    إذا تواصل العميل مجدداً، يظهر تاريخه بالكامل: رحلات سابقة، وجهات السياحة، أفراد أسرته، وتفضيلاته الثابتة.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0D0D0D] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <span>عرض جميع السجلات ({profiles.length})</span>
                  <span>&larr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {profiles.slice(0, 3).map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedProfile(client)}
                    className="bg-[#181818] border border-white/10 hover:border-[#D4AF37] rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tierConfig[client.tier].badge}`}>
                        {tierConfig[client.tier].label}
                      </span>
                      <span className="text-[11px] text-[#D4AF37] font-semibold">
                        {client.totalTripsCount} رحلات سابقة
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{client.name}</h4>
                    <p className="text-xs text-[#C0B7A6] mb-3" dir="ltr">{client.phone}</p>

                    <div className="text-[11px] text-neutral-400 bg-[#101010] p-2.5 rounded-lg border border-white/5 space-y-1 mb-3">
                      <div>
                        <span className="text-neutral-500">آخر رحلة: </span>
                        <span className="text-white font-medium">{client.trips[0]?.title || 'غير محدد'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">الوجهة: </span>
                        <span className="text-neutral-300">{client.trips[0]?.destination || 'غير محدد'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#F8F5F0] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>أحدث الحجوزات والطلبات الواردة</span>
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  عرض جميع الحجوزات ({activeBookings.length})
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {activeBookings.length === 0 ? (
                  <div className="py-10 text-center text-[#C0B7A6] text-xs">
                    لا توجد طلبات أو حجوزات واردة حالياً. النظام جاهز لاستقبال طلبات الزوار المباشرة.
                  </div>
                ) : (
                  activeBookings.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => handleOpenClientDossier(item.phone, item.name)}
                          className="text-sm font-bold text-[#F8F5F0] hover:text-[#D4AF37] cursor-pointer hover:underline"
                        >
                          {item.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusLabels[item.status].bg} ${statusLabels[item.status].color}`}>
                          {statusLabels[item.status].label}
                        </span>
                        {item.tripType && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tripTypeConfig[item.tripType].bg} ${tripTypeConfig[item.tripType].color}`}>
                            {tripTypeConfig[item.tripType].label}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#C0B7A6] flex items-center gap-3 mt-1">
                        <span>{item.serviceOrPackage}</span>
                        <span>•</span>
                        <span dir="ltr">{item.phone}</span>
                        <span>•</span>
                        <span className="text-neutral-500">{item.createdAt.split('T')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenClientDossier(item.phone, item.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-xs flex items-center gap-1 font-semibold"
                        title="فتح الملف الدائم وتاريخ العميل"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>الملف الدائم</span>
                      </button>
                      <a
                        href={getWhatsAppLink(item.phone, item.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-900/40 transition-colors"
                        title="محادثة واتساب مباشرة"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="p-2 rounded-lg bg-[#202020] text-[#D4AF37] border border-white/10 hover:bg-[#282828] transition-colors"
                        title="اتصال هاتفي"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VIP CLIENT PROFILES (DOSSIER) ================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Toolbar */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم العميل، رقم الهاتف، الوسم، أو رقم الجواز..."
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs text-[#C0B7A6]">
                إجمالي الملفات المسجلة: <strong className="text-white">{filteredProfiles.length}</strong>
              </div>
            </div>

            {/* Profiles Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map((client) => (
                <div
                  key={client.id}
                  className="bg-[#141414] border border-white/10 hover:border-[#D4AF37]/60 rounded-2xl p-5 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${tierConfig[client.tier].badge} ${tierConfig[client.tier].border}`}>
                        {tierConfig[client.tier].label}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-bold">
                        {client.totalTripsCount} رحلات
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{client.name}</h3>
                    <div className="text-xs text-[#C0B7A6] space-y-1 mb-4">
                      <p dir="ltr" className="font-mono text-white/90">{client.phone}</p>
                      {client.email && <p className="text-[11px] text-neutral-400">{client.email}</p>}
                    </div>

                    {/* Historical Timeline Snippet */}
                    <div className="bg-[#101010] p-3 rounded-xl border border-white/5 space-y-2 mb-4">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                        سجل الرحلات السابقة والحالية ({client.trips.length}):
                      </span>
                      {client.trips.slice(0, 2).map((t) => (
                        <div key={t.id} className="text-xs border-r-2 border-[#D4AF37] pr-2">
                          <span className="font-medium text-white block truncate">{t.title}</span>
                          <span className="text-[10px] text-[#C0B7A6]">
                            {t.destination} • {t.travelDate || 'بدون تاريخ'}
                          </span>
                        </div>
                      ))}
                      {client.trips.length > 2 && (
                        <span className="text-[10px] text-[#D4AF37] block">
                          + {client.trips.length - 2} رحلات إضافية في الأرشيف
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {client.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <button
                      onClick={() => setSelectedProfile(client)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold text-xs hover:brightness-110 transition-all text-center"
                    >
                      فتح الملف الشامل (360°)
                    </button>

                    <a
                      href={getWhatsAppLink(client.phone, client.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-900/60 transition-colors"
                      title="واتساب مباشر"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BOOKINGS & LEADS ================= */}
        {(activeTab === 'bookings' || activeTab === 'archive') && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، الهاتف، الباقة، أو الوجهة..."
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Trip Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#C0B7A6] shrink-0">نوع الرحلة:</span>
                <select
                  value={tripTypeFilter}
                  onChange={(e) => setTripTypeFilter(e.target.value)}
                  className="bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="hajj">حج ملكي فاخر</option>
                  <option value="umrah">عمرة VIP</option>
                  <option value="luxury_tourism">سياحة وترفيه عالمي</option>
                  <option value="business_travel">رحلات عمل واستثمار</option>
                  <option value="financial_advisory">كونسيرج وخدمات خاصة</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#C0B7A6] shrink-0">الحالة:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="new">جديد</option>
                  <option value="contacted">تم التواصل</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="in_progress">جاري التنسيق</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllData}
                  className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  title="تفريغ ومسح السجلات نهائياً لتجهيز النظام للإنتاج"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تفريغ السجلات بالكامل</span>
                </button>
              )}
            </div>

            {/* Bookings Table Card */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#181818] border-b border-white/10 text-[#C0B7A6]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">رقم الحجز</th>
                      <th className="py-3.5 px-4 font-semibold">اسم العميل والملف</th>
                      <th className="py-3.5 px-4 font-semibold">وسيلة التواصل</th>
                      <th className="py-3.5 px-4 font-semibold">نوع الرحلة والوجهة</th>
                      <th className="py-3.5 px-4 font-semibold">موعد السفر</th>
                      <th className="py-3.5 px-4 font-semibold">الحالة</th>
                      <th className="py-3.5 px-4 font-semibold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#E2DACB]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-[#C0B7A6] text-xs">
                          {activeTab === 'archive'
                            ? 'لا توجد سجلات أو رحلات مؤرشفة حالياً.'
                            : 'لا توجد حجوزات أو طلبات مسجلة حالياً. النظام جاهز لاستقبال حجوزات العملاء.'}
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 font-mono text-[11px] text-[#D4AF37]">
                            {b.id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                onClick={() => handleOpenClientDossier(b.phone, b.name)}
                                className="font-bold text-white text-sm hover:text-[#D4AF37] cursor-pointer hover:underline"
                              >
                                {b.name}
                              </span>
                              <button
                                onClick={() => handleOpenClientDossier(b.phone, b.name)}
                                className="p-1 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded"
                                title="فتح ملف العميل وسجله التاريخي"
                              >
                                <Award className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {b.email && (
                              <div className="text-[11px] text-neutral-400">{b.email}</div>
                            )}
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              المصدر: {b.source || 'الموقع مباشرة'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-mono text-xs text-white" dir="ltr">
                              {b.phone}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <a
                                href={getWhatsAppLink(b.phone, b.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 text-[10px] inline-flex items-center gap-1 font-medium"
                              >
                                <MessageCircle className="w-3 h-3" />
                                واتساب
                              </a>
                              <a
                                href={`tel:${b.phone}`}
                                className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-600/40 text-neutral-200 hover:bg-neutral-700 text-[10px] inline-flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                اتصال
                              </a>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-white block">{b.serviceOrPackage}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {b.tripType && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tripTypeConfig[b.tripType].bg} ${tripTypeConfig[b.tripType].color}`}>
                                  {tripTypeConfig[b.tripType].label}
                                </span>
                              )}
                              {b.destination && (
                                <span className="text-[11px] text-[#C0B7A6]">{b.destination}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {b.travelDate ? (
                              <div>
                                <span className="font-medium text-[#D4AF37] block">
                                  {b.travelDate}
                                </span>
                                {b.returnDate && (
                                  <span className="text-[10px] text-neutral-400">
                                    إلى {b.returnDate}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-neutral-500 italic">غير محدد</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={b.status}
                              disabled={!admin?.permissions?.canEditBookings}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                              className={`rounded-lg px-2.5 py-1 text-xs border font-medium bg-[#141414] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${statusLabels[b.status].color} ${statusLabels[b.status].bg} ${!admin?.permissions?.canEditBookings ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="confirmed">مؤكد</option>
                              <option value="in_progress">جاري التنسيق</option>
                              <option value="completed">مكتمل</option>
                              <option value="cancelled">ملغي</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {admin?.permissions?.canEditBookings && (
                                <button
                                  onClick={() => setEditingBooking(b)}
                                  className="p-1.5 rounded-lg bg-[#202020] text-[#D4AF37] hover:bg-[#2A2A2A] transition-colors"
                                  title="تعديل تفاصيل الحجز"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {admin?.permissions?.canDeleteBookings && (
                                <button
                                  onClick={() => handleToggleArchive(b.id)}
                                  className="p-1.5 rounded-lg bg-[#202020] text-neutral-300 hover:text-white hover:bg-[#2A2A2A] transition-colors"
                                  title={b.isArchived ? 'استعادة من الأرشيف' : 'نقل للأرشيف'}
                                >
                                  {b.isArchived ? <RotateCcw className="w-3.5 h-3.5 text-blue-400" /> : <Archive className="w-3.5 h-3.5" />}
                                </button>
                              )}
                              {b.isArchived && admin?.permissions?.canDeleteBookings && (
                                <button
                                  onClick={() => handleDelete(b.id)}
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/40 transition-colors"
                                  title="حذف نهائي"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: TRAVEL SCHEDULE ================= */}
        {activeTab === 'travel' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#F8F5F0] flex items-center gap-2">
                    <Plane className="w-5 h-5 text-[#D4AF37]" />
                    <span>جدول الرحلات ومواعيد السفر (حج، عمرة، وسياحة عالمية)</span>
                  </h3>
                  <p className="text-xs text-[#C0B7A6] mt-1">
                    متابعة رحلات الوصول والمغادرة وتنسيق الطيران والفنادق المطلة والمنتجعات العالمية.
                  </p>
                </div>
                <button
                  onClick={() => exportBookingsToCSV(travelSchedule)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#202020] border border-white/10 hover:border-[#D4AF37] text-xs text-[#D4AF37] flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير كشف المسافرين</span>
                </button>
              </div>

              {travelSchedule.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  لا توجد رحلات مجدولة بمواعيد سفر حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelSchedule.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-[#181818] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        {/* Date header */}
                        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold text-[#D4AF37]">
                              {trip.travelDate}
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusLabels[trip.status].bg} ${statusLabels[trip.status].color}`}>
                            {statusLabels[trip.status].label}
                          </span>
                        </div>

                        {/* Guest name */}
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-bold text-white">{trip.name}</h4>
                          {trip.tripType && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border ${tripTypeConfig[trip.tripType].bg} ${tripTypeConfig[trip.tripType].color}`}>
                              {tripTypeConfig[trip.tripType].label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#C0B7A6] mb-4">
                          {trip.destination ? `${trip.destination} - ` : ''}{trip.serviceOrPackage}
                        </p>

                        {/* Details specs */}
                        <div className="space-y-2 text-xs bg-[#101010] p-3 rounded-xl border border-white/5 mb-4">
                          <div className="flex items-start gap-2">
                            <Plane className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-neutral-500 block text-[10px]">الطيران والمطار</span>
                              <span className="text-neutral-200">{trip.flightDetails || 'بانتظار تأكيد خط السير'}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Building className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-neutral-500 block text-[10px]">الفندق والإقامة</span>
                              <span className="text-neutral-200">{trip.hotelName || 'بانتظار تخصيص الجناح'}</span>
                            </div>
                          </div>

                          {trip.guestsCount && (
                            <div className="text-[11px] text-neutral-400">
                              عدد أفراد الوفد / الأسرة: <strong className="text-white">{trip.guestsCount} ضيوف</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <button
                          onClick={() => handleOpenClientDossier(trip.phone, trip.name)}
                          className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>الملف الدائم</span>
                        </button>

                        <a
                          href={getWhatsAppLink(trip.phone, trip.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: WHATSAPP SCANNER & SYSTEM SETTINGS ================= */}
        {activeTab === 'settings' && (
          <WhatsAppScannerSettings />
        )}

        {/* ================= TAB 6: PACKAGE PRICING & CONFIGURATION ================= */}
        {activeTab === 'pricing' && (
          <PackagePricingManager onBackToSite={onBackToSite} />
        )}

        {/* ================= TAB 7: STAFF & RBAC PERMISSIONS ================= */}
        {activeTab === 'staff' && (
          <StaffManager />
        )}

        {/* ================= TAB 8: HOTELS & GALLERY MANAGER ================= */}
        {activeTab === 'hotels' && (
          <HotelManager />
        )}
      </main>

      {/* ================= MODAL: 360° CLIENT PROFILE & TRAVEL ARCHIVE ================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/50 rounded-2xl w-full max-w-4xl p-6 sm:p-8 relative shadow-2xl animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute left-5 top-5 text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Profile Header */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-lg font-serif">
                      VIP
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>{selectedProfile.name}</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#C0B7A6] mt-1">
                        <span dir="ltr" className="font-mono text-white">{selectedProfile.phone}</span>
                        {selectedProfile.email && <span>• {selectedProfile.email}</span>}
                        {selectedProfile.passportOrNationalId && (
                          <span>• رقم الجواز/الهوية: <strong className="text-white font-mono">{selectedProfile.passportOrNationalId}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${tierConfig[selectedProfile.tier].badge} ${tierConfig[selectedProfile.tier].border}`}>
                    {tierConfig[selectedProfile.tier].label}
                  </span>
                  <button
                    onClick={() => setIsAddTripModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 hover:brightness-110"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة رحلة جديدة للعميل</span>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 bg-[#0D0D0D] p-3.5 rounded-xl border border-white/5 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">إجمالي الرحلات والتعاملات</span>
                  <span className="text-white font-bold text-sm">{selectedProfile.totalTripsCount} رحلات</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">تاريخ أول تعامل</span>
                  <span className="text-white font-medium">{selectedProfile.firstContactDate}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">آخر تواصل</span>
                  <span className="text-white font-medium">{selectedProfile.lastContactDate}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">حجم التعاملات التقديري</span>
                  <span className="text-[#D4AF37] font-bold">{selectedProfile.totalSpendEstimate || 'غير محدد'}</span>
                </div>
              </div>
            </div>

            {/* Travel History Timeline Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5 text-[#D4AF37]" />
                  <span>سجل الرحلات والتعاملات الكامل (Trip History Timeline)</span>
                </h3>
                <span className="text-xs text-[#C0B7A6]">
                  يشمل: الحج والعمرة، السياحة العالمية، ورحلات العمل
                </span>
              </div>

              <div className="space-y-4">
                {selectedProfile.trips.map((trip, idx) => (
                  <div
                    key={trip.id}
                    className="bg-[#181818] border border-white/10 hover:border-[#D4AF37]/40 rounded-xl p-4 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{trip.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tripTypeConfig[trip.tripType].bg} ${tripTypeConfig[trip.tripType].color}`}>
                          {tripTypeConfig[trip.tripType].label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {trip.budgetOrPrice && (
                          <span className="text-xs font-bold text-[#D4AF37] font-mono">{trip.budgetOrPrice}</span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusLabels[trip.status].bg} ${statusLabels[trip.status].color}`}>
                          {statusLabels[trip.status].label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#101010] p-3 rounded-lg border border-white/5 my-2">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">الوجهة والبلد</span>
                        <span className="text-neutral-200 font-medium">{trip.destination}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">تاريخ السفر والمدة</span>
                        <span className="text-neutral-200 font-medium">{trip.travelDate || 'غير محدد'} {trip.returnDate ? `إلى ${trip.returnDate}` : ''}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">الفندق والإقامة</span>
                        <span className="text-neutral-200 font-medium truncate block">{trip.hotelName || 'غير محدد'}</span>
                      </div>
                    </div>

                    {trip.notes && (
                      <p className="text-xs text-[#C0B7A6] bg-white/[0.02] p-2 rounded border border-white/5 mt-2">
                        <strong className="text-white">ملاحظات الرحلة: </strong>{trip.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Permanent Preferences & Habits Form */}
            <form onSubmit={handleUpdatePreferences} className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  <span>التفضيلات الدائمة ومتطلبات العميل الثابتة (Permanent Preferences)</span>
                </h3>
                <span className="text-[11px] text-neutral-400">تُحفظ تلقائياً لأي حجز مستقبلي</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تفضيل خطوط الطيران والمقاعد</label>
                  <input
                    type="text"
                    value={selectedProfile.permanentPreferences.airlinePreference || ''}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      permanentPreferences: { ...selectedProfile.permanentPreferences, airlinePreference: e.target.value }
                    })}
                    placeholder="مثال: طيران خاص حصراً / درجة أولى مقاعد أمامية"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تفضيل الفنادق والأجنحة</label>
                  <input
                    type="text"
                    value={selectedProfile.permanentPreferences.hotelPreference || ''}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      permanentPreferences: { ...selectedProfile.permanentPreferences, hotelPreference: e.target.value }
                    })}
                    placeholder="مثال: أجنحة رئاسية علوية / فلل شاطئية مع مسبح خاص"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">نوع السيارات والمواكب المفضلة</label>
                  <input
                    type="text"
                    value={selectedProfile.permanentPreferences.carType || ''}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      permanentPreferences: { ...selectedProfile.permanentPreferences, carType: e.target.value }
                    })}
                    placeholder="مثال: مرسيدس مايباخ / سيارات عائلية VIP V-Class"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تفضيلات الوجبات والحمية الغذائية</label>
                  <input
                    type="text"
                    value={selectedProfile.permanentPreferences.dietaryNeeds || ''}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      permanentPreferences: { ...selectedProfile.permanentPreferences, dietaryNeeds: e.target.value }
                    })}
                    placeholder="مثال: طعام صحي عضوي / شاي وقهوة سعودية بالزعفران"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C0B7A6] mb-1 font-semibold text-xs">طلبات وخدمات كونسيرج خاصة مستمرة</label>
                <textarea
                  rows={2}
                  value={selectedProfile.permanentPreferences.specialRequests || ''}
                  onChange={(e) => setSelectedProfile({
                    ...selectedProfile,
                    permanentPreferences: { ...selectedProfile.permanentPreferences, specialRequests: e.target.value }
                  })}
                  placeholder="مثال: مرافق أمني خاص، مترجم فوري، مرشد ديني لكبار الشخصيات..."
                  className="w-full bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <a
                  href={getWhatsAppLink(selectedProfile.phone, selectedProfile.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل فوري واتساب</span>
                </a>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0D0D0D] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>تحديث التفضيلات الدائمة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD TRIP TO EXISTING CLIENT ================= */}
      {isAddTripModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/50 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl animate-scaleUp my-8">
            <button
              onClick={() => setIsAddTripModalOpen(false)}
              className="absolute left-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Plus className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-base font-bold text-white">
                إضافة رحلة جديدة للعميل: {selectedProfile.name}
              </h3>
            </div>

            <form onSubmit={handleAddTripToClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">نوع الرحلة *</label>
                  <select
                    value={newTripData.tripType}
                    onChange={(e) => setNewTripData({ ...newTripData, tripType: e.target.value as TripType })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="luxury_tourism">سياحة وترفيه عالمي فاخر</option>
                    <option value="hajj">باقة حج ملكي VIP</option>
                    <option value="umrah">عمرة VIP فاخرة</option>
                    <option value="business_travel">رحلة عمل واستثمار</option>
                    <option value="financial_advisory">كونسيرج ملكي وخدمات خاصة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">مسمى الباقة / الرحلة *</label>
                  <input
                    type="text"
                    required
                    value={newTripData.title}
                    onChange={(e) => setNewTripData({ ...newTripData, title: e.target.value })}
                    placeholder="مثال: عطلة جبال الألب السويسرية الصيفية"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">الوجهة أو البلد *</label>
                  <input
                    type="text"
                    required
                    value={newTripData.destination}
                    onChange={(e) => setNewTripData({ ...newTripData, destination: e.target.value })}
                    placeholder="مثال: سويسرا (جنيف وسان موريتز) أو المالديف"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">التكلفة / الميزانية التقديرية</label>
                  <input
                    type="text"
                    value={newTripData.budgetOrPrice}
                    onChange={(e) => setNewTripData({ ...newTripData, budgetOrPrice: e.target.value })}
                    placeholder="مثال: 250,000 ر.س"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تاريخ السفر المتوقع</label>
                  <input
                    type="date"
                    value={newTripData.travelDate}
                    onChange={(e) => setNewTripData({ ...newTripData, travelDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تاريخ العودة</label>
                  <input
                    type="date"
                    value={newTripData.returnDate}
                    onChange={(e) => setNewTripData({ ...newTripData, returnDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">عدد الضيوف</label>
                  <input
                    type="number"
                    min={1}
                    value={newTripData.guestsCount}
                    onChange={(e) => setNewTripData({ ...newTripData, guestsCount: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">حالة الرحلة</label>
                  <select
                    value={newTripData.status}
                    onChange={(e) => setNewTripData({ ...newTripData, status: e.target.value as BookingStatus })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="confirmed">مؤكد</option>
                    <option value="in_progress">جاري التنسيق</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#C0B7A6] mb-1 font-semibold">الطيران وتفاصيل الانتقال</label>
                <input
                  type="text"
                  value={newTripData.flightDetails}
                  onChange={(e) => setNewTripData({ ...newTripData, flightDetails: e.target.value })}
                  placeholder="مثال: طيران خاص صالة البيرق / الخطوط الإماراتية درجة أولى"
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C0B7A6] mb-1 font-semibold">الفندق أو المنتجع المحجوز</label>
                <input
                  type="text"
                  value={newTripData.hotelName}
                  onChange={(e) => setNewTripData({ ...newTripData, hotelName: e.target.value })}
                  placeholder="مثال: Four Seasons Geneva أو Cheval Blanc Randheli"
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C0B7A6] mb-1 font-semibold">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  value={newTripData.notes}
                  onChange={(e) => setNewTripData({ ...newTripData, notes: e.target.value })}
                  placeholder="أية برامج سياحية، تأجير سيارات، رحلات يخوت، أو مواعيد خاصة..."
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddTripModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold shadow-md shadow-[#D4AF37]/20"
                >
                  إضافة الرحلة لسجل العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT BOOKING ================= */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl animate-scaleUp my-8">
            <button
              onClick={() => setEditingBooking(null)}
              className="absolute left-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Edit3 className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-base font-bold text-white">
                تفاصيل وتعديل حجز: {editingBooking.name}
              </h3>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">اسم العميل</label>
                  <input
                    type="text"
                    value={editingBooking.name}
                    onChange={(e) => setEditingBooking({ ...editingBooking, name: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editingBooking.phone}
                    onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">نوع الرحلة</label>
                  <select
                    value={editingBooking.tripType || 'umrah'}
                    onChange={(e) => setEditingBooking({ ...editingBooking, tripType: e.target.value as TripType })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="hajj">حج ملكي فاخر</option>
                    <option value="umrah">عمرة VIP</option>
                    <option value="luxury_tourism">سياحة وترفيه عالمي</option>
                    <option value="business_travel">رحلات عمل واستثمار</option>
                    <option value="financial_advisory">كونسيرج وخدمات خاصة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">الوجهة أو البلد</label>
                  <input
                    type="text"
                    value={editingBooking.destination || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, destination: e.target.value })}
                    placeholder="مثال: مكة المكرمة أو سويسرا أو المالديف"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تاريخ السفر / الوصول</label>
                  <input
                    type="date"
                    value={editingBooking.travelDate || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, travelDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">تاريخ المغادرة / العودة</label>
                  <input
                    type="date"
                    value={editingBooking.returnDate || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, returnDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">الباقة / المسمى</label>
                  <input
                    type="text"
                    value={editingBooking.serviceOrPackage}
                    onChange={(e) => setEditingBooking({ ...editingBooking, serviceOrPackage: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">الحالة</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as BookingStatus })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="in_progress">جاري التنسيق</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#C0B7A6] mb-1 font-semibold">تفاصيل الطيران والفندق</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="بيانات الطيران"
                    value={editingBooking.flightDetails || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, flightDetails: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="الفندق أو المنتجع"
                    value={editingBooking.hotelName || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, hotelName: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#C0B7A6] mb-1 font-semibold">ملاحظات وطلبات خاصة</label>
                <textarea
                  rows={2}
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW BOOKING ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl animate-scaleUp my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Plus className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-base font-bold text-white">إضافة حجز / عميل يدوي جديد</h3>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">اسم العميل *</label>
                  <input
                    type="text"
                    required
                    value={newBookingData.name}
                    onChange={(e) => setNewBookingData({ ...newBookingData, name: e.target.value })}
                    placeholder="الاسم الكامل"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={newBookingData.phone}
                    onChange={(e) => setNewBookingData({ ...newBookingData, phone: e.target.value })}
                    placeholder="+966500000000"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">نوع الرحلة</label>
                  <select
                    value={newBookingData.tripType}
                    onChange={(e) => setNewBookingData({ ...newBookingData, tripType: e.target.value as TripType })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="umrah">عمرة VIP</option>
                    <option value="hajj">حج ملكي فاخر</option>
                    <option value="luxury_tourism">سياحة وترفيه عالمي فاخر</option>
                    <option value="business_travel">رحلات عمل واستثمار</option>
                    <option value="financial_advisory">كونسيرج وخدمات خاصة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">الوجهة أو البلد</label>
                  <input
                    type="text"
                    value={newBookingData.destination}
                    onChange={(e) => setNewBookingData({ ...newBookingData, destination: e.target.value })}
                    placeholder="مكة المكرمة / سويسرا / المالديف / لندن"
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">مسمى الباقة</label>
                  <input
                    type="text"
                    value={newBookingData.serviceOrPackage}
                    onChange={(e) => setNewBookingData({ ...newBookingData, serviceOrPackage: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C0B7A6] mb-1 font-semibold">موعد السفر المتوقع</label>
                  <input
                    type="date"
                    value={newBookingData.travelDate}
                    onChange={(e) => setNewBookingData({ ...newBookingData, travelDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C0B7A6] mb-1 font-semibold">ملاحظات العميل</label>
                <textarea
                  rows={2}
                  value={newBookingData.notes}
                  onChange={(e) => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                  placeholder="أي تفاصيل خاصة وردت أثناء الاتصال..."
                  className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold shadow-md shadow-[#D4AF37]/20"
                >
                  إضافة الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
