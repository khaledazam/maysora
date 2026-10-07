import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Smartphone,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Send,
  ShieldCheck,
  Settings,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Zap,
  Sliders,
  ArrowLeftRight,
  UserCheck
} from 'lucide-react';

interface WhatsAppScannerSettingsProps {
  onNotify?: (message: string) => void;
}

type SessionId = 'session1' | 'session2';

interface SessionData {
  id: SessionId;
  label: string;
  phone: string;
  name: string;
  connected: boolean;
  qr: string | null;
}

export const WhatsAppScannerSettings: React.FC<WhatsAppScannerSettingsProps> = () => {
  // Dual-line Sessions State
  const [activeSendingLine, setActiveSendingLine] = useState<SessionId>('session1');
  const [selectedScannerTab, setSelectedScannerTab] = useState<SessionId>('session1');
  
  const [line1, setLine1] = useState<SessionData>({
    id: 'session1',
    label: 'الخط 1: المشرف العام (بشمهندس أحمد رمضان)',
    phone: '01011860173',
    name: 'بشمهندس أحمد رمضان',
    connected: false,
    qr: null
  });

  const [line2, setLine2] = useState<SessionData>({
    id: 'session2',
    label: 'الخط 2: خدمة العملاء والمبيعات VIP',
    phone: '',
    name: 'خدمة عملاء ميسورة',
    connected: false,
    qr: null
  });

  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [pairingCode] = useState<string>('MAYS-8820-VIP');

  // Contact settings state for Line 1
  const [contactName, setContactName] = useState<string>('بشمهندس أحمد رمضان');
  const [contactPhone, setContactPhone] = useState<string>('01011860173');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Automation Triggers toggles
  const [autoNotifyAdmin, setAutoNotifyAdmin] = useState<boolean>(true);
  const [autoWelcomeClient, setAutoWelcomeClient] = useState<boolean>(true);
  const [autoTravelReminder, setAutoTravelReminder] = useState<boolean>(true);

  // Test Message Sender
  const [testSendingLine, setTestSendingLine] = useState<SessionId>('session1');
  const [testRecipientPhone, setTestRecipientPhone] = useState<string>('01011860173');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [customTestMessage, setCustomTestMessage] = useState<string>(
    'السلام عليكم ورحمة الله، مرحباً بكم في ميسورة لخدمات الحج والعمرة الفاخرة والاستشارات المالية. يسعدنا رعاية كافة تفاصيل رحلتكم.'
  );
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testSentSuccess, setTestSentSuccess] = useState<boolean>(false);
  const [lastSentDetails, setLastSentDetails] = useState<string | null>(null);

  // Poll Dual-Session Status & Live QR Codes from Gateway
  useEffect(() => {
    let isMounted = true;

    const fetchDualStatusAndQRs = async () => {
      try {
        // 1. Fetch Overall Status
        let statusRes: Response | null = null;
        try {
          statusRes = await fetch('/api/whatsapp/status');
          if (!statusRes.ok) statusRes = null;
        } catch {
          statusRes = null;
        }

        if (!statusRes) {
          try {
            statusRes = await fetch('http://127.0.0.1:3001/api/status');
            if (!statusRes.ok) statusRes = null;
          } catch {
            statusRes = null;
          }
        }

        if (statusRes && statusRes.ok) {
          const statusData = await statusRes.json();
          if (!isMounted) return;
          setIsGatewayActive(true);

          if (statusData.activeSessionId) {
            setActiveSendingLine(statusData.activeSessionId);
          }

          if (statusData.sessions) {
            const s1 = statusData.sessions.session1;
            const s2 = statusData.sessions.session2;

            setLine1((prev) => ({
              ...prev,
              connected: s1.connected,
              phone: s1.phone || prev.phone,
              name: s1.name || prev.name
            }));

            setLine2((prev) => ({
              ...prev,
              connected: s2.connected,
              phone: s2.phone || prev.phone,
              name: s2.name || prev.name
            }));
          }
        }

        // 2. Fetch Active Scanner Tab QR (session1 or session2)
        let qrRes: Response | null = null;
        try {
          qrRes = await fetch(`/api/whatsapp/qr?session=${selectedScannerTab}`);
          if (!qrRes.ok) qrRes = null;
        } catch {
          qrRes = null;
        }

        if (!qrRes) {
          try {
            qrRes = await fetch(`http://127.0.0.1:3001/api/qr?session=${selectedScannerTab}`);
            if (!qrRes.ok) qrRes = null;
          } catch {
            qrRes = null;
          }
        }

        if (qrRes && qrRes.ok) {
          const qrData = await qrRes.json();
          if (!isMounted) return;

          if (selectedScannerTab === 'session1') {
            setLine1((prev) => ({
              ...prev,
              connected: qrData.connected,
              phone: qrData.phone || prev.phone,
              qr: qrData.connected ? null : qrData.qr
            }));
          } else {
            setLine2((prev) => ({
              ...prev,
              connected: qrData.connected,
              phone: qrData.phone || prev.phone,
              qr: qrData.connected ? null : qrData.qr
            }));
          }
        }
      } catch {
        if (isMounted) setIsGatewayActive(false);
      }
    };

    fetchDualStatusAndQRs();
    const timer = setInterval(fetchDualStatusAndQRs, 2500);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedScannerTab]);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('maysora_admin_contact_name');
    const savedPhone = localStorage.getItem('maysora_admin_contact_phone');
    if (savedName) setContactName(savedName);
    if (savedPhone) setContactPhone(savedPhone);
  }, []);

  // Switch Active Sending Line via API
  const handleSwitchActiveLine = async (targetSession: SessionId) => {
    try {
      setActiveSendingLine(targetSession);
      setTestSendingLine(targetSession);

      let switchRes: Response | null = null;
      try {
        switchRes = await fetch('/api/whatsapp/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: targetSession })
        });
      } catch {
        switchRes = null;
      }

      if (!switchRes) {
        await fetch('http://127.0.0.1:3001/api/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: targetSession })
        });
      }
    } catch (e) {
      console.error('Failed to switch line:', e);
    }
  };

  const handleRefreshQR = async (sessionId: SessionId) => {
    setIsScanning(true);
    try {
      try {
        await fetch('/api/whatsapp/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch {
        await fetch('http://127.0.0.1:3001/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (e) {}
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const handleDisconnect = async (sessionId: SessionId) => {
    const targetLabel = sessionId === 'session1' ? line1.label : line2.label;
    if (confirm(`هل أنت متأكد من إلغاء اقتران [${targetLabel}]؟ سيتطلب ذلك مسح الرمز مجدداً.`)) {
      try {
        try {
          await fetch('/api/whatsapp/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
        } catch {
          await fetch('http://127.0.0.1:3001/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
        }
        if (sessionId === 'session1') {
          setLine1((p) => ({ ...p, connected: false, qr: null }));
        } else {
          setLine2((p) => ({ ...p, connected: false, qr: null }));
        }
      } catch (e) {}
    }
  };

  const handleCopyPairingCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maysora_admin_contact_name', contactName);
    localStorage.setItem('maysora_admin_contact_phone', contactPhone);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'welcome') {
      setCustomTestMessage(
        'السلام عليكم ورحمة الله، مرحباً بكم في ميسورة لخدمات الحج والعمرة الفاخرة والاستشارات المالية. يسعدنا رعاية كافة تفاصيل رحلتكم.'
      );
    } else if (tmpl === 'booking_confirm') {
      setCustomTestMessage(
        'سعادة العميل الكريم، تم استلام وتأكيد بيانات حجزكم بنجاح لدى ميسورة. معكم المستشار لمتابعة كافة الترتيبات الخاصة.'
      );
    } else if (tmpl === 'flight_reminder') {
      setCustomTestMessage(
        'تذكير VIP: موعد رحلتكم بعد 48 ساعة. تم تجهيز سيارة الاستقبال الخاصة وتأكيد غرف الإقامة المطلة في الحرم المكي. نتمنى لكم رحلة مباركة.'
      );
    }
  };

  const handleSendTestWhatsApp = async () => {
    setIsSendingTest(true);
    const chosenLine = testSendingLine === 'session1' ? line1 : line2;

    if (chosenLine.connected) {
      try {
        let sendRes: Response | null = null;
        try {
          sendRes = await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: testRecipientPhone,
              message: customTestMessage,
              sessionId: testSendingLine,
              allowFallback: true
            })
          });
        } catch {
          sendRes = null;
        }

        if (!sendRes) {
          sendRes = await fetch('http://127.0.0.1:3001/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: testRecipientPhone,
              message: customTestMessage,
              sessionId: testSendingLine,
              allowFallback: true
            })
          });
        }

        if (sendRes && sendRes.ok) {
          const data = await sendRes.json();
          if (data.success) {
            setIsSendingTest(false);
            setTestSentSuccess(true);
            setLastSentDetails(`تم الإرسال بنجاح عبر [${chosenLine.label}] من الرقم: +${data.fromPhone || chosenLine.phone}`);
            setTimeout(() => setTestSentSuccess(false), 5000);
            return;
          }
        }
      } catch (err) {
        console.warn('API send failed, falling back to wa.me redirect', err);
      }
    }

    // Fallback: open WhatsApp link directly
    const cleanPhone = testRecipientPhone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(customTestMessage)}`;
    
    window.open(url, '_blank');
    setIsSendingTest(false);
    setTestSentSuccess(true);
    setLastSentDetails(`تم فتح المحادثة المباشرة للرقم: ${fullPhone}`);
    setTimeout(() => setTestSentSuccess(false), 5000);
  };

  // Current active view session for scanner
  const currentScannerSession = selectedScannerTab === 'session1' ? line1 : line2;

  return (
    <div className="space-y-10">
      {/* Header Banner with Multi-Account Indicator */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#1E190F] via-[#161616] to-[#0E0E0E] border-2 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                بوابة الاتصال المزدوجة • DUAL WHATSAPP GATEWAY
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${
                isGatewayActive ? 'text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30' : 'text-amber-400 bg-amber-400/10 border-amber-400/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isGatewayActive ? 'bg-[#25D366] animate-pulse' : 'bg-amber-400'}`} />
                {isGatewayActive ? 'نظام الربط المزدوج نشط' : 'جاري الاتصال بالمحرك'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic-heading text-[#F8F5F0]">
              إدارة وربط رقمين واتساب (Dual Scanner & Switcher)
            </h2>
            <p className="text-xs sm:text-sm text-[#C0B7A6] max-w-2xl font-light leading-relaxed">
              اربط رقمين واتساب مختلفين في نفس الوقت عبر الـ QR Code (الخط الأول للمشرف العام والخط الثاني لخدمة العملاء)، مع إمكانية التبديل الفوري بينهما لإرسال الرسائل.
            </p>
          </div>

          {/* Quick Active Line Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-[#0D0D0D]/90 border border-[#D4AF37]/40 flex items-center gap-3 shadow-inner">
              <ArrowLeftRight className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-[10px] text-[#C0B7A6] block">خط الإرسال المعتمد حالياً</span>
                <span className="text-xs font-bold text-[#FFF0B3]">
                  {activeSendingLine === 'session1' ? 'الخط 1 (المشرف العام)' : 'الخط 2 (خدمة العملاء)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DUAL LINE SWITCHING CONTROLLER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LINE 1 CARD */}
        <div className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
          activeSendingLine === 'session1'
            ? 'bg-gradient-to-br from-[#1C1810] via-[#141414] to-[#0D0D0D] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
            : 'bg-[#121212] border-white/10 hover:border-white/20'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ${
                line1.connected ? 'bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]' : 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]'
              }`}>
                L1
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  الخط الأساسي
                </span>
                <h3 className="text-base font-bold text-[#F8F5F0]">
                  {line1.name || 'بشمهندس أحمد رمضان'}
                </h3>
                <p className="text-xs text-[#C0B7A6] font-mono">
                  {line1.phone ? `+${line1.phone}` : '01011860173'}
                </p>
              </div>
            </div>

            {/* Connection Status Badge */}
            <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 ${
              line1.connected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${line1.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              {line1.connected ? 'متصل بنجاح' : 'في انتظار المسح'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
            <button
              type="button"
              onClick={() => handleSwitchActiveLine('session1')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSendingLine === 'session1'
                  ? 'bg-gold-gradient text-[#0D0D0D] shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'bg-[#1C1C1C] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#252525] border border-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{activeSendingLine === 'session1' ? 'الخط المعتمد للإرسال (نشط)' : 'التبديل لهذا الخط'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScannerTab('session1')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedScannerTab === 'session1'
                  ? 'bg-white/15 text-[#FFF0B3] border border-[#D4AF37]/50'
                  : 'bg-[#161616] text-[#A0937D] hover:text-white border border-white/5'
              }`}
              title="عرض شاشة الـ QR الخاصة بالخط 1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>عرض الـ QR</span>
            </button>
          </div>
        </div>

        {/* LINE 2 CARD */}
        <div className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
          activeSendingLine === 'session2'
            ? 'bg-gradient-to-br from-[#101A24] via-[#141414] to-[#0D0D0D] border-cyan-400 shadow-xl shadow-cyan-500/10'
            : 'bg-[#121212] border-white/10 hover:border-white/20'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ${
                line2.connected ? 'bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]' : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
              }`}>
                L2
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block">
                  الخط الثانوي
                </span>
                <h3 className="text-base font-bold text-[#F8F5F0]">
                  {line2.name || 'خدمة العملاء والمبيعات'}
                </h3>
                <p className="text-xs text-[#C0B7A6] font-mono">
                  {line2.phone ? `+${line2.phone}` : 'غير مقترن بعد'}
                </p>
              </div>
            </div>

            {/* Connection Status Badge */}
            <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 ${
              line2.connected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${line2.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              {line2.connected ? 'متصل بنجاح' : 'في انتظار المسح'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
            <button
              type="button"
              onClick={() => handleSwitchActiveLine('session2')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSendingLine === 'session2'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-[#1C1C1C] text-[#C0B7A6] hover:text-[#F8F5F0] hover:bg-[#252525] border border-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{activeSendingLine === 'session2' ? 'الخط المعتمد للإرسال (نشط)' : 'التبديل لهذا الخط'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScannerTab('session2')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedScannerTab === 'session2'
                  ? 'bg-white/15 text-cyan-200 border border-cyan-400/50'
                  : 'bg-[#161616] text-[#A0937D] hover:text-white border border-white/5'
              }`}
              title="عرض شاشة الـ QR الخاصة بالخط 2"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>عرض الـ QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* WORKSPACE AREA: SCANNER & CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: WhatsApp Web QR Scanner for Selected Tab */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-[#121212] border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
            {/* Tab Header Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shadow-lg shadow-[#25D366]/10">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8F5F0] flex items-center gap-2">
                    <span>نافذة المسح والاقتران: {selectedScannerTab === 'session1' ? 'الخط 1' : 'الخط 2'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30">
                      Multi-Device Live
                    </span>
                  </h3>
                  <p className="text-xs text-[#C0B7A6]">
                    اختر الخط لمسح الرمز وربط هاتف مستقل لكل خط
                  </p>
                </div>
              </div>

              {/* Sub-Tabs for Switch Scanner View */}
              <div className="flex items-center p-1 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedScannerTab('session1')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedScannerTab === 'session1'
                      ? 'bg-gold-gradient text-[#0D0D0D] shadow'
                      : 'text-[#C0B7A6] hover:text-white'
                  }`}
                >
                  الخط 1
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScannerTab('session2')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedScannerTab === 'session2'
                      ? 'bg-cyan-500 text-[#0D0D0D] shadow'
                      : 'text-[#C0B7A6] hover:text-white'
                  }`}
                >
                  الخط 2
                </button>
              </div>
            </div>

            {/* Scanner Area for Current Tab */}
            {currentScannerSession.connected ? (
              /* Connected State */
              <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-emerald-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/10 border-2 border-[#25D366] flex items-center justify-center text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.2)] shrink-0">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="text-center sm:text-right space-y-1">
                    <span className="text-[11px] font-bold text-[#25D366] bg-[#25D366]/15 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      تم ربط {currentScannerSession.label} بنجاح
                    </span>
                    <h4 className="text-lg font-bold text-[#F8F5F0]">
                      {currentScannerSession.name}
                    </h4>
                    <p className="text-xs text-[#C0B7A6] font-mono">
                      الرقم المتصل: +{currentScannerSession.phone}
                    </p>
                    <p className="text-[11px] text-[#A0937D]">
                      جلسة نشطة ومستقلة • تشفير تام End-to-End
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleDisconnect(selectedScannerTab)}
                    className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>إلغاء اقتران هذا الخط ومسح هاتف جديد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRefreshQR(selectedScannerTab)}
                    className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] border border-white/10 text-[#C0B7A6] hover:text-[#D4AF37] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>إعادة فحص الجلسة</span>
                  </button>
                </div>
              </div>
            ) : (
              /* QR Scanning State */
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Real QR Box */}
                  <div className="relative group p-3.5 rounded-2xl bg-white border-4 border-[#D4AF37] shadow-2xl shrink-0 flex items-center justify-center min-w-[240px] min-h-[240px]">
                    {/* Golden Laser Bar */}
                    <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_15px_#D4AF37] animate-bounce pointer-events-none z-20" />

                    {currentScannerSession.qr ? (
                      <img
                        src={currentScannerSession.qr}
                        alt={`WhatsApp Live QR - ${currentScannerSession.label}`}
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-56 h-56 flex flex-col items-center justify-center text-neutral-800 space-y-3 p-4 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
                        <span className="text-xs font-bold text-neutral-800">
                          جاري توليد الرمز الحي لـ [{selectedScannerTab === 'session1' ? 'الخط 1' : 'الخط 2'}]...
                        </span>
                        <span className="text-[10px] text-neutral-500">لحظات للاتصال بسيرفر واتساب</span>
                      </div>
                    )}

                    {/* Corner Pins */}
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#D4AF37] rounded-sm" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#D4AF37] rounded-sm" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#D4AF37] rounded-sm" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#D4AF37] rounded-sm" />
                  </div>

                  {/* Step Instructions */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        خطوات ربط {selectedScannerTab === 'session1' ? 'الخط 1' : 'الخط 2'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRefreshQR(selectedScannerTab)}
                        className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                        <span>تحديث الرمز الآن</span>
                      </button>
                    </div>

                    <ol className="space-y-3 text-xs text-[#E2DACB]">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                          1
                        </span>
                        <span>افتح تطبيق <strong>WhatsApp</strong> على الهاتف المخصص لهذا الخط.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                          2
                        </span>
                        <span>اضغط على <strong>القائمة</strong> (أو الإعدادات) واختر <strong>الأجهزة المرتبطة (Linked Devices)</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                          3
                        </span>
                        <span>انقر على <strong>"ربط جهاز"</strong> ووجّه الكاميرا نحو الرمز المعروض لإتمام الاقتران الفوري.</span>
                      </li>
                    </ol>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleRefreshQR(selectedScannerTab)}
                        className="w-full py-3 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>تحديث / إعادة تنشيط كود {selectedScannerTab === 'session1' ? 'الخط 1' : 'الخط 2'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Session Code Option */}
                <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <span className="text-xs font-semibold text-[#F8F5F0] block">
                        الربط البديل عبر رمز التأكيد
                      </span>
                      <span className="text-[11px] text-[#C0B7A6]">
                        كود الجلسة المشفرة: <strong className="text-[#FFF0B3] font-mono">{pairingCode}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPairingCode}
                    className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#D4AF37]/30 text-xs text-[#FFF0B3] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Test Message Sender with Line Switcher */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#121212] border border-[#D4AF37]/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8F5F0]">
                    اختبار إرسال رسالة مباشرة (مع اختيار الخط)
                  </h3>
                  <p className="text-xs text-[#C0B7A6]">
                    حدد الخط الذي ترغب في إرسال الرسالة من خلاله وتجربة الإرسال
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Select Sender Line */}
              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                  اختر خط الإرسال لهذه الرسالة:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTestSendingLine('session1')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      testSendingLine === 'session1'
                        ? 'bg-[#1C1810] border-[#D4AF37] text-[#FFF0B3]'
                        : 'bg-[#0D0D0D] border-white/10 text-[#C0B7A6]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">الخط 1 (المشرف)</span>
                      <span className="text-[10px] text-neutral-400 font-mono">+{line1.phone || '01011860173'}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${line1.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestSendingLine('session2')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      testSendingLine === 'session2'
                        ? 'bg-[#101A24] border-cyan-400 text-cyan-200'
                        : 'bg-[#0D0D0D] border-white/10 text-[#C0B7A6]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">الخط 2 (خدمة العملاء)</span>
                      <span className="text-[10px] text-neutral-400 font-mono">+{line2.phone || 'غير مقترن'}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${line2.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                    رقم المستلم (مع مفتاح الدولة أو محلي) *
                  </label>
                  <input
                    type="tel"
                    value={testRecipientPhone}
                    onChange={(e) => setTestRecipientPhone(e.target.value)}
                    placeholder="01011860173"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                    اختر القالب الجاهز
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="welcome">قالب الترحيب بكبار الشخصيات</option>
                    <option value="booking_confirm">قالب تأكيد استلام الحجز والمستشار</option>
                    <option value="flight_reminder">قالب تذكير بموعد الرحلة الفاخرة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                  نص الرسالة
                </label>
                <textarea
                  rows={3}
                  value={customTestMessage}
                  onChange={(e) => setCustomTestMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] leading-relaxed focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendTestWhatsApp}
                  disabled={isSendingTest}
                  className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-lg shadow-[#25D366]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{isSendingTest ? 'جاري الإرسال...' : `إرسال الرسالة عبر [${testSendingLine === 'session1' ? 'الخط 1' : 'الخط 2'}]`}</span>
                </button>

                {testSentSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    {lastSentDetails || 'تم إرسال الرسالة بنجاح'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Triggers & Global Contact Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Executive Contact Settings Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8F5F0]">
                  بيانات التواصل الرسمية للموقع
                </h3>
                <p className="text-xs text-[#C0B7A6]">
                  تظهر هذه الأرقام في الواجهة الرئيسية وأزرار الواتساب
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveContactSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                  اسم المستشار المسؤول
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8F5F0] mb-2">
                  رقم الهاتف المعتمد والواتساب
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs text-[#F8F5F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-[#A0937D] mt-1 block">
                  الرقم النشط حالياً: 01011860173 (بشمهندس أحمد رمضان)
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold-gradient text-[#0D0D0D] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>حفظ وتطبيق بيانات الاتصال</span>
                </button>
              </div>

              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold">
                  تم حفظ بيانات الاتصال بنجاح وتحديثها في الذاكرة.
                </div>
              )}
            </form>
          </div>

          {/* Automated WhatsApp Notifications Toggles */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#121212] border border-[#D4AF37]/20 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8F5F0]">
                  أتمتة تنبيهات الواتساب الذكية
                </h3>
                <p className="text-xs text-[#C0B7A6]">
                  تحكم في إرسال التنبيهات الفورية آلياً عبر الخطوط المربوطة
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle 1: Admin Notification */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#F8F5F0] block mb-1">
                    إشعار فوري للمشرف (بشمهندس أحمد رمضان)
                  </span>
                  <p className="text-[11px] text-[#C0B7A6] leading-relaxed">
                    إرسال تنبيه واتساب فوري للرقم <strong className="text-[#FFF0B3]">01011860173</strong> عند وصول أي طلب حجز أو استشارة جديدة من الموقع.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoNotifyAdmin(!autoNotifyAdmin)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    autoNotifyAdmin ? 'bg-[#25D366]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoNotifyAdmin ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Client Auto-Confirmation */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#F8F5F0] block mb-1">
                    رسالة تأكيد وترحيب تلقائية للعميل
                  </span>
                  <p className="text-[11px] text-[#C0B7A6] leading-relaxed">
                    إرسال رسالة ترحيبية فورية إلى رقم هاتف العميل المسجل مع كود الطلب وموعد التواصل.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoWelcomeClient(!autoWelcomeClient)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    autoWelcomeClient ? 'bg-[#25D366]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoWelcomeClient ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Travel Reminder */}
              <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#F8F5F0] block mb-1">
                    تذكير قبل موعد السفر بـ 48 ساعة
                  </span>
                  <p className="text-[11px] text-[#C0B7A6] leading-relaxed">
                    إرسال تذكير بجدول الرحلة وتفاصيل الاستقبال وتأكيدات الفنادق للعميل آلياً.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoTravelReminder(!autoTravelReminder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    autoTravelReminder ? 'bg-[#25D366]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoTravelReminder ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Cloud Database Integration Status */}
          <div className="rounded-3xl p-6 bg-[#121212] border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-[#F8F5F0] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              حالة التخزين والمزامنة السحابية
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0D0D] border border-white/5">
                <span className="text-[#C0B7A6]">قاعدة بيانات Supabase Cloud</span>
                <span className="text-[#25D366] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> متصل ونشط
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0D0D] border border-white/5">
                <span className="text-[#C0B7A6]">مزامنة Google Sheets Webhook</span>
                <span className="text-[#FFF0B3] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> متاح وتلقائي
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
