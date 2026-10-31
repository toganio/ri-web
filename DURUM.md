# DURUM — kaldığımız yer

_Son güncelleme: 2026-10-31 22:50 (Türkiye saati) — claude.ai/code bulut oturumu_

## Canlı
- Yeni site henüz yok. Bugünkü site: http://recepivedik.com (GoDaddy, 2019'dan beri değişmemiş, https sertifikası bozuk).

## Son yapılan
- Bugünkü sitenin içeriği incelendi (bkz. `docs/kararlar.md`).
- Bağımlılıksız statik üretici (`scripts/build.mjs`), iki tasarım adayı: Seri (koyu, sinema) ve Kahkaha (açık, pop).
- 4, 5, 6. filmlerin metni, künyesi, fragmanları, afişleri ve fotoğrafları (`content/filmler.json`, `img/`).
- İçerik testi `tests/icerik.test.mjs`: her metin `tests/kaynak/` altındaki eski sayfalarda geçmeli.
- Internet Archive kopyalarını indiren iş akışı (`eski-site-arsivi.yml`, sürüm `eski-site-wayback`).

## Şu an açık iş
- Dal `claude/project-thread-utmr6q`, taslak PR #1 (önizleme anahtar gelince taslaktan çıkar).

## Sıradaki adım
1. Arşiv kopyalarından 1, 2, 3 ve 7. filmlerin içeriği.
2. Önizleme kanalları (PR açılınca her tasarım ayrı kanala gider).

## Togan'dan beklenen
- Firebase yükleme anahtarı: camasirhanefilm-web projesindeki githubdeploy hesabına yeni JSON anahtar,
  `FIREBASE_SERVICE_ACCOUNT` adıyla ri-web ve sg-web depolarına (tek anahtar iki depo).
- Tasarım seçimi: Seri ya da Kahkaha (ekran görüntüleri 2026-10-31 23:47 TR gönderildi; önerim Seri).
