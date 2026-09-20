/* ==========================================================================
   PRATIK SAHA — PHOTOGRAPHY PAGE
   ========================================================================== */
(function (PS, W, D) {
  'use strict';
  var $ = PS.$, $$ = PS.$$, on = PS.on;

  function initHero() {
    var lines = $$('#ph-title .ln');
    var soft = [$('#phEye'), $('#phFoot')];
    var outline = $('#phOutline');

    function done() {
      lines.forEach(function (l) { l.firstElementChild.style.transform = 'none'; });
      soft.forEach(function (n) { if (n) n.style.opacity = '1'; });
      if (outline) outline.classList.add('filled');
    }
    if (PS.noMotion()) { done(); return; }

    function play() {
      lines.forEach(function (l, i) {
        var s = l.firstElementChild;
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
      W.gsap.to('.hero-plate img', {
        yPercent: 10, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
      });
      W.gsap.to('#ph-title', {
        yPercent: -12, opacity: 0.4, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
  }

  function initSchema() {
    var node = $('#gallerySchema');
    if (!node) return;
    var origin = PS.SITE.origin;
    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: 'Pratik Saha — Photography',
      url: origin + '/photography/',
      author: { '@type': 'Person', '@id': origin + '/#pratik', name: 'Pratik Saha' },
      numberOfItems: PS.PHOTOS.length,
      image: PS.PHOTOS.map(function (p) {
        return {
          '@type': 'ImageObject',
          contentUrl: origin + '/' + p.full,
          thumbnailUrl: origin + '/' + p.thumb,
          name: p.title,
          description: p.desc,
          width: p.w,
          height: p.h,
          creditText: 'Pratik Saha',
          creator: { '@type': 'Person', name: 'Pratik Saha' }
        };
      })
    });
  }

  PS.boot(function () {
    var gallery = new PS.Gallery({
      host: $('#galGrid'),
      items: PS.PHOTOS,
      cursorLabel: 'View'
    });
    PS.initFilters($('#galFilters'), gallery, {
      all: PS.COUNTS.photographs,
      nature: PS.COUNTS.nature,
      concert: PS.COUNTS.concert
    });
    PS.initGalleryProgress('#gallery', $('#galProgress b'));
    initSchema();
    initHero();
  });
})(window.PS, window, document);
