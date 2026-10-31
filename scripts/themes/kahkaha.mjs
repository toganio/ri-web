// Tasarım "Kahkaha": açık zemin, kalın yazı, çıkartma gibi eğik afişler, dönen rozet, kayan şerit.
// Ana sayfada filmler dev satırlar halinde; masaüstünde imleç satırın üstüne gelince afiş imleci izler.
// Her filmin rengi afişinden: assets/themes/kahkaha.css → .t1 … .t7. CSP satır içi stile izin vermez.

const header = (p, current) => `<a class="skip" href="#icerik">${p.esc(p.labels.skip)}</a>
<header class="top">
  <a class="logo" href="/">${p.esc(p.up(p.site.title))}</a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">${p.esc(p.up(p.labels.films))}</button>
  <nav id="menu" class="menu" aria-label="${p.esc(p.labels.films)}">
    ${p.films
      .map(
        (f) =>
          `<a class="t${f.no}" href="${p.href(f)}"${current === f ? ' aria-current="page"' : ''}><b>${f.no}</b><span>${p.esc(p.up(f.title))}</span></a>`,
      )
      .join('')}
  </nav>
</header>`;

const footer = (p) => `<footer class="foot">
  <div class="foot-in">
    <p class="foot-logo">${p.esc(p.up(p.site.title))}</p>
    <p><a href="${p.esc(p.site.companyUrl)}" target="_blank" rel="noopener">${p.esc(p.up(p.site.company))}</a></p>
    <p><a href="mailto:${p.esc(p.site.email)}">${p.esc(p.site.email)}</a></p>
    <p class="social">
      <a href="${p.esc(p.site.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${p.icons.youtube}</a>
      <a href="${p.esc(p.site.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${p.icons.facebook}</a>
    </p>
  </div>
</footer>`;

const ticker = (p) =>
  `<div class="ticker" aria-hidden="true"><div>${Array(4)
    .fill(p.films.map((f) => `<span>${p.esc(p.up(f.title))}</span><i>✦</i>`).join(''))
    .join('')}</div></div>`;

// Dönen yuvarlak rozet (SVG yazı yolu).
const badge = (text) => `<svg class="badge" viewBox="0 0 200 200" aria-hidden="true">
  <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
  <circle cx="100" cy="100" r="99" />
  <text><textPath href="#circ">${text}</textPath></text>
</svg>`;

const two = (n) => String(n).padStart(2, '0');

export default {
  fonts:
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;600;800&display=swap">',

  home(p) {
    const newest = [...p.films].reverse();
    const top = newest[0];
    const first = p.films[0];
    const [w1, ...rest] = p.up(p.site.title).split(' ');
    return `${header(p)}
<main id="icerik">
  <section class="hero">
    <h1 class="title"><span class="l1">${p.esc(w1)}</span><span class="l2">${p.esc(rest.join(' '))}</span></h1>
    <a class="sticker t${top.no}" href="${p.href(top)}" aria-label="${p.esc(top.title)}">${p.img(top.poster, top.title, '', ' fetchpriority="high"')}<span class="tape"></span></a>
    ${badge(p.esc(`${p.films.length} ${p.up(p.labels.film)} ✦ ${first.year}–${top.year} ✦ ${p.up(p.site.company)} ✦ `))}
  </section>
  ${ticker(p)}
  <section class="list" data-follow aria-label="${p.esc(p.labels.films)}">
    ${newest
      .map(
        (f) => `<a class="row t${f.no} rv" href="${p.href(f)}" data-poster="/${f.poster.src}">
      <span class="no">${two(f.no)}</span>
      <span class="thumb">${p.img(f.poster, '')}</span>
      <span class="name">${p.esc(p.up(f.title))}</span>
      <span class="yr">${f.year}</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>`,
      )
      .join('\n    ')}
  </section>
</main>
${footer(p)}`;
  },

  film(p, f) {
    const { prev, next } = p.neighbours(f);
    const out = [];
    out.push(`<section class="story" id="hikaye">
    <h2 class="tag rv">${p.esc(p.up(p.labels.story))}</h2>
    <p class="big rv">${p.esc(f.story[0])}</p>
    ${f.story.slice(1).map((s) => `<p class="rv">${p.esc(s)}</p>`).join('\n    ')}
  </section>`);
    if (f.videos?.length)
      out.push(`<section class="videos" id="fragman">
    <h2 class="tag rv">${p.esc(p.up(p.labels.trailer))}</h2>
    <div class="video-grid">${f.videos.map((v) => `<figure class="rv">${p.video(f, v)}<figcaption>${p.esc(p.up(v.title))}</figcaption></figure>`).join('')}</div>
  </section>`);
    if (f.photos?.length)
      out.push(`<section class="photos" id="galeri">
    <h2 class="tag rv">${p.esc(p.up(p.labels.gallery))}</h2>
    <div class="rail-wrap">
      <div class="rail gallery" data-rail tabindex="0">${f.photos.map((ph, i) => `<a href="/${ph.src}">${p.img(ph, `${f.title} – ${i + 1}`)}</a>`).join('')}</div>
      <button class="rail-prev" type="button" aria-label="${p.esc(p.labels.prev)}">←</button>
      <button class="rail-next" type="button" aria-label="${p.esc(p.labels.next)}">→</button>
    </div>
  </section>`);
    if (f.credits?.length)
      out.push(`<section class="credits" id="kunye">
    <h2 class="tag rv">${p.esc(p.up(p.labels.credits))}</h2>
    <div class="credit-grid">${p.credits(f)}</div>
  </section>`);
    if (f.posters?.length)
      out.push(`<section class="posters" id="afis">
    <h2 class="tag rv">${p.esc(p.up(p.labels.poster))}</h2>
    <div class="poster-row gallery">${f.posters.map((a) => `<a class="rv" href="/${a.src}">${p.img(a, f.title)}</a>`).join('')}</div>
  </section>`);
    return `${header(p, f)}
<main id="icerik" class="t${f.no}">
  <section class="film-hero">
    <div class="film-head">
      <p class="chips"><span>${two(f.no)}</span><span>${p.esc(p.up(f.release || String(f.year)))}</span></p>
      <h1>${p.esc(p.up(f.title))}</h1>
    </div>
    <div class="sticker big">${p.img(f.poster, f.title, '', ' fetchpriority="high"')}<span class="tape"></span></div>
  </section>
  ${ticker(p)}
  ${out.join('\n  ')}
  <nav class="pager">
    ${prev ? `<a class="t${prev.no}" href="${p.href(prev)}"><small>← ${p.esc(p.up(p.labels.prev))}</small><b>${p.esc(p.up(prev.title))}</b></a>` : ''}
    ${next ? `<a class="t${next.no} next" href="${p.href(next)}"><small>${p.esc(p.up(p.labels.next))} →</small><b>${p.esc(p.up(next.title))}</b></a>` : ''}
  </nav>
</main>
${footer(p)}`;
  },

  notFound(p) {
    return `${header(p)}
<main id="icerik" class="nf">
  <h1 class="title"><span class="l1">404</span></h1>
  <p><a href="/">${p.esc(p.up(p.labels.home))} →</a></p>
</main>
${footer(p)}`;
  },
};
