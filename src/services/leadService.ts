/**
 * Service to handle customer inquiries and lead submissions.
 * Sends leads to Google Sheets via Webhook (Google Apps Script)
 * and stores a resilient local backup in localStorage.
 */

import { getAttributionData, trackEvent } from './analytics';
import { syncBookingToSupabase } from './supabaseClient';

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  serviceOrPackage?: string;
  messageOrNotes?: string;
  source: 'Booking Modal' | 'Contact Section' | 'Package Customizer';
  lang?: string;
}

export async function submitLeadToGoogleSheets(data: LeadData): Promise<{ success: boolean; message?: string }> {
  // Configured via .env: VITE_GOOGLE_SHEETS_WEBHOOK_URL
  const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  const utmAttribution = getAttributionData();

  const payload = {
    ...data,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || 'غير محدد',
    serviceOrPackage: data.serviceOrPackage || 'استفسار عام',
    messageOrNotes: data.messageOrNotes?.trim() || 'لا توجد ملاحظات',
    timestampRiyadh: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }),
    isoDate: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    ...utmAttribution,
  };

  // Trigger conversion event in Analytics & Pixels
  trackEvent('lead_submitted', {
    source: data.source,
    service: payload.serviceOrPackage,
    lang: data.lang,
  });

  // 1. Send to Google Sheets if Webhook URL is configured
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      // mode: 'no-cors' prevents CORS issues with Google Apps Script web apps
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn('[Notice] تعذر الإرسال الفوري إلى Google Sheets، تم حفظ الطلب محلياً:', error);
    }
  }

  // 2. Send to Supabase Cloud Database
  try {
    await syncBookingToSupabase({
      id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: payload.isoDate,
      name: payload.name,
      phone: payload.phone,
      email: payload.email !== 'غير محدد' ? payload.email : undefined,
      tripType: payload.serviceOrPackage?.includes('حج')
        ? 'hajj'
        : payload.serviceOrPackage?.includes('عمرة')
        ? 'umrah'
        : payload.serviceOrPackage?.includes('سياحة')
        ? 'luxury_tourism'
        : 'financial_advisory',
      destination: payload.serviceOrPackage?.includes('سياحة') ? 'وجهة سياحية فاخرة' : 'مكة المكرمة',
      serviceOrPackage: payload.serviceOrPackage,
      status: 'new',
      isArchived: false,
      notes: payload.messageOrNotes !== 'لا توجد ملاحظات' ? payload.messageOrNotes : undefined,
      source: utmAttribution.utm_source ? `${utmAttribution.utm_source} / ${payload.source}` : payload.source,
      campaign: utmAttribution.utm_campaign,
    });
  } catch (err) {
    // Silently continue if offline
  }

  // 3. Always persist a local backup in localStorage so zero leads are ever lost
  try {
    const existing = JSON.parse(localStorage.getItem('maysora_leads_backup') || '[]');
    existing.unshift(payload);
    localStorage.setItem('maysora_leads_backup', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.error('LocalStorage backup error:', err);
  }

  return { success: true, message: 'تم استلام بياناتك بنجاح' };
}
