Build a premium, fully responsive, single-page marketing website for **"Aparajita Engicon Pvt Ltd"** - an engineering and construction company (commercial, residential, renovation, civil and project management). Use **static HTML5, one CSS file, vanilla JavaScript, GSAP (with ScrollTrigger, ScrollSmoother, SplitText), Bootstrap 5.3 and Font Awesome 6 Free**. No frameworks, no build step, no jQuery. The page has 14 sections plus a fixed header and a back-to-top control. Match every detail exactly.

The look is a premium "yellow + black on warm off-white" construction brand: huge light-weight tight-tracked headlines, dotted-border cards, soft yellow radial glows, pill buttons with an arrow circle, heavy black-framed stacked cards, and a dark cinematic hero.

---

## 0. NON-NEGOTIABLE CODE RULES (read first)

These rules **must** be followed. Any violation is a failed build.

1. **No inline styles, ever.** No `style="..."` attributes in the HTML. No `<style>` blocks in the HTML. All styling lives in `assets/css/style.css`.
2. **No inline JavaScript, ever.** No `onclick=""` / `onsubmit=""` attributes, no `<script>` blocks with code. All JS lives in separate files: `assets/js/main.js` (UI logic) and `assets/js/animations.js` (all GSAP). The HTML only contains `<script src="...">` tags at the end of `<body>`.
3. **Styles set at runtime by GSAP are allowed** (GSAP writes inline transforms while animating). Authors must never write them by hand. Initial hidden states are set in `style.css` using the `.js` class on `<html>` (see Section 16), never in markup.
4. **Single stylesheet.** Only `style.css` is authored. Bootstrap and Font Awesome come from CDN. Bootstrap is customised through CSS variables and overrides inside `style.css`, never by editing Bootstrap files.
5. **Bootstrap usage:** grid (`container`, `row`, `col-*`), flex/spacing/display utilities, and the JS components `accordion`, `offcanvas`, `modal`. Do not use Bootstrap's default button, card, navbar or accordion look - restyle them fully with project classes.
6. **Semantic tokens only.** Every colour, radius, shadow, duration and easing is a CSS custom property declared in `:root` (Section 1). Raw hex values may appear only inside the `:root` block.
7. **Naming:** BEM-style classes (`.hero__title`, `.service-card--dark`). No ID selectors for styling. IDs only for anchors, ARIA relationships and JS hooks. JS hooks use `data-*` attributes or `js-` prefixed classes, never styling classes.
8. **CSS file organisation (in this order, with banner comments):** 1. Tokens, 2. Reset and base, 3. Typography, 4. Layout helpers, 5. Buttons and shared components, 6. Header, 7-20. One block per page section (in page order), 21. Footer, 22. Utilities, 23. Animation initial states (`.js` scoped), 24. Responsive overrides (mobile-first `min-width` queries), 25. `prefers-reduced-motion`.
9. **JS organisation:** each file wrapped in an IIFE with `"use strict"`. `main.js` exports nothing global. Split into small named functions (`initHeader`, `initOffcanvas`, `initSearch`, `initSlider`, `initFaq`, `initNewsletter`, `initBackToTop`, `initYear`, `initClock` is NOT needed). `animations.js` is split into `initSmoother`, `initTextReveals`, `initFadeUps`, `initHero`, `initRibbons`, `initServicesSlider`, `initAbout`, `initServiceGrid`, `initTeam`, `initPricing`, `initExperienceStack`, `initMarquees`, `initNews`, `initFaqReveal`, `initFooter`, `initCounters`. Everything is called from one `DOMContentLoaded` handler, inside `gsap.matchMedia()`.
10. **No dead code, no console logs, no commented-out blocks** in the final files. Comments only to label sections.
11. **Do not include any "Made in Framer" badge, template credit or reference to ForgeBuilt.** This is a standalone brand site for Aparajita Engicon.

### File structure

```
/index.html
/assets/css/style.css
/assets/js/main.js
/assets/js/animations.js
/assets/img/        (logo.svg, favicon.svg, hero.jpg, about-1.jpg, about-2.jpg, service-1..3.jpg,
                     exp-1..3.jpg, team-1..7.jpg, news-1..3.jpg, faq.jpg, avatar-1..3.jpg,
                     partner-1..10.svg, og-image.jpg)
```

Use the filenames above for all images. Photos must be real-looking construction/engineering photography (cranes at dusk, reinforcement bars, workers in white helmets and hi-vis vests, site walkthroughs). Every `<img>` has `width`, `height`, a meaningful `alt` (empty `alt=""` only for purely decorative images), `loading="lazy"` (hero image: `loading="eager"` + `fetchpriority="high"`), and `decoding="async"`.

### CDN order (in `index.html`)

- `<head>`: Google Fonts (preconnect + `display=swap`), Bootstrap CSS 5.3.x, Font Awesome 6.5.x CSS, then `style.css` **last** so it wins.
- End of `<body>` in this order: Bootstrap bundle JS, GSAP 3.13+ core, ScrollTrigger, ScrollSmoother, SplitText (all from jsDelivr, same version), then `main.js`, then `animations.js`.
- If GSAP fails to load, the page must still be fully readable (Section 16 covers the fallback).

---

## 1. DESIGN TOKENS (declare in `:root` of style.css)

**Colour**
| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#F5C400` | Primary yellow: buttons, accents, icons, glows |
| `--color-brand-hover` | `#E0B200` | Yellow hover |
| `--color-ink` | `#0A0A0A` | Headings, dark buttons, footer, dark cards |
| `--color-ink-soft` | `#1A1A1A` | Raised dark surfaces |
| `--color-text` | `#111111` | Body text on light |
| `--color-text-muted` | `#4A4A4A` | Secondary text on light (contrast >= 7:1 on `--color-bg`) |
| `--color-text-on-dark` | `#FFFFFF` | Text on dark |
| `--color-text-on-dark-muted` | `#C9C9C9` | Secondary text on dark (>= 4.5:1 on black) |
| `--color-bg` | `#F8F8F8` | Default page background (off-white) |
| `--color-surface` | `#FFFFFF` | Cards, white sections |
| `--color-border` | `#0A0A0A` | Dotted card borders |
| `--color-glow` | `rgba(245,196,0,0.28)` | Radial yellow glows |
| `--color-error` | `#C62828` | Form errors |
| `--color-success` | `#1B7F3B` | Form success |

**Typography** (load from Google Fonts)
- `--font-heading`: **"Outfit"**, weights 300/400/500/600, fallback `system-ui, sans-serif`. Headlines use weight **400**, `letter-spacing: -0.04em`, `line-height: 1.02`.
- `--font-body`: **"Jost"**, weights 300/400/500/600, fallback `system-ui, sans-serif`. Body 16px / 1.75 line-height, weight 400.
- Fluid scale (use `clamp`):
  - `--fs-display`: `clamp(2.75rem, 7vw, 6rem)` (hero H1)
  - `--fs-h2`: `clamp(2.25rem, 4.6vw, 4rem)` (section headings)
  - `--fs-h3`: `clamp(1.5rem, 2.2vw, 2rem)` (card titles)
  - `--fs-h4`: `clamp(1.125rem, 1.5vw, 1.375rem)`
  - `--fs-body`: `1rem`; `--fs-small`: `0.875rem`; `--fs-eyebrow`: `0.875rem`
- **Eyebrow label** (used above every section heading): uppercase, Outfit 500, 14px, letter-spacing `0.02em`, preceded by a Font Awesome `fa-bolt` icon (solid, 18px, black). Gap 10px.

**Spacing:** 4px base. Section vertical padding `--section-y: clamp(4rem, 9vw, 7.5rem)`.
**Container:** `max-width: 1440px` with side padding `clamp(1.25rem, 4vw, 3rem)`, centred (at a 1920 viewport content sits at x=240 to x=1680). Override Bootstrap's `.container` to this.
**Radius:** `--radius-sm: 10px`, `--radius-md: 20px`, `--radius-lg: 28px`, `--radius-pill: 999px`.
**Shadow:** `--shadow-card: 0 2px 4px rgba(5,8,12,0.10)`, `--shadow-lift: 0 18px 40px rgba(5,8,12,0.14)`.
**Motion:** `--ease-out: cubic-bezier(0.25, 0.1, 0.25, 1)`, `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)`, `--dur-fast: 200ms`, `--dur-base: 500ms`, `--dur-slow: 900ms`.
**Focus ring:** `--focus-ring: 0 0 0 3px #fff, 0 0 0 6px #0A0A0A` on light surfaces; on dark and yellow surfaces use a 3px yellow/white ring so it always has >= 3:1 contrast.

---

## 2. SHARED COMPONENTS

### 2.1 Pill button with arrow circle (`.btn-pill`)
Markup: `<a class="btn-pill btn-pill--brand"><span class="btn-pill__label"><span class="btn-pill__text">Label</span><span class="btn-pill__text" aria-hidden="true">Label</span></span><span class="btn-pill__icon"><i class="fa-solid fa-arrow-right"></i></span></a>`

- Shape: `border-radius: var(--radius-pill)`, padding `8px 8px 8px 24px`, gap 16px, inline-flex, font Jost 500 16px.
- **Hover text roll:** `.btn-pill__label` is `overflow: hidden; height: 24px; display:flex; flex-direction: column`. On hover/focus-visible the label stack translates `-50%` on Y over `500ms var(--ease-out)`, so the duplicate (second) text rolls into view. The duplicate has `aria-hidden="true"`.
- **Arrow circle:** 44px (36px on mobile) white (or black, per variant) circle. On hover the icon rotates **-45deg** over 500ms, same easing.
- **Variants:**
  - `--brand`: yellow bg, black text, white circle with black arrow (About, Partners, Pricing, News).
  - `--dark`: black bg, white text, white circle with black arrow (intro "Get started now", Experience "View services", header-less dark CTAs).
  - `--light`: white bg, black text, yellow circle with black arrow (hero "Explore now").
  - `--brand-on-dark`: yellow bg, black text, black circle with white arrow-up-right (header "Get in touch").
- **States (all variants must define):** default, hover (bg to `--color-brand-hover` for brand), `:focus-visible` (focus ring), `:active` (scale 0.97, 150ms), `[aria-disabled="true"]` (opacity .5, `pointer-events:none`), `.is-loading` (label hidden, 16px spinner replaces the icon), error is N/A for links.
- Touch: min target 44x44px. No hover-only meaning; the roll is decorative.

### 2.2 Eyebrow (`.eyebrow`)
`<span class="eyebrow"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Excellent services</span>`

### 2.3 Dotted card (`.dot-card`)
White-to-transparent surface, `border: 1.5px dotted var(--color-border)`, `border-radius: var(--radius-md)`, padding 24px. Lifts `translateY(-6px)` + `--shadow-lift` on hover (500ms).

### 2.4 Glow background (`.glow`)
A pseudo-element radial gradient: `radial-gradient(ellipse at center, var(--color-glow) 0%, transparent 65%)`, sized about 70% of the section width, `filter: blur(40px)`, `z-index: 0`, `pointer-events:none`. Content sits above at `z-index: 1`.

### 2.5 Skip link
First element in `<body>`: `<a class="skip-link" href="#main">Skip to main content</a>`, visible on focus only.

---

## 3. FIXED HEADER (`.site-header`)

Position `fixed; top:0; inset-inline:0; z-index: 1000`, outside the ScrollSmoother wrapper. Padding 20px `clamp(1.25rem, 4vw, 3rem)` (full-bleed layout, not 1440-capped, so the logo sits 20px from the left edge like the reference).

- **LEFT - Logo:** 58px yellow circle with black Font Awesome `fa-building` icon, then wordmark **"Aparajita Engicon"** (Outfit 600, 22px, white on hero, tight tracking). Wordmark is hidden below 480px (circle only).
- **CENTER (lg and up) - Nav pill:** `border: 1px dotted rgba(255,255,255,.45)`, `border-radius: pill`, `backdrop-filter: blur(10px)`, `background: rgba(255,255,255,.06)`, padding 14px 32px, links gap 40px. Links: **Home, About us, Team, News, Services** (Services has a `fa-chevron-down` 10px icon and opens a hover/focus dropdown listing the 6 services). Link style: Jost 500 16px, white; hover = yellow with an underline that grows from the left (300ms). Active link (scrollspy) = yellow.
- **RIGHT:** a 44px round search button (`fa-magnifying-glass`, white) that opens the Search modal, then the **"Get in touch"** `btn-pill--brand-on-dark` button (links to `#contact`/footer).
- **Below lg:** nav pill hidden; a round yellow "menu" button (`fa-bars` toggles to `fa-xmark`) opens the Offcanvas.
- **Scroll behaviour (JS `initHeader`):** after 80px scroll the header gets `.is-scrolled` (bg `rgba(10,10,10,.85)`, blur 14px, padding shrinks to 12px, 400ms). It hides on scroll-down (`translateY(-100%)`) and returns on scroll-up. Always visible while the offcanvas or modal is open or any element inside has focus.
- **Offcanvas (Bootstrap):** full-height, black, slides from right (`duration 500ms var(--ease-expo)`). Large links (Outfit 36px, white) that stagger in (`y:30 -> 0`, 0.08s stagger, via `shown.bs.offcanvas`), yellow numbering `01-05`, "Get in touch" button at the bottom, contact line, socials.
- **Search modal (Bootstrap):** centred dark overlay with a large underline input (placeholder "Search services, projects, news"), autofocus on open, `Esc` closes, focus returns to the trigger. Results are not required; submitting scrolls to the matching section by keyword (simple match against section headings) and closes.
- **Keyboard:** all links reachable by Tab, dropdown opens on Enter/Space/ArrowDown, closes on Esc. Skip link first.

---

## SECTION 1: HERO (`#home`, full viewport height)

`min-height: 100svh`, background `--color-ink`, `overflow: hidden`, position relative.

**Background stack:**
1. `<img class="hero__bg">` (cranes at dusk, `hero.jpg`) `object-fit: cover`, absolute inset-0. Slight scale 1.15 at load (parallax target).
2. `.hero__overlay`: `linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.35) 40%, #000 92%)` so the lower 35% fades to solid black behind the text.
3. `.hero__ghost` (decorative, `aria-hidden="true"`): giant outlined text **"Commercial Construction"** repeating, Outfit 700, `font-size: clamp(8rem, 20vw, 18rem)`, colour `#0F0F0F` on black (almost invisible), `white-space: nowrap`, anchored to the bottom edge and cropped by the section, `z-index: 1`.

**Content (z-index 2):** container, vertically bottom-aligned (`flex-direction: column; justify-content: flex-end`), `padding-bottom: clamp(3rem, 7vw, 5.5rem)`, max text width 900px.

- **H1** (`.hero__title`): three lines - "Engineering spaces" / "that stand the test" / **"of time"** (last line in `--color-brand`). Outfit 400, `--fs-display`, white, `line-height: 1.02`, `letter-spacing: -0.045em`. Use `<span class="line">` wrappers per line (SplitText `type: "lines"` masks them).
- **Paragraph** (`.hero__text`): "Aparajita Engicon delivers commercial and residential construction with disciplined planning, skilled crews, and accountable project management - from first estimate to final handover." Jost 400, 17px/1.7, white, max-width 640px, margin-top 28px.
- **CTA:** `btn-pill--light` "Explore now" (links `#about`), margin-top 32px.
- **Scroll cue:** small circular outlined mouse/arrow indicator at bottom-right (desktop only), `fa-arrow-down`, gently bobbing.

**Hero motion (page-load timeline, not scroll-triggered):**
- t=0: black cover (`.hero__curtain`) already hidden by CSS; the bg image scales `1.25 -> 1.05` over 2.2s `power3.out` while its opacity goes `0 -> 1` over 1.2s.
- t=0.3: header slides down `y:-100% -> 0`, 0.9s `power3.out`.
- t=0.5: H1 lines rise `yPercent:110 -> 0`, 1.1s `power4.out`, stagger 0.14s. The yellow line gets an extra 0.1s delay.
- t=1.0: paragraph `y:30, opacity:0 -> 0,1`, 0.9s.
- t=1.2: CTA button `scale:.9 -> 1`, opacity 0 -> 1, 0.7s `back.out(1.4)`.
- Ghost text: continuous slow marquee, `xPercent: 0 -> -50` over 60s linear infinite. Additionally a ScrollTrigger scrub moves it `y: 0 -> -80` as the hero leaves.
- **Scroll parallax:** `.hero__bg` moves `yPercent: 0 -> 18` with `scrub: true` over the hero's height; content fades to opacity .2 and moves `y:-60` in the last 40% of the scroll.

---

## SECTION 2: RIBBON TICKER (`.ribbons`, overlaps hero bottom)

Two black angled bands crossing slightly, like tape. Wrapper `position: relative; height: ~180px; margin-top: -60px; overflow: hidden; z-index: 3`. Rotate band A `-2deg` and band B `+1.5deg` (via CSS `transform`, defined in style.css).

- Band A (black bg, white text) text items: "Trusted Since 2005", "Design & Build", "Commercial Construction", "Custom Homes", "Industrial Construction", separated by a Font Awesome `fa-star-of-life` (yellow) between items.
- Band B (black bg, white text, slightly lower) items: "Renovation & Remodeling", "Project Management", "General Contracting", "Civil & Site Work".
- Type: Outfit 500, `clamp(1rem, 1.6vw, 1.375rem)`, padding 18px 0, items gap 48px.
- **Motion:** infinite horizontal marquee. Duplicate the track content in JS once (cloned with `aria-hidden="true"`). Band A moves left (`xPercent: 0 -> -50`, 40s, linear, infinite); band B moves right (`-50 -> 0`, 46s). Scroll boost: a ScrollTrigger changes `timeScale` to 3 while scrolling and eases back to 1 over 0.6s (velocity feel). Pause on hover. Reduced motion: static, no scrolling.

---

## SECTION 3: INTRO / VALUE PROPS (`#intro`, white with glow)

`background: #fff`, `.glow` centred behind the whole section. Padding `--section-y`. Two columns (`row`, `col-lg-5` left, `col-lg-7` right, gap 64px).

**Left:**
- Eyebrow "Excellent services".
- H2 (`--fs-h2`): "Dependable construction and project delivery" (breaks naturally into 3 lines at desktop).
- Button `btn-pill--dark` "Get started now" (arrow icon is `fa-arrow-up-right`), margin-top 32px.

**Right:** three feature rows stacked, gap 48px. Each row = 96px line-art icon (black line illustration; use inline-able SVG files `assets/img/icons/feature-1..3.svg` or Font Awesome `fa-trowel-bricks`, `fa-helmet-safety`, `fa-ruler-combined` at 56px if SVGs are unavailable) + text block:
1. **Quality workmanship** - "Every detail is carefully managed by experienced professionals to ensure lasting quality and dependable results."
2. **Reliable project delivery** - "Clear communication, careful planning, and accountable project management keep every project moving forward."
3. **Built with confidence** - "From materials and safety to final inspection, we maintain high standards throughout every stage of construction."
Title: Outfit 400, `--fs-h4` (about 24px). Body: Jost 15px/1.7, `--color-text`.

**Motion:**
- Eyebrow: bolt icon `scale:0, rotate:-90 -> 1, 0` (0.6s `back.out(2)`), text `x:-14, opacity:0 -> 0,1`. Trigger `top 85%`, once.
- H2: SplitText lines mask reveal (`yPercent:110 -> 0`, 1.1s `power4.out`, 0.12s stagger).
- Button: fade-up 24px.
- Feature rows: stagger fade-up (`y:50, opacity:0`, 0.9s, stagger 0.18s), icons additionally draw in with `scale:.8 -> 1`. Trigger `top 80%` on the group.
- Glow: slow scale pulse `1 -> 1.08` yoyo 6s, and parallax `y: 60 -> -60` scrubbed.

---

## SECTION 4: OUR SERVICES SLIDER (`#services`, white)

Centred header. Eyebrow "Our services". H2: "Construction services built around your project" (centred, max-width 760px). Paragraph (centred, max 640px): "From ground-up commercial builds to residential construction and renovations, our team coordinates every detail for safe work, clear schedules, and lasting quality."

**Trust row** (centred, margin-top 24px): three overlapping circular avatars (40px, white 2px border, -12px overlap, `avatar-1..3.jpg`) + text "Trusted by 500+ clients across all project types" (Jost 14px).

**Slider** (3 visible on desktop, 2 on tablet, 1.15 on mobile with peek): vanilla scroll-snap track (`overflow-x: auto; scroll-snap-type: x mandatory; scrollbar hidden`). Gap 20px. Prev/Next 40px black circle buttons (`fa-chevron-left/right`, white) absolutely centred vertically on the left/right edges of the track, 12px inset. JS `initSlider` scrolls by one card width, disables buttons at the ends (`aria-disabled`), supports drag-to-scroll with pointer events, ArrowLeft/ArrowRight when the track is focused, `role="region" aria-roledescription="carousel" aria-label="Our services"`. Add more than 3 cards (6 total) so it is scrollable: the 3 shown in the reference + Design-build, Civil & site work, Construction management.

**Card** (`.svc-slide`): aspect-ratio `3/4` (about 463x614), radius 28px, overflow hidden. Full-bleed photo (b&w for commercial, colour for others as in the reference). Bottom gradient overlay to solid black (bottom 40%). Bottom content: yellow Font Awesome icon (28px, `fa-building`, `fa-house-chimney`, `fa-gear`) then title Outfit 400 `--fs-h3` white (Commercial construction, Residential construction, Renovation and remodeling). On hover the image scales 1.06 (900ms `--ease-expo`), the title nudges up 6px and a short description + "Learn more" arrow link fades in beneath it.

**Motion:**
- Header block (eyebrow, H2 lines, paragraph, trust row): standard sequence, 0.12s apart.
- Avatars pop in with `scale:0 -> 1`, stagger 0.1s, `back.out(2)`.
- Cards: `y:80, opacity:0, clipPath: inset(12% 0% 0% 0% round 28px) -> inset(0% round 28px)`, 1.1s `power3.out`, stagger 0.15s, trigger `top 80%`.
- Image inside each card: parallax `yPercent:-6 -> 6` scrubbed (disabled on touch).
- Arrows: fade in after cards, `scale:.6 -> 1`.

---

## SECTION 5: ABOUT COMPANY (`#about`, `--color-bg`)

Two-column composition at desktop (`row`, left `col-lg-6`, right `col-lg-6`), padding `--section-y`.

**Top (full width):** Eyebrow "About company". H2 (max 14ch/line, 2 lines): "Building stronger spaces for businesses and communities".

**Left column** (margin-top 64px):
- Sub-heading (Outfit 400, `clamp(1.75rem, 2.6vw, 2.4rem)`): "Complete general contracting services".
- Paragraph (Jost 16px/1.8, max 480px): "At Aparajita Engicon, we turn plans into dependable places to work, live, and grow - combining practical construction expertise with careful coordination and transparent communication." (margin-top 56px)
- **Checklist** (margin-top 48px, gap 16px): each item = 22px black filled circle with white `fa-check` + text (Jost 16px): Preconstruction planning / Quality control standards / Materials and procurement / Proven track record / Customer-centric approach / 24 x 7 call & chat support.
- Button `btn-pill--brand` "About us" (margin-top 48px).

**Right column:** two rounded images overlapping offset. Image A (`about-1.jpg`, worker with roller) 393x407-ish, top offset +60px. Image B (`about-2.jpg`, engineer in white helmet) 393x530-ish, offset 0. Radius `--radius-md`. Gap 10px. Below `lg` the images sit side by side under the text, then stack on phones.
- **Rotating badge:** a 124px yellow circle sitting on the seam between the two images (centred horizontally on the gap, at ~45% height). Circular text "About us ✦ About us ✦ About us ✦" (SVG `<textPath>` on a circle, Outfit 600 13px, black) that rotates continuously (CSS-free, GSAP `rotation:360` over 14s linear infinite). Centre holds a 12px black dot.

**Motion:**
- Eyebrow + H2 + sub-heading: line mask reveals.
- Paragraph: fade-up.
- Checklist items: stagger `x:-24, opacity:0` -> in, 0.08s, and each check circle scales in `0 -> 1` with `back.out(3)`.
- Images: reveal with a curtain - wrapper `clip-path: inset(0 0 100% 0) -> inset(0)` 1.3s `power4.inOut`, inner image `scale:1.3 -> 1`. Image B delayed 0.2s. Parallax: A moves `yPercent:-8`, B `+8` scrubbed.
- Badge: pops `scale:0, rotate:-120 -> 1, 0` (1s `back.out(1.7)`) then rotates forever. Speeds up (timeScale 4) while scrolling and eases back.

---

## SECTION 6: SERVICES GRID (`#service-grid`, white with large glow)

Centred header: Eyebrow "Excellent services". H2 (2 lines, centred): "10+ years of experience in the construction industry". `.glow` very large (about 110% width) behind the grid, strongest at the centre cell.

**Grid:** `row g-4`, 3 columns at lg, 2 at md, 1 at mobile. 6 `.dot-card`s, equal height (min-height 380px), content flex column with the arrow button pinned to the bottom.

Card content: 44px black line icon (Font Awesome `fa-building`, `fa-house-chimney`, `fa-screwdriver-wrench`, `fa-pen-ruler`, `fa-map`, `fa-clipboard-check`) -> title (Outfit 400, 24px) -> description (Jost 15px/1.7, max 280px) -> 58px yellow circle with black `fa-arrow-up-right`.

| Title | Copy |
|---|---|
| Commercial construction | Ground-up commercial projects delivered with coordinated trades and reliable schedules. |
| Residential construction | Custom homes and residential projects built around your goals and budget. |
| Renovation and remodeling | Modernize existing spaces while protecting structure, schedule, and budget. |
| Design-build services | One accountable team coordinating design, estimating, and construction. |
| Civil and site work | Site preparation, grading, concrete, utilities, and civil coordination. |
| Construction management | Clear oversight of budgets, schedules, safety, subcontractors, and quality. |

Each card is a single focusable `<a>` (whole card clickable) with an accessible name equal to the title.

**Motion:**
- Header: standard line reveal.
- Cards: grid-aware stagger (`gsap.from` with `stagger: { each: 0.1, grid: "auto", from: "start" }`), `y:60, opacity:0, scale:.96`, 0.9s `power3.out`, trigger `top 80%`.
- Dotted border "draws": on reveal, animate a mask or opacity of the border from 0 to 1 (0.6s) after the card lands.
- Hover: card lifts, yellow circle arrow rotates -45deg -> 0deg and the circle scales to 1.1; the icon does a quick 360-degree Y flip (0.6s). A soft yellow radial gradient follows the cursor inside the card (pointer-tracking via CSS variables `--mx` and `--my` set from JS with `gsap.quickSetter`; desktop only).

---

## SECTION 7: TEAM GRID (`#team`, `--color-bg`)

A 4-column x 2-row mosaic (`row g-3`, gap 12px). Cell 1 (top-left) is a **black text card**: yellow `fa-users-gear` icon, title "Experienced builders and project leaders" (Outfit 400, `--fs-h3`, white), small yellow-outlined pill "Meet the team". Remaining 7 cells are portrait photos (`team-1..7.jpg`) on a yellow `--color-brand` background (people in white hard hats and hi-vis vests, cut-out or tightly cropped, `object-fit: cover`), radius `--radius-md`, aspect ratio about `1 / 1.1`.

- On hover each photo cell reveals a name/role tag at the bottom (black pill sliding up from `y:100%`, 400ms) and the photo scales 1.05. Tags are also visible by default on touch devices and for `:focus-within`.
- Tablet: 3 columns. Mobile: 2 columns, black text card spans both columns.

**Motion:**
- Black card: slides `x:-60, opacity:0` in.
- Photo cells: randomised stagger (`stagger: { each: 0.08, from: "random" }`), `scale:.85, opacity:0, clipPath: inset(100% 0 0 0 round 20px) -> inset(0 round 20px)`, 1s `power3.out`, trigger `top 75%`.
- Subtle idle float: alternate cells drift `y: +-6` over 4-6s sine yoyo (desktop, motion-allowed only).

---

## SECTION 8: PRICING / PLANS (`#plans`, white)

Two columns: left sticky (`col-lg-4`), right plan stack (`col-lg-8`).

**Left:** Eyebrow "Best pricing plans". H2 "Flexible solutions for every project". Paragraph: "From focused renovations to complete commercial builds, choose the level of support that fits your project. Every package is tailored around scope, transparency, and reliable delivery." `btn-pill--brand` "Get a quote". The left column uses `position: sticky; top: 120px` on lg and up (implemented via ScrollTrigger pin, not CSS sticky, because of ScrollSmoother).

**Right:** three stacked plan cards (`.plan-card`, gap 24px, radius 20px, padding 32px, two inner columns: left plan info, right "What's included?").

1. **Essential Build** - white card, 1.5px dotted border. Price "From Rs 25 Lakh" (Outfit 400, 56px; add `<!-- TODO: confirm pricing -->`). Description "Ideal for smaller construction, renovation, and professional project management." Button `btn-pill--dark` "Get a quote". Included list: Quality materials, Safety management, Project planning, Site preparation, Skilled labour.
2. **Complete Build** - **black card**, white text, yellow price "From Rs 75 Lakh". Description "Designed for larger residential and commercial projects requiring full coordination and management." Yellow button "Get a quote". Included: Complete project management, Design & build coordination, Premium materials, Skilled contractor team, Quality & safety control. Include a small yellow "Most popular" pill at top right.
3. **Custom Project** - white card. Price text "Let's Talk". Description "For complex projects requiring a tailored scope, dedicated management, and specialised trades." Button black "Get a quote". Included: Custom project planning, Dedicated project manager, Specialised trades, Material & supplier coordination, Final inspection & handover.

Included list: heading "What's included?" Outfit 500 16px, items Jost 15px with a 16px yellow filled circle containing a black `fa-check` (10px), gap 12px.

**Motion:**
- Left column pins while the cards scroll.
- Cards: `y:80, opacity:0` rise, 1s `power3.out`, each triggered individually at `top 85%`.
- Prices: count up via `data-counter` (e.g. 25 -> 25 from 0, duration 1.4s, `power2.out`, snaps to integers) when the card enters.
- Included list items stagger `x:-16, opacity:0`, 0.06s.
- Hover: dark card lifts; light cards fill their border to solid black over 300ms.

---

## SECTION 9: TRUST STRIP (`#trust`, `--color-bg`)

Single row, vertically centred, padding 64px 0. Left (about 20% width): text "Supported by the world's top venture capitalists" - replace with **"Trusted by leading developers and institutions"** (Jost 15px, `--color-text-muted`). Right (about 80%): one row of 6 greyscale monochrome logos (`partner-1..6.svg`), each 120px wide, opacity .55. On hover opacity 1.

**Motion:** the whole strip fades up once. Logos are a seamless marquee (right to left, 35s linear, pause on hover, edge fade via CSS `mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)`).

---

## SECTION 10: EXPERIENCE - STACKING CARDS (`#experience`, white with soft glow)

Centred header: Eyebrow "Experience". H2 "10+ years of experience in the construction industry".

Three **stack cards** (`.stack-card`), each: 12px solid black frame (`border: 12px solid var(--color-ink)`), radius 28px, overflow hidden, height about 440px at desktop (min 360px), grid `1.2fr 1fr`. Left = full-bleed photo (`exp-1..3.jpg`). Right = solid yellow `--color-brand` panel, padding 48px: line-art icon (56px, black) -> title (Outfit 400, `--fs-h2` scaled down to about 40px) -> description (Jost 15px) -> `btn-pill--dark` "View services".

| # | Title | Copy |
|---|---|---|
| 1 | Commercial construction | Ground-up facilities built with disciplined coordination, safe execution, and dependable schedules. |
| 2 | Renovation and remodeling | Upgrade occupied and existing spaces with careful phasing, quality control, and minimal disruption. |
| 3 | Construction management | Experienced oversight keeps budgets, schedules, safety, and subcontractors aligned. |

Mobile: single column (photo on top, aspect `16/10`, yellow panel below), frame reduces to 8px.

**Motion (core scroll effect, desktop):** The container is pinned with ScrollTrigger (`pin: true`, `scrub: 1`, `end: "+=250%"`). A single timeline: card 1 sits in place; as scroll advances card 2 enters from `yPercent:110 -> 0` and card 1 simultaneously scales to `.92` with `yPercent:-4` and brightness .85; then card 3 does the same over card 2. Each card also receives a slight horizontal offset (`x: 0 / +24 / -24`) so the stack reads as layered. Use `ease: "none"` on the scrubbed timeline. Mobile and reduced-motion: no pin, cards simply fade-up one after another.

---

## SECTION 11: PARTNERS (`#partners`, `--color-bg`)

Header row: left Eyebrow "About company" with H2 "Integrated seamlessly with trusted industry partners" (2 lines); right `btn-pill--brand` "Become a partner" (aligned to the top right at lg+, stacks below on mobile).

**Logo rows:** two horizontal marquee rows (full container width, cropped at the edges), 5 to 6 visible tiles each. Tile: white, radius 20px, 272 x 120px, centred greyscale logo (about 130px wide), gap 20px between tiles. Row 2 is offset horizontally by about 55px relative to row 1 for a brick pattern, and uses different logos (`partner-1..10.svg`).

**Motion:** row 1 moves left (30s), row 2 moves right (34s), both linear infinite, pause on hover/focus-within. Header reveals normally. Tiles scale `.96 -> 1` and fade in staggered once at first view. Reduced motion: rows are static and wrap into a grid.

---

## SECTION 12: LATEST NEWS (`#news`, white)

Centred header: Eyebrow "Latest news". H2 "Insights from the field and construction industry".

Three cards (`row g-4`, `col-lg-4 col-md-6`): image on top (aspect `4/3`, radius 20px, `news-1..3.jpg`) with a small yellow date pill overlaid top-left, then meta row (small circle avatar + author name + `fa-folder` + category, Jost 13px muted), title (Outfit 400, 24px, 2-3 lines), and a bare arrow (`fa-arrow-right-long`).
Titles: "How preconstruction planning keeps projects on track", "Construction trends shaping commercial projects", "What to expect from a dependable general contractor".
Below: centred `btn-pill--brand` "More news".

**Motion:** cards stagger-reveal `y:70, opacity:0`, 0.9s, 0.15s stagger. Image zooms `scale:1.08 -> 1` on reveal; on hover the image scales 1.06 and the title underline sweeps in from the left (300ms), arrow slides 8px right. Image inner parallax is not applied here, to keep it calm.

---

## SECTION 13: FAQ (`#faq`, `--color-bg`)

Two columns. **Left** (`col-lg-5`): large portrait image (`faq.jpg`, two engineers on site), radius 20px, aspect `4/5`. A floating **black badge** overlaps the bottom-left corner of the image: big yellow number **"10+"** (Outfit 400, 64px, `data-counter="10"` with suffix "+") and white text "Years of trusted construction expertise" (Jost 14px).

**Right** (`col-lg-7`): Eyebrow "Have any questions?". H2 "Have any questions? Here are some answers for you" (2-3 lines). Bootstrap accordion (restyled): items separated by 1px `--color-border` lines; the question is Outfit 500 `--fs-h4`; the trailing icon is a 28px `fa-plus` that rotates to a minus (`fa-minus` swap or 45-degree rotation) over 300ms. First item open on load. Panel text Jost 15px/1.75, `--color-text-muted`.
Q&A copy:
1. **How long does a construction project usually take?** - "Timelines depend on scope, permits, and site conditions. We provide a detailed schedule up front and keep you updated on every milestone."
2. **Can you work while a building stays occupied?** - "Yes. We plan phasing, safe access, and noise control so occupied spaces keep running with minimal disruption."
3. **What is included in preconstruction?** - "Feasibility review, budgeting, scheduling, value engineering, material planning, and subcontractor coordination."
4. **How do you manage budgets and change orders?** - "Every cost is tracked against an agreed budget. Changes are documented, priced, and approved by you before work proceeds."

`aria-expanded`, `aria-controls` and `aria-labelledby` must be correct (Bootstrap provides them; do not break them when restyling). Only one item open at a time.

**Motion:** image curtain reveal (same as About), badge pops in with `back.out(1.7)` and the counter runs 0 -> 10. Accordion items stagger fade-up (0.1s). Panel open/close is Bootstrap's collapse, tuned to 400ms `--ease-expo`; the plus icon rotates in sync.

---

## SECTION 14: FOOTER (`#contact`, black)

Background `--color-ink`, text `--color-text-on-dark`, padding-top 100px, bottom bar included. Content sits in the 1440 container.

**Row 1 - brand + contact trio** (`row`, align-items center): logo block (yellow 58px circle + "Aparajita Engicon" 28px white) | three icon-contact blocks, each with a 64px yellow circle (black icon: `fa-phone-volume`, `fa-envelope-open-text`, `fa-map`) and a two-line text: label (Outfit 500 16px, white) / value (Jost 16px, white). Values (mark with `<!-- TODO: confirm -->`): "Phone number / +91 00000 00000", "Email us here / info@aparajitaengicon.com", "Our location / [Office address, City, State, PIN]". Phone and email are real `tel:` and `mailto:` links.

**Row 2 - four columns** (`col-lg-3` each, margin-top 80px, headings Outfit 400 32px white):
1. **About Aparajita Engicon** - "Aparajita Engicon Pvt Ltd is a dependable engineering and general contracting company delivering commercial construction, residential building, renovations, and site management with safety and precision." (Jost 16px/1.75, white).
2. **Useful links** - Home, About Us, Services, Team, News, Contact us (Jost 16px, gap 12px). Hover: yellow, `padding-left` 8px with a tiny yellow arrow appearing.
3. **Contact information** - list with yellow icons: `fa-location-dot` (address, 2 lines), `fa-envelope`, `fa-headset` (phone), `fa-fax` (secondary phone/landline).
4. **Our newsletter** - text "Sign up to our newsletter to get the latest news and offers." and a pill form: 64px tall, `border: 1.5px solid rgba(255,255,255,.35)`, radius pill, inside a transparent email input (placeholder "Your email address") and a yellow **Subscribe** pill button inset on the right.

**Newsletter form states (must all be implemented in `initNewsletter`):**
- default; `:focus-within` (border turns yellow + focus ring); invalid (border `--color-error`, message under the field in `role="alert"`: "Please enter a valid email address."); loading (`.is-loading`, button label replaced by a spinner, input disabled, 900ms simulated request); success (message "Thank you - you're subscribed." in `aria-live="polite"`, field reset); error (network-style failure message with a retry). Use a real `<label class="visually-hidden">`, `type="email"`, `autocomplete="email"`, `required`. No inline handlers; `submit` is bound in `main.js`.

**Bottom bar** (border-top `1px solid rgba(255,255,255,.12)`, padding 28px 0): left "Privacy policy · Cookie policy", centre "Copyright (c) <span data-year></span> Aparajita Engicon Pvt Ltd. All rights reserved." (year filled by `initYear`), right social icons (`fa-facebook-f`, `fa-x-twitter`, `fa-instagram`, `fa-linkedin-in`, `fa-youtube`; 36px, muted `--color-text-on-dark-muted`, hover yellow). Each has `aria-label`.

**Back to top:** fixed bottom-right, 56x56 yellow button with rounded top corners (radius `14px 14px 0 0`), black `fa-arrow-up`. Hidden until 600px scroll, then slides up. Click scrolls to the top with `ScrollSmoother.scrollTo(0, true)` over about 1.2s. Keyboard accessible, `aria-label="Back to top"`.

**Footer motion:** columns stagger fade-up (`y:40`, 0.1s stagger) at `top 90%`; contact icon circles scale in with `back.out(2)`; the yellow circle icons do a gentle 360 rotation on hover (0.6s); the big logo block fades in first. Bottom bar fades in last.

---

## 15. SMOOTH SCROLL + GLOBAL MOTION SYSTEM (in animations.js)

**Smooth scroll:** `ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1.2, effects: true, smoothTouch: false, normalizeScroll: false })`. Only the desktop matchMedia branch (`(min-width: 992px) and (prefers-reduced-motion: no-preference)`) creates it; touch devices use native scroll. Header, offcanvas, modal and back-to-top live **outside** `#smooth-wrapper`. Anchor links (`a[href^="#"]`) call `smoother.scrollTo(target, true, "top 90px")` when the smoother exists, otherwise native `scrollIntoView`. Update the URL hash without jump and move focus to the target section (`tabindex="-1"`).

**Declarative animation API (read in JS, never inline):**
| Attribute | Behaviour |
|---|---|
| `data-anim="title"` | SplitText `type:"lines"` + mask (`overflow:hidden` wrapper per line), `yPercent:110 -> 0`, 1.1s `power4.out`, 0.12s stagger |
| `data-anim="fade-up"` | `y:40 -> 0`, opacity 0 -> 1, 0.9s `power3.out` |
| `data-anim="fade-in"` | opacity only, 0.8s |
| `data-anim="stagger"` on a parent | children `[data-anim-item]` animate in sequence (`data-stagger` default 0.12) |
| `data-anim="curtain"` | clip-path wipe + inner image `scale 1.3 -> 1` |
| `data-anim="pop"` | `scale:0 -> 1`, `back.out(1.7)` |
| `data-anim="counter"` | counts to `data-counter` value |
| `data-delay`, `data-duration` | per-element overrides |
| `data-speed`, `data-lag` | ScrollSmoother parallax (effects) |

All reveal triggers: `start: "top 85%"`, `once: true`, `toggleActions: "play none none none"`, unless a section says otherwise. Re-run `ScrollTrigger.refresh()` on `window.load` and after fonts load (`document.fonts.ready`).

**Timing language (use consistently):** micro 0.2-0.3s, UI 0.5s, reveal 0.9-1.1s, hero 1.1-1.4s. Default ease `power3.out`; titles `power4.out`; pops `back.out(1.7)`; scrubbed timelines `none`. Distances: fade-up 40px, cards 60-80px, small items 24px. Stagger 0.08-0.18s. Never animate `width/height/top/left`; use `transform`, `opacity` and `clip-path` only. Apply `will-change: transform` only to continuously animated elements (marquees, badge) and remove it after reveals complete.

**Responsive matchMedia branches:**
- `(min-width: 992px)`: smoother, pins (pricing left column, experience stack), parallax, cursor glow.
- `(max-width: 991px)`: no smoother, no pins; reveals only (slightly shorter distances: fade-up 24px).
- `(prefers-reduced-motion: reduce)`: no smoother, no parallax, no marquee movement, no pins; every `data-anim` element is shown immediately (opacity 1, no transform) or with a 0.2s opacity fade only.

---

## 16. NO-JS / GSAP-FAILURE FALLBACK

- `<html class="no-js">` in markup; `main.js` replaces it with `js` on first line. Initial hidden states (`opacity:0`, translates) exist **only** under `.js [data-anim] { ... }` in style.css. If JS or GSAP fails, a `window` error guard in `animations.js` adds `.anim-failed` to `<html>` which resets all those states to visible.
- No content is ever only reachable through animation. All links work without JS (anchors).

---

## 17. RESPONSIVE RULES

Breakpoints (Bootstrap): sm 576, md 768, lg 992, xl 1200, xxl 1400.
- **<576:** single column everywhere; hero H1 `clamp(2.5rem, 11vw, 3.25rem)`; buttons full-width except in the header; ribbons height about 130px; slider 1.15 cards visible; team 2-col; pricing cards stack inner columns; footer columns stack with 40px gaps; back-to-top 48px.
- **576-991:** services grid 2-col; team 3-col; slider 2 cards; stack cards single-column; footer 2x2.
- **>=992:** full layouts as specified; **>=1400:** container locks at 1440.
- No horizontal page scroll at any width (marquees and the slider scroll inside their own `overflow: hidden` / `overflow-x: auto` wrappers).
- Long-content handling: headings use `text-wrap: balance`; titles in cards clamp to 3 lines (`-webkit-line-clamp`); email addresses `overflow-wrap: anywhere`; FAQ answers grow freely.
- Empty/error states: the slider shows its first card if images fail; broken images fall back to a `--color-ink-soft` block with the card title still readable.

---

## 18. ACCESSIBILITY ACCEPTANCE CRITERIA (WCAG 2.2 AA - must pass)

1. Skip link is the first tab stop and is visible on focus.
2. Every interactive element has a visible `:focus-visible` indicator with >= 3:1 contrast against its background (white/black dual ring on light, yellow ring on dark, black ring on yellow).
3. Text contrast >= 4.5:1 (>= 3:1 for large text). Yellow text only on black; black text on yellow. Never white text on yellow.
4. Page has one `<h1>` (hero), then `<h2>` per section in order, `<h3>` for card titles. Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<section aria-labelledby>`, `<footer>`.
5. All icon-only buttons have `aria-label`; decorative icons have `aria-hidden="true"`.
6. Slider, accordion, offcanvas and modal are fully keyboard operable (Tab, Shift+Tab, Enter, Space, Esc, arrows) and return focus to their trigger on close.
7. Marquees and the rotating badge can be paused: provide a visually-subtle "Pause animations" toggle button in the footer bottom bar (`aria-pressed`), and honour `prefers-reduced-motion`.
8. Form field has a programmatic label, errors are announced (`role="alert"`), and success is announced (`aria-live="polite"`).
9. Touch targets >= 44 x 44 CSS px.
10. Zoom to 200% and 400% reflow: no clipped or overlapping content.

---

## 19. SEO + META

`<title>Aparajita Engicon Pvt Ltd | Engineering and Construction Company</title>`, meta description (150-160 chars), canonical, `theme-color` `#0A0A0A`, Open Graph + Twitter card tags (`og-image.jpg` 1200 x 630), favicon (`favicon.svg`), `lang="en"`. Add JSON-LD `GeneralContractor` schema (name, url, logo, telephone, address, sameAs) in a `<script type="application/ld+json">` block - this is the one allowed non-executable script block.

---

## 20. ANTI-PATTERNS (prohibited)

- `style=""` attributes, `<style>` tags, inline event handlers, inline `<script>` code.
- Raw hex colours outside `:root`; one-off spacing/typography values outside the token scale.
- Bootstrap's default blue, default button/card/accordion look leaking through.
- Hover-only information with no focus/touch equivalent.
- Animating layout properties; infinite animations with no pause or reduced-motion handling.
- Using CSS `position: sticky` inside the ScrollSmoother content (use ScrollTrigger pin).
- Stock lorem ipsum, placeholder text such as "Logo Ipsum", or Framer/ForgeBuilt references.
- Vague link text ("click here"). Every link says where it goes.

---

## 21. QA CHECKLIST (verify before delivery)

- [ ] `grep -r 'style="' index.html` returns nothing; no `<style>` or inline `<script>` code in `index.html`.
- [ ] Only `style.css`, `main.js`, `animations.js` are authored; all three load without console errors.
- [ ] Every colour/radius/shadow/duration references a `:root` token.
- [ ] All 14 sections match the copy, order and layout above at 1920, 1440, 1024, 768, 390 widths.
- [ ] Hero timeline plays once on load; header hide/show works; no layout shift.
- [ ] Button text-roll and arrow rotation work on hover and keyboard focus for all four variants.
- [ ] Ribbons, partner rows, trust strip and rotating badge animate and pause correctly.
- [ ] Experience stack pins and layers smoothly on desktop; falls back to simple reveals on mobile.
- [ ] Slider arrows, drag, keyboard and disabled states work.
- [ ] FAQ accordion opens one at a time with correct ARIA; newsletter form shows all states.
- [ ] Reduced-motion and GSAP-failure fallbacks leave all content visible.
- [ ] Lighthouse: Accessibility >= 95, Best Practices >= 95, SEO >= 95, Performance >= 85 on mobile.
- [ ] All images have dimensions, alt text, and lazy loading (except hero).
