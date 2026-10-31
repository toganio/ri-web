# DURUM — kaldığımız yer

_Son güncelleme: 2026-11-01 00:17 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- Yeni site henüz yok. Önizleme (PR #1, 2026-11-07'ye kadar): https://recepivedik--pr-1-seri-lhiq9jca.web.app
  Bugünkü site: http://recepivedik.com (GoDaddy, 2019'dan beri değişmemiş, https sertifikası bozuk).

## Son yapılan
- Togan Seri tasarımını seçti, "daha açık, renkli, fresh" istedi: krem zemin, her filme kendi rengi (bkz. `docs/kararlar.md`).
  Kahkaha tasarımı kaldırıldı.
- 4, 5, 6. filmlerin metni, künyesi, fragmanları, afişleri ve fotoğrafları (`content/filmler.json`, `img/`).
- İçerik testi `tests/icerik.test.mjs`: her metin `tests/kaynak/` altındaki eski sayfalarda geçmeli.
- Internet Archive kopyaları indirildi (iş akışı `eski-site-arsivi.yml`, sürüm `eski-site-wayback`).

## Şu an açık iş
- Dal `claude/project-thread-utmr6q`, PR #1 (taslak). Birleştirme 1-2-3-7 içeriğinden sonra.

## Sıradaki adım
1. Arşiv kopyalarından 1, 2, 3 ve 7. filmlerin hikaye ve künyesi (yoksa Togan'a sorulur).
2. PR birleşir, canlı yayın; sonra recepivedik.com bağlanır (e-posta MX/SPF satırlarına dokunmadan).

## Togan'dan beklenen
- Açık renkli Seri önizlemesine bakıp onay ya da düzeltme.
