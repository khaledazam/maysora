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
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Convert Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard English numerals (0123456789)
ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"
ENGLISH_DIGITS = "0123456789"
NUM_TRANS = str.maketrans(ARABIC_DIGITS, ENGLISH_DIGITS)

def normalize_text(text):
    if not text:
        return ""
    # Convert numerals
    text = text.translate(NUM_TRANS)
    # Remove excessive spaces
    return re.sub(r'\s+', ' ', text).strip()

def extract_phone_numbers(text):
    """
    Extract Egyptian and Saudi mobile phone numbers from comment text
    """
    cleaned = normalize_text(text)
    # Egyptian numbers: 010, 011, 012, 015 (11 digits)
    # Saudi numbers: 05... (10 digits)
    # International formats: +20..., +966...
    patterns = [
        r'(?:\+?20|0020)?\s*(?:0)?(1[0125][\d\s\-]{8,11}\d)',  # Egyptian mobile
        r'(?:\+?966|00966)?\s*(?:0)?(5[\d\s\-]{7,10}\d)',       # Saudi mobile
    ]
    
    found_phones = []
    for pat in patterns:
        matches = re.finditer(pat, cleaned)
        for m in matches:
            raw = m.group(0)
            # Remove spaces and dashes
            digits = re.sub(r'[^\d+]', '', raw)
            # Normalize to international format
            if re.match(r'^01[0125]\d{8}$', digits):
                found_phones.append("+2" + digits)
            elif re.match(r'^1[0125]\d{8}$', digits):
                found_phones.append("+20" + digits)
            elif re.match(r'^(?:20|0020)1[0125]\d{8}$', digits):
                norm = digits.replace("0020", "20")
                found_phones.append("+" + norm)
            elif re.match(r'^05\d{8}$', digits):
                found_phones.append("+966" + digits[1:])
            elif re.match(r'^(?:966|00966)5\d{8}$', digits):
                norm = digits.replace("00966", "966")
                found_phones.append("+" + norm)
                
    return list(set(found_phones))

def init_driver(profile_dir=None, headless=False):
    options = Options()
    if headless:
        options.add_argument("--headless=new")
        
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1280,900")
    options.add_argument("--disable-notifications")
    options.add_argument("--lang=ar-EG")
    
    # Persistent profile so user only logs into Facebook once
    if profile_dir:
        os.makedirs(profile_dir, exist_ok=True)
        options.add_argument(f"--user-data-dir={profile_dir}")
        
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
    return webdriver.Chrome(options=options)

def check_facebook_login(driver):
    """
    Check if currently logged into Facebook, or wait for user to log in
    """
    driver.get("https://www.facebook.com")
    time.sleep(3)
    
    # Check if login input or password input exists
    login_inputs = driver.find_elements(By.CSS_SELECTOR, "input[name='email'], input#email")
    if login_inputs:
        print("\n" + "=" * 60)
        print("🔐 تنبيه: المتصفح مفتوح الآن أمامك على شاشة تسجيل دخول فيسبوك.")
        print("يرجى تسجيل الدخول إلى حسابك على فيسبوك في نافذة المتصفح المفتوحة...")
        print("السكريبت ينتظر تسجيل الدخول تلقائياً للاستمرار...")
        print("=" * 60)
        
        # Wait until user logs in (up to 300 seconds)
        for _ in range(150):
            time.sleep(2)
            inputs = driver.find_elements(By.CSS_SELECTOR, "input[name='email'], input#email")
            if not inputs and "login" not in driver.current_url.lower():
                print("✅ تم رصد تسجيل الدخول بنجاح! جاري المتابعة...")
                time.sleep(3)
                return True
        print("[!] انتهت مهلة الانتظار لتسجيل الدخول.")
        return False
    else:
        print("✅ تم التحقق من تسجيل الدخول إلى فيسبوك مسبقاً.")
        return True

def extract_comments_from_current_page(driver, post_url=None):
    """
    Extract commenters, comments, and phones from the active post page
    """
    leads = []
    
    # Try expanding comments (clicking 'عرض المزيد من التعليقات' / 'View more comments')
    print("  ⏳ جاري توسيع وتحميل جميع التعليقات...")
    for _ in range(6):
        try:
            more_buttons = driver.find_elements(
                By.XPATH, 
                "//span[contains(text(), 'عرض المزيد من التعليقات') or contains(text(), 'View more comments') or contains(text(), 'تعليقات سابقة')]"
            )
            if not more_buttons:
                break
            for btn in more_buttons[:3]:
                driver.execute_script("arguments[0].click();", btn)
                time.sleep(1.5)
        except Exception:
            break
            
    # Scroll slightly to trigger comment renders
    driver.execute_script("window.scrollBy(0, 500);")
    time.sleep(1)
    
    # Facebook comments are usually inside role="article" or specific aria-labels
    comment_elements = driver.find_elements(By.XPATH, "//div[@role='article']")
    if not comment_elements:
        comment_elements = driver.find_elements(By.XPATH, "//ul//li")
        
    print(f"  📝 تم فحص {len(comment_elements)} عنصر تعليق...")
    
    for c_el in comment_elements:
        try:
            text = c_el.text
            if not text:
                continue
                
            phones = extract_phone_numbers(text)
            
            # If a phone number is detected, extract person's details
            if phones:
                # Find author name
                author_name = "عميل مهتم"
                profile_link = ""
                try:
                    author_el = c_el.find_element(By.XPATH, ".//a[contains(@href, 'facebook.com') or contains(@href, 'user')]")
                    author_name = author_el.text.strip().split('\n')[0]
                    profile_link = author_el.get_attribute("href")
                except Exception:
                    pass
                    
                for phone in phones:
                    wa_number = phone.replace("+", "")
                    leads.append({
                        'اسم العميل': author_name,
                        'رقم الهاتف': phone,
                        'رابط واتساب مباشر': f"https://wa.me/{wa_number}",
                        'نص التعليق / الاستفسار': normalize_text(text)[:150],
                        'رابط حساب العميل': profile_link,
                        'رابط المنشور': post_url or driver.current_url,
                        'تاريخ الاستخراج': time.strftime('%Y-%m-%d %H:%M')
                    })
        except Exception:
            continue
            
    return leads

def scrape_facebook_posts(driver, search_query, max_posts=5):
    """
    Search Facebook for posts matching the query and extract comments
    """
    encoded = urllib.parse.quote(search_query)
    search_url = f"https://www.facebook.com/search/posts/?q={encoded}"
    print(f"\n🔍 جاري البحث في فيسبوك عن: '{search_query}'...")
    driver.get(search_url)
    time.sleep(5)
    
    # Scroll down to load posts and comments on the search feed
    print("  ⏳ جاري التمرير وقراءة المنشورات والتعليقات المتاحة...")
    all_leads = []
    
    for scroll_idx in range(4):
        # Extract any comments / phone numbers already visible on this scroll position
        current_leads = extract_comments_from_current_page(driver, post_url=driver.current_url)
        all_leads.extend(current_leads)
        
        driver.execute_script("window.scrollBy(0, 1200);")
        time.sleep(2.5)
        
    # Also find post links to open individual high-engagement posts
    post_links = set()
    anchors = driver.find_elements(By.TAG_NAME, "a")
    for a in anchors:
        try:
            href = a.get_attribute("href") or ""
            if any(k in href for k in ['/posts/', '/permalink/', 'story_fbid', '/reel/', '/videos/']):
                if "facebook.com" in href and "search" not in href:
                    post_links.add(href.split('?')[0])
        except Exception:
            pass
            
    if post_links:
        print(f"📊 تم رصد {len(post_links)} منشور تفصيلي. جاري فحص التعليقات الداخلية...")
        for idx, url in enumerate(list(post_links)[:max_posts], 1):
            try:
                print(f"  [{idx}/{min(len(post_links), max_posts)}] فحص: {url[:60]}...")
                driver.get(url)
                time.sleep(3.5)
                leads = extract_comments_from_current_page(driver, post_url=url)
                all_leads.extend(leads)
            except Exception as e:
                print(f"  [!] تعذر فتح المنشور: {e}")
                
    return all_leads

def main():
    profile_path = str(Path(__file__).resolve().parent / "fb_browser_profile")
    
    print("=" * 60)
    print("🚀 سكريبت استخراج داتا عملاء أفراد من فيسبوك لمشروع ميسورا")
    print("=" * 60)
    
    # Check if arguments provided, or prompt user
    target_mode = "search"
    target_url = ""
    custom_query = ""
    
    if len(sys.argv) > 1:
        raw_arg = sys.argv[1].strip().strip('"').strip("'")
        if raw_arg.startswith("http") and not raw_arg.endswith("..."):
            target_mode = "single_url"
            target_url = raw_arg
        elif not raw_arg.startswith("http"):
            target_mode = "custom_search"
            custom_query = raw_arg
            
    driver = None
    try:
        driver = init_driver(profile_dir=profile_path, headless=False)
        logged_in = check_facebook_login(driver)
        if not logged_in:
            print("[!] لا يمكن المتابعة بدون تسجيل الدخول.")
            return
            
        all_leads = []
        
        if target_mode == "single_url":
            print(f"🎯 فحص مباشر لرابط المنشور: {target_url}")
            driver.get(target_url)
            time.sleep(4)
            all_leads = extract_comments_from_current_page(driver, post_url=target_url)
        else:
            queries = [
                custom_query if custom_query else "عمرة وحج مصر حجز",
                "عمرة شعبان ورجب أسعار",
                "تأشيرات عمرة وحج مصر"
            ]
            if custom_query:
                queries = [custom_query]
                
            for q in queries:
                try:
                    leads = scrape_facebook_posts(driver, q, max_posts=3)
                    all_leads.extend(leads)
                except Exception as e:
                    print(f"[!] خطأ أثناء البحث عن {q}: {e}")
                    
        if all_leads:
            df = pd.DataFrame(all_leads)
            df.drop_duplicates(subset=['رقم الهاتف'], inplace=True)
            
            output_excel = Path(__file__).resolve().parent.parent / "maysoura_individual_leads.xlsx"
            output_csv = Path(__file__).resolve().parent.parent / "maysoura_individual_leads.csv"
            
            df.to_excel(output_excel, index=False)
            df.to_csv(output_csv, index=False, encoding='utf-8-sig')
            
            print("\n" + "=" * 60)
            print(f"🎉 تم استخراج {len(df)} عميل فردي بنجاح!")
            print(f"📁 ملف الإكسل: {output_excel}")
            print(f"📁 ملف CSV:    {output_csv}")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("[i] اكتمل الفحص. يمكنك نسخ رابط أي منشور أو إعلان سياحي به تعليقات لتفريغه فوراً:")
            print("   مثال: py scripts/facebook_leads_scraper.py \"https://www.facebook.com/permalink.php?...\"")
            print("=" * 60)
            
    except Exception as e:
        if "invalid session id" in str(e).lower():
            print("\n[i] تم إغلاق نافذة المتصفح.")
        else:
            print(f"\n[!] حدث خطأ: {e}")
    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass

if __name__ == "__main__":
    main()
