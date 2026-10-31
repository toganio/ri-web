"""recepivedik.com'un Internet Archive (Wayback) kopyalarını indirir.

GitHub Actions'ta koşar (bulut oturumunun ağından web.archive.org'a erişilemiyor).
Yalnız veri toplanır (sayfa metni, görsel, xml/txt); tasarım yeniden kullanılmaz (Togan, 2026-10-31).
Çıktı: arsiv/<zaman>/<adres yolu> dosyaları ve arsiv/ozet.txt (sayfa ve dosyalardaki okunur metinler).
"""
import html, json, os, re, sys, time, urllib.parse, urllib.request, zlib

OUT = "arsiv"
CDX = "https://web.archive.org/cdx/search/cdx?"
UA = {"User-Agent": "ri-web-arsiv/1.0 (github.com/toganio/ri-web)"}
MAX_TOTAL = 1500 * 1024 * 1024
MAX_FILE = 40 * 1024 * 1024
MAX_PER_URL = 6  # bir adresin en fazla kaç farklı içerik sürümü alınır
DEADLINE = time.time() + 45 * 60  # iş süre sınırına takılmasın: 45 dakikada indirme durur, eldeki paketlenir
SKIP_MIME = ("video/", "audio/")
SKIP_EXT = (".flv", ".mp4", ".mov", ".avi", ".wmv", ".mp3", ".zip", ".rar", ".exe")


def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read(MAX_FILE + 1)
        except Exception as e:  # noqa: BLE001
            if getattr(e, "code", None) == 404:
                return None
            time.sleep(2 ** i)
    print("vazgecildi:", url, file=sys.stderr)
    return None


def cdx_rows():
    q = urllib.parse.urlencode({
        "url": "recepivedik.com", "matchType": "domain", "output": "json",
        "fl": "timestamp,original,mimetype,statuscode,digest,length",
        "filter": "statuscode:200", "collapse": "digest", "limit": "50000",
    })
    data = get(CDX + q)
    if data is None:  # arşiv servisine ulaşılamadı: boş sonuçla eski sürümün üstüne yazılmasın
        raise SystemExit("CDX listesi alinamadi; yayin yapilmadi")
    rows = json.loads(data)
    return [dict(zip(rows[0], r)) for r in rows[1:]] if rows else []


def norm_key(u):
    p = urllib.parse.urlsplit(u)
    host = p.netloc.lower().split(":")[0]
    if host.startswith("www."):
        host = host[4:]
    return host + (p.path or "/") + ("?" + p.query if p.query else "")


def local_path(ts, u):
    p = urllib.parse.urlsplit(u)
    path = p.path or "/"
    if path.endswith("/"):
        path += "index.html"
    if p.query:
        path += "_" + re.sub(r"[^A-Za-z0-9=_-]", "_", p.query)[:80]
    safe = re.sub(r"[^A-Za-z0-9._/%-]", "_", urllib.parse.unquote(path)).lstrip("/")
    return os.path.join(OUT, ts, norm_key(u).split("/")[0], safe)


def page_text(b):
    s = b.decode("utf-8", "replace")
    if "�" in s[:5000]:
        s = b.decode("cp1254", "replace")
    t = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", s)
    t = re.sub(r"(?s)<!--.*?-->", " ", t)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def swf_strings(b):
    try:
        if b[:3] == b"CWS":
            b = b[:8] + zlib.decompress(b[8:])
        elif b[:3] != b"FWS":
            return ""
    except Exception:  # noqa: BLE001
        return ""
    out = []
    for m in re.finditer(rb"[\x20-\x7e\xc2-\xf4\x80-\xbf\n\r\t]{12,}", b):
        try:
            s = m.group().decode("utf-8")
        except UnicodeDecodeError:
            continue
        if " " in s and re.search(r"[a-zA-ZçğıöşüÇĞİÖŞÜ]{3}", s) and not re.search(r"[{};=]{3}", s):
            out.append(s.strip())
    return "\n".join(dict.fromkeys(out))


def main():
    rows = cdx_rows()
    print("CDX satiri:", len(rows))
    seen, picked = {}, []
    for r in sorted(rows, key=lambda r: r["timestamp"]):
        ext = urllib.parse.urlsplit(r["original"]).path.lower()
        if r["mimetype"].startswith(SKIP_MIME) or ext.endswith(SKIP_EXT):
            continue
        k = norm_key(r["original"])
        seen.setdefault(k, []).append(r)
    for k, rs in seen.items():
        if len(rs) > MAX_PER_URL:  # ilk, son ve aradan eşit aralıklı sürümler
            idx = sorted({round(i * (len(rs) - 1) / (MAX_PER_URL - 1)) for i in range(MAX_PER_URL)})
            rs = [rs[i] for i in idx]
        picked.extend(rs)
    print("indirilecek:", len(picked), "farkli adres:", len(seen))
    total, ozet, liste = 0, [], []
    # Önce metin taşıyan dosyalar (sayfa, xml, txt, swf), sonra görseller: süre biterse metin elde kalır.
    def textual(r):
        m, low = r["mimetype"], r["original"].lower()
        return 0 if ("html" in m or "xml" in m or "text" in m or "json" in m or "flash" in m or low.endswith((".swf", ".xml", ".txt"))) else 1
    for r in sorted(picked, key=lambda r: (textual(r), r["timestamp"], r["original"])):
        if total > MAX_TOTAL:
            print("boyut siniri doldu"); break
        if time.time() > DEADLINE:
            print("sure siniri doldu, kalan atlandi"); break
        b = get(f"https://web.archive.org/web/{r['timestamp']}id_/{r['original']}")
        if not b or len(b) > MAX_FILE:
            continue
        total += len(b)
        dest = local_path(r["timestamp"], r["original"])
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "wb") as f:
            f.write(b)
        liste.append(f"{r['timestamp']}\t{r['mimetype']}\t{len(b)}\t{r['original']}\t{dest}")
        m, low = r["mimetype"], r["original"].lower()
        text = ""
        if "html" in m:
            text = page_text(b)
        elif "xml" in m or "text/plain" in m or "json" in m or low.endswith((".xml", ".txt", ".json")):
            text = page_text(b) if "<" in b[:200].decode("latin-1") else b.decode("utf-8", "replace")
        elif "flash" in m or low.endswith(".swf"):
            text = swf_strings(b)
        if text and len(text) > 20:
            ozet.append(f"\n===== {r['timestamp']} {r['original']} ({m})\n{text[:20000]}")
        time.sleep(0.1)
        if len(liste) % 100 == 0:
            print(f"{len(liste)} dosya, {total/1e6:.1f} MB", flush=True)
    with open(os.path.join(OUT, "liste.tsv"), "w") as f:
        f.write("\n".join(liste) + "\n")
    with open(os.path.join(OUT, "ozet.txt"), "w") as f:
        f.write("".join(ozet))
    print(f"indirilen: {len(liste)} dosya, {total/1e6:.1f} MB, metinli kayit: {len(ozet)}")
    if not liste:
        raise SystemExit("hic dosya indirilemedi; yayin yapilmadi")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    main()
