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
    document.querySelector("[data-apj-phero]") !== null ||
    document.querySelector("[data-apj-projlist]") !== null;

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
