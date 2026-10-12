/**
 * Aparajita Engicon - Full-Screen Animated Menu Modal
 * File: assets/js/site-menu.js
 *
 * Implements accessible, responsive full-screen liquid SVG curtain menu
 * with drill-in submenus, internal scroll-reveals, and focus management.
 */
(function () {
  "use strict";

  var menu = document.getElementById("apj-menu");
  if (!menu) return;

  var docEl = document.documentElement;
  var body = document.body;
  var curtainPath = menu.querySelector(".apj-menu__curtain path");
  var scrollContainer = menu.querySelector(".apj-menu__scroll");
  var contactPanel = menu.querySelector(".apj-menu__panel--contact");
  var navPanel = menu.querySelector(".apj-menu__panel--nav");
  var mainNav = menu.querySelector(".apj-menu__main");
  var gridItems = menu.querySelectorAll(".apj-menu__item");
  var profileCard = menu.querySelector(".apj-menu__profile");
  var profileBtn = menu.querySelector(".apj-menu__profile-btn");
  var closeBtn = menu.querySelector(".apj-menu__close");
  var liveRegion = menu.querySelector("[data-apj-live]");

  // State
  var isOpen = false;
  var activeSub = null;
  var lastFocusedTrigger = null;
  var inertElements = [];
  var openTl = null;
  var subTl = null;
  var createdScrollTriggers = [];
  var currentConditions = {
    desktop: true,
    reducedMotion: false
  };

  /**
   * Determine matching current page and mark active items
   */
  function markCurrentPage() {
    var rawPath = window.location.pathname || "";
    var filename = rawPath.substring(rawPath.lastIndexOf("/") + 1).toLowerCase();
    if (!filename || filename === "" || filename === "/") {
      filename = "index.html";
    }

    var items = menu.querySelectorAll("[data-apj-item]");
    items.forEach(function (el) {
      var itemVal = (el.getAttribute("data-apj-item") || "").toLowerCase();
      var isMatch = false;

      if (itemVal === filename) {
        isMatch = true;
      } else if (filename === "index.html" && itemVal === "index.html") {
        isMatch = true;
      } else if (itemVal === "services" && (filename === "services.html" || filename.indexOf("-works.html") !== -1 || filename === "water-filtration-plants.html" || filename === "stp-plants.html")) {
        isMatch = true;
      } else if (itemVal === "industries" && (filename === "corporate-offices.html" || filename === "hospitals-healthcare.html" || filename === "hotels-hospitality.html" || filename === "industrial-facilities.html" || filename === "shopping-malls-retail.html" || filename === "commercial-complexes.html" || filename === "premium-residential.html" || filename === "banking-institutions.html" || filename === "villas-private-residences.html" || filename === "educational-institutions.html")) {
        isMatch = true;
      }

      if (isMatch) {
        if (el.classList.contains("apj-menu__item")) {
          el.classList.add("apj-menu__item--current");
          var titleEl = el.querySelector(".apj-menu__title");
          if (titleEl) titleEl.setAttribute("aria-current", "page");
        } else if (el.classList.contains("apj-menu__sub-link")) {
          el.setAttribute("aria-current", "page");
        }
      }
    });
  }

  /**
   * Make background inert while modal is open
   */
  function applyInert() {
    inertElements = [];
    var children = Array.from(body.children);
    children.forEach(function (child) {
      if (child !== menu && child.tagName !== "SCRIPT" && child.tagName !== "STYLE" && !child.hasAttribute("inert")) {
        child.setAttribute("inert", "");
        inertElements.push(child);
      }
    });
  }

  function removeInert() {
    inertElements.forEach(function (el) {
      el.removeAttribute("inert");
    });
    inertElements = [];
  }

  /**
   * Accessible announcement helper
   */
  function announce(msg) {
    if (!liveRegion) return;
    liveRegion.textContent = "";
    setTimeout(function () {
      liveRegion.textContent = msg;
    }, 50);
  }

  /**
   * Build Master Open Timeline
   */
  function buildOpenTimeline() {
    if (!window.gsap) return null;

    if (openTl) {
      openTl.kill();
      openTl = null;
    }

    var ctTitle = menu.querySelector(".apj-menu__ct-title-inner");
    var ctSub = menu.querySelector(".apj-menu__ct-sub");
    var ctLabel = menu.querySelector(".apj-menu__label");
    var ctListItems = menu.querySelectorAll(".apj-menu__ct-list li");
    var ctIcons = menu.querySelectorAll(".apj-menu__ct-icon");
    var ctCta = menu.querySelector(".apj-menu__cta");
    var ctSocials = menu.querySelectorAll(".apj-menu__social-link");

    openTl = gsap.timeline({
      paused: true,
      onReverseComplete: function () {
        finishClose();
      }
    });

    if (currentConditions.reducedMotion) {
      openTl.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return openTl;
    }

    // 0.00: Curtain path state 1 -> 2
    if (curtainPath) {
      openTl.fromTo(
        curtainPath,
        { attr: { d: "M0 2S175 1 500 1s500 1 500 1V0H0Z" } },
        { attr: { d: "M0 502S175 272 500 272s500 230 500 230V0H0Z" }, duration: 0.8, ease: "power2.inOut" },
        0
      );

      // 0.30: Curtain path state 2 -> 3
      openTl.to(
        curtainPath,
        { attr: { d: "M0 1005S175 995 500 995s500 5 500 5V0H0Z" }, duration: 0.8, ease: "power2.inOut" },
        0.3
      );
    }

    // 0.70: Left panel wipe (desktop) or slide (mobile)
    if (contactPanel) {
      if (currentConditions.desktop) {
        openTl.fromTo(
          contactPanel,
          { xPercent: -100, clipPath: "inset(0 100% 0 0)" },
          { xPercent: 0, clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "expo.out" },
          0.7
        );
      } else {
        openTl.fromTo(
          contactPanel,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.7
        );
      }
    }

    // 0.80: Close button
    if (closeBtn) {
      openTl.fromTo(
        closeBtn,
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" },
        0.8
      );
    }

    // 0.95: Menu entries stagger
    if (gridItems.length) {
      gridItems.forEach(function (item, idx) {
        var titleInner = item.querySelector(".apj-menu__title-inner");
        var desc = item.querySelector(".apj-menu__desc");
        var ctl = item.querySelector(".apj-menu__ctl");
        var startAt = 0.95 + idx * 0.08;

        if (titleInner) {
          openTl.fromTo(
            titleInner,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.0, ease: "expo.out" },
            startAt
          );
        }

        if (desc) {
          openTl.fromTo(
            desc,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
            startAt + 0.1
          );
        }

        if (ctl) {
          openTl.fromTo(
            ctl,
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" },
            startAt + 0.15
          );
        }
      });
    }

    // 1.00: Left panel content
    if (ctTitle) {
      openTl.fromTo(ctTitle, { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: "expo.out" }, 1.0);
    }
    if (ctSub) {
      openTl.fromTo(ctSub, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 1.1);
    }
    if (ctLabel) {
      openTl.fromTo(ctLabel, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.15);
    }
    if (ctListItems.length) {
      openTl.fromTo(
        ctListItems,
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        1.2
      );
    }
    if (ctIcons.length) {
      openTl.fromTo(
        ctIcons,
        { scale: 0 },
        { scale: 1, duration: 0.6, stagger: 0.08, ease: "back.out(2)" },
        1.25
      );
    }
    if (ctCta) {
      openTl.fromTo(
        ctCta,
        { y: 20, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
        1.35
      );
    }
    if (ctSocials.length) {
      openTl.fromTo(
        ctSocials,
        { scale: 0 },
        { scale: 1, duration: 0.6, stagger: 0.06, ease: "back.out(2)" },
        1.4
      );
    }

    // 1.45: Profile card
    if (profileCard) {
      openTl.fromTo(
        profileCard,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        1.45
      );
    }
    if (profileBtn) {
      openTl.fromTo(
        profileBtn,
        { scale: 0 },
        { scale: 1, duration: 0.7, ease: "back.out(2)" },
        1.55
      );
    }

    return openTl;
  }

  /**
   * Internal scroll reveals for small screens (< 992px)
   */
  function initApjMenuScrollReveals() {
    if (!window.ScrollTrigger || currentConditions.desktop || currentConditions.reducedMotion) return;

    killScrollTriggers();

    var offscreenItems = [];
    var allInspect = Array.from(gridItems);
    if (profileCard) allInspect.push(profileCard);

    var containerRect = scrollContainer.getBoundingClientRect();

    allInspect.forEach(function (el, idx) {
      var r = el.getBoundingClientRect();
      if (r.top > containerRect.bottom) {
        offscreenItems.push({ el: el, idx: idx });
      }
    });

    offscreenItems.forEach(function (item) {
      var st = ScrollTrigger.create({
        id: "apj-menu-scroll-" + item.idx,
        scroller: scrollContainer,
        trigger: item.el,
        start: "top 92%",
        once: true,
        onEnter: function () {
          var titleInner = item.el.querySelector(".apj-menu__title-inner");
          var desc = item.el.querySelector(".apj-menu__desc");
          var ctl = item.el.querySelector(".apj-menu__ctl");

          if (titleInner) gsap.to(titleInner, { yPercent: 0, duration: 0.8, ease: "expo.out" });
          if (desc) gsap.to(desc, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
          if (ctl) gsap.to(ctl, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" });
          if (item.el === profileCard) {
            gsap.to(profileCard, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
            if (profileBtn) gsap.to(profileBtn, { scale: 1, duration: 0.6, ease: "back.out(2)" });
          }
        }
      });
      createdScrollTriggers.push(st);
    });
  }

  function killScrollTriggers() {
    createdScrollTriggers.forEach(function (st) {
      if (st && typeof st.kill === "function") st.kill();
    });
    createdScrollTriggers = [];
  }

  /**
   * Open the Full-Screen Modal
   */
  function openMenu(trigger) {
    if (isOpen) return;
    isOpen = true;
    lastFocusedTrigger = trigger || document.querySelector("[data-apj-menu-open]");

    // Update triggers
    var triggers = document.querySelectorAll("[data-apj-menu-open]");
    triggers.forEach(function (t) {
      t.setAttribute("aria-expanded", "true");
    });

    // Pause smooth scrolling if active
    if (window.ScrollSmoother && typeof window.ScrollSmoother.get === "function") {
      var sm = window.ScrollSmoother.get();
      if (sm && typeof sm.paused === "function") sm.paused(true);
    }

    docEl.classList.add("apj-menu-open");
    applyInert();

    menu.removeAttribute("hidden");

    if (window.gsap && openTl) {
      openTl.timeScale(1).play(0).then(function () {
        if (closeBtn) closeBtn.focus();
        initApjMenuScrollReveals();
      });
    } else {
      if (closeBtn) closeBtn.focus();
    }

    announce("Site menu opened");
  }

  /**
   * Close the Full-Screen Modal
   */
  function closeMenu() {
    if (!isOpen) return;

    if (activeSub) {
      closeSub(true);
    }

    killScrollTriggers();

    if (window.gsap && openTl && !currentConditions.reducedMotion) {
      openTl.timeScale(1.6).reverse();
    } else {
      finishClose();
    }
  }

  function finishClose() {
    isOpen = false;
    menu.setAttribute("hidden", "");
    docEl.classList.remove("apj-menu-open");
    removeInert();

    // Resume smooth scrolling
    if (window.ScrollSmoother && typeof window.ScrollSmoother.get === "function") {
      var sm = window.ScrollSmoother.get();
      if (sm && typeof sm.paused === "function") sm.paused(false);
    }

    var triggers = document.querySelectorAll("[data-apj-menu-open]");
    triggers.forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }

    announce("Site menu closed");
  }

  /**
   * Reset menu state unconditionally (e.g. on bfcache pageshow)
   */
  function resetToClosed() {
    isOpen = false;
    activeSub = null;
    killScrollTriggers();
    if (openTl) openTl.pause(0);
    menu.setAttribute("hidden", "");
    docEl.classList.remove("apj-menu-open");
    removeInert();

    var subs = menu.querySelectorAll(".apj-menu__sub");
    subs.forEach(function (s) {
      s.setAttribute("hidden", "");
    });
    if (mainNav) mainNav.removeAttribute("hidden");
    if (profileCard) profileCard.style.opacity = "";

    var triggers = document.querySelectorAll("[data-apj-menu-open]");
    triggers.forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
  }

  /**
   * Drill-in Submenu Transition
   */
  function openSub(subName) {
    var targetSub = menu.querySelector('.apj-menu__sub[data-apj-sub="' + subName + '"]');
    if (!targetSub || activeSub === subName) return;

    activeSub = subName;
    menu.classList.add("apj-menu--sub");

    var openBtn = menu.querySelector('[data-apj-sub-open="' + subName + '"]');
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");

    var backBtn = targetSub.querySelector("[data-apj-back]");
    var subLinks = targetSub.querySelectorAll(".apj-menu__sub-link");
    var subTitle = targetSub.querySelector(".apj-menu__sub-title");

    if (!window.gsap || currentConditions.reducedMotion) {
      if (mainNav) mainNav.setAttribute("hidden", "");
      targetSub.removeAttribute("hidden");
      if (backBtn) backBtn.focus();
      announce((subName === "services" ? "Services" : "Industries") + " menu");
      return;
    }

    var tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // Out animation for main grid items
    tl.to(gridItems, {
      y: -24,
      opacity: 0,
      duration: 0.35,
      stagger: 0.03,
      onComplete: function () {
        if (mainNav) mainNav.setAttribute("hidden", "");
        targetSub.removeAttribute("hidden");
      }
    });

    if (profileCard) {
      tl.to(profileCard, { opacity: 0.6, duration: 0.3 }, 0);
    }

    // In animation for sub items
    tl.fromTo(
      targetSub,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0.35
    );

    if (backBtn) {
      tl.fromTo(backBtn, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.4);
    }
    if (subTitle) {
      tl.fromTo(subTitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.45);
    }
    if (subLinks.length) {
      tl.fromTo(
        subLinks,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          onComplete: function () {
            if (backBtn) backBtn.focus();
          }
        },
        0.5
      );
    }

    announce((subName === "services" ? "Services" : "Industries") + " menu");
  }

  /**
   * Return from Submenu to Main Menu
   */
  function closeSub(instant) {
    if (!activeSub) return;
    var currentSubEl = menu.querySelector('.apj-menu__sub[data-apj-sub="' + activeSub + '"]');
    var openedTrigger = menu.querySelector('[data-apj-sub-open="' + activeSub + '"]');

    if (openedTrigger) openedTrigger.setAttribute("aria-expanded", "false");

    var prevSub = activeSub;
    activeSub = null;
    menu.classList.remove("apj-menu--sub");

    if (instant || !window.gsap || currentConditions.reducedMotion) {
      if (currentSubEl) currentSubEl.setAttribute("hidden", "");
      if (mainNav) mainNav.removeAttribute("hidden");
      if (profileCard) profileCard.style.opacity = "";
      if (openedTrigger) openedTrigger.focus();
      announce("Main menu");
      return;
    }

    var tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    if (currentSubEl) {
      tl.to(currentSubEl, {
        opacity: 0,
        duration: 0.25,
        onComplete: function () {
          currentSubEl.setAttribute("hidden", "");
          if (mainNav) mainNav.removeAttribute("hidden");
        }
      });
    }

    if (profileCard) {
      tl.to(profileCard, { opacity: 1, duration: 0.3 }, 0);
    }

    tl.fromTo(
      gridItems,
      { y: -24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
        onComplete: function () {
          if (openedTrigger) openedTrigger.focus();
        }
      },
      0.25
    );

    announce("Main menu");
  }

  /**
   * Trap Keyboard Focus inside Modal
   */
  function handleKeyDown(e) {
    if (!isOpen) return;

    if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      if (activeSub) {
        closeSub(false);
      } else {
        closeMenu();
      }
      return;
    }

    if (e.key === "Tab" || e.keyCode === 9) {
      var focusables = menu.querySelectorAll(
        'button:not([hidden]):not([disabled]), a[href]:not([hidden]), [tabindex]:not([tabindex="-1"])'
      );
      var visibleFocusables = Array.from(focusables).filter(function (el) {
        return el.offsetParent !== null && !el.closest("[hidden]");
      });

      if (!visibleFocusables.length) return;

      var firstEl = visibleFocusables[0];
      var lastEl = visibleFocusables[visibleFocusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  /**
   * Handle Clicks inside Document
   */
  function initEventDelegation() {
    // Open trigger
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-apj-menu-open]");
      if (trigger) {
        e.preventDefault();
        openMenu(trigger);
      }
    });

    // Close button
    menu.addEventListener("click", function (e) {
      var closeTarget = e.target.closest("[data-apj-menu-close]");
      if (closeTarget) {
        e.preventDefault();
        closeMenu();
        return;
      }

      var subOpen = e.target.closest("[data-apj-sub-open]");
      if (subOpen) {
        e.preventDefault();
        var subName = subOpen.getAttribute("data-apj-sub-open");
        openSub(subName);
        return;
      }

      var backBtn = e.target.closest("[data-apj-back]");
      if (backBtn) {
        e.preventDefault();
        closeSub(false);
        return;
      }

      // In-page anchor links (e.g. index.html#team when already on index.html)
      var link = e.target.closest("a[href]");
      if (link && isOpen) {
        var href = link.getAttribute("href") || "";
        if (href.indexOf("#") !== -1) {
          var parts = href.split("#");
          var pagePart = parts[0];
          var hashPart = "#" + parts[1];

          var rawPath = window.location.pathname || "";
          var curPage = rawPath.substring(rawPath.lastIndexOf("/") + 1).toLowerCase() || "index.html";

          if (!pagePart || pagePart === "" || pagePart.toLowerCase() === curPage) {
            e.preventDefault();
            closeMenu();
            setTimeout(function () {
              var targetEl = document.querySelector(hashPart);
              if (targetEl) {
                if (window.ScrollSmoother && typeof window.ScrollSmoother.get === "function") {
                  var sm = window.ScrollSmoother.get();
                  if (sm && typeof sm.scrollTo === "function") {
                    sm.scrollTo(targetEl, true);
                    return;
                  }
                }
                targetEl.scrollIntoView({ behavior: "smooth" });
              }
            }, 550);
          }
        }
      }
    });

    // Trap focus
    menu.addEventListener("keydown", handleKeyDown);

    // BFCache reset
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        resetToClosed();
      }
    });
  }

  /**
   * Master Initializer
   */
  function init() {
    markCurrentPage();
    initEventDelegation();

    if (window.gsap) {
      menu.classList.add("apj-menu--js");

      var mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
          reducedMotion: "(prefers-reduced-motion: reduce)"
        },
        function (context) {
          currentConditions.desktop = context.conditions.desktop;
          currentConditions.reducedMotion = context.conditions.reducedMotion;

          buildOpenTimeline();

          return function () {
            killScrollTriggers();
          };
        }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
