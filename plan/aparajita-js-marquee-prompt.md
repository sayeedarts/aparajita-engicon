Replace the **CSS-driven** marquees in the existing "Aparajita Engicon Pvt Ltd" website with a single **GSAP/JS-controlled horizontal marquee engine**. It drives the **two-row Partners marquee (Section 11)** and the **Trust strip (Section 9)**. The Hero ribbon bands (Section 2) are **not** part of this task and must not be touched.

The engine is a customised version of the reference `initClientsMarquee` (vertical, 3 columns, fixed durations) rebuilt for our UI: **horizontal, two rows moving in opposite directions, seamless, resize-safe, speed-based, with eased hover pause, scroll-velocity boost and full accessibility handling.** Match every detail exactly.

---

## STRICT ISOLATION RULES (highest priority)

1. **Only these existing things may change:**
   - In `style.css`: **delete only** the `@keyframes` and `animation` declarations that drive the Partners and Trust marquees (and their pause-on-hover rules). Add one new block `/* 22A. MARQUEE ENGINE */` plus tagged `/* 22A */` lines in the reduced-motion block. Add the token `--marquee-gap: 1.25rem;` at the end of `:root`.
   - In `index.html`: on the Partners and Trust markup **only**, add the classes and `data-marquee-*` attributes listed in Section 2 and wrap tiles in the group element. Do not change copy, images, order or any other section.
   - In `animations.js`: **replace the body of the existing `initMarquees()`** (it already exists in the master function list) with the function in Section 4. Its call site stays the same.
   - In `main.js`: no changes.
   - If the footer "Pause animations" button has no `data-motion-toggle` attribute, add that single attribute to it. No other edit to it.
2. **Never touch:** the Hero ribbons and `initRibbons()`, the hero, header, other sections, Bootstrap, shared components (`.btn-pill`, `.eyebrow`, `.glow`, `.dot-card`).
3. **No inline styles, no inline JS.** (GSAP runtime transforms are allowed.) No raw hex outside `:root`. No `!important`. New CSS selectors start with `.marquee` or the existing `.partners__` / `.trust__` classes.
4. **Hooks are unique:** `data-marquee-*` attributes only. No `data-anim`.
5. **Fail-safe and reversible:** the engine is wrapped in a silent `try/catch`; on error each row gets `.marquee--static` (wrapped grid, all logos visible, no clones). Reverting the three edits restores the previous state.
6. **Regression gate:** before/after screenshots at 1920, 1440, 768 and 390 show every section unchanged (the two marquees look identical at rest), no new console errors, no new horizontal page scroll, CLS not worse.

---

## 1. WHAT CHANGES VS THE REFERENCE FUNCTION

| Reference (vertical) | Ours (horizontal) |
|---|---|
| 3 columns, `yPercent` | **2 rows (Partners) + 1 row (Trust), `xPercent`** |
| Column 2 moves down, others up | **Row 1 moves left, row 2 moves right** (`data-marquee-direction`) |
| Fixed `duration` per column | **Constant speed in px/s** (`data-marquee-speed`), duration = loop width / speed, so wide and narrow screens feel the same |
| Needs the track pre-duplicated in HTML | **JS builds the loop**: fills the group to at least the row width, then clones the whole group once (clones are `aria-hidden` and `inert`) |
| Hover: instant `pause()` / `play()` | **Eased slow-down to 0 and back (0.5s)**; mouse only; also pauses on keyboard focus-within |
| Reduced motion: do nothing | **`gsap.matchMedia()`**: motion branch builds the loop; reduced-motion branch builds nothing and CSS shows a static wrapped grid |
| No resize handling | **`ResizeObserver`** rebuilds, preserving loop progress (no jump) |
| Always running | **Paused when off-screen**, and when the footer "Pause animations" toggle is on |
| No scroll feedback | **Scroll-velocity boost** (up to 3x) that decays smoothly |
| No cleanup | **Full cleanup** (tween, ScrollTrigger, observers, listeners, clones) when the media query stops matching |

---

## 2. MARKUP CONTRACT

Each moving row follows this structure. Tiles never depend on image size for width (tile width is fixed in CSS), so group width is deterministic.

```html
<div class="partners__marquee" role="group" aria-label="Our partners">

  <div class="partners__row marquee" data-marquee-row
       data-marquee-direction="left" data-marquee-speed="55" data-marquee-start="0">
    <div class="partners__track marquee__track" data-marquee-track>
      <ul class="partners__group marquee__group" data-marquee-group>
        <li class="partners__tile"><img src="assets/img/partner-1.svg" alt="Partner name" width="130" height="40" loading="lazy" decoding="async"></li>
        <!-- 5-6 original tiles only; JS adds the rest -->
      </ul>
    </div>
  </div>

  <div class="partners__row partners__row--offset marquee" data-marquee-row
       data-marquee-direction="right" data-marquee-speed="45" data-marquee-start="0.35">
    <div class="partners__track marquee__track" data-marquee-track>
      <ul class="partners__group marquee__group" data-marquee-group> ... tiles 5-10 ... </ul>
    </div>
  </div>

</div>
```

| Row | `data-marquee-direction` | `data-marquee-speed` (px/s) | `data-marquee-start` (0-1 loop offset) |
|---|---|---|---|
| Partners row 1 | `left` | `55` | `0` |
| Partners row 2 | `right` | `45` | `0.35` (keeps the rows out of phase, brick pattern) |
| Trust strip | `left` | `40` | `0` |

- Only the **original** tiles are written in HTML (1 group). JS creates every clone.
- Logos keep meaningful `alt` text in the originals; clones are hidden from assistive tech.
- The group is a `<ul>`/`<li>` list so screen readers read the partners once as a list.

---

## 3. CSS (block `/* 22A. MARQUEE ENGINE */`)

- `.marquee { overflow: hidden; }` with the edge fade: `-webkit-mask-image` / `mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);`
- `.marquee__track { display: flex; width: max-content; will-change: transform; }`
- `.marquee__group { display: flex; flex: none; width: max-content; margin: 0; padding: 0; list-style: none; }`
- `.marquee__group > * { flex: none; }`
- `.partners__tile { flex: none; width: 272px; height: 120px; margin-inline-end: var(--marquee-gap); }` (keep existing tile look: white, radius 20px, centred greyscale logo). The **trailing margin is intentional**: it makes each group's width include its gap so the loop seam is exact.
- Row 2 brick offset: `.partners__row--offset .marquee__track { margin-inline-start: -55px; }`
- **Static fallback** (applies to `.marquee--static`, `.no-js` and the reduced-motion media query): `.marquee__track { width: auto; flex-wrap: wrap; }`, `.marquee__group { flex-wrap: wrap; width: auto; }`, `.marquee__group[aria-hidden="true"], [data-marquee-clone] { display: none; }`, mask removed, tiles keep their gap. All logos are visible and nothing moves.
- Tile states: tiles are **non-interactive** (no hover, no focus stop). If a tile is later made a link it must define default, hover (logo to full colour, 300ms), `:focus-visible` ring, `:active`, and the engine's focus-within pause covers it automatically.
- Mobile: tile `width: 220px; height: 100px`.

---

## 4. THE ENGINE (`animations.js` - replace the body of `initMarquees()`)

```js
// MARQUEES START
function buildMarqueeRow(row) {
  const track = row.querySelector("[data-marquee-track]");
  const group = track && track.querySelector("[data-marquee-group]");
  if (!track || !group) return null;

  const dir = row.dataset.marqueeDirection === "right" ? 1 : -1; // -1 = moves left
  const speed = parseFloat(row.dataset.marqueeSpeed) || 50;      // px per second
  const startAt = parseFloat(row.dataset.marqueeStart) || 0;     // 0..1
  const originals = Array.from(group.children);
  const state = { hover: 1, boost: 0, inView: true, paused: false };

  let tween = null;
  let progress = startAt;
  let lastWidth = row.offsetWidth;

  const hide = (el) => {
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("inert", "");
    el.setAttribute("data-marquee-clone", "");
    return el;
  };

  const apply = () => {
    if (!tween) return;
    const running = state.inView && !state.paused;
    tween.timeScale(running ? state.hover * (1 + state.boost) : 0);
  };

  const build = () => {
    if (tween) {
      progress = tween.progress();
      tween.kill();
    }
    track.querySelectorAll("[data-marquee-clone]").forEach((n) => n.remove());

    // 1. fill the group so it is at least as wide as the row
    let guard = 0;
    while (group.offsetWidth < row.offsetWidth && guard < 8) {
      originals.forEach((el) => group.appendChild(hide(el.cloneNode(true))));
      guard += 1;
    }

    // 2. duplicate the whole group once: track = 2 equal groups, so -50% = one loop
    const copy = hide(group.cloneNode(true));
    copy.removeAttribute("data-marquee-group");
    track.appendChild(copy);

    // 3. constant speed: duration = distance / speed
    const duration = group.offsetWidth / speed;
    const from = dir === -1 ? 0 : -50;
    const to = dir === -1 ? -50 : 0;

    tween = gsap.fromTo(
      track,
      { xPercent: from },
      { xPercent: to, duration, ease: "none", repeat: -1 }
    );
    tween.progress(progress);
    apply();
  };

  // eased hover / focus pause (mouse and keyboard only, never touch)
  const ease = (value) =>
    gsap.to(state, { hover: value, duration: 0.5, ease: "power2.out", overwrite: "auto", onUpdate: apply });
  const onEnter = (e) => { if (e.pointerType === "mouse") ease(0); };
  const onLeave = (e) => { if (e.pointerType === "mouse") ease(1); };
  const onFocusIn = () => ease(0);
  const onFocusOut = (e) => { if (!row.contains(e.relatedTarget)) ease(1); };

  row.addEventListener("pointerenter", onEnter);
  row.addEventListener("pointerleave", onLeave);
  row.addEventListener("focusin", onFocusIn);
  row.addEventListener("focusout", onFocusOut);

  // off-screen pause + scroll-velocity boost (up to 3x, decays smoothly)
  const trigger = ScrollTrigger.create({
    trigger: row,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => { state.inView = self.isActive; apply(); },
    onUpdate: (self) => {
      const target = gsap.utils.clamp(0, 2, Math.abs(self.getVelocity()) / 1200);
      if (target > state.boost) { state.boost = target; apply(); }
    },
  });

  const decay = () => {
    if (state.boost > 0.01) {
      state.boost *= Math.pow(0.94, gsap.ticker.deltaRatio());
      apply();
    } else if (state.boost !== 0) {
      state.boost = 0;
      apply();
    }
  };
  gsap.ticker.add(decay);

  // rebuild on width change, keeping the loop position
  let raf = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (Math.abs(row.offsetWidth - lastWidth) > 1) {
        lastWidth = row.offsetWidth;
        build();
      }
    });
  });
  observer.observe(row);

  build();

  return {
    setPaused(value) { state.paused = value; apply(); },
    destroy() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      trigger.kill();
      gsap.ticker.remove(decay);
      gsap.killTweensOf(state);
      if (tween) tween.kill();
      row.removeEventListener("pointerenter", onEnter);
      row.removeEventListener("pointerleave", onLeave);
      row.removeEventListener("focusin", onFocusIn);
      row.removeEventListener("focusout", onFocusOut);
      track.querySelectorAll("[data-marquee-clone]").forEach((n) => n.remove());
      gsap.set(track, { clearProps: "transform" });
    },
  };
}

function initMarquees() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const rows = gsap.utils.toArray("[data-marquee-row]");
  if (!rows.length) return;

  // own matchMedia (documented exception): runs on desktop AND mobile, never under reduced motion
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let instances = [];
    let observer = null;
    try {
      instances = rows.map((row) => buildMarqueeRow(row)).filter(Boolean);

      const toggle = document.querySelector("[data-motion-toggle]");
      if (toggle) {
        const sync = () => {
          const paused = toggle.getAttribute("aria-pressed") === "true";
          instances.forEach((i) => i.setPaused(paused));
        };
        observer = new MutationObserver(sync);
        observer.observe(toggle, { attributes: true, attributeFilter: ["aria-pressed"] });
        sync();
      }
    } catch (error) {
      instances.forEach((i) => i.destroy());
      instances = [];
      rows.forEach((row) => row.classList.add("marquee--static"));
    }

    return () => {
      if (observer) observer.disconnect();
      instances.forEach((i) => i.destroy());
    };
  });
}
// MARQUEES END
```

Why it is built this way (the builder must keep these properties):
- **Seamless loop:** the track holds two identical groups; animating `xPercent` by exactly 50% moves it one group-width, so the end frame equals the start frame. Each group's width includes a trailing gap, so there is no seam jitter.
- **Right-moving row:** animates `-50 -> 0` (the reference did the same trick for its downward column).
- **No layout thrash:** only `transform` is animated; measurements happen only in `build()`.
- **Reduced motion:** the branch never runs, so no clones exist and CSS shows the static wrapped grid.

---

## 5. BEHAVIOUR AND MOTION RULES

| Event | Behaviour |
|---|---|
| Page load | Rows start already moving (Partners row 2 offset 35% in the loop). The existing entrance reveal for the tiles (master Section 11: stagger scale/fade once) stays as is and animates **tile opacity/scale only**, never the track transform. |
| Mouse hover on a row | That row eases to a stop in 0.5s, resumes in 0.5s on leave. The other row keeps moving. |
| Keyboard focus inside a row | Same eased pause (focus-within); resumes when focus leaves. |
| Touch | No hover pause. Scroll boost still applies. |
| Scrolling | Both rows speed up with scroll velocity (max 3x) and ease back in about 1 second. Direction never flips. |
| Row off-screen | Row stops (timeScale 0) and resumes on return. |
| Resize / rotate | Loop is rebuilt with the same progress, so there is no visible jump. |
| Footer "Pause animations" on | Every marquee stops until toggled off. |
| Reduced motion | No JS motion; static wrapped logos. |
| GSAP blocked / error | `.marquee--static` or `.no-js` layout; all logos visible. |

Speed guidance: row 1 = 55 px/s, row 2 = 45 px/s, Trust = 40 px/s. Never faster than 70 px/s (readability), never slower than 30 px/s (looks stuck).

---

## 6. ACCESSIBILITY (WCAG 2.2 AA)

1. Moving content that lasts more than 5 s needs a pause mechanism: provided by hover/focus pause **and** the footer "Pause animations" toggle (`aria-pressed`, keyboard operable).
2. Clones are `aria-hidden="true"` and `inert`, so keyboard and screen readers meet each partner once.
3. Container has `role="group"` and `aria-label="Our partners"`; the list is a real `<ul>`.
4. Reduced motion shows a static grid with no information loss.
5. Logo contrast: greyscale logos on white tiles must keep >= 3:1 for graphical objects.

---

## 7. ANTI-PATTERNS (prohibited)

- Leaving any CSS `animation` or `@keyframes` on the Partners/Trust marquees (the engine must be the only driver).
- Pre-duplicating tiles in the HTML; setting tile width from image width; animating `left`/`margin`; fixed-duration tweens that change visual speed with screen width.
- Instant `pause()`/`play()` on hover; running tweens while off-screen; extra global `ScrollTrigger.refresh()` or `killAll()`.
- Inline styles, inline scripts, raw hex, `!important`; touching the Hero ribbons.

---

## 8. QA CHECKLIST

- [ ] Diffs are limited to the three permitted edits; no CSS `animation` remains on Partners/Trust.
- [ ] Row 1 moves left, row 2 moves right, rows are out of phase; loop has **no visible seam** at 1920, 1440, 768, 390.
- [ ] Constant apparent speed across widths; resizing the window does not jump or leave gaps.
- [ ] Hover eases the hovered row to a stop and back; keyboard focus does the same; touch does not pause.
- [ ] Scroll boost speeds both rows up and decays smoothly; off-screen rows stop (check in DevTools Performance).
- [ ] Footer "Pause animations" stops and restarts every marquee.
- [ ] `prefers-reduced-motion`: static wrapped grid, zero clones in the DOM; GSAP blocked: static layout, all logos visible.
- [ ] Screen reader reads each partner once; clones are not focusable or announced.
- [ ] Hero ribbons and all other sections unchanged; no new console errors; CLS not worse.
