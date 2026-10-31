# Canlıya çıkış öncesi güvenlik denetimi — 2026-11-01

Kapsam: ilk canlı yayın (PR #1). Yöntem: vibe-security'nin 9 alanı; ilgisiz olanlar atlandı.
Site bağımlılıksız statik HTML: giriş, ödeme, form, veritabanı, kullanıcı verisi ve sunucu kodu yok.

| Alan | Durum |
|---|---|
| Sırlar | Depoda sır yok (`git grep`). Firebase anahtarı yalnız GitHub sırrı `FIREBASE_SERVICE_ACCOUNT`; iş akışında maskelenir, geçici dosya `umask 077` ile yazılıp silinir. |
| Auth / yetki / veritabanı / ödeme / kota | Yok (ilgisiz). |
| İstemci girdisi | Form yok (`form-action 'none'`). |
| Başlıklar (önizlemede ölçüldü) | CSP katı: satır içi betik ve stil yok, `frame-ancestors 'none'`, `object-src 'none'`; HSTS, nosniff, Referrer-Policy, Permissions-Policy var. Test satır içi stil/betiği yakalar. |
| Dış bağlantılar | Hepsi `rel="noopener"`. Fragmanlar `youtube-nocookie`. |
| CI/CD | `pull_request` tetikleyicisi (pull_request_target değil); çatal PR'larda sırlı iş koşmaz; `permissions: contents: read` varsayılan. |

## Bulgular
- **Critical / High:** yok.
- **Medium:** yok.
- **Low — tedarik zinciri:** `actions/*`, `FirebaseExtended/action-hosting-deploy@v0` ve `firebase-tools@13` sürüm etiketiyle
  çağrılıyor, commit SHA'sıyla sabitlenmemiş. Saldırgan bu projelerden birini ele geçirirse yayın işinde Firebase anahtarına
  erişebilir. Düzeltme: eylemleri SHA ile sabitlemek (ör. `actions/checkout@<sha> # v4`).
- **Low — gizlilik (KVKK):** Google Fonts ve ana sayfadaki arkada oynayan YouTube fragmanı, ziyaretçinin IP adresini Google'a
  gönderir (tıklamadan). Saldırı değil, gizlilik notu. Düzeltme gerekirse: yazı tiplerini siteye koymak, fragmanı tıklayınca
  yüklemek.

Sonuç: yayını durduran bulgu yok.
