/**
 * Aparajita Engicon - Services Interactive Engine
 * File: assets/js/inner-pages.js
 * Common interactive script for Services listing and detail pages
 */
(function () {
  "use strict";

  // Guard: Ensure GSAP and ScrollTrigger are available and this is a services inner page
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    return;
  }

  var isInnerPage = document.body.classList.contains("apj-page--services") ||
    document.body.classList.contains("apj-page--service") ||
    document.body.classList.contains("apj-page--projects") ||
    document.body.classList.contains("apj-page--contact") ||
    document.body.classList.contains("apj-page--industry") ||
    document.querySelector("[data-apj-phero]") !== null ||
    document.querySelector("[data-apj-projlist]") !== null ||
    document.querySelector("[data-apj-contact]") !== null ||
    document.querySelector("[data-apj-ind-solutions]") !== null;

  if (!isInnerPage) {
    return;
  }

  // Register JS-ready state for progressive enhancement
  document.body.classList.add("apj-page--js");

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  // Debounced ScrollTrigger refresh utility
  var refreshTimer = null;
  function debounceRefresh(delay) {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      ScrollTrigger.refresh();
    }, delay || 120);
  }

  /**
   * 1. INNER PAGE HERO (apj-phero)
   * Ported from about-page.js with detail page tag support
   */
  function initApjHero(conditions) {
    var hero = document.querySelector("[data-apj-phero]") || document.querySelector("#about-hero");
    if (!hero) return;

    var tag = hero.querySelector(".apj-phero__tag");
    var crumbs = hero.querySelectorAll(".apj-phero__crumbs li");
    var lineInners = hero.querySelectorAll(".apj-phero__line-inner");
    var dot = hero.querySelector(".apj-phero__dot");
    var text = hero.querySelector(".apj-phero__text");
    var cta = hero.querySelector(".apj-phero__cta");
    var hairline = hero.querySelector(".apj-phero__hairline");

    if (conditions.reducedMotion) {
      if (tag) gsap.set(tag, { opacity: 1, y: 0 });
      if (crumbs.length) gsap.set(crumbs, { opacity: 1, y: 0 });
      if (lineInners.length) gsap.set(lineInners, { yPercent: 0, xPercent: 0 });
      if (dot) gsap.set(dot, { scale: 1 });
      if (text) gsap.set(text, { opacity: 1, y: 0 });
      if (cta) gsap.set(cta, { opacity: 1, y: 0, scale: 1 });
      if (hairline) gsap.set(hairline, { scaleX: 1 });
      return;
    }

    // Set initial hidden states
    if (tag) gsap.set(tag, { opacity: 0, y: 14 });
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

    if (tag) {
      heroTl.to(tag, { opacity: 1, y: 0, duration: 0.6 }, 0);
    }

    if (crumbs.length) {
      heroTl.to(crumbs, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, tag ? 0.05 : 0);
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
   * 2. CLOSING CTA (#enquiry / #about-cta)
   * Ported with staggered button entrance
   */
  function initApjCta(conditions) {
    var section = document.querySelector("#enquiry") || document.querySelector("#about-cta");
    if (!section) return;

    var panel = section.querySelector(".apj-about__cta-panel");
    var watermark = section.querySelector(".apj-about__cta-watermark");
    var buttons = section.querySelectorAll(".btn-pill, .apj-svcd__cta-secondary");

    if (conditions.reducedMotion) {
      if (panel) gsap.set(panel, { opacity: 1, y: 0, scale: 1 });
      if (watermark) gsap.set(watermark, { xPercent: 0 });
      if (buttons.length) gsap.set(buttons, { opacity: 1, y: 0, scale: 1 });
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
            id: "apj-cta-panel",
            trigger: panel,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (buttons.length) {
      gsap.fromTo(buttons,
        { opacity: 0, y: 28, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-cta-btns",
            trigger: panel || section,
            start: "top 78%",
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
            id: "apj-cta-watermark",
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
   * Helper: Split element text into word spans
   */
  function splitWords(el) {
    if (!el.querySelector(".apj-word")) {
      var rawHtml = el.innerHTML.trim();
      var words = rawHtml.split(/\s+/);
      el.innerHTML = words.map(function (w) {
        return '<span class="apj-word">' + w + '</span>';
      }).join(" ");
    }
    return el.querySelectorAll(".apj-word");
  }

  /**
   * 3. INTRO / LEAD WORD-SCRUB REVEAL (listing intro & detail overview)
   */
  function initApjIntro(conditions) {
    // 3A: Listing Intro Section (#services-intro)
    var introSection = document.querySelector("#services-intro");
    if (introSection) {
      var introPara = introSection.querySelector(".apj-svclist-intro__text");
      if (introPara) {
        if (conditions.reducedMotion) {
          gsap.set(introPara, { opacity: 1 });
        } else {
          var introWords = splitWords(introPara);
          gsap.fromTo(introWords,
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.04,
              ease: "none",
              scrollTrigger: {
                id: "apj-svclist-intro-words",
                trigger: introPara,
                start: "top 82%",
                end: "bottom 55%",
                scrub: 0.6
              }
            }
          );
        }
      }

      // Dividers animation
      var dividers = introSection.querySelectorAll(".apj-svclist-stat__divider");
      if (dividers.length) {
        if (conditions.reducedMotion) {
          gsap.set(dividers, { scaleY: 1 });
        } else {
          gsap.fromTo(dividers,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.12,
              scrollTrigger: {
                id: "apj-svclist-dividers",
                trigger: introSection.querySelector(".apj-svclist-stats"),
                start: "top 85%",
                once: true
              }
            }
          );
        }
      }
    }

    // 3B: Detail Overview Section (#svc-overview)
    var overviewSection = document.querySelector("#svc-overview");
    if (overviewSection) {
      var leadPara = overviewSection.querySelector(".apj-svcd__lead");
      if (leadPara) {
        if (conditions.reducedMotion) {
          gsap.set(leadPara, { opacity: 1 });
        } else {
          var leadWords = splitWords(leadPara);
          gsap.fromTo(leadWords,
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.04,
              ease: "none",
              scrollTrigger: {
                id: "apj-svcd-lead-words",
                trigger: leadPara,
                start: "top 82%",
                end: "bottom 55%",
                scrub: 0.6
              }
            }
          );
        }
      }

      // Second paragraph fade-up
      var secondPara = overviewSection.querySelector(".apj-svcd__text");
      if (secondPara) {
        if (conditions.reducedMotion) {
          gsap.set(secondPara, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(secondPara,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                id: "apj-svcd-overview-text",
                trigger: secondPara,
                start: "top 85%",
                once: true
              }
            }
          );
        }
      }

      // At A Glance Card
      var glanceCard = overviewSection.querySelector(".apj-svcd__glance");
      if (glanceCard) {
        var glanceChips = glanceCard.querySelectorAll(".apj-svcd__chip-btn");
        if (conditions.reducedMotion) {
          gsap.set(glanceCard, { opacity: 1, y: 0, scale: 1 });
          if (glanceChips.length) gsap.set(glanceChips, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(glanceCard,
            { opacity: 0, y: 50, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                id: "apj-svcd-glance-card",
                trigger: glanceCard,
                start: "top 85%",
                once: true
              }
            }
          );

          if (glanceChips.length) {
            gsap.fromTo(glanceChips,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
                scrollTrigger: {
                  id: "apj-svcd-glance-chips",
                  trigger: glanceCard,
                  start: "top 82%",
                  once: true
                }
              }
            );
          }
        }
      }
    }
  }

  /**
   * 4. SERVICES LISTING CARDS (#services-list)
   */
  function initApjSvcList(conditions) {
    var listSection = document.querySelector("#services-list");
    if (!listSection) return;

    var cards = listSection.querySelectorAll("[data-apj-card]");
    if (!cards.length) return;

    if (conditions.reducedMotion) {
      cards.forEach(function (card) {
        gsap.set(card, { opacity: 1, y: 0, clipPath: "none" });
        var mark = card.querySelector(".apj-svclist__mark");
        if (mark) gsap.set(mark, { opacity: 1, xPercent: 0 });
        var idx = card.querySelector(".apj-svclist__index");
        if (idx) gsap.set(idx, { opacity: 1, x: 0 });
        var title = card.querySelector(".apj-svclist__title");
        if (title) gsap.set(title, { yPercent: 0 });
        var text = card.querySelector(".apj-svclist__text");
        if (text) gsap.set(text, { opacity: 1, y: 0 });
        var checks = card.querySelectorAll(".apj-svclist__checks li");
        if (checks.length) gsap.set(checks, { opacity: 1, x: 0 });
        var btn = card.querySelector(".apj-svclist__btn");
        if (btn) gsap.set(btn, { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

    // Card batch reveal
    ScrollTrigger.batch("[data-apj-card]", {
      start: "top 88%",
      once: true,
      interval: 0.1,
      batchMax: 2,
      onEnter: function (batch) {
        batch.forEach(function (card) {
          var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          var mark = card.querySelector(".apj-svclist__mark");
          var idx = card.querySelector(".apj-svclist__index");
          var title = card.querySelector(".apj-svclist__title");
          var text = card.querySelector(".apj-svclist__text");
          var checks = card.querySelectorAll(".apj-svclist__checks li");
          var checkIcons = card.querySelectorAll(".apj-svclist__check");
          var btn = card.querySelector(".apj-svclist__btn");

          tl.fromTo(card,
            { y: 70, opacity: 0, clipPath: "inset(8% 0 0 0 round 28px)" },
            { y: 0, opacity: 1, clipPath: "inset(0 round 28px)", duration: 0.9 },
            0
          );

          if (mark) {
            tl.fromTo(mark,
              { xPercent: 30, opacity: 0 },
              { xPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
              0.1
            );
          }

          if (idx) {
            tl.fromTo(idx,
              { x: -12, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6 },
              0.2
            );
          }

          if (title) {
            tl.fromTo(title,
              { yPercent: 110 },
              { yPercent: 0, duration: 1.0, ease: "expo.out" },
              0.25
            );
          }

          if (text) {
            tl.fromTo(text,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7 },
              0.35
            );
          }

          if (checks.length) {
            tl.fromTo(checks,
              { x: -16, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, stagger: 0.09 },
              0.4
            );
            if (checkIcons.length) {
              tl.fromTo(checkIcons,
                { scale: 0 },
                { scale: 1, duration: 0.6, stagger: 0.09, ease: "back.out(2.2)" },
                0.4
              );
            }
          }

          if (btn) {
            tl.fromTo(btn,
              { y: 20, opacity: 0, scale: 0.94 },
              { y: 0, opacity: 1, scale: 1, duration: 0.7 },
              0.55
            );
          }
        });
      }
    });

    // Pointer spotlight on fine pointer desktop
    if (conditions.pointerFine) {
      cards.forEach(function (card) {
        var spot = card.querySelector(".apj-svclist__spot");
        if (!spot) return;

        var setX = gsap.quickTo(spot, "x", { duration: 0.35, ease: "power2.out" });
        var setY = gsap.quickTo(spot, "y", { duration: 0.35, ease: "power2.out" });

        card.addEventListener("mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          setX(e.clientX - rect.left - 120);
          setY(e.clientY - rect.top - 120);
        });

        card.addEventListener("mouseenter", function () {
          gsap.to(spot, { opacity: 1, duration: 0.3 });
        });

        card.addEventListener("mouseleave", function () {
          gsap.to(spot, { opacity: 0, duration: 0.4 });
        });
      });
    }

    // Touch in-view activation (< 992px or hover: none)
    if (conditions.mobile || !conditions.pointerFine) {
      cards.forEach(function (card) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "apj-svclist__card--inview"
        });
      });
    }

    // Scroll depth column offset (desktop)
    if (conditions.desktop) {
      var items = listSection.querySelectorAll(".apj-svclist__item");
      items.forEach(function (item, i) {
        var isRight = (i % 2 === 1);
        gsap.fromTo(item,
          { yPercent: isRight ? 3 : -3 },
          {
            yPercent: isRight ? -3 : 3,
            ease: "none",
            scrollTrigger: {
              id: "apj-svclist-depth-" + i,
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      });
    }
  }

  /**
   * 5. SERVICE DETAIL HERO VISUAL (#svc-visual)
   */
  function initApjSvcVisual(conditions) {
    var visualSection = document.querySelector("#svc-visual");
    if (!visualSection) return;

    var visual = visualSection.querySelector(".apj-svcd__visual");
    if (!visual) return;

    var img = visual.querySelector(".apj-svcd__media-img");
    var chip = visual.querySelector(".apj-svcd__chip");

    if (conditions.reducedMotion) {
      gsap.set(visual, { clipPath: "none" });
      if (img) gsap.set(img, { scale: 1, yPercent: 0 });
      if (chip) gsap.set(chip, { opacity: 1, y: 0 });
      return;
    }

    var visualTl = gsap.timeline({
      scrollTrigger: {
        id: "apj-svcd-visual",
        trigger: visual,
        start: "top 85%",
        once: true
      }
    });

    visualTl.fromTo(visual,
      { clipPath: "inset(0 0 100% 0 round 28px)" },
      { clipPath: "inset(0 0 0% 0 round 28px)", duration: 1.4, ease: "expo.out" },
      0
    );

    if (img) {
      visualTl.fromTo(img,
        { scale: 1.25 },
        { scale: 1, duration: 1.4, ease: "expo.out" },
        0
      );
    }

    if (chip) {
      visualTl.fromTo(chip,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0.6
      );
    }

    // Parallax on desktop
    if (conditions.desktop && img) {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            id: "apj-svcd-img-parallax",
            trigger: visual,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }
  }

  /**
   * Helper: Scroll element to center
   */
  function smoothScrollToCenter(el, conditions) {
    if (!el) return;
    if (window.ScrollSmoother && window.ScrollSmoother.get()) {
      window.ScrollSmoother.get().scrollTo(el, true, "center center");
    } else {
      el.scrollIntoView({
        block: "center",
        behavior: conditions && conditions.reducedMotion ? "auto" : "smooth"
      });
    }
  }

  /**
   * 6. SCOPE OF SERVICES ACCORDION & RAIL (#svc-scope)
   */
  function initApjSvcAccordion(conditions) {
    var scopeSection = document.querySelector("#svc-scope");
    if (!scopeSection) return;

    var acc = scopeSection.querySelector("#apj-svcd-acc");
    var items = scopeSection.querySelectorAll(".apj-svcd__item");
    if (!items.length) return;

    if (conditions.reducedMotion) {
      items.forEach(function (item) {
        gsap.set(item, { opacity: 1, y: 0 });
        var line = item.querySelector(".apj-svcd__item-line");
        if (line) gsap.set(line, { scaleX: 1 });
      });
    } else {
      // Items batch reveal
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        interval: 0.08,
        onEnter: function (batch) {
          batch.forEach(function (item) {
            gsap.fromTo(item,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
            );
            var line = item.querySelector(".apj-svcd__item-line");
            if (line) {
              gsap.fromTo(line,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.9, ease: "expo.out" }
              );
            }
          });
        }
      });
    }

    // Bootstrap collapse animations
    if (acc && !conditions.reducedMotion) {
      acc.addEventListener("show.bs.collapse", function (e) {
        var collapseEl = e.target;
        var item = collapseEl.closest(".apj-svcd__item");
        if (!item) return;
        var dot = item.querySelector(".apj-svcd__num-dot");
        var barV = item.querySelector(".apj-svcd__bar--v");
        if (dot) gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" });
        if (barV) gsap.to(barV, { rotation: 90, opacity: 0, duration: 0.35, overwrite: "auto" });
      });

      acc.addEventListener("shown.bs.collapse", function (e) {
        var collapseEl = e.target;
        var item = collapseEl.closest(".apj-svcd__item");
        if (!item) return;

        var desc = item.querySelector(".apj-svcd__desc");
        var bullets = item.querySelectorAll(".apj-svcd__scope li");
        var approach = item.querySelector(".apj-svcd__approach");

        if (desc) {
          gsap.fromTo(desc,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" }
          );
        }

        if (bullets.length) {
          gsap.fromTo(bullets,
            { x: -12, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out", overwrite: "auto" }
          );
        }

        if (approach) {
          gsap.fromTo(approach,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" }
          );
        }

        debounceRefresh();
      });

      acc.addEventListener("hide.bs.collapse", function (e) {
        var collapseEl = e.target;
        var item = collapseEl.closest(".apj-svcd__item");
        if (!item) return;
        var dot = item.querySelector(".apj-svcd__num-dot");
        var barV = item.querySelector(".apj-svcd__bar--v");
        if (dot) gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, overwrite: "auto" });
        if (barV) gsap.to(barV, { rotation: 0, opacity: 1, duration: 0.25, overwrite: "auto" });
      });

      acc.addEventListener("hidden.bs.collapse", function () {
        debounceRefresh();
      });
    }

    // Touch in-view highlight on mobile
    if (conditions.mobile) {
      items.forEach(function (item) {
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 45%",
          toggleClass: "apj-svcd__item--inview"
        });
      });
    }
  }

  /**
   * 7. RAIL PINNING & INTERACTIVE LINKS (#svc-scope rail and glance chips)
   */
  function initApjSvcRail(conditions) {
    var scopeSection = document.querySelector("#svc-scope");
    if (!scopeSection) return;

    var rail = scopeSection.querySelector(".apj-svcd__rail");
    var acc = scopeSection.querySelector("#apj-svcd-acc");
    var items = scopeSection.querySelectorAll(".apj-svcd__item");
    var idxBtns = scopeSection.querySelectorAll(".apj-svcd__idx-btn");

    // Pinning rail on desktop if accordion is taller
    if (rail && acc && conditions.desktop && !conditions.reducedMotion) {
      if (acc.offsetHeight > rail.offsetHeight) {
        ScrollTrigger.create({
          id: "apj-svcd-rail-pin",
          trigger: rail,
          start: "top 120px",
          endTrigger: acc,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false
        });
      }

      // Active index indicator on scroll
      items.forEach(function (item, idx) {
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: function (self) {
            if (self.isActive && idxBtns[idx]) {
              idxBtns.forEach(function (b) { b.classList.remove("apj-svcd__idx--active"); });
              idxBtns[idx].classList.add("apj-svcd__idx--active");
            }
          }
        });
      });
    }

    // Setup interactive opening and scrolling for glance chips and rail index buttons
    var triggerButtons = document.querySelectorAll(".apj-svcd__chip-btn, .apj-svcd__idx-btn");
    triggerButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var targetSelector = btn.getAttribute("data-target") || btn.getAttribute("aria-controls");
        if (!targetSelector) return;
        if (targetSelector.charAt(0) !== "#") targetSelector = "#" + targetSelector;

        var targetCollapse = document.querySelector(targetSelector);
        if (targetCollapse && window.bootstrap && window.bootstrap.Collapse) {
          var bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(targetCollapse);
          bsCollapse.show();
          var parentItem = targetCollapse.closest(".apj-svcd__item");
          if (parentItem) {
            smoothScrollToCenter(parentItem, conditions);
          }
        }
      });
    });
  }

  /**
   * 8. APPLICATIONS GRID (#svc-apps)
   */
  function initApjSvcApps(conditions) {
    var appsSection = document.querySelector("#svc-apps");
    if (!appsSection) return;

    var tiles = appsSection.querySelectorAll(".apj-svcd__app-tile");
    if (!tiles.length) return;

    if (conditions.reducedMotion) {
      tiles.forEach(function (tile) {
        gsap.set(tile, { opacity: 1, y: 0, scale: 1 });
        var icon = tile.querySelector(".apj-svcd__app-icon");
        if (icon) gsap.set(icon, { scale: 1 });
      });
      return;
    }

    ScrollTrigger.batch(tiles, {
      start: "top 88%",
      once: true,
      interval: 0.08,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { y: 40, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power3.out" }
        );

        batch.forEach(function (tile) {
          var icon = tile.querySelector(".apj-svcd__app-icon");
          if (icon) {
            gsap.fromTo(icon,
              { scale: 0 },
              { scale: 1, duration: 0.6, ease: "back.out(2)" }
            );
          }
        });
      }
    });

    if (conditions.mobile) {
      tiles.forEach(function (tile) {
        ScrollTrigger.create({
          trigger: tile,
          start: "top 60%",
          end: "bottom 40%",
          toggleClass: "apj-svcd__app-tile--inview"
        });
      });
    }
  }

  /**
   * 9. PREVIOUS / NEXT SERVICE NAVIGATION (#svc-nav)
   */
  function initApjSvcNav(conditions) {
    var navSection = document.querySelector("#svc-nav");
    if (!navSection) return;

    var prevCard = navSection.querySelector(".apj-svcd__nav-card--prev");
    var nextCard = navSection.querySelector(".apj-svcd__nav-card--next");

    if (conditions.reducedMotion) {
      if (prevCard) gsap.set(prevCard, { opacity: 1, x: 0 });
      if (nextCard) gsap.set(nextCard, { opacity: 1, x: 0 });
      return;
    }

    if (prevCard) {
      gsap.fromTo(prevCard,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-svcd-nav-prev",
            trigger: navSection,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (nextCard) {
      gsap.fromTo(nextCard,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-svcd-nav-next",
            trigger: navSection,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }

  /**
   * 10. PROJECTS GALLERY & FILTERING (#projects-list, apj-projlist)
   */
  function initApjProjList(conditions) {
    var projSection = document.querySelector("[data-apj-projlist]");
    if (!projSection) return;

    var bar = projSection.querySelector(".apj-projlist__bar");
    var barLine = projSection.querySelector(".apj-projlist__bar-line");
    var countEl = projSection.querySelector(".apj-projlist__count");
    var countNum = projSection.querySelector(".apj-projlist__count-num");
    var countLabel = projSection.querySelector(".apj-projlist__count-label");
    var chips = projSection.querySelectorAll(".apj-projlist__chip");
    var activeDot = projSection.querySelector(".apj-projlist__chip[aria-pressed='true'] .apj-projlist__chip-dot");
    var items = projSection.querySelectorAll(".apj-projlist__item");
    var emptyEl = projSection.querySelector(".apj-projlist__empty");
    var cursorCircle = projSection.querySelector(".apj-projlist__cursor");

    if (!items.length) return;

    // A. Filter Bar Entrance Motion
    if (conditions.reducedMotion) {
      if (barLine) gsap.set(barLine, { scaleX: 1 });
      if (countEl) gsap.set(countEl, { opacity: 1, y: 0 });
      if (chips.length) gsap.set(chips, { opacity: 1, y: 0 });
      if (activeDot) gsap.set(activeDot, { scale: 1 });
    } else {
      if (barLine) gsap.set(barLine, { scaleX: 0 });
      if (countEl) gsap.set(countEl, { opacity: 0, y: 14 });
      if (chips.length) gsap.set(chips, { opacity: 0, y: 16 });
      if (activeDot) gsap.set(activeDot, { scale: 0 });

      ScrollTrigger.create({
        id: "apj-projlist-bar",
        trigger: bar || projSection,
        start: "top 90%",
        once: true,
        onEnter: function () {
          var barTl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (barLine) barTl.to(barLine, { scaleX: 1, duration: 1.0, ease: "expo.out" }, 0);
          if (countEl) barTl.to(countEl, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
          if (chips.length) barTl.to(chips, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.15);
          if (activeDot) barTl.to(activeDot, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 0.4);
        }
      });
    }

    // B. Cards Entrance (Slide up from bottom after ScrollTrigger)
    if (conditions.reducedMotion) {
      items.forEach(function (item) {
        var card = item.querySelector(".apj-projlist__card") || item;
        gsap.set(card, { opacity: 1, y: 0 });
        item.setAttribute("data-revealed", "true");
      });
    } else {
      items.forEach(function (item, i) {
        var card = item.querySelector(".apj-projlist__card") || item;
        var delay = (conditions.desktop && (i % 2 === 1)) ? 0.12 : 0;

        gsap.fromTo(card,
          {
            opacity: 0,
            y: 60
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-projlist-card-" + i,
              trigger: card,
              start: "top 85%",
              once: true,
              onEnter: function () {
                item.setAttribute("data-revealed", "true");
              }
            }
          }
        );
      });
    }

    // C. Scroll Depth (Desktop >= 992px: subtle image parallax inside frame)
    if (conditions.desktop && !conditions.reducedMotion) {
      items.forEach(function (item, i) {
        var img = item.querySelector(".apj-projlist__img");
        if (img) {
          gsap.fromTo(img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                id: "apj-projlist-depth-img-" + i,
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
              }
            }
          );
        }
      });
    }

    // D. Touch in-view activation (< 992px or hover: none)
    if (conditions.mobile || !conditions.pointerFine) {
      items.forEach(function (item, i) {
        var card = item.querySelector(".apj-projlist__card");
        if (!card) return;
        ScrollTrigger.create({
          id: "apj-projlist-active-" + i,
          trigger: card,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "apj-projlist__card--inview"
        });
      });
    }

    // E. Filtering Interaction
    chips.forEach(function (chip) {
      chip.addEventListener("click", function (e) {
        e.preventDefault();
        var filterVal = chip.getAttribute("data-filter");
        var isCurrent = chip.getAttribute("aria-pressed") === "true";
        if (isCurrent) return;

        // 1. Set aria-pressed on chips and animate dot
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", "false");
          var cDot = c.querySelector(".apj-projlist__chip-dot");
          if (cDot) gsap.set(cDot, { scale: 0 });
        });
        chip.setAttribute("aria-pressed", "true");
        var dot = chip.querySelector(".apj-projlist__chip-dot");
        if (dot && !conditions.reducedMotion) {
          gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
        }

        // Horizontal scroll chip into view on mobile
        if (chip.parentElement && typeof chip.parentElement.scrollTo === "function") {
          chip.parentElement.scrollTo({
            left: chip.offsetLeft - 16,
            behavior: conditions.reducedMotion ? "auto" : "smooth"
          });
        }

        // Determine matching cards
        var matchingItems = [];
        var nonMatchingItems = [];
        items.forEach(function (item) {
          var itemCat = item.getAttribute("data-category");
          if (filterVal === "all" || itemCat === filterVal) {
            matchingItems.push(item);
          } else {
            nonMatchingItems.push(item);
          }
        });

        var matchCount = matchingItems.length;

        // Count updater function
        function updateCountDisplay() {
          var formattedCount = matchCount < 10 ? "0" + matchCount : "" + matchCount;
          if (countNum) {
            if (conditions.reducedMotion) {
              countNum.textContent = formattedCount;
            } else {
              gsap.to(countNum, {
                yPercent: -100,
                duration: 0.2,
                ease: "power2.in",
                onComplete: function () {
                  countNum.textContent = formattedCount;
                  gsap.fromTo(countNum, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: "power3.out" });
                }
              });
            }
          }
          if (countLabel) {
            countLabel.textContent = matchCount === 1 ? "project" : "projects";
          }
          if (countEl) {
            countEl.setAttribute("aria-label", "Showing " + matchCount + " " + (matchCount === 1 ? "project" : "projects"));
          }
        }

        if (conditions.reducedMotion) {
          nonMatchingItems.forEach(function (item) {
            item.classList.add("apj-projlist__item--off");
          });
          matchingItems.forEach(function (item) {
            item.classList.remove("apj-projlist__item--off");
            gsap.set(item, { opacity: 1, y: 0 });
          });
          if (emptyEl) {
            if (matchCount === 0) emptyEl.classList.add("apj-projlist__empty--show");
            else emptyEl.classList.remove("apj-projlist__empty--show");
          }
          updateCountDisplay();
          debounceRefresh();
          return;
        }

        // Animated Sequence:
        // Visible cards fade out
        var currentlyVisibleItems = Array.from(items).filter(function (item) {
          return !item.classList.contains("apj-projlist__item--off");
        });
        var visibleCards = currentlyVisibleItems.map(function (item) {
          return item.querySelector(".apj-projlist__card") || item;
        });

        gsap.to(visibleCards, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: function () {
            // Apply --off classes
            nonMatchingItems.forEach(function (item) {
              item.classList.add("apj-projlist__item--off");
            });
            matchingItems.forEach(function (item) {
              item.classList.remove("apj-projlist__item--off");
            });

            // Toggle empty state
            if (emptyEl) {
              if (matchCount === 0) {
                emptyEl.classList.add("apj-projlist__empty--show");
                gsap.fromTo(emptyEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
              } else {
                emptyEl.classList.remove("apj-projlist__empty--show");
              }
            }

            // Animate matching cards in (cards already revealed slide up; unrevealed stay ready for scrollTrigger)
            var matchingCardsToAnimate = [];
            matchingItems.forEach(function (item) {
              var card = item.querySelector(".apj-projlist__card") || item;
              if (item.getAttribute("data-revealed") === "true") {
                matchingCardsToAnimate.push(card);
              } else {
                gsap.set(card, { opacity: 0, y: 60 });
              }
            });

            if (matchingCardsToAnimate.length) {
              gsap.fromTo(matchingCardsToAnimate,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: "power3.out", overwrite: "auto" }
              );
            }

            updateCountDisplay();
            debounceRefresh();
          }
        });
      });
    });

    // F. Gated "View project" Cursor Circle
    if (cursorCircle) {
      var linkedCards = projSection.querySelectorAll(".apj-projlist__link");
      if (linkedCards.length === 0 || conditions.reducedMotion || !conditions.pointerFine) {
        cursorCircle.setAttribute("hidden", "");
      } else {
        cursorCircle.removeAttribute("hidden");
        var gridWrap = projSection.querySelector(".apj-projlist__grid-wrap") || projSection;
        var setCursorX = gsap.quickTo(cursorCircle, "x", { duration: 0.35, ease: "power3.out" });
        var setCursorY = gsap.quickTo(cursorCircle, "y", { duration: 0.35, ease: "power3.out" });

        gridWrap.addEventListener("mousemove", function (e) {
          var rect = gridWrap.getBoundingClientRect();
          setCursorX(e.clientX - rect.left);
          setCursorY(e.clientY - rect.top);
        });

        linkedCards.forEach(function (link) {
          var card = link.closest(".apj-projlist__card");
          if (!card) return;

          card.addEventListener("pointerenter", function () {
            gsap.to(cursorCircle, { scale: 1, duration: 0.35, ease: "back.out(1.7)" });
          });

          card.addEventListener("pointerleave", function () {
            gsap.to(cursorCircle, { scale: 0, duration: 0.3, ease: "power2.in" });
          });
        });
      }
    }
  }

  /**
   * 11. CONTACT PAGE (apj-contact)
   */
  function initApjContact(conditions) {
    var contactEl = document.querySelector("[data-apj-contact]") || document.querySelector(".apj-page--contact");
    if (!contactEl) return;

    initApjContactCards(conditions);
    initApjContactForm(conditions);
    initApjContactOffice(conditions);
    initApjContactFaq(conditions);
  }

  /**
   * 11A. Contact Cards & Panel
   */
  function initApjContactCards(conditions) {
    var section = document.querySelector("[data-apj-contact-details]") || document.querySelector("#contact-details");
    if (!section) return;

    var panel = section.querySelector(".apj-contact__panel--details");
    var pattern = section.querySelector(".apj-contact__pattern");
    var marker = section.querySelector(".apj-contact__eyebrow-bar");
    var titleInners = section.querySelectorAll(".apj-contact__title-inner");
    var panelText = section.querySelector(".apj-contact__panel-text");
    var cardsGrid = section.querySelector(".apj-contact__cards-grid");
    var cards = section.querySelectorAll(".apj-contact__card");
    var cardIcons = section.querySelectorAll(".apj-contact__card-icon");
    var cardValues = section.querySelectorAll(".apj-contact__card-values");

    if (conditions.reducedMotion) {
      if (panel) gsap.set(panel, { clipPath: "none", opacity: 1 });
      if (pattern) gsap.set(pattern, { opacity: 1, xPercent: 0 });
      if (marker) gsap.set(marker, { scaleX: 1 });
      if (titleInners.length) gsap.set(titleInners, { yPercent: 0 });
      if (panelText) gsap.set(panelText, { opacity: 1, y: 0 });
      if (cards.length) gsap.set(cards, { opacity: 1, y: 0 });
      if (cardIcons.length) gsap.set(cardIcons, { scale: 1, rotation: 0 });
      if (cardValues.length) gsap.set(cardValues, { opacity: 1, y: 0 });
      return;
    }

    if (panel) {
      gsap.fromTo(panel,
        { clipPath: "inset(100% 0 0 0 round 32px)" },
        {
          clipPath: "inset(0% 0 0 0 round 32px)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-panel-in",
            trigger: panel,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (pattern) {
      gsap.fromTo(pattern,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            id: "apj-contact-pattern-fade",
            trigger: panel || section,
            start: "top 85%",
            once: true
          }
        }
      );

      if (conditions.desktop) {
        gsap.fromTo(pattern,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: "none",
            scrollTrigger: {
              id: "apj-contact-pattern-drift",
              trigger: panel || section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
    }

    if (marker) {
      gsap.fromTo(marker,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-marker",
            trigger: panel || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (titleInners.length) {
      gsap.fromTo(titleInners,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            id: "apj-contact-title",
            trigger: panel || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (panelText) {
      gsap.fromTo(panelText,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-panel-text",
            trigger: panel || section,
            start: "top 78%",
            once: true
          }
        }
      );
    }

    if (cards.length) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.1, grid: "auto", from: "start" },
          scrollTrigger: {
            id: "apj-contact-cards",
            trigger: cardsGrid || panel,
            start: "top 82%",
            once: true
          }
        }
      );
    }

    if (cardIcons.length) {
      gsap.fromTo(cardIcons,
        { scale: 0.5, rotation: -25 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(2)",
          stagger: { each: 0.1, grid: "auto", from: "start" },
          scrollTrigger: {
            id: "apj-contact-icons",
            trigger: cardsGrid || panel,
            start: "top 82%",
            once: true
          }
        }
      );
    }

    if (cardValues.length) {
      gsap.fromTo(cardValues,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.15,
          scrollTrigger: {
            id: "apj-contact-values",
            trigger: cardsGrid || panel,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (conditions.pointerFine && cards.length) {
      cards.forEach(function (card) {
        var spot = card.querySelector(".apj-contact__card-spotlight");
        if (!spot) return;
        var setX = gsap.quickTo(spot, "x", { duration: 0.35, ease: "power2.out" });
        var setY = gsap.quickTo(spot, "y", { duration: 0.35, ease: "power2.out" });

        card.addEventListener("mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          setX(e.clientX - rect.left - 120);
          setY(e.clientY - rect.top - 120);
        });

        card.addEventListener("mouseenter", function () {
          gsap.to(spot, { opacity: 1, duration: 0.3 });
        });

        card.addEventListener("mouseleave", function () {
          gsap.to(spot, { opacity: 0, duration: 0.4 });
        });
      });
    }

    if (conditions.mobile || !conditions.pointerFine) {
      cards.forEach(function (card, idx) {
        ScrollTrigger.create({
          id: "apj-contact-card-inview-" + idx,
          trigger: card,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "apj-contact__card--inview"
        });
      });
    }
  }

  /**
   * 11B. Contact Form & Validation
   */
  function initApjContactForm(conditions) {
    var section = document.querySelector("[data-apj-contact-form-section]") || document.querySelector("#contact-form");
    if (!section) return;

    var marker = section.querySelector(".apj-contact__eyebrow-bar");
    var titleInners = section.querySelectorAll(".apj-contact__title-inner");
    var introText = section.querySelector(".apj-contact__section-intro");
    var socialBtns = section.querySelectorAll(".apj-contact__social-btn");
    var formCard = section.querySelector(".apj-contact__form-card");
    var form = section.querySelector("#apj-contact-form");
    var fields = section.querySelectorAll(".apj-contact__field");
    var submitBtn = section.querySelector(".apj-contact__submit");
    var statusEl = section.querySelector(".apj-contact__status");
    var successEl = section.querySelector(".apj-contact__success");
    var fallbackMsg = section.querySelector(".apj-contact__success-fallback");
    var resetBtn = section.querySelector(".apj-contact__reset-btn");
    var checkCircle = section.querySelector(".apj-contact__check-circle");
    var checkTick = section.querySelector(".apj-contact__check-tick");

    if (conditions.reducedMotion) {
      if (marker) gsap.set(marker, { scaleX: 1 });
      if (titleInners.length) gsap.set(titleInners, { yPercent: 0 });
      if (introText) gsap.set(introText, { opacity: 1, y: 0 });
      if (socialBtns.length) gsap.set(socialBtns, { scale: 1 });
      if (formCard) gsap.set(formCard, { opacity: 1, y: 0, scale: 1 });
      if (fields.length) gsap.set(fields, { opacity: 1, y: 0 });
      if (submitBtn) gsap.set(submitBtn, { opacity: 1, y: 0, scale: 1 });
      if (checkCircle) gsap.set(checkCircle, { strokeDashoffset: 0 });
      if (checkTick) gsap.set(checkTick, { strokeDashoffset: 0 });
    } else {
      if (marker) {
        gsap.fromTo(marker,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              id: "apj-contact-form-marker",
              trigger: section,
              start: "top 80%",
              once: true
            }
          }
        );
      }

      if (titleInners.length) {
        gsap.fromTo(titleInners,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              id: "apj-contact-form-title",
              trigger: section,
              start: "top 80%",
              once: true
            }
          }
        );
      }

      if (introText) {
        gsap.fromTo(introText,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-contact-form-intro",
              trigger: section,
              start: "top 78%",
              once: true
            }
          }
        );
      }

      if (socialBtns.length) {
        gsap.fromTo(socialBtns,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
            scrollTrigger: {
              id: "apj-contact-social",
              trigger: section.querySelector(".apj-contact__social-wrap") || section,
              start: "top 85%",
              once: true
            }
          }
        );
      }

      if (formCard) {
        gsap.fromTo(formCard,
          { y: 60, scale: 0.97, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-contact-form-card",
              trigger: formCard,
              start: "top 85%",
              once: true
            }
          }
        );
      }

      if (fields.length) {
        gsap.fromTo(fields,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-contact-form-fields",
              trigger: formCard,
              start: "top 80%",
              once: true
            }
          }
        );
      }

      if (submitBtn) {
        gsap.fromTo(submitBtn,
          { y: 24, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-contact-form-btn",
              trigger: formCard,
              start: "top 75%",
              once: true
            }
          }
        );
      }
    }

    if (!form || form.getAttribute("data-apj-bound") === "true") return;
    form.setAttribute("data-apj-bound", "true");

    var inputs = form.querySelectorAll(".apj-contact__input, .apj-contact__textarea, .apj-contact__select");
    var origBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    function validateField(input) {
      if (!input) return true;
      var val = input.value.trim();
      var id = input.id;
      var errEl = form.querySelector("#" + id + "-err");
      var errorMsg = "";

      if (id === "apj-name") {
        if (val.length < 2) {
          errorMsg = "Please enter your name (at least 2 characters).";
        }
      } else if (id === "apj-email") {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(val)) {
          errorMsg = "Please enter a valid email address.";
        }
      } else if (id === "apj-phone") {
        if (val.length > 0) {
          var cleanPhone = val.replace(/[\s\+\-\(\)]/g, "");
          if (!/^\d{7,15}$/.test(cleanPhone)) {
            errorMsg = "Please enter a valid phone number (7-15 digits).";
          }
        }
      } else if (id === "apj-message") {
        if (val.length < 10) {
          errorMsg = "Please enter a message of at least 10 characters.";
        }
      }

      if (errorMsg) {
        input.classList.add("apj-contact__input--invalid");
        input.classList.remove("apj-contact__input--valid");
        input.setAttribute("aria-invalid", "true");
        if (errEl) {
          input.setAttribute("aria-describedby", errEl.id);
          errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ' + errorMsg;
          errEl.removeAttribute("hidden");
        }
        return false;
      } else {
        input.classList.remove("apj-contact__input--invalid");
        if (val.length > 0) {
          input.classList.add("apj-contact__input--valid");
        } else {
          input.classList.remove("apj-contact__input--valid");
        }
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
        if (errEl) {
          errEl.textContent = "";
          errEl.setAttribute("hidden", "");
        }
        return true;
      }
    }

    inputs.forEach(function (inp) {
      inp.addEventListener("blur", function () {
        inp.setAttribute("data-touched", "true");
        validateField(inp);
      });
      inp.addEventListener("input", function () {
        if (inp.getAttribute("data-touched") === "true") {
          validateField(inp);
        }
      });
    });

    function showSuccessState(isMailtoFallback) {
      if (fallbackMsg) {
        if (isMailtoFallback) {
          fallbackMsg.removeAttribute("hidden");
        } else {
          fallbackMsg.setAttribute("hidden", "");
        }
      }

      var formElementsToHide = form.querySelectorAll(".apj-contact__row, .apj-contact__field, .apj-contact__note, .apj-contact__actions, .apj-contact__status");

      gsap.to(formElementsToHide, {
        opacity: 0,
        y: -12,
        duration: 0.4,
        onComplete: function () {
          formElementsToHide.forEach(function (el) {
            el.setAttribute("hidden", "");
          });

          if (successEl) {
            successEl.removeAttribute("hidden");
            if (conditions.reducedMotion) {
              gsap.set(successEl, { opacity: 1, y: 0 });
              if (checkCircle) gsap.set(checkCircle, { strokeDashoffset: 0 });
              if (checkTick) gsap.set(checkTick, { strokeDashoffset: 0 });
            } else {
              gsap.fromTo(successEl,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
              );
              if (checkCircle && checkTick) {
                gsap.fromTo([checkCircle, checkTick],
                  { strokeDashoffset: 1 },
                  { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut", stagger: 0.2 }
                );
              }
            }
            successEl.focus();
          }
          debounceRefresh();
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot check
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== "") {
        showSuccessState(false);
        return;
      }

      var nameInp = form.querySelector("#apj-name");
      var emailInp = form.querySelector("#apj-email");
      var phoneInp = form.querySelector("#apj-phone");
      var msgInp = form.querySelector("#apj-message");

      var vName = validateField(nameInp);
      var vEmail = validateField(emailInp);
      var vPhone = validateField(phoneInp);
      var vMsg = validateField(msgInp);

      var allValid = vName && vEmail && vPhone && vMsg;

      if (!allValid) {
        var invalidInputs = form.querySelectorAll(".apj-contact__input--invalid");
        if (invalidInputs.length) {
          invalidInputs[0].focus();
        }
        if (statusEl) {
          statusEl.textContent = "Please fix " + invalidInputs.length + " field" + (invalidInputs.length > 1 ? "s." : ".");
        }
        return;
      }

      if (submitBtn) {
        submitBtn.setAttribute("disabled", "true");
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.innerHTML = '<span class="btn-pill__label"><span class="btn-pill__text"><i class="fa-solid fa-circle-notch fa-spin me-2" aria-hidden="true"></i> Sending...</span></span>';
      }
      if (statusEl) statusEl.textContent = "";

      var endpoint = form.getAttribute("data-apj-endpoint") || "";
      if (endpoint.trim() !== "") {
        var formData = new FormData(form);
        fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        })
          .then(function (res) {
            if (res.ok) {
              showSuccessState(false);
            } else {
              throw new Error("Server error");
            }
          })
          .catch(function () {
            if (statusEl) {
              statusEl.textContent = "Could not send. Please call 011 26525390 or email info@aparajita.net.";
            }
            if (submitBtn) {
              submitBtn.removeAttribute("disabled");
              submitBtn.removeAttribute("aria-busy");
              submitBtn.innerHTML = origBtnHtml;
            }
          });
      } else {
        var nVal = nameInp ? nameInp.value.trim() : "";
        var eVal = emailInp ? emailInp.value.trim() : "";
        var pVal = phoneInp ? phoneInp.value.trim() : "";
        var inqInp = form.querySelector("#apj-inquiry");
        var iVal = inqInp ? inqInp.value.trim() : "";
        var mVal = msgInp ? msgInp.value.trim() : "";

        var subject = "Project Requirement: " + (iVal ? iVal : "General Enquiry") + " - " + nVal;
        var body = "Name: " + nVal + "\n" +
          "Email: " + eVal + "\n" +
          "Phone: " + (pVal || "N/A") + "\n" +
          "Inquiry: " + (iVal || "N/A") + "\n\n" +
          "Message:\n" + mVal;

        var mailtoUrl = "mailto:info@aparajita.net?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.location.href = mailtoUrl;

        showSuccessState(true);
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        inputs.forEach(function (inp) {
          inp.classList.remove("apj-contact__input--invalid", "apj-contact__input--valid");
          inp.removeAttribute("aria-invalid");
          inp.removeAttribute("aria-describedby");
          inp.removeAttribute("data-touched");
        });
        var errElements = form.querySelectorAll(".apj-contact__error");
        errElements.forEach(function (err) {
          err.textContent = "";
          err.setAttribute("hidden", "");
        });
        if (successEl) successEl.setAttribute("hidden", "");
        if (statusEl) statusEl.textContent = "";

        var formElementsToUnhide = form.querySelectorAll(".apj-contact__row, .apj-contact__field, .apj-contact__note, .apj-contact__actions, .apj-contact__status");
        formElementsToUnhide.forEach(function (el) {
          el.removeAttribute("hidden");
        });
        gsap.set(formElementsToUnhide, { opacity: 1, y: 0 });

        if (submitBtn) {
          submitBtn.removeAttribute("disabled");
          submitBtn.removeAttribute("aria-busy");
          submitBtn.innerHTML = origBtnHtml;
        }

        var firstInp = form.querySelector("#apj-name");
        if (firstInp) firstInp.focus();
        debounceRefresh();
      });
    }
  }

  /**
   * 11C. Visit Our Office & Map
   */
  function initApjContactOffice(conditions) {
    var section = document.querySelector("[data-apj-contact-office]") || document.querySelector("#contact-office");
    if (!section) return;

    var panel = section.querySelector(".apj-contact__panel--office");
    var pattern = section.querySelector(".apj-contact__pattern");
    var marker = section.querySelector(".apj-contact__eyebrow-bar");
    var titleInners = section.querySelectorAll(".apj-contact__title-inner");
    var panelText = section.querySelector(".apj-contact__panel-text");
    var officeCard = section.querySelector(".apj-contact__office-card");
    var officeRows = section.querySelectorAll(".apj-contact__office-row");
    var officeIcons = section.querySelectorAll(".apj-contact__office-icon");
    var mapFrame = section.querySelector(".apj-contact__map-frame");
    var mapIframe = section.querySelector(".apj-contact__map-iframe");

    if (conditions.reducedMotion) {
      if (panel) gsap.set(panel, { clipPath: "none", opacity: 1 });
      if (pattern) gsap.set(pattern, { opacity: 1, xPercent: 0 });
      if (marker) gsap.set(marker, { scaleX: 1 });
      if (titleInners.length) gsap.set(titleInners, { yPercent: 0 });
      if (panelText) gsap.set(panelText, { opacity: 1, y: 0 });
      if (officeCard) gsap.set(officeCard, { opacity: 1, x: 0 });
      if (officeRows.length) gsap.set(officeRows, { opacity: 1, x: 0 });
      if (officeIcons.length) gsap.set(officeIcons, { scale: 1 });
      if (mapFrame) gsap.set(mapFrame, { clipPath: "none" });
      if (mapIframe) gsap.set(mapIframe, { scale: 1 });
      return;
    }

    if (panel) {
      gsap.fromTo(panel,
        { clipPath: "inset(100% 0 0 0 round 32px)" },
        {
          clipPath: "inset(0% 0 0 0 round 32px)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-office-panel",
            trigger: panel,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (pattern) {
      gsap.fromTo(pattern,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            id: "apj-contact-office-pattern-fade",
            trigger: panel || section,
            start: "top 85%",
            once: true
          }
        }
      );

      if (conditions.desktop) {
        gsap.fromTo(pattern,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: "none",
            scrollTrigger: {
              id: "apj-contact-office-pattern-drift",
              trigger: panel || section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
    }

    if (marker) {
      gsap.fromTo(marker,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-office-marker",
            trigger: panel || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (titleInners.length) {
      gsap.fromTo(titleInners,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            id: "apj-contact-office-title",
            trigger: panel || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (panelText) {
      gsap.fromTo(panelText,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-office-text",
            trigger: panel || section,
            start: "top 78%",
            once: true
          }
        }
      );
    }

    if (officeCard) {
      gsap.fromTo(officeCard,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-office-card",
            trigger: panel || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (officeRows.length) {
      gsap.fromTo(officeRows,
        { x: -16, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            id: "apj-contact-office-rows",
            trigger: officeCard,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (officeIcons.length) {
      gsap.fromTo(officeIcons,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            id: "apj-contact-office-icons",
            trigger: officeCard,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (mapFrame) {
      gsap.fromTo(mapFrame,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-map-frame",
            trigger: mapFrame,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (mapIframe) {
      gsap.fromTo(mapIframe,
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-map-iframe",
            trigger: mapFrame,
            start: "top 85%",
            once: true
          }
        }
      );

      mapIframe.addEventListener("load", function () {
        debounceRefresh();
      });
    }
  }

  /**
   * 11D. Frequently Asked Questions (Accordion)
   */
  function initApjContactFaq(conditions) {
    var section = document.querySelector("[data-apj-contact-faq-section]") || document.querySelector("#contact-faq");
    if (!section) return;

    var marker = section.querySelector(".apj-contact__eyebrow-bar");
    var titleInners = section.querySelectorAll(".apj-contact__title-inner");
    var introText = section.querySelector(".apj-contact__section-intro");
    var faqCta = section.querySelector(".apj-contact__faq-cta");
    var faqList = section.querySelector("#apj-contact-faq");
    var faqItems = section.querySelectorAll(".apj-contact__faq-item");

    if (conditions.reducedMotion) {
      if (marker) gsap.set(marker, { scaleX: 1 });
      if (titleInners.length) gsap.set(titleInners, { yPercent: 0 });
      if (introText) gsap.set(introText, { opacity: 1, y: 0 });
      if (faqCta) gsap.set(faqCta, { opacity: 1, y: 0, scale: 1 });
      if (faqItems.length) gsap.set(faqItems, { opacity: 1, y: 0 });
      return;
    }

    if (marker) {
      gsap.fromTo(marker,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-contact-faq-marker",
            trigger: section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (titleInners.length) {
      gsap.fromTo(titleInners,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            id: "apj-contact-faq-title",
            trigger: section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    if (introText) {
      gsap.fromTo(introText,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-faq-intro",
            trigger: section,
            start: "top 78%",
            once: true
          }
        }
      );
    }

    if (faqCta) {
      gsap.fromTo(faqCta,
        { y: 24, scale: 0.94, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-faq-cta",
            trigger: section,
            start: "top 75%",
            once: true
          }
        }
      );
    }

    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-contact-faq-items",
            trigger: faqList || section,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (faqList && !conditions.reducedMotion) {
      if (faqList.getAttribute("data-apj-faq-bound") !== "true") {
        faqList.setAttribute("data-apj-faq-bound", "true");

        faqList.addEventListener("show.bs.collapse", function (e) {
          var collapseEl = e.target;
          var item = collapseEl.closest(".apj-contact__faq-item");
          if (!item) return;
          var icon = item.querySelector(".apj-contact__faq-icon");
          if (icon) {
            gsap.to(icon, { rotation: 45, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          }
        });

        faqList.addEventListener("shown.bs.collapse", function (e) {
          var collapseEl = e.target;
          var body = collapseEl.querySelector(".apj-contact__faq-body");
          if (body) {
            gsap.fromTo(body,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" }
            );
          }
          debounceRefresh();
        });

        faqList.addEventListener("hide.bs.collapse", function (e) {
          var collapseEl = e.target;
          var item = collapseEl.closest(".apj-contact__faq-item");
          if (!item) return;
          var icon = item.querySelector(".apj-contact__faq-icon");
          if (icon) {
            gsap.to(icon, { rotation: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
          }
        });

        faqList.addEventListener("hidden.bs.collapse", function () {
          debounceRefresh();
        });
      }
    }
  }

  /**
   * ==========================================================================
   * INDUSTRY PAGES INTERACTIVE ENGINE (apj-ind)
   * ==========================================================================
   */

  /**
   * 1. INDUSTRIES MENU DROPDOWN (keyboard & click behavior)
   */
  function initApjIndMenu() {
    var triggers = document.querySelectorAll("[data-apj-menu-trigger]");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      var dropdown = trigger.closest(".site-header__dropdown");
      if (!dropdown) return;
      var menu = dropdown.querySelector(".site-header__dropdown-menu");
      if (!menu) return;
      var items = menu.querySelectorAll("a");

      function openMenu() {
        trigger.setAttribute("aria-expanded", "true");
        menu.style.visibility = "visible";
        menu.style.opacity = "1";
        menu.style.transform = "translateX(-50%) translateY(0)";
      }

      function closeMenu() {
        trigger.setAttribute("aria-expanded", "false");
        menu.style.visibility = "";
        menu.style.opacity = "";
        menu.style.transform = "";
      }

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        if (expanded) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          openMenu();
          if (items.length) items[0].focus();
        } else if (e.key === "Escape") {
          closeMenu();
        }
      });

      menu.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeMenu();
          trigger.focus();
        }
      });

      document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
          closeMenu();
        }
      });
    });
  }

  /**
   * 2. INDUSTRY HERO VISUAL (#ind-visual)
   */
  function initApjIndVisual(conditions) {
    var section = document.querySelector("#ind-visual") || document.querySelector("[data-apj-ind-visual]");
    if (!section) return;

    var visual = section.querySelector(".apj-ind-visual");
    if (!visual) return;

    var img = visual.querySelector(".apj-ind-visual__img");
    var chip = visual.querySelector(".apj-ind-visual__chip");

    if (conditions.reducedMotion) {
      gsap.set(visual, { clipPath: "inset(0 round 28px)" });
      if (img) gsap.set(img, { scale: 1, yPercent: 0 });
      if (chip) gsap.set(chip, { opacity: 1, y: 0 });
      return;
    }

    // Visual entrance
    gsap.fromTo(visual,
      { clipPath: "inset(0 0 100% 0 round 28px)" },
      {
        clipPath: "inset(0 round 28px)",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: {
          id: "apj-ind-visual",
          trigger: visual,
          start: "top 85%",
          once: true
        }
      }
    );

    if (img) {
      gsap.fromTo(img,
        { scale: 1.25 },
        {
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-visual-scale",
            trigger: visual,
            start: "top 85%",
            once: true
          }
        }
      );

      // Desktop scrub parallax
      if (conditions.desktop) {
        gsap.fromTo(img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              id: "apj-ind-visual-parallax",
              trigger: visual,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
    }

    if (chip) {
      gsap.fromTo(chip,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.6,
          scrollTrigger: {
            id: "apj-ind-visual-chip",
            trigger: visual,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }

  /**
   * 3. INDUSTRY OVERVIEW (#ind-overview)
   */
  function initApjIndOverview(conditions) {
    var section = document.querySelector("#ind-overview") || document.querySelector("[data-apj-ind-overview]");
    if (!section) return;

    var bar = section.querySelector(".apj-ind__eyebrow-bar");
    var h2 = section.querySelector(".apj-ind-overview__title");
    var lead = section.querySelector(".apj-ind__lead");
    var bodyText = section.querySelector(".apj-ind__body-text");
    var divider = section.querySelector(".apj-ind-overview__divider");

    if (conditions.reducedMotion) {
      if (bar) gsap.set(bar, { scaleX: 1 });
      if (h2) gsap.set(h2, { opacity: 1, y: 0 });
      if (lead) gsap.set(lead, { opacity: 1 });
      if (bodyText) gsap.set(bodyText, { opacity: 1, y: 0 });
      if (divider) gsap.set(divider, { scaleY: 1 });
      return;
    }

    if (bar) {
      gsap.fromTo(bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-overview-bar",
            trigger: bar,
            start: "top 90%",
            once: true
          }
        }
      );
    }

    if (h2) {
      gsap.fromTo(h2,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-overview-h2",
            trigger: h2,
            start: "top 88%",
            once: true
          }
        }
      );
    }

    if (lead) {
      var words = splitWords(lead);
      gsap.fromTo(words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            id: "apj-ind-lead",
            trigger: lead,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.6
          }
        }
      );
    }

    if (bodyText) {
      gsap.fromTo(bodyText,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-ind-overview-text",
            trigger: bodyText,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (divider && conditions.desktop) {
      gsap.fromTo(divider,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-overview-divider",
            trigger: divider,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }

  /**
   * 4. ENGINEERING SOLUTIONS (#ind-solutions)
   */
  function initApjIndSolutions(conditions) {
    var section = document.querySelector("#ind-solutions") || document.querySelector("[data-apj-ind-solutions]");
    if (!section) return;

    var cards = section.querySelectorAll(".apj-ind__card");
    if (!cards.length) return;

    if (conditions.reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, clipPath: "none" });
      return;
    }

    // Batch reveal
    ScrollTrigger.batch(cards, {
      id: "apj-ind-solutions-batch",
      start: "top 88%",
      once: true,
      interval: 0.1,
      batchMax: 3,
      onEnter: function (batch) {
        batch.forEach(function (card) {
          var num = card.querySelector(".apj-ind__card-num");
          var icon = card.querySelector(".apj-ind__card-icon");
          var title = card.querySelector(".apj-ind__card-title");
          var desc = card.querySelector(".apj-ind__card-desc");
          var foot = card.querySelector(".apj-ind__card-foot");

          var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(card,
            { y: 60, opacity: 0, clipPath: "inset(8% 0 0 0 round 24px)" },
            { y: 0, opacity: 1, clipPath: "inset(0 round 24px)", duration: 0.9 },
            0
          );

          if (num) {
            tl.fromTo(num, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.1);
          }

          if (icon) {
            tl.fromTo(icon, { scale: 0.5, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" }, 0.15);
          }

          if (title) {
            tl.fromTo(title, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2);
          }

          if (desc) {
            tl.fromTo(desc, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.25);
          }

          if (foot) {
            tl.fromTo(foot, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.3);
          }
        });
      }
    });

    // Scroll depth for columns on desktop (>= 992px)
    if (conditions.desktop && cards.length >= 3) {
      cards.forEach(function (card, index) {
        var col = index % 3;
        var yShift = (col === 1) ? -2.5 : 2.5;
        gsap.fromTo(card,
          { yPercent: -yShift },
          {
            yPercent: yShift,
            ease: "none",
            scrollTrigger: {
              id: "apj-ind-solutions-depth-" + index,
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      });
    }

    // In-view activation for touch / mobile / no-hover
    if (conditions.mobile || !conditions.pointerFine) {
      cards.forEach(function (card, index) {
        ScrollTrigger.create({
          id: "apj-ind-solutions-inview-" + index,
          trigger: card,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "apj-ind__card--inview"
        });
      });
    }

    // Pointer spotlight tracking
    if (conditions.pointerFine) {
      cards.forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mouse-x", x + "%");
          card.style.setProperty("--mouse-y", y + "%");
        });
      });
    }
  }

  /**
   * 5. KEY PRIORITIES (#ind-priorities)
   */
  function initApjIndPriorities(conditions) {
    var section = document.querySelector("#ind-priorities") || document.querySelector("[data-apj-ind-priorities]");
    if (!section) return;

    var band = section.querySelector(".apj-ind-priorities__band");
    var pattern = section.querySelector(".apj-ind-priorities__pattern");
    var title = section.querySelector(".apj-ind-priorities__title");
    var rows = section.querySelectorAll(".apj-ind-priorities__row");

    if (conditions.reducedMotion) {
      if (band) gsap.set(band, { clipPath: "inset(0 round 32px)" });
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (rows.length) {
        rows.forEach(function (r) {
          gsap.set(r, { opacity: 1, y: 0 });
          var line = r.querySelector(".apj-ind-priorities__row-line");
          if (line) gsap.set(line, { scaleX: 1 });
        });
      }
      return;
    }

    // Band entrance
    if (band) {
      gsap.fromTo(band,
        { clipPath: "inset(100% 0 0 0 round 32px)" },
        {
          clipPath: "inset(0 round 32px)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-priorities-band",
            trigger: band,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    if (title) {
      gsap.fromTo(title,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            id: "apj-ind-priorities-title",
            trigger: band || title,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // Rows entrance
    if (rows.length) {
      rows.forEach(function (row, idx) {
        var line = row.querySelector(".apj-ind-priorities__row-line");
        var num = row.querySelector(".apj-ind-priorities__num");
        var text = row.querySelector(".apj-ind-priorities__text");

        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: {
                id: "apj-ind-priorities-line-" + idx,
                trigger: row,
                start: "top 88%",
                once: true
              }
            }
          );
        }

        gsap.fromTo([num, text],
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              id: "apj-ind-priorities-item-" + idx,
              trigger: row,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      // Desktop scrubbed focus highlighting
      if (conditions.desktop) {
        rows.forEach(function (row) {
          gsap.set(row, { opacity: 0.45 });
        });

        ScrollTrigger.create({
          id: "apj-ind-priorities-focus",
          trigger: section.querySelector(".apj-ind-priorities__list") || band,
          start: "top 65%",
          end: "bottom 45%",
          scrub: 0.5,
          onUpdate: function (self) {
            var progress = self.progress;
            var activeIdx = Math.min(Math.floor(progress * rows.length), rows.length - 1);
            rows.forEach(function (row, idx) {
              if (idx === activeIdx) {
                row.classList.add("apj-ind-priorities__row--on");
                gsap.to(row, { opacity: 1, duration: 0.25, overwrite: "auto" });
              } else {
                row.classList.remove("apj-ind-priorities__row--on");
                gsap.to(row, { opacity: 0.45, duration: 0.25, overwrite: "auto" });
              }
            });
          }
        });
      } else {
        // Touch/mobile per-row toggleClass
        rows.forEach(function (row, idx) {
          ScrollTrigger.create({
            id: "apj-ind-priorities-touch-" + idx,
            trigger: row,
            start: "top 70%",
            end: "bottom 40%",
            toggleClass: "apj-ind-priorities__row--on"
          });
        });
      }
    }

    // Pattern drift on desktop
    if (pattern && conditions.desktop) {
      gsap.fromTo(pattern,
        { xPercent: -3 },
        {
          xPercent: 3,
          ease: "none",
          scrollTrigger: {
            id: "apj-ind-priorities-pattern",
            trigger: band,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }
  }

  /**
   * 6. WHY APARAJITA (#ind-why)
   */
  function initApjIndWhy(conditions) {
    var section = document.querySelector("#ind-why") || document.querySelector("[data-apj-ind-why]");
    if (!section) return;

    var statement = section.querySelector(".apj-ind-why__statement");
    var serviceItems = section.querySelectorAll(".apj-ind-why__service-item");
    var dividers = section.querySelectorAll(".apj-ind-why__stat-divider");
    var statNums = section.querySelectorAll(".apj-ind-why__stat-num");

    if (conditions.reducedMotion) {
      if (statement) gsap.set(statement, { opacity: 1 });
      if (serviceItems.length) gsap.set(serviceItems, { opacity: 1, x: 0 });
      if (dividers.length) gsap.set(dividers, { scaleY: 1 });
      return;
    }

    // Statement word scrub
    if (statement) {
      var words = splitWords(statement);
      gsap.fromTo(words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            id: "apj-ind-why-statement",
            trigger: statement,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.6
          }
        }
      );
    }

    // Related services list
    if (serviceItems.length) {
      gsap.fromTo(serviceItems,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-ind-why-services",
            trigger: section.querySelector(".apj-ind-why__card") || section,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // Vertical stat dividers
    if (dividers.length && conditions.desktop) {
      gsap.fromTo(dividers,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            id: "apj-ind-why-dividers",
            trigger: section.querySelector(".apj-ind-why__stats") || section,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    // Animate stats counter once
    if (statNums.length) {
      statNums.forEach(function (el, idx) {
        var countSpan = el.querySelector("[data-counter]");
        if (!countSpan) return;
        var targetVal = parseInt(countSpan.getAttribute("data-counter") || countSpan.textContent, 10);
        var startVal = parseInt(countSpan.getAttribute("data-apj-count-from") || "0", 10);
        if (isNaN(targetVal)) return;

        ScrollTrigger.create({
          id: "apj-ind-why-counter-" + idx,
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: function () {
            var counterObj = { val: startVal };
            gsap.to(counterObj, {
              val: targetVal,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                countSpan.textContent = Math.floor(counterObj.val);
              }
            });
          }
        });
      });
    }
  }

  /**
   * 7. FEATURED PROJECTS TEASER (#ind-projects)
   */
  function initApjIndProjects(conditions) {
    var section = document.querySelector("#ind-projects") || document.querySelector("[data-apj-ind-projects]");
    if (!section) return;

    var cards = section.querySelectorAll(".apj-ind-projcard");
    if (!cards.length) return;

    if (conditions.reducedMotion) {
      cards.forEach(function (card) {
        var media = card.querySelector(".apj-ind-projcard__media");
        var img = card.querySelector(".apj-ind-projcard__img");
        if (media) gsap.set(media, { clipPath: "inset(0)" });
        if (img) gsap.set(img, { scale: 1 });
        gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    ScrollTrigger.batch(cards, {
      id: "apj-ind-projects-batch",
      start: "top 85%",
      once: true,
      interval: 0.12,
      onEnter: function (batch) {
        batch.forEach(function (card) {
          var media = card.querySelector(".apj-ind-projcard__media");
          var img = card.querySelector(".apj-ind-projcard__img");
          var body = card.querySelector(".apj-ind-projcard__body");

          var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0);

          if (media) {
            tl.fromTo(media,
              { clipPath: "inset(100% 0 0 0)" },
              { clipPath: "inset(0)", duration: 1.2, ease: "expo.out" },
              0
            );
          }

          if (img) {
            tl.fromTo(img,
              { scale: 1.3 },
              { scale: 1, duration: 1.2, ease: "expo.out" },
              0
            );
          }

          if (body) {
            tl.fromTo(body,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.7 },
              0.3
            );
          }
        });
      }
    });
  }

  /**
   * 8. PREVIOUS / NEXT INDUSTRY NAV (#ind-nav)
   */
  function initApjIndNav(conditions) {
    var section = document.querySelector("#ind-nav") || document.querySelector("[data-apj-ind-nav]");
    if (!section) return;

    var prevCard = section.querySelector(".apj-ind-nav__card--prev");
    var nextCard = section.querySelector(".apj-ind-nav__card--next");

    if (conditions.reducedMotion) {
      if (prevCard) gsap.set(prevCard, { opacity: 1, x: 0 });
      if (nextCard) gsap.set(nextCard, { opacity: 1, x: 0 });
      return;
    }

    if (prevCard) {
      gsap.fromTo(prevCard,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-ind-nav-prev",
            trigger: prevCard,
            start: "top 88%",
            once: true
          }
        }
      );
    }

    if (nextCard) {
      gsap.fromTo(nextCard,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-ind-nav-next",
            trigger: nextCard,
            start: "top 88%",
            once: true
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
      initApjIntro(conds);
      initApjSvcList(conds);
      initApjSvcVisual(conds);
      initApjSvcAccordion(conds);
      initApjSvcRail(conds);
      initApjSvcApps(conds);
      initApjSvcNav(conds);
      initApjProjList(conds);
      initApjCta(conds);
      initApjContact(conds);

      // Industry Engine
      initApjIndMenu();
      initApjIndVisual(conds);
      initApjIndOverview(conds);
      initApjIndSolutions(conds);
      initApjIndPriorities(conds);
      initApjIndWhy(conds);
      initApjIndProjects(conds);
      initApjIndNav(conds);
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
