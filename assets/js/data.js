/* ==========================================================================
   PRATIK SAHA — SITE DATA (single source of truth)
   Loaded by every page. No build step; classic script, global `PS`.

   Paths are stored root-relative WITHOUT a leading slash. PS.asset() adds the
   correct prefix so the same record works from /, /photography/ and /design/.
   ========================================================================== */
window.PS = window.PS || {};

(function (PS) {
  'use strict';

  /* ── site constants ────────────────────────────────────────────────────
     ORIGIN is the one place the production domain is defined. Change it here
     and every canonical/OG/sitemap reference generated at runtime follows.
     (The static <link rel="canonical"> tags in each page's <head> must be
     edited by hand — they are listed in README.md.)                        */
  PS.SITE = {
    name: 'Pratik Saha',
    origin: 'https://pratiksahaa.vercel.app',
    email: 'studios.pratik@gmail.com',
    phone: '+8801973828768',
    phoneDisplay: '+880 1973 828 768',
    instagram: 'https://www.instagram.com/_pratiksahaa_/',
    instagramHandle: '@_pratiksahaa_',
    locality: 'Dhaka',
    region: 'Dhaka Division',
    country: 'Bangladesh',
    area: 'Uttara, Dhaka — 1230'
  };

  /* base prefix so one data file serves pages at different depths */
  var depth = (location.pathname.indexOf('/photography/') > -1 ||
               location.pathname.indexOf('/design/') > -1) ? '../' : '';
  PS.base = depth;
  PS.asset = function (p) {
    if (!p) return '';
    if (/^(https?:)?\/\//.test(p) || p.charAt(0) === '/') return p;
    return depth + p;
  };
  PS.url = function (p) {
    return PS.SITE.origin + (p.charAt(0) === '/' ? p : '/' + p);
  };

  /* ── navigation ────────────────────────────────────────────────────────
     `home` is the anchor on the main page; `href` is used from sub-pages.   */
  PS.NAV = [
    { label: 'About',       home: '#about',        href: 'index.html#about' },
    { label: 'Work',        home: '#work',         href: 'index.html#work' },
    { label: 'Photography', home: '#photography',  href: 'photography/' },
    { label: 'Design',      home: '#design',       href: 'design/' },
    { label: 'Experience',  home: '#experience',   href: 'index.html#experience' },
    { label: 'Contact',     home: '#contact',      href: 'index.html#contact' }
  ];

  /* ── photography: 35 frames, two series ────────────────────────────────
     w/h are the real pixel dimensions — used for aspect-ratio boxes so the
     masonry never shifts layout while images decode.                        */
  var PH = 'photography/assets/photography/';
  PS.PHOTOS = [
    { id:0,  cat:'nature',  title:'Flooded Forest',          desc:'A tangle of branches and reflections where the forest meets the water.',        tags:['Nature','Forest','Reflection'],  w:2752,h:1536, thumb:PH+'nature/nature-01-thumb.jpg',  full:PH+'nature/nature-01.jpg' },
    { id:1,  cat:'nature',  title:'Cascade Through Green',   desc:'Water threads between moss-covered boulders under a canopy of bamboo.',         tags:['Nature','Waterfall','Forest'],   w:1792,h:2400, thumb:PH+'nature/nature-02-thumb.jpg',  full:PH+'nature/nature-02.jpg' },
    { id:2,  cat:'nature',  title:'Crossing',                desc:'Passengers ride low in the water as the boatman steers toward open river.',     tags:['Nature','River','Travel'],       w:2752,h:1536, thumb:PH+'nature/nature-03-thumb.jpg',  full:PH+'nature/nature-03.jpg' },
    { id:3,  cat:'nature',  title:"Boulder's Edge",          desc:'A low, close vantage on river stone and sand, mountains fading into haze.',     tags:['Nature','River','Detail'],       w:1792,h:2400, thumb:PH+'nature/nature-04-thumb.jpg',  full:PH+'nature/nature-04.jpg' },
    { id:4,  cat:'nature',  title:'Where the Mist Settles',  desc:'Prayer flags mark a stone bank as fog rolls down from the ridgeline.',          tags:['Nature','River','Mist'],         w:2752,h:1536, thumb:PH+'nature/nature-05-thumb.jpg',  full:PH+'nature/nature-05.jpg' },
    { id:5,  cat:'nature',  title:'Thread of White',         desc:'A single waterfall drawn thin against a mountainside of unbroken green.',       tags:['Nature','Waterfall','Forest'],   w:1536,h:2752, thumb:PH+'nature/nature-06-thumb.jpg',  full:PH+'nature/nature-06.jpg' },
    { id:6,  cat:'nature',  title:'The Landing',             desc:'Dozens of wooden boats pulled up along the bank beneath a green hillside.',     tags:['Nature','River','Village'],      w:2752,h:1536, thumb:PH+'nature/nature-07-thumb.jpg',  full:PH+'nature/nature-07.jpg' },
    { id:7,  cat:'nature',  title:'Stone Bank',              desc:'River rocks and low cloud settling into the hills after rain.',                 tags:['Nature','River','Mist'],         w:1792,h:2400, thumb:PH+'nature/nature-08-thumb.jpg',  full:PH+'nature/nature-08.jpg' },
    { id:8,  cat:'nature',  title:'Tea Garden Boundary',     desc:'A weathered sign marks the edge of a tea estate against the hills.',            tags:['Nature','Tea Garden','Sylhet'],  w:1536,h:1024, thumb:PH+'nature/nature-09-thumb.jpg',  full:PH+'nature/nature-09.jpg' },
    { id:9,  cat:'nature',  title:'Bow of the River',        desc:'Looking past a weathered tire-fender toward two boats crossing calm water.',    tags:['Nature','River','Travel'],       w:1085,h:1450, thumb:PH+'nature/nature-10-thumb.jpg',  full:PH+'nature/nature-10.jpg' },
    { id:10, cat:'nature',  title:'Downriver',               desc:'A wooden boat trailing two others toward a village tucked against the hillside.',tags:['Nature','River','Travel'],      w:2752,h:1536, thumb:PH+'nature/nature-11-thumb.jpg',  full:PH+'nature/nature-11.jpg' },
    { id:11, cat:'nature',  title:'Valley Sky',              desc:'Cumulus stacked high over the hill tracts, with a lone horse grazing far below.',tags:['Nature','Sky','Mountains'],     w:1792,h:2400, thumb:PH+'nature/nature-12-thumb.jpg',  full:PH+'nature/nature-12.jpg' },
    { id:12, cat:'nature',  title:'Reclaimed',               desc:'An aging building disappears slowly beneath the green.',                        tags:['Nature','Architecture','Decay'], w:1535,h:1024, thumb:PH+'nature/nature-13-thumb.jpg',  full:PH+'nature/nature-13.jpg' },
    { id:13, cat:'nature',  title:'Grazing Light',           desc:'Late sun catches a valley of cloud, with a horse grazing at the tree line.',    tags:['Nature','Sky','Mountains'],      w:2752,h:1536, thumb:PH+'nature/nature-14-thumb.jpg',  full:PH+'nature/nature-14.jpg' },
    { id:14, cat:'nature',  title:'Passage',                 desc:'A boatman stands watch as his passengers ride beneath a towering plateau.',     tags:['Nature','River','Travel'],       w:2752,h:1536, thumb:PH+'nature/nature-15-thumb.jpg',  full:PH+'nature/nature-15.jpg' },
    { id:15, cat:'nature',  title:'River Stones, Wide Sky',  desc:'A small stone cairn holds its ground among the boulders.',                      tags:['Nature','River','Sky'],          w:1792,h:2400, thumb:PH+'nature/nature-16-thumb.jpg',  full:PH+'nature/nature-16.jpg' },
    { id:16, cat:'nature',  title:'Beneath the Plateau',     desc:'A quiet ferry crossing dwarfed by a cliff-edged tableland.',                    tags:['Nature','River','Mountains'],    w:1792,h:2400, thumb:PH+'nature/nature-17-thumb.jpg',  full:PH+'nature/nature-17.jpg' },
    { id:17, cat:'nature',  title:'Village on the Water',    desc:'Rowboats gather at the shore beneath a hillside village.',                      tags:['Nature','River','Village'],      w:1792,h:2400, thumb:PH+'nature/nature-18-thumb.jpg',  full:PH+'nature/nature-18.jpg' },

    { id:18, cat:'concert', title:'Rise',                    desc:'An arm thrown into the light above the stage, motion-blurred by the moment.',   tags:['Concert','Live','Motion'],       w:1086,h:1448, thumb:PH+'concert/concert-01-thumb.jpg', full:PH+'concert/concert-01.jpg' },
    { id:19, cat:'concert', title:'Under Red & Blue',        desc:'A vocalist commands the stage as red and blue washes collide.',                 tags:['Concert','Live','Vocals'],       w:768, h:1376, thumb:PH+'concert/concert-02-thumb.jpg', full:PH+'concert/concert-02.jpg' },
    { id:20, cat:'concert', title:'The Guitar Man',          desc:'Hat low, sunglasses on, working the strings under a starlit backdrop.',         tags:['Concert','Live','Guitar'],       w:768, h:1376, thumb:PH+'concert/concert-03-thumb.jpg', full:PH+'concert/concert-03.jpg' },
    { id:21, cat:'concert', title:'Fists Up, Front Row',     desc:"The crowd's silhouette rises as the performer calls back.",                     tags:['Concert','Live','Crowd'],        w:768, h:1376, thumb:PH+'concert/concert-04-thumb.jpg', full:PH+'concert/concert-04.jpg' },
    { id:22, cat:'concert', title:'Stage & Soul',            desc:'Two guitarists lock into the same groove under warm light.',                    tags:['Concert','Live','Guitar'],       w:1792,h:2400, thumb:PH+'concert/concert-05-thumb.jpg', full:PH+'concert/concert-05.jpg' },
    { id:23, cat:'concert', title:'Gold Light Solo',         desc:'Warm haze and a single raised hand mid-verse.',                                 tags:['Concert','Live','Vocals'],       w:768, h:1376, thumb:PH+'concert/concert-06-thumb.jpg', full:PH+'concert/concert-06.jpg' },
    { id:24, cat:'concert', title:'Through the Haze',        desc:'A guitarist all but disappears into stage smoke and grey light.',               tags:['Concert','Live','Atmospheric'],  w:768, h:1376, thumb:PH+'concert/concert-07-thumb.jpg', full:PH+'concert/concert-07.jpg' },
    { id:25, cat:'concert', title:'Low and Locked In',       desc:'A bassist crouches into the riff, cap low, fully in the pocket.',               tags:['Concert','Live','Bass'],         w:1023,h:1537, thumb:PH+'concert/concert-08-thumb.jpg', full:PH+'concert/concert-08.jpg' },
    { id:26, cat:'concert', title:'Reaching Wide',           desc:'Arms outstretched under a wash of stage light.',                                tags:['Concert','Live','Performance'],  w:768, h:1376, thumb:PH+'concert/concert-09-thumb.jpg', full:PH+'concert/concert-09.jpg' },
    { id:27, cat:'concert', title:'Silhouette in Amber',     desc:'A performer dissolves into warm backlight, mic in hand.',                       tags:['Concert','Live','Silhouette'],   w:768, h:1376, thumb:PH+'concert/concert-10-thumb.jpg', full:PH+'concert/concert-10.jpg' },
    { id:28, cat:'concert', title:'Sapphire Set',            desc:'Cool blue light wraps the stage for a mid-set number.',                         tags:['Concert','Live','Performance'],  w:768, h:1376, thumb:PH+'concert/concert-11-thumb.jpg', full:PH+'concert/concert-11.jpg' },
    { id:29, cat:'concert', title:'Through the Smoke',       desc:'Blue wash and stage haze frame a guitarist mid-song.',                          tags:['Concert','Live','Guitar'],       w:1536,h:2752, thumb:PH+'concert/concert-12-thumb.jpg', full:PH+'concert/concert-12.jpg' },
    { id:30, cat:'concert', title:'Blue Hour, Stage Left',   desc:'A performer opens up beneath a field of blue.',                                 tags:['Concert','Live','Performance'],  w:768, h:1376, thumb:PH+'concert/concert-13-thumb.jpg', full:PH+'concert/concert-13.jpg' },
    { id:31, cat:'concert', title:'Side Light, Soft Smoke',  desc:'A guitarist caught in profile through drifting haze.',                          tags:['Concert','Live','Guitar'],       w:768, h:1376, thumb:PH+'concert/concert-14-thumb.jpg', full:PH+'concert/concert-14.jpg' },
    { id:32, cat:'concert', title:'Reaching the Rafters',    desc:'An arm thrown skyward against a wall of warm bokeh.',                           tags:['Concert','Live','Performance'],  w:768, h:1376, thumb:PH+'concert/concert-15-thumb.jpg', full:PH+'concert/concert-15.jpg' },
    { id:33, cat:'concert', title:'Close to the Mic',        desc:'A quiet, focused moment between verses.',                                       tags:['Concert','Live','Vocals'],       w:768, h:1376, thumb:PH+'concert/concert-16-thumb.jpg', full:PH+'concert/concert-16.jpg' },
    { id:34, cat:'concert', title:'Midnight Blue',           desc:'Deep blue light and a voice carrying over the crowd.',                          tags:['Concert','Live','Vocals'],       w:768, h:1376, thumb:PH+'concert/concert-17-thumb.jpg', full:PH+'concert/concert-17.jpg' }
  ];

  /* ── design: 13 static pieces + 5 video edits ──────────────────────────── */
  var DS = 'design/assets/design/';
  PS.DESIGN = [
    { id:0,  type:'static', kind:'branding', title:'JungleBari',                       desc:'A moody resort key visual for JungleBari Mangrove Resort, lit like a postcard from the water.',                       tags:['Hospitality','Key Visual'],        w:1122,h:1402, thumb:DS+'static/static-01-thumb.jpg', full:DS+'static/static-01.jpg' },
    { id:1,  type:'static', kind:'campaign', title:'Sacred Corners of Dhaka',          desc:"Editorial typography set into mosque light and shadow, for a series walking through the city's historic mosques.",      tags:['Editorial','Culture'],             w:1122,h:1402, thumb:DS+'static/static-02-thumb.jpg', full:DS+'static/static-02.jpg' },
    { id:2,  type:'static', kind:'campaign', title:'Hustlers — Half Court Battle S2',  desc:'Campaign opener for Season 2 of a 3-on-3 basketball tournament — bold citrus orange and stark type.',                  tags:['Sports','Campaign'],               w:1122,h:1402, thumb:DS+'static/static-03-thumb.jpg', full:DS+'static/static-03.jpg' },
    { id:3,  type:'static', kind:'campaign', title:'Hustlers — Texture Beat',          desc:'A basketball-leather texture treatment carrying the campaign into its next beat.',                                      tags:['Sports','Campaign'],               w:1086,h:1357, thumb:DS+'static/static-04-thumb.jpg', full:DS+'static/static-04.jpg' },
    { id:4,  type:'static', kind:'campaign', title:'Hustlers — Registration Open',     desc:'Halftone player cutout and stark black-on-white type announcing tournament registration.',                               tags:['Sports','Campaign'],               w:1122,h:1402, thumb:DS+'static/static-05-thumb.jpg', full:DS+'static/static-05.jpg' },
    { id:5,  type:'static', kind:'campaign', title:'Hustlers — Prize Pool Teaser',     desc:'A cheeky teaser post building suspense before the prize pool reveal.',                                                   tags:['Sports','Campaign'],               w:1122,h:1402, thumb:DS+'static/static-06-thumb.jpg', full:DS+'static/static-06.jpg' },
    { id:6,  type:'static', kind:'campaign', title:'Chaand Raat — The Sehri Socials',  desc:'Event key art for a Chaand Raat night — bubble typography, sponsor lockups, festival energy.',                           tags:['Event','Nightlife'],               w:1170,h:1463, thumb:DS+'static/static-07-thumb.jpg', full:DS+'static/static-07.jpg' },
    { id:7,  type:'static', kind:'campaign', title:'Dhaka Chronicles — Anuv Jain',     desc:"Concert announcement design for Anuv Jain's Dhaka show, moody stage photography with a clean type hierarchy.",           tags:['Concert','Announcement'],          w:640, h:800,  thumb:DS+'static/static-08-thumb.jpg', full:DS+'static/static-08.jpg' },
    { id:8,  type:'static', kind:'branding', title:'Heritage Carnival',                desc:'Ornamental gold linework and serif type for a carnival brand built around Bangladeshi culture and women.',                tags:['Branding','Ornamental'],           w:640, h:800,  thumb:DS+'static/static-09-thumb.jpg', full:DS+'static/static-09.jpg' },
    { id:9,  type:'static', kind:'branding', title:'Legacy MMA — Pohela Boishakh',     desc:'Bengali New Year key art for Legacy MMA, pairing two illustrated fighters with a traditional medallion pattern.',         tags:['Sports','Cultural'],               w:640, h:800,  thumb:DS+'static/static-10-thumb.jpg', full:DS+'static/static-10.jpg' },
    { id:10, type:'static', kind:'campaign', title:'Places To Cry After A Bad Midterm',desc:'Distressed stencil type over a wide open field — relatable, meme-adjacent content design.',                               tags:['Social','Typography'],             w:1122,h:1402, thumb:DS+'static/static-11-thumb.jpg', full:DS+'static/static-11.jpg' },
    { id:11, type:'static', kind:'branding', title:'Regular Bird, Extended',           desc:'An exhibition extension notice — deep maroon palette, quiet gallery-ready type.',                                        tags:['Exhibition','Announcement'],       w:640, h:640,  thumb:DS+'static/static-12-thumb.jpg', full:DS+'static/static-12.jpg' },
    { id:12, type:'static', kind:'branding', title:'Nova — Event Production',          desc:'On-site styling for Nova — draped silk, warm light, and a table set for the evening.',                                    tags:['Event Production','Décor'],        w:640, h:850,  thumb:DS+'static/static-13-thumb.jpg', full:DS+'static/static-13.jpg' },

    { id:13, type:'video', kind:'motion', vid:0, title:'Flow Edit',               desc:'A fast, transition-driven cut — a horse at a run, a silhouette against golden light, motion blurred into black and white.', tags:['Transitions','Motion'],       w:960, h:720,  dur:6.5,  poster:DS+'video/video-01-poster.jpg', preview:DS+'video/video-01-preview.mp4', full:DS+'video/video-01.mp4' },
    { id:14, type:'video', kind:'motion', vid:1, title:'Not Loud. Just Legendary.',desc:'A dark, cinematic montage built from slow motion and heavy colour — silhouettes, falling petals, a lone drum in low light.',tags:['Cinematic','Colour Grading'],w:1280,h:720,  dur:37.5, poster:DS+'video/video-02-poster.jpg', preview:DS+'video/video-02-preview.mp4', full:DS+'video/video-02.mp4' },
    { id:15, type:'video', kind:'motion', vid:2, title:'The Process',             desc:'Five hours of shooting, three hours of editing, fourteen seconds of result — a behind-the-scenes look at how it gets made.',  tags:['Process','Behind The Scenes'],w:720, h:1280, dur:14.4, poster:DS+'video/video-03-poster.jpg', preview:DS+'video/video-03-preview.mp4', full:DS+'video/video-03.mp4' },
    { id:16, type:'video', kind:'motion', vid:3, title:'The Tasting',             desc:'Oysters, candlelight, and a slow-moving camera — an evening dinner shot after hours.',                                        tags:['Food','Mood'],                w:720, h:1280, dur:14.3, poster:DS+'video/video-04-poster.jpg', preview:DS+'video/video-04-preview.mp4', full:DS+'video/video-04.mp4' },
    { id:17, type:'video', kind:'motion', vid:4, title:'Higher Ground',           desc:'Prayer flags, mountain light, and a long walk through the hills — a quiet travel edit.',                                       tags:['Travel','Nature'],            w:720, h:1280, dur:12.1, poster:DS+'video/video-05-poster.jpg', preview:DS+'video/video-05-preview.mp4', full:DS+'video/video-05.mp4' }
  ];
  PS.DESIGN_HERO = { loop: DS + 'hero-loop.mp4', poster: DS + 'hero-poster.jpg' };

  /* ── selected work: the bento grid on the home page ────────────────────
     `span` drives grid size — importance, not arbitrary variety.
     Each entry points at a real asset already in the project.              */
  PS.WORK = [
    { n:'01', span:'feature', title:'Not Loud. Just Legendary.', cat:'Motion · Colour Grading', year:'2026', href:'design/',      media:DS+'video/video-02-poster.jpg', w:1280,h:720,
      alt:'Still from "Not Loud. Just Legendary." — a cinematic montage edit by Pratik Saha' },
    { n:'02', span:'tall',    title:'Heritage Carnival',         cat:'Brand Identity',          year:'2026', href:'design/',      media:DS+'static/static-09-thumb.jpg', w:640,h:800,
      alt:'Heritage Carnival brand key art with ornamental gold linework, designed by Pratik Saha' },
    { n:'03', span:'wide',    title:'Hill Tracts & Rivers',      cat:'Landscape Photography',   year:'2026', href:'photography/', media:PH+'nature/nature-11-thumb.jpg', w:2752,h:1536,
      alt:'A wooden boat heading downriver toward a hillside village in the Bangladesh hill tracts' },
    { n:'04', span:'std',     title:'Hustlers — Half Court',     cat:'Campaign Design',         year:'2026', href:'design/',      media:DS+'static/static-03-thumb.jpg', w:1122,h:1402,
      alt:'Hustlers Half Court Battle Season 2 campaign poster in citrus orange, designed by Pratik Saha' },
    { n:'05', span:'std',     title:'Live & Concert',            cat:'Performance Photography', year:'2026', href:'photography/', media:PH+'concert/concert-10-thumb.jpg', w:768,h:1376,
      alt:'A performer silhouetted in amber backlight, photographed live on stage by Pratik Saha' },
    { n:'06', span:'wide',    title:'JungleBari',                cat:'Hospitality Key Visual',  year:'2026', href:'design/',      media:DS+'static/static-01-thumb.jpg', w:1122,h:1402,
      alt:'JungleBari Mangrove Resort key visual shot from the water at dusk, designed by Pratik Saha' }
  ];

  /* ── featured rail: the one horizontal-scroll sequence on the site ────── */
  PS.RAIL = [
    { n:'01', title:'Flooded Forest',            cat:'Nature',   year:'2026', media:PH+'nature/nature-01-thumb.jpg',  w:2752,h:1536 },
    { n:'02', title:'Not Loud. Just Legendary.', cat:'Motion',   year:'2026', media:DS+'video/video-02-poster.jpg',   w:1280,h:720  },
    { n:'03', title:'Under Red & Blue',          cat:'Concert',  year:'2026', media:PH+'concert/concert-02-thumb.jpg',w:768, h:1376 },
    { n:'04', title:'Legacy MMA',                cat:'Branding', year:'2026', media:DS+'static/static-10-thumb.jpg',  w:640, h:800  },
    { n:'05', title:'Grazing Light',             cat:'Nature',   year:'2026', media:PH+'nature/nature-14-thumb.jpg',  w:2752,h:1536 },
    { n:'06', title:'Chaand Raat',               cat:'Event',    year:'2026', media:DS+'static/static-07-thumb.jpg',  w:1170,h:1463 },
    { n:'07', title:'Silhouette in Amber',       cat:'Concert',  year:'2026', media:PH+'concert/concert-10-thumb.jpg',w:768, h:1376 },
    { n:'08', title:'Sacred Corners of Dhaka',   cat:'Editorial',year:'2026', media:DS+'static/static-02-thumb.jpg',  w:1122,h:1402 }
  ];

  /* ── organisation marks ────────────────────────────────────────────────
     Alt text describes each mark as read off the artwork. Where a mark
     carries no legible name it is described, not invented.                 */
  PS.ORGS = [
    { file:'logo-01.png', alt:'bKash logo' },
    { file:'logo-02.png', alt:'Dhaka Chronicles logo' },
    { file:'logo-03.png', alt:'Nova logo' },
    { file:'logo-04.png', alt:'Legacy MMA logo' },
    { file:'logo-05.png', alt:'Kynart logo' },
    { file:'logo-06.png', alt:'Legacy MMA Combat Gym monochrome logo' },
    { file:'logo-07.png', alt:'Force X logo' },
    { file:'logo-08.png', alt:'Arka Collective logo' },
    { file:'logo-09.png', alt:'Utshab Supermarket logo' },
    { file:'logo-10.png', alt:'Geometric patterned monogram mark' },
    { file:'logo-11.png', alt:'BITMUN Model United Nations crest' },
    { file:'logo-12.png', alt:'IGAC international affairs council crest' },
    { file:'logo-13.png', alt:'Ornamental peacock crest emblem' },
    { file:'logo-14.png', alt:'Together Bangladesh logo' },
    { file:'logo-15.png', alt:'Green sprout and water line emblem' }
  ];

  /* ── capabilities ──────────────────────────────────────────────────────── */
  PS.CAPABILITIES = [
    { n:'01', group:'Creative & Design',    items:['Graphic Design','Branding','Visual Identity','Creative Direction','UI / UX Design','Typography','Social Design','Presentation Design','Print Design','Editorial Design'] },
    { n:'02', group:'Photography & Media',  items:['Photography','Concert Photography','Portrait Photography','Event Photography','Photo Editing','Colour Grading','Video Editing','Visual Storytelling'] },
    { n:'03', group:'Technical',            items:['Web Design','Frontend Development','Responsive Design','Interactive Experiences','Digital Branding','Website Strategy'] },
    { n:'04', group:'Leadership',           items:['Event Management','Project Management','Entrepreneurship','Public Speaking','Creative Strategy','Team Leadership'] }
  ];

  /* ── experience (existing portfolio copy, preserved) ───────────────────── */
  PS.TIMELINE = [
    { year:'2024 — Present', role:'Creative Director & Founder',        org:'Independent Design Studio', loc:'Dhaka, Bangladesh',       cat:'Entrepreneurship',
      desc:'Leading full-spectrum creative direction — brand identity, visual strategy, photography, and digital experiences for clients across industries.' },
    { year:'2023 — 2024',    role:'Head of Design & Branding',          org:'Student Organization',      loc:'Dhaka, Bangladesh',       cat:'Leadership',
      desc:'Managed the design team, directed all visual communications, and elevated brand presence across regional platforms and live events.' },
    { year:'2023',           role:'Lead Event Director',                org:'National Youth Convention', loc:'Dhaka, Bangladesh',       cat:'Event Direction',
      desc:'Produced and directed 2500+ participant events from concept through execution — creative production, logistics, and sponsor relations.' },
    { year:'2022 — Present', role:'Photographer & Visual Storyteller',  org:'Freelance',                 loc:'Editorial & Events',      cat:'Photography',
      desc:'Cinematic editorial and event photography spanning portraiture, architectural documentation, brand shoots, and lifestyle work.' },
    { year:'2021 — Present', role:'Community Builder & Volunteer',      org:'Non-Profit & Social Initiatives', loc:'Bangladesh',        cat:'Social Impact',
      desc:'Creative and strategic contribution to youth empowerment and education programmes across Bangladesh.' }
  ];

  /* ── principles ────────────────────────────────────────────────────────
     Pratik's own working statements. These deliberately replace the previous
     unattributed testimonial block rather than inventing client identities.
     To run real testimonials instead, fill PS.TESTIMONIALS with
     { quote, name, role, context } — the section switches automatically.   */
  PS.PRINCIPLES = [
    { quote: 'Design is leadership with a visual language. The brief is never really about the artwork — it is about what the artwork has to move.',
      label: 'On direction' },
    { quote: 'A frame earns its place by being a decision, not a capture. If I could not say why it was taken, it does not make the edit.',
      label: 'On photography' },
    { quote: 'Restraint reads as confidence. Anything that survives the edit has to be carrying weight the work would miss without it.',
      label: 'On craft' },
    { quote: 'Brand identity is the part of the work that has to keep performing after I have left the room. It gets built to outlast the campaign.',
      label: 'On identity' },
    { quote: 'Events are design under pressure — one take, live audience, no revisions. They teach you what actually matters faster than anything else.',
      label: 'On events' }
  ];
  PS.TESTIMONIALS = [];

  /* ── FAQ — drawn only from the actual service offering ─────────────────
     No pricing or turnaround commitments are stated, because none are known. */
  PS.FAQ = [
    { q: 'What do you actually do?',
      a: 'Three things that feed each other: creative direction, design, and photography. In practice that means brand identity and visual systems, campaign and social design, editorial and event photography, video editing and colour grading, and the occasional website. Event direction sits alongside all of it.' },
    { q: 'Do you work with brands and organisations?',
      a: 'Yes — most of the work on this site was made for brands, events, sports clubs, and student and community organisations. The marks in the Organisations section are the ones I have made work for or been part of.' },
    { q: 'Are you available for photography commissions?',
      a: 'Yes. Live and concert work, editorial and portrait shoots, events, and travel or landscape commissions. The full photography archive is on the Photography page if you want to see the range before getting in touch.' },
    { q: 'Do you take international projects?',
      a: 'Yes. I am based in Dhaka and work remotely without trouble — design, direction, and post-production all travel fine. On-location shoots outside Bangladesh depend on timing and scope, so start the conversation early.' },
    { q: 'Can you handle both design and creative direction on the same project?',
      a: 'That is usually the point. Direction without execution tends to drift, and execution without direction tends to get pretty without getting anywhere. I am comfortable setting the direction and then building the work inside it.' },
    { q: 'Do you work on events?',
      a: 'Yes — I have directed events end to end, from the creative concept and key art through production, logistics, and sponsor materials. I also shoot them, which means the visual language holds together from the announcement post to the recap film.' },
    { q: 'What does the process usually look like?',
      a: 'A conversation about what the work has to achieve, then a scope and direction we both agree on, then the build with a small number of real review points. I would rather have two honest rounds of feedback than six polite ones.' },
    { q: 'How do I start a project?',
      a: 'Use the form below, or email studios.pratik@gmail.com directly. Tell me what it is, roughly when it needs to exist, and what success looks like to you. I will come back with whether I am the right fit and what I would suggest.' }
  ];

  /* ── marquee words ─────────────────────────────────────────────────────── */
  PS.DISCIPLINES = ['Creative Direction','Brand Identity','Photography','UI / UX Design','Event Direction',
                    'Video Editing','Visual Storytelling','Web Design','Typography','Colour Grading',
                    'Entrepreneurship','Concert Photography'];

  /* ── verifiable counts, derived — never hand-written ───────────────────── */
  PS.COUNTS = {
    photographs: PS.PHOTOS.length,
    nature:      PS.PHOTOS.filter(function (p) { return p.cat === 'nature'; }).length,
    concert:     PS.PHOTOS.filter(function (p) { return p.cat === 'concert'; }).length,
    design:      PS.DESIGN.length,
    statics:     PS.DESIGN.filter(function (d) { return d.type === 'static'; }).length,
    films:       PS.DESIGN.filter(function (d) { return d.type === 'video'; }).length,
    orgs:        PS.ORGS.length
  };
})(window.PS);
