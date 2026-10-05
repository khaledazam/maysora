export type Language = 'ar' | 'en';

export interface TranslationContent {
  nav: {
    home: string;
    services: string;
    whyUs: string;
    packages: string;
    financial: string;
    testimonials: string;
    contact: string;
    bookConsultation: string;
    languageName: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPackage: string;
    ctaConsultation: string;
    trustYears: string;
    trustYearsLabel: string;
    trustPilgrims: string;
    trustPilgrimsLabel: string;
    trustShariah: string;
    trustShariahLabel: string;
    trustAssets: string;
    trustAssetsLabel: string;
  };
  services: {
    sectionTag: string;
    title: string;
    subtitle: string;
    hajjTitle: string;
    hajjDesc: string;
    hajjFeatures: string[];
    finTitle: string;
    finDesc: string;
    finFeatures: string[];
    accTitle: string;
    accDesc: string;
    accFeatures: string[];
    learnMore: string;
  };
  whyUs: {
    sectionTag: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  packages: {
    sectionTag: string;
    title: string;
    subtitle: string;
    currency: string;
    bookNow: string;
    viewDetails: string;
    mostPopular: string;
    items: {
      id: string;
      name: string;
      category: string;
      price: string;
      duration: string;
      features: string[];
      hotel: string;
      flight: string;
      financialPerk: string;
    }[];
  };
  financialHub: {
    sectionTag: string;
    title: string;
    subtitle: string;
    consultingTitle: string;
    consultingDesc: string;
    consultingList: string[];
    accountingTitle: string;
    accountingDesc: string;
    accountingList: string[];
    calcTitle: string;
    calcSubtitle: string;
    calcInputWealth: string;
    calcInputYears: string;
    calcZakatDue: string;
    calcHajjTarget: string;
    calcMonthlySave: string;
    calcCta: string;
  };
  testimonials: {
    sectionTag: string;
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      comment: string;
      location: string;
      rating: number;
    }[];
  };
  contact: {
    sectionTag: string;
    title: string;
    subtitle: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formService: string;
    formMessage: string;
    formSubmit: string;
    serviceOptions: { value: string; label: string }[];
    whatsAppBtn: string;
    callUs: string;
    address: string;
    hours: string;
    successMessage: string;
  };
  modal: {
    bookingTitle: string;
    consultationTitle: string;
    close: string;
    confirmBtn: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    servicesHeader: string;
    legal: string;
    shariahBadge: string;
    rights: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  ar: {
    nav: {
      home: 'الرئيسية',
      services: 'خدماتنا',
      whyUs: 'لماذا ميسورة',
      packages: 'باقات الحج والعمرة',
      financial: 'الاستشارات والمحاسبة',
      testimonials: 'آراء عملائنا',
      contact: 'تواصل معنا',
      bookConsultation: 'استشارة مجانية',
      languageName: 'English',
    },
    hero: {
      badge: 'مكتب ميسورة المعتمد • فخامة إيمانية وثقة مالية',
      title: 'رحلة إيمانية مباركة..',
      titleHighlight: 'وثقة مالية مستدامة',
      subtitle: 'نجمع بين أرقام الفخامة في باقات الحج والعمرة الفاخرة والاحترافية العالية في الاستشارات المالية والمحاسبة المعتمدة المتوافقة مع الشريعة الإسلامية.',
      ctaPackage: 'حجز باقة الحج والعمرة',
      ctaConsultation: 'طلب استشارة مالية مجانية',
      trustYears: '+15',
      trustYearsLabel: 'عاماً من التميز والخبرة',
      trustPilgrims: '12,000+',
      trustPilgrimsLabel: 'حاج ومعتمر في ضيافتنا',
      trustShariah: '100%',
      trustShariahLabel: 'حلول متوافقة مع الشريعة',
      trustAssets: '+500M',
      trustAssetsLabel: 'ريال استشارات مالية وإدارة',
    },
    services: {
      sectionTag: 'خدماتنا الاستثنائية',
      title: 'منظومة متكاملة من الفخامة والخبرة المالية',
      subtitle: 'نقدم لعملائنا النخبة تجربة فريدة تدمج بين أرقى خدمات الضيافة الإيمانية وأعلى معايير الحوكمة والاستشارات المحاسبية.',
      hajjTitle: 'رحلات الحج والعمرة VIP',
      hajjDesc: 'باقات حصرية تضمن أرقى درجات الراحة في الفنادق الأبراج المواجهة للحرم مباشرة، مع طيران خاص وخدمات كونسيرج على مدار الساعة.',
      hajjFeatures: [
        'إقامة في فنادق 5 نجوم صف أول على الحرم',
        'مخيمات فاخرة في المشاعر المقدسة (VIP)',
        'تنقلات خاصة بسيارات فارهة وسائق خاص',
        'مرشد ديني ومساعد شخصي على مدار 24 ساعة'
      ],
      finTitle: 'الاستشارات المالية وإدارة الثروات',
      finDesc: 'تخطيط مالي استراتيجي وحلول استثمارية متوافقة تماماً مع أحكام الشريعة الإسلامية لحماية وتنمية ثروات الأفراد والشركات.',
      finFeatures: [
        'تخطيط مالي مخصص لكبار الشخصيات',
        'حساب وإدارة الزكاة والأوقاف الإسلامية',
        'دراسات الجدوى والهيكلة المالية للشركات',
        'حلول الادخار والاستثمار لرحلات الحج المستقبلي'
      ],
      accTitle: 'الخدمات المحاسبية وحوكمة الشركات',
      accDesc: 'إدارة محاسبية دقيقة، تدقيق حسابات، وإعداد القوائم المالية المعتمدة وفق المعايير الدولية والأنظمة المحلية.',
      accFeatures: [
        'مسك الدفاتر وإعداد القوائم المالية الدورية',
        'الاقرارات الزكوية والضريبية المعتمدة',
        'التدقيق والرقابة المحاسبية الداخلية',
        'استشارات التكلفة والتخطيط المالي المؤسسي'
      ],
      learnMore: 'تفاصيل الخدمة',
    },
    whyUs: {
      sectionTag: 'لماذا ميسورة؟',
      title: 'معايير النخبة في كل تفصيل',
      subtitle: 'نتميز بالجمع الفريد بين السكينة الإيمانية والدقة المالية المحترفة لنضمن لك راحة البال الكاملة.',
      items: [
        {
          title: 'رفاهية استثنائية وباقات خاصة',
          desc: 'نصمم باقات سفر حصرية تلبي تطلعات كبار الشخصيات مع الاهتمام بأصغر التفاصيل.'
        },
        {
          title: 'حلول مالية شريعة 100%',
          desc: 'جميع استشاراتنا وحلولنا المالية والمحاسبية مراجعة من قبل هيئات شرعية معتمدة.'
        },
        {
          title: 'شفافية وأمان محاسبي كامل',
          desc: 'نضمن لك الدقة والشفافية التامة في الإدارة المحاسبية والتقارير الزكوية.'
        },
        {
          title: 'خدمة كونسيرج على مدار 24/7',
          desc: 'فريق متخصص متواجد دائماً لخدمتك في مكة المكرمة والمدينة المنورة ومقراتنا.'
        },
        {
          title: 'تحالفات مع كبرى شركات الطيران والفنادق',
          desc: 'أولوية الحجز في أرقى الأبراج وأجنحة الحرم بالتعاون مع أفخم السلاسل العالمية.'
        },
        {
          title: 'توجيه إيماني ومالي مخصص',
          desc: 'نرافقك بمرشدين دينيين ومستشارين ماليين لضمان رحلة مباركة وتخطيط مالي آمن.'
        }
      ]
    },
    packages: {
      sectionTag: 'باقاتنا الملكية',
      title: 'باقات الحج والعمرة المصممة للنخبة',
      subtitle: 'اختر الباقة التي تناسب تطلعاتك واحظى بتجربة لا تُنسى في رحاب بيت الله الحرام.',
      currency: 'ر.س',
      bookNow: 'احجز الباقة الآن',
      viewDetails: 'عرض تفاصيل الباقة',
      mostPopular: 'الأكثر طلباً للنخبة',
      items: [
        {
          id: 'exec-umrah',
          name: 'باقة العمرة التنفيذية',
          category: 'عمرة فاخرة',
          price: '18,500',
          duration: '7 أيام / 6 ليالٍ',
          hotel: 'فندق فيرمونت برج الساعة مكة (إطلالة Haram)',
          flight: 'طيران درجة رجال الأعمال',
          financialPerk: 'تتضمن استشارة زكوية وتخطيط مالي مجاني',
          features: [
            'إقامة مطلة مباشرة على الكعبة المشرفة',
            'استقبال وتوديع خاص في المطار بسيارة VIP',
            'بوفيه مفتوح إفطار وعشاء فاخر',
            'مزارات خاصة بسيارة فارهة مع مرشد',
            'استشارة زكوية وتخطيط مالي مجاني'
          ]
        },
        {
          id: 'royal-hajj',
          name: 'باقة الحج الملكية VIP',
          category: 'حج النخبة',
          price: '65,000',
          duration: '12 يوماً',
          hotel: 'أجنحة قصر المشرق / دار التوحيد مكة',
          flight: 'طيران خاص أو درجة أولى',
          financialPerk: 'خدمة محاسبية وتدقيق زكوي سنوي شامل',
          features: [
            'مخيمات ملكية خاصة ومكيفة بالكامل في منى وعرفة',
            'بوفيهات عالمية تحت إشراف أشهر الطهاة',
            'طبيب خاص ومرافق ديني مخصص للباقة',
            'تنقلات بسيارات خاصة ذاتية القيادة أو مع سائق',
            'خدمة مراجعة وحساب زكاة المال والأصول مجاناً'
          ]
        },
        {
          id: 'imperial-custom',
          name: 'باقة ميسورة الإمبراطورية',
          category: 'باقة مخصصة بالكامل',
          price: 'حسب الطلب',
          duration: 'مرنة حسب رغبتك',
          hotel: 'أفخم الأجنحة الملكية الخاصة في مكة والمدينة',
          flight: 'طيران خاص خالي من قيود المواعيد',
          financialPerk: 'إدارة مالية كاملة لثروة الأسرة والأوقاف',
          features: [
            'تخصيص كامل لكافة تفاصيل الرحلة',
            'طائرة خاصة ومروحيات لنقل المشاعر',
            'فريق خدمة كامل (سائق، طباخ، مرشد، حارس)',
            'استشارات مالية ومحاسبية مفتوحة لمدة عام كامل',
            'إدارة الأوقاف والصدقات الجارية متوافقة مع الشريعة'
          ]
        }
      ]
    },
    financialHub: {
      sectionTag: 'المكتب المالي والمحاسبي',
      title: 'استشارات مالية ومحاسبة احترافية متوافقة مع الشريعة',
      subtitle: 'نضع خبرتنا العريقة في خدمة استثماراتك وتدقيقك المحاسبي مع الالتزام التام بأحكام الفقه الإسلامي.',
      consultingTitle: 'قسم الاستشارات المالية وإدارة الثروات',
      consultingDesc: 'نساعد كبار رجال الأعمال والشركات في بناء استراتيجيات مالية صلبة وتحقيق النمو المستدام.',
      consultingList: [
        'تخطيط واستراتيجيات إدارة الثروات العائلية',
        'حساب وتقييم الزكاة الشرعية للأصول والاستثمارات',
        'تأسيس وإدارة الأوقاف والكيانات الخيرية',
        'دراسات التقييم المالي والاندماج والاستحواذ'
      ],
      accountingTitle: 'قسم الخدمات المحاسبية والتدقيق',
      accountingDesc: 'خدمات محاسبية شاملة تضمن الامتثال التنظيمي والدقة التامة للقوائم المالية.',
      accountingList: [
        'إعداد ومراجعة القوائم المالية السنوية والشهرية',
        'تقديم الإقرارات الضريبية والزكوية لهيئة الزكاة والضريبة والجمارك',
        'تصميم وتنفيذ أنظمة الرقابة المحاسبية الداخلية',
        'خدمات الفحص النافي للجهالة والتدقيق المحاسبي'
      ],
      calcTitle: 'حاسبة الادخار والتخطيط المالي للحج والزكاة',
      calcSubtitle: 'أداة تفاعلية لحساب تقديري لزكاة مالك وتخطيط الادخار المستقبلي لرحلة الحج المباركة',
      calcInputWealth: 'إجمالي الثروة / الأموال النقدية والأصول (ر.س):',
      calcInputYears: 'سنوات التخطيط لرحلة الحج المستهدفة:',
      calcZakatDue: 'مقدار الزكاة الشرعية الواجبة (2.5%):',
      calcHajjTarget: 'المبلغ المقدر لباقة الحج الملكية:',
      calcMonthlySave: 'الادخار الشهر الموصى به للرحلة:',
      calcCta: 'احجز استشارة مالية مفصلة مع مستشارينا',
    },
    testimonials: {
      sectionTag: 'شهادات نعتز بها',
      title: 'ماذا يقول عملاؤنا عن ميسورة',
      subtitle: 'آراء وشهادات نخبة من حجاجنا وعملائنا في الخدمات المالية والمحاسبية.',
      items: [
        {
          name: 'الشيخ عبد الرحمن السديري',
          role: 'رجل أعمال - الرياض',
          comment: 'تجربة الحج مع ميسورة كانت فوق التوقعات. الفخامة والتنظيم في الحرم والمشاعر، بالإضافة إلى الاستشارة المالية الزكوية التي قدموها لشركتي كانت بمُنتهى الاحترافية.',
          location: 'الرياض، المملكة العربية السعودية',
          rating: 5
        },
        {
          name: 'د. خالد بن سلطان آل ثاني',
          role: 'مستثمر - الدوحة',
          comment: 'خدمة الكونسيرج والطيران الخاص في عمرة رمضان كانت استثنائية. يعاملون العملاء براحة مطلقة ودقة متناهية. مكتب ميسورة هو خياري الدائم.',
          location: 'الدوحة، قطر',
          rating: 5
        },
        {
          name: 'المهندس طارق منصور',
          role: 'رئيس مجلس إدارة شركة عقارية',
          comment: 'اعتمدنا مكتب ميسورة لإعادة هيكلة الحسابات وإعداد الإقرار الزكوي لشركتنا، وكانت النتيجة دقة عالية وفرت علينا الكثير وضمنت امتثالنا الشرعي.',
          location: 'جدة، المملكة العربية السعودية',
          rating: 5
        }
      ]
    },
    contact: {
      sectionTag: 'تواصل مع النخبة',
      title: 'نحن هنا لخدمتك ورعاية رحلتك واستثماراتك',
      subtitle: 'تواصل مع مستشارينا المتخصصين للحصول على ترتيبات خاصة أو استشارة مالية ومحاسبية.',
      formName: 'الاسم الكامل',
      formEmail: 'البريد الإلكتروني',
      formPhone: 'رقم الجوال (مع رمز الدولة)',
      formService: 'نوع الخدمة المطلوبة',
      formMessage: 'تفاصيل الطلب أو الاستفسار',
      formSubmit: 'إرسال الطلب لمستشار ميسورة',
      serviceOptions: [
        { value: 'hajj-umrah', label: 'حجز باقة حج أو عمرة VIP' },
        { value: 'financial-consulting', label: 'استشارة مالية وإدارة ثروات' },
        { value: 'accounting-zakat', label: 'خدمات محاسبية وحساب زكاة' },
        { value: 'all-services', label: 'باقة خدمات شاملة (سفر + مالية)' }
      ],
      whatsAppBtn: 'محادثات WhatsApp المباشرة (خدمة 24/7)',
      callUs: 'اتصل بنا مباشرة',
      address: 'طريق الملك فهد، البرج المالي، الرياض | فرع مكة: أبراج البيت',
      hours: 'من الأحد إلى الخميس: 9:00 صباحاً - 6:00 مساءً (دعم الطوارئ 24/7)',
      successMessage: 'تم استلام طلبك بنجاح! سيتواصل معك مستشار ميسورة الخاص خلال ساعات قليلة.'
    },
    modal: {
      bookingTitle: 'تأكيد حجز الباقة / الاستشارة',
      consultationTitle: 'طلب استشارة مالية ومحاسبية مجانية',
      close: 'إغلاق',
      confirmBtn: 'تأكيد وإرسال البيانات'
    },
    footer: {
      tagline: 'مكتب ميسورة • الرفيق الأمثل لرحلتك الإيمانية والشريك الأوثق لاستثماراتك المالية والمحاسبية.',
      quickLinks: 'روابط سريعة',
      servicesHeader: 'خدماتنا الرئيسية',
      legal: 'الشروط والأحكام • سياسة الخصوصية • الترخيص الهيئة العامة للأوقاف والحج',
      shariahBadge: 'معتمد ومراجع من الهيئة الشرعية والمحاسبية الدولية',
      rights: 'جميع الحقوق محفوظة © MAYSORA 2026'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      whyUs: 'Why MAYSORA',
      packages: 'Packages',
      financial: 'Financial & Accounting',
      testimonials: 'Testimonials',
      contact: 'Contact Us',
      bookConsultation: 'Free Consultation',
      languageName: 'العربية',
    },
    hero: {
      badge: 'MAYSORA Certified • Sacred Pilgrimage & Financial Trust',
      title: 'A Sacred Journey.',
      titleHighlight: 'Complete Financial Trust.',
      subtitle: 'Blending ultra-luxury Hajj & Umrah hospitality with Shariah-compliant financial advisory, wealth planning, and accredited accounting services.',
      ctaPackage: 'Book Luxury Package',
      ctaConsultation: 'Request Free Consultation',
      trustYears: '+15',
      trustYearsLabel: 'Years of Excellence & Mastery',
      trustPilgrims: '12,000+',
      trustPilgrimsLabel: 'VIP Pilgrims Hosted',
      trustShariah: '100%',
      trustShariahLabel: 'Shariah-Compliant Solutions',
      trustAssets: '+$500M',
      trustAssetsLabel: 'Assets Advisory & Management',
    },
    services: {
      sectionTag: 'Our Core Offerings',
      title: 'An Integrated Ecosystem of Luxury & Financial Mastery',
      subtitle: 'Providing elite clientele with unparalleled spiritual comfort alongside top-tier financial governance and accounting precision.',
      hajjTitle: 'VIP Hajj & Umrah Pilgrimage',
      hajjDesc: 'Exclusive packages offering front-row suites directly facing the Holy Kaaba, private jet arrangements, and 24/7 dedicated concierge.',
      hajjFeatures: [
        '5-Star luxury hotel suites with direct Kaaba view',
        'Royal private camps at Mina & Arafat (VIP)',
        'Chauffeur-driven luxury fleet transfers',
        '24/7 Private spiritual guide & personal assistant'
      ],
      finTitle: 'Financial Consulting & Wealth Management',
      finDesc: 'Strategic financial planning, wealth preservation, and investment strategies tailored to Islamic Shariah principles for high-net-worth clients.',
      finFeatures: [
        'Bespoke private wealth planning for executives',
        'Calculations & governance for Zakat & Islamic Endowments',
        'Corporate financial restructuring & feasibility studies',
        'Dedicated savings & investment programs for future Hajj'
      ],
      accTitle: 'Accounting & Corporate Governance',
      accDesc: 'Meticulous bookkeeping, certified auditing, and tax/Zakat reporting in full compliance with international standards and Saudi ZATCA.',
      accFeatures: [
        'Financial statements preparation & auditing',
        'Zakat & tax compliance reporting (ZATCA compliant)',
        'Internal accounting controls & risk management',
        'Cost optimization & institutional financial advisory'
      ],
      learnMore: 'Service Details',
    },
    whyUs: {
      sectionTag: 'Why Choose MAYSORA',
      title: 'Elite Standards in Every Single Detail',
      subtitle: 'Uniting spiritual tranquility with rigorous financial expertise to guarantee absolute peace of mind.',
      items: [
        {
          title: 'Unmatched Luxury & VIP Customization',
          desc: 'We craft bespoke travel itineraries tailored specifically to the highest expectations of global leaders.'
        },
        {
          title: '100% Shariah-Compliant Financial Solutions',
          desc: 'All our advisory frameworks are audited and certified by recognized Islamic jurisprudence scholars.'
        },
        {
          title: 'Complete Financial & Accounting Transparency',
          desc: 'Guaranteed precision in financial statements, Zakat audit trails, and tax compliance.'
        },
        {
          title: '24/7 Dedicated VIP Concierge',
          desc: 'A dedicated team stationed in Makkah, Madinah, and our regional corporate headquarters.'
        },
        {
          title: 'Exclusive Alliances with Luxury Airlines & Hotels',
          desc: 'Priority access to front-line suites in Abraj Al Bait and global luxury hospitality chains.'
        },
        {
          title: 'Personalized Spiritual & Financial Guidance',
          desc: 'Accompanied by qualified Islamic scholars and senior financial strategists.'
        }
      ]
    },
    packages: {
      sectionTag: 'Royal Pilgrimage Packages',
      title: 'Hajj & Umrah Tailored for Executive Leaders',
      subtitle: 'Select the package that elevates your sacred journey to the pinnacle of comfort and spiritual focus.',
      currency: 'SAR',
      bookNow: 'Book Package Now',
      viewDetails: 'View Full Itinerary',
      mostPopular: 'Most Preferred by VIPs',
      items: [
        {
          id: 'exec-umrah',
          name: 'Executive Umrah Suite',
          category: 'Luxury Umrah',
          price: '18,500',
          duration: '7 Days / 6 Nights',
          hotel: 'Fairmont Makkah Clock Royal Tower (Kaaba View)',
          flight: 'Business Class Flights Included',
          financialPerk: 'Includes complimentary Zakat & wealth advisory',
          features: [
            'Panoramic suite overlooking the Holy Kaaba',
            'VIP airport greeting & private luxury transfer',
            'Gourmet full-board dining experience',
            'Private guided Ziyarat tours',
            'Complimentary financial & Zakat consultation'
          ]
        },
        {
          id: 'royal-hajj',
          name: 'Royal VIP Hajj Package',
          category: 'Elite Hajj',
          price: '65,000',
          duration: '12 Days',
          hotel: 'Dar Al Tawhid InterContinental Makkah',
          flight: 'First Class / Private Jet Options',
          financialPerk: 'Annual corporate accounting & Zakat review',
          features: [
            'Private air-conditioned royal tent suite in Mina & Arafat',
            'World-class private culinary chefs',
            'Dedicated medical doctor & private scholar',
            'Private luxury SUV throughout the holy sites',
            'Full annual corporate Zakat & asset calculation service'
          ]
        },
        {
          id: 'imperial-custom',
          name: 'MAYSORA Imperial Custom',
          category: 'Fully Bespoke Experience',
          price: 'Bespoke Quote',
          duration: 'Flexible Duration',
          hotel: 'Royal Private Palaces in Makkah & Madinah',
          flight: 'Chartered Private Jet Scheduling',
          financialPerk: 'Complete multi-family office & endowment management',
          features: [
            'Complete custom itinerary design',
            'Private helicopter transfer between holy sites',
            'Full dedicated staff (Chauffeur, Chef, Escort, Butler)',
            'Unlimited financial & accounting consultations for 1 year',
            'Shariah-compliant endowment (Waqf) structuring'
          ]
        }
      ]
    },
    financialHub: {
      sectionTag: 'Financial & Accounting Hub',
      title: 'Professional Advisory & Accounting Services',
      subtitle: 'Deploying deep institutional experience to safeguard your assets and ensure absolute regulatory and Shariah compliance.',
      consultingTitle: 'Financial Consulting & Wealth Advisory',
      consultingDesc: 'Assisting business owners and high-net-worth individuals in building resilient financial strategies.',
      consultingList: [
        'Family office wealth preservation & succession planning',
        'Zakat evaluation & optimization for diverse asset classes',
        'Structuring Islamic endowments (Waqf) & charitable trusts',
        'M&A financial valuation & corporate restructuring'
      ],
      accountingTitle: 'Accounting & Auditing Division',
      accountingDesc: 'Full spectrum accounting solutions delivering rigorous accuracy and compliance.',
      accountingList: [
        'Monthly & annual financial statement preparation & auditing',
        'ZATCA tax & Zakat return filing & representation',
        'Design & implementation of internal financial controls',
        'Due diligence financial audit services'
      ],
      calcTitle: 'Zakat & Hajj Financial Savings Estimator',
      calcSubtitle: 'An interactive calculator to estimate your Shariah Zakat due and plan future Hajj pilgrimage savings.',
      calcInputWealth: 'Total Net Liquid Wealth & Assets (SAR):',
      calcInputYears: 'Target Hajj Savings Horizon (Years):',
      calcZakatDue: 'Estimated Annual Shariah Zakat (2.5%):',
      calcHajjTarget: 'Estimated Royal Hajj Package Budget:',
      calcMonthlySave: 'Recommended Monthly Hajj Savings:',
      calcCta: 'Book a Detailed Consultation with Our Senior Advisor',
    },
    testimonials: {
      sectionTag: 'Client Testimonials',
      title: 'What Our Esteemed Clients Say',
      subtitle: 'Hear from our VIP pilgrims and corporate financial consulting clients.',
      items: [
        {
          name: 'Sheikh Abdulrahman Al-Sudairi',
          role: 'Business Owner - Riyadh',
          comment: 'My Hajj journey with MAYSORA exceeded every expectation. The luxury in Makkah combined with their top-tier Zakat financial consulting for my firm made them indispensable.',
          location: 'Riyadh, KSA',
          rating: 5
        },
        {
          name: 'Dr. Khaled Bin Sultan Al-Thani',
          role: 'Investor - Doha',
          comment: 'The private concierge and private flight service during Ramadan Umrah was exceptional. MAYSORA treats clients with absolute dignity and flawless precision.',
          location: 'Doha, Qatar',
          rating: 5
        },
        {
          name: 'Eng. Tareq Mansour',
          role: 'Chairman of Real Estate Group',
          comment: 'We appointed MAYSORA for corporate accounting restructuring and Zakat auditing. Their precision saved us significant capital while keeping us 100% Shariah compliant.',
          location: 'Jeddah, KSA',
          rating: 5
        }
      ]
    },
    contact: {
      sectionTag: 'Connect With Our Executives',
      title: 'Dedicated to Serving Your Sacred Journey & Investments',
      subtitle: 'Reach out to our specialized advisors for bespoke pilgrimage arrangements or financial consulting.',
      formName: 'Full Name',
      formEmail: 'Email Address',
      formPhone: 'Phone Number (with Country Code)',
      formService: 'Service Required',
      formMessage: 'Your Requirements / Message',
      formSubmit: 'Submit Request to MAYSORA Advisor',
      serviceOptions: [
        { value: 'hajj-umrah', label: 'VIP Hajj or Umrah Package' },
        { value: 'financial-consulting', label: 'Financial Consulting & Wealth Management' },
        { value: 'accounting-zakat', label: 'Accounting Services & Zakat Auditing' },
        { value: 'all-services', label: 'Integrated Services (Travel + Financial)' }
      ],
      whatsAppBtn: 'Direct 24/7 WhatsApp Executive Concierge',
      callUs: 'Call Corporate Hotline',
      address: 'King Fahd Road, Financial Tower, Riyadh | Makkah Branch: Abraj Al Bait',
      hours: 'Sun - Thu: 9:00 AM - 6:00 PM (24/7 Emergency Support)',
      successMessage: 'Thank you! Your request has been received. A senior MAYSORA advisor will contact you within hours.'
    },
    modal: {
      bookingTitle: 'Confirm Package / Service Inquiry',
      consultationTitle: 'Request Free Financial Consultation',
      close: 'Close',
      confirmBtn: 'Submit Request'
    },
    footer: {
      tagline: 'MAYSORA • Your premier companion for sacred pilgrimage and trusted partner for financial & accounting excellence.',
      quickLinks: 'Quick Links',
      servicesHeader: 'Our Services',
      legal: 'Terms & Conditions • Privacy Policy • Ministry of Hajj & Endowment License',
      shariahBadge: 'Certified & Audited by International Islamic Jurisprudence & Accounting Board',
      rights: 'All Rights Reserved © MAYSORA 2026'
    }
  }
};
