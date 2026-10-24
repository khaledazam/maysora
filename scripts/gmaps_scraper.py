import sys
import os
import time
import re
import urllib.parse
import pandas as pd
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

def init_driver(headless=True):
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--lang=ar-EG")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
    return webdriver.Chrome(options=options)

def clean_text(text):
    if not text:
        return ""
    # Remove private use area / icon characters and trim
    cleaned = re.sub(r'[\ue000-\uf8ff]', '', text)
    cleaned = cleaned.replace('\n', ' ').strip()
    return re.sub(r'\s+', ' ', cleaned)

def format_phone_and_whatsapp(raw_phone):
    cleaned = clean_text(raw_phone)
    digits_only = re.sub(r'[^\d+]', '', cleaned)
    
    formatted_phone = cleaned
    whatsapp_url = ""
    
    # Egypt mobile format: starts with 010, 011, 012, 015
    if re.match(r'^01[0125]\d{8}$', digits_only):
        wa_number = "2" + digits_only
        formatted_phone = f"+{wa_number}"
        whatsapp_url = f"https://wa.me/{wa_number}"
    elif digits_only.startswith("+201") and len(digits_only) == 13:
        wa_number = digits_only.replace("+", "")
        formatted_phone = digits_only
        whatsapp_url = f"https://wa.me/{wa_number}"
    elif digits_only.startswith("201") and len(digits_only) == 12:
        wa_number = digits_only
        formatted_phone = f"+{digits_only}"
        whatsapp_url = f"https://wa.me/{wa_number}"
    # Saudi mobile format: starts with 05
    elif re.match(r'^05\d{8}$', digits_only):
        wa_number = "966" + digits_only[1:]
        formatted_phone = f"+{wa_number}"
        whatsapp_url = f"https://wa.me/{wa_number}"
    elif digits_only.startswith("+9665"):
        wa_number = digits_only.replace("+", "")
        formatted_phone = digits_only
        whatsapp_url = f"https://wa.me/{wa_number}"
    elif digits_only:
        formatted_phone = digits_only
        
    return formatted_phone, whatsapp_url

def scroll_feed(driver, feed_element, target_count=30, max_scroll_attempts=15):
    """Scroll the search results feed to load more listings"""
    print("  ⏳ جاري تمرير القائمة لتحميل المزيد من الأنشطة...")
    last_count = 0
    attempts = 0
    
    while attempts < max_scroll_attempts:
        items = driver.find_elements(By.CSS_SELECTOR, "a.hfpxzc")
        current_count = len(items)
        if current_count >= target_count:
            break
            
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", feed_element)
        time.sleep(2)
        
        new_items = driver.find_elements(By.CSS_SELECTOR, "a.hfpxzc")
        if len(new_items) == last_count:
            attempts += 1
        else:
            attempts = 0
        last_count = len(new_items)
        
    return driver.find_elements(By.CSS_SELECTOR, "a.hfpxzc")

def extract_place_details(driver):
    details = {
        'name': '',
        'phone': '',
        'address': '',
        'website': '',
        'rating': '',
        'reviews_count': '',
        'category': '',
        'url': driver.current_url
    }
    
    # 1. Name
    try:
        h1 = driver.find_element(By.CSS_SELECTOR, "h1.DUwDvf")
        details['name'] = clean_text(h1.text)
    except Exception:
        pass
        
    # 2. Category
    try:
        cat = driver.find_element(By.CSS_SELECTOR, "button.DkEaL")
        details['category'] = clean_text(cat.text)
    except Exception:
        pass

    # 3. Rating & Reviews
    try:
        rating_el = driver.find_element(By.CSS_SELECTOR, "div.F7nice span[aria-hidden='true']")
        details['rating'] = clean_text(rating_el.text)
    except Exception:
        pass
        
    try:
        rev_el = driver.find_element(By.CSS_SELECTOR, "div.F7nice span:last-child")
        rev_text = clean_text(rev_el.text).replace("(", "").replace(")", "").replace(",", "")
        details['reviews_count'] = rev_text
    except Exception:
        pass

    # 4. Info items (Address, Phone, Website)
    info_buttons = driver.find_elements(By.CSS_SELECTOR, "button[data-item-id], a[data-item-id]")
    for btn in info_buttons:
        item_id = btn.get_attribute("data-item-id") or ""
        aria_label = btn.get_attribute("aria-label") or ""
        text = btn.text.strip()
        
        # Phone
        if "phone:" in item_id or "الهاتف" in aria_label or "phone" in aria_label.lower():
            phone_val = clean_text(text.replace("رقم الهاتف:", "").strip())
            if not phone_val and aria_label:
                digits = re.findall(r'[\+\d\s\-]{8,}', aria_label)
                if digits:
                    phone_val = clean_text(digits[0])
            details['phone'] = phone_val
            
        # Address
        elif "address" in item_id or "العنوان" in aria_label or "address" in aria_label.lower():
            addr_val = clean_text(text.replace("العنوان:", "").strip())
            if not addr_val and aria_label:
                addr_val = clean_text(aria_label.replace("العنوان:", "").replace("العنوان", "").strip())
            details['address'] = addr_val
            
        # Website
        elif "authority" in item_id or btn.tag_name == "a":
            href = btn.get_attribute("href")
            if href and "google.com" not in href:
                details['website'] = href

    # Fallback for phone regex in entire sidebar
    if not details['phone']:
        try:
            sidebar = driver.find_element(By.CSS_SELECTOR, "div[role='main']")
            sidebar_text = sidebar.text
            phones = re.findall(r'(?:\+?20|0)?1[0125]\d{8}|\+?966\d{8,9}|05\d{8}', sidebar_text)
            if phones:
                details['phone'] = phones[0]
        except Exception:
            pass

    return details

def scrape_query(driver, query, max_results=20):
    encoded_query = urllib.parse.quote(query)
    search_url = f"https://www.google.com/maps/search/{encoded_query}?hl=ar"
    print(f"\n🔍 فتح خرائط جوجل للبحث عن: '{query}'...")
    driver.get(search_url)
    
    # Wait for results or feed to load
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[role='feed'], a.hfpxzc"))
        )
    except Exception:
        print("[!] لم يتم العثور على نتائج للبحث أو تأخر التحميل.")
        return []
        
    # Scroll feed
    try:
        feed = driver.find_element(By.CSS_SELECTOR, "div[role='feed']")
        scroll_feed(driver, feed, target_count=max_results)
    except Exception:
        pass
        
    items = driver.find_elements(By.CSS_SELECTOR, "a.hfpxzc")
    print(f"📊 تم رصد {len(items)} نشاط في القائمة. جاري استخراج تفاصيل كل نشاط...")
    
    links = []
    for item in items[:max_results]:
        try:
            href = item.get_attribute("href")
            name = clean_text(item.get_attribute("aria-label") or "")
            if href:
                links.append((name, href))
        except Exception:
            pass
            
    results = []
    for idx, (name, href) in enumerate(links, 1):
        try:
            driver.get(href)
            time.sleep(1.8)
            
            details = extract_place_details(driver)
            if not details['name']:
                details['name'] = name
                
            formatted_phone, whatsapp_link = format_phone_and_whatsapp(details['phone'])
            
            lead = {
                'اسم النشاط / الشركة': details['name'],
                'رقم الهاتف': formatted_phone,
                'رابط واتساب مباشر': whatsapp_link,
                'العنوان': details['address'],
                'النشاط / التصنيف': details['category'],
                'التقييم': details['rating'],
                'عدد المراجعات': details['reviews_count'],
                'الموقع الإلكتروني': details['website'],
                'رابط خرائط جوجل': details['url'],
                'الكلمة المفتاحية': query
            }
            results.append(lead)
            phone_show = formatted_phone if formatted_phone else 'غير معلن'
            print(f"  [{idx}/{len(links)}] {details['name']} | 📞 {phone_show} | 📍 {details['address'][:35]}...")
        except Exception as e:
            print(f"  [!] خطأ في النشاط {idx}: {e}")
            
    return results

def main():
    queries = [
        "شركات سياحة وحج وعمرة في القاهرة",
        "شركات سياحة وحج وعمرة في الجيزة",
        "شركات سياحة في الإسكندرية"
    ]
    
    # Check if custom query from cmdline
    if len(sys.argv) > 1:
        queries = [sys.argv[1]]
        
    print("=" * 60)
    print("🚀 بدء الاستخراج التلقائي من خرائط جوجل بدون API")
    print("=" * 60)
    
    driver = init_driver(headless=True)
    all_leads = []
    
    try:
        for q in queries:
            leads = scrape_query(driver, q, max_results=20)
            all_leads.extend(leads)
    finally:
        driver.quit()
        
    if all_leads:
        df = pd.DataFrame(all_leads)
        # Drop duplicates by name
        df.drop_duplicates(subset=['اسم النشاط / الشركة'], inplace=True)
        
        output_excel = Path(__file__).resolve().parent.parent / "maysoura_leads.xlsx"
        output_csv = Path(__file__).resolve().parent.parent / "maysoura_leads.csv"
        
        df.to_excel(output_excel, index=False)
        df.to_csv(output_csv, index=False, encoding='utf-8-sig')
        
        print("\n" + "=" * 60)
        print(f"🎉 تم استخراج {len(df)} جهة اتصال وحفظها بنجاح!")
        print(f"📁 ملف الإكسل: {output_excel}")
        print(f"📁 ملف CSV:    {output_csv}")
        print("=" * 60)
    else:
        print("[!] لم يتم العثور على بيانات.")

if __name__ == "__main__":
    main()
