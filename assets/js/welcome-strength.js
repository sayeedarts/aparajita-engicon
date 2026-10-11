(function () {
  "use strict";

  // Guard: Ensure GSAP and ScrollTrigger are available
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    console.warn("Welcome & Strength: GSAP or ScrollTrigger missing, initialization skipped.");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  document.addEventListener("DOMContentLoaded", function () {
    initWelcome();
    initApjStrength();
    initApjIndustries();

    // Refresh ScrollTrigger after fonts/page load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (window.lenis) window.lenis.resize();
        ScrollTrigger.refresh();
      });
    }

    window.addEventListener("load", function () {
      if (window.lenis) window.lenis.resize();
      ScrollTrigger.refresh();
    });
  });

  /* ==========================================================================
     1. WELCOME SECTION (wlc)
     ========================================================================== */
  function initWelcome() {
    var root = document.querySelector("[data-wlc]");
    if (!root) return;

    root.classList.add("wlc--js");

    var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isDesktop = window.matchMedia("(min-width: 992px)").matches;

    var bg = root.querySelector(".wlc__bg");
    var blobA = root.querySelector(".wlc__blob--a");
    var blobB = root.querySelector(".wlc__blob--b");
    var blobC = root.querySelector(".wlc__blob--c");
    var flutes = root.querySelector(".wlc__flutes");
    var eyebrow = root.querySelector(".wlc__eyebrow");
    var boltIcon = eyebrow ? eyebrow.querySelector("i") : null;
    var lineInners = Array.from(root.querySelectorAll(".wlc__line-inner"));
    var para = root.querySelector("[data-wlc-para]");
    var statsList = root.querySelector("[data-wlc-stats]");
    var statItems = Array.from(root.querySelectorAll(".wlc__stat"));
    var statNums = Array.from(root.querySelectorAll("[data-wlc-count]"));

    // If reduced motion, set final state immediately
    if (isReducedMotion) {
      if (para) para.classList.add("wlc__para--active");
      statNums.forEach(function (el) {
        var toVal = el.getAttribute("data-to") || "0";
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = toVal + suffix;
      });
      return;
    }

    // --- A. Word Splitting for Scroll-Scrubbed Text Reveal ---
    var words = [];
    if (para) {
      var rawText = para.textContent.trim();
      var rawWords = rawText.split(/\s+/);
      para.innerHTML = "";

      // List of keywords to highlight in brand yellow when revealed
      var highlightWords = ["1990", "1990,", "PAN", "India", "PAN India", "three", "decades", "three decades"];

      rawWords.forEach(function (w, i) {
        var span = document.createElement("span");
        span.className = "wlc__word";
        var cleanWord = w.replace(/[^a-zA-Z0-9]/g, "");
        if (highlightWords.indexOf(cleanWord) !== -1 || highlightWords.indexOf(w) !== -1) {
          span.classList.add("wlc__mark");
        }
        span.textContent = w;
        para.appendChild(span);

        if (i < rawWords.length - 1) {
          para.appendChild(document.createTextNode(" "));
        }
        words.push(span);
      });
    }

    // --- B. Entrance Timeline (Header & Intro) ---
    var inTl = gsap.timeline({
      id: "wlc-in",
      scrollTrigger: {
        trigger: root,
        start: "top 70%",
        once: true
      },
      defaults: { ease: "power3.out" }
    });

    if (bg) {
      inTl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
    }

    var blobs = [blobA, blobB, blobC].filter(Boolean);
    if (blobs.length) {
      inTl.fromTo(blobs, 
        { scale: 0.7, opacity: 0 }, 
        { scale: 1, opacity: 0.9, duration: 1.6, stagger: 0.15, ease: "power2.out" }, 
        0
      );
    }

    if (eyebrow) {
      inTl.fromTo(eyebrow, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.15);
      if (boltIcon) {
        inTl.fromTo(boltIcon, { rotate: -25, scale: 0.6 }, { rotate: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }, 0.15);
      }
    }

    if (lineInners.length) {
      inTl.fromTo(lineInners, 
        { yPercent: 112 }, 
        { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 
        0.25
      );
    }

    if (statItems.length) {
      inTl.fromTo(statItems, 
        { "--wlc-divider-scale": 0 }, 
        { "--wlc-divider-scale": 1, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 
        0.6
      );
      var statIndexes = Array.from(root.querySelectorAll(".wlc__stat-index"));
      if (statIndexes.length) {
        inTl.fromTo(statIndexes, 
          { y: 10, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, 
          0.7
        );
      }
    }

    // --- C. Scrubbed Paragraph Text Reveal ---
    if (words.length && para) {
      var endRange = isDesktop ? "bottom 48%" : "bottom 60%";
      var paraTl = gsap.timeline({
        id: "wlc-para",
        scrollTrigger: {
          trigger: para,
          start: "top 82%",
          end: endRange,
          scrub: 0.6
        }
      });

      paraTl.fromTo(words, 
        { opacity: 0.16, y: 4 }, 
        { opacity: 1, y: 0, stagger: 0.12, ease: "none" }
      );
    }

    // --- D. Stats Count-Up Animation ---
    if (statsList && statNums.length) {
      ScrollTrigger.create({
        id: "wlc-stats",
        trigger: statsList,
        start: "top 85%",
        once: true,
        onEnter: function () {
          statNums.forEach(function (el, i) {
            var fromVal = parseFloat(el.getAttribute("data-from") || "0");
            var toVal = parseFloat(el.getAttribute("data-to") || "0");
            var suffix = el.getAttribute("data-suffix") || "";
            var parentStat = el.closest(".wlc__stat");
            var label = parentStat ? parentStat.querySelector(".wlc__stat-label") : null;

            // Animate parent item entry
            if (parentStat) {
              gsap.fromTo(parentStat, 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.9, delay: i * 0.15, ease: "power3.out" }
              );
            }

            // Count up number animation
            var obj = { val: fromVal };
            gsap.to(obj, {
              val: toVal,
              duration: 1.8,
              delay: i * 0.15,
              ease: "power2.out",
              onUpdate: function () {
                var current = Math.round(obj.val);
                el.textContent = current + suffix;
              },
              onComplete: function () {
                el.textContent = toVal + suffix;
                // Soft color flash on complete
                gsap.fromTo(el, { color: "var(--wlc-brand)" }, { color: "var(--wlc-on-bg)", duration: 0.6 });
              }
            });

            // Animate label
            if (label) {
              gsap.fromTo(label, 
                { y: 12, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, delay: i * 0.15 + 0.3, ease: "power2.out" }
              );
            }
          });
        }
      });
    }

    // --- E. Parallax & Idle Drift (Desktop Only) ---
    if (isDesktop) {
      var parallaxTl = gsap.timeline({
        id: "wlc-parallax",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      if (blobA) parallaxTl.to(blobA, { yPercent: -28, xPercent: 6 }, 0);
      if (blobB) parallaxTl.to(blobB, { yPercent: 20 }, 0);
      if (blobC) parallaxTl.to(blobC, { yPercent: -15, scale: 1.15 }, 0);
      if (flutes) parallaxTl.to(flutes, { xPercent: 1.5 }, 0);

      // Pointer follow glow for blobA
      if (blobA && window.matchMedia("(pointer: fine)").matches) {
        var xTo = gsap.quickTo(blobA, "x", { duration: 1.4, ease: "power3.out" });
        var yTo = gsap.quickTo(blobA, "y", { duration: 1.4, ease: "power3.out" });

        root.addEventListener("pointermove", function (e) {
          var rect = root.getBoundingClientRect();
          var relX = e.clientX - rect.left - rect.width / 2;
          var relY = e.clientY - rect.top - rect.height / 2;
          var clampMax = rect.width * 0.15;
          relX = Math.max(-clampMax, Math.min(clampMax, relX));
          relY = Math.max(-clampMax, Math.min(clampMax, relY));
          xTo(relX);
          yTo(relY);
        });
      }
    }
  }

  /* ==========================================================================
     2. OUR STRENGTH REVAMP (apj-strength)
     ========================================================================== */
  function initApjStrength() {
    var root = document.querySelector("[data-apj-strength]");
    if (!root) return;

    root.classList.add("apj-strength--js");

    var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isDesktop = window.matchMedia("(min-width: 992px)").matches;

    var wash = root.querySelector(".apj-strength__wash");
    var head = root.querySelector(".apj-strength__head");
    var marker = head ? head.querySelector(".apj-strength__marker") : null;
    var eyebrow = head ? head.querySelector(".apj-strength__eyebrow") : null;
    var lineInners = Array.from(root.querySelectorAll(".apj-strength__line-inner"));
    var em = root.querySelector(".apj-strength__em");
    var emLine = root.querySelector(".apj-strength__em-line");
    var grid = root.querySelector("[data-apj-grid]");
    var cards = Array.from(root.querySelectorAll("[data-apj-card]"));

    // Prepare SVG icons for line draw animation
    cards.forEach(function (card) {
      var svgShapes = Array.from(card.querySelectorAll("svg path, svg circle, svg rect, svg line, svg polyline"));
      svgShapes.forEach(function (shape) {
        shape.setAttribute("pathLength", "1");
        gsap.set(shape, { strokeDasharray: 1, strokeDashoffset: 1 });
      });
    });

    if (isReducedMotion) {
      if (em) em.classList.add("is-lit");
      if (emLine) gsap.set(emLine, { scaleX: 1 });
      cards.forEach(function (card) {
        var svgShapes = Array.from(card.querySelectorAll("svg path, svg circle, svg rect, svg line, svg polyline"));
        gsap.set(svgShapes, { strokeDashoffset: 0 });
        var countEl = card.querySelector("[data-apj-count]");
        if (countEl) {
          var toVal = countEl.getAttribute("data-to") || "30";
          var suffix = countEl.getAttribute("data-suffix") || "+";
          countEl.textContent = toVal + suffix;
        }
      });
      return;
    }

    // --- A. Wash Background Atmosphere ---
    if (wash) {
      gsap.fromTo(wash, 
        { opacity: 0 }, 
        { 
          opacity: 1, 
          duration: 1.4, 
          ease: "power2.out", 
          scrollTrigger: {
            id: "apj-strength-wash-in",
            trigger: root,
            start: "top 80%",
            once: true
          }
        }
      );

      if (isDesktop) {
        gsap.to(wash, {
          yPercent: -10,
          xPercent: -4,
          scrollTrigger: {
            id: "apj-strength-wash",
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    }

    // --- B. Header Entrance Animation ---
    if (head) {
      var headTl = gsap.timeline({
        id: "apj-strength-head",
        scrollTrigger: {
          trigger: head,
          start: "top 85%",
          once: true
        },
        defaults: { ease: "power3.out" }
      });

      if (marker) {
        headTl.fromTo(marker, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.out" }, 0);
      }

      if (eyebrow) {
        headTl.fromTo(eyebrow, { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, 0.1);
      }

      if (lineInners.length) {
        headTl.fromTo(lineInners, 
          { yPercent: 112 }, 
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 
          0.2
        );
      }

      if (em) {
        headTl.add(function () {
          em.classList.add("is-lit");
        }, 0.85);
      }

      if (emLine) {
        headTl.fromTo(emLine, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.85);
      }
    }

    // --- C. Card Batched Scroll Entrance & SVG Line Draw ---
    if (cards.length) {
      ScrollTrigger.batch(cards, {
        id: "apj-strength-card-batch",
        start: "top 88%",
        once: true,
        interval: 0.1,
        batchMax: isDesktop ? 3 : 2,
        onEnter: function (batch) {
          batch.forEach(function (card, i) {
            var ruleEl = card.querySelector(".apj-strength__rule");
            var iconBox = card.querySelector(".apj-strength__icon");
            var svgShapes = Array.from(card.querySelectorAll("svg path, svg circle, svg rect, svg line, svg polyline"));
            var titleEl = card.querySelector(".apj-strength__card-title");
            var countEl = card.querySelector("[data-apj-count]");
            var textEl = card.querySelector(".apj-strength__text");

            var cardTl = gsap.timeline({
              defaults: { ease: "power3.out" }
            });

            var startOffset = i * 0.12;

            cardTl.fromTo(card, 
              { y: 56, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.9 }, 
              startOffset
            );

            if (ruleEl) {
              cardTl.fromTo(ruleEl, 
                { scaleX: 0 }, 
                { scaleX: 1, duration: 1.0, ease: "expo.out" }, 
                startOffset + 0.1
              );
            }

            if (iconBox) {
              cardTl.fromTo(iconBox, 
                { scale: 0.7, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 
                startOffset + 0.15
              );
            }

            if (svgShapes.length) {
              cardTl.to(svgShapes, 
                { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.04 }, 
                startOffset + 0.2
              );
            }

            if (titleEl) {
              cardTl.fromTo(titleEl, 
                { y: 18, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.7 }, 
                startOffset + 0.3
              );
            }

            if (textEl) {
              cardTl.fromTo(textEl, 
                { y: 14, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.7 }, 
                startOffset + 0.42
              );
            }

            // Count-up for Card 1 ("30+")
            if (countEl) {
              var toVal = parseFloat(countEl.getAttribute("data-to") || "30");
              var suffix = countEl.getAttribute("data-suffix") || "+";
              var countObj = { val: 0 };

              cardTl.to(countObj, {
                val: toVal,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: function () {
                  countEl.textContent = Math.round(countObj.val) + suffix;
                },
                onComplete: function () {
                  countEl.textContent = toVal + suffix;
                }
              }, startOffset + 0.3);
            }
          });
        }
      });
    }

    // --- D. In-View Activation & Touch Active Follow ---
    cards.forEach(function (card, idx) {
      ScrollTrigger.create({
        id: "apj-strength-active-" + (idx + 1),
        trigger: card,
        start: "top 60%",
        end: "bottom 40%",
        toggleClass: { targets: card, className: "apj-strength__card--inview" }
      });

      // Hover Interaction for Fine Pointer Desktop
      if (window.matchMedia("(pointer: fine)").matches) {
        var svgShapes = Array.from(card.querySelectorAll("svg path, svg circle, svg rect, svg line, svg polyline"));
        
        card.addEventListener("pointerenter", function () {
          var cardBody = card.querySelector(".apj-strength__body");
          if (cardBody) {
            gsap.to(cardBody, { y: -4, duration: 0.4, ease: "power2.out" });
          }
          if (svgShapes.length) {
            gsap.fromTo(svgShapes, 
              { strokeDashoffset: 1 }, 
              { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", overwrite: "auto" }
            );
          }
        });

        card.addEventListener("pointerleave", function () {
          var cardBody = card.querySelector(".apj-strength__body");
          if (cardBody) {
            gsap.to(cardBody, { y: 0, duration: 0.4, ease: "power2.out" });
          }
        });
      }
    });

    // --- E. Desktop Scrubbed Icon Depth ---
    if (isDesktop && cards.length) {
      cards.forEach(function (card, idx) {
        var iconBox = card.querySelector(".apj-strength__icon");
        if (iconBox) {
          var col = idx % 3;
          var startY = col === 1 ? -8 : 10;
          var endY = col === 1 ? 8 : -10;

          gsap.fromTo(iconBox, 
            { y: startY }, 
            {
              y: endY,
              scrollTrigger: {
                id: "apj-strength-depth-" + (idx + 1),
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
              }
            }
          );
        }
      });
    }
  }

  /* ==========================================================================
     3. INDUSTRIES WE SERVE (apj-industries)
     ========================================================================== */
  function initApjIndustries() {
    var root = document.querySelector("[data-apj-industries]");
    if (!root) return;

    root.classList.add("apj-industries--js");

    var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var glow = root.querySelector(".apj-industries__glow");
    var blueprint = root.querySelector(".apj-industries__blueprint");
    var dotsFar = root.querySelector(".apj-industries__dots--far");
    var dotsNear = root.querySelector(".apj-industries__dots--near");
    var scan = root.querySelector(".apj-industries__scan");
    var head = root.querySelector(".apj-industries__head");
    var eyebrow = head ? head.querySelector(".apj-industries__eyebrow") : null;
    var eyebrowDot = eyebrow ? eyebrow.querySelector(".apj-industries__eyebrow-dot") : null;
    var lineInners = Array.from(root.querySelectorAll(".apj-industries__line-inner"));
    var em = root.querySelector(".apj-industries__em");
    var emLine = root.querySelector(".apj-industries__em-line");
    var intro = root.querySelector(".apj-industries__intro");
    var panel = root.querySelector(".apj-industries__panel");
    var items = Array.from(root.querySelectorAll("[data-apj-item]"));
    var innerContainer = root.querySelector(".apj-industries__inner");

    if (isReducedMotion) {
      if (em) em.classList.add("is-lit");
      if (emLine) gsap.set(emLine, { scaleX: 1 });
      return;
    }

    // --- A. Background Entrance ---
    var bgTl = gsap.timeline({
      id: "apj-industries-bg",
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        once: true
      },
      defaults: { ease: "power3.out" }
    });

    if (glow) {
      bgTl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0);
    }

    if (blueprint) {
      bgTl.fromTo(blueprint, { opacity: 0 }, { opacity: 0.5, duration: 1.6 }, 0);
    }

    if (dotsFar) {
      bgTl.fromTo(dotsFar,
        { clipPath: "inset(0% 0% 0% 100%)", webkitClipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", webkitClipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.out" },
        0
      );
    }

    if (dotsNear) {
      bgTl.fromTo(dotsNear,
        { clipPath: "inset(0% 0% 0% 100%)", webkitClipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", webkitClipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.out" },
        0.2
      );
    }

    // --- B. Head Timeline ---
    var headTl = gsap.timeline({
      id: "apj-industries-head",
      scrollTrigger: {
        trigger: head || root,
        start: "top 85%",
        once: true
      },
      defaults: { ease: "power3.out" }
    });

    if (eyebrow) {
      headTl.fromTo(eyebrow,
        { clipPath: "inset(0% 100% 0% 0% round 999px)", webkitClipPath: "inset(0% 100% 0% 0% round 999px)" },
        { clipPath: "inset(0% 0% 0% 0% round 999px)", webkitClipPath: "inset(0% 0% 0% 0% round 999px)", duration: 0.9, ease: "expo.out" },
        0
      );

      if (eyebrowDot) {
        headTl.fromTo(eyebrowDot,
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "back.out(3)" },
          0.15
        );
        headTl.to(eyebrowDot, {
          keyframes: [
            { scale: 1.5, duration: 0.4, ease: "power2.out" },
            { scale: 1, duration: 0.4, ease: "power2.in" }
          ]
        }, 0.65);
      }

      var eyebrowSpan = eyebrow.querySelector("span:not(.apj-industries__eyebrow-dot)");
      if (eyebrowSpan) {
        headTl.fromTo(eyebrowSpan,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.6 },
          0.25
        );
      }
    }

    if (lineInners.length) {
      headTl.fromTo(lineInners,
        { yPercent: 112 },
        { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.12 },
        0.35
      );
    }

    if (em) {
      headTl.add(function () {
        em.classList.add("is-lit");
      }, 1.0);
    }

    if (emLine) {
      headTl.fromTo(emLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "expo.out" },
        1.0
      );
    }

    if (intro) {
      headTl.fromTo(intro,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        1.05
      );
    }



    // --- D. Panel & List Items Entrance ---
    if (panel) {
      gsap.fromTo(panel,
        { y: 60, scale: 0.97, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            id: "apj-industries-panel",
            trigger: panel,
            start: "top 86%",
            once: true
          }
        }
      );
    }

    if (items.length) {
      ScrollTrigger.batch(items, {
        id: "apj-industries-item-batch",
        start: "top 92%",
        once: true,
        interval: 0.1,
        batchMax: 4,
        onEnter: function (batch) {
          batch.forEach(function (item, idx) {
            var ruleEl = item.querySelector(".apj-industries__rule");
            var indexEl = item.querySelector(".apj-industries__index");
            var iconEl = item.querySelector(".apj-industries__icon");
            var nameEl = item.querySelector(".apj-industries__name");
            var itemTl = gsap.timeline({ defaults: { ease: "power3.out" } });

            var itemOffset = idx * 0.08;

            itemTl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5 }, itemOffset);

            if (ruleEl) {
              itemTl.fromTo(ruleEl, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out" }, itemOffset);
            }

            if (indexEl) {
              itemTl.fromTo(indexEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, itemOffset + 0.05);
            }

            if (iconEl) {
              itemTl.fromTo(iconEl, { scale: 0.4, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }, itemOffset + 0.10);
            }

            if (nameEl) {
              itemTl.fromTo(nameEl, { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, itemOffset + 0.18);
            }

            // First item ping animation
            if (items.indexOf(item) === 0 && iconEl) {
              gsap.fromTo(iconEl,
                { scale: 1 },
                {
                  keyframes: [
                    { scale: 1.25, duration: 0.45, ease: "power2.out" },
                    { scale: 1, duration: 0.45, ease: "power2.in" }
                  ],
                  delay: itemOffset + 0.3
                }
              );
            }
          });
        }
      });
    }

    // --- E. Responsive Contexts (Desktop Depth vs Mobile In-View) ---
    var mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", function () {
      if (dotsFar || dotsNear || glow || blueprint) {
        var depthTl = gsap.timeline({
          id: "apj-industries-depth",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });

        if (dotsFar) depthTl.to(dotsFar, { yPercent: -8 }, 0);
        if (dotsNear) depthTl.to(dotsNear, { yPercent: -16, xPercent: 2 }, 0);
        if (glow) depthTl.to(glow, { yPercent: -10 }, 0);
        if (blueprint) depthTl.to(blueprint, { xPercent: 3 }, 0);
      }

      if (scan) {
        gsap.fromTo(scan,
          { yPercent: -100 },
          {
            yPercent: 380,
            scrollTrigger: {
              id: "apj-industries-scan",
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }



      if (innerContainer) {
        gsap.to(innerContainer, {
          y: -24,
          opacity: 0.85,
          scrollTrigger: {
            id: "apj-industries-exit",
            trigger: root,
            start: "bottom 70%",
            end: "bottom 10%",
            scrub: 1
          }
        });
      }

      // Fine Pointer Hover Micro-Interactions
      if (window.matchMedia("(pointer: fine)").matches) {
        items.forEach(function (item) {
          var iconEl = item.querySelector(".apj-industries__icon");
          item.addEventListener("pointerenter", function () {
            if (iconEl) {
              gsap.to(iconEl, { rotate: 12, scale: 1.12, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }
          });
          item.addEventListener("pointerleave", function () {
            if (iconEl) {
              gsap.to(iconEl, { rotate: 0, scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }
          });
        });
      }
    });

    mm.add("(max-width: 991px), (hover: none)", function () {
      if (scan) {
        gsap.fromTo(scan,
          { yPercent: -100 },
          {
            yPercent: 380,
            duration: 2.4,
            ease: "power2.inOut",
            scrollTrigger: {
              id: "apj-industries-scan-mobile",
              trigger: root,
              start: "top 75%",
              once: true
            }
          }
        );
      }

      items.forEach(function (item, idx) {
        ScrollTrigger.create({
          id: "apj-industries-active-" + (idx + 1),
          trigger: item,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: { targets: item, className: "apj-industries__item--inview" }
        });
      });
    });
  }

})();
