(function () {
  "use strict";

  // GSAP Error & Fallback Guard
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded. Applying animation failure fallback class.");
    document.documentElement.classList.add("anim-failed");
    return;
  }

  // Register GSAP Plugins
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /**
   * Lenis Smooth Scroll Initialization
   */
  function initLenis() {
    if (typeof Lenis === "undefined") return null;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 2
    });

    window.lenis = lenis;

    lenis.on("scroll", function () {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.update();
      }
    });

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  /**
   * Universal Declarative Reveal Animations
   */
  function initDeclarativeReveals() {
    var animElements = document.querySelectorAll("[data-anim]");

    animElements.forEach(function (el) {
      var animType = el.getAttribute("data-anim");
      var delay = parseFloat(el.getAttribute("data-delay")) || 0;
      var duration = parseFloat(el.getAttribute("data-duration")) || 0.9;
      var trigger = el;

      if (animType === "title") {
        // Line wrapping for title masks
        var text = el.innerHTML;
        var lines = text.split("<br>");
        if (lines.length > 1) {
          el.innerHTML = lines.map(function (line) {
            return '<span class="line-wrapper"><span class="line">' + line + "</span></span>";
          }).join("");
        } else {
          el.innerHTML = '<span class="line-wrapper"><span class="line">' + text + "</span></span>";
        }

        var lineEls = el.querySelectorAll(".line");
        gsap.fromTo(lineEls,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
            delay: delay,
            scrollTrigger: {
              trigger: trigger,
              start: "top 85%",
              once: true
            }
          }
        );
      } else if (animType === "fade-up") {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: duration,
            ease: "power3.out",
            delay: delay,
            scrollTrigger: {
              trigger: trigger,
              start: "top 85%",
              once: true
            }
          }
        );
      } else if (animType === "fade-in") {
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration,
            ease: "power2.out",
            delay: delay,
            scrollTrigger: {
              trigger: trigger,
              start: "top 85%",
              once: true
            }
          }
        );
      } else if (animType === "pop") {
        gsap.fromTo(el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: duration,
            ease: "back.out(1.7)",
            delay: delay,
            scrollTrigger: {
              trigger: trigger,
              start: "top 85%",
              once: true
            }
          }
        );
      } else if (animType === "counter") {
        var targetVal = parseInt(el.getAttribute("data-counter"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trigger,
            start: "top 85%",
            once: true
          },
          onUpdate: function () {
            el.textContent = Math.floor(obj.val) + suffix;
          }
        });
      }
    });
  }

  /**
   * Hero Entrance Sequence
   */
  function initHeroAnimation() {
    var hero = document.querySelector("#home");
    if (!hero) return;

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    //var bgImg = hero.querySelector(".hero__bg");
    var titleLines = hero.querySelectorAll(".hero__title .line");
    var text = hero.querySelector(".hero__text");
    var cta = hero.querySelector(".hero__cta");

    // if (bgImg) {
    //   tl.fromTo(bgImg,
    //     { scale: 1.2, opacity: 0 },
    //     { scale: 1.05, opacity: 1, duration: 2.0, ease: "power3.out" },
    //     0
    //   );
    // }

    if (titleLines.length) {
      tl.fromTo(titleLines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.14, ease: "power4.out" },
        0.4
      );
    }

    if (text) {
      tl.fromTo(text,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.0
      );
    }

    if (cta) {
      tl.fromTo(cta,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
        1.2
      );
    }
  }

  /* 1A START */
  /**
   * Hero Video GSAP Parallax and Motion Match
   */
  function initHeroVideoMotion() {
    try {
      var video = document.querySelector(".js-hero-video");
      if (!video) return;

      gsap.set(video, { scale: 1.05, transformOrigin: "50% 50%" });

      if (typeof ScrollTrigger !== "undefined") {
        var mm = gsap.matchMedia();
        mm.add("(min-width: 992px)", function () {
          gsap.to(video, {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: "#home",
              start: "top top",
              end: "bottom top",
              scrub: true,
              onLeave: function () {
                if (video && !video.paused && !video._userPaused) {
                  video.pause();
                  video._scrollPaused = true;
                }
              },
              onEnterBack: function () {
                if (video && video._scrollPaused && !video._userPaused) {
                  video.play().catch(function () { });
                  video._scrollPaused = false;
                }
              }
            }
          });
        });
      }
    } catch (err) {
      console.warn("Hero video motion safe fallback:", err);
    }
  }
  /* 1A END */

  /**
   * Ribbon Marquee Animation (Section 2)
   */
  function initRibbons() {
    var trackA = document.querySelector(".js-ribbon-track-a");
    var trackB = document.querySelector(".js-ribbon-track-b");
    if (!trackA || !trackB) return;

    // Clone track content for infinite loop
    trackA.innerHTML += trackA.innerHTML;
    trackB.innerHTML += trackB.innerHTML;

    var tweenA = gsap.to(trackA, {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: "none"
    });

    var tweenB = gsap.to(trackB, {
      xPercent: 50,
      repeat: -1,
      duration: 40,
      ease: "none"
    });

    // Scroll speed modifier
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        onUpdate: function (self) {
          var skew = self.getVelocity() / 300;
          var speed = 1 + Math.abs(skew);
          gsap.to([tweenA, tweenB], { timeScale: Math.min(speed, 3.5), duration: 0.3 });
          gsap.to([tweenA, tweenB], { timeScale: 1, duration: 0.8, delay: 0.3 });
        }
      });
    }
  }

  /**
   * Industry Partners Marquee (Section 11)
   */
  function initPartners() {
    var track1 = document.querySelector(".js-partner-track-1");
    var track2 = document.querySelector(".js-partner-track-2");
    if (!track1 || !track2) return;

    track1.innerHTML += track1.innerHTML;
    track2.innerHTML += track2.innerHTML;

    gsap.to(track1, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: "none"
    });

    gsap.to(track2, {
      xPercent: 50,
      repeat: -1,
      duration: 34,
      ease: "none"
    });
  }

  /**
   * Trust Strip Marquee (Section 9)
   */
  function initTrustMarquee() {
    var track = document.querySelector(".js-trust-track");
    if (!track) return;

    track.innerHTML += track.innerHTML;

    gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: 25,
      ease: "none"
    });
  }

  /**
   * Section 2A: Intro & Stats (#who-we-are)
   */
  function initIntroStats() {
    var section = document.querySelector("#who-we-are");
    if (!section) return;

    var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fast-path for reduced motion
    if (isReducedMotion) {
      var counters = section.querySelectorAll("[data-counter]");
      counters.forEach(function (el) {
        var targetVal = parseInt(el.getAttribute("data-counter"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
        var formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(targetVal);
        el.textContent = formatted + suffix;
      });
      return;
    }

    var ctx = gsap.context(function () {
      // 1. Eyebrow animation
      var eyebrow = section.querySelector('[data-anim="eyebrow"]');
      if (eyebrow) {
        var icon = eyebrow.querySelector("i");
        var textNodes = Array.from(eyebrow.childNodes).filter(function (n) {
          return n !== icon;
        });

        var eyebrowTl = gsap.timeline({
          scrollTrigger: {
            trigger: eyebrow,
            start: "top 88%",
            once: true
          }
        });

        if (icon) {
          eyebrowTl.fromTo(icon,
            { scale: 0, rotate: -90 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }
          );
        }

        if (textNodes.length) {
          eyebrowTl.fromTo(textNodes,
            { x: -14, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.5"
          );
        }
      }

      // 2. Tagline Bar and Text
      var tagline = section.querySelector('[data-anim="tagline"]');
      if (tagline) {
        var bar = tagline.querySelector(".intro__tagline-bar");
        var text = tagline.querySelector(".intro__tagline-text");

        var taglineTl = gsap.timeline({
          scrollTrigger: {
            trigger: tagline,
            start: "top 88%",
            once: true
          }
        });

        if (bar) {
          taglineTl.fromTo(bar,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.7, ease: "power3.inOut" }
          );
        }

        if (text) {
          taglineTl.fromTo(text,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.5"
          );
        }
      }

      // 3. Pills Checklist Stagger
      var pillsContainer = section.querySelector('.intro__pills');
      if (pillsContainer) {
        var pills = pillsContainer.querySelectorAll(".intro__pill");
        pills.forEach(function (pill, idx) {
          var checkIcon = pill.querySelector(".intro__pill-icon");

          gsap.fromTo(pill,
            { y: 24, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: idx * 0.1,
              scrollTrigger: {
                trigger: pillsContainer,
                start: "top 85%",
                once: true
              }
            }
          );

          if (checkIcon) {
            gsap.fromTo(checkIcon,
              { scale: 0 },
              {
                scale: 1,
                duration: 0.5,
                ease: "back.out(3)",
                delay: idx * 0.1 + 0.15,
                scrollTrigger: {
                  trigger: pillsContainer,
                  start: "top 85%",
                  once: true
                }
              }
            );
          }
        });
      }

      // 4. Photo Curtain Reveal & Parallax
      var photo = section.querySelector('[data-anim="curtain"]');
      if (photo) {
        var photoImg = photo.querySelector("img");

        var photoTl = gsap.timeline({
          scrollTrigger: {
            trigger: photo,
            start: "top 80%",
            once: true
          }
        });

        photoTl.fromTo(photo,
          { clipPath: "inset(0 0 100% 0 round 28px)" },
          { clipPath: "inset(0 0 0% 0 round 28px)", duration: 1.3, ease: "power4.inOut" }
        );

        if (photoImg) {
          photoTl.fromTo(photoImg,
            { scale: 1.3 },
            { scale: 1, duration: 1.6, ease: "power3.out" },
            0
          );

          if (window.matchMedia("(min-width: 992px)").matches) {
            gsap.fromTo(photoImg,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: "none",
                scrollTrigger: {
                  trigger: photo,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true
                }
              }
            );
          }
        }
      }

      // 5. Hairline Rule Expansion & Stat Item Counters
      var rule = section.querySelector(".intro__rule");
      if (rule) {
        gsap.fromTo(rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            delay: 0.5,
            scrollTrigger: {
              trigger: photo || rule,
              start: "top 80%",
              once: true
            }
          }
        );
      }

      var statItems = section.querySelectorAll(".intro-stat");
      statItems.forEach(function (stat, idx) {
        gsap.fromTo(stat,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.6 + idx * 0.15,
            scrollTrigger: {
              trigger: photo || stat,
              start: "top 80%",
              once: true
            }
          }
        );

        var counterEl = stat.querySelector("[data-counter]");
        if (counterEl) {
          var targetVal = parseInt(counterEl.getAttribute("data-counter"), 10) || 0;
          var suffix = counterEl.getAttribute("data-suffix") || "";
          var decimals = parseInt(counterEl.getAttribute("data-decimals"), 10) || 0;
          var counterObj = { v: 0 };

          gsap.to(counterObj, {
            v: targetVal,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.7 + idx * 0.15,
            scrollTrigger: {
              trigger: photo || stat,
              start: "top 80%",
              once: true
            },
            onUpdate: function () {
              var formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(counterObj.v);
              counterEl.textContent = formatted + suffix;
            },
            onComplete: function () {
              var formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(targetVal);
              counterEl.textContent = formatted + suffix;
            }
          });
        }
      });

      // 6. Mission & Vision Cards Hover Tracker
      var cards = section.querySelectorAll(".intro-card");
      cards.forEach(function (card) {
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          card.addEventListener("mousemove", function (e) {
            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty("--mx", x + "%");
            card.style.setProperty("--my", y + "%");
          });

          card.addEventListener("mouseleave", function () {
            card.style.setProperty("--mx", "50%");
            card.style.setProperty("--my", "50%");
          });
        }
      });

      // 7. Background pattern infinite rotation
      var pattern = section.querySelector(".intro__pattern");
      if (pattern && window.matchMedia("(min-width: 992px)").matches) {
        gsap.to(pattern, {
          rotate: 360,
          duration: 120,
          repeat: -1,
          ease: "none"
        });
      }

    }, section);
  }

  /* 22A START */
  /**
   * 22A. GSAP / JS HORIZONTAL MARQUEE ENGINE
   */
  function buildMarqueeRow(row) {
    var track = row.querySelector("[data-marquee-track]");
    var group = track && track.querySelector("[data-marquee-group]");
    if (!track || !group) return null;

    var dir = row.dataset.marqueeDirection === "right" ? 1 : -1; // -1 = moves left
    var speed = parseFloat(row.dataset.marqueeSpeed) || 50;      // px per second
    var startAt = parseFloat(row.dataset.marqueeStart) || 0;     // 0..1
    var originals = Array.prototype.slice.call(group.children);
    var state = { hover: 1, boost: 0, inView: true, paused: false };

    var tween = null;
    var progress = startAt;
    var lastWidth = row.offsetWidth;

    var hide = function (el) {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("inert", "");
      el.setAttribute("data-marquee-clone", "");
      return el;
    };

    var apply = function () {
      if (!tween) return;
      var running = state.inView && !state.paused;
      tween.timeScale(running ? state.hover * (1 + state.boost) : 0);
    };

    var build = function () {
      if (tween) {
        progress = tween.progress();
        tween.kill();
      }
      var clones = track.querySelectorAll("[data-marquee-clone]");
      for (var i = 0; i < clones.length; i++) {
        clones[i].parentNode.removeChild(clones[i]);
      }

      // 1. fill the group so it is at least as wide as the row
      var guard = 0;
      while (group.offsetWidth < row.offsetWidth && guard < 8) {
        originals.forEach(function (el) {
          group.appendChild(hide(el.cloneNode(true)));
        });
        guard += 1;
      }

      // 2. duplicate the whole group once: track = 2 equal groups, so -50% = one loop
      var copy = hide(group.cloneNode(true));
      copy.removeAttribute("data-marquee-group");
      track.appendChild(copy);

      // 3. constant speed: duration = distance / speed
      var duration = group.offsetWidth / speed;
      var from = dir === -1 ? 0 : -50;
      var to = dir === -1 ? -50 : 0;

      tween = gsap.fromTo(
        track,
        { xPercent: from },
        { xPercent: to, duration: duration, ease: "none", repeat: -1 }
      );
      tween.progress(progress);
      apply();
    };

    // eased hover / focus pause
    var ease = function (value) {
      gsap.to(state, { hover: value, duration: 0.5, ease: "power2.out", overwrite: "auto", onUpdate: apply });
    };
    var onEnter = function (e) { if (e.pointerType === "mouse") ease(0); };
    var onLeave = function (e) { if (e.pointerType === "mouse") ease(1); };
    var onFocusIn = function () { ease(0); };
    var onFocusOut = function (e) { if (!row.contains(e.relatedTarget)) ease(1); };

    row.addEventListener("pointerenter", onEnter);
    row.addEventListener("pointerleave", onLeave);
    row.addEventListener("focusin", onFocusIn);
    row.addEventListener("focusout", onFocusOut);

    // off-screen pause + scroll-velocity boost
    var trigger = ScrollTrigger.create({
      trigger: row,
      start: "top bottom",
      end: "bottom top",
      onToggle: function (self) { state.inView = self.isActive; apply(); },
      onUpdate: function (self) {
        var target = gsap.utils.clamp(0, 2, Math.abs(self.getVelocity()) / 1200);
        if (target > state.boost) { state.boost = target; apply(); }
      }
    });

    var decay = function () {
      if (state.boost > 0.01) {
        state.boost *= Math.pow(0.94, gsap.ticker.deltaRatio());
        apply();
      } else if (state.boost !== 0) {
        state.boost = 0;
        apply();
      }
    };
    gsap.ticker.add(decay);

    // rebuild on width change
    var raf = 0;
    var observer = new ResizeObserver(function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        if (Math.abs(row.offsetWidth - lastWidth) > 1) {
          lastWidth = row.offsetWidth;
          build();
        }
      });
    });
    observer.observe(row);

    build();

    return {
      setPaused: function (value) { state.paused = value; apply(); },
      destroy: function () {
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
        var remainingClones = track.querySelectorAll("[data-marquee-clone]");
        for (var k = 0; k < remainingClones.length; k++) {
          remainingClones[k].parentNode.removeChild(remainingClones[k]);
        }
        gsap.set(track, { clearProps: "transform" });
      }
    };
  }

  function initMarquees() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    var rows = gsap.utils.toArray("[data-marquee-row]");
    if (!rows.length) return;

    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      var instances = [];
      var observer = null;
      try {
        instances = rows.map(function (row) { return buildMarqueeRow(row); }).filter(Boolean);

        var toggle = document.querySelector("[data-motion-toggle]");
        if (toggle) {
          var sync = function () {
            var paused = toggle.getAttribute("aria-pressed") === "true";
            instances.forEach(function (i) { i.setPaused(paused); });
          };
          observer = new MutationObserver(sync);
          observer.observe(toggle, { attributes: true, attributeFilter: ["aria-pressed"] });
          sync();

          toggle.addEventListener("click", function () {
            var currentState = toggle.getAttribute("aria-pressed") === "true";
            var nextState = !currentState;
            toggle.setAttribute("aria-pressed", nextState ? "true" : "false");
            toggle.textContent = nextState ? "Resume animations" : "Pause animations";
          });
        }
      } catch (error) {
        instances.forEach(function (i) { i.destroy(); });
        instances = [];
        rows.forEach(function (row) { row.classList.add("marquee--static"); });
      }

      return function () {
        if (observer) observer.disconnect();
        instances.forEach(function (i) { i.destroy(); });
      };
    });
  }

  function initPartners() {
    initMarquees();
  }

  function initTrustMarquee() {
    initMarquees();
  }
  /* 22A END */

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", function () {
      document.documentElement.classList.add("anim-failed");
    });

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      initLenis();
      initHeroAnimation();
      initHeroVideoMotion();
      initRibbons();
      initIntroStats();
      initMarquees();
      initDeclarativeReveals();
    });
  });

})();
