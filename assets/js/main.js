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
  function initYear() {
    var yearEls = document.querySelectorAll("[data-year]");
    var currentYear = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  // Initialize all UI functions on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initSearch();
    initSlider();
    initNewsletter();
    initBackToTop();
    initYear();
  });

})();
