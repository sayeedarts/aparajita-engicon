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

    var bgImg = hero.querySelector(".hero__bg");
    var titleLines = hero.querySelectorAll(".hero__title .line");
    var text = hero.querySelector(".hero__text");
    var cta = hero.querySelector(".hero__cta");

    if (bgImg) {
      tl.fromTo(bgImg,
        { scale: 1.2, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 2.0, ease: "power3.out" },
        0
      );
    }

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

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", function () {
      document.documentElement.classList.add("anim-failed");
    });

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      initLenis();
      initHeroAnimation();
      initRibbons();
      initPartners();
      initTrustMarquee();
      initDeclarativeReveals();
    });
  });

})();
