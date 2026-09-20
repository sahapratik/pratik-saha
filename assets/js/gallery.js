/* ==========================================================================
   PRATIK SAHA — GALLERY ENGINE
   Shared by /photography/ and /design/. Builds a true masonry grid from each
   asset's real pixel dimensions, so nothing is cropped and nothing shifts.
   ========================================================================== */
(function (PS, W, D) {
  'use strict';
  var $ = PS.$, $$ = PS.$$, on = PS.on, esc = PS.esc;

  var ROW = 6;   /* grid-auto-rows, px */
  var GAP = 16;  /* must match --gal-gap in CSS */

  function columnsFor(width) {
    if (width < 560) return 1;
    if (width < 900) return 2;
    if (width < 1360) return 3;
    return 4;
  }

  function Gallery(opts) {
    this.host = opts.host;
    this.items = opts.items;
    this.filter = 'all';
    this.matcher = opts.matcher || function (item, f) { return f === 'all' || item.cat === f; };
    this.cursorLabel = opts.cursorLabel || 'View';
    this.render();
    this.bind();
  }

  Gallery.prototype.visible = function () {
    var self = this;
    return this.items.filter(function (i) { return self.matcher(i, self.filter); });
  };

  Gallery.prototype.cellHTML = function (item, i) {
    var isVideo = item.type === 'video';
    var media = isVideo
      ? '<img src="' + PS.asset(item.poster) + '" alt="' + esc(item.alt || (item.title + ' — video still')) +
        '" width="' + item.w + '" height="' + item.h + '" loading="lazy" decoding="async"/>' +
        '<video class="cell-vid" muted loop playsinline preload="none" data-auto data-src="' + PS.asset(item.preview) +
        '" aria-hidden="true" tabindex="-1"></video>' +
        '<span class="cell-badge" aria-hidden="true">' + (item.dur ? item.dur.toFixed(0) + 's' : 'Video') + '</span>'
      : '<img src="' + PS.asset(item.thumb) + '" alt="' + esc(item.alt || (item.title + ' — ' + (item.tags || []).join(', ') + ' by Pratik Saha')) +
        '" width="' + item.w + '" height="' + item.h + '" loading="lazy" decoding="async"/>';

    return '<figure class="cell tilt" data-tilt="4" data-id="' + item.id + '">' +
      '<button class="cell-btn card" data-cursor="' + esc(isVideo ? 'Play' : this.cursorLabel) + '" aria-label="Open ' + esc(item.title) + '">' +
        '<span class="card__num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="card__media" style="display:block;height:100%">' + media + '</span>' +
        '<span class="card__veil" aria-hidden="true"></span>' +
        '<span class="card__glare" aria-hidden="true"></span>' +
        '<span class="card__edge" aria-hidden="true"></span>' +
        '<span class="card__body">' +
          '<span style="min-width:0"><span class="card__cat">' + esc((item.tags || [])[0] || '') + '</span>' +
          '<span class="card__title" style="display:block">' + esc(item.title) + '</span></span>' +
          '<span class="card__arrow" aria-hidden="true">&#8594;</span>' +
        '</span>' +
      '</button>' +
      '<figcaption class="vh">' + esc(item.title) + ' — ' + esc(item.desc || '') + '</figcaption>' +
    '</figure>';
  };

  Gallery.prototype.render = function () {
    var list = this.visible();
    var self = this;
    this.host.innerHTML = list.map(function (it, i) { return self.cellHTML(it, i); }).join('');
    this.layout();
    PS.enhance(this.host);
  };

  /* size every cell from its real aspect ratio */
  Gallery.prototype.layout = function () {
    var host = this.host;
    var width = host.clientWidth;
    if (!width) return;
    var cols = columnsFor(width);
    host.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    var colW = (width - GAP * (cols - 1)) / cols;

    $$('.cell', host).forEach(function (cell) {
      var img = $('img', cell);
      var w = parseFloat(img.getAttribute('width')) || 1;
      var h = parseFloat(img.getAttribute('height')) || 1;
      var ratio = w / h;
      /* wide landscape earns two columns when there is room for it */
      var span = (cols >= 3 && ratio > 1.45) ? 2 : 1;
      if (span > cols) span = cols;
      var cw = colW * span + GAP * (span - 1);
      var ch = cw / ratio;
      cell.style.gridColumn = 'span ' + span;
      cell.style.gridRowEnd = 'span ' + Math.max(1, Math.round((ch + GAP) / (ROW + GAP)));
    });
  };

  Gallery.prototype.bind = function () {
    var self = this;

    on(this.host, 'click', function (e) {
      var fig = e.target.closest('.cell');
      if (!fig) return;
      var id = parseInt(fig.getAttribute('data-id'), 10);
      var list = self.visible();
      var idx = 0;
      for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
      PS.lightbox.open(list.map(function (it) {
        return {
          type: it.type === 'video' ? 'video' : 'image',
          src: it.type === 'video' ? it.full : it.full,
          poster: it.poster,
          title: it.title,
          cat: (it.tags || [])[0] || '',
          year: it.year || '',
          desc: it.desc,
          tags: it.tags,
          alt: it.alt || (it.title + ' by Pratik Saha')
        };
      }), idx);
    });

    var t = null;
    on(W, 'resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        self.layout();
        if (W.ScrollTrigger) W.ScrollTrigger.refresh();
      }, 140);
    }, { passive: true });

    /* images that finish decoding after first layout can change nothing,
       because width/height are declared — but re-measure once for safety */
    on(W, 'load', function () { self.layout(); });
  };

  Gallery.prototype.setFilter = function (f) {
    if (f === this.filter) return;
    this.filter = f;
    var host = this.host;
    if (PS.noMotion()) { this.render(); return; }
    host.style.transition = 'opacity .24s ease';
    host.style.opacity = '0';
    var self = this;
    setTimeout(function () {
      self.render();
      host.style.opacity = '1';
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
    }, 240);
  };

  /* ── filter bar ───────────────────────────────────────────────────────── */
  function initFilters(bar, gallery, counts) {
    if (!bar) return;
    $$('.filter', bar).forEach(function (btn) {
      var key = btn.getAttribute('data-filter');
      var n = btn.querySelector('b');
      if (n && counts && counts[key] != null) n.textContent = counts[key];
      on(btn, 'click', function () {
        $$('.filter', bar).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        gallery.setFilter(key);
        /* keep the active pill in view on a narrow scrolling bar */
        if (btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: PS.noMotion() ? 'auto' : 'smooth' });
      });
    });
  }

  PS.Gallery = Gallery;
  PS.initFilters = initFilters;

  /* ── gallery progress indicator ───────────────────────────────────────── */
  PS.initGalleryProgress = function (sectionSel, labelEl) {
    var section = $(sectionSel);
    if (!section || !labelEl) return;
    var ticking = false;
    function update() {
      var r = section.getBoundingClientRect();
      var total = r.height - W.innerHeight;
      var done = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
      var p = total > 0 ? done / total : (r.top < 0 ? 1 : 0);
      labelEl.textContent = Math.round(p * 100) + '%';
      labelEl.parentNode.classList.toggle('show', r.top < W.innerHeight * 0.4 && r.bottom > 0);
      ticking = false;
    }
    on(W, 'scroll', function () {
      if (!ticking) { ticking = true; W.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  };
})(window.PS, window, document);
