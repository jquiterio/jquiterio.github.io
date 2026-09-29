/* γ-order generalized normal (γGN) density explorer.
 * Univariate γGN (Kitsos & Tavoularis, 2009), location 0, scale 1:
 *   f(x) = C exp{ -((γ-1)/γ) |x|^{γ/(γ-1)} },   C = a^{1/b} / (2 Γ(1 + 1/b)),
 *   a = (γ-1)/γ,  b = γ/(γ-1).
 * γ → 1+ : Uniform on [-1, 1];  γ = 2 : Normal;  γ → ∞ : Laplace.
 *
 * Every <figure class="gn" data-gn> on a page is initialised. Add data-gn-full for the
 * extended version (tail probability readout and a log-scale toggle).
 */
(function () {
  "use strict";

  // ---- special functions ----------------------------------------------------
  var LG = 7, LC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gamma(z) {
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1; var x = LC[0];
    for (var i = 1; i < LG + 2; i++) x += LC[i] / (z + i);
    var t = z + LG + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function lnGamma(z) { return Math.log(gamma(z)); }
  // Regularised upper incomplete gamma Q(s, x)
  function gammaQ(s, x) {
    if (x <= 0) return 1;
    if (x < s + 1) { // series for P, then 1 - P
      var sum = 1 / s, term = sum, n = s;
      for (var i = 0; i < 500; i++) { n += 1; term *= x / n; sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-14) break; }
      return 1 - sum * Math.exp(-x + s * Math.log(x) - lnGamma(s));
    }
    // continued fraction (Lentz)
    var b = x + 1 - s, c = 1e300, d = 1 / b, h = d;
    for (var k = 1; k < 500; k++) {
      var an = -k * (k - s); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-14) break;
    }
    return Math.exp(-x + s * Math.log(x) - lnGamma(s)) * h;
  }

  // ---- γGN ------------------------------------------------------------------
  function params(G) { var a = (G - 1) / G, b = G / (G - 1); return { a: a, b: b, c: Math.pow(a, 1 / b) / (2 * gamma(1 + 1 / b)) }; }
  function pdf(G) { var p = params(G); return function (x) { return p.c * Math.exp(-p.a * Math.pow(Math.abs(x), p.b)); }; }
  function exKurt(G) { var b = G / (G - 1); return gamma(5 / b) * gamma(1 / b) / Math.pow(gamma(3 / b), 2) - 3; }
  function sd(G) { var p = params(G); return Math.pow(p.a, -1 / p.b) * Math.sqrt(gamma(3 / p.b) / gamma(1 / p.b)); }
  // P(|X| > k standard deviations)
  function tail(G, k) { var p = params(G), t = k * sd(G); return gammaQ(1 / p.b, p.a * Math.pow(t, p.b)); }

  var LO = Math.log(0.05), HI = Math.log(19);
  function toG(v) { return 1 + Math.exp(LO + (HI - LO) * v / 1000); }
  function toSlider(G) { return Math.round(1000 * (Math.log(G - 1) - LO) / (HI - LO)); }
  function tok(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function fmt(x, d) { return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d); }

  var NORMAL = pdf(2), NORMAL_TAIL3 = tail(2, 3);

  function init(fig) {
    var cv = fig.querySelector("canvas"), ctx = cv.getContext("2d");
    var sl = fig.querySelector("input[type=range]");
    var btns = fig.querySelectorAll(".gn-ticks button");
    var logBtn = fig.querySelector(".gn-toggle");
    var out = function (k) { return fig.querySelector('[data-out="' + k + '"]'); };
    var G = 2, logScale = false;

    function draw() {
      var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      var accent = tok("--accent"), muted = tok("--muted"), rule = tok("--rule");
      var padL = logScale ? 34 : 4, padR = 4, padT = 8, padB = 22;
      var X0 = -4, X1 = 4, YMAX = 0.62, LMIN = -6, LMAX = 0;
      function sx(x) { return padL + (x - X0) / (X1 - X0) * (w - padL - padR); }
      function sy(y) {
        if (logScale) { var l = Math.log10(Math.max(y, 1e-12)); l = Math.max(LMIN, Math.min(LMAX, l)); return h - padB - (l - LMIN) / (LMAX - LMIN) * (h - padT - padB); }
        return h - padB - Math.min(y, YMAX) / YMAX * (h - padT - padB);
      }
      var base = h - padB;
      ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace';
      ctx.strokeStyle = rule; ctx.fillStyle = muted; ctx.lineWidth = 1;
      if (logScale) {
        ctx.textAlign = "right";
        for (var e = LMIN; e <= LMAX; e += 2) {
          var yy = Math.round(sy(Math.pow(10, e))) + .5;
          ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
          ctx.fillText(e === 0 ? "1" : "1e" + e, padL - 6, yy + 4);
        }
      }
      ctx.beginPath(); ctx.moveTo(sx(X0), base + .5); ctx.lineTo(sx(X1), base + .5); ctx.stroke();
      ctx.textAlign = "center";
      for (var t = -3; t <= 3; t++) {
        ctx.beginPath(); ctx.moveTo(Math.round(sx(t)) + .5, base); ctx.lineTo(Math.round(sx(t)) + .5, base + 4); ctx.stroke();
        ctx.fillText(t === 0 ? "0" : (t > 0 ? t : "−" + (-t)), sx(t), h - 6);
      }
      var f = pdf(G), N = 480, i, x;
      if (!logScale) {
        ctx.beginPath(); ctx.moveTo(sx(X0), base);
        for (i = 0; i <= N; i++) { x = X0 + (X1 - X0) * i / N; ctx.lineTo(sx(x), sy(f(x))); }
        ctx.lineTo(sx(X1), base); ctx.closePath();
        ctx.globalAlpha = 0.14; ctx.fillStyle = accent; ctx.fill(); ctx.globalAlpha = 1;
      }
      ctx.setLineDash([4, 4]); ctx.strokeStyle = muted; ctx.lineWidth = 1.25; ctx.beginPath();
      for (i = 0; i <= N; i++) { x = X0 + (X1 - X0) * i / N; var yn = sy(NORMAL(x)); i ? ctx.lineTo(sx(x), yn) : ctx.moveTo(sx(x), yn); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();
      var started = false;
      for (i = 0; i <= N; i++) {
        x = X0 + (X1 - X0) * i / N; var v = f(x);
        if (logScale && v < 1e-12) { started = false; continue; }
        var yg = sy(v);
        if (!started) { ctx.moveTo(sx(x), yg); started = true; } else ctx.lineTo(sx(x), yg);
      }
      ctx.stroke();
    }

    function update() {
      G = toG(+sl.value);
      if (Math.abs(G - 2) < 0.035) G = 2;
      if (out("g")) out("g").textContent = G >= 10 ? G.toFixed(1) : G.toFixed(2);
      if (out("b")) out("b").textContent = (G / (G - 1)).toFixed(2);
      var k = exKurt(G);
      if (out("k")) out("k").textContent = Math.abs(k) < 0.005 ? "0.00" : (k > 0 ? "+" : "") + fmt(k, 2);
      if (out("t")) {
        var tp = tail(G, 3);
        out("t").textContent = tp < 1e-7 ? "< 0.0001%" : (tp * 100).toFixed(tp < 0.001 ? 3 : 2) + "%";
      }
      if (out("r")) {
        var r = tail(G, 3) / NORMAL_TAIL3;
        out("r").textContent = r < 1e-4 ? "≈ 0×" : r.toFixed(r < 10 ? 2 : 1) + "×";
      }
      sl.setAttribute("aria-valuetext", "gamma " + G.toFixed(2));
      btns.forEach(function (b) { b.setAttribute("aria-pressed", Math.abs(toSlider(+b.dataset.g) - +sl.value) <= 6 ? "true" : "false"); });
      draw();
    }

    sl.addEventListener("input", update);
    btns.forEach(function (b) { b.addEventListener("click", function () { sl.value = toSlider(+b.dataset.g); update(); }); });
    if (logBtn) logBtn.addEventListener("click", function () {
      logScale = !logScale; logBtn.setAttribute("aria-pressed", String(logScale)); draw();
    });
    if ("ResizeObserver" in window) new ResizeObserver(draw).observe(cv); else window.addEventListener("resize", draw);
    try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw); } catch (e) { }
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    sl.value = toSlider(+(fig.dataset.gnStart || 2));
    update();
  }

  function boot() { document.querySelectorAll("figure.gn[data-gn]").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
