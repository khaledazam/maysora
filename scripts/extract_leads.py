import os
import sys
import time
import requests
import pandas as pd
from pathlib import Path

# Force UTF-8 encoding on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Load environment variables from .env manually to avoid extra dependencies
def load_env():
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = value

load_env()

API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY') or os.environ.get('GOOGLE_MAPS_API_KEY') or ''

def search_places(query, api_key):
    """
    Search places using Google Places Text Search API
    """
    endpoint_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    places = []
    
    params = {
        'query': query,
        'key': api_key,
        'language': 'ar'
    }
    
    try:
        response = requests.get(endpoint_url, params=params, timeout=15)
        data = response.json()
        
        status = data.get('status')
        if status != 'OK' and status != 'ZERO_RESULTS':
            print(f"[!] خطأ في استجابة جوجل لـ '{query}': {status} - {data.get('error_message', '')}")
            return []
            
        places.extend(data.get('results', []))
        
        # Next page token if available
        next_page = data.get('next_page_token')
        page_count = 1
        while next_page and page_count < 3:
            time.sleep(2)  # Google requires a short delay before next_page_token is valid
            page_params = {
                'pagetoken': next_page,
                'key': api_key,
                'language': 'ar'
            }
            res = requests.get(endpoint_url, params=page_params, timeout=15).json()
            if res.get('status') == 'OK':
                places.extend(res.get('results', []))
                next_page = res.get('next_page_token')
                page_count += 1
            else:
                break
    except Exception as e:
        print(f"[!] حدث استثناء أثناء البحث: {e}")
        
    return places

def get_place_details(place_id, api_key):
    """
    Fetch complete contact details for a specific place
    """
    endpoint_url = "https://maps.googleapis.com/maps/api/place/details/json"
    fields = "name,formatted_phone_number,international_phone_number,website,formatted_address,rating,user_ratings_total,url"
    
    params = {
        'place_id': place_id,
        'fields': fields,
        'key': api_key,
        'language': 'ar'
    }
    
    try:
        res = requests.get(endpoint_url, params=params, timeout=15).json()
        if res.get('status') == 'OK':
            return res.get('result', {})
    except Exception as e:
        print(f"[!] حدث خطأ أثناء جلب تفاصيل النشاط {place_id}: {e}")
        
    return {}

def run_extraction(api_key, queries=None, output_filename="maysoura_leads.xlsx"):
    if not api_key:
        print("[!] خطأ: مفتاح Google Places API غير متوفر.")
        print("يرجى إضافة GOOGLE_PLACES_API_KEY في ملف .env أو تمريره كمعامل للسكريبت.")
        return False
        
    if not queries:
        queries = [
            "شركات سياحة وحج وعمرة في القاهرة",
            "شركات سياحة في الجيزة",
            "شركات سياحة في الإسكندرية",
            "شركات سياحة وحج وعمرة في الرياض",
            "وكالات سفر وسياحة في جدة"
        ]
        
    all_leads = []
    seen_phones = set()
    seen_names = set()
    
    print("=" * 60)
    print("🚀 بدء استخراج بيانات العملاء والشركات لمشروع ميسورا للحج والعمرة")
    print(f"📌 عدد الكلمات المستهدفة: {len(queries)}")
    print("=" * 60)
    
    for q_idx, query in enumerate(queries, 1):
        print(f"\n🔍 ({q_idx}/{len(queries)}) جاري البحث عن: '{query}'...")
        places = search_places(query, api_key)
        print(f"✅ تم العثور على {len(places)} نشاط.")
        
        for idx, p in enumerate(places, 1):
            place_id = p.get('place_id')
            if not place_id:
                continue
                
            details = get_place_details(place_id, api_key)
            name = details.get('name') or p.get('name', 'بدون اسم')
            phone_intl = details.get('international_phone_number') or details.get('formatted_phone_number') or ''
            
            # Filter duplicates
            identifier = phone_intl if phone_intl else name
            if identifier in seen_phones or identifier in seen_names:
                continue
                
            if phone_intl:
                seen_phones.add(phone_intl)
            seen_names.add(name)
            
            lead_info = {
                'اسم النشاط / الشركة': name,
                'رقم الهاتف الدولي': phone_intl,
                'رقم الهاتف المحلي': details.get('formatted_phone_number', ''),
                'الموقع الإلكتروني': details.get('website', ''),
                'العنوان': details.get('formatted_address', p.get('formatted_address', '')),
                'التقييم': details.get('rating', p.get('rating', '')),
                'عدد المراجعات': details.get('user_ratings_total', p.get('user_ratings_total', '')),
                'رابط خرائط جوجل': details.get('url', ''),
                'كلمة البحث المستهدفة': query
            }
            
            all_leads.append(lead_info)
            phone_display = phone_intl if phone_intl else "لا يوجد هاتف مسجل"
            print(f"  [{idx}/{len(places)}] {name} 📞 {phone_display}")
            time.sleep(0.15)
            
    if not all_leads:
        print("\n[!] لم يتم استخراج أي بيانات. يرجى التأكد من صلاحية المفتاح والكلمات المفتاحية.")
        return False
        
    # Export to Excel and CSV
    df = pd.DataFrame(all_leads)
    
    output_path = Path(__file__).resolve().parent.parent / output_filename
    csv_path = output_path.with_suffix('.csv')
    
    df.to_excel(output_path, index=False)
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    
    print("\n" + "=" * 60)
    print(f"🎉 تم الانتهاء بنجاح!")
    print(f"📁 إجمالي جهات الاتصال المستخرجة: {len(df)}")
    print(f"📊 تم حفظ الملف في:")
    print(f"   - Excel: {output_path}")
    print(f"   - CSV:   {csv_path}")
    print("=" * 60)
    return True

if __name__ == "__main__":
    key = API_KEY
    if len(sys.argv) > 1 and sys.argv[1].strip():
        key = sys.argv[1].strip()
        
    if not key:
        print("=" * 60)
        print("⚠️ مفتاح API غير موجود!")
        print("طرق التشغيل المتاحة:")
        print("1. أضف المفتاح في ملف .env: GOOGLE_PLACES_API_KEY=AIzaSy...")
        print("2. أو شغّل الأمر مباشرة:")
        print("   py scripts/extract_leads.py YOUR_API_KEY")
        print("=" * 60)
    else:
        run_extraction(key)
