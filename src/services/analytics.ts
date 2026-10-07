/**
 * Marketing & Conversion Tracking Service
 * Supports Google Analytics 4 (gtag), Meta Pixel (fbq), and Snapchat Pixel (snaptr)
 * with graceful fallback and UTM attribution extraction.
 */

// Initialize analytics scripts if environment variables are provided
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
  const snapPixelId = import.meta.env.VITE_SNAPCHAT_PIXEL_ID;

  // 1. Google Analytics 4
  if (gaId && !document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      // @ts-ignore
      window.dataLayer.push(args);
    }
    // @ts-ignore
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, { send_page_view: true });
  }

  // 2. Meta Pixel (Facebook / Instagram)
  if (metaPixelId && !(window as any).fbq) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    (window as any).fbq('init', metaPixelId);
    (window as any).fbq('track', 'PageView');
    /* eslint-enable */
  }

  // 3. Snapchat Pixel
  if (snapPixelId && !(window as any).snaptr) {
    /* eslint-disable */
    (function(e: any, t: any, n: any) {
      if (e.snaptr) return;
      var a: any = (e.snaptr = function() {
        a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
      });
      a.queue = [];
      var s = 'script';
      var r = t.createElement(s);
      r.async = !0;
      r.src = n;
      var u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, 'https://sc-static.net/scevent.min.js');
    (window as any).snaptr('init', snapPixelId);
    (window as any).snaptr('track', 'PAGE_VIEW');
    /* eslint-enable */
  }

  // Save UTM parameters to sessionStorage on first arrival
  extractAndStoreUTMParams();
}

/**
 * Extract UTM and marketing parameters from URL query params
 */
export function extractAndStoreUTMParams() {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utmData: Record<string, string> = {};
    const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'sclickid'];

    trackedKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        utmData[key] = val;
      }
    });

    if (Object.keys(utmData).length > 0) {
      sessionStorage.setItem('maysora_utm_attribution', JSON.stringify(utmData));
    }
  } catch {
    // Ignore storage issues
  }
}

/**
 * Retrieve saved UTM attribution for lead logging
 */
export function getAttributionData(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem('maysora_utm_attribution');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Track Marketing Conversion Event
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  const payload = {
    ...params,
    timestamp: new Date().toISOString(),
    ...getAttributionData(),
  };

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, payload);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (eventName === 'lead_submitted') {
      (window as any).fbq('track', 'Lead', payload);
    } else if (eventName === 'whatsapp_click') {
      (window as any).fbq('trackCustom', 'WhatsAppInquiry', payload);
    } else {
      (window as any).fbq('trackCustom', eventName, payload);
    }
  }

  // Snapchat Pixel
  if (typeof window !== 'undefined' && (window as any).snaptr) {
    if (eventName === 'lead_submitted') {
      (window as any).snaptr('track', 'SIGN_UP', payload);
    } else {
      (window as any).snaptr('track', 'CUSTOM_EVENT', { custom_event_name: eventName, ...payload });
    }
  }

  // In development, log tracked event
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event: ${eventName}]`, payload);
  }
}
