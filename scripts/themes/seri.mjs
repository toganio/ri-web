// Tasarım "Seri": açık ve renkli (Togan 2026-10-31: "daha renkli, light ve fresh"). Ana sayfada gömlek kumaşı üstünde yelpaze gibi
// açılan afişler ve dev başlık, gişe rekorları, ardından her film kendi numarasıyla tam ekran bir bölüm. Film sayfasında dev numara, afiş, fragman,
// gişe, hikaye, künye ve galeri. Renkler yalnız Recep'in gömleğinden (assets/themes/seri.css).
// CSP satır içi stile izin vermez; değişkenler assets/main.js içinde style.setProperty ile verilir.
const header = (p, current, hero = false) => `<a class="skip" href="#icerik">${p.esc(p.labels.skip)}</a>
<div class="progress" aria-hidden="true"></div>
<header class="bar${hero ? ' on-hero' : ''}">
  <a class="brand" href="/" aria-label="${p.esc(p.site.title)}">${p.esc(p.up(p.site.title))}</a>
  <nav class="nums" aria-label="${p.esc(p.labels.films)}">
    ${p.films
      .map(
        (f) =>
          `<a href="${p.href(f)}" class="t${f.no}"${current === f ? ' aria-current="page"' : ''} title="${p.esc(f.title)}"><span class="sr-only">${p.esc(f.title)}</span><b aria-hidden="true">${f.no}</b></a>`,
      )
      .join('')}
  </nav>
</header>`;

const footer = (p) => `<footer class="foot">
  <p class="foot-big" aria-hidden="true">${p.esc(p.up(p.site.title))}</p>
  <div class="foot-row">
    <a href="${p.esc(p.site.companyUrl)}" target="_blank" rel="noopener">${p.esc(p.up(p.site.company))}</a>
    <a href="mailto:${p.esc(p.site.email)}">${p.esc(p.site.email)}</a>
    <span class="social">
      <a href="${p.esc(p.site.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${p.icons.youtube}</a>
      <a href="${p.esc(p.site.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${p.icons.facebook}</a>
    </span>
  </div>
</footer>`;

// Başlık harflerini tek tek sararak sırayla belirmelerini sağlar (d0…d24 gecikme sınıfları CSS'te).
// Kelimeler ayrı kalır ki dar ekranda satır kelime arasından kırılsın.
const letters = (s) => {
  let i = 0;
  return s
    .split(' ')
    .map((w) => `<span class="w">${[...w].map((ch) => `<span class="ch d${Math.min(i++, 24)}">${ch}</span>`).join('')}</span>`)
    .join(' ');
};

// Etiketteki {n} yerine kalın sayı: "{n} hafta vizyonda" → "<b>25</b> HAFTA VİZYONDA".
const fill = (p, label, v) => label.split('{n}').map((x) => p.esc(p.up(x))).join(`<b>${v}</b>`);

// Gişe bölümü (Togan 2026-11-01: "her filmin ne kadar izlendiğini yaz ve öne çıkar"). Rakamlar Box Office Türkiye'den;
// sitede Box Office Türkiye bağlantısı yok (Togan: "sitedeki tüm Box Office Türkiye linklerini kaldır").
const gise = (p) => {
  if (!p.gise.length) return '';
  const top = [...p.gise].sort((a, b) => b.gise.seyirci - a.gise.seyirci);
  const max = top[0].gise.seyirci;
  const ikili = top[0].gise.sira === 1 && top[1]?.gise.sira === 2;
  return `<section class="gise" id="gise" aria-labelledby="gise-baslik">
    <div class="gise-head rv">
      <p class="eyebrow">${p.esc(p.up(p.labels.boxEyebrow))}</p>
      <p class="gise-total"><b data-count="${p.giseToplam}">${p.num(p.giseToplam)}</b></p>
      <p class="gise-total-l">${p.esc(p.up(p.labels.boxTotal.replace('{n}', p.gise.length)))}</p>
      <h2 id="gise-baslik">${p.esc(p.up(ikili ? p.labels.boxTitle : p.labels.boxEyebrow))}</h2>
    </div>
    <ol class="gise-list">
      ${top
        .map(
          (f) => `<li class="rv${f.gise.sira <= 2 ? ' medal' : ''}"><a href="${p.href(f)}">
        <span class="g-rank">${fill(p, p.labels.rank, f.gise.sira)}</span>
        <span class="g-title">${p.esc(p.up(f.title))}</span>
        <span class="g-bar" aria-hidden="true"><i data-w="${(f.gise.seyirci / max).toFixed(3)}"></i></span>
        <b class="g-num">${p.num(f.gise.seyirci)} <span class="sr-only">${p.esc(p.labels.audience)}</span></b>
      </a></li>`,
        )
        .join('\n      ')}
    </ol>
  </section>`;
};

// Bölümde ve film sayfasında seyirci sayısı + tüm zamanlar sırası.
const aud = (p, f, count = false) =>
  `<p class="aud"><b${count ? ` data-count="${f.gise.seyirci}"` : ''}>${p.num(f.gise.seyirci)}</b> ${p.esc(p.up(p.labels.audience))}<span class="rank">${fill(p, p.labels.rank, f.gise.sira)}</span></p>`;

export default {
  fonts:
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700;800&family=Montserrat:wght@900&display=swap">',

  home(p) {
    const newest = [...p.films].reverse();
    // Togan 2026-11-01: açılışta gömlek kumaşı, ardından arkada Recep İvedik 7 fragmanı sessiz oynar (site.heroVideo).
    const heroVideo = p.site.heroVideo || newest.find((f) => f.videos?.length)?.videos[0].youtube;
    return `${header(p, null, true)}
<main id="icerik">
  <section class="hero" data-tilt data-bgvideo="${p.esc(heroVideo || '')}">
    <div class="bg-video" aria-hidden="true"></div>
    <div class="deck" aria-hidden="true">
      ${p.films.map((f) => `<div class="card t${f.no}">${f.poster ? p.img(f.poster, '', '', ' fetchpriority="high"') : p.poster(f)}</div>`).join('\n      ')}
    </div>
    <h1 class="mega" aria-label="${p.esc(p.site.title)}">${letters(p.up(p.site.title))}</h1>
    <p class="hero-sub">${p.esc(p.up(p.labels.heroSub.replace('{n}', p.released.length).replace('{yil}', p.released[0].year).replace('{m}', p.milyon(p.giseToplam))))}</p>
    <a class="scroll-cue" href="#seri" aria-label="${p.esc(p.labels.films)}"><span></span></a>
  </section>
  <div class="ticker" aria-hidden="true"><div>${Array(4).fill(p.films.map((f) => `<span>${p.esc(p.up(f.title))}</span><i>★</i>`).join('')).join('')}</div></div>
  ${gise(p)}
  <nav class="spy" aria-hidden="true">${newest.map((f) => `<a class="t${f.no}" href="#film-${f.no}" tabindex="-1">${f.no}</a>`).join('')}</nav>
  <section id="seri" class="chapters">
    ${newest
      .map(
        (f, i) => `<article class="chapter t${f.no}${i % 2 ? ' flip' : ''}" id="film-${f.no}" data-spy>
      <span class="num" data-speed="-120" aria-hidden="true">${f.no}</span>
      <a class="poster rv" href="${p.href(f)}" data-speed="40">${p.poster(f)}</a>
      <div class="text rv">
        <p class="year">${p.esc(p.up(f.soon ? p.when(f) : String(f.year)))}</p>
        <h2><a href="${p.href(f)}">${p.esc(p.up(f.title))}</a></h2>
        ${f.gise ? aud(p, f) : ''}
        ${f.story.length ? `<p class="lead">${p.esc(f.story[0])}</p>` : ''}
        <a class="go" href="${p.href(f)}">${p.esc(p.up(p.labels.goFilm))} <span aria-hidden="true">→</span></a>
      </div>
    </article>`,
      )
      .join('\n    ')}
  </section>
</main>
${footer(p)}`;
  },

  film(p, f) {
    const { prev, next } = p.neighbours(f);
    const sections = [];
    if (f.videos?.length)
      sections.push(`<section class="block videos rv" id="fragman">
    <h2 class="label">${p.esc(p.up(p.labels.trailer))}</h2>
    <div class="video-grid">${f.videos.map((v) => `<figure>${p.video(f, v)}<figcaption>${p.esc(p.up(v.title))}</figcaption></figure>`).join('')}</div>
  </section>`);
    if (f.story.length)
      sections.push(`<section class="block story rv" id="hikaye">
    <h2 class="label">${p.esc(p.up(p.labels.story))}</h2>
    <div class="story-text">${f.story.map((s, i) => `<p${i === 0 ? ' class="first"' : ''}>${p.esc(s)}</p>`).join('')}</div>
  </section>`);
    if (f.credits?.length)
      sections.push(`<section class="block credits rv" id="kunye">
    <h2 class="label">${p.esc(p.up(p.labels.credits))}</h2>
    <div class="credit-grid">${p.credits(f)}</div>
  </section>`);
    if (f.posters?.length)
      sections.push(`<section class="block posters rv" id="afis">
    <h2 class="label">${p.esc(p.up(p.labels.poster))}</h2>
    <div class="poster-row gallery">${f.posters.map((a) => `<a href="/${a.src}">${p.img(a, f.title)}</a>`).join('')}</div>
  </section>`);
    if (f.photos?.length)
      sections.push(`<section class="block photos" id="galeri">
    <h2 class="label rv">${p.esc(p.up(p.labels.gallery))}</h2>
    <div class="masonry gallery">${f.photos.map((ph, i) => `<a class="rv" href="/${ph.src}">${p.img(ph, `${f.title} – ${i + 1}`)}</a>`).join('')}</div>
  </section>`);
    return `${header(p, f)}
<main id="icerik" class="t${f.no}">
  <section class="film-hero">
    <span class="num" data-speed="-80" aria-hidden="true">${f.no}</span>
    <div class="film-title">
      <p class="year">${p.esc(p.up(p.when(f)))}</p>
      <h1>${letters(p.up(f.title))}</h1>
      ${
        f.gise
          ? `<div class="film-gise">
        ${aud(p, f, true)}
        <ul><li>${p.esc(p.up(p.labels.opening))} <b>${p.num(f.gise.ilkHaftaSonu)}</b></li><li>${fill(p, p.labels.weeks, f.gise.hafta)}</li></ul>
      </div>`
          : ''
      }
      <nav class="jump">${[
        f.videos?.length && ['fragman', p.labels.trailer],
        f.story.length && ['hikaye', p.labels.story],
        f.credits?.length && ['kunye', p.labels.credits],
        f.posters?.length && ['afis', p.labels.poster],
        f.photos?.length && ['galeri', p.labels.gallery],
      ]
        .filter(Boolean)
        .map(([id, l]) => `<a href="#${id}">${p.esc(p.up(l))}</a>`)
        .join('')}</nav>
    </div>
    <div class="film-poster" data-speed="30">${p.poster(f, ' fetchpriority="high"')}</div>
  </section>
  ${sections.join('\n  ')}
  <nav class="pager">
    ${prev ? `<a class="prev t${prev.no}" href="${p.href(prev)}"><small>← ${p.esc(p.up(p.labels.prev))}</small><b>${p.esc(p.up(prev.title))}</b></a>` : ''}
    ${next ? `<a class="next t${next.no}" href="${p.href(next)}"><small>${p.esc(p.up(p.labels.next))} →</small><b>${p.esc(p.up(next.title))}</b></a>` : ''}
  </nav>
</main>
${footer(p)}`;
  },

  notFound(p) {
    return `${header(p)}
<main id="icerik" class="nf">
  <h1 class="mega">404</h1>
  <p><a class="go" href="/">${p.esc(p.up(p.labels.home))} →</a></p>
</main>
${footer(p)}`;
  },
};
