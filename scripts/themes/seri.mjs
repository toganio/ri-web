// Tasarım "Seri": koyu, sinema havası. Ana sayfada yelpaze gibi açılan yedi afiş ve dev başlık,
// ardından her film kendi numarasıyla tam ekran bir bölüm. Film sayfasında dev numara, afiş, fragman,
// hikaye, künye ve galeri. Her filmin rengi afişinden: assets/themes/seri.css → .t1 … .t7.
// CSP satır içi stile izin vermez; değişkenler sınıflarla verilir.
const header = (p, current) => `<a class="skip" href="#icerik">${p.esc(p.labels.skip)}</a>
<div class="progress" aria-hidden="true"></div>
<header class="bar">
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

export default {
  fonts:
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800&display=swap">',

  home(p) {
    const newest = [...p.films].reverse();
    const trailer = newest.find((f) => f.videos?.length);
    return `${header(p)}
<main id="icerik">
  <section class="hero" data-bgvideo="${trailer ? p.esc(trailer.videos[0].youtube) : ''}">
    <div class="bg-video" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>
    <div class="deck" aria-hidden="true">
      ${p.films.map((f, i) => `<div class="card t${f.no}">${p.img(f.poster, '', '', ' fetchpriority="high"')}</div>`).join('\n      ')}
    </div>
    <h1 class="mega" aria-label="${p.esc(p.site.title)}">${letters(p.up(p.site.title))}</h1>
    <p class="hero-sub">${p.esc(p.up(p.labels.series))} · ${p.films[0].year}–${p.films[p.films.length - 1].year}</p>
    <a class="scroll-cue" href="#seri" aria-label="${p.esc(p.labels.films)}"><span></span></a>
  </section>
  <div class="ticker" aria-hidden="true"><div>${Array(4).fill(p.films.map((f) => `<span>${p.esc(p.up(f.title))}</span><i>★</i>`).join('')).join('')}</div></div>
  <section id="seri" class="chapters">
    ${newest
      .map(
        (f, i) => `<article class="chapter t${f.no}${i % 2 ? ' flip' : ''}">
      <span class="num" data-speed="-120" aria-hidden="true">${f.no}</span>
      <a class="poster rv" href="${p.href(f)}" data-speed="40">${p.img(f.poster, f.title)}</a>
      <div class="text rv">
        <p class="year">${f.year}</p>
        <h2><a href="${p.href(f)}">${p.esc(p.up(f.title))}</a></h2>
        <p class="lead">${p.esc(f.story[0])}</p>
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
  <section class="film-hero" data-bgvideo="${f.videos?.length ? p.esc(f.videos[0].youtube) : ''}">
    <div class="bg-video" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>
    <span class="num" data-speed="-80" aria-hidden="true">${f.no}</span>
    <div class="film-title">
      <p class="year">${p.esc(p.up(f.release || String(f.year)))}</p>
      <h1>${letters(p.up(f.title))}</h1>
      <nav class="jump">${[
        f.videos?.length && ['fragman', p.labels.trailer],
        ['hikaye', p.labels.story],
        f.credits?.length && ['kunye', p.labels.credits],
        f.posters?.length && ['afis', p.labels.poster],
        f.photos?.length && ['galeri', p.labels.gallery],
      ]
        .filter(Boolean)
        .map(([id, l]) => `<a href="#${id}">${p.esc(p.up(l))}</a>`)
        .join('')}</nav>
    </div>
    <div class="film-poster" data-speed="30">${p.img(f.poster, f.title, '', ' fetchpriority="high"')}</div>
  </section>
  ${sections.join('\n  ')}
  <nav class="pager">
    ${prev ? `<a class="prev t${prev.no}" href="${p.href(prev)}"><small>← ${p.esc(p.up(p.labels.prev))}</small><b>${p.esc(p.up(prev.title))}</b></a>` : '<span></span>'}
    ${next ? `<a class="next t${next.no}" href="${p.href(next)}"><small>${p.esc(p.up(p.labels.next))} →</small><b>${p.esc(p.up(next.title))}</b></a>` : '<span></span>'}
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
