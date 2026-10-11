/**
 * Aparajita Engicon - About Us Page Interactive Engine
 * File: assets/js/about-page.js
 * Scoped strictly to .apj-page--about
 */
(function () {
  "use strict";

  // Guard: Ensure GSAP and ScrollTrigger are available and this is the About page
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    return;
  }

  if (!document.body.classList.contains("apj-page--about")) {
    return;
  }

  // Register JS-ready state for progressive enhancement
  document.body.classList.add("apj-page--js");

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  /**
   * 1. INNER PAGE HERO (apj-phero)
   */
  function initApjHero(conditions) {
    var hero = document.querySelector("#about-hero");
    if (!hero) return;

    var crumbs = hero.querySelectorAll(".apj-phero__crumbs li");
    var lineInners = hero.querySelectorAll(".apj-phero__line-inner");
    var dot = hero.querySelector(".apj-phero__dot");
    var text = hero.querySelector(".apj-phero__text");
    var cta = hero.querySelector(".apj-phero__cta");
    var hairline = hero.querySelector(".apj-phero__hairline");

    if (conditions.reducedMotion) {
      if (crumbs.length) gsap.set(crumbs, { opacity: 1, y: 0 });
      if (lineInners.length) gsap.set(lineInners, { yPercent: 0, xPercent: 0 });
      if (dot) gsap.set(dot, { scale: 1 });
      if (text) gsap.set(text, { opacity: 1, y: 0 });
      if (cta) gsap.set(cta, { opacity: 1, y: 0, scale: 1 });
      if (hairline) gsap.set(hairline, { scaleX: 1 });
      return;
    }

    // Set initial hidden states
    if (crumbs.length) gsap.set(crumbs, { opacity: 0, y: 14 });
    if (lineInners.length) gsap.set(lineInners, { yPercent: 115 });
    if (dot) gsap.set(dot, { scale: 0 });
    if (text) gsap.set(text, { opacity: 0, y: 28 });
    if (cta) gsap.set(cta, { opacity: 0, y: 28, scale: 0.94 });
    if (hairline) gsap.set(hairline, { scaleX: 0, transformOrigin: "left center" });

    // Entrance timeline
    var heroTl = gsap.timeline({
      id: "apj-phero-in",
      defaults: { ease: "power3.out" },
      delay: 0.1
    });

    if (crumbs.length) {
      heroTl.to(crumbs, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0);
    }

    if (lineInners.length) {
      heroTl.to(lineInners, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.12 }, 0.1);
    }

    if (dot) {
      heroTl.to(dot, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 0.85);
    }

    if (text) {
      heroTl.to(text, { opacity: 1, y: 0, duration: 0.9 }, 0.6);
    }

    if (cta) {
      heroTl.to(cta, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.8);
    }

    if (hairline) {
      heroTl.to(hairline, { scaleX: 1, duration: 1.2, ease: "expo.out" }, 1.0);
    }

    // Desktop scrubbed scroll-away
    if (conditions.desktop) {
      var lines = Array.from(lineInners);
      var sideCol = hero.querySelector(".apj-phero__side");

      var scrollAwayTl = gsap.timeline({
        id: "apj-phero-out",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      if (lines.length >= 2) {
        scrollAwayTl.to(lines[0], { xPercent: -8, ease: "none" }, 0);
        scrollAwayTl.to(lines[1], { xPercent: 8, ease: "none" }, 0);
      } else if (lines.length === 1) {
        scrollAwayTl.to(lines[0], { xPercent: -8, ease: "none" }, 0);
      }

      if (sideCol) {
        scrollAwayTl.to(sideCol, { yPercent: -14, opacity: 0.4, ease: "none" }, 0);
      }
    }
  }

  /**
   * 2. OUR STORY (apj-about-story)
   */
  function initApjStory(conditions) {
    var section = document.querySelector("#our-story");
    if (!section) return;

    var textParas = section.querySelectorAll(".apj-about__story-para");
    var imgPrimary = section.querySelector(".apj-about__img--primary");
    var imgSecondary = section.querySelector(".apj-about__img--secondary");
    var badge = section.querySelector(".apj-about__badge");

    if (conditions.reducedMotion) {
      textParas.forEach(function (p) {
        gsap.set(p.querySelectorAll(".apj-word"), { opacity: 1 });
      });
      if (imgPrimary) gsap.set([imgPrimary, imgPrimary.querySelector("img")], { clipPath: "none", scale: 1, yPercent: 0 });
      if (imgSecondary) gsap.set([imgSecondary, imgSecondary.querySelector("img")], { clipPath: "none", scale: 1, yPercent: 0 });
      if (badge) gsap.set(badge, { scale: 1, rotate: 0 });
      return;
    }

    // Scroll-scrubbed word reveal for story paragraphs
    textParas.forEach(function (para, pIdx) {
      var rawHtml = para.innerHTML.trim();
      if (!para.querySelector(".apj-word")) {
        var words = rawHtml.split(/\s+/);
        para.innerHTML = words.map(function (w) {
          return '<span class="apj-word">' + w + '</span>';
        }).join(" ");
      }

      var wordSpans = para.querySelectorAll(".apj-word");
      gsap.fromTo(wordSpans,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            id: "apj-about-story-text-" + pIdx,
            trigger: para,
            start: "top 82%",
            end: "bottom 50%",
            scrub: 0.6
          }
        }
      );
    });

    // Image reveals and parallax
    if (imgPrimary) {
      var innerImg1 = imgPrimary.querySelector("img");
      var imgTl1 = gsap.timeline({
        scrollTrigger: {
          trigger: imgPrimary,
          start: "top 85%",
          once: true
        }
      });
      imgTl1.fromTo(imgPrimary,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.out" },
        0
      );
      if (innerImg1) {
        imgTl1.fromTo(innerImg1,
          { scale: 1.25 },
          { scale: 1, duration: 1.3, ease: "expo.out" },
          0
        );
      }
    }

    if (imgSecondary) {
      var innerImg2 = imgSecondary.querySelector("img");
      var imgTl2 = gsap.timeline({
        scrollTrigger: {
          trigger: imgSecondary,
          start: "top 88%",
          once: true
        }
      });
      imgTl2.fromTo(imgSecondary,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.out" },
        0.2
      );
      if (innerImg2) {
        imgTl2.fromTo(innerImg2,
          { scale: 1.25 },
          { scale: 1, duration: 1.3, ease: "expo.out" },
          0.2
        );
      }
    }

    // Badge entrance and continuous subtle rotation
    if (badge) {
      var badgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: badge,
          start: "top 90%",
          once: true
        }
      });

      badgeTl.fromTo(badge,
        { scale: 0, rotate: -90 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.9,
          ease: "back.out(1.8)",
          onComplete: function () {
            if (!conditions.reducedMotion) {
              gsap.to(badge, {
                rotate: 360,
                duration: 18,
                repeat: -1,
                ease: "none"
              });
            }
          }
        }
      );
    }

    // Desktop Parallax on images
    if (conditions.desktop) {
      if (imgPrimary) {
        gsap.fromTo(imgPrimary,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
      if (imgSecondary) {
        gsap.fromTo(imgSecondary,
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
    }
  }

  /**
   * 3. NUMBERS & STATS (apj-about-numbers)
   */
  function initApjNumbers(conditions) {
    var section = document.querySelector("#numbers");
    if (!section) return;

    var dividers = section.querySelectorAll(".apj-about__stat-divider");
    var statItems = section.querySelectorAll(".apj-about__stat");

    if (conditions.reducedMotion) {
      dividers.forEach(function (d) { gsap.set(d, { scaleY: 1 }); });
      statItems.forEach(function (stat) {
        var num = stat.querySelector("[data-counter]");
        if (num) {
          var target = num.getAttribute("data-counter") || "";
          var suffix = num.getAttribute("data-suffix") || "";
          num.textContent = target + suffix;
        }
      });
      return;
    }

    // Dividers reveal
    if (dividers.length) {
      gsap.fromTo(dividers,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.0,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    // Custom 1900 -> 1990 counter roll
    var yearEl = section.querySelector('[data-apj-count-from="1900"]');
    if (yearEl) {
      var targetYear = parseInt(yearEl.getAttribute("data-counter") || "1990", 10);
      var yearObj = { val: 1900 };

      gsap.to(yearObj, {
        val: targetYear,
        duration: 2.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: yearEl,
          start: "top 85%",
          once: true
        },
        onUpdate: function () {
          yearEl.textContent = Math.round(yearObj.val).toString();
        },
        onComplete: function () {
          yearEl.textContent = targetYear.toString();
        }
      });
    }

    // Other stats count up (30+, 8, 10+)
    statItems.forEach(function (item, idx) {
      var counterEl = item.querySelector("[data-counter]:not([data-apj-count-from])");
      if (!counterEl) return;

      var targetVal = parseInt(counterEl.getAttribute("data-counter"), 10) || 0;
      var suffix = counterEl.getAttribute("data-suffix") || "";
      var countObj = { val: 0 };

      gsap.to(countObj, {
        val: targetVal,
        duration: 1.8,
        ease: "power2.out",
        delay: idx * 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true
        },
        onUpdate: function () {
          counterEl.textContent = Math.round(countObj.val).toString() + suffix;
        },
        onComplete: function () {
          counterEl.textContent = targetVal.toString() + suffix;
        }
      });

      var label = item.querySelector(".apj-about__stat-label");
      if (label) {
        gsap.fromTo(label,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2 + idx * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    });
  }

  /**
   * 4. MISSION & VISION (apj-about-mission)
   */
  function initApjMission(conditions) {
    var section = document.querySelector("#mission-vision");
    if (!section) return;

    var cards = section.querySelectorAll(".apj-about__card");
    if (!cards.length) return;

    if (conditions.reducedMotion) {
      cards.forEach(function (c) {
        gsap.set(c, { clipPath: "none", opacity: 1, y: 0, yPercent: 0 });
      });
      return;
    }

    cards.forEach(function (card, i) {
      var numeral = card.querySelector(".apj-about__card-num");
      var title = card.querySelector(".apj-about__card-title");
      var body = card.querySelector(".apj-about__card-body");

      var cardTl = gsap.timeline({
        id: "apj-about-card-" + i,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true
        }
      });

      cardTl.fromTo(card,
        { clipPath: "inset(100% 0% 0% 0% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.2, ease: "expo.out" },
        i * 0.15
      );

      if (numeral) {
        cardTl.fromTo(numeral,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          i * 0.15 + 0.2
        );
      }

      if (title) {
        cardTl.fromTo(title,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          i * 0.15 + 0.3
        );
      }

      if (body) {
        cardTl.fromTo(body,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          i * 0.15 + 0.4
        );
      }
    });

    // Desktop subtle parallax scroll depth
    if (conditions.desktop && cards.length >= 2) {
      gsap.fromTo(cards[0],
        { yPercent: 4 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );

      gsap.fromTo(cards[1],
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }
  }

  /**
   * 5. CORE DISCIPLINES (apj-about-disciplines)
   */
  function initApjDisciplines(conditions) {
    var section = document.querySelector("#disciplines");
    if (!section) return;

    var tiles = section.querySelectorAll(".apj-about__tile");
    if (!tiles.length) return;

    if (conditions.reducedMotion) {
      tiles.forEach(function (tile) {
        gsap.set(tile, { opacity: 1, y: 0 });
        var icon = tile.querySelector(".apj-about__tile-icon");
        if (icon) gsap.set(icon, { scale: 1, rotate: 0 });
        var line = tile.querySelector(".apj-about__tile-line");
        if (line) gsap.set(line, { scaleX: 1 });
      });
      return;
    }

    // Grid entrance reveal
    gsap.fromTo(tiles,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: {
          each: 0.08,
          grid: "auto",
          from: "start"
        },
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true
        }
      }
    );

    // Inner icon & hairline animation
    tiles.forEach(function (tile, i) {
      var icon = tile.querySelector(".apj-about__tile-icon");
      var line = tile.querySelector(".apj-about__tile-line");

      var tileTl = gsap.timeline({
        scrollTrigger: {
          trigger: tile,
          start: "top 85%",
          once: true
        }
      });

      if (icon) {
        tileTl.fromTo(icon,
          { scale: 0.5, rotate: -25 },
          { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" },
          0.1
        );
      }

      if (line) {
        tileTl.fromTo(line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8, ease: "expo.out" },
          0.2
        );
      }
    });

    // Pointer spotlight on fine desktop
    if (conditions.pointerFine) {
      tiles.forEach(function (tile) {
        var spotlight = tile.querySelector(".apj-about__tile-spotlight");
        if (!spotlight) return;

        var setX = gsap.quickTo(spotlight, "x", { duration: 0.35, ease: "power2.out" });
        var setY = gsap.quickTo(spotlight, "y", { duration: 0.35, ease: "power2.out" });

        tile.addEventListener("mousemove", function (e) {
          var rect = tile.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          setX(x);
          setY(y);
        });

        tile.addEventListener("mouseenter", function () {
          gsap.to(spotlight, { opacity: 1, duration: 0.3 });
        });

        tile.addEventListener("mouseleave", function () {
          gsap.to(spotlight, { opacity: 0, duration: 0.4 });
        });
      });
    }

    // Mobile / Touch in-view activation
    if (!conditions.pointerFine || conditions.mobile) {
      tiles.forEach(function (tile) {
        ScrollTrigger.create({
          trigger: tile,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: { targets: tile, className: "apj-about__tile--inview" }
        });
      });
    }
  }

  /**
   * 6. HOW WE WORK PROCESS (apj-about-process)
   */
  function initApjProcess(conditions) {
    var section = document.querySelector("#process");
    if (!section) return;

    var steps = section.querySelectorAll(".apj-about__step");
    var progressLine = section.querySelector(".apj-about__process-fill");

    if (conditions.reducedMotion) {
      steps.forEach(function (s) {
        gsap.set(s, { opacity: 1, y: 0 });
        s.classList.add("is-active");
      });
      if (progressLine) gsap.set(progressLine, { scaleX: 1, scaleY: 1 });
      return;
    }

    // Step cards initial reveal
    gsap.fromTo(steps,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true
        }
      }
    );

    // Connecting line draw with scroll
    if (progressLine) {
      if (conditions.desktop) {
        gsap.fromTo(progressLine,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              id: "apj-about-process",
              trigger: section,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 1,
              onUpdate: function (self) {
                var p = self.progress;
                steps.forEach(function (step, idx) {
                  var threshold = idx / Math.max(1, steps.length - 1);
                  if (p >= threshold - 0.05) {
                    step.classList.add("is-active");
                  } else {
                    step.classList.remove("is-active");
                  }
                });
              }
            }
          }
        );
      } else {
        gsap.fromTo(progressLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              id: "apj-about-process-mobile",
              trigger: section,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 1,
              onUpdate: function (self) {
                var p = self.progress;
                steps.forEach(function (step, idx) {
                  var threshold = idx / Math.max(1, steps.length - 1);
                  if (p >= threshold - 0.05) {
                    step.classList.add("is-active");
                  } else {
                    step.classList.remove("is-active");
                  }
                });
              }
            }
          }
        );
      }
    }
  }

  /**
   * 7. CLOSING CTA (apj-about-cta)
   */
  function initApjCta(conditions) {
    var section = document.querySelector("#about-cta");
    if (!section) return;

    var panel = section.querySelector(".apj-about__cta-panel");
    var watermark = section.querySelector(".apj-about__cta-watermark");

    if (conditions.reducedMotion) {
      if (panel) gsap.set(panel, { opacity: 1, y: 0, scale: 1 });
      if (watermark) gsap.set(watermark, { xPercent: 0 });
      return;
    }

    if (panel) {
      gsap.fromTo(panel,
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (watermark && conditions.desktop) {
      gsap.fromTo(watermark,
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }
  }

  /**
   * MASTER INIT VIA GSAP MATCHMEDIA
   */
  document.addEventListener("DOMContentLoaded", function () {
    var mm = gsap.matchMedia();

    mm.add({
      desktop: "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
      pointerFine: "(hover: hover) and (pointer: fine)",
      reducedMotion: "(prefers-reduced-motion: reduce)"
    }, function (context) {
      var conds = {
        desktop: context.conditions.desktop,
        mobile: context.conditions.mobile,
        pointerFine: context.conditions.pointerFine,
        reducedMotion: context.conditions.reducedMotion
      };

      initApjHero(conds);
      initApjStory(conds);
      initApjNumbers(conds);
      initApjMission(conds);
      initApjDisciplines(conds);
      initApjProcess(conds);
      initApjCta(conds);
    });

    // Refresh after fonts are loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });

})();
