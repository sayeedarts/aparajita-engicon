(function () {
  "use strict";

  // Remove .no-js class from <html>
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /**
   * Header Scroll & Auto-hide behavior
   */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var lastScrollY = window.scrollY;
    var scrollThreshold = 80;

    function handleScroll() {
      var currentScrollY = window.scrollY;

      // Scrolled background state
      if (currentScrollY > scrollThreshold) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

      // Hide / Show on direction
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        // Scrolling down
        if (!document.body.classList.contains("offcanvas-open")) {
          header.classList.add("is-hidden");
        }
      } else {
        // Scrolling up
        header.classList.remove("is-hidden");
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Search Modal Handling
   */
  function initSearch() {
    var searchForm = document.querySelector("#searchModal form");
    var searchInput = document.querySelector("#searchModal input");
    if (!searchForm || !searchInput) return;

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      var sections = document.querySelectorAll("section[id]");
      var matchSection = null;

      sections.forEach(function (sec) {
        var text = sec.innerText.toLowerCase();
        if (text.includes(query) && !matchSection) {
          matchSection = sec;
        }
      });

      // Close modal using Bootstrap API
      var modalEl = document.getElementById("searchModal");
      var modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }

      if (matchSection) {
        matchSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /**
   * Newsletter Form Handler
   */
  function initNewsletter() {
    var form = document.querySelector(".newsletter-form");
    if (!form) return;

    var input = form.querySelector("input[type='email']");
    var submitBtn = form.querySelector("button[type='submit']");
    var alertBox = form.querySelector(".form-alert");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var email = input.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        form.classList.add("is-invalid");
        if (alertBox) {
          alertBox.textContent = "Please enter a valid email address.";
          alertBox.style.display = "block";
          alertBox.style.color = "var(--color-error)";
        }
        return;
      }

      // Valid state
      form.classList.remove("is-invalid");
      form.classList.add("is-loading");
      if (submitBtn) submitBtn.disabled = true;

      if (alertBox) {
        alertBox.textContent = "Submitting...";
        alertBox.style.display = "block";
        alertBox.style.color = "var(--color-brand)";
      }

      // Simulated network request
      setTimeout(function () {
        form.classList.remove("is-loading");
        form.classList.add("is-success");
        input.value = "";
        if (submitBtn) submitBtn.disabled = false;

        if (alertBox) {
          alertBox.textContent = "Thank you — you're subscribed!";
          alertBox.style.color = "var(--color-brand)";
        }
      }, 900);
    });
  }

  /**
   * Back to Top Controller
   */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }, { passive: true });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /**
   * Services Carousel Slider Navigation (Section 4)
   */
  function initSlider() {
    var track = document.querySelector(".svc-slider__track");
    var prevBtn = document.querySelector(".svc-slider__nav--prev");
    var nextBtn = document.querySelector(".svc-slider__nav--next");
    if (!track || !prevBtn || !nextBtn) return;

    var cardWidth = 340;

    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: cardWidth, behavior: "smooth" });
    });

    // Keyboard Arrow navigation when track focused
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        track.scrollBy({ left: -cardWidth, behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        track.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    });
  }

  /**
   * Dynamic Footer Copyright Year
   */
  /* 1A START */
  /**
   * 1A. HERO VIDEO CONTROLLER
   */
  function initHeroVideo() {
    try {
      var video = document.querySelector(".js-hero-video");
      var scrim = document.querySelector(".hero__scrim");
      var toggleBtn = document.querySelector(".js-hero-video-toggle");

      if (!video) return;

      function removeElements() {
        try {
          if (video && video.parentNode) video.parentNode.removeChild(video);
          if (scrim && scrim.parentNode) scrim.parentNode.removeChild(scrim);
          if (toggleBtn && toggleBtn.parentNode) toggleBtn.parentNode.removeChild(toggleBtn);
        } catch (e) {}
      }

      // Gate 1: Reduced Motion
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        removeElements();
        return;
      }

      // Gate 2: Data Saver & Slow Connection
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && (conn.saveData === true || ["slow-2g", "2g", "3g"].indexOf(conn.effectiveType) !== -1)) {
        removeElements();
        return;
      }

      // Gate 3: Reduced Data
      if (window.matchMedia && window.matchMedia("(prefers-reduced-data: reduce)").matches) {
        removeElements();
        return;
      }

      // Gate 4: Codec Support
      var canWebm = video.canPlayType && video.canPlayType('video/webm; codecs="vp9"');
      var canMp4 = video.canPlayType && (video.canPlayType('video/mp4; codecs="avc1.640028"') || video.canPlayType('video/mp4'));
      if (!canWebm && !canMp4) {
        removeElements();
        return;
      }

      var userPaused = false;
      try {
        if (sessionStorage.getItem("hero-video-paused") === "true") {
          userPaused = true;
          video._userPaused = true;
        }
      } catch (e) {}

      function updateToggleUI(isPaused) {
        if (!toggleBtn) return;
        if (isPaused) {
          toggleBtn.setAttribute("aria-pressed", "true");
          toggleBtn.setAttribute("aria-label", "Play background video");
          var icon = toggleBtn.querySelector("i");
          if (icon) icon.className = "fa-solid fa-play";
        } else {
          toggleBtn.setAttribute("aria-pressed", "false");
          toggleBtn.setAttribute("aria-label", "Pause background video");
          var icon = toggleBtn.querySelector("i");
          if (icon) icon.className = "fa-solid fa-pause";
        }
      }

      function setupVideoSources() {
        var isDesktop = window.matchMedia && window.matchMedia("(min-width: 992px)").matches;
        var prefix = isDesktop ? "hero-1080" : "hero-720";

        if (!isDesktop) {
          var mobilePoster = video.getAttribute("data-hero-video-poster-mobile");
          if (mobilePoster) video.setAttribute("poster", mobilePoster);
        }

        var webmSrc = "assets/videos/" + prefix + ".webm";
        var mp4Src = "assets/videos/" + prefix + ".mp4";

        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }

        if (canWebm === "probably" || canWebm === "maybe") {
          var sWebm = document.createElement("source");
          sWebm.src = webmSrc;
          sWebm.type = 'video/webm; codecs="vp9"';
          video.appendChild(sWebm);
        }

        var sMp4 = document.createElement("source");
        sMp4.src = mp4Src;
        sMp4.type = 'video/mp4; codecs="avc1.640028"';
        video.appendChild(sMp4);

        video.muted = true;
        video.defaultMuted = true;
        video.load();
      }

      function startPlayback() {
        setupVideoSources();

        video.addEventListener("error", function () {
          removeElements();
        });

        if (userPaused) {
          updateToggleUI(true);
          if (toggleBtn) toggleBtn.hidden = false;
          return;
        }

        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            var elapsed = performance.now();
            var delay = Math.max(0, 2400 - elapsed);
            setTimeout(function () {
              if (!video._userPaused) {
                video.classList.add("is-playing");
                if (toggleBtn) {
                  toggleBtn.hidden = false;
                  updateToggleUI(false);
                }
                video.dispatchEvent(new CustomEvent("hero-video:playing"));
              }
            }, delay);
          }).catch(function () {
            // Autoplay blocked
            video._userPaused = true;
            updateToggleUI(true);
            if (toggleBtn) toggleBtn.hidden = false;
          });
        }
      }

      // Schedule load after window load + idle
      function scheduleLoad() {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(startPlayback, { timeout: 2000 });
        } else {
          setTimeout(startPlayback, 1200);
        }
      }

      if (document.readyState === "complete") {
        scheduleLoad();
      } else {
        window.addEventListener("load", scheduleLoad, { once: true });
      }

      // Toggle Listener
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          if (video.paused || video._userPaused) {
            video._userPaused = false;
            try { sessionStorage.setItem("hero-video-paused", "false"); } catch (e) {}
            video.play().then(function () {
              video.classList.add("is-playing");
              updateToggleUI(false);
            }).catch(function () {});
          } else {
            video._userPaused = true;
            try { sessionStorage.setItem("hero-video-paused", "true"); } catch (e) {}
            video.pause();
            updateToggleUI(true);
          }
        });
      }

      // IntersectionObserver off-screen pausing
      if ("IntersectionObserver" in window) {
        var heroSec = document.querySelector("#home");
        if (heroSec) {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.intersectionRatio < 0.15) {
                if (!video.paused && !video._userPaused) {
                  video.pause();
                  video._obsPaused = true;
                }
              } else {
                if (video._obsPaused && !video._userPaused) {
                  video.play().catch(function () {});
                  video._obsPaused = false;
                }
              }
            });
          }, { threshold: [0, 0.15] });
          observer.observe(heroSec);
        }
      }

      // Tab visibility change
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (!video.paused && !video._userPaused) {
            video.pause();
            video._tabPaused = true;
          }
        } else {
          if (video._tabPaused && !video._userPaused) {
            video.play().catch(function () {});
            video._tabPaused = false;
          }
        }
      });

    } catch (err) {
      console.warn("Hero video initialization safe fallback:", err);
    }
  }
  /* 1A END */

  // Initialize all UI functions on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initSearch();
    initSlider();
    initNewsletter();
    initBackToTop();
    initYear();
    initHeroVideo();
  });

})();
