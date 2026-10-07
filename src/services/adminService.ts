/**
 * Admin CRM & VIP Client Dossier Service
 * Handles state persistence, multi-trip historical archive (Hajj, Umrah, Luxury Tourism, Business),
 * permanent preferences, and Excel/CSV export.
 */

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type TripType = 'hajj' | 'umrah' | 'luxury_tourism' | 'business_travel' | 'financial_advisory';

export interface TripRecord {
  id: string;
  tripType: TripType;
  title: string;
  destination: string;       // e.g. "مكة المكرمة", "سويسرا - جنيف وإنترلاكن", "جزر المالديف", "لندن"
  travelDate?: string;       // YYYY-MM-DD
  returnDate?: string;       // YYYY-MM-DD
  guestsCount?: number;
  flightDetails?: string;    // e.g. "طيران خاص Gulfstream" or "طيران الإمارات درجة أولى"
  hotelName?: string;        // e.g. "فندق الفيرمونت برج الساعة" or "منتجع شيفال بلانك المالديف"
  status: BookingStatus;
  budgetOrPrice?: string;
  notes?: string;
  createdAt: string;
}

export interface ClientProfile {
  id: string;                // e.g. "VIP-901"
  name: string;
  phone: string;
  email?: string;
  nationality?: string;
  passportOrNationalId?: string;
  tier: 'royal_vip' | 'diamond' | 'executive' | 'corporate';
  tags: string[];            // e.g. ['عميل متكرر', 'عائلي', 'سياحة شتوية', 'طيران خاص']
  permanentPreferences: {
    airlinePreference?: string;
    hotelPreference?: string;
    carType?: string;
    dietaryNeeds?: string;
    specialRequests?: string;
  };
  trips: TripRecord[];
  totalTripsCount: number;
  totalSpendEstimate?: string;
  firstContactDate: string;
  lastContactDate: string;
  generalNotes?: string;
}

export interface AdminBooking {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  tripType?: TripType;
  destination?: string;
  serviceOrPackage: string;
  guestsCount?: number;
  travelDate?: string;      // YYYY-MM-DD
  returnDate?: string;      // YYYY-MM-DD
  flightDetails?: string;    // e.g. "طيران أديل FZ-204" or "طيران خاص صالة البيرق"
  hotelName?: string;        // e.g. "فيرمونت مكة - جناح رئاسي كعبة فيو"
  status: BookingStatus;
  isArchived: boolean;
  notes?: string;
  source?: string;
  campaign?: string;
}

const STORAGE_KEY_BOOKINGS = 'maysora_admin_bookings_v2';
const STORAGE_KEY_PROFILES = 'maysora_client_profiles_v2';

// Initial realistic seed profiles with rich historical travel archive (Hajj/Umrah + Global Tourism)
const INITIAL_SEED_PROFILES: ClientProfile[] = [
  {
    id: 'VIP-CLIENT-001',
    name: 'صاحب السمو الملكي الأمير فيصل بن ناصر',
    phone: '+966501112233',
    email: 'faisal.office@royalholding.sa',
    nationality: 'سعودي',
    passportOrNationalId: 'KSA-P-992014',
    tier: 'royal_vip',
    tags: ['كبار الشخصيات الملكية', 'عميل دائم', 'طيران خاص', 'سياحة جبال الألب'],
    permanentPreferences: {
      airlinePreference: 'صالة البيرق / طيران خاص حصراً Gulfstream G650',
      hotelPreference: 'بنتهاوس ملكي أعلى طابق إطلالة كاملة كعبة أو بحيرة',
      carType: 'موكب مرسيدس مايباخ وسيارات مصفحة للحراسة',
      dietaryNeeds: 'وجبات نجدية عضوية فاخرة وقهوة سعودية بالزعفران الملكي',
      specialRequests: 'مرشد ديني ومساعد لوجستي شخصي مرافق 24 ساعة.',
    },
    trips: [
      {
        id: 'TRIP-2026-H1',
        tripType: 'hajj',
        title: 'باقة الحج الملكي الميسور VIP 1447هـ',
        destination: 'مكة المكرمة والمشاعر المقدسة',
        travelDate: '2026-10-08',
        returnDate: '2026-10-18',
        guestsCount: 4,
        flightDetails: 'صالة البيرق - طيران خاص Gulfstream G650',
        hotelName: 'برج الساعة - بنتهاوس رئاسي مطل مباشرة على الكعبة',
        status: 'confirmed',
        budgetOrPrice: '480,000 ر.س',
        notes: 'مخيم خاص ومسار تفويج حصري في منى وعرفات.',
        createdAt: '2026-10-05T14:30:00Z',
      },
      {
        id: 'TRIP-2025-TOUR-CH',
        tripType: 'luxury_tourism',
        title: 'رحلة جنيف وإنترلاكن الصيفية الفاخرة',
        destination: 'سويسرا (جنيف، سان موريتز، إنترلاكن)',
        travelDate: '2025-07-10',
        returnDate: '2025-07-25',
        guestsCount: 6,
        flightDetails: 'طيران خاص مباشر الرياض - جنيف',
        hotelName: 'فندق قصر جنيف Four Seasons Hotel des Bergues',
        status: 'completed',
        budgetOrPrice: '620,000 ر.س',
        notes: 'جولة هليكوبتر خاصة فوق جبال الألب وتأجير يخوت بحيرة جنيف.',
        createdAt: '2025-06-01T10:00:00Z',
      },
      {
        id: 'TRIP-2024-U1',
        tripType: 'umrah',
        title: 'عمرة العشر الأواخر من رمضان المبارك',
        destination: 'مكة المكرمة والمدينة المنورة',
        travelDate: '2024-04-01',
        returnDate: '2024-04-11',
        guestsCount: 5,
        flightDetails: 'طيران خاص صالة كبار الشخصيات بمطار جدة',
        hotelName: 'رافلز قصر مكة - فيلا ملكية',
        status: 'completed',
        budgetOrPrice: '350,000 ر.س',
        notes: 'تمت الرحلة بأعلى درجات الرضا والتقدير.',
        createdAt: '2024-03-10T12:00:00Z',
      },
    ],
    totalTripsCount: 3,
    totalSpendEstimate: '1,450,000 ر.س',
    firstContactDate: '2024-03-01',
    lastContactDate: '2026-10-05',
    generalNotes: 'من أقدم وأعز عملاء المكتب، يتم التنسيق دوماً عبر مدير مكتب سموه الخاص.',
  },
  {
    id: 'VIP-CLIENT-002',
    name: 'المهندس عبدالرحمن المنصور',
    phone: '+966567778899',
    email: 'a.mansour@techventures.sa',
    nationality: 'سعودي',
    passportOrNationalId: 'KSA-P-812093',
    tier: 'diamond',
    tags: ['رجل أعمال', 'عائلي', 'سياحة جزر استوائية', 'عمرة متكررة'],
    permanentPreferences: {
      airlinePreference: 'الخطوط السعودية أو الخطوط القطرية - درجة أولى',
      hotelPreference: 'أجنحة عائلية متصلة VIP مع شرفة خاصة',
      carType: 'سيارة دفع رباعي فاخرة Range Rover أو Mercedes S-Class',
      dietaryNeeds: 'خيارات نباتية خفيفة وأطباق بحرية',
      specialRequests: 'تأمين تصاريح الروضة الشريفة في أوقات الهدوء وتسهيل وصول الأطفال.',
    },
    trips: [
      {
        id: 'TRIP-2026-U2',
        tripType: 'umrah',
        title: 'باقة العمرة الميسرة التنفيذية',
        destination: 'مكة المكرمة',
        travelDate: '2026-10-07',
        returnDate: '2026-10-11',
        guestsCount: 2,
        flightDetails: 'الخطوط السعودية SV-1034 - درجة أولى',
        hotelName: 'جبل عمر جميرا مكة - جناح تنفيذي بانورامي',
        status: 'in_progress',
        budgetOrPrice: '65,000 ر.س',
        notes: 'تم إصدار تأشيرة ومواعيد الروضة والسيارة جاهزة للاستقبال.',
        createdAt: '2026-10-04T19:40:00Z',
      },
      {
        id: 'TRIP-2025-TOUR-ML',
        tripType: 'luxury_tourism',
        title: 'عطلة الاستجمام العائلية في المالديف',
        destination: 'جزر المالديف (Cheval Blanc Randheli)',
        travelDate: '2025-11-12',
        returnDate: '2025-11-20',
        guestsCount: 4,
        flightDetails: 'طيران الإمارات - درجة رجال الأعمال + طائرة مائية خاصة',
        hotelName: 'فيلا مائية خاصة 3 غرف نوم مع مسبح خاص وخدمة نادل',
        status: 'completed',
        budgetOrPrice: '190,000 ر.س',
        notes: 'رحلة استجمام عائلية خاصة، أشادوا بفخامة الخصوصية التامة.',
        createdAt: '2025-10-10T15:00:00Z',
      },
      {
        id: 'TRIP-2025-BIZ-LDN',
        tripType: 'business_travel',
        title: 'رحلة مؤتمر الاستثمار التكنولوجي بلندن',
        destination: 'المملكة المتحدة - لندن (مايفير)',
        travelDate: '2025-05-14',
        returnDate: '2025-05-20',
        guestsCount: 1,
        flightDetails: 'الخطوط البريطانية - First Class',
        hotelName: 'The Connaught Hotel Mayfair',
        status: 'completed',
        budgetOrPrice: '85,000 ر.س',
        notes: 'حجز قاعات اجتماعات خاصة وسائق خاص طوال الأسبوع.',
        createdAt: '2025-04-20T11:00:00Z',
      },
    ],
    totalTripsCount: 3,
    totalSpendEstimate: '340,000 ر.س',
    firstContactDate: '2025-04-15',
    lastContactDate: '2026-10-04',
    generalNotes: 'عميل دقيق ومنظم، يحب استلام جدول الرحلة الرقمي مفصلاً بالدقائق.',
  },
  {
    id: 'VIP-CLIENT-003',
    name: 'الشيخ خالد الراجحي وعائلته الكريمة',
    phone: '+966509998877',
    email: 'k.alrajhi@familyoffice.sa',
    nationality: 'سعودي',
    passportOrNationalId: 'KSA-P-554109',
    tier: 'royal_vip',
    tags: ['عائلي كبير', 'أوقاف وخيرات', 'عمرة سنوية', 'سياحة البحر الأحمر'],
    permanentPreferences: {
      airlinePreference: 'طيران الرياض أو الخطوط السعودية درجة أولى ورجال أعمال للأسرة',
      hotelPreference: 'فلل فندقية مستقلة 4 غرف فأكثر مع مصعد خاص ومطبخ تحضيري',
      carType: 'سيارتين مرسيدس V-Class VIP فسيحة للأطفال والمربيات',
      dietaryNeeds: 'بوفيه طعام عائلي خاص مجهز بالشريعة الإسلامية',
      specialRequests: 'تأمين كراسي متحركة كهربائية ومرافقين صحيين للوالدة الكريمة.',
    },
    trips: [
      {
        id: 'TRIP-2026-U3',
        tripType: 'umrah',
        title: 'باقة العمرة الماسية الفاخرة للأسرة',
        destination: 'مكة المكرمة',
        travelDate: '2026-10-15',
        returnDate: '2026-10-22',
        guestsCount: 6,
        flightDetails: 'طيران الرياض - درجة رجال الأعمال',
        hotelName: 'رافلز قصر مكة - فيلا خاصة',
        status: 'contacted',
        budgetOrPrice: '145,000 ر.س',
        notes: 'بانتظار تأكيد عدد الغرف المتبقية للأطفال والمرافقين.',
        createdAt: '2026-10-03T11:20:00Z',
      },
      {
        id: 'TRIP-2025-REDSEA',
        tripType: 'luxury_tourism',
        title: 'إجازة منتجعات البحر الأحمر الفاخرة (وجهة أمالا وريد سي)',
        destination: 'المملكة العربية السعودية - مشروع البحر الأحمر (منتجع سانت ريجيس)',
        travelDate: '2025-09-01',
        returnDate: '2025-09-08',
        guestsCount: 7,
        flightDetails: 'رحلة خاصة عبر مطار البحر الأحمر الدولي Red Sea Airport',
        hotelName: 'The St. Regis Red Sea Resort - فيلا شاطئية محمية',
        status: 'completed',
        budgetOrPrice: '260,000 ر.س',
        notes: 'تجربة سياحية سعودية بمعايير عالمية لاقت إعجاب العائلة بالكامل.',
        createdAt: '2025-08-15T09:00:00Z',
      },
    ],
    totalTripsCount: 2,
    totalSpendEstimate: '405,000 ر.س',
    firstContactDate: '2025-08-01',
    lastContactDate: '2026-10-03',
    generalNotes: 'مهتم جداً برحلات السياحة الفاخرة داخل المملكة (العلا، البحر الأحمر) بجانب مواسم العمرة.',
  },
  {
    id: 'VIP-CLIENT-004',
    name: 'سعادة الأستاذ فهد عبدالله الدوسري',
    phone: '+966554443322',
    email: 'fahad@aldosari-capital.com',
    nationality: 'سعودي',
    tier: 'corporate',
    tags: ['شركات ومؤسسات', 'استشارات مالية', 'حوكمة وزكاة'],
    permanentPreferences: {
      airlinePreference: 'رحلات مباشرة حصراً درجة أولى',
      hotelPreference: 'فنادق رجال أعمال مركزية قريبة من مراكز المال والأعمال',
      carType: 'سيارة سيدان تنفيذية Audi A8 أو BMW 7-Series',
      dietaryNeeds: 'وجبات عمل خفيفة',
      specialRequests: 'توفير مستشار مالي ومحاسب قانوني معتمد لحضور الاجتماعات.',
    },
    trips: [
      {
        id: 'TRIP-2026-FIN-1',
        tripType: 'financial_advisory',
        title: 'استشارات مالية وحساب زكاة الشركات القابضة 2026',
        destination: 'الرياض (برج المملكة - المقر الرئيسي)',
        travelDate: '2026-10-10',
        guestsCount: 1,
        flightDetails: 'انتقال داخلي بالرياض',
        hotelName: 'لا يوجد - مقر الشركة',
        status: 'new',
        budgetOrPrice: '95,000 ر.س',
        notes: 'طلب تدقيق الزكاة والضريبة لـ 3 شركات تابعة قبل إغلاق الربع المالي.',
        createdAt: '2026-10-05T17:15:00Z',
      },
    ],
    totalTripsCount: 1,
    totalSpendEstimate: '95,000 ر.س',
    firstContactDate: '2026-10-05',
    lastContactDate: '2026-10-05',
    generalNotes: 'عميل شركات يمتلك محفظة استثمارية كبيرة ويبحث عن التوافق التام مع هيئة الزكاة ZATCA.',
  },
];

// Initial bookings matching initial profiles
const INITIAL_SEED_BOOKINGS: AdminBooking[] = [
  {
    id: 'BK-2026-001',
    createdAt: '2026-10-05T14:30:00Z',
    name: 'صاحب السمو الملكي الأمير فيصل بن ناصر',
    phone: '+966501112233',
    email: 'faisal.office@royalholding.sa',
    tripType: 'hajj',
    destination: 'مكة المكرمة والمشاعر المقدسة',
    serviceOrPackage: 'باقة الحج الملكي الميسور VIP',
    guestsCount: 4,
    travelDate: '2026-10-08',
    returnDate: '2026-10-18',
    flightDetails: 'صالة البيرق - طيران خاص Gulfstream G650',
    hotelName: 'برج الساعة - بنتهاوس مطل مباشرة على الكعبة',
    status: 'confirmed',
    isArchived: false,
    notes: 'تم تأكيد التنسيق الأمني والسيارات المصفحة VIP وتوفير مرشد ديني خاص مرافق.',
    source: 'Google Ads (Search VIP)',
    campaign: 'hajj_royal_vip',
  },
  {
    id: 'BK-2026-002',
    createdAt: '2026-10-05T17:15:00Z',
    name: 'سعادة الأستاذ فهد عبدالله الدوسري',
    phone: '+966554443322',
    email: 'fahad@aldosari-capital.com',
    tripType: 'financial_advisory',
    destination: 'الرياض - المقر الرئيسي',
    serviceOrPackage: 'استشارات مالية وحساب زكاة الشركات القابضة',
    guestsCount: 1,
    travelDate: undefined,
    returnDate: undefined,
    flightDetails: 'اجتماع حضوري بمقر الشركة في برج المملكة بالرياض',
    hotelName: 'غير محدد',
    status: 'new',
    isArchived: false,
    notes: 'طلب تدقيق الزكاة والضريبة لـ 3 شركات تابعة قبل إغلاق الربع المالي.',
    source: 'Website Direct',
    campaign: 'zatca_corporate_advisory',
  },
  {
    id: 'BK-2026-003',
    createdAt: '2026-10-04T19:40:00Z',
    name: 'المهندس عبدالرحمن المنصور',
    phone: '+966567778899',
    email: 'a.mansour@techventures.sa',
    tripType: 'umrah',
    destination: 'مكة المكرمة',
    serviceOrPackage: 'باقة العمرة الميسرة التنفيذية',
    guestsCount: 2,
    travelDate: '2026-10-07',
    returnDate: '2026-10-11',
    flightDetails: 'الخطوط السعودية SV-1034 - درجة أولى',
    hotelName: 'جبل عمر جميرا مكة - جناح تنفيذي بانورامي',
    status: 'in_progress',
    isArchived: false,
    notes: 'تم إصدار تأشيرة ومواعيد الروضة الشريفة ونسقنا سيارة مرسيدس مايباخ للاستقبال.',
    source: 'Instagram Ads',
    campaign: 'umrah_executive_q4',
  },
  {
    id: 'BK-2026-004',
    createdAt: '2026-10-03T11:20:00Z',
    name: 'الشيخ خالد الراجحي وعائلته الكريمة',
    phone: '+966509998877',
    email: 'k.alrajhi@familyoffice.sa',
    tripType: 'umrah',
    destination: 'مكة المكرمة',
    serviceOrPackage: 'باقة العمرة الماسية الفاخرة',
    guestsCount: 6,
    travelDate: '2026-10-15',
    returnDate: '2026-10-22',
    flightDetails: 'طيران الرياض - درجة رجال الأعمال',
    hotelName: 'رافلز قصر مكة - فيلا خاصة',
    status: 'contacted',
    isArchived: false,
    notes: 'تم إرسال الكتيب الرقمي وعرض السعر المخصص، بانتظار تأكيد عدد الغرف للأطفال.',
    source: 'Brochure Download',
    campaign: 'brochure_lead_gen',
  },
];

/* =========================================================================
   CLIENT PROFILES API
   ========================================================================= */

export function getClientProfiles(): ClientProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_SEED_PROFILES));
      return INITIAL_SEED_PROFILES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading client profiles:', err);
    return INITIAL_SEED_PROFILES;
  }
}

export function saveClientProfiles(profiles: ClientProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('Error saving client profiles:', err);
  }
}

export function getClientProfileByPhone(phone: string): ClientProfile | undefined {
  const profiles = getClientProfiles();
  const cleanTarget = phone.replace(/[^0-9]/g, '');
  return profiles.find((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);
}

export function updateOrCreateClientProfile(profile: Partial<ClientProfile> & { name: string; phone: string }): ClientProfile[] {
  const profiles = getClientProfiles();
  const cleanTarget = profile.phone.replace(/[^0-9]/g, '');
  const existingIndex = profiles.findIndex((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);

  if (existingIndex >= 0) {
    // Update existing
    profiles[existingIndex] = {
      ...profiles[existingIndex],
      ...profile,
      lastContactDate: new Date().toISOString().split('T')[0],
      totalTripsCount: profiles[existingIndex].trips.length,
    };
  } else {
    // Create new
    const newProfile: ClientProfile = {
      id: `VIP-CLIENT-${Math.floor(100 + Math.random() * 900)}`,
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      tier: profile.tier || 'executive',
      tags: profile.tags || ['عميل جديد'],
      permanentPreferences: profile.permanentPreferences || {},
      trips: profile.trips || [],
      totalTripsCount: (profile.trips || []).length,
      firstContactDate: new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      generalNotes: profile.generalNotes || '',
    };
    profiles.unshift(newProfile);
  }

  saveClientProfiles(profiles);
  return profiles;
}

/**
 * Adds a new trip (Hajj, Umrah, Luxury Tourism, or Business) directly to an existing client profile
 */
export function addTripToClientProfile(
  phone: string,
  trip: Omit<TripRecord, 'id' | 'createdAt'>
): { updatedProfiles: ClientProfile[]; updatedBookings: AdminBooking[] } {
  const profiles = getClientProfiles();
  const cleanTarget = phone.replace(/[^0-9]/g, '');
  const profileIndex = profiles.findIndex((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);

  const newTrip: TripRecord = {
    ...trip,
    id: `TRIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  if (profileIndex >= 0) {
    profiles[profileIndex].trips.unshift(newTrip);
    profiles[profileIndex].totalTripsCount = profiles[profileIndex].trips.length;
    profiles[profileIndex].lastContactDate = new Date().toISOString().split('T')[0];
    saveClientProfiles(profiles);

    // Also insert into bookings table so it appears in active schedule/CRM
    const bookings = getAdminBookings();
    const newBooking: AdminBooking = {
      id: `BK-${newTrip.id}`,
      createdAt: newTrip.createdAt,
      name: profiles[profileIndex].name,
      phone: profiles[profileIndex].phone,
      email: profiles[profileIndex].email,
      tripType: newTrip.tripType,
      destination: newTrip.destination,
      serviceOrPackage: newTrip.title,
      guestsCount: newTrip.guestsCount,
      travelDate: newTrip.travelDate,
      returnDate: newTrip.returnDate,
      flightDetails: newTrip.flightDetails,
      hotelName: newTrip.hotelName,
      status: newTrip.status,
      isArchived: false,
      notes: newTrip.notes,
      source: 'حجز مباشر من الملف الدائم للعميل',
    };
    bookings.unshift(newBooking);
    saveAdminBookings(bookings);

    return { updatedProfiles: profiles, updatedBookings: bookings };
  }

  return { updatedProfiles: profiles, updatedBookings: getAdminBookings() };
}

/* =========================================================================
   BOOKINGS API
   ========================================================================= */

export function getAdminBookings(): AdminBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    const parsed: AdminBooking[] = JSON.parse(raw);

    // Sync any new submissions from localStorage backup
    const leadsBackupRaw = localStorage.getItem('maysora_leads_backup');
    if (leadsBackupRaw) {
      try {
        const leads: any[] = JSON.parse(leadsBackupRaw);
        let updated = false;
        leads.forEach((lead) => {
          const leadId = lead.id || `LEAD-${lead.phone.replace(/[^0-9]/g, '').slice(-6)}`;
          const exists = parsed.some((b) => b.id === leadId || (b.phone === lead.phone && b.createdAt === lead.isoDate));
          if (!exists) {
            parsed.unshift({
              id: leadId,
              createdAt: lead.isoDate || new Date().toISOString(),
              name: lead.name || 'عميل محتمل',
              phone: lead.phone || '',
              email: lead.email !== 'غير محدد' ? lead.email : undefined,
              tripType: lead.serviceOrPackage?.includes('حج')
                ? 'hajj'
                : lead.serviceOrPackage?.includes('عمرة')
                ? 'umrah'
                : lead.serviceOrPackage?.includes('سياحة')
                ? 'luxury_tourism'
                : 'financial_advisory',
              destination: lead.serviceOrPackage?.includes('سياحة') ? 'وجهة سياحية فاخرة' : 'مكة المكرمة',
              serviceOrPackage: lead.serviceOrPackage || 'حجز عام',
              status: 'new',
              isArchived: false,
              notes: lead.messageOrNotes !== 'لا توجد ملاحظات' ? lead.messageOrNotes : undefined,
              source: lead.utm_source ? `${lead.utm_source} / ${lead.source || 'Form'}` : (lead.source || 'Landing Page'),
              campaign: lead.utm_campaign,
            });
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }

    return parsed;
  } catch (err) {
    console.error('Error reading admin bookings:', err);
    return INITIAL_SEED_BOOKINGS;
  }
}

export function saveAdminBookings(bookings: AdminBooking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (err) {
    console.error('Error saving admin bookings:', err);
  }
}

export function updateBookingStatus(id: string, newStatus: BookingStatus): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
  saveAdminBookings(updated);
  return updated;
}

export function updateBookingDetails(id: string, updates: Partial<AdminBooking>): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, ...updates } : b));
  saveAdminBookings(updated);
  return updated;
}

export function toggleArchiveBooking(id: string): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, isArchived: !b.isArchived } : b));
  saveAdminBookings(updated);
  return updated;
}

export function deleteBooking(id: string): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.filter((b) => b.id !== id);
  saveAdminBookings(updated);
  return updated;
}

export function addNewAdminBooking(booking: Omit<AdminBooking, 'id' | 'createdAt' | 'isArchived'>): AdminBooking[] {
  const current = getAdminBookings();
  const newBooking: AdminBooking = {
    ...booking,
    id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    isArchived: false,
  };
  const updated = [newBooking, ...current];
  saveAdminBookings(updated);

  // Also ensure client profile exists or is updated
  updateOrCreateClientProfile({
    name: newBooking.name,
    phone: newBooking.phone,
    email: newBooking.email,
  });

  return updated;
}

/**
 * Exports client records to a clean UTF-8 CSV with BOM for full Excel Arabic support.
 */
export function exportBookingsToCSV(bookings: AdminBooking[]): void {
  const headers = [
    'رقم الحجز',
    'تاريخ الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'البريد الإلكتروني',
    'نوع الرحلة',
    'الوجهة',
    'الخدمة / الباقة',
    'تاريخ الوصول',
    'تاريخ المغادرة',
    'عدد الضيوف',
    'بيانات الطيران',
    'الفندق والأجنحة',
    'الحالة',
    'المصدر التسويقي',
    'ملاحظات إضافية',
  ];

  const statusMap: Record<BookingStatus, string> = {
    new: 'جديد',
    contacted: 'تم التواصل',
    confirmed: 'مؤكد',
    in_progress: 'جاري التنسيق',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };

  const tripTypeMap: Record<TripType, string> = {
    hajj: 'حج ملكي فاخر',
    umrah: 'عمرة VIP',
    luxury_tourism: 'سياحة وترفيه فاخر',
    business_travel: 'رحلة عمل واستثمار',
    financial_advisory: 'استشارات مالية وحساب زكاة',
  };

  const rows = bookings.map((b) => [
    `"${b.id}"`,
    `"${b.createdAt.split('T')[0]}"`,
    `"${(b.name || '').replace(/"/g, '""')}"`,
    `"${(b.phone || '').replace(/"/g, '""')}"`,
    `"${(b.email || '').replace(/"/g, '""')}"`,
    `"${tripTypeMap[b.tripType || 'umrah'] || 'عمرة VIP'}"`,
    `"${(b.destination || 'مكة المكرمة').replace(/"/g, '""')}"`,
    `"${(b.serviceOrPackage || '').replace(/"/g, '""')}"`,
    `"${b.travelDate || 'غير محدد'}"`,
    `"${b.returnDate || 'غير محدد'}"`,
    `"${b.guestsCount || 1}"`,
    `"${(b.flightDetails || '').replace(/"/g, '""')}"`,
    `"${(b.hotelName || '').replace(/"/g, '""')}"`,
    `"${statusMap[b.status] || b.status}"`,
    `"${(b.source || '').replace(/"/g, '""')}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `كشف_حجوزات_وعملاء_ميسورة_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
