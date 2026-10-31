# DURUM — kaldığımız yer

_Son güncelleme: 2026-11-01 01:55 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- 2026-11-01'den beri: https://recepivedik.web.app (Togan: "tamam böyle deploy et"). PR #1 birleşti.
  recepivedik.com henüz eski GoDaddy sitesine gidiyor (A 173.201.188.207); bağlama sürüyor (`alan-adi.yml`).
- E-posta GoDaddy'de: MX secureserver.net, SPF `v=spf1 a mx ptr include:secureserver.net ~all`. Bunlara dokunulmaz.

## Son yapılan (ayrıntı ve Togan'ın sözleri `docs/kararlar.md`)
- Tasarım Seri: renkler yalnız Recep'in gömleğinden; ana sayfa gömlek kumaşıyla açılır, sonra arkada RI7 fragmanı oynar.
- Başlık Montserrat 900 (Gotham'ın web lisans dosyaları gelene kadar).
- Recep İvedik 8 "Yakında" kartı ve resmi teaser ile eklendi (8 film).
- Gişe: Box Office Türkiye seyirci sayıları ana sayfada (toplam 30.753.866, tüm zamanlar 1. ve 2. film), bölümlerde ve
  film sayfalarında. Test her sayıyı `tests/kaynak/boxofficeturkiye.com_seyirci.txt`'den doğrular. RI7'nin sinema kaydı yok.
- 1, 2, 3 ve 7: yazı arşivde yok; Togan "şimdilik böyle kalsın" dedi (afiş + fragman).

## Şu an açık iş
- Dal `claude/project-thread-utmr6q`: alan adı iş akışı (`.github/workflows/alan-adi.yml`, elle çalışır).

## Sıradaki adım
1. Firebase'e recepivedik.com ve www eklenir; gereken TXT/A kayıtları iş akışı çıktısından alınır.
2. Togan GoDaddy DNS'te yalnız `@` A, `@` TXT (hosting-site) ve `www` satırlarını değiştirir; MX/SPF'e dokunulmaz.
3. Sertifika gelince https://recepivedik.com ölçülür.

## Togan'dan beklenen
- GoDaddy DNS'te birkaç satır değişikliği (adım adım tarif edilir).
- İsterse: Gotham web lisans dosyaları; 1, 2, 3 ve 7'nin hikaye/künye metni.
