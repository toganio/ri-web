# DURUM — kaldığımız yer

_Son güncelleme: 2026-11-01 16:00 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- https://recepivedik.web.app (2026-11-01'den beri; Togan: "tamam böyle deploy et").
- recepivedik.com: GoDaddy DNS'te üç satır girildi (Togan, 2026-11-01 15:40): `@` A 199.36.158.100, `@` TXT
  hosting-site=recepivedik, `www` CNAME recepivedik.web.app. GoDaddy'nin sunucusundan ölçüldü, doğru.
  Firebase sertifikası bekleniyor: eski adres (173.201.188.207) bazı DNS önbelleklerinde birkaç saat kalıyor.
- E-posta yok (Togan, 2026-11-01: "e-posta yok").

## Son yapılan (ayrıntı ve Togan'ın sözleri `docs/kararlar.md`)
- Tasarım Seri; 8 film (8 "Yakında"); gişe sayıları (toplam 30.753.866); Box Office Türkiye bağlantıları kaldırıldı.
- Güvenlik sıkılaştırması (camasirhanefilm.com'daki düzeltmelerin aynısı): `docs/evaluations/2026-11-01-sikilastirma.md`.

## Şu an açık iş
- Sıkılaştırma PR'ı (taslak): HSTS, web.app → recepivedik.com taşıma, 404 `noindex`. Taşıma yüzünden yalnız
  alan adının sertifikası gelince birleştirilir; önce birleşirse site açılmaz.

## Sıradaki adım
1. `alan-adi.yml` elle çalıştırılır; `hostState HOST_ACTIVE` ve sertifika `CERT_ACTIVE` olunca https://recepivedik.com ölçülür.
2. Sıkılaştırma PR'ı taslaktan çıkar, CI yeşil olunca birleşir ve yayınlanır; canlıda başlık ve taşıma ölçülür.
3. GoDaddy DNS (Togan, adım adım): CAA `pki.goog` + `letsencrypt.org`; SPF `v=spf1 -all`; DMARC `_dmarc` `v=DMARC1; p=reject`;
   eski hosting satırları (A admin/mail, cPanel CNAME'leri, SRV, MX) silinir.

## Togan'dan beklenen
- 3. adımdaki GoDaddy değişiklikleri (sertifika gelince tek tek tarif edilir).
- İsterse: Gotham web lisans dosyaları; 1, 2, 3 ve 7'nin hikaye/künye metni.
