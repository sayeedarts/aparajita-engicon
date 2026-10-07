Add a new **Featured Services - Pinned Mask Reveal** section to the existing "Aparajita Engicon Pvt Ltd" website (static HTML5 + one `style.css` + vanilla JS + GSAP/ScrollTrigger/ScrollSmoother/SplitText + Bootstrap 5.3 + Font Awesome 6 Free). This section is **SECTION 6A**. It is inserted **after Section 6 (Services Grid) and before Section 7 (Team)**. No existing section is renumbered. Match every detail exactly.

**Concept:** a full-bleed split screen. The **left half** is a dark panel whose service text scrolls normally (one full-screen "pane" per service). The **right half** is a **pinned image frame** holding a stack of six photos. While the visitor scrolls, the top photo is **masked away upward** (clip-path wipe) to reveal the next photo underneath, with a parallax push and a thin yellow edge line following the mask. It is the pinned mask-reveal pattern from the CodePen reference, restyled to our black + yellow system and layout (dark left panel, big light headline, outlined button, full-bleed image like the reference screenshot).

**The six featured services (from the reference grid image):** Plumbing Works, Fire Fighting Works, Water Filtration Plants, Swimming Pools, Civil Works, Engineering Consultancy.

---

## 1. WHAT IS ADAPTED FROM THE CODEPEN (and what must NOT be ported)

| CodePen (`gridmorphic/WbQPRwv`) | Our implementation |
|---|---|
| Lenis smooth scroll | **Not used.** The site already runs ScrollSmoother. Do not add Lenis or a second scroll engine. |
| `element.style.zIndex = data-index` set in JS | **No inline styles.** Stacking order is set in CSS with modifier classes `.svc-media--1` ... `--6`. |
| `style="background-color: ..."` on links | **Not allowed.** The button uses our shared `.btn-pill` system (new scoped `--ghost` modifier). |
| `body` background colour tweens per step | **Removed.** Never animate `body` or any element outside this section. |
| `object-position` parallax | Replaced with **`yPercent` + `scale` on an oversized image** (GPU friendly, works for any image aspect ratio). |
| `ScrollTrigger.matchMedia()` (deprecated) | `gsap.matchMedia()` with named conditions. |
| JS sets `order` for mobile interleave | **CSS-only** interleave using `order` classes (no inline styles). |
| Rounded 540 x 400 card | **Full-bleed** right half, 100svh tall, sharp corners (like the reference screenshot). |
| Plain image swap | Adds yellow **edge line**, **caption tag**, **progress line**, text reveals, reduced-motion and failure fallbacks. |

---

## 2. STRICT ISOLATION RULES (highest priority)

This is a **purely additive, self-contained insert**. Adding it **must not change, shift, restyle, re-time or break any existing part of the website**. If any rule conflicts with another instruction, **these rules win**.

1. **Additive edits only:**
   - `index.html`: insert one `<section id="featured-services">` wrapped in `<!-- FEATURED SERVICES: START -->` / `<!-- FEATURED SERVICES: END -->`, between the Services Grid section and the Team section.
   - `style.css`: append one block `/* 7B. FEATURED SERVICES */` (wrapped in `/* 7B START */` / `/* 7B END */`), add the token `--svc-h: max(100svh, 40rem);` at the **end** of `:root`, and add lines tagged `/* 7B */` inside the existing responsive, reduced-motion and `.js` initial-state blocks.
   - `animations.js`: add one function `initFeaturedServices()` (wrapped in `// FEATURED SERVICES START` / `END`) and **one** call line, placed **immediately after `initServiceGrid()` and before `initTeam()`** so ScrollTrigger pins are created in DOM order.
   - Nothing else may be edited, reformatted, reordered, renamed or deleted. No formatter runs.
2. **Scoped CSS only.** Every selector starts with `#featured-services`, `.svc`, `.svc-pane` or `.svc-media`. No bare element selectors, no `*`, no `!important`, no edits to `.container`, `.eyebrow`, `.btn-pill`, `.glow`, `.visually-hidden`, `.site-header` or Bootstrap. Variations are **new modifier classes defined inside the 7B block and scoped under `.svc`**: `.svc .eyebrow--on-dark` and `.svc .btn-pill--ghost`.
3. **Scoped JS only.** One `gsap.matchMedia()` created inside `initFeaturedServices()` (documented exception, like the marquee engine). Everything is queried from `#featured-services`. Forbidden: `killAll`, `gsap.defaults`, `ScrollTrigger.defaults`, extra global `refresh()` calls, document-wide selectors, un-removed global listeners.
4. **Unique hooks:** `data-svc-*` attributes only. No `data-anim`, no `data-counter`, no `data-intro-*`.
5. **No layout side effects:** the section is a sibling between Services Grid and Team inside `#smooth-content`. Do not wrap or move existing elements. Pinning uses `pinSpacing: false` (the left column provides the scroll length), so only this section's own height changes.
6. **Fail-safe:** `initFeaturedServices()` runs inside a silent `try/catch`; on error it adds `svc--static` to the section, which (in the 7B CSS) forces the stacked, fully visible layout (Section 5.3). The rest of the page must keep working.
7. **Reversible:** deleting the three marked chunks restores the previous site exactly.
8. **Regression gate:** before/after full-page screenshots at 1920, 1440, 768 and 390; every other section identical (vertical offset only); Pricing pin and Experience stack pin still start and end on their own sections; anchors and scrollspy still correct; no new console errors; no new horizontal scroll.

### Code rules (inherited)
No `style=""` attributes, no `<style>` blocks, no inline handlers or scripts (GSAP runtime styles are allowed). No raw hex outside `:root`. BEM naming; ids only for anchors/ARIA; no console logs; no dead code.

---

## 3. ASSETS (all from `assets/img/`)

| File | Notes |
|---|---|
| `service-plumbing.jpg` | Pump room with stainless vertical pumps and blue motors |
| `service-firefighting.jpg` | Red fire-pump room with pipework |
| `service-water-filtration.jpg` | Blue pressure vessels and control panel of a treatment plant |
| `service-swimming-pools.jpg` | Pool filtration plant room with teal vessels |
| `service-civil.jpg` | Engineer in white helmet and hi-vis vest at a multi-storey site with a crane |
| `service-consultancy.jpg` | Hands over blueprints, orange hard hat and ruler |
| `texture-dark.webp` (optional) | Seamless 400 x 400 dark noise/pattern tile, used at 6% opacity on the left panel |

Photo requirements: portrait-leaning crops, 1600 x 1800 source, WebP or JPG <= 220 KB each, subject kept in the **upper-centre / centre** so the wipe never hides the focal point. Colour-grade all six consistently (slightly desaturated, cool-neutral, deep blacks) so the set feels like one film. Every `<img>` has `width="1600" height="1800"`, `decoding="async"`, `loading="lazy"` and a meaningful `alt` (for example "Stainless vertical booster pumps in a plumbing plant room").

---

## 4. MARKUP (follow class names and data attributes exactly)

```html
<!-- FEATURED SERVICES: START -->
<section id="featured-services" class="svc" aria-labelledby="svc-title">
  <h2 id="svc-title" class="visually-hidden">Featured services</h2>

  <div class="svc__grid" data-svc-grid>

    <div class="svc__panes">
      <article class="svc-pane svc-pane--1" data-svc-pane aria-labelledby="svc-pane-1-title">
        <div class="svc-pane__inner">
          <p class="svc-pane__meta">
            <span class="eyebrow eyebrow--on-dark" data-svc-eyebrow><i class="fa-solid fa-bolt" aria-hidden="true"></i> Featured service</span>
            <span class="svc-pane__count" data-svc-count aria-hidden="true">01 <span class="svc-pane__total">/ 06</span></span>
            <span class="visually-hidden">Service 1 of 6</span>
          </p>
          <h3 id="svc-pane-1-title" class="svc-pane__title" data-svc-title>Plumbing Works</h3>
          <p class="svc-pane__text" data-svc-text>...</p>
          <a class="btn-pill btn-pill--ghost" href="#contact" data-svc-cta>
            <span class="btn-pill__label"><span class="btn-pill__text">Start your project</span><span class="btn-pill__text" aria-hidden="true">Start your project</span></span>
            <span class="btn-pill__icon"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
          </a>
        </div>
      </article>
      <!-- panes 2-6 identical structure, classes svc-pane--2 ... --6 -->
    </div>

    <div class="svc__media">
      <div class="svc__pin" data-svc-pin>
        <figure class="svc-media svc-media--1" data-svc-media>
          <img class="svc-media__img" data-svc-img src="assets/img/service-plumbing.jpg" alt="..." width="1600" height="1800" loading="lazy" decoding="async">
          <figcaption class="svc-media__tag" data-svc-tag aria-hidden="true"><span>01</span> Plumbing Works</figcaption>
        </figure>
        <!-- figures 2-6, classes svc-media--2 ... --6 -->
        <span class="svc__edge" data-svc-edge aria-hidden="true"></span>
        <span class="svc__progress" aria-hidden="true"><span class="svc__progress-bar" data-svc-progress></span></span>
      </div>
    </div>

  </div>
</section>
<!-- FEATURED SERVICES: END -->
```

### Copy (sample text - mark each pane with `<!-- TODO: confirm copy with client -->`; do not invent standards, certifications or numbers)

| # | Title | Paragraph |
|---|---|---|
| 01 | Plumbing Works | Complete plumbing design and installation for buildings and industrial facilities - water supply, drainage, pumping and sanitary systems, tested before handover. |
| 02 | Fire Fighting Works | Hydrant, sprinkler and pump-room systems engineered, installed and commissioned for dependable protection when it matters most. |
| 03 | Water Filtration Plants | Design, supply and installation of water treatment and filtration plants that deliver consistent, clean water for industrial, commercial and residential use. |
| 04 | Swimming Pools | Pool construction with filtration, circulation and plant-room systems planned for water quality, safety and low-maintenance operation. |
| 05 | Civil Works | Foundations, structures and site works delivered with disciplined planning, quality control and safe execution from excavation to finish. |
| 06 | Engineering Consultancy | Technical advice, design and site supervision that turns requirements into buildable, cost-aware engineering solutions. |

---

## 5. LAYOUT AND STYLE

### 5.1 Section shell
- `.svc { position: relative; background: var(--color-ink); color: var(--color-text-on-dark); isolation: isolate; z-index: 0; }` Full-bleed (no container cap).
- `.svc__grid`: CSS grid, `grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr)`, `align-items: stretch` (desktop pinned layout, Section 5.2).

### 5.2 Desktop pinned layout (`min-width: 992px` AND `prefers-reduced-motion: no-preference` AND `.js` AND not `.svc--static`)
- **Left `.svc__panes`:** background `--color-ink` with an optional `::before` texture (`texture-dark.webp`, opacity .06, `pointer-events: none`). Each **pane** `.svc-pane` is `min-height: var(--svc-h)`, flex, `align-items: center`.
- **Pane inner:** `padding-inline-start: max(var(--container-pad), calc((100vw - 1440px) / 2 + var(--container-pad)))` (aligns with the site container; `--container-pad` is the existing fluid container padding) and `padding-inline-end: clamp(2rem, 5vw, 6rem)`; `max-width: 40rem`.
- **Meta row:** `.eyebrow--on-dark` = shared eyebrow with white text and yellow bolt; `.svc-pane__count` = Outfit 500 14px, `--color-brand`, letter-spacing .08em, pushed to the right end of the row (`margin-inline-start: auto`); `.svc-pane__total` colour `--color-text-on-dark-muted`.
- **Title `.svc-pane__title`:** Outfit **300**, `clamp(2.75rem, 5.6vw, 5.5rem)`, `line-height: 1`, `letter-spacing: -0.045em`, white, `text-wrap: balance`, `margin-block: 28px 24px`. Each title lives in its own `h3`; SplitText lines are masked (`overflow: clip` on line wrappers).
- **Paragraph `.svc-pane__text`:** Jost 400, 18px/1.7, `--color-text-on-dark-muted`, `max-width: 46ch`, `margin-bottom: 40px`.
- **Button:** `.svc .btn-pill--ghost` = transparent background, `1px solid rgba(255,255,255,.55)` border (use a token-derived value), white text, white-on-yellow arrow circle (yellow `--color-brand` circle with black arrow); hover: border and text roll to `--color-brand`, circle arrow rotates -45deg (shared roll animation). States required: default, hover, `:focus-visible` (yellow ring on dark), `:active` (scale .97), `[aria-disabled]`, loading N/A.
- **Right `.svc__media`:** stretches the full grid height. **`.svc__pin`**: `position: relative; height: var(--svc-h); overflow: hidden;` (this is the element ScrollTrigger pins).
- **`.svc-media`** (figure): `position: absolute; inset: 0; overflow: hidden; margin: 0;` stacking via classes: `.svc-media--1 { z-index: 6 }` ... `.svc-media--6 { z-index: 1 }` (first image on top, exactly like the Pen).
- **`.svc-media__img`:** `position: absolute; inset: -10% 0; width: 100%; height: 120%; object-fit: cover; object-position: center;` (the 20% overscan is the parallax slack).
- **Dark readability gradient** on every figure via `::after`: `linear-gradient(to top, rgba(10,10,10,.55), transparent 35%)`, `pointer-events: none`.
- **Caption tag `.svc-media__tag`:** bottom-left (`left: clamp(1.25rem, 3vw, 2.5rem); bottom: clamp(1.25rem, 3vw, 2.5rem)`), Outfit 500 16px uppercase, letter-spacing .04em, white on `rgba(10,10,10,.72)` with `backdrop-filter: blur(8px)`, padding 14px 22px; the leading number `<span>` is `--color-brand`. This mirrors the navy label chips in the reference grid image.
- **Edge line `.svc__edge`:** `position: absolute; inset: 0; border-bottom: 2px solid var(--color-brand); z-index: 20; pointer-events: none;` (initial: hidden).
- **Progress line `.svc__progress`:** `position: absolute; inset-block: 0; inset-inline-start: 0; width: 3px; background: rgba(255,255,255,.12); z-index: 20;` with `.svc__progress-bar { display:block; height:100%; background: var(--color-brand); transform-origin: top; }` (initial `scaleY(0)` in `.js` states).
- `.svc.is-active .svc-media, .svc.is-active .svc-media__img { will-change: clip-path, transform; }` (class toggled by ScrollTrigger only while the section is on screen).

### 5.3 Stacked layout (mobile < 992px, **and** reduced motion, **and** no-JS, **and** `.svc--static`)
This is the **default (mobile-first)** CSS; the pinned layout in 5.2 overrides it only under its media + `.js` conditions.
- `.svc__grid { display: block; }`, `.svc__panes, .svc__media, .svc__pin { display: contents; }` and each service becomes an **image-then-text pair** through CSS `order`: `.svc-media--k { order: 2k - 1 }`, `.svc-pane--k { order: 2k }` (write the 12 rules explicitly; no JS, no inline style). The grid uses `display: flex; flex-direction: column` so `order` works.
- Each `.svc-media`: `position: relative; aspect-ratio: 4 / 5; overflow: hidden;` full width, sharp corners; image still 120% tall (same parallax slack); tag at bottom-left.
- Each `.svc-pane`: ink background, `padding: 2.5rem var(--container-pad) 4rem`, title `clamp(2.25rem, 10vw, 3rem)`, button full width below 576px.
- `.svc__edge`, `.svc__progress` hidden. All content visible with no animation dependence.

---

## 6. MOTION RULES

Timing language (shared with the master): micro 0.2-0.3s, UI 0.5s, reveal 0.9-1.1s. Animate only `transform`, `opacity`, `clip-path`. All code lives in `initFeaturedServices()`, scoped to `#featured-services`.

### 6.1 Desktop pinned mask timeline (the core effect)
- **Pin:** `trigger: [data-svc-grid]`, `start: "top top"`, `end: "bottom bottom"`, `pin: [data-svc-pin]`, `pinSpacing: false`, `scrub: true` (ScrollSmoother already smooths; no extra lag), `anticipatePin: 1`, `invalidateOnRefresh: true`.
- **One step per transition** (5 transitions for 6 images), each `STEP = 1.5` timeline units on an `ease: "none"` scrubbed master timeline, so each transition spans exactly one pane of scroll (left text moves from pane k to pane k+1 while image k wipes to image k+1):

| Element | From -> To | Notes |
|---|---|---|
| Current figure | `clipPath: inset(0% 0% 0% 0%) -> inset(0% 0% 100% 0%)` | Wipes **upward** (visible area collapses to the top edge) revealing the next photo from below. Same direction as the Pen. |
| Current image | `yPercent 0 -> -5` | Moves with the wipe |
| Next image | `yPercent 5, scale 1.1 -> 0, 1` | Rises and settles ("push + settle") |
| Edge line | `yPercent 0 -> -100`, `autoAlpha 1` for the whole step, then `autoAlpha 0` in the last 0.05 | The 2px yellow line sits exactly on the mask boundary (border-bottom of a full-height element moving up 100%) |
| Current tag | `autoAlpha 1 -> 0`, `y 0 -> -16` over the first 0.4 | |
| Next tag | `autoAlpha 0 -> 1`, `y 24 -> 0` over 0.5, starting at `STEP - 0.6` | Appears as its image becomes dominant |
| Progress bar | `scaleY 0 -> 1` over the **whole** master timeline | Thin yellow line on the seam between panels |

- The last (6th) figure never wipes; it simply settles and the pin ends as the last pane scrolls out.
- **Initial state:** all figures `clip-path: inset(0)`, images 2-6 at `yPercent 5, scale 1.1`; tags 2-6, edge and progress hidden/zero via the `.js` initial-state CSS block.
- **Do not** animate `body`, backgrounds or any element outside `#featured-services`.

### 6.2 Left-pane text reveals (desktop and mobile)
One paused timeline per pane, toggled by a `ScrollTrigger` with `trigger: pane`, `start: "top 60%"`, `end: "bottom 40%"`, `onToggle`: active -> `play()` at `timeScale(1)`, inactive -> `reverse()` at `timeScale(1.8)`. This replays in both scroll directions and never leaves a pane half-visible. Wait for `document.fonts.ready` before splitting; use `SplitText` with `type: "lines"`, `mask: "lines"`, `autoSplit: true`.

| Element | Animation | Duration / ease | Delay |
|---|---|---|---|
| Eyebrow | bolt `scale 0, rotate -90 -> 1, 0`; text `x -14, opacity 0 -> 0, 1` | 0.6s `back.out(2)` / `power3.out` | 0 |
| Counter (`01 / 06`) | digits `yPercent 105 -> 0` (masked), "/ 06" fades in | 0.7s `power4.out` | 0.1 |
| Title | lines `yPercent 110 -> 0`, stagger 0.1 | 1.0s `power4.out` | 0.15 |
| Paragraph | `y 28, opacity 0 -> 0, 1` | 0.9s `power3.out` | 0.35 |
| Button | `scale .92, opacity 0 -> 1, 1` | 0.8s `back.out(1.4)` | 0.5 |

### 6.3 Mobile / tablet (< 992px, motion allowed)
- No pin. Each figure: **curtain** `clipPath inset(0% 0% 100% 0%) -> inset(0%)`, 1.1s `power3.out`, trigger `top 85%`, once.
- **Image parallax:** `yPercent -5 -> 5`, `ease: "none"`, `scrub: true`, trigger = the figure, `start: "top bottom"`, `end: "bottom top"` (this replaces the Pen's `object-position` scrub).
- Text reveals as in 6.2.

### 6.4 Pointer and hover (hover-capable devices only)
- Button: shared text roll + arrow rotation.
- Right frame: none (it is scroll-driven; no hover effect).

### 6.5 Reduced motion and failure
- `prefers-reduced-motion: reduce`: no pin, no mask, no parallax, no splitting; stacked layout (5.3), everything visible instantly (only a 0.2s opacity fade allowed).
- GSAP/SplitText blocked or error: `svc--static` -> stacked layout, all content visible.

### 6.6 Image readiness (prevents blank frames during the wipe)
An `IntersectionObserver` on `.svc` with `rootMargin: "150% 0px"` sets `loading="eager"` on all six images (and awaits `img.decode()` for the first two) before the pin begins. Call `ScrollTrigger.refresh()` **only** via the existing global refresh (no extra calls); image boxes are fixed by CSS, so late loading never shifts layout.

---

## 7. REFERENCE IMPLEMENTATION (follow this structure exactly; adapt names only)

```js
// FEATURED SERVICES START
function initFeaturedServices() {
  const root = document.querySelector("#featured-services");
  if (!root || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  try {
    const grid = root.querySelector("[data-svc-grid]");
    const pin = root.querySelector("[data-svc-pin]");
    const edge = root.querySelector("[data-svc-edge]");
    const bar = root.querySelector("[data-svc-progress]");
    const medias = gsap.utils.toArray("[data-svc-media]", root);
    const imgs = medias.map((m) => m.querySelector("[data-svc-img]"));
    const tags = medias.map((m) => m.querySelector("[data-svc-tag]"));
    const STEP = 1.5;

    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      toggleClass: { targets: root, className: "is-active" },
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { desktop, mobile } = context.conditions;

        if (desktop) {
          gsap.set(medias, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(imgs, { yPercent: 0, scale: 1 });
          gsap.set(imgs.slice(1), { yPercent: 5, scale: 1.1 });

          const main = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: grid, start: "top top", end: "bottom bottom",
              pin, pinSpacing: false, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
            },
          });

          medias.forEach((media, i) => {
            if (!medias[i + 1]) return;
            const step = gsap.timeline({ defaults: { ease: "none", duration: STEP } });
            step
              .to(media, { clipPath: "inset(0% 0% 100% 0%)" }, 0)
              .to(imgs[i], { yPercent: -5 }, 0)
              .fromTo(imgs[i + 1], { yPercent: 5, scale: 1.1 }, { yPercent: 0, scale: 1 }, 0)
              .fromTo(edge, { yPercent: 0, autoAlpha: 1 }, { yPercent: -100, autoAlpha: 1, immediateRender: false }, 0)
              .to(edge, { autoAlpha: 0, duration: 0.05 }, STEP - 0.05)
              .to(tags[i], { autoAlpha: 0, y: -16, duration: 0.4 }, 0)
              .fromTo(tags[i + 1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, STEP - 0.6);
            main.add(step);
          });

          main.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: STEP * (medias.length - 1), immediateRender: false }, 0);
        }

        if (mobile) {
          medias.forEach((media, i) => {
            gsap.from(media, {
              clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "power3.out",
              scrollTrigger: { trigger: media, start: "top 85%", once: true },
            });
            gsap.fromTo(imgs[i], { yPercent: -5 }, {
              yPercent: 5, ease: "none",
              scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
        }

        // pane text reveals (desktop + mobile): see Section 6.2
        // build one paused timeline per [data-svc-pane] and toggle it with an onToggle ScrollTrigger
      }
    );
  } catch (error) {
    root.classList.add("svc--static");
  }
}
// FEATURED SERVICES END
```

---

## 8. RESPONSIVE RULES

| Width | Behaviour |
|---|---|
| **< 576px** | Stacked pairs; image `aspect-ratio 4/5`; title `clamp(2.25rem, 10vw, 3rem)`; button full width. |
| **576-991px** | Stacked pairs; image `aspect-ratio 16/11`; text max-width 36rem. |
| **>= 992px** | Pinned split screen. Short laptops (`height < 640px`) use `--svc-h: 40rem` so text never clips. |
| **>= 1400px** | Text column aligns to the 1440 container edge; image half stays full-bleed to the viewport edge. |

Long content: titles wrap (balance) to max 3 lines; paragraphs grow freely (panes are `min-height`, not fixed). No horizontal scroll at any width.

---

## 9. ACCESSIBILITY ACCEPTANCE CRITERIA (WCAG 2.2 AA - must pass)

1. One visually hidden `h2` for the section and a real `h3` per service; headings in order.
2. Scrolling is **never hijacked**: the pin is driven by native scroll; keyboard users reach every CTA with Tab and the page scrolls to it normally.
3. Counter and caption tag are `aria-hidden`; a visually hidden "Service k of 6" provides the position. Images keep meaningful `alt` text.
4. Contrast >= 4.5:1: white and `--color-text-on-dark-muted` on ink, yellow numerals on ink, caption white on `rgba(10,10,10,.72)` over the photo (verify against the brightest image).
5. Visible `:focus-visible` ring on every CTA (yellow on dark); targets >= 44px.
6. `prefers-reduced-motion` gives the stacked static layout with no loss of content.
7. No flashing; edge line and wipes are slow, continuous and scroll-linked.

---

## 10. PERFORMANCE

- Only `transform`, `opacity` and `clip-path` animate; `will-change` only while `.is-active`.
- Six images <= 220 KB each (WebP preferred); the section's total image weight <= 1.4 MB.
- Zero CLS: every image box and pane height is fixed by CSS (`--svc-h`, aspect ratios).
- Lighthouse mobile Performance >= 85, Accessibility >= 95 with the section present.

---

## 11. ANTI-PATTERNS (prohibited)

- Inline styles or inline scripts; raw hex outside `:root`; `!important`; unscoped selectors.
- Adding Lenis or any second smooth-scroll engine; animating `body` background; touching other sections.
- `object-position` scrubbing (use transform); animating `top/left/width/height`.
- CSS `position: sticky` for the pin (use ScrollTrigger pin with ScrollSmoother).
- Scroll-jacking (wheel/touch interception, forced snap) or hiding content until JS runs.
- Decorative extras around the frame (glows, gradients on text, rounded cards) - the look is sharp, full-bleed and cinematic.

---

## 12. INTEGRATION STEPS

1. Add `--svc-h` to the end of `:root`.
2. Paste the section markup between the Services Grid and Team sections (with markers).
3. Add the `/* 7B. FEATURED SERVICES */` CSS block plus its tagged lines in the responsive, reduced-motion and `.js` initial-state blocks.
4. Add `initFeaturedServices()` and its single call line right after `initServiceGrid()`.
5. Add the six service images (and optional `texture-dark.webp`) to `assets/img/`.

## 13. QA CHECKLIST

- [ ] File diffs are **additions only**, inside the START/END markers or tagged `/* 7B */`; no inline styles/scripts.
- [ ] Pin starts exactly when the section reaches the top and releases when the last pane leaves; no jump, no extra blank space.
- [ ] Each transition: current photo wipes upward, next photo rises and settles, yellow edge follows the mask exactly, tag swaps, progress line advances; scrubbing backwards reverses perfectly.
- [ ] Left text pane k is centred while photo k is fully visible; text reveals replay in both scroll directions.
- [ ] Mobile: stacked image/text pairs in the right order, curtain + parallax work, no pin.
- [ ] Reduced motion and GSAP-failure show the stacked static layout with all six services.
- [ ] Pricing pin and Experience stack pin (below) still start and end correctly; header hide/show unaffected; anchors and scrollspy correct.
- [ ] Before/after screenshots at 1920, 1440, 768, 390 show all other sections unchanged.
- [ ] Contrast, focus ring, heading order and Lighthouse targets pass; deleting the three marked chunks restores the site exactly.
