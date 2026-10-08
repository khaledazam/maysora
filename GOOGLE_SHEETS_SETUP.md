# دليل ربط تسجيل عملاء ميسورا بـ Google Sheets 📊

هذا الدليل يوضح كيفية ربط نماذج الموقع بجدول Google Sheets لاستقبال وتخزين بيانات العملاء وحجوزاتهم فورياً وبشكل مجاني 100%.

---

## خطوات التفعيل في دقيقتين:

### الخطوة 1: إنشاء شيت جديد
1. ادخل على [Google Sheets](https://sheets.google.com) وأنشئ جدولاً جديداً باسم: **عملاء واستشارات ميسورا - MAYSORA Leads**.

### الخطوة 2: فتح محرر البرمجة (Apps Script)
1. من القائمة العلوية داخل الجدول، اضغط على **ملحقات (Extensions)** ثم **Apps Script**.
2. امسح أي كود موجود في المحرر وضع الكود التالي بالكامل:

```javascript
/**
 * سكربت استقبال عملاء واستشارات ميسورا في Google Sheets
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // إذا كان الشيت جديداً، ننشئ رؤوس الأعمدة بتنسيق فخم
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "تاريخ ووقت الطلب (الرياض)",
        "اسم العميل",
        "رقم الجوال",
        "البريد الإلكتروني",
        "الباقة / الخدمة المطلوبة",
        "تفاصيل واستفسار العميل",
        "مصدر الطلب في الموقع",
        "لغة التصفح"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#0D0D0D");
      headerRange.setFontColor("#D4AF37");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setRowHeight(1, 35);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestampRiyadh || new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" }),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.serviceOrPackage || "",
      data.messageOrNotes || "",
      data.source || "",
      data.lang || "ar-sa"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### الخطوة 3: النشر كتطبيق ويب (Deploy as Web App)
1. في أعلى يمين شاشة Apps Script، اضغط على زر **نشر (Deploy)** ثم **نشر جديد (New deployment)**.
2. بجانب نوع النشر (Select type)، اختر **تطبيق ويب (Web app)** بالضغط على علامة الترس ⚙️.
3. اضبط الإعدادات التالية بدقة:
   - **الوصف (Description):** `MAYSORA Leads Webhook`
   - **تنفيذ باسم (Execute as):** `أنا (Me)`
   - **من يملك حق الوصول (Who has access):** **`أي شخص (Anyone)`** *(ضروري جداً لكي يستطيع الموقع إرسال البيانات دون تسجيل دخول)*.
4. اضغط **نشر (Deploy)**، وامنح الأذونات المطلوبة (Authorize access).
5. انسخ **رابط تطبيق الويب (Web App URL)** الذي يظهر لك.

### الخطوة 4: وضع الرابط في ملف `.env`
افتح ملف `.env` في المشروع وضع الرابط بجانب:
```env
VITE_GOOGLE_SHEETS_WEBHOOK_URL=ضع_الرابط_المنسوخ_هنا
```

---

> [!NOTE]
> الموقع مجهز أيضاً بنظام حماية تلقائي **(Local Backup)**، حيث يتم حفظ نسخة احتياطية من كل استفسار على متصفح الزائر حتى في حال انقطاع الإنترنت أو قبل إعداد السكربت.
