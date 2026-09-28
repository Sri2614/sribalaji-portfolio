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

  // ---------- Hero ----------
  var linkedin = c.links.filter(function (l) { return /linkedin/i.test(l.label); })[0];
  $("brand").textContent = c.name;
  $("hero-availability").textContent = c.availability;
  $("hero-name").textContent = c.name;
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
  function tick() { clock.textContent = c.location.split(",")[0] + " · " + fmt.format(new Date()); }
  tick();
  setInterval(tick, 30000);

  // Manifest with minimal YAML highlighting (built from DOM nodes, not HTML strings).
  var code = $("manifest");
  c.manifest.forEach(function (line, i) {
    var row = el("span", { cls: "ln" });
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
    if (i < c.manifest.length - 1) code.appendChild(document.createTextNode("\n"));
  });
  $("manifest-copy").addEventListener("click", function () { copy(c.manifest.join("\n"), "Manifest copied"); });

  c.stats.forEach(function (s) {
    $("stats").appendChild(el("div", { cls: "stat" }, [el("dt", { text: s.label }), el("dd", { text: s.value })]));
  });

  // ---------- About ----------
  c.about.forEach(function (p) { $("about-text").appendChild(el("p", { text: p })); });
  c.facts.forEach(function (f) {
    $("facts").appendChild(el("div", {}, [el("dt", { text: f.k }), el("dd", { text: f.v })]));
  });
  if (c.dutch) {
    $("dutch-title").textContent = c.dutch.title;
    $("dutch-text").textContent = c.dutch.text;
    $("dutch").hidden = false;
  }
  c.principles.forEach(function (p, i) {
    $("principles").appendChild(el("article", { cls: "principle" }, [
      el("span", { cls: "principle-num", text: "0" + (i + 1) }),
      el("h4", { text: p.title }),
      el("p", { text: p.desc }),
    ]));
  });

  // ---------- Selected work (anonymised case studies) ----------
  c.caseStudies.forEach(function (cs, i) {
    function step(label, text) {
      return el("div", { cls: "case-step" }, [el("dt", { text: label }), el("dd", { text: text })]);
    }
    // Metrics render only when real ones are added in content.js.
    var metrics = cs.metrics && cs.metrics.length
      ? el("ul", { cls: "case-metrics" }, cs.metrics.map(function (m) { return el("li", { text: m }); }))
      : null;
    $("case-list").appendChild(el("article", { cls: "case spot" }, [
      el("div", { cls: "case-head" }, [
        el("span", { cls: "case-num", text: String(i + 1).padStart(2, "0") }),
        el("span", { cls: "case-context", text: cs.context }),
      ]),
      el("h3", { text: cs.title }),
      cs.myRole ? el("p", { cls: "case-role" }, [el("span", { text: "My role" }), el("strong", { text: cs.myRole })]) : null,
      el("dl", { cls: "case-steps" }, [
        step("Challenge", cs.challenge),
        step("Approach", cs.approach),
        step("Result", cs.result),
      ]),
      metrics,
      el("ul", { cls: "chips small" }, cs.stack.map(function (s) { return el("li", { text: s }); })),
    ]));
  });

  c.publicWork.forEach(function (p) {
    $("public-list").appendChild(el("a", { cls: "public-card spot", href: p.url }, [
      el("strong", { text: p.title }),
      el("span", { cls: "public-desc", text: p.desc }),
      el("span", { cls: "public-url", text: p.url.replace(/^https?:\/\//, "") + " ↗" }),
    ]));
  });
  c.workshops.forEach(function (w) {
    $("workshop-list").appendChild(el("li", {}, [el("strong", { text: w.title }), el("span", { text: w.where })]));
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
  bento.appendChild(el("article", { cls: "tile spot tile-certs" }, [
    el("div", { cls: "tile-head" }, [tileIcon("certs"), el("h3", { text: "Certified" })]),
    el("ul", { cls: "creds" }, c.certifications.map(function (cert) {
      return el("li", { cls: "cred" }, [el("span", { cls: "cred-issuer", text: cert.issuer }), el("span", { cls: "cred-name", text: cert.name })]);
    })),
  ]));
  var key = $("bento-key");
  key.appendChild(roleDots(c.roles.map(function (r) { return r.key; })));
  key.appendChild(document.createTextNode("Where I used it: " + c.roles.map(function (r) { return r.name; }).join(" · ")));

  // ---------- Experience ----------
  var VISIBLE = 4;
  c.experience.forEach(function (x) {
    var list = el("ul", { cls: "tl-points" }, x.points.map(function (p, i) {
      return el("li", { cls: i >= VISIBLE ? "extra" : "", text: p });
    }));
    var more = null;
    if (x.points.length > VISIBLE) {
      var hidden = x.points.length - VISIBLE;
      more = el("button", { cls: "more-btn", text: "Show " + hidden + " more" });
      more.type = "button";
      more.setAttribute("aria-expanded", "false");
      more.addEventListener("click", function () {
        var open = list.classList.toggle("open");
        more.setAttribute("aria-expanded", String(open));
        more.textContent = open ? "Show less" : "Show " + hidden + " more";
      });
    }
    var stack = x.stack ? el("ul", { cls: "chips small" }, x.stack.map(function (s) { return el("li", { text: s }); })) : null;
    $("timeline").appendChild(el("li", { cls: "tl-item" }, [
      el("div", { cls: "tl-when", text: x.period }),
      el("div", { cls: "tl-body" }, [
        el("h3", {}, [
          el("span", { text: x.role + " · " }),
          x.url ? el("a", { cls: "tl-company", text: x.company + " ↗", href: x.url }) : el("span", { cls: "tl-company", text: x.company }),
        ]),
        x.meta ? el("p", { cls: "tl-meta", text: x.meta }) : null,
        list, more, stack,
      ]),
    ]));
  });

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
  if (linkedin) $("linkedin-btn").href = linkedin.url; else $("linkedin-btn").remove();

  // No backend: validate, then compose an email in the visitor's mail app.
  $("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("form-error");
    var bad = ["name", "email", "message"].filter(function (n) { return !f[n].value.trim(); });
    if (!bad.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad.push("email");
    ["name", "email", "message"].forEach(function (n) { f[n].setAttribute("aria-invalid", String(bad.indexOf(n) > -1)); });
    if (bad.length) {
      err.hidden = false;
      err.textContent = bad.indexOf("email") > -1 && f.email.value.trim() ? "Please enter a valid email address." : "Please fill in every field.";
      f[bad[0]].focus();
      return;
    }
    err.hidden = true;
    var subject = "Hello from " + f.name.value.trim();
    var body = f.message.value.trim() + "\n\n— " + f.name.value.trim() + " (" + f.email.value.trim() + ")";
    window.location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  $("footer-text").textContent = "© " + new Date().getFullYear() + " " + c.name + " · Hand-built with HTML, CSS & JS";

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
    if (!link) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.transform = "translateX(" + link.offsetLeft + "px)";
  }
  if ("IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id === "top" ? null : en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "about", "work", "experience", "skills", "contact"].forEach(function (id) { navIo.observe($(id)); });
  }
  addEventListener("resize", function () { if (activeId) setActive(activeId); });

  // Reveal sections and stagger their children
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        en.target.querySelectorAll(".stagger").forEach(function (child, i) {
          child.style.transitionDelay = Math.min(i * 60, 480) + "ms";
          child.classList.add("in");
        });
        io.unobserve(en.target);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".section, .stats").forEach(function (s) {
      s.classList.add("reveal");
      s.querySelectorAll(".principle, .case, .public-card, .tl-item, .tile, .quote, .stat").forEach(function (ch) { ch.classList.add("stagger"); });
      io.observe(s);
    });
  }

  // Cursor spotlight on cards
  document.addEventListener("pointermove", function (e) {
    var card = e.target.closest && e.target.closest(".spot");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // ---------- Command palette ----------
  var palette = $("palette"), input = $("palette-input"), listEl = $("palette-list");
  $("kbd-hint").textContent = isMac ? "⌘K" : "Ctrl K";

  function go(id) { return function () { $(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }; }
  var COMMANDS = [
    { group: "Navigate", label: "About", run: go("about") },
    { group: "Navigate", label: "Selected work (case studies)", run: go("work") },
    { group: "Navigate", label: "Public work & workshops", run: function () { document.querySelector(".public").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); } },
    { group: "Navigate", label: "Experience", run: go("experience") },
    { group: "Navigate", label: "Skills & certifications", run: go("skills") },
    { group: "Navigate", label: "Contact", run: go("contact") },
    { group: "Actions", label: "Copy email address", hint: c.email, run: function () { copy(c.email, "Email copied: " + c.email); } },
    { group: "Actions", label: "Print this page as a CV", run: function () { setTimeout(function () { window.print(); }, 150); } },
  ];
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
})();
