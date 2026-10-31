// Ortak davranışlar: tıklayınca yüklenen YouTube, fotoğraf büyütme, kaydırınca beliren öğeler, gişe sayacı, paralaks, arkada sessiz fragman.
// Satır içi betik yok (CSP); her şey bu dosyada.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // YouTube: önce kapak resmi, tıklanınca oynatıcı.
  document.addEventListener('click', (e) => {
    const box = e.target.closest('.yt');
    if (!box || box.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(box.dataset.id)}?autoplay=1&rel=0`;
    f.title = box.dataset.title || 'YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });

  // Fotoğraf büyütme: .gallery içindeki bağlantılar; ok tuşları ve kaydırma ile gezinme.
  const links = [...document.querySelectorAll('.gallery a')];
  if (links.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Kapat">×</button>' +
      '<button type="button" class="lb-prev" aria-label="Önceki">‹</button>' +
      '<img alt="">' +
      '<button type="button" class="lb-next" aria-label="Sonraki">›</button>' +
      '<p class="lb-count"></p>';
    document.body.append(box);
    const img = box.querySelector('img');
    const count = box.querySelector('.lb-count');
    let i = 0;
    const show = (n) => {
      i = (n + links.length) % links.length;
      img.src = links[i].href;
      count.textContent = `${i + 1} / ${links.length}`;
    };
    // Açıkken sayfanın geri kalanı etkisiz (inert): klavye odağı kutunun dışına çıkmaz.
    const behind = () => [...document.body.children].filter((el) => el !== box);
    const close = () => {
      box.hidden = true;
      document.documentElement.classList.remove('noscroll');
      behind().forEach((el) => (el.inert = false));
      links[i].focus();
    };
    links.forEach((a, n) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        show(n);
        box.hidden = false;
        document.documentElement.classList.add('noscroll');
        behind().forEach((el) => (el.inert = true));
        box.querySelector('.lb-close').focus();
      }),
    );
    box.querySelector('.lb-close').onclick = close;
    box.querySelector('.lb-prev').onclick = () => show(i - 1);
    box.querySelector('.lb-next').onclick = () => show(i + 1);
    box.addEventListener('click', (e) => e.target === box && close());
    document.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'Tab') {
        // inert desteklemeyen eski tarayıcılar için odak kutunun düğmeleri arasında döner.
        const btns = [...box.querySelectorAll('button')];
        const at = btns.indexOf(document.activeElement);
        e.preventDefault();
        btns[(at + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
      }
    });
    let x0 = null;
    box.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    box.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // Kaydırınca beliren öğeler (.rv). Hareket azaltma açıksa hepsi baştan görünür.
  const rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    rv.forEach((el) => io.observe(el));
  }

  // Üst çubuğun zemini yok: ana sayfanın gömlek/fragman bölümü üstteyken logo krem, aşağıda koyu (.on-hero).
  const hero = document.querySelector('.hero');
  const bar = document.querySelector('.bar');
  if (hero && bar && 'IntersectionObserver' in window)
    new IntersectionObserver(([en]) => bar.classList.toggle('on-hero', en.isIntersecting), { rootMargin: '0px 0px -92% 0px' }).observe(hero);

  // Gişe: görününce sayı sıfırdan sayarak artar (data-count), çubuklar dolar (data-w → --w). Hareket azaltma açıksa hemen son hal.
  const dots = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const counters = document.querySelectorAll('[data-count]');
  const bars = document.querySelectorAll('[data-w]');
  const fillBar = (el) => el.style.setProperty('--w', el.dataset.w);
  const count = (el) => {
    const end = Number(el.dataset.count);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1800);
      el.textContent = dots(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (reduce || !('IntersectionObserver' in window)) bars.forEach(fillBar);
  else {
    const io3 = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          if (en.target.dataset.count) count(en.target);
          else fillBar(en.target);
          io3.unobserve(en.target);
        }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    counters.forEach((el) => io3.observe(el));
    bars.forEach((el) => io3.observe(el));
  }

  // Kaydırma ile hareket eden öğeler: data-speed (paralaks). Değer --p değişkenine yazılır.
  const par = [...document.querySelectorAll('[data-speed]')];
  if (par.length && !reduce) {
    let ticking = false;
    const run = () => {
      const vh = innerHeight;
      for (const el of par) {
        const r = el.getBoundingClientRect();
        const mid = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 arası
        el.style.setProperty('--p', (mid * Number(el.dataset.speed)).toFixed(3));
      }
      ticking = false;
    };
    addEventListener('scroll', () => !ticking && (ticking = requestAnimationFrame(run)), { passive: true });
    addEventListener('resize', run);
    run();
  }

  // Sayfa kaydırma oranı (ilerleme çubuğu vb.): --scroll (0 … 1).
  const setScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--scroll', h > 0 ? (scrollY / h).toFixed(4) : 0);
    document.documentElement.classList.toggle('past-hero', scrollY > innerHeight * 0.7);
  };
  addEventListener('scroll', setScroll, { passive: true });
  setScroll();

  // Arkada sessiz oynayan fragman (kontrolsüz, döngüde). Video yalnız gerçekten oynamaya başlayınca belirir;
  // oynamazsa zemin olduğu gibi kalır. Hareket azaltma ya da veri tasarrufu açıksa hiç yüklenmez.
  const quiet = reduce || (navigator.connection && navigator.connection.saveData);
  const YT = 'https://www.youtube-nocookie.com';
  document.querySelectorAll('[data-bgvideo]').forEach((el) => {
    const box = el.querySelector('.bg-video');
    const id = el.dataset.bgvideo;
    if (quiet || !box || !id) return;
    const f = document.createElement('iframe');
    f.src = `${YT}/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(id)}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
    f.title = '';
    f.tabIndex = -1;
    f.allow = 'autoplay; encrypted-media';
    f.addEventListener('load', () => f.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), YT));
    box.replaceChildren(f);
  });
  addEventListener('message', (e) => {
    if (e.origin !== YT || typeof e.data !== 'string') return;
    let d;
    try { d = JSON.parse(e.data); } catch { return; }
    if (!d.info || d.info.playerState !== 1) return;
    document.querySelectorAll('.bg-video iframe').forEach((f) => {
      if (f.contentWindow === e.source) setTimeout(() => f.classList.add('on'), 500);
    });
  });

  // İmlece göre hafif eğilen sahne (data-tilt): --mx, --my (-1 … 1).
  const tilt = document.querySelector('[data-tilt]');
  if (tilt && matchMedia('(hover: hover)').matches && !reduce) {
    let raf = 0;
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const my = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tilt.style.setProperty('--mx', mx.toFixed(3));
        tilt.style.setProperty('--my', my.toFixed(3));
      });
    });
  }

  // Görünen bölümün numarasını yan göstergede işaretler (data-spy → .spy a[href="#id"]).
  const spied = document.querySelectorAll('[data-spy]');
  if (spied.length && 'IntersectionObserver' in window) {
    const marks = new Map([...document.querySelectorAll('.spy a')].map((a) => [a.getAttribute('href').slice(1), a]));
    const io2 = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          marks.forEach((a) => a.classList.remove('on'));
          marks.get(en.target.id)?.classList.add('on');
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    spied.forEach((el) => io2.observe(el));
  }
})();
