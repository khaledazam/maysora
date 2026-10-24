import sys
import os
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

profile_path = str(Path(__file__).resolve().parent / "fb_browser_profile")
os.makedirs(profile_path, exist_ok=True)

options = Options()
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1280,900")
options.add_argument("--disable-notifications")
options.add_argument("--lang=ar-EG")
options.add_argument(f"--user-data-dir={profile_path}")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")

print("=" * 60)
print("🔑 جاري فتح متصفح لتسجيل الدخول إلى فيسبوك لمرة واحدة...")
print("المتصفح سيظل مفتوحاً حتى تنتهي من تسجيل الدخول براحتك.")
print("=" * 60)

driver = webdriver.Chrome(options=options)
driver.get("https://www.facebook.com")

try:
    print("⏳ في انتظار تسجيل الدخول إلى فيسبوك...")
    # Wait up to 10 minutes for user to complete login
    while True:
        time.sleep(3)
        login_inputs = driver.find_elements(By.CSS_SELECTOR, "input[name='email'], input#email")
        if not login_inputs and "login" not in driver.current_url.lower():
            # Verify we are on feed / logged in
            time.sleep(3)
            print("\n🎉 تم تسجيل الدخول بنجاح وحفظ الجلسة في المتصفح!")
            print("يمكنك الآن إغلاق النافذة أو تشغيل سكريبت الاستخراج مباشرة:")
            print("py scripts/facebook_leads_scraper.py")
            break
except KeyboardInterrupt:
    print("\nتم الإلغاء.")
finally:
    time.sleep(5)
    driver.quit()
