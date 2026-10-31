# ri-web — recepivedik.com web sitesi — ajan kuralları

Genel kurallar: https://github.com/toganio/agents/blob/main/AGENTS.md
(bulut oturumunda o depo yoksa aşağıdaki özet geçerlidir).

## Çekirdek özet (her ajan, her makine)
- **Makinede sürekli açık kalan süreç yok**: sunucu, veritabanı, emülatör,
  Docker, arka plan servisi yok. Kısa kontroller serbest ama kanıt değil;
  kanıt GitHub Actions + canlı/önizleme ölçümü.
- **GitHub tek kaynak**: devam ederken önce `git pull` + `DURUM.md` oku; biten
  her adımı iş dalına push et; Togan'a dönerken `DURUM.md`'yi güncelle
  (en fazla ~30 satır, üzerine yaz). Makinede push edilmemiş iş kalmaz.
- `main`'e doğrudan push yok; her iş PR. Normal değişiklik güvenlik kontrolü
  ve CI yeşil olunca ajan tarafından birleştirilir ve yayınlanır; Togan'a
  yalnız kırmızı bayraklı değişiklik sorulur (temel akışı bozabilecek
  değişiklik, ödeme/fiyat, giriş ya da güvenlik korumasını gevşetmek, veri
  silmek, gizlilik metni/izin, geri alınamayan işlem). Testler atlanmaz.
- **Proje bilgisi yalnız bu depoda**: kaldığımız yer `DURUM.md`, kararlar ve
  raporlar `docs/`. Ajan hafızası, claude.ai proje hafızası, sohbet ve git
  dışı klasörler yalnız önbellek; oraya yazılan bilgi aynı oturumda depoya da
  yazılır. Togan'ın sohbette verdiği onaylar da `DURUM.md`'ye yazılır.
- Sırlar yalnız GitHub Secrets / Secret Manager'da; depoya ve dosyaya asla.
- Bitti = CI yeşil + canlıda ölçüldü. Ölçülmeyen şey "çalışıyor" denmez.
- Auth/ödeme/veri erişimi değişikliğinde vibe-security denetimi zorunlu.
- **GitHub dakikası boşa harcanmaz** (genel kural "GITHUB ACTIONS MALİYETİ"):
  ara testleri ajan kendi oturumunda koşar, PR taslak açılır ve iş bitince
  taslaktan çıkar (GitHub tam paketi bir kez koşar); aynı kod iki kez test
  edilmez; sırsız Linux işleri `runs-on: ubicloud-standard-2` (depoda
  `.github/actionlint.yaml` bu etiketi tanıtır); her işe `timeout-minutes`;
  Mac/Windows yalnız ilgili kod değişince. Testler kaldırılmaz.
- **Teknik yönetim ajanda**: Togan yalnız ürün ve kullanıcı deneyimiyle
  ilgilenir. Mimari, depo düzeni, dallar, testler, güvenlik ve yayın ajanın
  işidir; Togan'a yalnız ürün kararları ve kırmızı bayraklı değişikliklerin
  canlıya alma onayı sorulur.

## Bu projeye özel
- Ne: recepivedik.com'un yeniden yapımı; bağımlılıksız statik site (yöntem `toganio/cms-web` ile aynı).
- **İçerik kuralı (Togan, 2026-10-31):** sitede Recep İvedik serisinin 7 filmi de olur, her filme sayfa.
  Eski recepivedik.com'dan (bugünkü site ve eski arşiv kopyaları) yalnız **veri** alınır: yazı, künye,
  fotoğraf, afiş, fragman. **Tasarıma dair hiçbir şey alınmaz** (düzen, renk, arka plan görselleri, stil).
  Eski sitede olmayan filmlerin içeriği eski arşivden ya da Togan'dan gelir; uydurma metin yazılmaz.
  İstisna: filmlerin resmi dikey afişi TMDB'den alınır (eski sitede yok ya da küçük; cms-web'de de böyle,
  bkz. `docs/kararlar.md`). Afiş filmin kendi resmi görselidir, uydurma içerik değildir.
- Oturumda serbest kısa kontrol: `npm test` (derler + test eder, saniyeler sürer). Sunucu açılmaz;
  görsel kontrol önizleme kanalında yapılır.
- Yayın: Firebase Hosting (kurulunca burada yazılır). Canlı adres: henüz yok (bkz. `DURUM.md`).
- E-posta GoDaddy'de (MX secureserver.net); alan adı bağlanırken MX/SPF satırlarına dokunulmaz.
