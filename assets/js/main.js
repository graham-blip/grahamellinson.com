/* ============================================================
   Graham Ellinson — portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- dynamic year (footer + "the {year} skill" + differentiator) ---------- */
  var currentYear = new Date().getFullYear();
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = currentYear;
  document.querySelectorAll(".js-year").forEach(function (el) { el.textContent = currentYear; });

  /* ---------- nav: shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- active nav link via section observer ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sectionMap = {};
  navAnchors.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) sectionMap[id] = a;
  });
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove("active"); });
          var active = sectionMap[e.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(sectionMap).forEach(function (id) {
      secObs.observe(document.getElementById(id));
    });
  }

  /* ---------- typewriter (hero terminal) ---------- */
  var typedEl = document.getElementById("typed");
  if (typedEl) {
    var phrases = [
      "training deep-RL and LSTM models on real trading data",
      "shipping production AI agents for the trading desk",
      "building DeFi: tokenization, smart contracts, liquidation bots",
      "embedding with teams so they own the AI themselves"
    ];
    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      function tick() {
        var phrase = phrases[pi];
        if (!deleting) {
          ci++;
          typedEl.textContent = phrase.slice(0, ci);
          if (ci === phrase.length) { deleting = true; return setTimeout(tick, 1900); }
          setTimeout(tick, 38 + Math.random() * 40);
        } else {
          ci--;
          typedEl.textContent = phrase.slice(0, ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 360); }
          setTimeout(tick, 18);
        }
      }
      setTimeout(tick, 700);
    }
  }

  /* ---------- project explorer: tabs on desktop, accordion on mobile ---------- */
  var explorer = document.querySelector(".explorer");
  if (explorer) {
    var expList = explorer.querySelector(".exp-list");
    var expDetail = explorer.querySelector(".exp-detail");
    var tabs = Array.prototype.slice.call(explorer.querySelectorAll(".exp-tab"));
    var getPanel = function (t) { return document.getElementById(t.dataset.target); };
    var mq = window.matchMedia("(max-width: 920px)");
    var accordion = false;

    // Show exactly one panel (used for desktop tabs and accordion "open one")
    function showOnly(target) {
      tabs.forEach(function (t) {
        var on = t.dataset.target === target;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
        t.setAttribute("aria-expanded", String(on));
        var p = getPanel(t);
        if (p) p.classList.toggle("active", on);
      });
    }

    function onTabClick(t) {
      // In accordion mode, tapping the open project collapses it.
      if (accordion && t.classList.contains("active")) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
        t.setAttribute("aria-expanded", "false");
        var p = getPanel(t);
        if (p) p.classList.remove("active");
        return;
      }
      showOnly(t.dataset.target);
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () { onTabClick(t); });
    });

    // Move each panel directly beneath its tab so it reads as an accordion.
    function toAccordion() {
      if (accordion) return;
      tabs.forEach(function (t) {
        var p = getPanel(t);
        if (p) expList.insertBefore(p, t.nextSibling);
      });
      explorer.classList.add("is-accordion");
      accordion = true;
    }

    // Restore panels into the detail pane for the desktop two-column layout.
    function toTabs() {
      if (!accordion) return;
      tabs.forEach(function (t) {
        var p = getPanel(t);
        if (p) expDetail.appendChild(p);
      });
      explorer.classList.remove("is-accordion");
      accordion = false;
      var anyActive = tabs.some(function (t) { return t.classList.contains("active"); });
      if (!anyActive && tabs[0]) showOnly(tabs[0].dataset.target);
    }

    function syncLayout(e) { if (e.matches) toAccordion(); else toTabs(); }
    if (mq.addEventListener) mq.addEventListener("change", syncLayout);
    else if (mq.addListener) mq.addListener(syncLayout);
    syncLayout(mq);
  }

  /* ---------- capability card cursor glow ---------- */
  if (!reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }
})();
