/* ==========================================================================
   PRATIK SAHA — HOME PAGE
   Everything here renders from PS.* data. No markup duplicates the data.
   ========================================================================== */
(function (PS, W, D) {
  'use strict';
  var $ = PS.$, $$ = PS.$$, on = PS.on, esc = PS.esc;

  /* ── hero: one orchestrated load, then scroll- and pointer-driven only ── */
  function initHero() {
    var title = $('#h-title');
    var saha = $('#hSaha');
    var lines = $$('#h-title .ln');
    var soft = ['#hEyebrow', '#hSay', '#hFacts', '#hActions'].map(function (s) { return $(s); });
    var stack = $('#hStack'), stackIn = $('#hStackIn');

    if (PS.noMotion()) {
      lines.forEach(function (l) { l.firstElementChild.style.transform = 'none'; });
      soft.forEach(function (n) { if (n) n.style.opacity = '1'; });
      if (saha) saha.classList.add('filled');
      return;
    }

    /* the single page-load sequence */
    function play() {
      lines.forEach(function (l, i) {
        var inner = l.firstElementChild;
        inner.style.transition = 'transform 1.15s cubic-bezier(.16,1,.3,1) ' + (0.06 + i * 0.12) + 's';
        inner.style.transform = 'none';
      });
      soft.forEach(function (n, i) {
        if (!n) return;
        n.style.transition = 'opacity .8s ease ' + (0.5 + i * 0.09) + 's, transform .9s cubic-bezier(.16,1,.3,1) ' + (0.5 + i * 0.09) + 's';
        n.style.transform = 'translateY(14px)';
        requestAnimationFrame(function () { n.style.opacity = '1'; n.style.transform = 'none'; });
      });
      /* the outline fills — the one moment the type changes state */
      setTimeout(function () { if (saha) saha.classList.add('filled'); }, 900);
    }
    if (D.body.classList.contains('ready')) play();
    else on(W, 'ps:ready', play);

    /* pointer depth — three layers, all under 14px of travel */
    if (W.matchMedia('(hover:hover) and (pointer:fine)').matches && stack && stackIn) {
      var tx = 0, ty = 0, cx = 0, cy = 0;
      on(W, 'pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        tx = (e.clientX / W.innerWidth - 0.5) * 2;
        ty = (e.clientY / W.innerHeight - 0.5) * 2;
      }, { passive: true });
      PS.onFrame(function () {
        cx += (tx - cx) * 0.055;
        cy += (ty - cy) * 0.055;
        if (Math.abs(cx - tx) < 0.0008 && Math.abs(cy - ty) < 0.0008) return;
        stackIn.style.transform = 'rotateY(' + (cx * 7).toFixed(2) + 'deg) rotateX(' + (-cy * 5).toFixed(2) + 'deg)';
        if (title) title.style.transform = 'translate3d(' + (cx * -7).toFixed(1) + 'px,' + (cy * -4).toFixed(1) + 'px,0)';
      });
    }

    /* scroll: headline drifts up and loosens, stack falls behind */
    if (W.gsap && W.ScrollTrigger) {
      W.gsap.to('#h-title', {
        yPercent: -14, scale: 0.94, opacity: 0.35, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
      W.gsap.to('#hFacts, #hActions, .h-cue', {
        opacity: 0, y: -18, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: '55% top', scrub: 0.5 }
      });
      W.gsap.to('#hStack', {
        yPercent: -22, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
    }
  }

  /* ── word-by-word pull quote ──────────────────────────────────────────── */
  function initPullQuote() {
    var q = $('#abPull');
    if (!q) return;
    var words = q.textContent.trim().split(/\s+/);
    q.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
    if (PS.noMotion()) { q.classList.add('in'); return; }
    $$('.w', q).forEach(function (w, i) { w.style.transitionDelay = (i * 0.045) + 's'; });
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting) return;
      q.classList.add('in'); o.disconnect();
    }, { threshold: 0.4 }).observe(q);
  }

  /* ── marquees ─────────────────────────────────────────────────────────── */
  function renderMarquees() {
    var d = $('#mqDisciplines');
    if (d) {
      d.innerHTML = PS.DISCIPLINES.map(function (t) {
        return '<span class="mq-word"><i aria-hidden="true"></i>' + esc(t) + '</span>';
      }).join('');
    }
    var t1 = $('#orgTrack1'), t2 = $('#orgTrack2');
    function orgHTML(list) {
      return list.map(function (o) {
        return '<div class="org"><img src="' + PS.asset('assets/logos/' + o.file) + '" alt="' + esc(o.alt) +
               '" loading="lazy" decoding="async" width="240" height="240"/></div>';
      }).join('');
    }
    if (t1) t1.innerHTML = orgHTML(PS.ORGS);
    if (t2) t2.innerHTML = orgHTML(PS.ORGS.slice().reverse());
  }

  /* ── experience timeline ──────────────────────────────────────────────── */
  function renderTimeline() {
    var host = $('#timeline');
    if (!host) return;
    host.innerHTML = PS.TIMELINE.map(function (t) {
      return '<li class="tl-item reveal">' +
        '<div class="tl-year">' + esc(t.year) + '</div>' +
        '<div class="tl-line"><span class="tl-node" aria-hidden="true"></span></div>' +
        '<div>' +
          '<h3 class="tl-role">' + esc(t.role) + '</h3>' +
          '<p class="tl-org">' + esc(t.org) + ' <span>· ' + esc(t.loc) + '</span></p>' +
          '<p class="tl-desc">' + esc(t.desc) + '</p>' +
          '<span class="tl-cat">' + esc(t.cat) + '</span>' +
        '</div></li>';
    }).join('');

    if (PS.noMotion() || !('IntersectionObserver' in W)) {
      $$('.tl-item', host).forEach(function (n) { n.classList.add('lit'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('lit'); });
    }, { rootMargin: '-25% 0px -35% 0px' });
    $$('.tl-item', host).forEach(function (n) { io.observe(n); });
  }

  /* ── selected work bento ──────────────────────────────────────────────── */
  var SPAN = { feature: 'b-feature', tall: 'b-tall', wide: 'b-wide', std: 'b-std' };
  function renderBento() {
    var host = $('#bento');
    if (!host) return;
    host.innerHTML = PS.WORK.map(function (w, i) {
      return '<div class="tilt ' + SPAN[w.span] + ' reveal" data-tilt="4.5" data-d="' + (i % 4) + '">' +
        '<a class="card" href="' + PS.asset(w.href) + '" data-cursor="View">' +
          '<span class="card__num">' + esc(w.n) + '</span>' +
          '<div class="card__media" style="height:100%">' +
            '<img src="' + PS.asset(w.media) + '" alt="' + esc(w.alt) + '" width="' + w.w + '" height="' + w.h +
            '" loading="lazy" decoding="async"/>' +
          '</div>' +
          '<span class="card__veil" aria-hidden="true"></span>' +
          '<span class="card__glare" aria-hidden="true"></span>' +
          '<span class="card__edge" aria-hidden="true"></span>' +
          '<div class="card__body">' +
            '<div><span class="card__cat">' + esc(w.cat) + '</span>' +
              '<h3 class="card__title">' + esc(w.title) + '</h3>' +
              '<span class="card__yr">' + esc(w.year) + '</span></div>' +
            '<span class="card__arrow" aria-hidden="true">&#8594;</span>' +
          '</div>' +
        '</a></div>';
    }).join('');
  }

  /* ── discipline teasers, built from the same records as the sub-pages ─── */
  function renderSplits() {
    var ph = $('#phSplit'), dz = $('#dzSplit');
    var c = PS.COUNTS;
    var phCount = $('#phCount'), dzCount = $('#dzCount');
    if (phCount) phCount.textContent = c.photographs + ' frames · ' + c.nature + ' nature · ' + c.concert + ' live';
    if (dzCount) dzCount.textContent = c.statics + ' statics · ' + c.films + ' films';

    function tile(o) {
      return '<div class="tilt reveal" data-tilt="4.5" data-d="' + o.d + '">' +
        '<a class="card" href="' + PS.asset(o.href) + '" data-cursor="View">' +
          '<span class="card__num">' + esc(o.n) + '</span>' +
          '<div class="card__media" style="height:100%">' +
            '<img src="' + PS.asset(o.img) + '" alt="' + esc(o.alt) + '" width="' + o.w + '" height="' + o.h +
            '" loading="lazy" decoding="async"/>' +
          '</div>' +
          '<span class="card__veil" aria-hidden="true"></span>' +
          '<span class="card__glare" aria-hidden="true"></span>' +
          '<span class="card__edge" aria-hidden="true"></span>' +
          '<div class="card__body">' +
            '<div><span class="card__cat">' + esc(o.cat) + '</span>' +
              '<h3 class="card__title">' + esc(o.title) + '</h3></div>' +
            '<span class="card__arrow" aria-hidden="true">&#8594;</span>' +
          '</div>' +
        '</a></div>';
    }

    if (ph) {
      var nat = PS.PHOTOS[13], con = PS.PHOTOS[19];
      ph.innerHTML =
        tile({ n:'01', d:1, href:'photography/', img:nat.thumb, w:nat.w, h:nat.h, cat:'Nature & travel · ' + PS.COUNTS.nature + ' frames',
               title:'Rivers & hill tracts', alt:'Late sun over a valley of cloud in the Bangladesh hill tracts, photographed by Pratik Saha' }) +
        tile({ n:'02', d:2, href:'photography/', img:con.thumb, w:con.w, h:con.h, cat:'Live & concert · ' + PS.COUNTS.concert + ' frames',
               title:'Stage light', alt:'A vocalist lit by clashing red and blue stage wash, photographed live by Pratik Saha' });
    }
    if (dz) {
      var st = PS.DESIGN[2], vd = PS.DESIGN[14];
      dz.innerHTML =
        tile({ n:'01', d:1, href:'design/', img:st.thumb, w:st.w, h:st.h, cat:'Campaign & brand · ' + PS.COUNTS.statics + ' pieces',
               title:'Static design', alt:'Hustlers Half Court Battle Season 2 campaign poster designed by Pratik Saha' }) +
        tile({ n:'02', d:2, href:'design/', img:vd.poster, w:vd.w, h:vd.h, cat:'Motion & colour · ' + PS.COUNTS.films + ' films',
               title:'Video edits', alt:'Still from the cinematic montage edit "Not Loud. Just Legendary." by Pratik Saha' });
    }
  }

  /* ── horizontal rail ──────────────────────────────────────────────────── */
  function initRail() {
    var pin = $('#railPin'), track = $('#railTrack'), bar = $('#railBar');
    if (!pin || !track) return;

    track.innerHTML = PS.RAIL.map(function (r) {
      return '<article class="rail-card">' +
        '<span class="rail-card__n">' + esc(r.n) + '</span>' +
        '<img src="' + PS.asset(r.media) + '" alt="' + esc(r.title + ' — ' + r.cat + ' work by Pratik Saha') +
        '" width="' + r.w + '" height="' + r.h + '" loading="lazy" decoding="async"/>' +
        '<span class="rail-card__v" aria-hidden="true"></span>' +
        '<div class="rail-card__b">' +
          '<span class="card__cat">' + esc(r.cat) + ' · ' + esc(r.year) + '</span>' +
          '<h3 class="card__title">' + esc(r.title) + '</h3>' +
        '</div></article>';
    }).join('');

    var canPin = W.gsap && W.ScrollTrigger && !PS.noMotion() &&
                 W.matchMedia('(min-width: 900px)').matches;

    if (!canPin) {
      /* native scroller everywhere else — same content, no pin */
      pin.classList.add('rail-scroller');
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('role', 'region');
      pin.setAttribute('aria-label', 'Featured work, scroll sideways');
      if (bar) {
        on(pin, 'scroll', function () {
          var max = pin.scrollWidth - pin.clientWidth;
          bar.style.width = (12 + (max > 0 ? pin.scrollLeft / max : 0) * 88) + '%';
        }, { passive: true });
      }
      return;
    }

    var st = W.ScrollTrigger.create({
      trigger: pin,
      start: 'top top+=80',
      end: function () { return '+=' + Math.max(track.scrollWidth - W.innerWidth + 120, 1); },
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        var dist = Math.max(track.scrollWidth - W.innerWidth + 120, 0);
        track.style.transform = 'translate3d(' + (-self.progress * dist) + 'px,0,0)';
        if (bar) bar.style.width = (12 + self.progress * 88) + '%';
      }
    });
    PS.__railST = st;
  }

  /* ── capabilities accordion ───────────────────────────────────────────── */
  function renderCapabilities() {
    var host = $('#capList');
    if (!host) return;
    host.innerHTML = PS.CAPABILITIES.map(function (c, i) {
      var pid = 'cap-p-' + i;
      return '<div class="cap-row reveal" data-d="' + (i % 4) + '">' +
        '<button class="cap-btn" aria-expanded="' + (i === 0 ? 'true' : 'false') + '" aria-controls="' + pid + '">' +
          '<span class="cap-n">' + esc(c.n) + '</span>' +
          '<span class="cap-t">' + esc(c.group) + '</span>' +
          '<span class="cap-c">' + String(c.items.length).padStart(2, '0') + '</span>' +
        '</button>' +
        '<div class="cap-panel" id="' + pid + '"><div>' +
          c.items.map(function (it) { return '<span class="tag">' + esc(it) + '</span>'; }).join('') +
        '</div></div></div>';
    }).join('');

    $$('.cap-btn', host).forEach(function (btn) {
      var panel = D.getElementById(btn.getAttribute('aria-controls'));
      var inner = panel.firstElementChild;
      function set(open, instant) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (instant || PS.noMotion()) { panel.style.height = open ? 'auto' : '0px'; return; }
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
      btn.__set = set;
      set(btn.getAttribute('aria-expanded') === 'true', true);
      on(btn, 'click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        if (!open) {
          $$('.cap-btn[aria-expanded="true"]', host).forEach(function (o) { if (o !== btn) o.__set(false); });
        }
        set(!open);
      });
    });
  }

  /* ── principles / testimonials ────────────────────────────────────────── */
  function initPrinciples() {
    var stage = $('#prStage'), dots = $('#prDots');
    if (!stage) return;

    /* real testimonials take precedence the moment any are added to the data */
    var useReal = PS.TESTIMONIALS && PS.TESTIMONIALS.length > 0;
    var items = useReal
      ? PS.TESTIMONIALS.map(function (t) { return { quote: t.quote, name: t.name, role: [t.role, t.context].filter(Boolean).join(' · ') }; })
      : PS.PRINCIPLES.map(function (p) { return { quote: p.quote, name: 'Pratik Saha', role: p.label }; });

    stage.innerHTML = items.map(function (it, i) {
      return '<blockquote class="pr-slide' + (i === 0 ? ' on' : '') + '" id="pr-s-' + i + '" role="tabpanel"' +
        (i === 0 ? '' : ' aria-hidden="true"') + '>' +
        '<p class="pr-q">' + esc(it.quote) + '</p>' +
        '<footer class="pr-attr"><cite class="pr-name" style="font-style:normal">' + esc(it.name) + '</cite>' +
        '<span class="pr-role">' + esc(it.role) + '</span></footer></blockquote>';
    }).join('');

    if (dots) {
      dots.innerHTML = items.map(function (it, i) {
        return '<button class="pr-dot" role="tab" aria-selected="' + (i === 0) + '" aria-controls="pr-s-' + i +
               '" aria-label="Show statement ' + (i + 1) + ' of ' + items.length + '"></button>';
      }).join('');
    }

    var idx = 0;
    var slides = $$('.pr-slide', stage);
    var dotEls = dots ? $$('.pr-dot', dots) : [];
    function show(n) {
      idx = (n + items.length) % items.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('on', i === idx);
        if (i === idx) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      dotEls.forEach(function (d, i) { d.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    }
    dotEls.forEach(function (d, i) { on(d, 'click', function () { show(i); stop(); }); });
    on($('#prNext'), 'click', function () { show(idx + 1); stop(); });
    on($('#prPrev'), 'click', function () { show(idx - 1); stop(); });

    /* auto-advance only while visible, and it stops for good once touched */
    var timer = null;
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    if (!PS.noMotion() && 'IntersectionObserver' in W) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && !timer) timer = setInterval(function () { show(idx + 1); }, 6500);
        else if (!e[0].isIntersecting) stop();
      }, { threshold: 0.3 }).observe(stage);
    }
  }

  /* ── FAQ: markup + matching JSON-LD, generated from one array ─────────── */
  function renderFaq() {
    var host = $('#faqList');
    if (!host) return;
    host.innerHTML = PS.FAQ.map(function (f, i) {
      var pid = 'faq-p-' + i;
      return '<div class="faq-item">' +
        '<h3 style="margin:0">' +
          '<button class="faq-q" aria-expanded="false" aria-controls="' + pid + '">' +
            '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span class="t">' + esc(f.q) + '</span>' +
            '<span class="ic" aria-hidden="true"></span>' +
          '</button>' +
        '</h3>' +
        '<div class="faq-a" id="' + pid + '" role="region"><div><p>' + esc(f.a) + '</p></div></div>' +
      '</div>';
    }).join('');

    /* structured data mirrors exactly what is on the page */
    var node = $('#faqSchema');
    if (node) {
      node.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: PS.FAQ.map(function (f) {
          return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
        })
      });
    }
    PS.initFaq(host);
  }

  /* ── contact form ─────────────────────────────────────────────────────
     No backend exists, so the form composes a real message and hands it to
     the visitor's mail client. It never claims to have sent anything.     */
  function initContactForm() {
    var form = $('#contactForm');
    if (!form) return;
    var ok = $('#formOk'), bad = $('#formBad'), badText = $('#formBadText');
    var msg = $('#cf-message'), count = $('#cf-count');

    if (msg && count) {
      on(msg, 'input', function () { count.textContent = msg.value.length + ' / 800'; });
    }

    var rules = {
      name:    function (v) { return v.trim().length >= 2; },
      email:   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      subject: function (v) { return v.trim().length >= 3; },
      message: function (v) { return v.trim().length >= 20; }
    };
    function fieldOf(input) { return input.closest('.field'); }
    function check(input, live) {
      var key = input.name;
      var wrap = fieldOf(input);
      var valid = rules[key] ? rules[key](input.value) : true;
      if (!live || wrap.classList.contains('touched')) {
        wrap.classList.toggle('invalid', !valid);
        input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      }
      return valid;
    }
    $$('input, textarea', form).forEach(function (input) {
      on(input, 'blur', function () { fieldOf(input).classList.add('touched'); check(input); });
      on(input, 'input', function () { check(input, true); });
    });

    on(form, 'submit', function (e) {
      e.preventDefault();
      ok.hidden = true; bad.hidden = true;
      var inputs = $$('input, textarea', form);
      var firstBad = null;
      inputs.forEach(function (i) {
        fieldOf(i).classList.add('touched');
        if (!check(i) && !firstBad) firstBad = i;
      });
      if (firstBad) {
        badText.textContent = 'Check the highlighted fields and try again.';
        bad.hidden = false;
        firstBad.focus();
        return;
      }
      var name = $('#cf-name').value.trim();
      var email = $('#cf-email').value.trim();
      var subject = $('#cf-subject').value.trim();
      var body = msg.value.trim() + '\n\n—\n' + name + '\n' + email;
      W.location.href = 'mailto:' + PS.SITE.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      ok.hidden = false;
    });
  }

  /* ── boot ─────────────────────────────────────────────────────────────── */
  PS.boot(function () {
    renderMarquees();
    renderTimeline();
    renderBento();
    renderSplits();
    renderCapabilities();
    renderFaq();
    initPrinciples();
    initPullQuote();
    initContactForm();
    initRail();
    initHero();
    PS.initMarquee();
  });
})(window.PS, window, document);
