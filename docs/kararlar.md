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
