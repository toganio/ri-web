# DURUM — kaldığımız yer

_Son güncelleme: 2026-11-01 00:03 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- Yeni site henüz yok. Önizlemeler (PR #1, 2026-11-07'ye kadar): Seri https://recepivedik--pr-1-seri-lhiq9jca.web.app ,
  Kahkaha https://recepivedik--pr-1-kahkaha-mufyxcem.web.app (yedi film sayfası 200, ölçüldü). Bugünkü site: http://recepivedik.com (GoDaddy, 2019'dan beri değişmemiş, https sertifikası bozuk).

## Son yapılan
- Bugünkü sitenin içeriği incelendi (bkz. `docs/kararlar.md`).
- Bağımlılıksız statik üretici (`scripts/build.mjs`), iki tasarım adayı: Seri (koyu, sinema) ve Kahkaha (açık, pop).
- 4, 5, 6. filmlerin metni, künyesi, fragmanları, afişleri ve fotoğrafları (`content/filmler.json`, `img/`).
- İçerik testi `tests/icerik.test.mjs`: her metin `tests/kaynak/` altındaki eski sayfalarda geçmeli.
- Internet Archive kopyalarını indiren iş akışı (`eski-site-arsivi.yml`, sürüm `eski-site-wayback`).

## Şu an açık iş
- Dal `claude/project-thread-utmr6q`, PR #1 (testler yeşil). Birleştirme tasarım seçimi ve 1-2-3-7 içeriğinden sonra.

## Sıradaki adım
1. Arşiv kopyalarından 1, 2, 3 ve 7. filmlerin içeriği.
2. Önizleme kanalları (PR açılınca her tasarım ayrı kanala gider).

## Togan'dan beklenen
- Tasarım seçimi: Seri ya da Kahkaha (önerim Seri).
