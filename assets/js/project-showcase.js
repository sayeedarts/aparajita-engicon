(function () {
  "use strict";

  // Safe Guard Check
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-pshow]");
    if (!root) return;

    var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var stage = root.querySelector("[data-pshow-stage]");
    var introStage = root.querySelector(".pshow__intro");
    var mark = root.querySelector(".pshow__mark");
    var scrim = root.querySelector(".pshow__scrim");
    var content = root.querySelector("[data-pshow-content]");
    var slides = Array.from(root.querySelectorAll("[data-pshow-slide]"));
    var thumbs = Array.from(root.querySelectorAll("[data-pshow-thumb]"));
    var lineInners = Array.from(root.querySelectorAll(".pshow__line-inner"));
    var barHairline = root.querySelector(".pshow__bar-hairline");
    var labelsChips = Array.from(root.querySelectorAll(".pshow__label, .pshow__chip"));
    var strip = root.querySelector("[data-pshow-strip]");
    var thumbImgs = Array.from(root.querySelectorAll(".pshow__thumb-img"));
    var thumbTexts = Array.from(root.querySelectorAll(".pshow__thumb-text"));
    var viewLink = root.querySelector("[data-pshow-view]");
    var toggleBtn = root.querySelector("[data-pshow-toggle]");
    var liveRegion = root.querySelector("[data-pshow-live]");
    var introBar = root.querySelector("[data-pshow-intro-bar]");
    var introProgress = root.querySelector(".pshow__intro-progress");

    if (!stage || !slides.length || !thumbs.length) return;

    var currentIndex = 0;
    var isAnimating = false;
    var isUserPaused = false;
    var isHoverPaused = false;
    var isOffscreenPaused = false;
    var isTabHiddenPaused = false;
    var autoplayTween = null;

    // Read start scale from CSS
    function getStartScale() {
      var computed = getComputedStyle(root).getPropertyValue("--pshow-start-scale").trim();
      var parsed = parseFloat(computed);
      return isNaN(parsed) ? 0.245 : parsed;
    }

    // Update active UI elements for slide index
    function updateUI(index, isUserAction) {
      thumbs.forEach(function (thumb, idx) {
        var isActive = idx === index;
        if (isActive) {
          thumb.classList.add("pshow__thumb--active");
          thumb.setAttribute("aria-current", "true");
        } else {
          thumb.classList.remove("pshow__thumb--active");
          thumb.removeAttribute("aria-current");
        }
        var bar = thumb.querySelector(".pshow__thumb-bar");
        if (bar) {
          gsap.killTweensOf(bar);
          gsap.set(bar, { scaleX: 0 });
        }
      });

      var activeThumb = thumbs[index];
      if (activeThumb) {
        var name = activeThumb.getAttribute("data-pshow-name") || "";
        var cat = activeThumb.getAttribute("data-pshow-cat") || "";
        var href = activeThumb.getAttribute("data-pshow-href") || "#contact";

        if (viewLink) {
          viewLink.setAttribute("href", href);
          var viewText = viewLink.querySelector(".pshow__view-text");
          if (viewText) {
            viewText.textContent = "View project: " + name;
          }
        }

        if (liveRegion && isUserAction) {
          liveRegion.textContent = "Project " + (index + 1) + " of " + slides.length + ": " + name + ", " + cat;
        }

        // Scroll strip smoothly to make active card visible
        if (strip) {
          var cardLeft = activeThumb.offsetLeft;
          strip.scrollTo({ left: cardLeft - 16, behavior: "smooth" });
        }
      }
    }

    // Slide Transition (Dissolve)
    function goTo(nextIndex, opts) {
      opts = opts || {};
      if (nextIndex === currentIndex && !opts.force) return;
      if (isAnimating) return;

      isAnimating = true;
      var prevIndex = currentIndex;
      currentIndex = nextIndex;

      var currentSlide = slides[prevIndex];
      var nextSlide = slides[nextIndex];

      slides.forEach(function (s, i) {
        s.style.zIndex = i === nextIndex ? 2 : (i === prevIndex ? 1 : 0);
      });

      updateUI(nextIndex, !!opts.user);

      if (isReducedMotion) {
        slides.forEach(function (s, i) {
          gsap.set(s, { opacity: i === nextIndex ? 1 : 0, scale: 1 });
        });
        isAnimating = false;
        startAutoplay();
        return;
      }

      var tl = gsap.timeline({
        onComplete: function () {
          slides.forEach(function (s, i) {
            if (i !== nextIndex) {
              gsap.set(s, { opacity: 0, scale: 1 });
            }
          });
          isAnimating = false;
          startAutoplay();
        }
      });

      tl.fromTo(nextSlide,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "power2.inOut" },
        0
      );
    }

    // Autoplay Timer
    function startAutoplay() {
      stopAutoplay();
      if (isUserPaused || isHoverPaused || isOffscreenPaused || isTabHiddenPaused || isReducedMotion) {
        return;
      }

      var activeThumb = thumbs[currentIndex];
      if (!activeThumb) return;
      var bar = activeThumb.querySelector(".pshow__thumb-bar");
      if (!bar) return;

      autoplayTween = gsap.fromTo(bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 6.0,
          ease: "none",
          onComplete: function () {
            var next = (currentIndex + 1) % slides.length;
            goTo(next, { user: false });
          }
        }
      );
    }

    function stopAutoplay() {
      if (autoplayTween) {
        autoplayTween.kill();
        autoplayTween = null;
      }
    }

    function pauseAutoplay() {
      if (autoplayTween) {
        autoplayTween.pause();
      }
    }

    function resumeAutoplay() {
      if (autoplayTween) {
        autoplayTween.resume();
      } else {
        startAutoplay();
      }
    }

    // Interaction Events
    thumbs.forEach(function (thumb, idx) {
      thumb.addEventListener("click", function () {
        goTo(idx, { user: true });
      });
    });

    if (strip) {
      strip.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse") {
          isHoverPaused = true;
          pauseAutoplay();
        }
      });
      strip.addEventListener("pointerleave", function (e) {
        if (e.pointerType === "mouse") {
          isHoverPaused = false;
          resumeAutoplay();
        }
      });
    }

    root.addEventListener("focusin", function () {
      isHoverPaused = true;
      pauseAutoplay();
    });

    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) {
        isHoverPaused = false;
        resumeAutoplay();
      }
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        isUserPaused = !isUserPaused;
        toggleBtn.setAttribute("aria-pressed", isUserPaused ? "true" : "false");

        var icon = toggleBtn.querySelector("i");
        if (icon) {
          icon.className = isUserPaused ? "fa-solid fa-play" : "fa-solid fa-pause";
        }
        toggleBtn.setAttribute("aria-label", isUserPaused ? "Play slideshow" : "Pause slideshow");

        if (isUserPaused) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }

    // Document Visibility
    document.addEventListener("visibilitychange", function () {
      isTabHiddenPaused = document.hidden;
      if (isTabHiddenPaused) {
        pauseAutoplay();
      } else {
        resumeAutoplay();
      }
    });

    // Touch Swipe Gesture on Stage
    var touchStartX = 0;
    var touchStartY = 0;
    stage.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    stage.addEventListener("touchend", function (e) {
      if (e.changedTouches.length === 1) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
          if (dx < 0) {
            goTo((currentIndex + 1) % slides.length, { user: true });
          } else {
            goTo((currentIndex - 1 + slides.length) % slides.length, { user: true });
          }
        }
      }
    }, { passive: true });

    // Scroll Lock & Header Helpers for Preloader Stage
    var header = document.querySelector(".site-header");

    function lockScroll() {
      document.documentElement.classList.add("pshow-preloading");
      document.body.classList.add("pshow-preloading");
      if (window.lenis) {
        window.lenis.stop();
      } else {
        var checkLenis = setInterval(function () {
          if (window.lenis) {
            window.lenis.stop();
            clearInterval(checkLenis);
          }
        }, 50);
        setTimeout(function () { clearInterval(checkLenis); }, 3000);
      }
    }

    function unlockScroll() {
      document.documentElement.classList.remove("pshow-preloading");
      document.body.classList.remove("pshow-preloading");
      if (window.lenis) {
        window.lenis.start();
      }
    }

    var hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem("pshowIntroSeen") === "true";
    } catch (e) {}

    // Skip intro for reduced motion preference, if already seen in current session, or if refreshed mid-scroll
    if (isReducedMotion || hasSeenIntro || window.scrollY > 0) {
      try {
        sessionStorage.setItem("pshowIntroSeen", "true");
      } catch (e) {}
      unlockScroll();
      if (header) {
        gsap.set(header, { opacity: 1, visibility: "visible" });
      }
      root.classList.remove("pshow--intro");
      root.classList.add("pshow--ready");
      gsap.set([stage, introStage, scrim, content, lineInners, labelsChips, barHairline, strip, toggleBtn, viewLink], { clearProps: "all" });
      slides.forEach(function (s, i) {
        gsap.set(s, { opacity: i === 0 ? 1 : 0, scale: 1 });
      });
      updateUI(0, false);
      startAutoplay();
      initShowcaseScrollTriggers();
      return;
    }

    // Lock scroll and hide header for preloader stage on page load
    lockScroll();
    if (header) {
      gsap.set(header, { opacity: 0, visibility: "hidden" });
    }

    // Start intro sequence immediately on page load
    runIntroSequence();

    function runIntroSequence() {
      var startScale = getStartScale();

      // Preload images decode guard
      var imgPromises = slides.map(function (slide) {
        var img = slide.querySelector("img");
        if (img && img.decode) {
          return img.decode().catch(function () {});
        }
        return Promise.resolve();
      });

      var timeoutPromise = new Promise(function (resolve) {
        setTimeout(resolve, 2500);
      });

      Promise.race([Promise.all(imgPromises), timeoutPromise]).then(function () {
        buildIntroTimeline(startScale);
      });
    }

    function buildIntroTimeline(startScale) {
      var cycleOrder = [1, 2, 3, 4, 0]; // 0-indexed slide order ending on slide 0
      var allImgs = slides.map(function (s) { return s.querySelector("img"); }).filter(Boolean);
      gsap.set(allImgs, { yPercent: 0 });

      // Pre-set initial hidden positions for smooth GSAP animations
      gsap.set(lineInners, { y: 40, opacity: 0 });
      gsap.set(labelsChips, { y: 25, opacity: 0 });
      gsap.set(barHairline, { scaleX: 0 });
      gsap.set(strip, { y: 60, opacity: 0 });
      gsap.set(thumbImgs, { opacity: 1, scale: 1 });
      gsap.set(thumbTexts, { opacity: 1 });
      gsap.set([toggleBtn, viewLink], { y: 20, opacity: 0 });
      gsap.set(scrim, { opacity: 0 });

      var tl = gsap.timeline({
        id: "pshow-intro-tl",
        defaults: { ease: "power3.out" },
        onComplete: function () {
          sessionStorage.setItem("pshowIntroSeen", "true");
          ScrollTrigger.refresh();
          startAutoplay();
        }
      });

      // Initial progress bar state
      if (introBar) gsap.set(introBar, { scaleX: 0 });
      if (introProgress) gsap.set(introProgress, { opacity: 1 });

      // Full Preloader Sequence
      gsap.set(stage, { scale: startScale, opacity: 1 });
      gsap.set(slides, { opacity: 0 });
      gsap.set(slides[cycleOrder[0]], { opacity: 1 });

      tl.fromTo(mark, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 0.0)
        .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.15);

      // Preloader Thin Line Progress Fill (Phase A Intro)
      if (introBar) {
        tl.fromTo(introBar, { scaleX: 0 }, { scaleX: 1, duration: 2.25, ease: "sine.inOut" }, 0.05);
      }

      // Fast image cuts inside small frame
      cycleOrder.forEach(function (slideIdx, i) {
        if (i === 0) return;
        var prevSlideIdx = cycleOrder[i - 1];
        var cutTime = 0.50 + i * 0.32;
        tl.add(function () {
          slides[prevSlideIdx].style.opacity = "0";
          slides[slideIdx].style.opacity = "1";
        }, cutTime);
      });

      // Scale Up Stage to 100% Viewport
      var scaleStartTime = 2.30;
      var scaleDuration = 0.80;
      var loaded100Time = scaleStartTime + scaleDuration; // ~ 3.10s

      tl.to(stage, { scale: 1, duration: scaleDuration, ease: "expo.inOut" }, scaleStartTime)
        .to(mark, { scale: 1.25, opacity: 0, duration: 0.5, ease: "power2.in" }, scaleStartTime)
        .to(introStage, { opacity: 0, duration: 0.4, ease: "power1.out" }, scaleStartTime + 0.35);

      if (introProgress) {
        tl.to(introProgress, { opacity: 0, duration: 0.4, ease: "power1.out" }, scaleStartTime);
      }

      // AS SOON AS LOADED 100%: Unlock scroll & switch root to ready state
      tl.add(function () {
        unlockScroll();
        root.classList.remove("pshow--intro");
        root.classList.add("pshow--ready");
        gsap.set([stage, introStage, mark], { clearProps: "all" });
        if (header) {
          gsap.set(header, { clearProps: "opacity,visibility" });
        }
      }, loaded100Time);

      // Header fade in as soon as loaded 100%
      if (header) {
        tl.fromTo(header, { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8, ease: "power2.out" }, loaded100Time);
      }

      // Dark gradient scrim fade in
      tl.to(scrim, { opacity: 1, duration: 0.6 }, loaded100Time);

      // 1. Text Fade In from Bottom (Headline lines & Chips)
      tl.to(lineInners, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08
      }, loaded100Time);

      tl.to(labelsChips, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.05
      }, loaded100Time + 0.1);

      // Hairline expansion
      tl.to(barHairline, {
        scaleX: 1,
        duration: 0.75,
        ease: "expo.out"
      }, loaded100Time + 0.1);

      // 2. Bottom Thumbnail Area Slide In from Bottom
      tl.to(strip, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out"
      }, loaded100Time + 0.05);

      // Action buttons slide up from bottom
      tl.to([toggleBtn, viewLink], {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, loaded100Time + 0.2);

      updateUI(0, false);
    }

    // ScrollTrigger Offscreen Pause & Parallax for Slider
    function initShowcaseScrollTriggers() {
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: function (self) {
          isOffscreenPaused = !self.isActive;
          if (isOffscreenPaused) {
            pauseAutoplay();
          } else {
            resumeAutoplay();
          }
        }
      });

      // Optional Parallax on Active Slide Image (desktop only)
      if (window.matchMedia("(min-width: 992px) and (prefers-reduced-motion: no-preference)").matches) {
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          id: "pshow-parallax",
          onUpdate: function (self) {
            // Only apply parallax after intro is completed
            if (!root.classList.contains("pshow--ready")) return;
            var activeSlide = slides[currentIndex];
            if (activeSlide) {
              var img = activeSlide.querySelector("img");
              if (img) {
                var yP = -4 + self.progress * 8;
                gsap.set(img, { yPercent: yP });
              }
            }
          }
        });
      }
    }

    initShowcaseScrollTriggers();

  });
})();
