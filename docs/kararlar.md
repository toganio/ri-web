# Kararlar

## 2026-10-31 — Başlangıç (Togan)
- Togan: recepivedik.com yeniden yapılsın; depo adı `ri-web`.
- Sitede hangi filmler: **tüm seri, 1'den 7'ye**, her filme sayfa (Togan karar kartında seçti).
- Togan: *"önceki verileri recepivedik.com dan alabilirsin ama tasarıma dair hiç bişey alınmasın"*.

## Bugünkü site (2026-10-31 ölçüldü)
- GoDaddy Apache (173.201.188.207), elle yazılmış statik HTML, son değişiklik 2019-12.
- Ana sayfa Recep İvedik 6: fragman, hikaye, künye, afiş, 18 fotoğraf. `/recep-ivedik-5/` aynı yapıda.
  `/recep-ivedik-4/` çok eski ayrı bir site (fragman, galeri, afişler, künye, hikaye, sponsor, iletişim).
- 1, 2 ve 3 için yalnız menüde açılan YouTube fragmanları var (ite5gbn55TQ, jUkm-Qz3wjc, wU7yHUYWqS8).
- Recep İvedik 7 sitede yok.
- https sertifikası kendinden imzalı: https ile açan herkes güvenlik uyarısı görüyor.
- DNS GoDaddy (pdns05/06.domaincontrol.com). E-posta GoDaddy'de (MX smtp/mailstore1.secureserver.net).

## Teknik (ajan)
- Depo boştu; ilk commit (yalnız kural ve durum dosyaları) `main`'e doğrudan yazıldı, çünkü boş depoda PR açılacak
  temel dal yoktu. Sonraki her iş PR ile.

## 2026-10-31 — İçerik kaynakları ve tasarım (ajan)
- Togan: *"dünya klasmanında bi tasarım yap"*. İki aday, sıfırdan: **Seri** (koyu zemin, yelpaze gibi açılan yedi afiş,
  dev numaralı film bölümleri, arkada sessiz fragman) ve **Kahkaha** (açık zemin, çıkartma afişler, dönen rozet, dev film satırları).
  Eski sitenin düzeni, renkleri, arka plan görselleri ve logosu kullanılmadı.
- 4, 5, 6: metin ve fotoğraflar recepivedik.com'dan. Eski sitedeki yatay "afiş" görselleri (1600x810) aslında sayfa arka
  planıydı, tasarım sayıldığı için alınmadı. RI4 künyesi eski sitede resimdi (`kunye.png`), yazıya geçirildi
  (`tests/kaynak/recepivedik.com_recep-ivedik-4_kunye.txt`). Eksik künye satırları ve oyuncu rolleri camasirhanefilm.com'dan.
- Dikey afişler yedi filmin hepsi için TMDB'den (780x1170): eski sitede 1, 2, 3 ve 7'nin afişi yok, 4-5-6'nınki küçük.
  Afiş filmin resmi görselidir, uydurma içerik sayılmaz (cms-web'de de aynı yol izlendi). Kural `AGENTS.md`'ye yazıldı.
- GitHub maliyeti: testler PR'da bir kez (ubicloud) koşar; önizleme işleri yalnız derler, main'de test tekrarlanmaz
  (`deploy.yml` tek iş akışı, `ci.yml` kaldırıldı).
- Yazım düzeltmeleri: "MİKYAJ" → "MİKSAJ", "kulanmaktadırlar" → "kullanmaktadırlar" (testte `DUZELTME` listesi).
- Firebase: yeni proje açılmadı; camasirhanefilm-web projesinde ayrı site (`recepivedik`). Yükleme hesabı aynı
  (githubdeploy); anahtar Togan tarafından GitHub sırrına konur, depoda tutulmaz.
- Recep İvedik 8 TMDB'de duyurulmuş (konu yok); Togan'ın kararı 1–7 olduğu için eklenmedi.
- 2026-10-31: Togan `FIREBASE_SERVICE_ACCOUNT` sırrını ri-web ve sg-web'e ekledi (tek anahtar). Firebase sitesi `recepivedik` ilk yayında açıldı.
- 2026-10-31: Togan Seri'yi seçti: *"1. tasarım güzel ama çok siyah ve koyu olmuş, daha renkli, light ve fresh"*. Seri açık
  ve renkli yapıldı: krem zemin, her filme kendi canlı rengi (`.t1`…`.t7`), bölümler filmin açık renginde, dev numara afişin
  arkasında. Açık zeminde soluk kaldığı için arkada sessiz oynayan fragman kaldırıldı (fragmanlar film sayfasında tıklayınca
  oynar). Kahkaha tasarımı ve ona özel kod silindi; önizleme adresi `pr-N-seri` olarak kaldı.
- 2026-11-01: 1, 2, 3 ve 7. filmlerin hikaye ve künyesi ne bugünkü sitede ne Internet Archive kopyalarında var (arşivde
  2009'dan yalnız reklamlı "Recep İvedik 2 burada" giriş sayfaları, 2014 sonrası yalnız RI4-5-6). Togan'a soruldu
  (seçenekler: metni kendisi gönderir / künye Vikipedi'den / şimdilik böyle). Togan: **"Şimdilik böyle kalsın"**. Bu dört
  film sayfası afiş ve fragmanla yayında; yazı Togan'dan gelince eklenir. Vikipedi'den künye alınmaz.
- 2026-11-01: RI1, RI2, RI3 afişleri TMDB'deki özgün Türkçe sinema afişleriyle değiştirildi (önceki dosyalar yakınlaştırılmış,
  kesik kopyalardı; Togan sahangokbakar.com'da "garip" buldu). Kaynak: TMDB 7qk6BU7YFXcjV9Rp7EjV6qtZaXj (RI1),
  wymzbCrbU0r0mcRZrkWAz9Yvwy1 (RI2), 1eB9KYqsaLtXw61DD2iyrkIZKQH (RI3). TMDB'deki 8j90ts… ve xjudWE… afişleri yapay zekâ
  üretimi, kullanılmaz.
- 2026-11-01: Ana sayfadaki "SERİ · 2008–2022" yazısı "7 FİLM · 2008'DEN BERİ" oldu. Togan: *"seri hâlâ devam ediyor, bu yanlış"*.
- 2026-11-01: Togan *"Recep'in turuncu gömlek deseni kullanılabilir"* dedi ve kumaş fotoğrafı gönderdi; *"kaliteli hâlini kullan
  veya sen çiz"*. Desen fotoğraftan ölçülüp CSS ile çizildi (`--gomlek`, `--dokuma`): kayan şerit, film sayfası şeridi,
  ilerleme çubuğu ve alt bilgideki dev yazı.
- 2026-11-01: Sayfalar (HTML) `no-cache` ile sunulur. Firebase'in varsayılanı 1 saatti; Togan yeni tasarımı yayından sonra
  telefonunda eski hâliyle gördü.
- 2026-11-01: Togan *"o rengarenk hâlini sevmedim"*, *"gömlek desenini kullanarak"*. Filmlere ayrı renk verme (gökkuşağı)
  kaldırıldı; renkler yalnız gömlekten: turuncu `#f9420f`, sarı `#fc9a12`, bordo `#6d0000`, krem zemin. Ana sayfanın üst
  bölümü gömlek kumaşı (beyaz başlık, bordo gölge); film bölümleri krem / açık turuncu sırayla, dev numaralar turuncu ve sarı.
