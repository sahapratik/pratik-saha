/* ==========================================================================
   PRATIK SAHA — DESIGN PAGE
   Hero loop video (guarded), archive gallery with mixed type/kind filters,
   CreativeWork structured data built from the real archive.
   ========================================================================== */
(function (PS, W, D) {
  'use strict';
  var $ = PS.$, $$ = PS.$$, on = PS.on;

  /* ── hero ──────────────────────────────────────────────────────────────── */
  function initHero() {
    var lines = $$('#dz-title .ln');
    var soft = [$('#dzEye'), $('#dzFoot')];
    var outline = $('#dzOutline');

    function settle() {
      lines.forEach(function (l) { if (l.firstElementChild) l.firstElementChild.style.transform = 'none'; });
      soft.forEach(function (n) { if (n) n.style.opacity = '1'; });
      if (outline) outline.classList.add('filled');
    }
    if (PS.noMotion()) { settle(); return; }

    function play() {
      lines.forEach(function (l, i) {
        var s = l.firstElementChild;
        if (!s) return;
        s.style.transition = 'transform 1.15s cubic-bezier(.16,1,.3,1) ' + (0.06 + i * 0.12) + 's';
        s.style.transform = 'none';
      });
      soft.forEach(function (n, i) {
        if (!n) return;
        n.style.transition = 'opacity .8s ease ' + (0.45 + i * 0.12) + 's';
        W.requestAnimationFrame(function () { n.style.opacity = '1'; });
      });
      setTimeout(function () { if (outline) outline.classList.add('filled'); }, 880);
    }
    if (D.body.classList.contains('ready')) play();
    else on(W, 'ps:ready', play);

    if (W.gsap && W.ScrollTrigger) {
      W.gsap.to('.hero-plate', {
        yPercent: 8, scale: 1.06, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
      });
      W.gsap.to('#dz-title', {
        yPercent: -12, opacity: 0.4, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
  }

  /* The hero loop is the only auto-playing video on the page. It is attached
     after the page is interactive, never on reduced motion, and released the
     moment it leaves the viewport or the tab is hidden. */
  function initHeroVideo() {
    var v = $('#heroVideo');
    if (!v || !PS.DESIGN_HERO) return;
    if (PS.noMotion()) return;               /* poster stays, nothing downloads */

    var attached = false, inView = true;

    function attach() {
      if (attached) return;
      attached = true;
      v.src = PS.asset(PS.DESIGN_HERO.loop);
      v.load();
    }
    function tryPlay() {
      if (!inView || D.hidden) return;
      attach();
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused — poster remains */ });
    }

    on(v, 'playing', function () { v.classList.add('on'); });
    on(v, 'pause', function () { if (D.hidden || !inView) v.classList.remove('on'); });

    if ('IntersectionObserver' in W) {
      new W.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          inView = e.isIntersecting;
          if (inView) tryPlay(); else { v.pause(); v.classList.remove('on'); }
        });
      }, { threshold: 0.15 }).observe(v);
    }

    on(D, 'visibilitychange', function () {
      if (D.hidden) { v.pause(); v.classList.remove('on'); } else tryPlay();
    });

    if (D.body.classList.contains('ready')) tryPlay();
    else on(W, 'ps:ready', tryPlay);
  }

  /* ── structured data ───────────────────────────────────────────────────── */
  function initSchema() {
    var node = $('#workSchema');
    if (!node) return;
    var origin = PS.SITE.origin;
    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': origin + '/design/#collection',
      name: 'Pratik Saha — Design & Branding Portfolio',
      url: origin + '/design/',
      author: { '@type': 'Person', '@id': origin + '/#pratik', name: 'Pratik Saha' },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PS.DESIGN.length,
        itemListElement: PS.DESIGN.map(function (d, i) {
          var isVideo = d.type === 'video';
          var work = {
            '@type': isVideo ? 'VideoObject' : 'CreativeWork',
            name: d.title,
            description: d.desc,
            url: origin + '/design/',
            creditText: 'Pratik Saha',
            creator: { '@type': 'Person', '@id': origin + '/#pratik', name: 'Pratik Saha' },
            keywords: (d.tags || []).join(', ')
          };
          if (isVideo) {
            work.thumbnailUrl = origin + '/' + d.poster;
            work.contentUrl = origin + '/' + d.full;
            if (d.dur) work.duration = 'PT' + Math.round(d.dur) + 'S';
          } else {
            work.image = origin + '/' + d.full;
            work.thumbnailUrl = origin + '/' + d.thumb;
          }
          return { '@type': 'ListItem', position: i + 1, item: work };
        })
      }
    });
  }

  /* ── boot ──────────────────────────────────────────────────────────────── */
  PS.boot(function () {
    var gallery = new PS.Gallery({
      host: $('#galGrid'),
      items: PS.DESIGN,
      cursorLabel: 'View',
      /* filters mix format (static / video) with discipline (branding / campaign) */
      matcher: function (item, f) {
        return f === 'all' || item.type === f || item.kind === f;
      }
    });

    PS.initFilters($('#galFilters'), gallery, {
      all: PS.COUNTS.design,
      static: PS.COUNTS.statics,
      video: PS.COUNTS.films,
      branding: PS.DESIGN.filter(function (d) { return d.kind === 'branding'; }).length,
      campaign: PS.DESIGN.filter(function (d) { return d.kind === 'campaign'; }).length
    });

    PS.initGalleryProgress('#gallery', $('#galProgress b'));
    initSchema();
    initHero();
    initHeroVideo();
  });
})(window.PS, window, document);
