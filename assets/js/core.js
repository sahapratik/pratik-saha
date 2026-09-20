/* ==========================================================================
   PRATIK SAHA — CORE BEHAVIOUR
   One rAF loop drives Lenis, the cursor and all pointer smoothing. Nothing
   else is allowed to start its own loop. Every init is defensive: if a CDN
   script fails, content still ends up visible and interactive.
   ========================================================================== */
window.PS = window.PS || {};

(function (PS, W, D) {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function on(t, e, f, o) { if (t) t.addEventListener(e, f, o || false); }
  function make(tag, cls, html) {
    var n = D.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var reduced = W.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = W.matchMedia('(hover: hover) and (pointer: fine)');
  function noMotion() { return reduced.matches; }

  PS.$ = $; PS.$$ = $$; PS.on = on; PS.make = make; PS.esc = esc;
  PS.noMotion = noMotion;

  /* the single frame loop -------------------------------------------------- */
  var tasks = [];
  var looping = false;
  PS.onFrame = function (fn) { tasks.push(fn); startLoop(); };
  function startLoop() {
    if (looping) return;
    looping = true;
    (function frame(t) {
      for (var i = 0; i < tasks.length; i++) { try { tasks[i](t); } catch (e) {} }
      W.requestAnimationFrame(frame);
    })(0);
  }

  /* ── 01 · accessibility baseline ──────────────────────────────────────── */
  function initAccessibility() {
    /* keyboard users get focus rings; pointer users do not get them on click */
    on(D, 'keydown', function (e) { if (e.key === 'Tab') D.documentElement.classList.add('kb'); });
    on(D, 'mousedown', function () { D.documentElement.classList.remove('kb'); });

    /* anchor jumps must move real focus, not just the scroll position */
    $$('a[href^="#"]').forEach(function (a) {
      if (a.classList.contains('skip')) return;
      on(a, 'click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        var target = D.getElementById(id.slice(1));
        if (!target) return;
        e.preventDefault();
        if (PS.closeMenu && D.body.classList.contains('menu-open')) PS.closeMenu(true);
        PS.scrollTo(target);
        target.setAttribute('tabindex', '-1');
        setTimeout(function () { target.focus({ preventScroll: true }); }, 560);
      });
    });
  }

  /* ── 02 · smooth scroll (Lenis ⇄ ScrollTrigger) ───────────────────────── */
  var lenis = null;
  function initSmoothScroll() {
    var hasGsap = !!(W.gsap && W.ScrollTrigger);
    if (hasGsap) W.gsap.registerPlugin(W.ScrollTrigger);

    if (W.Lenis && !noMotion()) {
      try {
        lenis = new W.Lenis({
          duration: 1.05,
          easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
          smoothWheel: true,
          touchMultiplier: 1.6,
          wheelMultiplier: 1
        });
        PS.onFrame(function (t) { lenis.raf(t); });
        if (hasGsap) {
          lenis.on('scroll', W.ScrollTrigger.update);
          W.ScrollTrigger.scrollerProxy(D.body, { scrollTop: function () { return lenis.scroll; } });
        }
      } catch (e) { lenis = null; }
    }
    PS.lenis = lenis;

    PS.scrollTo = function (target, opts) {
      var o = opts || {};
      /* clear the fixed nav unless an explicit offset says otherwise */
      var off = o.offset != null ? o.offset : (typeof target === 'number' ? 0 : -72);
      if (lenis) { lenis.scrollTo(target, { offset: off, duration: 1.15 }); return; }
      var top = typeof target === 'number'
        ? target + off
        : target.getBoundingClientRect().top + W.pageYOffset + off;
      W.scrollTo({ top: Math.max(0, top), behavior: noMotion() ? 'auto' : 'smooth' });
    };
    PS.stopScroll = function () { if (lenis) lenis.stop(); };
    PS.startScroll = function () { if (lenis) lenis.start(); };
  }

  /* ── 03 · preloader — exits as soon as the page is usable ─────────────── */
  function initPreloader() {
    var pl = $('#preload');
    if (!pl) { D.body.classList.add('ready'); return; }
    var bar = $('.pl-bar i', pl);
    var pct = 0, done = false;

    function tick() {
      if (done) return;
      pct = Math.min(pct + (pct < 60 ? 14 : 6), 92);
      if (bar) bar.style.transform = 'scaleX(' + (pct / 100) + ')';
    }
    var iv = setInterval(tick, 90);

    function finish() {
      if (done) return;
      done = true;
      clearInterval(iv);
      if (bar) bar.style.transform = 'scaleX(1)';
      setTimeout(function () {
        pl.classList.add('done');
        D.body.classList.add('ready');
        setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 620);
        W.dispatchEvent(new CustomEvent('ps:ready'));
      }, 140);
    }

    if (D.readyState === 'complete') finish();
    else on(W, 'load', finish);
    /* hard ceiling so a slow asset never holds the page hostage */
    setTimeout(finish, 2200);
  }

  /* ── 04 · scroll progress ─────────────────────────────────────────────── */
  function initScrollProgress() {
    var bar = $('#progress');
    if (!bar) return;
    var w = 0;
    PS.onFrame(function () {
      var h = D.documentElement.scrollHeight - W.innerHeight;
      var p = h > 0 ? clamp(W.pageYOffset / h, 0, 1) : 0;
      if (Math.abs(p - w) > 0.0008) { w = p; bar.style.width = (p * 100).toFixed(2) + '%'; }
    });
  }

  /* ── 05 · navigation + mobile menu ────────────────────────────────────── */
  function initNavigation() {
    var nav = $('#nav');
    var menu = $('#menu');
    var burger = $('#burger');
    if (!nav) return;

    var last = W.pageYOffset, ticking = false;
    function onScroll() {
      var y = W.pageYOffset;
      nav.classList.toggle('stuck', y > 40);
      /* hide going down, reveal going up — never while the menu is open */
      if (!D.body.classList.contains('menu-open')) {
        if (y > 320 && y > last + 6) nav.classList.add('hidden');
        else if (y < last - 6) nav.classList.remove('hidden');
      }
      last = y;
      ticking = false;
    }
    on(W, 'scroll', function () {
      if (!ticking) { ticking = true; W.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* full-screen menu with a real focus trap */
    if (menu && burger) {
      var opener = null;
      function focusables() {
        return $$('a[href], button:not([disabled])', menu)
          .filter(function (n) { return n.offsetParent !== null; });
      }
      function openMenu() {
        opener = D.activeElement;
        D.body.classList.add('menu-open');
        menu.classList.add('open');
        menu.removeAttribute('inert');
        burger.setAttribute('aria-expanded', 'true');
        nav.classList.remove('hidden');
        PS.stopScroll();
        $$('.m-item', menu).forEach(function (n, i) { n.style.transitionDelay = (0.05 + i * 0.045) + 's'; });
        var f = focusables();
        if (f[0]) setTimeout(function () { f[0].focus(); }, 60);
      }
      function closeMenu(keepFocus) {
        var hadFocus = menu.contains(D.activeElement);
        D.body.classList.remove('menu-open');
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        PS.startScroll();
        setTimeout(function () { if (!menu.classList.contains('open')) menu.setAttribute('inert', ''); }, 460);
        /* leaving via a link hands focus to the destination instead */
        if (!keepFocus && hadFocus && opener && opener.focus) opener.focus();
      }
      PS.closeMenu = closeMenu;
      menu.setAttribute('inert', '');

      on(burger, 'click', function () {
        menu.classList.contains('open') ? closeMenu() : openMenu();
      });
      on(menu, 'click', function (e) {
        var a = e.target.closest('a');
        if (a) closeMenu(true);
      });
      on(D, 'keydown', function (e) {
        if (!menu.classList.contains('open')) return;
        if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
        if (e.key !== 'Tab') return;
        var f = focusables();
        if (!f.length) return;
        var first = f[0], lastF = f[f.length - 1];
        if (e.shiftKey && D.activeElement === first) { e.preventDefault(); lastF.focus(); }
        else if (!e.shiftKey && D.activeElement === lastF) { e.preventDefault(); first.focus(); }
      });
    }

    /* scroll-spy on in-page links only */
    var spy = $$('.nav-link[data-spy]');
    if (spy.length) {
      var sections = spy.map(function (l) { return D.getElementById(l.getAttribute('data-spy')); })
                        .filter(Boolean);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          spy.forEach(function (l) {
            l.setAttribute('aria-current', l.getAttribute('data-spy') === en.target.id ? 'true' : 'false');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ── 06 · custom cursor (fine pointer only) ───────────────────────────── */
  function initCursor() {
    if (!finePointer.matches || noMotion()) return;
    var dot = make('div'); dot.id = 'cur-dot'; dot.setAttribute('aria-hidden', 'true');
    var ring = make('div'); ring.id = 'cur-ring'; ring.setAttribute('aria-hidden', 'true');
    var label = make('div'); label.id = 'cur-label'; label.setAttribute('aria-hidden', 'true');
    D.body.appendChild(dot); D.body.appendChild(ring); D.body.appendChild(label);
    D.documentElement.classList.add('has-cursor');

    var x = W.innerWidth / 2, y = W.innerHeight / 2, rx = x, ry = y;
    on(D, 'mousemove', function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    on(D, 'mouseleave', function () { dot.style.opacity = ring.style.opacity = '0'; });
    on(D, 'mouseenter', function () { dot.style.opacity = ring.style.opacity = '1'; });

    PS.onFrame(function () {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      label.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    });

    /* one delegated listener rather than per-element handlers */
    on(D, 'mouseover', function (e) {
      var t = e.target.closest('[data-cursor]');
      if (t) {
        label.textContent = t.getAttribute('data-cursor');
        D.body.classList.add('cur-label');
        D.body.classList.remove('cur-link');
        return;
      }
      if (e.target.closest('a,button,input,textarea,label,[role="button"]')) {
        D.body.classList.add('cur-link');
        D.body.classList.remove('cur-label');
        return;
      }
      D.body.classList.remove('cur-link', 'cur-label');
    });
  }

  /* ── 07 · reveal animations ───────────────────────────────────────────── */
  function initRevealAnimations(root) {
    var nodes = $$('.reveal, .line-reveal, .clip-reveal, .draw', root);
    if (!nodes.length) return;
    if (noMotion() || !('IntersectionObserver' in W)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { if (!n.classList.contains('in')) io.observe(n); });
  }

  /* ── 08 · card tilt + glare ───────────────────────────────────────────── */
  var tiltCards = [];
  function initCardTilt(root) {
    if (!finePointer.matches || noMotion()) return;
    $$('.tilt', root).forEach(function (shell) {
      var card = $('.card', shell);
      if (!card || card.__tilt) return;
      card.__tilt = true;
      var max = parseFloat(shell.getAttribute('data-tilt') || '5');
      var state = { tx: 0, ty: 0, cx: 0, cy: 0, active: false };

      on(shell, 'pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = shell.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        state.tx = (py - 0.5) * -2 * max;   /* rotateX */
        state.ty = (px - 0.5) * 2 * max;    /* rotateY */
        state.active = true;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      on(shell, 'pointerleave', function () { state.active = false; state.tx = 0; state.ty = 0; });
      tiltCards.push({ card: card, s: state });
    });

    if (tiltCards.length && !initCardTilt.__loop) {
      initCardTilt.__loop = true;
      PS.onFrame(function () {
        for (var i = 0; i < tiltCards.length; i++) {
          var t = tiltCards[i];
          /* spring-like return: same easing in and out, never a snap */
          t.s.cx += (t.s.tx - t.s.cx) * 0.11;
          t.s.cy += (t.s.ty - t.s.cy) * 0.11;
          if (Math.abs(t.s.cx) < 0.004 && Math.abs(t.s.cy) < 0.004 && !t.s.active) {
            if (t.card.style.transform) t.card.style.transform = '';
            continue;
          }
          t.card.style.transform =
            'rotateX(' + t.s.cx.toFixed(3) + 'deg) rotateY(' + t.s.cy.toFixed(3) + 'deg) translateZ(0)';
        }
      });
    }
  }

  /* ── 09 · magnetic buttons ────────────────────────────────────────────── */
  function initMagneticButtons(root) {
    if (!finePointer.matches || noMotion()) return;
    $$('[data-magnetic]', root).forEach(function (el) {
      if (el.__mag) return;
      el.__mag = true;
      var pull = parseFloat(el.getAttribute('data-magnetic') || '7');
      var tx = 0, ty = 0, cx = 0, cy = 0, live = false;

      on(el, 'pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * pull * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * pull * 2;
        if (!live) { live = true; step(); }
      });
      on(el, 'pointerleave', function () { tx = 0; ty = 0; });

      function step() {
        cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
        if (Math.abs(cx) < 0.05 && Math.abs(cy) < 0.05 && !tx && !ty) {
          el.style.transform = ''; live = false; return;
        }
        el.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
        W.requestAnimationFrame(step);
      }
    });
  }

  /* ── 10 · marquee ─────────────────────────────────────────────────────── */
  function initMarquee(root) {
    $$('.marquee', root).forEach(function (m) {
      var track = $('.marquee__track', m);
      if (!track || track.__mq) return;
      track.__mq = true;
      /* duplicate once so the -50% keyframe loops seamlessly */
      track.innerHTML += track.innerHTML;
      track.setAttribute('aria-hidden', 'false');
    });
  }

  /* ── 11 · count-up numbers ────────────────────────────────────────────── */
  function initCounters(root) {
    var nums = $$('[data-count]', root);
    if (!nums.length) return;
    if (noMotion()) {
      nums.forEach(function (n) { n.textContent = n.getAttribute('data-count') + (n.getAttribute('data-suffix') || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var t0 = null, dur = 1250;
        (function run(t) {
          if (t0 === null) t0 = t;
          var p = clamp((t - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) W.requestAnimationFrame(run);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ── 12 · lightbox ────────────────────────────────────────────────────── */
  var LB = { items: [], i: 0, opener: null, el: null };
  function buildLightbox() {
    if (LB.el) return LB.el;
    var lb = make('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Project viewer');
    lb.setAttribute('inert', '');
    lb.innerHTML =
      '<div class="lb-shell">' +
        '<div class="lb-stage">' +
          '<img id="lb-img" alt=""/>' +
          '<video id="lb-video" playsinline controls controlslist="nodownload noremoteplayback" ' +
            'disablepictureinpicture preload="metadata" style="display:none"></video>' +
          '<button class="lb-close" id="lb-close" aria-label="Close viewer">&#10005;</button>' +
        '</div>' +
        '<div class="lb-side">' +
          '<div><div class="lb-idx" id="lb-idx"></div></div>' +
          '<div><div class="lb-cat" id="lb-cat"></div><h2 class="lb-title" id="lb-title"></h2></div>' +
          '<p class="lb-desc" id="lb-desc"></p>' +
          '<div class="lb-tags" id="lb-tags"></div>' +
          '<div class="lb-nav">' +
            '<button class="lb-arr" id="lb-prev" aria-label="Previous">&#8592;</button>' +
            '<span class="lb-count" id="lb-count"></span>' +
            '<button class="lb-arr" id="lb-next" aria-label="Next">&#8594;</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    D.body.appendChild(lb);
    LB.el = lb;

    on($('#lb-close', lb), 'click', closeLB);
    on($('#lb-prev', lb), 'click', function () { step(-1); });
    on($('#lb-next', lb), 'click', function () { step(1); });
    on(lb, 'click', function (e) { if (e.target === lb) closeLB(); });

    /* swipe */
    var sx = 0, sy = 0, tracking = false;
    on(lb, 'touchstart', function (e) {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    on(lb, 'touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    on(D, 'keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'Tab') {
        var f = $$('button', lb).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], lastF = f[f.length - 1];
        if (e.shiftKey && D.activeElement === first) { e.preventDefault(); lastF.focus(); }
        else if (!e.shiftKey && D.activeElement === lastF) { e.preventDefault(); first.focus(); }
      }
    });
    return lb;
  }

  function render() {
    var lb = LB.el, it = LB.items[LB.i];
    if (!it) return;
    var img = $('#lb-img', lb), vid = $('#lb-video', lb);
    vid.pause();
    if (it.type === 'video') {
      img.style.display = 'none'; img.removeAttribute('src');
      vid.style.display = '';
      vid.poster = PS.asset(it.poster || '');
      vid.src = PS.asset(it.src);
      vid.setAttribute('aria-label', it.title + ' — video');
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    } else {
      vid.style.display = 'none'; vid.removeAttribute('src'); vid.load();
      img.style.display = '';
      img.src = PS.asset(it.src);
      img.alt = it.alt || (it.title + (it.cat ? ' — ' + it.cat : '') + ' by Pratik Saha');
    }
    $('#lb-idx', lb).textContent = String(LB.i + 1).padStart(2, '0') + ' / ' + String(LB.items.length).padStart(2, '0');
    $('#lb-cat', lb).textContent = [it.cat, it.year].filter(Boolean).join(' · ');
    $('#lb-title', lb).textContent = it.title || '';
    $('#lb-desc', lb).textContent = it.desc || '';
    $('#lb-tags', lb).innerHTML = (it.tags || []).map(function (t) {
      return '<span class="lb-tag">' + esc(t) + '</span>';
    }).join('');
    $('#lb-count', lb).textContent = (LB.i + 1) + ' of ' + LB.items.length;
  }
  function step(d) {
    if (!LB.items.length) return;
    LB.i = (LB.i + d + LB.items.length) % LB.items.length;
    render();
  }
  function closeLB() {
    var lb = LB.el;
    if (!lb) return;
    var vid = $('#lb-video', lb);
    if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); }
    lb.classList.remove('open');
    lb.setAttribute('inert', '');
    D.body.classList.remove('lb-open');
    PS.startScroll();
    if (LB.opener && LB.opener.focus) LB.opener.focus();
  }
  function openLB(items, index) {
    var lb = buildLightbox();
    LB.items = items || []; LB.i = index || 0; LB.opener = D.activeElement;
    render();
    lb.removeAttribute('inert');
    lb.classList.add('open');
    D.body.classList.add('lb-open');
    PS.stopScroll();
    setTimeout(function () { var c = $('#lb-close', lb); if (c) c.focus(); }, 80);
  }
  PS.lightbox = { open: openLB, close: closeLB };
  function initLightbox() { /* built lazily on first open */ }

  /* ── 13 · FAQ accordion ───────────────────────────────────────────────── */
  function initFaq(root) {
    $$('.faq-q', root).forEach(function (btn) {
      if (btn.__faq) return;
      btn.__faq = true;
      var panel = D.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var inner = panel.firstElementChild;

      function setOpen(open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = false;
        if (noMotion()) { panel.style.height = open ? 'auto' : '0px'; if (!open) panel.hidden = true; return; }
        if (open) {
          panel.style.height = inner.offsetHeight + 'px';
          var done = function () { panel.style.height = 'auto'; panel.removeEventListener('transitionend', done); };
          panel.addEventListener('transitionend', done);
        } else {
          panel.style.height = inner.offsetHeight + 'px';
          void panel.offsetHeight;
          panel.style.height = '0px';
        }
      }
      on(btn, 'click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        /* one open at a time reads calmer than an accordion of open panels */
        if (!open) {
          $$('.faq-q[aria-expanded="true"]', root).forEach(function (other) {
            if (other !== btn) other.click();
          });
        }
        setOpen(!open);
      });
      /* native <button> already handles Enter and Space */
    });
  }

  /* ── 14 · back to top ─────────────────────────────────────────────────── */
  function initBackToTop() {
    var btn = $('#to-top');
    if (!btn) return;
    on(btn, 'click', function () { PS.scrollTo(0); });
    var shown = false;
    on(W, 'scroll', function () {
      var should = W.pageYOffset > W.innerHeight * 1.2;
      if (should !== shown) { shown = should; btn.classList.toggle('show', should); }
    }, { passive: true });
  }

  /* ── 15 · video hygiene: only play what is on screen and visible ──────── */
  function initVideoGuard(root) {
    var vids = $$('video[data-auto]', root);
    if (!vids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !D.hidden && !noMotion()) {
          if (!v.src && v.dataset.src) v.src = PS.asset(v.dataset.src);
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: 0.28 });
    vids.forEach(function (v) { io.observe(v); });
    on(D, 'visibilitychange', function () {
      if (D.hidden) vids.forEach(function (v) { v.pause(); });
    });
  }

  /* ── boot ─────────────────────────────────────────────────────────────── */
  PS.initAccessibility = initAccessibility;
  PS.initSmoothScroll = initSmoothScroll;
  PS.initNavigation = initNavigation;
  PS.initCursor = initCursor;
  PS.initRevealAnimations = initRevealAnimations;
  PS.initCardTilt = initCardTilt;
  PS.initMagneticButtons = initMagneticButtons;
  PS.initMarquee = initMarquee;
  PS.initLightbox = initLightbox;
  PS.initFaq = initFaq;
  PS.initCounters = initCounters;
  PS.initVideoGuard = initVideoGuard;
  PS.initPreloader = initPreloader;
  PS.initScrollProgress = initScrollProgress;
  PS.initBackToTop = initBackToTop;

  /* re-runnable: call after injecting new DOM (filters, grids) */
  PS.enhance = function (root) {
    initRevealAnimations(root);
    initCardTilt(root);
    initMagneticButtons(root);
    initVideoGuard(root);
  };

  PS.boot = function (pageInit) {
    function go() {
      initSmoothScroll();
      initAccessibility();
      initNavigation();
      initCursor();
      initScrollProgress();
      initBackToTop();
      initMarquee();
      initFaq();
      initCounters();
      try { if (pageInit) pageInit(); } catch (e) { if (W.console) console.error(e); }
      PS.enhance();
      initPreloader();
      if (W.ScrollTrigger) setTimeout(function () { W.ScrollTrigger.refresh(); }, 300);
    }
    if (D.readyState === 'loading') on(D, 'DOMContentLoaded', go);
    else go();
  };
})(window.PS, window, document);
