# sribalaji-portfolio

Personal portfolio of **Sri Balaji**, Senior Cloud & Platform Engineer (Kubernetes · DevSecOps · regulated banking), based in Almere, NL.

**Live:** https://sri2614.github.io/sribalaji-portfolio/

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

- No cookies, no trackers, no third-party requests (system fonts, inline SVG)
- Light/dark theme that follows the OS, command menu (⌘K / Ctrl K), print-to-CV stylesheet
- Respects `prefers-reduced-motion`; WCAG AA colour contrast

## Editing

All text lives in [`content.js`](content.js): profile, case studies, experience, skills and links.
`index.html` holds the structure, `styles.css` the design, `app.js` the rendering and interactions.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.
