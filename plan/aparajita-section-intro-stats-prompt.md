Add a new **Intro & Stats** section to the existing "Aparajita Engicon Pvt Ltd" website (static HTML5 + one `style.css` + vanilla JS + GSAP/ScrollTrigger/ScrollSmoother/SplitText + Bootstrap 5.3 + Font Awesome 6 Free). This section is **SECTION 2A**. It is inserted **immediately after the Hero (Section 1) and its attached ribbon band (Section 2)** and **before** the existing Section 3 (Value Props). No existing section is renumbered. Match every detail exactly.

The section introduces the company in one calm, confident spread: a big two-line statement, a short honest story with a pill checklist, a portrait photo beside a count-up stats block, and two large Mission / Vision cards (one black, one yellow).

---

## 0. NON-NEGOTIABLE CODE RULES (inherited from the master prompt)

These rules **must** be followed. They are identical to the master prompt and apply fully here.

1. **No inline styles.** No `style=""` attributes, no `<style>` blocks. All new CSS goes into the existing `assets/css/style.css`.
2. **No inline JavaScript.** No `onclick=""`, no `<script>` code blocks. All new JS goes into the existing files: counters and reveal logic in `assets/js/animations.js`, nothing else needed in `main.js`.
3. **Tokens only.** Use the existing `:root` tokens (colours, fonts, radii, shadows, easings, durations). No raw hex outside `:root`. Allowed additions to `:root` (add them once, in the tokens block, not in this section):
   - `--color-fill-soft: rgba(10, 10, 10, 0.06);` (pill background on light)
   - `--color-line: rgba(10, 10, 10, 0.14);` (hairline divider)
4. **Naming:** BEM, prefix `.intro` (e.g. `.intro__title`, `.intro-stat__value`, `.intro-card--dark`). The section id is `#who-we-are` (do **not** reuse `#intro`, which the existing Value Props section already uses). JS hooks are `data-*` attributes or `js-` classes only.
5. **CSS placement:** insert one new block, headed by a banner comment `/* 7A. INTRO & STATS */`, directly **after the Hero + Ribbons blocks and before the Value Props block**. Responsive overrides for this section go in the existing "Responsive overrides" block (mobile-first `min-width`); reduced-motion overrides go in the existing reduced-motion block; initial hidden states go in the existing `.js`-scoped animation-states block.
6. **JS placement:** add one function `initIntroStats()` to `animations.js`, called from the existing `DOMContentLoaded` handler, **inside the existing `gsap.matchMedia()`** (desktop, mobile and reduced-motion branches as defined in the master prompt, Section 15).
7. **Content is honest.** Every number in this section is a **placeholder that the client must verify**. Add an HTML comment `<!-- TODO: confirm figure with client -->` next to each stat. Do not invent awards, certifications or client names.
8. **Assets come from `assets/img/` only.** No remote URLs, no hotlinked images.

---

## 1. ASSETS (all from `assets/img/`)

| File | Use | Notes |
|---|---|---|
| `intro-1.jpg` | Portrait photo beside the stats | Engineer or site lead in a white hard hat and hi-vis vest, smiling, on site; subject in the upper-centre of the frame so `object-fit: cover` never crops the face. About 1200 x 960 source (5:4). |
| `pattern-lines.svg` | Decorative background lines | Thin concentric arcs, 1px stroke, `currentColor`-free (stroke baked at `#0A0A0A`), about 900 x 900. Used `aria-hidden`, empty `alt=""`. |

If `intro-1.jpg` is not yet in the folder, temporarily use `assets/img/about-2.jpg` and keep the same markup, so swapping later is a filename change only. Images must have `width`, `height`, `loading="lazy"`, `decoding="async"` and meaningful `alt` text ("Aparajita Engicon site engineer in a white helmet and hi-vis vest").

---

## 2. SECTION SHELL (`<section id="who-we-are" class="intro" aria-labelledby="intro-title">`)

- Background `--color-bg` (`#F8F8F8` via token). `position: relative; overflow: hidden; isolation: isolate`.
- Padding: `padding-block: var(--section-y)`; the top padding gets an extra `clamp(2rem, 4vw, 3.5rem)` because the ribbon band overlaps the hero's bottom edge.
- Container: the standard 1440px container with fluid side padding.
- **Decorative pattern:** `<img class="intro__pattern" src="assets/img/pattern-lines.svg" alt="" aria-hidden="true">` positioned absolute at the bottom-right, `width: clamp(320px, 52vw, 900px)`, `right: -8%`, `bottom: -18%`, `opacity: .5`, `pointer-events: none`, `z-index: 0`. All content sits at `z-index: 1`. Hidden below 576px to keep the mobile view clean.

### Markup skeleton (follow class names and data attributes exactly)

```html
<section id="who-we-are" class="intro" aria-labelledby="intro-title">
  <img class="intro__pattern" src="assets/img/pattern-lines.svg" alt="" aria-hidden="true" width="900" height="900" loading="lazy" decoding="async" data-speed="0.85">
  <div class="container intro__inner">

    <header class="intro__head">
      <span class="eyebrow" data-anim="eyebrow"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Who we are</span>
      <h2 id="intro-title" class="intro__title" data-anim="title">Engineering experience. Construction discipline.</h2>
    </header>

    <div class="row intro__grid">

      <div class="col-lg-5 intro__text">
        <p class="intro__tagline" data-anim="tagline"><span class="intro__tagline-bar" aria-hidden="true"></span><span class="intro__tagline-text">Dependable engineering, delivered on site.</span></p>
        <p class="intro__para" data-anim="fade-up">...</p>
        <p class="intro__para" data-anim="fade-up">...</p>
        <ul class="intro__pills" data-anim="stagger">
          <li class="intro__pill" data-anim-item><i class="fa-solid fa-check" aria-hidden="true"></i><span>...</span></li>
          <!-- 4 items -->
        </ul>
        <a class="btn-pill btn-pill--brand" href="#about" data-anim="fade-up">...</a>
      </div>

      <div class="col-lg-7 intro__visual">
        <div class="intro__top">
          <figure class="intro__photo" data-anim="curtain"><img ...></figure>
          <div class="intro__stats">
            <h3 class="intro__stats-title" data-anim="title">A decade of experience in engineering and construction.</h3>
            <span class="intro__rule" aria-hidden="true"></span>
            <ul class="intro-stats" data-anim="stats">
              <li class="intro-stat" data-anim-item>
                <p class="intro-stat__value"><span aria-hidden="true" data-counter="10" data-suffix="+">0+</span><span class="visually-hidden">10+</span></p>
                <p class="intro-stat__label">Years of experience</p>
              </li>
              <!-- 3 items -->
            </ul>
          </div>
        </div>
        <div class="intro__cards">
          <article class="intro-card intro-card--dark" data-anim-item> ... </article>
          <article class="intro-card intro-card--brand" data-anim-item> ... </article>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## 3. LAYOUT AND TYPOGRAPHY

### 3.1 Heading block (`.intro__head`)
- Eyebrow above (shared `.eyebrow` component: bolt icon + uppercase Outfit 500 14px).
- **H2 `.intro__title`**: "Engineering experience. Construction discipline." Outfit 400, `clamp(2.5rem, 5.2vw, 4.75rem)`, `line-height: 1.02`, `letter-spacing: -0.045em`, `--color-ink`, `max-width: 16ch` per line; break after the first sentence (`<br class="d-none d-md-block">` is **not** allowed in markup; instead use `text-wrap: balance` and let the two sentences wrap naturally, with each sentence in its own `<span class="line">` so SplitText masks line by line). The word "discipline." is **not** coloured; the page's yellow stays reserved for actions and numbers.
- `margin-bottom: clamp(2.5rem, 5vw, 4.5rem)` before the grid.

### 3.2 Two-column grid (`.row.intro__grid`)
- Bootstrap: left `col-lg-5`, right `col-lg-7`, `gx-lg-5`, `gy-5`. Align items `start`. On `<lg` the columns stack (text first, visual second).
- At `>= 1200px` add `padding-right: 3rem` to the left column so the paragraph measure stays near 60 characters.

### 3.3 Left column (`.intro__text`)
1. **Tagline** (`.intro__tagline`): a 3px-wide `--color-brand` vertical bar (full line-height tall, `border-radius: 2px`) + text "Dependable engineering, delivered on site." Outfit 500, `--fs-h4`, `--color-ink`; bar and text gap 20px; `margin-bottom: 28px`.
2. **Paragraph 1** (`.intro__para`, Jost 400, 17px / 1.8, `--color-text-muted`, `max-width: 56ch`): "At Aparajita Engicon, we plan, engineer and build commercial, residential and industrial projects around what each site and each client actually needs."
3. **Paragraph 2** (same style, `margin-top: 16px`): "With over a decade of hands-on experience, our approach pairs sound engineering with disciplined site management - clear schedules, controlled costs and open communication from the first estimate to final handover."
4. **Pill checklist** (`.intro__pills`, `margin-top: 36px`): 4 pills. Each pill: `display:flex; align-items:center; gap:14px; padding: 14px 24px; border-radius: var(--radius-pill); background: var(--color-fill-soft); font: Jost 500 16px/1.4; color: var(--color-text)`; leading icon is a 22px `--color-ink` circle with a white `fa-check` (10px) - this replaces the purple of the reference with the master palette. Copy:
   - "10+ years of hands-on engineering experience"
   - "Civil, structural and site-execution capability"
   - "Quality control at every stage of the build"
   - "Safety-first project management"
   Layout: 1 column at `>= 992px` and `< 576px`; 2 columns between 576 and 991px. Gap 12px. Pills are **static** (not links, no hover state, no focus stop).
5. **Button:** `btn-pill--brand` "About Aparajita" (`href="#about"`, arrow icon `fa-arrow-right`), `margin-top: 40px`. All button states come from the shared component (default, hover text roll, `:focus-visible`, `:active`, disabled).

### 3.4 Right column (`.intro__visual`)
Two stacked rows with a `row-gap` of `clamp(1.25rem, 2.2vw, 1.75rem)`.

**Row A - `.intro__top`** (CSS grid: `grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(1.5rem, 3vw, 2.5rem); align-items: start`; becomes single column below 768px, photo first):
- **Photo** (`.intro__photo`): `aspect-ratio: 5 / 4`, `border-radius: var(--radius-lg)` (28px), `overflow: hidden`, `object-fit: cover`. No border, no shadow.
- **Stats block** (`.intro__stats`):
  - **H3 `.intro__stats-title`**: "A decade of experience in engineering and construction." Outfit 400, `clamp(1.5rem, 2.3vw, 2.125rem)`, `line-height: 1.15`, `letter-spacing: -0.03em`, `--color-ink`, `text-wrap: balance`.
  - **Rule `.intro__rule`**: 1px `--color-line` hairline, full width, `margin: 24px 0 28px`.
  - **Stats list `.intro-stats`**: 3 columns (`display:grid; grid-template-columns: repeat(3, auto); justify-content: space-between; gap: 24px`; below 480px: 1 column, each stat in a row with value left and label right).
  - Each **stat**: value `.intro-stat__value` Outfit 400, `clamp(2.5rem, 4.2vw, 3.75rem)`, `line-height: 1`, `letter-spacing: -0.04em`, `--color-ink`, `font-variant-numeric: tabular-nums` (so counting never makes the layout jitter); label `.intro-stat__label` Jost 400, 16px/1.4, `--color-text`, max 2 lines, `margin-top: 12px`.
  - Stats (all placeholders, confirm with client):
    | `data-counter` | `data-suffix` | Label |
    |---|---|---|
    | 10 | + | Years of experience |
    | 250 | + | Projects delivered |
    | 100 | + | Engineers and skilled crew |
  - The yellow accent sits on a small 8px `--color-brand` dot before each label? **No** - do not add decoration. Numbers stay `--color-ink`.

**Row B - `.intro__cards`** (CSS grid, 2 equal columns, gap `clamp(1rem, 1.6vw, 1.25rem)`, single column below 768px):

Both cards share `.intro-card`: `border-radius: var(--radius-lg)`, `padding: clamp(1.5rem, 2.4vw, 2.25rem)`, `min-height: clamp(280px, 26vw, 360px)`, flex column with the number at top and the text block pinned to the bottom (`justify-content: space-between`), `overflow: hidden`, `position: relative`.

| | Card 1 - `.intro-card--dark` | Card 2 - `.intro-card--brand` |
|---|---|---|
| Background | `--color-ink` | `--color-brand` |
| Number | "01", Outfit 400, `clamp(2.75rem, 4.4vw, 4rem)`, colour `--color-brand` | "02", same size, colour `--color-ink` |
| Title (h3) | "Our Mission", Outfit 500, `--fs-h3` (scaled down to about 26px), colour `--color-text-on-dark` | "Our Vision", same, colour `--color-ink` |
| Body | Jost 400, 16px/1.7, colour `--color-text-on-dark-muted` | Jost 400, 16px/1.7, colour `--color-ink` |
| Copy | "To deliver safe, high-quality and cost-effective engineering and construction solutions - planned with care and executed with discipline on every site." | "To be a trusted name in engineering and construction, known for projects that last and for relationships that continue long after handover." |

Contrast: yellow on black and black on yellow only; never white on yellow (see master Section 18).
Cards are **non-interactive** (no link, no focus stop, no pointer cursor). The hover effect in Section 4 is purely decorative and wrapped in `@media (hover: hover) and (pointer: fine)`.

---

## 4. MOTION RULES

All motion uses the master timing language: micro 0.2-0.3s, UI 0.5s, reveal 0.9-1.1s. Ease: titles `power4.out`, general `power3.out`, pops `back.out(1.7)`, scrubbed `none`. Animate only `transform`, `opacity` and `clip-path`. Triggers use `start: "top 80%"`, `once: true` unless noted. Run everything inside one `gsap.context(() => {...}, "#who-we-are")` so it is scoped and can be reverted.

**Before any splitting** wait for `document.fonts.ready`, then use `SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, onSplit(self) { ... } })` so lines re-split on resize without a flash.

### 4.1 Sequence overview (reading order)
1. Heading block (eyebrow, then H2 lines).
2. Left text stack (tagline, paragraphs, pills, button), top to bottom, each triggered at `top 85%` of its own element so a fast scroll never reveals a block before its predecessor is on screen.
3. Photo curtain and stats block (starts when the photo's top hits 80%).
4. Mission and Vision cards (own trigger).

### 4.2 Element-by-element spec

| Element | Trigger | From -> To | Duration / ease | Stagger / delay |
|---|---|---|---|---|
| **Eyebrow** (`[data-anim="eyebrow"]`) | `top 88%` | bolt icon `scale 0, rotate -90 -> 1, 0`; text `x -14, opacity 0 -> 0, 1` | icon 0.6s `back.out(2)`, text 0.6s `power3.out` | text delay 0.1s |
| **H2 `.intro__title`** | `top 85%` | SplitText lines, `yPercent 110 -> 0` inside masks | 1.1s `power4.out` | 0.12s per line |
| **Tagline** | `top 88%` | bar `scaleY 0 -> 1` (`transform-origin: top`); text `x -20, opacity 0 -> 0, 1` | bar 0.7s `power3.inOut`, text 0.8s `power3.out` | text delay 0.2s |
| **Paragraphs** | each at `top 88%` | `y 32, opacity 0 -> 0, 1` | 0.9s `power3.out` | paragraph 2 delay 0.1s |
| **Pills** (`[data-anim="stagger"]`) | parent at `top 85%` | `y 24, opacity 0, scale .96 -> 0, 1, 1`; check circle `scale 0 -> 1` | 0.7s `power3.out`; check 0.5s `back.out(3)` | 0.1s per pill; check delay +0.15s after its pill |
| **Button** | `top 92%` | `y 24, opacity 0, scale .92 -> 0, 1, 1` | 0.8s `back.out(1.4)` | none |
| **Photo** (`curtain`) | `top 80%` | wrapper `clipPath inset(0 0 100% 0 round 28px) -> inset(0 0 0% 0 round 28px)`; inner image `scale 1.3 -> 1` | wrapper 1.3s `power4.inOut`, image 1.6s `power3.out` | none |
| **Stats H3** | same trigger as photo, delay 0.3s | SplitText lines `yPercent 110 -> 0` | 1s `power4.out` | 0.1s per line |
| **Rule** `.intro__rule` | after H3 | `scaleX 0 -> 1` (`transform-origin: left`) | 1.2s `power3.inOut` | delay 0.5s |
| **Stat items** | after the rule starts | `y 40, opacity 0 -> 0, 1` | 0.9s `power3.out` | 0.15s per stat |
| **Counters** | with their stat item | number counts `0 -> data-counter` | 1.8s `power2.out`, `snap: { value: 1 }` | starts 0.1s after its stat appears |
| **Mission / Vision cards** | `top 82%` | `y 80, opacity 0, clipPath inset(10% 0 0 0 round 28px) -> y 0, opacity 1, inset(0 round 28px)` | 1.1s `power3.out` | 0.18s per card (dark first) |
| **Card numbers "01"/"02"** | with their card, delay 0.35s | SplitText `type: "chars"` masked, `yPercent 105 -> 0` | 0.8s `power4.out` | 0.06s per char |
| **Card title and body** | with their card, delay 0.5s | `y 24, opacity 0 -> 0, 1` | 0.8s `power3.out` | title then body +0.1s |

### 4.3 Counter behaviour (`data-counter`)
- Read `data-counter` (target number), optional `data-suffix` (default none) and `data-decimals` (default 0).
- Tween a plain object `{ v: 0 }` to the target and write `Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(v) + suffix` into the `aria-hidden` span on every update. The adjacent `.visually-hidden` span already holds the final value for screen readers, so assistive tech never hears the counting.
- Always end exactly on the target (`onComplete` writes the final string).
- If the user has scrolled **past** the section before it triggers (e.g. anchor jump), set final values immediately with no tween.

### 4.4 Scroll-linked motion (desktop branch only, `min-width: 992px`, motion allowed)
- **Photo parallax:** inner `<img>` `yPercent -7 -> 7`, `scrub: true`, `ease: "none"`, trigger = the photo, `start: "top bottom"`, `end: "bottom top"`. The image is rendered at `height: 120%` (via CSS) so edges never show.
- **Card depth:** the dark card carries `data-speed="0.96"` and the yellow card `data-speed="1.04"` (ScrollSmoother effects), a barely-there differential that gives the pair depth. Never more than 4% difference.
- **Pattern lines:** `data-speed="0.85"` (drifts slower than the page) plus a slow continuous `rotation 0 -> 360` over 120s linear, infinite (stopped by `prefers-reduced-motion` and by the footer "Pause animations" toggle).
- **Heading seam:** as the section enters from the dark hero/ribbon, the H2 lines are the first thing to land, so the cut from black to off-white feels like a lit reveal rather than a hard edge.

### 4.5 Hover and pointer effects (desktop, `@media (hover: hover) and (pointer: fine)` only, decorative)
- **Cards:** lift `y: -8` and `box-shadow: var(--shadow-lift)` over 500ms `var(--ease-out)`. The number nudges right 6px. A soft radial highlight follows the pointer inside the card: JS sets `--mx` and `--my` (percent) with `gsap.quickSetter`; CSS paints `radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,.10), transparent 55%)` on the dark card and `rgba(10,10,10,.06)` on the yellow card. Reset to centre on `pointerleave` over 0.6s.
- **Photo:** `scale 1.04` on the inner image over 900ms `var(--ease-expo)`.
- **Pills and stats:** no hover effect (non-interactive, must not look clickable).

### 4.6 Matchmedia branches (master Section 15)
- **`(min-width: 992px)` and motion allowed:** everything above, including parallax, pointer highlight and data-speed.
- **`(max-width: 991px)`:** reveals only. Reduce distances (paragraph/stat `y: 24`, card `y: 48`), keep durations, drop parallax, pattern rotation and pointer highlight. Counters still count.
- **`(prefers-reduced-motion: reduce)`:** no splitting, no parallax, no rotation, no pointer effects. Every element is shown immediately in its final state (`opacity: 1`, no transform); counters show their final values instantly; only a 0.2s opacity fade is allowed.
- **GSAP failure / no-JS:** nothing in this section may rely on animation to become visible. Initial hidden states exist only under `.js [data-anim] {...}` in `style.css` and are reset by `.anim-failed` (master Section 16).

### 4.7 Performance
- `will-change: transform` only on the rotating pattern and the parallax image; remove it in `onComplete` for all reveal tweens.
- Use `ScrollTrigger.batch` for the stats and pills if you prefer, but keep the specified order.
- Call `ScrollTrigger.refresh()` after `window.load` and `document.fonts.ready` (the master handler already does this; do not add duplicates).
- No layout shift: the photo has `aspect-ratio` and explicit `width`/`height`; counters use tabular numerals and a reserved `min-width: 4ch` on `.intro-stat__value`.

---

## 5. RESPONSIVE RULES

| Width | Layout |
|---|---|
| **< 576px** | Everything single column. H2 `clamp(2.25rem, 10vw, 2.75rem)`. Pills 1 column. Photo full width (`aspect-ratio: 4 / 3`), stats stacked (value left, label right, hairline between rows). Cards stack, `min-height: 260px`. Pattern hidden. Button full width. |
| **576-767px** | Single column; pills 2 columns; stats 3 across; cards stack. |
| **768-991px** | Single column text, then visual. Photo and stats side by side in `.intro__top`; cards 2 columns. |
| **992-1199px** | Two columns (5 / 7). Pills 1 column. Photo narrower (`0.7fr`) and stats title may wrap to 4 lines (allowed). |
| **>= 1200px** | Full layout as specified. |
| **>= 1400px** | Container locks at 1440px; no further growth. |

Long-content handling: stat labels clamp to 2 lines; card body text grows freely (cards are `min-height`, not fixed); headings use `text-wrap: balance`; no horizontal scroll at any width.

---

## 6. ACCESSIBILITY ACCEPTANCE CRITERIA (must pass)

1. One `<h2>` for the section (`#intro-title`) and `<h3>` for the stats title and each card title; heading order has no gaps.
2. The section is labelled by its H2 (`aria-labelledby="intro-title"`).
3. Stats are a real `<ul>`/`<li>` list. Animated numbers are `aria-hidden="true"`; the final value is exposed in a `.visually-hidden` sibling so screen readers read "10+ Years of experience" once, correctly.
4. Pill checklist is a `<ul>`; check icons are `aria-hidden="true"`; pills are not focusable.
5. Text contrast >= 4.5:1: ink on `--color-bg`, yellow numerals on black, ink on yellow, `--color-text-muted` paragraphs on `--color-bg`. White on yellow is prohibited.
6. The single focusable control here (the button) has a visible `:focus-visible` ring and a descriptive label ("About Aparajita", not "Read more").
7. All motion respects `prefers-reduced-motion` and the footer "Pause animations" toggle (`aria-pressed`) for the continuously rotating pattern.
8. Zoom to 200% and 400%: no overlap, no clipped text, no horizontal scroll.
9. Decorative image (`pattern-lines.svg`) has `alt=""` and `aria-hidden="true"`; the photo has descriptive alt text.

---

## 7. ANTI-PATTERNS (prohibited in this section)

- `style=""` attributes, `<style>` tags, inline handlers or inline scripts.
- Raw hex or one-off sizes outside the tokens; any extra colour (no green, purple or blue from the reference images; they are layout references only).
- Fabricated stats, awards, ratings, "trusted by" claims or client logos. All numbers are placeholders to confirm.
- Lorem ipsum (the reference images contain it; replace everything with the copy above).
- Decorative extras that carry no meaning: floating blobs, sparkles, glowing orbs, gradient text, emoji, icon-in-circle rows for the stats.
- Making the pills or cards look clickable, or animating `width`/`height`/`top`/`left`.
- Heavy number-roll "slot machine" effects or counters that run longer than 2 seconds.
- Reusing the id `#intro`.

---

## 8. INTEGRATION STEPS (do in this order)

1. Add the two new tokens (`--color-fill-soft`, `--color-line`) to `:root`.
2. Paste the section markup in `index.html` between the Ribbons block (Section 2) and the Value Props section (Section 3).
3. Add the `/* 7A. INTRO & STATS */` CSS block to `style.css`, plus its responsive, `.js` initial-state and reduced-motion rules in the shared blocks.
4. Add `initIntroStats()` to `animations.js` and call it inside the existing `gsap.matchMedia()` handler, after `initRibbons()` and before the Value Props initialiser.
5. Add `intro-1.jpg` and `pattern-lines.svg` to `assets/img/`.
6. Optional: add a "Who we are" anchor to the footer Useful links pointing at `#who-we-are`. Do not add it to the primary header nav (it is already crowded).

---

## 9. QA CHECKLIST

- [ ] `grep -r 'style="' index.html` still returns nothing; no new `<style>` or inline `<script>`.
- [ ] New CSS lives only in `style.css` under `/* 7A. INTRO & STATS */`; new JS lives only in `animations.js`.
- [ ] Section sits directly after the ribbon band and before Value Props; ids are unique.
- [ ] Layout matches Section 3 at 1920, 1440, 1024, 768 and 390 widths; no horizontal scroll.
- [ ] H2 lines mask-reveal; tagline bar draws; paragraphs, pills and button reveal in reading order.
- [ ] Photo curtain plays once, then parallax runs only on desktop.
- [ ] Counters end exactly on 10+, 250+, 100+ (placeholders flagged with TODO comments); screen readers hear each value once.
- [ ] Mission and Vision cards stagger in; hover lift and pointer highlight appear only on hover-capable devices.
- [ ] Reduced-motion: all content visible instantly, counters show final values, nothing moves.
- [ ] GSAP blocked: the whole section is still fully visible and readable.
- [ ] Contrast, focus ring, heading order and landmark checks from Section 6 pass.
- [ ] Lighthouse (mobile): Accessibility >= 95, no CLS from this section.
