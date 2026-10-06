Add a **poster-based background video** to the Hero section (Section 1, `#home`) of the existing "Aparajita Engicon Pvt Ltd" website (static HTML5 + one `style.css` + vanilla JS + GSAP/ScrollTrigger/ScrollSmoother + Bootstrap 5.3 + Font Awesome 6 Free). This is an **add-on to the existing hero**, not a rebuild. Match every detail exactly.

"Poster-based" means: the page always paints a still **poster image first** (fast, great LCP, works with no video at all). The video loads quietly afterwards and **crossfades in over the poster only when it is actually playing**. If the video cannot or should not play (slow network, data saver, reduced motion, autoplay blocked, error), the visitor simply keeps seeing the poster and the hero still looks finished.

---

## STRICT ISOLATION RULES (highest priority - read before anything else)

This is a **purely additive insert**. It **must not change, shift, restyle, re-time or break any existing part of the website**, including the existing hero image, overlay, ghost text, hero content, load timeline, parallax, header, ribbons and every other section. If any rule below conflicts with another instruction, **these rules win**.

1. **Additive edits only.** Permitted changes to existing files:
   - `index.html`: insert the new video layer, scrim and toggle button **inside the existing hero markup** at the exact positions in Section 2, each wrapped in `<!-- HERO VIDEO: START -->` / `<!-- HERO VIDEO: END -->`.
   - `style.css`: append one block `/* 1A. HERO VIDEO */` (wrapped in `/* 1A START */` / `/* 1A END */`), add the two new tokens at the **end** of `:root`, and add new lines tagged `/* 1A */` inside the existing responsive and reduced-motion blocks.
   - `main.js`: add one function `initHeroVideo()` and one call line in the existing `DOMContentLoaded` handler.
   - `animations.js`: add one function `initHeroVideoMotion()` and one call line inside the existing `gsap.matchMedia()` handler, right after the existing `initHero()` call.
   - Nothing else may be edited, reformatted, reordered, renamed or deleted. No formatter runs. Targeted insertions only.
2. **Existing hero elements are untouched.** The existing `<img class="hero__bg">` (poster/fallback layer and LCP element, `fetchpriority="high"`), `.hero__overlay`, `.hero__ghost`, hero content, scroll cue and the hero load timeline keep their current markup, classes and tweens. **Do not remove, replace, hide or re-parent the existing hero image.**
3. **CSS is fully scoped.** Every new selector starts with `.hero__video`, `.hero__scrim` or `#home .hero__video-toggle`. No bare element selectors, no `*`, no `!important`, no edits to existing hero classes or shared components (`.btn-pill`, `.eyebrow`, `.visually-hidden`, `.site-header`).
4. **No layout side effects.** The video layer is `position: absolute; inset: 0` inside the hero and takes no space in flow, so there is **zero layout shift** and the hero's height, ribbon overlap and content position do not change.
5. **Unique hooks.** All JS hooks use the `data-hero-video-*` prefix or `js-hero-video` classes. Existing handlers never select them.
6. **Fail-safe.** Each new function is wrapped in a silent `try/catch`. On any error the video layer is removed from the DOM and the poster stays. An error here must never stop other initialisers from running.
7. **Fully reversible.** Deleting the marked chunks (HTML, CSS, two JS functions and their two call lines) returns the site to its exact previous state.
8. **Regression gate:** before/after full-page screenshots at 1920, 1440, 768 and 390; hero load timeline, parallax, header states, ribbons and every other section must be unchanged; no new console errors; CLS not worse; the file diffs are additions only.

## CODE RULES (inherited from the master prompt)

- **No inline styles.** No `style=""` attributes, no `<style>` blocks. (Runtime styles written by GSAP are allowed.) All CSS in `style.css`.
- **No inline JavaScript.** No `onclick=""`, no `<script>` code. UI logic in `main.js`, GSAP in `animations.js`.
- **Tokens only.** No raw hex or one-off values outside `:root`. Add exactly these two tokens at the end of `:root`:
  - `--color-scrim: rgba(0, 0, 0, 0.28);`
  - `--dur-video-fade: 1200ms;`
- BEM naming, no ID selectors for styling, no console logs, no dead code.

---

## 1. ASSETS

Create a new folder `assets/video/`. Images stay in `assets/img/`.

| File | Spec |
|---|---|
| `assets/videos/hero-1080.webm` | VP9, 1920x1080, 24-30 fps, **no audio**, 8-14 s seamless loop, target <= 3 MB |
| `assets/videos/hero-1080.mp4` | H.264 High, yuv420p, 1920x1080, 24-30 fps, **no audio**, `+faststart`, target <= 4 MB (hard max 6 MB) |
| `assets/videos/hero-720.webm` | VP9, 1280x720, no audio, target <= 1.5 MB |
| `assets/videos/hero-720.mp4` | H.264, 1280x720, no audio, `+faststart`, target <= 2 MB |
| `assets/img/hero-poster.png` | **Exact first frame of the video**, 1920x1080, <= 150 KB (provide `hero-poster.webp` too if desired) |
| `assets/img/hero-poster-mobile.png` | Same frame, 960x1280 portrait crop, <= 90 KB |

Footage direction (cinematic, matches the dusk crane look): slow, heavy, low-motion shots only - cranes against a dusk sky, slow push-in over rebar and concrete, silhouettes of workers, drone drift over a site. No fast cuts, no shaky handheld, no text or logos in the footage. Grade it **dark and low-contrast in the lower 40%** so the white headline stays readable. The first frame must look good as a still image, because it is the poster.

**Suggested FFmpeg commands** (document them in a comment-free `README` note, not in code files):

```
ffmpeg -i source.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow -movflags +faststart hero-1080.mp4
ffmpeg -i source.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 hero-1080.webm
ffmpeg -i source.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart hero-720.mp4
ffmpeg -i source.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 hero-720.webm
ffmpeg -i hero-1080.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

Make the loop seamless by cross-dissolving the last 1 s into the first 1 s in the editor before export.

---

## 2. MARKUP (insert inside the existing `<section id="home">`)

**DOM order inside the hero (existing items shown in brackets, do not change them):**

1. [existing `<img class="hero__bg">`] - poster/fallback layer, z-index 0
2. **NEW** `<video class="hero__video">` - z-index 1
3. **NEW** `<div class="hero__scrim">` - z-index 2
4. [existing `.hero__overlay`] - z-index above the scrim (keep its current value; if it has none, it is already later in DOM so it paints above)
5. [existing `.hero__ghost`, hero content, scroll cue]
6. **NEW** `<button class="hero__video-toggle">` - after the content, z-index above content

```html
<!-- HERO VIDEO: START -->
<video class="hero__video js-hero-video" muted loop playsinline preload="none"
       poster="assets/img/hero-poster.jpg"
       aria-hidden="true" tabindex="-1"
       disablepictureinpicture disableremoteplayback
       data-hero-video-poster-mobile="assets/img/hero-poster-mobile.jpg"
       data-hero-video-webm-lg="assets/video/hero-1080.webm"
       data-hero-video-mp4-lg="assets/video/hero-1080.mp4"
       data-hero-video-webm-sm="assets/video/hero-720.webm"
       data-hero-video-mp4-sm="assets/video/hero-720.mp4"></video>
<div class="hero__scrim" aria-hidden="true"></div>
<!-- HERO VIDEO: END -->
```

```html
<!-- HERO VIDEO: START -->
<button class="hero__video-toggle js-hero-video-toggle" type="button" aria-pressed="false" aria-label="Pause background video" hidden>
  <i class="fa-solid fa-pause" aria-hidden="true"></i>
</button>
<!-- HERO VIDEO: END -->
```

Notes:
- The `<video>` has **no `src` and no `<source>` children** in the markup, so **nothing is downloaded** until `initHeroVideo()` decides to load it. `preload="none"` is a safety net.
- `muted` is present in markup (required for autoplay, especially iOS). There is no `controls`, no `autoplay` attribute (play is started by JS only after the checks), and the video is `aria-hidden` (purely decorative).
- The toggle button starts `hidden` and is revealed by JS only if a video is actually going to play (or is blocked and can be started by the user).
- The existing `<noscript>`-free design already works: with no JS the visitor sees the existing hero image and the `poster` attribute is irrelevant.

---

## 3. CSS (block `/* 1A. HERO VIDEO */`)

- `.hero__video`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transition: opacity var(--dur-video-fade) var(--ease-out); z-index: 1; pointer-events: none; background: var(--color-ink);` Match the existing `.hero__bg` `object-position` exactly so the poster and video line up pixel for pixel.
- `.hero__video.is-playing { opacity: 1; }` (added by JS only when the video is truly playing and the hero intro has finished).
- `.hero__scrim`: `position: absolute; inset: 0; background: var(--color-scrim); z-index: 2; pointer-events: none; opacity: 0; transition: opacity var(--dur-video-fade) var(--ease-out);` and `.hero__video.is-playing + .hero__scrim { opacity: 1; }`. The scrim only exists to guarantee the white text stays >= 4.5:1 once real video (which can be brighter than the still) is showing.
- `.hero__video-toggle`: 44x44px round, `border: 1px solid rgba(255,255,255,.45)` (use a token-derived value; no raw hex), `background: rgba(10,10,10,.45)`, `backdrop-filter: blur(8px)`, white icon 14px, `position: absolute; bottom: clamp(1.25rem, 3vw, 2.5rem); right: clamp(1.25rem, 4vw, 3rem); z-index: 5`. On desktop it sits **24px to the left of the existing scroll cue** (offset with a CSS variable, do not move the cue); on mobile (cue hidden) it sits at the same bottom-right position.
- **States (all required):** default; hover (`background: var(--color-brand)`, icon `--color-ink`, 300ms); `:focus-visible` (yellow ring, 3px, 3:1 contrast); `:active` (scale .94, 150ms); `[hidden]` (not rendered); `[aria-pressed="true"]` (icon swaps to `fa-play` via a class toggled by JS, label "Play background video"); disabled is not used; loading/error are N/A (the button only appears when playback is possible).
- Reduced motion (inside the existing block, tagged `/* 1A */`): `.hero__video, .hero__scrim, .hero__video-toggle { display: none; }` - the poster layer alone remains.
- The video, scrim and toggle are hidden in print.

---

## 4. LOADING AND PLAYBACK LOGIC (`main.js` -> `initHeroVideo()`)

All steps run in order. If any gate fails, **stop silently and keep the poster** (and `remove()` the `<video>`, scrim and toggle so no empty layer remains).

**Gates (do not load video at all if any is true):**
1. `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
2. `navigator.connection` exists and (`saveData === true` or `effectiveType` is `"slow-2g"`, `"2g"` or `"3g"`)
3. `window.matchMedia("(prefers-reduced-data: reduce)").matches`
4. The browser cannot play either `video/webm; codecs="vp9"` or `video/mp4; codecs="avc1.640028"` (`canPlayType` returns empty)

**Load timing (never compete with LCP):**
5. Wait for `window` `load`, then `requestIdleCallback` (fallback `setTimeout` 1200 ms).
6. Choose the variant: `matchMedia("(min-width: 992px)")` -> `lg` set, else `sm` set. On small screens also swap the poster to `data-hero-video-poster-mobile` **before** load (set the `poster` attribute so it matches the video's first frame).
7. Prefer WebM when `canPlayType('video/webm; codecs="vp9"')` is `"probably"` or `"maybe"`, else MP4. Create the `<source>` elements in JS (`type` set correctly), append them, set `video.muted = true` and `video.defaultMuted = true`, then call `video.load()`.
8. **Decide once.** The variant is chosen only at first load. Never swap sources on resize or orientation change (no re-download).

**Start and reveal:**
9. Call `video.play()`. Handle the returned promise:
   - **Resolved + `playing` event fired:** wait until the hero intro has finished (minimum 2400 ms after navigation start: `delay = Math.max(0, 2400 - performance.now())`), then add `.is-playing` to the video (CSS crossfades the video in over the poster and fades the scrim in). Reveal the toggle (`hidden = false`).
   - **Rejected (autoplay blocked, e.g. Low Power Mode):** keep the poster, show the toggle in its **Play** state (`aria-pressed="true"`, label "Play background video"). A click is a user gesture, so `play()` then succeeds and the crossfade runs.
10. `video.addEventListener("error", ...)` -> remove video, scrim and toggle; poster stays.
11. `video.addEventListener("stalled"/"waiting")` for longer than 4 s while `is-playing` -> do nothing visible (the last frame holds); never show a spinner.
12. Dispatch `new CustomEvent("hero-video:playing")` on the video element once the crossfade starts, so `animations.js` can react (Section 5).

**Pause rules (save battery, CPU and bandwidth):**
13. **User toggle:** click or Enter/Space on the toggle pauses/plays and updates `aria-pressed`, the icon and `aria-label`. A user pause is remembered for the session (`sessionStorage`, key `hero-video-paused`, wrapped in try/catch) and respected on the next load (video stays on the poster until the user presses Play).
14. **Out of view:** pause when less than 15% of the hero is visible, resume when it returns (`IntersectionObserver`, threshold `[0, 0.15]`), **unless** the user manually paused.
15. **Tab hidden:** `visibilitychange` -> pause while hidden, resume when visible (unless user paused).
16. **Global "Pause animations" toggle** in the footer (existing control; do not modify it): observe its `aria-pressed` attribute with a `MutationObserver` using the selector the existing code already uses, and mirror its state onto the video. If it is pressed, the video stays paused and this toggle shows the Play state.
17. **Cleanup:** disconnect observers and remove listeners when the video is removed.

---

## 5. MOTION RULES (`animations.js` -> `initHeroVideoMotion()`)

The video must **feel identical in motion to the existing hero image**, so the crossfade is invisible and nothing jumps.

- **Starting transform:** the existing intro tween takes `.hero__bg` from `scale 1.25` to `scale 1.05` over 2.2 s. The video never shows before 2.4 s (Section 4, step 9), so set the video's static transform once with `gsap.set(".hero__video", { scale: 1.05, transformOrigin: "50% 50%" })` - it then matches the finished image exactly at the moment of the crossfade.
- **Crossfade:** 1200 ms (`--dur-video-fade`), CSS-driven, `ease-out`. The scrim fades in on the same clock. No GSAP needed for the fade.
- **Scroll parallax (desktop branch only, `min-width: 992px`, motion allowed):** replicate the existing hero image's parallax on the video with identical parameters - `yPercent 0 -> 18`, `ease: "none"`, `scrub: true`, trigger `#home`, `start: "top top"`, `end: "bottom top"`. Both layers therefore move together and the poster underneath never peeks out. **Do not alter the existing image tween**; read its numbers from the master prompt (Section 1, "Scroll parallax") and mirror them.
- **Content fade on scroll:** unchanged (existing behaviour).
- **Pause on scroll-out (belt and braces):** a ScrollTrigger on `#home` with `onLeave` / `onEnterBack` calls `video.pause()` / `video.play()` only if the video is not user-paused. (The IntersectionObserver in Section 4 is the primary mechanism; this keeps behaviour correct under ScrollSmoother.)
- **Mobile / reduced motion:** no parallax, no GSAP transform on the video (it is simply the crossfaded video at scale 1.05). Reduced motion removes the video entirely (Section 3).
- Animate only `transform` and `opacity`. No `filter`, no `width`/`height`. `will-change: transform` on `.hero__video` only while it is playing.

---

## 6. PERFORMANCE BUDGETS (must pass)

- The existing hero poster/`<img>` remains the **LCP element**. LCP must not get worse. The video request must start **after** `load` + idle.
- Total video bytes requested on first view: **<= 4 MB desktop, <= 2 MB mobile**. Poster <= 150 KB / 90 KB.
- Zero CLS from the video, scrim or toggle (all absolutely positioned inside the hero).
- Lighthouse mobile Performance >= 85 with video enabled; Accessibility >= 95.
- Serve video with correct MIME types, HTTP range requests enabled, and long-lived cache headers (`Cache-Control: public, max-age=31536000, immutable`) with hashed filenames if possible.
- Only **one** video decodes at a time; paused when off-screen or tab hidden.

---

## 7. ACCESSIBILITY ACCEPTANCE CRITERIA (WCAG 2.2 AA - must pass)

1. The video has no audio track and is `aria-hidden="true"`, `tabindex="-1"`; it is never announced.
2. **Pause/Stop/Hide (WCAG 2.2.2):** because the video auto-plays for more than 5 seconds, a visible, keyboard-reachable **Pause background video** button is always available while the video is playing. It has an accurate `aria-label` that changes with state, correct `aria-pressed`, a visible `:focus-visible` ring and a >= 44x44px touch target.
3. Text over the video keeps **>= 4.5:1** contrast (headline white on the scrim + existing overlay); verify against the brightest frames.
4. `prefers-reduced-motion`, `prefers-reduced-data`, Data Saver and the footer "Pause animations" toggle all keep the site on the poster.
5. Loop contains no flashing content (nothing flashing more than 3 times per second).
6. No keyboard trap; Tab order is unchanged except for one new stop (the toggle) placed after the hero CTA.

---

## 8. EDGE CASES

| Case | Required behaviour |
|---|---|
| JS disabled | Existing hero image only. |
| GSAP blocked | Video still loads, plays and crossfades (it does not depend on GSAP); parallax is skipped. |
| Autoplay blocked (iOS Low Power Mode) | Poster stays; toggle shows Play; click starts the video. |
| Slow or metered network | Poster only; toggle not shown. |
| Video 404 or decode error | Video, scrim and toggle removed; poster stays; no visible error. |
| User resizes across the 992px breakpoint | No source swap; layout and parallax follow existing matchMedia rules. |
| User scrolls past the hero before the video is ready | Video still finishes loading but starts only when the hero is back in view. |
| Back/forward cache restore | On `pageshow` with `persisted`, resume if not user-paused. |
| User pressed Pause earlier this session | Video stays on the poster until Play is pressed. |

---

## 9. ANTI-PATTERNS (prohibited)

- `style=""` attributes, `<style>` tags, inline handlers, inline scripts; raw hex outside `:root`.
- Using `autoplay` with a `src` in the HTML (it downloads immediately and hurts LCP).
- Removing or replacing the existing hero `<img>`; changing existing hero CSS or tweens.
- Audio tracks, `controls`, looping clips with visible jump cuts, shaky or fast footage.
- Loading both the desktop and mobile files, or re-loading on resize.
- Uncompressed or > 6 MB video; GIFs or background `<iframe>` embeds (YouTube/Vimeo) for the hero.
- Auto-playing with no pause control; ignoring reduced-motion or data-saver.
- Decorative extras around the video (vignette blobs, animated gradients, noise overlays) beyond the single scrim.

---

## 10. QA CHECKLIST

- [ ] Diffs of `index.html`, `style.css`, `main.js`, `animations.js` are **additions only**, inside the START/END markers or tagged `/* 1A */`.
- [ ] All new selectors start with `.hero__video`, `.hero__scrim` or `#home .hero__video-toggle`; no `!important`; no inline styles or scripts.
- [ ] Before/after screenshots at 1920, 1440, 768, 390 show the hero and all other sections unchanged.
- [ ] First paint shows the poster; the video crossfades in after about 2.4 s with **no jump** in scale or position.
- [ ] Network panel: no video request before `load`; correct variant (WebM on Chrome/Firefox, MP4 on Safari; 720 on mobile); no re-download on resize.
- [ ] Throttle to "Slow 3G" / enable Data Saver / enable reduced motion: poster only, no video request.
- [ ] iOS Safari with Low Power Mode: poster stays, Play button works.
- [ ] Pause button, Esc-free keyboard operation, `aria-pressed` and label updates verified; footer "Pause animations" also pauses the video.
- [ ] Video pauses when the hero is out of view and when the tab is hidden; resumes correctly; respects a user pause.
- [ ] Parallax matches the poster layer exactly; no poster edges visible.
- [ ] Text contrast >= 4.5:1 on the brightest frame; Lighthouse mobile Performance >= 85, Accessibility >= 95, no added CLS.
- [ ] Deleting the marked chunks restores the previous hero exactly.