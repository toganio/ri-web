# DURUM — kaldığımız yer

_Son güncelleme: 2026-11-01 18:25 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- https://recepivedik.web.app (2026-11-01'den beri; Togan: "tamam böyle deploy et").
- **https://recepivedik.com canlı (2026-11-01 18:20 TR).** Firebase: `HOST_ACTIVE`; www sertifikası `CERT_ACTIVE`, ana
  adresinki `CERT_PROPAGATING`. İstanbul'dan (check-host tr1, tr2) 200. https://www.recepivedik.com → ana adrese 301.
  GoDaddy DNS (Togan, 2026-11-01): `@` A 199.36.158.100, `@` TXT hosting-site=recepivedik, `www` CNAME recepivedik.web.app.
- E-posta yok (Togan, 2026-11-01: "e-posta yok").

## Son yapılan (ayrıntı ve Togan'ın sözleri `docs/kararlar.md`)
- Tasarım Seri; 8 film (8 "Yakında"); gişe sayıları (toplam 30.753.866); Box Office Türkiye bağlantıları kaldırıldı.
- Güvenlik sıkılaştırması (camasirhanefilm.com'daki düzeltmelerin aynısı): `docs/evaluations/2026-11-01-sikilastirma.md`.

## Şu an açık iş
- Sıkılaştırma PR'ı #5: HSTS, web.app → recepivedik.com taşıma, 404 `noindex`. Alan adı açıldı, birleştiriliyor.

## Sıradaki adım
1. PR #5 yayınlanınca canlıda HSTS başlığı ve web.app taşıması ölçülür.
2. GoDaddy DNS (Togan, adım adım): CAA `pki.goog` + `letsencrypt.org`; SPF `v=spf1 -all`; DMARC `_dmarc` `v=DMARC1; p=reject`;
   eski hosting satırları (A admin/mail, cPanel CNAME'leri, SRV, MX) silinir.

## Togan'dan beklenen
- 2. adımdaki GoDaddy değişiklikleri (sertifika gelince tek tek tarif edilir).
- İsterse: Gotham web lisans dosyaları; 1, 2, 3 ve 7'nin hikaye/künye metni.
