# Güvenlik sıkılaştırması — camasirhanefilm.com'daki düzeltmelerin aynısı (2026-11-01)

Togan, 2026-11-01: *"camasirhanefilm.com için yaptığımız güvenlik açık kapatmalarının hepsini bunlara da yapalım"*.
Kaynak: `toganio/cms-web` → `docs/evaluations/2026-10-30-yayin-oncesi-guvenlik.md`, `2026-10-31-tarama-raporu.md`.
Kritik bulgu yok. Sıra: Medium → Low.

## Site (bu PR, test `tests/icerik.test.mjs` 4. ve 5. test)
| cms-web'deki düzeltme | recepivedik.com |
|---|---|
| HSTS Firebase değerine (`max-age=31556926; includeSubDomains; preload`). Medium: kısa değer alt adları korumasız bırakıyordu; saldırgan düz HTTP ile açılan bir alt adda araya girip sahte sayfa gösterebilirdi. | Aynı sorun vardı (`max-age=31536000`). Düzeltildi. Ön yükleme listesine (hstspreload.org) başvurulmadı. |
| Firebase'in kendi adresi (web.app, firebaseapp.com) ziyaretçiyi ana adrese taşır; her sayfada canonical. | Canonical vardı. Taşıma eklendi (`assets/main.js`). Yalnız alan adı sertifikası gelince yayına alınır, yoksa site açılmaz. |
| `robots.txt`, `sitemap.xml`. | Vardı; test her sayfanın haritada ve canonical'ının doğru olduğunu artık denetler. |
| 404 sayfası ayrı: "Sayfa bulunamadı", `noindex`, canonical yok. | Ayrıydı ama canonical taşıyordu ve "bulunamadı" yazısı yalnız başlıktaydı. Düzeltildi. |
| YouTube çerçevesine giden mesajın hedefi `*` değil. | Zaten `https://www.youtube-nocookie.com`. Test artık denetler. |
| Eski sitenin kopyasındaki tarayıcı anahtarı silindi. | `tests/kaynak/`'ta anahtar yok (aranan: `AIza…`, `api_key`, `secret`, `token=`). |

## Alan adı (GoDaddy DNS, sertifika geldikten sonra Togan adım adım)
Togan 2026-11-01: *"e-posta yok"* (bu alan adında e-posta kullanılmıyor).
- CAA: `0 issue "pki.goog"` ve `0 issue "letsencrypt.org"`. Saldırgan ne yapabilirdi: başka bir sertifika firmasından
  bu alan adına sertifika çıkarabilirdi. Sertifika gelmeden eklenmez (yanlış CAA ilk sertifikayı keser).
- E-posta kullanılmadığı için alan adı adına sahte e-posta atılmasın: SPF `v=spf1 -all`, DMARC `v=DMARC1; p=reject`.
  Önce: SPF `~all` ve GoDaddy postası, DMARC yok; herkes `@recepivedik.com` adıyla mail atabilir, alıcı reddetmez.
- Eski GoDaddy hosting satırları (A `admin`, A `mail` 173.201.188.207; cPanel/webmail/autodiscover CNAME ve SRV, MX)
  site ve e-posta için gereksiz. Eski sunucuya giden alt adlar orada ne kalırsa onu sunar; silinir.
- DNSSEC: cms-web'deki karar geçerli (GoDaddy'de ücretli; Togan 2026-10-31 "şimdilik açmayalım").
