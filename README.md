# Pratik Saha — Portfolio

Creative direction, brand design and photography. Dhaka, Bangladesh.
Live: **https://pratiksahaa.vercel.app**

A static site. No build step, no bundler, no framework, no `node_modules`.
Three HTML pages plus a 404, one shared stylesheet, and a small classic-script
JavaScript layer. Everything deploys by copying the folder.

---

## 1. Structure

```
/
├── index.html                  Home — hero, about, experience, work, rail,
│                               capabilities, organisations, principles, FAQ, contact
├── photography/index.html      Photography archive (35 frames)
├── design/index.html           Design & motion archive (18 pieces)
├── 404.html                    Branded not-found page
│
├── assets/
│   ├── css/core.css            The entire shared design system
│   ├── js/
│   │   ├── data.js             SINGLE SOURCE OF TRUTH — all content, all paths
│   │   ├── core.js             Shared behaviour (nav, cursor, reveal, lightbox…)
│   │   ├── home.js             Home page only
│   │   ├── gallery.js          Masonry engine shared by both archive pages
│   │   ├── page-photography.js Photography page only
│   │   └── page-design.js      Design page only
│   ├── brand/                  Favicons, touch icons, Open Graph cards
│   └── logos/                  logo-01 … logo-15 (organisation marks)
│
├── photography/assets/photography/{nature,concert}/
│                               Each frame twice: `-thumb.jpg` (~1100px) and full (~2400px)
├── design/assets/design/static/ 13 pieces, thumb + full
├── design/assets/design/video/  5 films: `-poster.jpg`, `-preview.mp4`, full `.mp4`
├── design/assets/design/        hero-loop.mp4 + hero-poster.jpg
│
├── favicon.svg / favicon.ico
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── vercel.json
```

Page-specific CSS stays inline in that page's `<style>` block. Anything used by
more than one page lives in `core.css`. That keeps each page's critical CSS in
the first response while the shared sheet caches for a year.

---

## 2. How the JavaScript is wired

Scripts are **classic scripts with `defer`**, not ES modules. That is deliberate:
modules require a server and fail on `file://`, and they would force a build step
to avoid a request waterfall. Load order per page is always:

```
gsap → ScrollTrigger → lenis → data.js → core.js → <page>.js
```

Every library is optional. `core.js` checks for `window.gsap`, `window.ScrollTrigger`
and `window.Lenis` before touching them, so if a CDN is blocked the site degrades
to native scrolling and CSS transitions rather than breaking.

Everything hangs off one global, `PS`:

| Symbol | What it does |
| --- | --- |
| `PS.SITE` | Name, origin, email, phone, Instagram, locality |
| `PS.PHOTOS` | 35 records — title, description, tags, real pixel `w`/`h`, thumb, full |
| `PS.DESIGN` | 18 records — 13 `type:'static'`, 5 `type:'video'`; each also has a `kind` |
| `PS.WORK` `PS.RAIL` `PS.ORGS` `PS.CAPABILITIES` `PS.TIMELINE` `PS.PRINCIPLES` `PS.FAQ` | Section content |
| `PS.COUNTS` | Derived counts — never hand-typed, always computed from the arrays |
| `PS.base` / `PS.asset(p)` | Path resolution (see below) |
| `PS.lightbox` `PS.Gallery` `PS.enhance()` `PS.boot()` | Shared behaviour |

### Path resolution

Asset paths in `data.js` are stored **root-relative without a leading slash**:

```js
thumb: 'photography/assets/photography/nature/nature-01-thumb.jpg'
```

`PS.base` detects page depth from `location.pathname` (`'../'` inside
`/photography/` or `/design/`, `''` at root) and `PS.asset()` prefixes it. This is
why the same data file works from every page, from a sub-path deploy, and from
`file://` on the home page.

**If you move a page to a different depth, update the `PS.base` check in `data.js`.**

---

## 3. Editing content

Almost nothing needs an HTML edit. In order of how often you'll want it:

**Add a photograph**
1. Drop `nature-19-thumb.jpg` and `nature-19.jpg` into the right folder.
2. Append a record to `PS.PHOTOS` in `data.js`. `w` and `h` must be the **real
   pixel dimensions of the full image** — the masonry computes row spans from
   them before the image decodes, which is what stops the grid from jumping.
3. Bump the matching number in `PS.COUNTS`.

Filter counts, the gallery, the `ImageGallery` JSON-LD and the hero stat all
update from that one record.

**Add a design piece** — same, but into `PS.DESIGN`. Set `type` (`'static'` or
`'video'`) and `kind` (`'branding'`, `'campaign'` or `'motion'`). Videos need
`poster`, `preview`, `full` and `dur` in seconds. The design filter bar matches on
**either** `type` or `kind`, so a piece can appear under both *Video* and *Motion*.

**Change a FAQ, a capability, a timeline entry, a principle** — edit the array.
The FAQ markup *and* its `FAQPage` structured data are generated from the same
source, so they can never drift apart.

**Testimonials.** `PS.TESTIMONIALS` is deliberately an empty array. The Principles
section reads it first and only falls back to `PS.PRINCIPLES` when it's empty — so
the moment a real, attributable testimonial exists, adding it to that array swaps
the section over with no other change. See §6.

---

## 4. Running it locally

The home page opens straight from disk, but the sub-pages load JS with relative
paths and want a real origin. Any static server works:

```bash
npx serve .          # or: python3 -m http.server 8000
```

Then visit `http://localhost:3000/`, `/photography/`, `/design/` and an invented
path like `/nope` to confirm the 404.

---

## 5. Deploying

Vercel, zero config — push the folder. `vercel.json` sets:

- year-long immutable caching for `/assets/`, `/photography/assets/`,
  `/design/assets/` and any `.css/.js/.svg/.woff2`
- `must-revalidate` on HTML so content changes appear immediately
- `cleanUrls` + `trailingSlash` for canonical URLs
- baseline security headers

**It no longer contains a catch-all rewrite.** The previous config ended with
`{"src": "/(.*)", "dest": "/index.html"}`, which meant every unknown URL silently
returned the home page with a 200 — bad for users and bad for crawlers. Removing
it lets Vercel serve `404.html` with a real 404 status. Don't add it back; this is
not a single-page app.

### The one hardcoded thing

`https://pratiksahaa.vercel.app` appears in two places:

1. `PS.SITE.origin` in `data.js` — used by every generated JSON-LD block.
2. The `<link rel="canonical">`, `og:url` and `og:image` tags in each `<head>`,
   plus `sitemap.xml` and `robots.txt`.

Those head tags are deliberately literal, because canonicals and Open Graph URLs
must be in the HTML source for crawlers and link unfurlers that don't run JS.
**On a custom domain, change all of them.** Find them with:

```bash
grep -rn "pratiksahaa.vercel.app" --include="*.html" --include="*.js" --include="*.xml" --include="*.txt" .
```

---

## 6. Content integrity

A few things in this build are the way they are on purpose, and shouldn't be
"filled in" with invented content:

- **No fabricated social proof.** The previous version carried testimonials with
  attributions that couldn't be verified. They're gone. The Principles section in
  their place quotes Pratik directly and is attributed to him.
- **Stats are derived, not claimed.** The home page shows 35 photographs, 18
  design pieces and 15 organisations because those are the counts of the actual
  files in this repository. The old copy claimed several different, mutually
  contradictory project totals.
- **Timeline copy is preserved verbatim** from the existing site, including the
  event figures, because that's the client's own account of their own work.
- **Logo alt text is descriptive where the organisation couldn't be identified**
  from the mark alone. Three of the fifteen are described by their visual
  content rather than named. If you know the names, replace them in `PS.ORGS`.
- **The contact form has no backend.** It validates, then composes a `mailto:`
  and hands off to the user's mail client. It never claims to have sent anything.
  If you add a real endpoint (Formspree, a Vercel function), replace the compose
  step in `initContactForm` in `home.js` and update the success message.

---

## 7. Accessibility and motion

- Skip link, visible focus rings (keyboard-only, via a `kb` body class), full
  keyboard paths through the menu, filters, gallery, lightbox, FAQ and form.
- The mobile menu traps focus, closes on Escape, marks the rest of the page
  `inert`, and restores focus only when focus was inside it.
- The lightbox traps focus, supports arrow keys, Escape and swipe.
- **`prefers-reduced-motion: reduce` is honoured everywhere**: Lenis smooth
  scrolling is not initialised, reveals resolve instantly, the marquees and the
  404 drift stop, and the design hero video never downloads — the poster stays.
- Videos are muted, `playsinline`, `preload="none"`, attach their source only
  when observed, and pause when scrolled away or when the tab is hidden.

---

## 8. Browser support

Evergreen Chrome, Edge, Firefox and Safari, desktop and mobile. Uses
`IntersectionObserver`, CSS custom properties, `clamp()`, `grid`, `:focus-visible`
and `inert`. No polyfills, no WebGL, no canvas.

---

© Pratik Saha. Photographs and design work are the author's own and are not
licensed for reuse.
