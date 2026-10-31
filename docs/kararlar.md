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
