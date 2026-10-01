(function () {
  var c = window.CONTENT;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // Element helper. Uses textContent so content is never parsed as HTML.
  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) node.className = opts.cls;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.href) {
      node.href = opts.href;
      if (/^https?:/.test(opts.href)) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    }
    (children || []).forEach(function (ch) { if (ch) node.appendChild(ch); });
    return node;
  }

  // Fixed inline SVG icons (no external requests), safe to inject.
  var ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',
  };
  function iconFor(label) {
    var k = label.toLowerCase();
    if (k.indexOf("github") > -1) return ICONS.github;
    if (k.indexOf("linkedin") > -1) return ICONS.linkedin;
    if (k.indexOf("mail") > -1) return ICONS.mail;
    return ICONS.link;
  }
  function iconLink(label, href) {
    var a = el("a", { cls: "icon-btn", href: href });
    a.title = label;
    a.setAttribute("aria-label", label);
    a.innerHTML = iconFor(label);
    return a;
  }

  // ---------- Toast + clipboard ----------
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function copy(text, msg) {
    function fallback() {
      var ta = el("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(msg); } catch (e) { toast("Copy failed. " + text); }
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, fallback);
    } else fallback();
  }

  // ---------- Discreet mode ----------
  // Job-search details only for people who arrive through a personal link (?ref=...); the site remembers
  // them for 90 days. Everyone else (colleagues, search engines, link previews, the GitHub profile link)
  // sees a neutral page. Preview it yourself with any ?ref=, e.g. ?ref=preview.
  var openMode = (function () {
    var ref = (new URLSearchParams(location.search).get("ref") || "").toLowerCase();
    var viaLink = !!ref && ref !== "github";
    try {
      if (viaLink) localStorage.setItem("open-mode", String(Date.now()));
      return Date.now() - (+localStorage.getItem("open-mode") || 0) < 90 * 864e5;
    } catch (e) { return viaLink; }
  })();
  root.classList.toggle("open-mode", openMode);
  var manifest = openMode ? c.manifest.concat(c.manifestOpen || []) : c.manifest;

  // ---------- Hero ----------
  var linkedin = c.links.filter(function (l) { return /linkedin/i.test(l.label); })[0];
  $("brand").textContent = c.name;
  $("hero-availability").textContent = openMode ? c.availability : c.status;
  var nameEl = $("hero-name");
  nameEl.setAttribute("aria-label", c.name);
  c.name.split("").forEach(function (ch, i) {
    var span = el("span", { cls: "char", text: ch === " " ? "\u00a0" : ch });
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", i);
    nameEl.appendChild(span);
  });
  $("hero-eyebrow").textContent = c.role;
  $("hero-tagline").textContent = c.tagline;
  // CV buttons only appear when a CV file is configured in content.js.
  if (c.cv) {
    ["hero-cv", "mobile-cv"].forEach(function (id) { $(id).href = c.cv; $(id).hidden = false; });
  }

  var avatar = $("hero-avatar");
  var initials = c.name.split(/\s+/).map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
  avatar.textContent = initials;
  if (c.photo) {
    var img = new Image();
    img.alt = c.name;
    img.decoding = "async";
    img.onload = function () { avatar.textContent = ""; avatar.appendChild(img); };
    img.src = c.photo;
  }

  var socials = $("hero-socials");
  socials.appendChild(iconLink("Email", "mailto:" + c.email));
  c.links.forEach(function (l) { socials.appendChild(iconLink(l.label, l.url)); });

  // Live local time, so visitors know when a reply is likely.
  var clock = $("clock");
  var fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: c.timeZone, timeZoneName: "short" });
  function tick() {
    var t = c.location.split(",")[0] + " · " + fmt.format(new Date());
    clock.textContent = t;
    var local = $("contact-local");
    if (local) local.textContent = "Local time in " + t;
    var gt = $("glance-time");
    if (gt) gt.textContent = "Local time " + fmt.format(new Date());
  }
  tick();
  setInterval(tick, 30000);

  // Manifest with minimal YAML highlighting (built from DOM nodes, not HTML strings).
  var code = $("manifest");
  manifest.forEach(function (line, i) {
    var row = el("span", { cls: "ln" });
    row.style.setProperty("--i", i);
    var m = line.match(/^(\s*)([\w.-]+)(:)(\s*)([^#]*?)(\s*)(#.*)?$/);
    if (!m) { row.textContent = line; }
    else {
      row.appendChild(document.createTextNode(m[1]));
      row.appendChild(el("span", { cls: "tk-key", text: m[2] }));
      row.appendChild(el("span", { cls: "tk-punc", text: m[3] }));
      row.appendChild(document.createTextNode(m[4]));
      if (m[5]) {
        var v = m[5];
        var cls = /^(true|false)$/.test(v) ? "tk-bool" : /^\[.*\]$/.test(v) ? "tk-list" : "tk-val";
        row.appendChild(el("span", { cls: cls, text: v }));
      }
      if (m[7]) row.appendChild(el("span", { cls: "tk-comment", text: m[6] + m[7] }));
    }
    code.appendChild(row);
    if (i < manifest.length - 1) code.appendChild(document.createTextNode("\n"));
  });
  $("manifest-copy").addEventListener("click", function () { copy(manifest.join("\n"), "Manifest copied"); });

  c.stats.forEach(function (s) {
    $("stats").appendChild(el("div", { cls: "stat" }, [el("dt", { text: s.label }), el("dd", { text: s.value })]));
  });

  // ---------- About ----------
  // Lede: split into words so they can light up as the reader scrolls. **x** marks a highlight.
  var lede = $("about-lede"), ledeWords = [], litCount = -1;
  function renderLede(text) {
    text.split("**").forEach(function (part, i) {
      var target = lede;
      if (i % 2) { target = el("strong", { cls: "hl" }); lede.appendChild(target); }
      part.split(/(\s+)/).forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) target.appendChild(document.createTextNode(w));
        else target.appendChild(el("span", { cls: "w", text: w }));
      });
    });
    ledeWords = Array.prototype.slice.call(lede.querySelectorAll(".w"));
    lightLede();
  }
  function lightLede() {
    var n = ledeWords.length, lit = n;
    if (!reduceMotion) {
      var r = lede.getBoundingClientRect(), vh = innerHeight;
      // Starts lighting when the lede enters the lower part of the screen, done by the time it reaches the upper third.
      var p = (vh * 0.9 - r.top) / (vh * 0.5 + r.height * 0.3);
      lit = Math.round(Math.max(0, Math.min(1, p)) * n);
    }
    if (lit === litCount) return;
    ledeWords.forEach(function (w, i) { w.classList.toggle("lit", i < lit); });
    lede.querySelectorAll(".hl").forEach(function (h) { h.classList.toggle("lit", !h.querySelector(".w:not(.lit)")); });
    litCount = lit;
  }
  renderLede(c.about.lede);
  if (!reduceMotion && "IntersectionObserver" in window) {
    var ledeTicking = false;
    function onLedeScroll() { if (!ledeTicking) { ledeTicking = true; requestAnimationFrame(function () { lightLede(); ledeTicking = false; }); } }
    new IntersectionObserver(function (entries) {
      lightLede();
      if (entries[0].isIntersecting) addEventListener("scroll", onLedeScroll, { passive: true });
      else removeEventListener("scroll", onLedeScroll);
    }).observe(lede);
  }

  var notes = $("about-notes");
  c.about.notes.forEach(function (n) {
    notes.appendChild(el("div", { cls: "note" }, [el("h3", { cls: "note-k", text: n.k }), el("p", { text: n.text })]));
  });

  // At a glance
  var FACT_ICONS = {
    pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 5.5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5V15.5H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"/><path d="M19 9h1a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2h-.5V21L16 18.5h-3"/></svg>',
    cap: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z"/><path d="M6.5 11.2V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.8M21.5 9v5.5"/></svg>',
  };
  var CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
  c.facts.forEach(function (f) {
    var icon = el("span", { cls: "glance-icon" });
    icon.innerHTML = FACT_ICONS[f.icon] || "";
    var dd = el("dd");
    if (f.v) dd.appendChild(el("span", { cls: "glance-v", text: f.v }));
    if (f.sub) dd.appendChild(el("span", { cls: "glance-sub", text: f.sub }));
    if (f.clock) dd.appendChild(el("span", { cls: "glance-sub", text: "" })).id = "glance-time";
    if (f.badge && openMode) dd.appendChild(el("span", { cls: "glance-badge", text: f.badge }));
    if (f.langs) {
      dd.appendChild(el("ul", { cls: "langs" }, f.langs.map(function (l) {
        var kids = [el("span", { cls: "lang-name", text: l.name }), el("span", { cls: "lang-level", text: l.level })];
        if (l.cefr) {
          var ladder = el("span", { cls: "cefr" });
          ladder.setAttribute("aria-hidden", "true");
          CEFR.forEach(function (lv, i) { ladder.appendChild(el("i", { cls: i < l.cefr ? "on" : i === l.cefr ? "next" : "", text: lv })); });
          kids.push(ladder);
        }
        return el("li", { cls: l.cefr ? "has-cefr" : "" }, kids);
      })));
    }
    $("facts").appendChild(el("div", { cls: "glance-row" }, [icon, el("div", { cls: "glance-body" }, [el("dt", { text: f.k }), dd])]));
  });
  tick();

  // Each principle gets a small illustration of what it means in practice (decorative, static; animates on hover).
  var PRINCIPLE_VIZ = [
    // Security is a pipeline stage: two changes reach the gate, one passes, one is stopped.
    '<svg viewBox="0 0 240 110" aria-hidden="true">' +
      '<path class="pv-track" d="M18 38H222M18 74H120"/>' +
      '<path class="pv-flow" d="M18 38H222"/>' +
      '<circle class="pv-node" cx="22" cy="38" r="5"/><circle class="pv-node" cx="22" cy="74" r="5"/>' +
      '<g class="pv-gate" transform="translate(108 38)"><path d="M12 -20 0 -15v10c0 9 5 16 12 19 7-3 12-10 12-19v-10L12 -20Z"/><path class="pv-tick" d="m6.5 -3.5 4 4 7-7.5"/></g>' +
      '<rect class="pv-gate-col" x="114" y="60" width="12" height="28" rx="4"/>' +
      '<path class="pv-stop" d="m113 69 14 10M127 69l-14 10"/>' +
      '<circle class="pv-node pv-ok" cx="218" cy="38" r="5"/>' +
      '<text class="pv-label" x="18" y="100">change</text><text class="pv-label" x="120" y="100" text-anchor="middle">gate</text><text class="pv-label" x="222" y="100" text-anchor="end">prod</text>' +
    '</svg>',
    // Platforms are products: a self-service form instead of a ticket.
    '<svg viewBox="0 0 240 110" aria-hidden="true">' +
      '<rect class="pv-card" x="28" y="10" width="184" height="92" rx="10"/>' +
      '<text class="pv-title" x="42" y="31">New service</text>' +
      '<g class="pv-rows"><rect x="42" y="40" width="96" height="9" rx="4.5"/><rect x="42" y="56" width="74" height="9" rx="4.5"/><rect x="42" y="72" width="86" height="9" rx="4.5"/></g>' +
      '<path class="pv-tick pv-check" d="m150 44.5 3.5 3.5 6-6.5M150 60.5l3.5 3.5 6-6.5M150 76.5l3.5 3.5 6-6.5"/>' +
      '<rect class="pv-btn" x="168" y="74" width="34" height="18" rx="9"/><path class="pv-btn-arrow" d="M180 83h10m-3.5-3.5L190 83l-3.5 3.5"/>' +
    '</svg>',
    // Everything as code: a reviewed diff replaces a manual change.
    '<svg viewBox="0 0 240 110" aria-hidden="true">' +
      '<rect class="pv-card" x="20" y="12" width="200" height="86" rx="10"/>' +
      '<text class="pv-code" x="34" y="36"><tspan class="pv-add">+</tspan> cluster  = "aks-prod"</text>' +
      '<text class="pv-code" x="34" y="56"><tspan class="pv-add">+</tspan> policy   = "baseline"</text>' +
      '<text class="pv-code pv-del-line" x="34" y="76"><tspan class="pv-del">-</tspan> manual   = true</text>' +
      '<path class="pv-strike" d="M46 72.5h104"/>' +
      '<g class="pv-git" transform="translate(186 72)"><circle cx="0" cy="-8" r="3.5"/><circle cx="0" cy="12" r="3.5"/><circle cx="14" cy="0" r="3.5"/><path d="M0 -4.5v13M14 3.5c0 5-7 5-11 7"/></g>' +
    '</svg>',
    // Alert on what users feel: an error budget, and an alert only when users are affected.
    '<svg viewBox="0 0 240 110" aria-hidden="true">' +
      '<path class="pv-grid" d="M18 26H222M18 50H222M18 74H222"/>' +
      '<path class="pv-threshold" d="M18 34H222"/>' +
      '<path class="pv-spark" d="M18 70 40 64 60 68 82 58 104 62 126 52 148 56 170 30 192 48 222 44"/>' +
      '<circle class="pv-alert" cx="170" cy="30" r="5"/>' +
      '<rect class="pv-budget-bg" x="18" y="88" width="204" height="7" rx="3.5"/><rect class="pv-budget" x="18" y="88" width="140" height="7" rx="3.5"/>' +
      '<text class="pv-label" x="222" y="22" text-anchor="end">users affected</text>' +
    '</svg>',
  ];
  c.principles.forEach(function (p, i) {
    var viz = el("div", { cls: "principle-viz" });
    viz.innerHTML = PRINCIPLE_VIZ[i % PRINCIPLE_VIZ.length];
    $("principles").appendChild(el("article", { cls: "principle spot" }, [
      viz,
      el("span", { cls: "principle-num", text: "0" + (i + 1) }),
      el("h4", { text: p.title }),
      el("p", { text: p.desc }),
    ]));
  });

  // ---------- Selected work: editorial case-file showcase ----------
  // One DOM node per case (index button + panel). Desktop: index left, open case right.
  // Phones: an accordion. Buttons follow the disclosure pattern (aria-expanded + aria-controls).
  var showcase = $("showcase"), caseItems = [];
  var wideScreen = matchMedia("(min-width: 861px)");
  c.caseStudies.forEach(function (cs, i) {
    var num = String(i + 1).padStart(2, "0"), pid = "case-panel-" + i;
    var tab = el("button", { cls: "case-tab" }, [
      el("span", { cls: "case-tab-num", text: num }),
      el("span", { cls: "case-tab-text" }, [el("strong", { text: cs.title }), el("span", { text: cs.context })]),
      el("span", { cls: "case-tab-arrow", text: "→" }),
      el("span", { cls: "case-tab-progress" }),
    ]);
    tab.type = "button";
    tab.id = "case-tab-" + i;
    tab.style.setProperty("--row", i + 1);
    tab.setAttribute("aria-controls", pid);

    function step(kind, label, text) {
      return el("li", { cls: "flow-step flow-" + kind }, [
        el("span", { cls: "flow-dot" }), el("p", { cls: "flow-label", text: label }), el("p", { cls: "flow-text", text: text }),
      ]);
    }
    // Metrics render only when real ones are added in content.js.
    var metrics = cs.metrics && cs.metrics.length
      ? el("ul", { cls: "case-metrics" }, cs.metrics.map(function (m) { return el("li", { text: m }); }))
      : null;
    var mark = el("span", { cls: "case-watermark", text: num });
    mark.setAttribute("aria-hidden", "true");
    var panel = el("div", { cls: "case-panel" }, [
      mark,
      el("p", { cls: "case-kicker", text: "Case " + num + " · " + cs.context }),
      el("h3", { cls: "case-title", text: cs.title }),
      cs.myRole ? el("p", { cls: "case-role" }, [el("span", { text: "My role" }), el("strong", { text: cs.myRole })]) : null,
      el("ol", { cls: "case-flow" }, [
        step("challenge", "Challenge", cs.challenge),
        step("approach", "Approach", cs.approach),
        step("result", "Result", cs.result),
      ]),
      metrics,
      el("ul", { cls: "chips small case-stack" }, cs.stack.map(function (t) { return el("li", { text: t }); })),
    ]);
    panel.id = pid;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", tab.id);
    showcase.appendChild(el("div", { cls: "case-item" }, [tab, panel]));
    caseItems.push({ tab: tab, panel: panel });
  });

  showcase.style.setProperty("--n", c.caseStudies.length);
  var activeCase = -1;
  var caseAutoplay = !reduceMotion && wideScreen.matches;
  function openCase(i, fromUser) {
    if (fromUser && caseAutoplay) { caseAutoplay = false; showcase.classList.remove("autoplay"); }
    caseItems.forEach(function (it, k) {
      var on = k === i;
      it.tab.classList.toggle("active", on);
      it.tab.setAttribute("aria-expanded", String(on));
      it.panel.classList.toggle("active", on);
      if (on) it.panel.removeAttribute("inert"); else it.panel.setAttribute("inert", "");
    });
    activeCase = i;
  }
  caseItems.forEach(function (it, i) {
    it.tab.addEventListener("click", function () {
      // Phones: tapping the open case closes it; desktop always keeps one case open.
      if (!wideScreen.matches && activeCase === i) { openCase(-1, true); return; }
      openCase(i, true);
      if (!wideScreen.matches) it.tab.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    });
    // Autoplay: the gold progress line's animation hands over to the next case.
    it.tab.querySelector(".case-tab-progress").addEventListener("animationend", function () {
      if (caseAutoplay && activeCase === i) openCase((i + 1) % caseItems.length);
    });
  });
  openCase(0);
  if (caseAutoplay && "IntersectionObserver" in window) {
    showcase.classList.add("autoplay");
    // Only advance while the section is on screen (hover and focus pause it in CSS).
    new IntersectionObserver(function (entries) {
      showcase.classList.toggle("in-view", entries[0].isIntersecting);
    }, { threshold: 0.35 }).observe(showcase);
  }

  // Workshops & talks as event passes (fixed inline icons, decorative).
  var PASS_ICONS = {
    terminal: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 10 3 2.5L7 15M13 15h4"/></svg>',
    mic: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>',
    layers: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
  };
  c.workshops.forEach(function (w, i) {
    var icon = el("span", { cls: "pass-icon" });
    icon.innerHTML = PASS_ICONS[w.icon] || PASS_ICONS.terminal;
    var code = el("span", { cls: "pass-code" });
    code.setAttribute("aria-hidden", "true");
    $("workshop-list").appendChild(el("li", { cls: "pass" }, [
      el("div", { cls: "pass-stub" }, [
        icon,
        el("span", { cls: "pass-type", text: w.type }),
        el("span", { cls: "pass-no", text: "No. " + String(i + 1).padStart(2, "0") }),
        code,
      ]),
      el("div", { cls: "pass-body" }, [
        el("p", { cls: "pass-where", text: w.where }),
        el("h4", { text: w.title }),
        el("p", { cls: "pass-desc", text: w.desc }),
        el("ul", { cls: "chips small" }, (w.tags || []).map(function (t) { return el("li", { text: t }); })),
      ]),
    ]));
  });

  // ---------- Skills ----------
  // Bento grid. Tile placement lives in CSS (grid-template-areas keyed by capability id).
  var TILE_ICONS = {
    k8s: '<path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z"/><circle cx="12" cy="12" r="3"/><path d="M12 5v4M12 15v4M5.8 8.5l3.5 2M14.7 13.5l3.5 2M18.2 8.5l-3.5 2M9.3 13.5l-3.5 2"/>',
    iac: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 4.5 9-4.5" opacity=".5"/>',
    gitops: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.2v9.6M18 10.2c0 4-6 3.5-10.5 7"/>',
    sec: '<path d="M12 2.5 4 6v5.5c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5V6l-8-3.5Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    obs: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    cloud: '<path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 18Z"/>',
    apps: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/>',
    certs: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 8 5-2.5 5 2.5-1.5-8"/>',
  };
  function tileIcon(id) {
    var d = el("div", { cls: "tile-icon" });
    d.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + TILE_ICONS[id] + "</svg>";
    return d;
  }
  function sinceYear(roleKeys) {
    var ys = c.roles.filter(function (r) { return r.year && roleKeys.indexOf(r.key) > -1; }).map(function (r) { return r.year; });
    return ys.length ? Math.min.apply(null, ys) : null;
  }
  function roleDots(roleKeys) {
    var wrap = el("span", { cls: "role-dots" });
    c.roles.forEach(function (r) {
      var d = el("span", { cls: "role-dot" + (roleKeys.indexOf(r.key) > -1 ? " on" : "") });
      d.title = r.name;
      wrap.appendChild(d);
    });
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", "Used at " + c.roles.filter(function (r) { return roleKeys.indexOf(r.key) > -1; }).map(function (r) { return r.name; }).join(", "));
    return wrap;
  }
  // Decorative, static illustrations per tile (fixed markup, aria-hidden). No figures: they show
  // how the work flows, never invented metrics.
  var VIZ = {
    k8s:
      '<svg class="viz-orbit" viewBox="0 0 260 260">' +
        '<defs><linearGradient id="kgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="stop-a"/><stop offset="1" class="stop-b"/></linearGradient></defs>' +
        '<circle cx="130" cy="130" r="118" class="ring ring-dash"/><circle cx="130" cy="130" r="82" class="ring"/><circle cx="130" cy="130" r="46" class="ring ring-dash"/>' +
        '<g class="orbit orbit-1"><circle cx="130" cy="48" r="7" class="pod"/><circle cx="212" cy="130" r="5" class="pod pod-b"/><circle cx="130" cy="212" r="7" class="pod"/><circle cx="48" cy="130" r="5" class="pod pod-b"/></g>' +
        '<g class="orbit orbit-2"><rect x="124" y="6" width="12" height="12" rx="3" class="node"/><rect x="226" y="183" width="12" height="12" rx="3" class="node"/><rect x="22" y="183" width="12" height="12" rx="3" class="node"/></g>' +
        '<polygon points="130,98 158,114 158,146 130,162 102,146 102,114" class="core"/>' +
        '<g class="wheel"><circle cx="130" cy="130" r="9"/><path d="M130 112v9M130 139v9M114.4 121l7.8 4.5M137.8 134.5l7.8 4.5M145.6 121l-7.8 4.5M122.2 134.5l-7.8 4.5"/></g>' +
      "</svg>" +
      '<span class="orbit-tag tag-aks">AKS</span><span class="orbit-tag tag-eks">EKS</span>',
    iac:
      '<pre class="viz-code"><span class="c-k">module</span> <span class="c-s">"platform"</span> {\n' +
      '  source   = <span class="c-s">"./modules/aks"</span>\n' +
      '  env      = <span class="c-s">"prod"</span>\n' +
      '  baseline = <span class="c-b">true</span>\n}<span class="viz-cursor"></span></pre>',
    gitops:
      '<div class="viz-flow"><div class="flow-track"><span class="flow-pulse"></span></div>' +
      '<ol class="flow-steps"><li><i></i>commit</li><li><i></i>checks</li><li><i></i>sync</li><li><i></i>live</li></ol></div>',
    sec:
      '<div class="viz-gates"><span class="gate-end">code</span>' +
      '<span class="gate">SAST</span><span class="gate">DAST</span><span class="gate">IaC scan</span><span class="gate">Policy</span>' +
      '<span class="gate-end gate-deploy">deploy</span></div>',
    obs:
      '<svg class="viz-spark" viewBox="0 0 220 92" preserveAspectRatio="none">' +
        '<defs><linearGradient id="sgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="stop-a"/><stop offset="1" class="stop-fade"/></linearGradient></defs>' +
        '<line x1="0" y1="30" x2="220" y2="30" class="slo-line"/>' +
        '<path class="spark-area" d="M0,72 L20,64 L40,68 L60,52 L80,58 L100,44 L120,50 L140,40 L160,54 L180,18 L200,46 L220,42 L220,92 L0,92Z"/>' +
        '<path class="spark-line" pathLength="1" d="M0,72 L20,64 L40,68 L60,52 L80,58 L100,44 L120,50 L140,40 L160,54 L180,18 L200,46 L220,42"/>' +
        '<circle cx="180" cy="18" r="4" class="spark-alert"/>' +
      "</svg>" +
      '<span class="slo-tag">SLO</span><span class="alert-tag">alert</span>',
    cloud:
      '<svg class="viz-net" viewBox="0 0 220 100">' +
        '<path d="M52 26 H168" class="link"/><path d="M40 36 L100 72" class="link link-b"/><path d="M180 36 L120 72" class="link"/>' +
        '<rect x="6" y="12" width="68" height="28" rx="8" class="net-node"/><text x="40" y="30" class="net-label">azure</text>' +
        '<rect x="152" y="12" width="62" height="28" rx="8" class="net-node"/><text x="183" y="30" class="net-label">aws</text>' +
        '<rect x="70" y="64" width="80" height="28" rx="8" class="net-node net-onprem"/><text x="110" y="82" class="net-label">on-prem</text>' +
      "</svg>",
    apps:
      '<div class="viz-events"><span class="ev-box">service-bus</span><span class="ev-link"><i></i></span>' +
      '<span class="ev-box ev-fn">function</span><span class="ev-link"><i></i></span><span class="ev-box">event-grid</span></div>',
  };
  function viz(id) {
    var d = el("div", { cls: "viz viz-" + id });
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = VIZ[id];
    return d;
  }

  var bento = $("bento");
  c.capabilities.forEach(function (cap) {
    var y = sinceYear(cap.roles), hero = !!cap.highlight;
    var head = el("div", { cls: "tile-head" }, [tileIcon(cap.id), el("h3", { text: cap.name })]);
    var tools = el("p", { cls: "tile-tools", text: cap.tools });
    var ev = el("p", { cls: "tile-ev", text: cap.evidence });
    var foot = el("div", { cls: "tile-foot" }, [el("span", { cls: "tile-since", text: !hero && y ? "since " + y : "" }), roleDots(cap.roles)]);
    var kids = hero
      ? [viz(cap.id), el("div", { cls: "tile-hero-copy" }, [head, tools, ev]),
         el("div", { cls: "tile-hero-year" }, [
           el("p", { cls: "big-year-kicker", text: "Since" }),
           el("p", { cls: "big-year", text: String(y) }),
           el("p", { cls: "big-year-label", text: cap.highlight }),
         ]), foot]
      : [head, viz(cap.id), tools, ev, foot];
    bento.appendChild(el("article", { cls: "tile spot tile-" + cap.id + (hero ? " tile-hero" : "") }, kids));
  });
  // Certifications: a summary tile in the grid, the full grouped list below it.
  var allCerts = [];
  c.certifications.forEach(function (g) { allCerts = allCerts.concat(g.items); });
  bento.appendChild(el("article", { cls: "tile spot tile-certs" }, [
    el("div", { cls: "tile-head" }, [tileIcon("certs"), el("h3", { text: "Certified" }), el("span", { cls: "count-badge", text: String(allCerts.length) })]),
    el("ul", { cls: "creds" }, c.certifications[0].items.slice(0, 3).map(function (cert) {
      return el("li", { cls: "cred" }, [el("span", { cls: "cred-issuer", text: cert.issuer }), el("span", { cls: "cred-name", text: cert.name })]);
    })),
    el("a", { cls: "tile-more", href: "#certs", text: "See all " + allCerts.length + " →" }),
  ]));

  // Honeycomb: rows alternate N and N-1 badges, each badge spanning two grid columns,
  // odd rows shifted by one column so the hexagons tessellate.
  var hive = $("hive"), caption = $("hive-caption"), badges = [];
  var summary = allCerts.length + " certifications · " + c.certifications.map(function (g) { return g.items.length + " " + g.group; }).join(" · ");
  caption.textContent = summary;
  c.certifications.forEach(function (g, gi) {
    var sw = el("span", { cls: "legend-hex g" + gi });
    $("cert-legend").appendChild(el("li", {}, [sw, el("span", { text: g.group }), el("b", { text: String(g.items.length) })]));
    g.items.forEach(function (cert) {
      var full = cert.issuer + " · " + cert.name + (cert.year ? " · " + cert.year : "");
      var hex = el("li", { cls: "hex g" + gi }, [
        el("div", { cls: "hex-shape" }, [
          el("span", { cls: "hex-issuer", text: cert.issuer }),
          el("span", { cls: "hex-name", text: cert.short || cert.name }),
          el("span", { cls: "hex-tier", text: cert.tier || "" }),
        ]),
      ]);
      hex.setAttribute("aria-label", full);
      hex.addEventListener("mouseenter", function () { caption.textContent = full + " · " + g.group; caption.classList.add("on"); });
      hex.addEventListener("mouseleave", function () { caption.textContent = summary; caption.classList.remove("on"); });
      hive.appendChild(hex);
      badges.push(hex);
    });
  });
  function layoutHive() {
    // Up to 6 per row on desktop, but never fewer than needed for a balanced N / N-1 pair (7 badges -> 4 + 3).
    var perRow = matchMedia("(min-width: 1021px)").matches ? Math.min(6, Math.ceil((badges.length + 1) / 2))
      : matchMedia("(min-width: 601px)").matches ? 4 : 2;
    hive.style.setProperty("--cols", perRow * 2);
    var row = 0, inRow = 0;
    badges.forEach(function (hex) {
      var cap = row % 2 ? perRow - 1 : perRow;
      if (inRow >= cap) { row++; inRow = 0; cap = row % 2 ? perRow - 1 : perRow; }
      hex.style.gridRow = String(row + 1);
      hex.style.gridColumn = (inRow * 2 + 1 + (row % 2)) + " / span 2";
      hex.classList.toggle("stacked", row > 0);
      inRow++;
    });
  }
  layoutHive();
  // Course completions: shown as learning, separate from exam-based certifications.
  if (c.learning && c.learning.length) {
    c.learning.forEach(function (l) {
      $("learning-list").appendChild(el("li", {}, [
        el("span", { cls: "learning-issuer", text: l.issuer }),
        el("span", { text: l.name + (l.year ? " · " + l.year : "") }),
      ]));
    });
    $("learning").hidden = false;
  }
  ["(min-width: 1021px)", "(min-width: 601px)"].forEach(function (q) { matchMedia(q).addEventListener("change", layoutHive); });
  var key = $("bento-key");
  key.appendChild(roleDots(c.roles.map(function (r) { return r.key; })));
  key.appendChild(document.createTextNode("Where I used it: " + c.roles.map(function (r) { return r.name; }).join(" · ")));

  // ---------- First 90 days ----------
  var plan = c.first90;
  $("plan").hidden = !plan || !openMode;
  // Number the visible sections 01, 02, ... so a hidden section never leaves a gap.
  document.querySelectorAll(".section:not([hidden]) .label .idx").forEach(function (idx, i) { idx.textContent = (i < 9 ? "0" : "") + (i + 1); });
  if (plan && openMode) {
    $("plan-title").textContent = plan.title;
    $("plan-intro").textContent = plan.intro;
    plan.phases.forEach(function (ph, i) {
      $("plan-phases").appendChild(el("li", { cls: "phase" }, [
        el("span", { cls: "phase-dot" }),
        el("p", { cls: "phase-when", text: ph.when }),
        el("span", { cls: "phase-num", text: "0" + (i + 1) }),
        el("h3", { cls: "phase-title", text: ph.title }),
        el("ul", { cls: "phase-points" }, ph.points.map(function (p) { return el("li", { text: p }); })),
      ]));
    });
  }

  // ---------- Experience: a proportional career bar, one role open at a time ----------
  // Durations come from the periods in content.js (counted inclusively, as LinkedIn does).
  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function monthOf(text) {
    if (/present/i.test(text)) { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); }
    var parts = text.trim().split(/\s+/);
    return new Date(+parts[1], MONTHS[parts[0].slice(0, 3).toLowerCase()], 1);
  }
  function monthsBetween(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); }
  function durationText(m) {
    var y = Math.floor(m / 12), mo = m % 12;
    return [y ? y + (y > 1 ? " yrs" : " yr") : "", mo ? mo + " mo" : ""].filter(Boolean).join(" ");
  }
  var THEME_ICONS = [
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>',
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 12h4l2.5-6 5 12L17 12h4"/></svg>',
  ];
  var roles = c.experience.map(function (x, i) {
    var p = x.period.split(/\s*[–-]\s*/), from = monthOf(p[0]), to = monthOf(p[1] || "Present");
    return { x: x, i: i, from: from, to: to, months: monthsBetween(from, to) + 1, current: /present/i.test(x.period) };
  });
  var chrono = roles.slice().reverse();
  var careerStart = chrono[0].from, careerMonths = monthsBetween(careerStart, chrono[chrono.length - 1].to) + 1;
  var segs = [], panels = [];

  function pointList(points, cls) {
    return el("ul", { cls: cls }, points.map(function (p) { return el("li", { text: p }); }));
  }
  function openRole(i, focus) {
    roles.forEach(function (r) {
      var on = r.i === i;
      segs[r.i].setAttribute("aria-selected", String(on));
      segs[r.i].tabIndex = on ? 0 : -1;
      panels[r.i].hidden = !on;
    });
    if (focus) segs[i].focus();
  }

  chrono.forEach(function (r, k) {
    var x = r.x;
    var seg = el("button", { cls: "career-seg" + (r.current ? " is-current" : "") }, [
      el("span", { cls: "seg-track" }),
      el("span", { cls: "seg-company", text: x.company.replace(/\s+(Technologies|Inc\.?|B\.V\.|Ltd\.?)$/i, "") }),
      el("span", { cls: "seg-role", text: x.role.split(",")[0] }),
      el("span", { cls: "seg-years", text: r.from.getFullYear() + " – " + (r.current ? "now" : r.to.getFullYear()) + " · " + durationText(r.months) }),
      el("span", { cls: "seg-short", text: "’" + String(r.from.getFullYear()).slice(2) + "–" + (r.current ? "now" : "’" + String(r.to.getFullYear()).slice(2)) }),
    ]);
    seg.type = "button";
    seg.id = "career-tab-" + r.i;
    seg.style.flexGrow = r.months;
    seg.setAttribute("role", "tab");
    seg.setAttribute("aria-controls", "career-panel-" + r.i);
    seg.addEventListener("click", function () { openRole(r.i); });
    seg.addEventListener("keydown", function (e) {
      var n = chrono.length, to = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (k + 1) % n;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (k - 1 + n) % n;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = n - 1;
      if (to !== null) { e.preventDefault(); openRole(chrono[to].i, true); }
    });
    segs[r.i] = seg;
    $("career-bar").appendChild(seg);
  });

  // Year ticks under the bar.
  for (var yr = careerStart.getFullYear() + 1; yr <= new Date().getFullYear(); yr++) {
    var at = monthsBetween(careerStart, new Date(yr, 0, 1)) / careerMonths * 100;
    var tick = el("span", { cls: "axis-tick", text: String(yr) });
    tick.style.left = at + "%";
    $("career-axis").appendChild(tick);
  }
  $("career-axis").appendChild(el("span", { cls: "axis-now", text: "Now" }));

  roles.forEach(function (r) {
    var x = r.x;
    var detail = x.themes
      ? el("div", { cls: "xp-themes" }, x.themes.map(function (t, ti) {
          var icon = el("span", { cls: "xp-theme-icon" });
          icon.innerHTML = THEME_ICONS[ti % THEME_ICONS.length];
          return el("section", { cls: "xp-theme" }, [el("div", { cls: "xp-theme-head" }, [icon, el("h4", { text: t.title })]), pointList(t.points, "xp-list")]);
        }))
      : pointList(x.points, "xp-list xp-list-grid");
    var panel = el("div", { cls: "xp-panel" }, [
      el("div", { cls: "xp-top" }, [
        el("div", {}, [
          el("p", { cls: "xp-company", text: x.company }),
          el("h3", { cls: "xp-role", text: x.role }),
          x.meta ? el("p", { cls: "xp-meta", text: x.meta }) : null,
        ]),
        el("div", { cls: "xp-when" }, [
          el("span", { cls: "xp-period", text: x.period }),
          el("span", { cls: "xp-dur" + (r.current ? " is-current" : ""), text: durationText(r.months) + (r.current ? " · current" : "") }),
        ]),
      ]),
      x.summary ? el("p", { cls: "xp-summary", text: x.summary }) : null,
      detail,
      x.stack ? el("ul", { cls: "chips small xp-stack" }, x.stack.map(function (s) { return el("li", { text: s }); })) : null,
    ]);
    panel.id = "career-panel-" + r.i;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "career-tab-" + r.i);
    panel.tabIndex = 0;
    panels[r.i] = panel;
    $("career-panels").appendChild(panel);
  });
  openRole(0);

  // Recommendations: hidden until at least one is added in content.js.
  if (c.testimonials && c.testimonials.length) {
    c.testimonials.forEach(function (q) {
      $("quote-list").appendChild(el("figure", { cls: "quote" }, [
        el("blockquote", { text: "“" + q.quote + "”" }),
        el("figcaption", {}, [el("strong", { text: q.name }), el("span", { text: q.role })]),
      ]));
    });
    $("quotes").hidden = false;
  }

  // ---------- Contact ----------
  $("copy-email").addEventListener("click", function () { copy(c.email, "Email copied: " + c.email); });
  $("contact-email").href = "mailto:" + c.email;
  $("contact-email").textContent = c.email;
  $("contact-availability").textContent = openMode ? c.availability : c.status;
  c.links.forEach(function (l) {
    var handle = l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    var a = el("a", { cls: "channel", href: l.url }, [
      el("span", { cls: "channel-icon" }), el("span", { cls: "channel-name", text: l.label }),
      el("span", { cls: "channel-handle", text: handle }), el("span", { cls: "channel-arrow", text: "↗" }),
    ]);
    a.querySelector(".channel-icon").innerHTML = iconFor(l.label);
    $("contact-channels").appendChild(el("li", {}, [a]));
  });

  // No backend: validate, then compose an email in the visitor's mail app.
  $("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("form-error");
    var bad = ["name", "email", "message"].filter(function (n) { return !f[n].value.trim(); });
    if (!bad.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad.push("email");
    ["name", "email", "message"].forEach(function (n) { f[n].setAttribute("aria-invalid", String(bad.indexOf(n) > -1)); });
    var out = $("compose-out");
    var LABEL = { name: "your name", email: "your email", message: "a message" };
    if (bad.length) {
      err.hidden = false;
      if (bad.indexOf("email") > -1 && f.email.value.trim()) {
        err.textContent = "That email address doesn’t look quite right.";
      } else {
        var missing = bad.map(function (n) { return LABEL[n]; });
        err.textContent = "Please add " + (missing.length > 1 ? missing.slice(0, -1).join(", ") + " and " + missing[missing.length - 1] : missing[0]) + ".";
      }
      f[bad[0]].focus();
      return;
    }
    err.hidden = true;
    var name = f.name.value.trim();
    var topic = (f.querySelector('input[name="topic"]:checked') || {}).value || "Hello";
    out.textContent = "✓ Opening your email app with the message ready to send.";
    track("contact-form-sent", "Contact form: " + topic);
    f.classList.add("sent");
    var subject = topic + " · from " + name;
    var body = f.message.value.trim() + "\n\n— " + name + " (" + f.email.value.trim() + ")";
    setTimeout(function () {
      window.location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }, reduceMotion ? 0 : 500);
  });

  // Footer: name and role, page links, the same social links as the hero.
  $("footer-name").textContent = c.name;
  $("footer-role").textContent = c.role.split("·")[0].trim();
  $("footer-location").textContent = c.location;
  $("footer-social").appendChild(iconLink("Email", "mailto:" + c.email));
  c.links.forEach(function (l) { $("footer-social").appendChild(iconLink(l.label, l.url)); });
  $("footer-text").textContent = "© " + new Date().getFullYear() + " " + c.name;

  // Rotating edge light on the manifest and the contact form (styles: .edge).
  document.querySelectorAll(".manifest, .contact-form").forEach(function (box) {
    var edge = el("span", { cls: "edge" }, [el("i")]);
    edge.setAttribute("aria-hidden", "true");
    box.appendChild(edge);
  });

  // ---------- Theme ----------
  var THEMES = { light: "Light", dark: "Dark" };
  function setTheme(t, announce) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    if (announce) toast("Theme: " + THEMES[t]);
  }
  $("theme-toggle").addEventListener("click", function () {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  // Follow OS changes until the visitor picks a theme themselves.
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) root.setAttribute("data-theme", e.matches ? "dark" : "light");
  });


  // ---------- Mobile menu ----------
  var menuBtn = $("menu-btn"), menu = $("mobile-menu");
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  // ---------- Scroll: progress bar + nav state ----------
  var progress = $("progress"), nav = $("nav"), ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    nav.classList.toggle("scrolled", scrollY > 8);
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Active-section indicator
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("#primary-nav a"));
  var indicator = $("nav-indicator");
  var activeId = null;
  function setActive(id) {
    activeId = id;
    var link = null;
    navLinks.forEach(function (a) {
      var on = a.dataset.nav === id;
      a.classList.toggle("active", on);
      if (on) { a.setAttribute("aria-current", "true"); link = a; } else a.removeAttribute("aria-current");
    });
    // The Contact section is represented by the "Let's talk" button rather than a link.
    document.querySelector(".nav-cta").classList.toggle("is-current", id === "contact");
    if (!link) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.transform = "translateX(" + link.offsetLeft + "px)";
  }
  if ("IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id === "top" ? null : en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "about", "work", "experience", "skills", "plan", "contact"].forEach(function (id) { navIo.observe($(id)); });
  }
  addEventListener("resize", function () { if (activeId) setActive(activeId); });

  // Reveal sections and stagger their children
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.id === "stats") countUp(en.target);
        en.target.querySelectorAll(".stagger").forEach(function (child, i) {
          var d = Math.min(i * 60, 480);
          child.style.transitionDelay = d + "ms";
          child.classList.add("in");
          // Drop the entrance delay afterwards so hover effects respond instantly.
          setTimeout(function () { child.style.transitionDelay = ""; }, d + 800);
        });
        io.unobserve(en.target);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".section, .stats").forEach(function (s) {
      s.classList.add("reveal");
      s.querySelectorAll(".principle, .case-tab, .career-seg, .tile, .hex, .pass, .quote, .stat, .phase").forEach(function (ch) { ch.classList.add("stagger"); });
      io.observe(s);
    });
  }

  // Animate numeric stats ("7+", "11") from zero; non-numeric values are left alone.
  function countUp(root) {
    root.querySelectorAll("dd").forEach(function (dd) {
      var m = dd.textContent.match(/^(\d+)(\D*)$/);
      if (!m) return;
      var target = +m[1], suffix = m[2], start = null, dur = 1400;
      function frame(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        dd.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      dd.textContent = "0" + suffix;
      requestAnimationFrame(frame);
    });
  }

  // Primary buttons lean slightly toward the cursor (mouse only, not touch).
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn.primary").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + (x * 8).toFixed(1) + "px," + (y * 6).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  // Cursor spotlight on cards (at most once per frame)
  var spotEvt = null;
  document.addEventListener("pointermove", function (e) {
    if (spotEvt === null) requestAnimationFrame(function () {
      var ev = spotEvt; spotEvt = null;
      var card = ev.target.closest && ev.target.closest(".spot");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (ev.clientX - r.left) + "px");
      card.style.setProperty("--my", (ev.clientY - r.top) + "px");
    });
    spotEvt = e;
  }, { passive: true });

  // Pause looping animations in sections that are off screen, so scrolling stays smooth.
  if ("IntersectionObserver" in window) {
    var idleIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("idle", !en.isIntersecting); });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll(".hero, .section").forEach(function (s) { idleIo.observe(s); });
  }

  // ---------- Command palette ----------
  var palette = $("palette"), input = $("palette-input"), listEl = $("palette-list");
  $("kbd-hint").textContent = isMac ? "⌘K" : "Ctrl K";

  function go(id) { return function () { $(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }; }
  var COMMANDS = [
    { group: "Navigate", label: "About", run: go("about") },
    { group: "Navigate", label: "Selected work (case studies)", run: go("work") },
    { group: "Navigate", label: "Workshops & talks", run: function () { document.querySelector(".workshops").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); } },
    { group: "Navigate", label: "Experience", run: go("experience") },
    { group: "Navigate", label: "Skills & certifications", run: go("skills") },
    { group: "Navigate", label: "Contact", run: go("contact") },
  ].concat(openMode && c.first90 ? [{ group: "Navigate", label: "My first 90 days", run: go("plan") }] : []).concat([
    { group: "Actions", label: "Copy email address", hint: c.email, run: function () { copy(c.email, "Email copied: " + c.email); } },
    { group: "Actions", label: "Print this page as a CV", run: function () { setTimeout(function () { window.print(); }, 150); } },
  ]);
  if (c.cv) {
    COMMANDS.splice(COMMANDS.length - 1, 0, { group: "Actions", label: "Download CV (PDF)", run: function () { var a = el("a", { href: c.cv }); a.download = ""; document.body.appendChild(a); a.click(); a.remove(); } });
  }
  c.links.forEach(function (l) {
    COMMANDS.push({ group: "Actions", label: "Open " + l.label, hint: "↗", run: function () { window.open(l.url, "_blank", "noopener"); } });
  });
  Object.keys(THEMES).forEach(function (k) {
    COMMANDS.push({ group: "Theme", label: "Theme: " + THEMES[k], theme: k, run: function () { setTheme(k, true); } });
  });

  var filtered = COMMANDS, sel = 0;
  function renderPalette() {
    var q = input.value.trim().toLowerCase();
    filtered = COMMANDS.filter(function (cmd) { return !q || (cmd.group + " " + cmd.label).toLowerCase().indexOf(q) > -1; });
    sel = Math.min(sel, Math.max(filtered.length - 1, 0));
    listEl.textContent = "";
    if (!filtered.length) { listEl.appendChild(el("li", { cls: "palette-empty", text: "No results" })); input.removeAttribute("aria-activedescendant"); return; }
    var lastGroup = null;
    filtered.forEach(function (cmd, i) {
      if (cmd.group !== lastGroup) { listEl.appendChild(el("li", { cls: "palette-group", text: cmd.group })); lastGroup = cmd.group; }
      var current = cmd.theme && cmd.theme === root.getAttribute("data-theme");
      var item = el("li", { cls: "palette-item" + (i === sel ? " sel" : "") }, [
        el("span", { text: cmd.label }),
        cmd.hint || current ? el("span", { cls: "palette-hint", text: current ? "current" : cmd.hint }) : null,
      ]);
      item.id = "cmd-" + i;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(i === sel));
      item.addEventListener("mousemove", function () { if (sel !== i) { sel = i; renderPalette(); } });
      item.addEventListener("click", function () { runCmd(i); });
      listEl.appendChild(item);
    });
    input.setAttribute("aria-activedescendant", "cmd-" + sel);
    var s = $("cmd-" + sel);
    if (s) s.scrollIntoView({ block: "nearest" });
  }
  function openPalette() {
    if (palette.open) return;
    setMenu(false);
    input.value = ""; sel = 0; renderPalette();
    palette.showModal();
    input.focus();
  }
  function closePalette() { if (palette.open) palette.close(); }
  function runCmd(i) { var cmd = filtered[i]; if (!cmd) return; closePalette(); cmd.run(); }

  $("open-palette").addEventListener("click", openPalette);
  input.addEventListener("input", function () { sel = 0; renderPalette(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + filtered.length) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === "Enter") { e.preventDefault(); runCmd(sel); }
  });
  palette.addEventListener("click", function (e) { if (e.target === palette) closePalette(); });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); palette.open ? closePalette() : openPalette(); }
    else if (e.key === "/" && !typing && !palette.open) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });

  // ---------- Visitor analytics (cookieless, GoatCounter) ----------
  // Counts only real people: the page's JavaScript must run (most bots never do), the browser must not be
  // automated, and the visitor must stay 5 s with the tab visible, scroll, or interact before anything is sent.
  // Links like ?ref=adyen show up in GoatCounter as the referrer "adyen", so you can see which application was opened.
  // Open the site once with ?me=1 to stop counting your own visits on that device (?me=0 undoes it).
  var gc = { on: false, human: false, sent: {}, queue: [] };
  function track(name, title) {
    if (!gc.on) return;
    if (!gc.human) { gc.queue.push([name, title]); return; }
    if (gc.sent[name]) return;
    gc.sent[name] = true;
    var data = {
      p: name ? name : location.pathname.replace(/\/?$/, "/"),
      t: title || document.title,
      e: name ? "true" : "false",
      r: gc.ref || document.referrer,
      q: location.search,
      s: [screen.width, screen.height, window.devicePixelRatio || 1].join(","),
      rnd: Math.random().toString(36).slice(2),
    };
    var url = "https://" + c.goatcounter + ".goatcounter.com/count?" + Object.keys(data).map(function (k) {
      return k + "=" + encodeURIComponent(data[k]);
    }).join("&");
    if (gc.debug) { console.info("[analytics]", name || "pageview", data); return; }
    if (!(navigator.sendBeacon && navigator.sendBeacon(url))) new Image().src = url;
  }
  (function () {
    var params = new URLSearchParams(location.search);
    try {
      if (params.get("me") === "1") { localStorage.setItem("no-analytics", "1"); toast("Your visits are no longer counted on this device"); }
      if (params.get("me") === "0") { localStorage.removeItem("no-analytics"); toast("Your visits are counted again on this device"); }
      if (localStorage.getItem("no-analytics")) return;
    } catch (e) {}
    if (!c.goatcounter) return;
    if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|skype/i.test(navigator.userAgent)) return;
    gc.debug = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    gc.ref = (params.get("ref") || params.get("utm_source") || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 40);
    gc.on = true;

    // Human gate: 5 s of visible time, a real scroll, or any interaction.
    var visibleMs = 0, since = document.visibilityState === "visible" ? Date.now() : null, timer = null;
    function becomeHuman() {
      if (gc.human) return;
      gc.human = true;
      clearInterval(timer);
      ["scroll", "pointerdown", "keydown"].forEach(function (ev) { removeEventListener(ev, onInteract, true); });
      track("", "");
      gc.queue.splice(0).forEach(function (a) { track(a[0], a[1]); });
    }
    function onInteract(e) { if (e.isTrusted && (e.type !== "scroll" || scrollY > 200)) becomeHuman(); }
    ["scroll", "pointerdown", "keydown"].forEach(function (ev) { addEventListener(ev, onInteract, { capture: true, passive: true }); });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") since = Date.now();
      else if (since) { visibleMs += Date.now() - since; since = null; }
    });
    timer = setInterval(function () {
      if (visibleMs + (since ? Date.now() - since : 0) >= 5000) becomeHuman();
    }, 1000);

    // Which sections were actually read: occupying the middle of the screen for 2 s (works for tall sections too).
    if ("IntersectionObserver" in window) {
      var timers = {};
      var readIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var id = en.target.id;
          if (en.isIntersecting) {
            timers[id] = setTimeout(function () {
              var h = en.target.querySelector("h2");
              track("read-" + id, "Read: " + (h ? h.textContent : id));
              readIo.unobserve(en.target);
            }, 2000);
          } else clearTimeout(timers[id]);
        });
      }, { rootMargin: "-40% 0px -40% 0px" });
      ["about", "work", "experience", "skills", "plan", "contact"].forEach(function (id) { readIo.observe($(id)); });
    }

    // Time on page milestones (visible time only).
    [[60000, "stayed-1-min", "Stayed 1+ min"], [180000, "stayed-3-min", "Stayed 3+ min"]].forEach(function (m) {
      var check = setInterval(function () {
        if (visibleMs + (since ? Date.now() - since : 0) >= m[0]) { track(m[1], m[2]); clearInterval(check); }
      }, 5000);
    });

    // Contact intent: email, LinkedIn, GitHub clicks and copying the email address.
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (a) {
        var href = a.getAttribute("href");
        if (/^mailto:/.test(href)) track("click-email", "Clicked: email");
        else if (/linkedin\.com/.test(href)) track("click-linkedin", "Clicked: LinkedIn");
        else if (/github\.com/.test(href)) track("click-github", "Clicked: GitHub");
      }
      if (e.target.closest && e.target.closest("#copy-email")) track("copy-email", "Copied email address");
    }, true);
  })();
})();
