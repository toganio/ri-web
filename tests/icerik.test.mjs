// İçerik testi. Kural (Togan, 2026-10-31): eski siteden yalnız veri alınır, uydurma metin yazılmaz.
// 1) İçerikteki her hikaye paragrafı, künye satırı ve fragman, tests/kaynak/ altındaki eski sayfalardan
//    birinde geçmelidir (yazım düzeltmeleri aşağıdaki DUZELTME listesinde, gerekçesiyle).
// 2) Derlenen her sayfa kendi filminin bütün metnini içermeli; görseller mevcut olmalı; satır içi stil
//    ve dış betik olmamalı (CSP).
// 3) Her tasarım derlenebilmeli.
// 4) Gişe rakamları (Togan 2026-11-01) Box Office Türkiye sayfalarının kopyasında birebir geçmeli.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const c = JSON.parse(readFileSync(join(ROOT, 'content', 'filmler.json'), 'utf8'));

// Kaynakta bariz yazım hatası olup sitede düzeltilen yerler: [sitede, kaynakta].
const DUZELTME = [
  ['MİKSAJ', 'MİKYAJ'], // ses miksajı; eski sitelerde "MİKYAJ" yazıyor
  ['kullanmaktadırlar', 'kulanmaktadırlar'],
];

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–');
const norm = (s) =>
  decode(String(s))
    .replace(/<[^>]+>/g, ' ')
    .replace(/[’‘`]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleUpperCase('tr');
const fix = (s) => DUZELTME.reduce((t, [yeni, eski]) => t.split(yeni).join(eski), s);

const kaynakDir = join(ROOT, 'tests', 'kaynak');
const kaynak = readdirSync(kaynakDir, { recursive: true })
  .filter((f) => /\.(html?|txt)$/.test(f))
  .map((f) => readFileSync(join(kaynakDir, f), 'utf8'));
const kaynakMetin = norm(kaynak.map((s) => s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')).join(' \n '));
const kaynakHam = kaynak.join('\n');
const varMi = (s) => kaynakMetin.includes(norm(fix(s)));

test('içerik dosyasının yapısı', () => {
  const nos = c.films.map((f) => f.no);
  assert.equal(new Set(nos).size, nos.length, 'film numaraları tekrar ediyor');
  for (const f of c.films) {
    assert.match(f.slug, /^[a-z0-9-]+$/);
    // "Yakında" filminin yılı ve afişi henüz yok (Togan 2026-11-01); diğerlerinde zorunlu.
    assert.ok(f.title && Array.isArray(f.story) && (f.soon || (f.year && f.poster?.src)), `${f.slug}: eksik alan`);
    for (const im of [f.poster, ...(f.posters || []), ...(f.photos || [])].filter(Boolean))
      assert.ok(existsSync(join(ROOT, im.src)), `${f.slug}: görsel yok: ${im.src}`);
  }
});

test('metinler eski sitede geçiyor (uydurma metin yok)', () => {
  const eksik = [];
  for (const f of c.films) {
    for (const s of f.story) if (!varMi(s)) eksik.push(`${f.slug} hikaye: ${s.slice(0, 70)}…`);
    for (const sec of f.credits || [])
      for (const [k, v] of sec.rows) {
        if (!varMi(k)) eksik.push(`${f.slug} künye adı: ${k}`);
        for (const part of v.split(/\s*\/\s*/)) if (!varMi(part)) eksik.push(`${f.slug} künye: ${k} = ${part}`);
      }
    for (const v of f.videos || []) if (!kaynakHam.includes(v.youtube)) eksik.push(`${f.slug} fragman: ${v.youtube}`);
  }
  assert.deepEqual(eksik, [], `Kaynakta bulunmayan içerik:\n${eksik.join('\n')}`);
});

const nokta = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
test('gişe rakamları Box Office Türkiye kopyasında geçiyor', () => {
  const bot = readFileSync(join(kaynakDir, 'boxofficeturkiye.com_seyirci.txt'), 'utf8');
  const eksik = [];
  for (const f of c.films.filter((x) => x.gise)) {
    const g = f.gise;
    const blok = bot.split(g.url)[1]?.split('https://')[0] || '';
    if (!blok) eksik.push(`${f.slug}: kaynak sayfası yok: ${g.url}`);
    if (!blok.includes(`İlk Hafta Sonu ${nokta(g.ilkHaftaSonu)} Toplam (${g.hafta} Hafta) ${nokta(g.seyirci)}`))
      eksik.push(`${f.slug}: seyirci/ilk hafta sonu/hafta tutmuyor`);
    // Rekor listesindeki satır: "<sıra> <film> <gün> <ay> <yıl> <dağıtımcı> <hafta> <seyirci>"
    const re = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(` ${g.sira} ${re(f.title)} \\d{1,2} \\S+ \\d{4} \\D+ ${g.hafta} ${re(nokta(g.seyirci))}(?: |$)`, 'm').test(bot))
      eksik.push(`${f.slug}: tüm zamanlar sırası ${g.sira} tutmuyor`);
  }
  assert.ok(bot.includes(c.site.gise.url), 'rekor listesi kaynağı yok');
  assert.deepEqual(eksik, [], eksik.join('\n'));
});

const themes = readdirSync(join(ROOT, 'scripts', 'themes')).map((f) => f.replace(/\.mjs$/, ''));
for (const theme of themes) {
  test(`tasarım "${theme}" derleniyor ve sayfalar içeriği taşıyor`, () => {
    execFileSync('node', [join(ROOT, 'scripts', 'build.mjs')], { env: { ...process.env, THEME: theme }, stdio: 'pipe' });
    const page = (p) => readFileSync(join(ROOT, 'dist', p), 'utf8');
    const home = page('index.html');
    for (const f of c.films) {
      assert.ok(home.includes(`href="/${f.slug}/"`), `${theme}: ana sayfada ${f.slug} bağlantısı yok`);
      const html = page(`${f.slug}/index.html`);
      const metin = norm(html);
      for (const s of f.story) assert.ok(metin.includes(norm(s)), `${theme}/${f.slug}: hikaye eksik`);
      for (const sec of f.credits || []) for (const [, v] of sec.rows) assert.ok(metin.includes(norm(v)), `${theme}/${f.slug}: künye eksik: ${v}`);
      for (const v of f.videos || []) assert.ok(html.includes(v.youtube), `${theme}/${f.slug}: fragman eksik`);
      for (const ph of f.photos || []) assert.ok(html.includes(`/${ph.src}`), `${theme}/${f.slug}: fotoğraf eksik`);
      if (f.gise) {
        assert.ok(html.includes(nokta(f.gise.seyirci)) && home.includes(nokta(f.gise.seyirci)), `${theme}/${f.slug}: seyirci sayısı eksik`);
        assert.ok(html.includes(f.gise.url), `${theme}/${f.slug}: gişe kaynağı bağlantısı eksik`);
      }
    }
    for (const p of ['index.html', '404.html', ...c.films.map((f) => `${f.slug}/index.html`)]) {
      const html = page(p);
      assert.ok(!/\sstyle=/.test(html), `${theme}/${p}: satır içi stil var (CSP engeller)`);
      assert.ok(!/<script(?![^>]*src="\/assets\/main\.js)/.test(html), `${theme}/${p}: izin dışı betik`);
      assert.ok(!/<script[^>]*>[^<]+<\/script>/.test(html), `${theme}/${p}: satır içi betik`);
      for (const [, src] of html.matchAll(/(?:src|href)="(\/(?:img|assets)\/[^"?]+)/g))
        assert.ok(existsSync(join(ROOT, 'dist', src)), `${theme}/${p}: dosya yok: ${src}`);
    }
  });
}
