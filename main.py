#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
selenium_x_scraper_auto_skip_login.py
- Opens Chrome visibly
- Checks a sample hashtag page first:
    - If the page loads without login gate -> skip login and scrape directly
    - If login gate appears -> open login page and let user login manually, then continue
- Scrapes configured hashtags and saves each to a separate Excel file
"""
import time
import random
import traceback
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd

# ---------- Config ----------
DEFAULT_MAX = 500
SCROLL_PAUSE_MIN = 1.0
SCROLL_PAUSE_MAX = 2.5
MAX_SCROLLS = 120

# عدّل الهـاشتاجات هنا لو حبيت
HASHTAGS = ["GenZ002", "ثعالب_الوعي", "Viral_Foxes"]
OUTPUT_FOLDER = r"C:\Users\Administrator\Downloads\bot_code\Scrapers\X"

# ---------- helpers ----------
def make_driver(visible=True, window_size=(1200, 900)):
    opts = Options()
    if not visible:
        try:
            opts.add_argument("--headless=new")
        except Exception:
            opts.add_argument("--headless")
    opts.add_argument(f"--window-size={window_size[0]},{window_size[1]}")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option('useAutomationExtension', False)
    opts.add_argument("--disable-blink-features=AutomationControlled")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=opts)
    try:
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    except Exception:
        pass
    return driver

def random_sleep(min_s=SCROLL_PAUSE_MIN, max_s=SCROLL_PAUSE_MAX):
    time.sleep(random.uniform(min_s, max_s))

def page_looks_like_login(html):
    if not html:
        return True
    low = html.lower()
    checks = [
        "log in to twitter", "log in to x", "sign in", "log in", "create account",
        "please log in", "log in or sign up", "show us who you are", "enter your phone"
    ]
    return any(c in low for c in checks)

# ---------- parsing & scraping ----------
def parse_tweets_from_html(html):
    soup = BeautifulSoup(html, "html.parser")
    items = []
    articles = soup.find_all("article")
    for art in articles:
        try:
            tweet_url = ""
            tweet_id = ""
            for a in art.find_all("a", href=True):
                href = a["href"]
                if "/status/" in href:
                    tweet_url = href.split("?")[0]
                    parts = tweet_url.rstrip("/").split("/")
                    tweet_id = parts[-1] if parts else ""
                    break
            content = " ".join([t.get_text(" ", strip=True) for t in art.find_all(["div","span","p"]) if t.get_text(strip=True)]).strip()
            username = ""
            display_name = ""
            time_tag = art.find("time")
            date = time_tag["datetime"] if (time_tag and time_tag.has_attr("datetime")) else ""
            for a in art.find_all("a", href=True):
                href = a["href"]
                if href.startswith("/") and "status" not in href and "hashtag" not in href:
                    txt = a.get_text(" ", strip=True)
                    if txt.startswith("@"):
                        username = txt.lstrip("@")
                    elif username == "":
                        display_name = txt
            replies = retweets = likes = 0
            for span in art.find_all(["span","div"]):
                aria = span.get("aria-label","")
                if aria:
                    import re
                    m = re.search(r"([\d,\.]+)", aria.replace(",",""))
                    if m:
                        try:
                            num = int(m.group(1))
                        except Exception:
                            num = 0
                        low = aria.lower()
                        if "like" in low: likes = num
                        elif "retweet" in low: retweets = num
                        elif "reply" in low: replies = num
            items.append({
                "tweet_id": tweet_id,
                "date": date,
                "username": username,
                "display_name": display_name,
                "content": content,
                "url": tweet_url,
                "replies": replies,
                "retweets": retweets,
                "likes": likes
            })
        except Exception:
            continue
    # dedupe
    out = []
    seen = set()
    for it in items:
        tid = it.get("tweet_id") or it.get("url") or (it.get("content") or "")[:40]
        if tid in seen:
            continue
        seen.add(tid)
        out.append(it)
    return out

def collect_from_target_with_driver(driver, target_url, max_tweets=DEFAULT_MAX):
    print(f"[+] Opening {target_url}")
    driver.get(target_url)
    time.sleep(2.0)
    if page_looks_like_login(driver.page_source):
        print("[!] Page looks like login/blocked view — cannot proceed without login for this target.")
        return []
    collected = []
    scrolls = 0
    last_height = driver.execute_script("return document.body.scrollHeight")
    while len(collected) < max_tweets and scrolls < MAX_SCROLLS:
        html = driver.page_source
        tweets = parse_tweets_from_html(html)
        existing_ids = set(t.get("tweet_id") for t in collected if t.get("tweet_id"))
        new_added = 0
        for t in tweets:
            tid = t.get("tweet_id") or t.get("url") or ""
            if tid and tid in existing_ids:
                continue
            collected.append(t)
            existing_ids.add(tid)
            new_added += 1
            if len(collected) >= max_tweets:
                break
        print(f"    collected total: {len(collected)} (added {new_added})")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        random_sleep(1.0, 2.2)
        scrolls += 1
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            time.sleep(1.0)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                print("[i] No more new content detected; stopping scroll.")
                break
        last_height = new_height
    return collected[:max_tweets]

def save_to_excel(records, output_file):
    if not records:
        print(f"[!] No tweets collected for {output_file}. Nothing to save.")
        return
    df = pd.DataFrame(records)
    cols = ["tweet_id","date","username","display_name","content","url","replies","retweets","likes"]
    for c in cols:
        if c not in df.columns:
            df[c] = ""
    df = df[cols]
    try:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    except Exception:
        pass
    if "tweet_id" in df.columns:
        df.drop_duplicates(subset=["tweet_id"], inplace=True)
    df.to_excel(output_file, index=False, engine="openpyxl")
    print(f"[✓] Saved {len(df)} tweets to {output_file}")

# ---------- Main ----------
def main():
    print("=== Selenium X Scraper (auto-skip-login if public) ===")
    driver = make_driver(visible=True)
    try:
        # 1) quick probe: open first hashtag to see if accessible
        probe_tag = HASHTAGS[0] if HASHTAGS else None
        need_manual_login = False
        if probe_tag:
            probe_url = f"https://x.com/hashtag/{probe_tag}"
            print(f"[i] Probing accessibility using {probe_url}")
            driver.get(probe_url)
            time.sleep(3)
            if page_looks_like_login(driver.page_source):
                print("[i] Probe indicates login required to view content.")
                need_manual_login = True
            else:
                print("[i] Probe indicates hashtag page is publicly accessible. Skipping login.")
                need_manual_login = False
        else:
            need_manual_login = True

        # 2) if login required -> let user login manually
        if need_manual_login:
            print("[i] Browser will open X login page. Please log in manually (complete any 2FA).")
            driver.get("https://x.com/login")
            input("After you finish logging in in the browser window, press Enter here to continue...")
            # re-check
            time.sleep(2)
            if page_looks_like_login(driver.page_source):
                print("[!] It still looks like you're not logged in. The script will attempt to continue but may fail.")
        # 3) scrape all hashtags (either logged-in or public)
        for tag in HASHTAGS:
            try:
                url_tag = f"https://x.com/hashtag/{tag}"
                output_file = f"{OUTPUT_FOLDER}\\{tag}.xlsx"
                records = collect_from_target_with_driver(driver, url_tag, max_tweets=DEFAULT_MAX)
                save_to_excel(records, output_file)
            except KeyboardInterrupt:
                print("[!] Interrupted by user.")
                break
            except Exception as e:
                print(f"[!] Error with {tag}: {e}")
                traceback.print_exc()
    finally:
        try:
            driver.quit()
        except Exception:
            pass

if __name__ == "__main__":
    main()