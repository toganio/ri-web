// Statik site üretici: content/filmler.json → dist/
// Bağımlılık yok; `node scripts/build.mjs` birkaç saniyede biter.
// Tasarım: THEME=<ad> (varsayılan "seri", Togan 2026-10-31'de seçti). Sayfa düzeni scripts/themes/<ad>.mjs,
// görünümü assets/themes/<ad>.css dosyasındadır. Görünür metin yalnız içerik dosyasından gelir.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const THEME = process.env.THEME || 'seri';
const theme = (await import(`./themes/${THEME}.mjs`)).default;
const c = JSON.parse(readFileSync(join(ROOT, 'content', 'filmler.json'), 'utf8'));

// Stil ve betik adreslerine ?v=<sürüm> eklenir: tarayıcı bir gün sakladığı eski stili kullanmasın
// (cms-web'de yaşandı, 2026-10-30).
const VERSION = createHash('sha256')
  .update(
    ['assets/base.css', `assets/themes/${THEME}.css`, 'assets/main.js', 'scripts/build.mjs', `scripts/themes/${THEME}.mjs`, 'content/filmler.json']
      .map((f) => readFileSync(join(ROOT, f)))
      .join('\n'),
  )
  .digest('hex')
  .slice(0, 10);

// Büyük harfli yazılar sayfaya baştan büyük harfle yazılır; CSS text-transform Safari'de Türkçe kuralı
// uygulamıyor ("İVEDİK" yerine "IVEDIK"; cms-web, 2026-10-30).
const up = (s) => String(s).toLocaleUpperCase('tr');
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

// Filmler eskiden yeniye (1 → 7) sıralı; ana sayfa en yeniden başlar.
const films = [...c.films].sort((a, b) => a.no - b.no);
const href = (f) => `/${f.slug}/`;

const icons = {
  youtube:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15V9l5.8 3-5.8 3Z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
};

const parts = {
  esc,
  up,
  icons,
  films,
  href,
  site: c.site,
  labels: c.labels,
  // Afişi olmayan "yakında" filmi için gömlek desenli kart (numara + "Yakında").
  poster: (f, attrs = '') =>
    f.poster
      ? parts.img(f.poster, f.title, '', attrs)
      : `<span class="soon-card" role="img" aria-label="${esc(`${f.title} – ${c.labels.soon}`)}"><b>${f.no}</b><span>${esc(up(c.labels.soon))}</span></span>`,
  // Yılı ya da "Yakında".
  when: (f) => (f.soon ? c.labels.soon : f.release || String(f.year)),
  released: films.filter((f) => !f.soon),
  // Gişe (Box Office Türkiye, tests/kaynak/boxofficeturkiye.com_seyirci.txt): 7437050 → "7.437.050", toplam → "30,7".
  num: (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  milyon: (n) => String(Math.floor(n / 1e5) / 10).replace('.', ','),
  gise: films.filter((f) => f.gise),
  giseToplam: films.reduce((t, f) => t + (f.gise?.seyirci || 0), 0),
  img: (p, alt = '', cls = '', attrs = '') =>
    `<img src="/${p.src}" width="${p.w}" height="${p.h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="lazy" decoding="async"${attrs}>`,
  // YouTube oynatıcısı tıklanınca yüklenir (youtube-nocookie); sayfa hızlı açılır.
  video: (f, v) => `<div class="yt" data-id="${esc(v.youtube)}" data-title="${esc(`${f.title} – ${v.title}`)}">
    <img src="https://i.ytimg.com/vi/${esc(v.youtube)}/hqdefault.jpg" alt="" loading="lazy">
    <button type="button" aria-label="${esc(`${f.title} – ${v.title}`)}">${icons.play}</button>
  </div>`,
  credits: (f) =>
    (f.credits || [])
      .map(
        (sec) => `<div class="credit-block">
  <h3>${esc(up(sec.heading))}</h3>
  <dl>${sec.rows.map(([k, v]) => `<div><dt>${esc(up(k))}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</div>`,
      )
      .join('\n'),
  neighbours: (f) => {
    const i = films.indexOf(f);
    return { prev: films[i - 1], next: films[i + 1] };
  },
};

function page({ title, description, body, path, bodyClass = '' }) {
  const canonical = `${c.site.url}${path}`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#fffaf2">
${theme.fonts || ''}
<link rel="stylesheet" href="/assets/base.css?v=${VERSION}">
<link rel="stylesheet" href="/assets/themes/${THEME}.css?v=${VERSION}">
<script src="/assets/main.js?v=${VERSION}" defer></script>
</head>
<body class="theme-${THEME} ${bodyClass}">
${body}
</body>
</html>
`;
}

function write(rel, html) {
  const f = join(DIST, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
if (existsSync(join(ROOT, 'img'))) cpSync(join(ROOT, 'img'), join(DIST, 'img'), { recursive: true });

write(
  'index.html',
  page({ title: c.site.title, description: c.site.description, path: '/', body: theme.home(parts), bodyClass: 'home' }),
);
for (const f of films) {
  write(
    `${f.slug}/index.html`,
    page({
      title: f.soon ? `${f.title} (${c.labels.soon}) – ${c.site.title}` : `${f.title} (${f.year}) – ${c.site.title}`,
      description: f.story[0] || c.site.description,
      path: href(f),
      body: theme.film(parts, f),
      bodyClass: `film film-${f.no}`,
    }),
  );
}
write(
  '404.html',
  page({ title: `${c.labels.notFound} – ${c.site.title}`, description: c.site.description, path: '/404.html', body: theme.notFound(parts) }),
);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', ...films.map(href)].map((p) => `  <url><loc>${c.site.url}${p}</loc></url>`).join('\n')}
</urlset>
`,
);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${c.site.url}/sitemap.xml\n`);
console.log(`dist/ hazır: tasarım ${THEME}, ${films.length} film, sürüm ${VERSION}`);
