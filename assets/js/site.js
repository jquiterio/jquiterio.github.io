(function () {
  "use strict";

  // Mobile navigation
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  // Copy e-mail address
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    var target = document.getElementById(b.dataset.copy), msg = document.getElementById(b.dataset.copy + "-msg");
    b.addEventListener("click", function () {
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(target);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        if (msg) msg.textContent = "Selected. Press Ctrl/⌘ + C to copy.";
      }
      try {
        navigator.clipboard.writeText(target.textContent.trim()).then(function () { if (msg) msg.textContent = "Copied."; }, fallback);
      } catch (e) { fallback(); }
    });
  });

  // Writing archive filters
  var filters = document.querySelector("[data-filters]");
  if (filters) {
    var buttons = filters.querySelectorAll("button");
    var entries = document.querySelectorAll("[data-section]");
    var years = document.querySelectorAll("[data-year-group]");
    function apply(id) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === id)); });
      entries.forEach(function (e) { e.hidden = !(id === "all" || e.dataset.section === id); });
      years.forEach(function (g) { g.hidden = !g.querySelector("[data-section]:not([hidden])"); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.dataset.filter);
        try { history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : "#" + b.dataset.filter); } catch (e) { }
      });
    });
    var start = (location.hash || "").slice(1);
    if (start && filters.querySelector('[data-filter="' + start + '"]')) apply(start);
  }
})();
