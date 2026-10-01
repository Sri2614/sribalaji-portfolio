# sribalaji-portfolio

Personal portfolio of **Sri Balaji**, Senior Cloud & Platform Engineer (Kubernetes · DevSecOps · regulated banking), based in Almere, NL.

**Live:** https://sri2614.github.io/sribalaji-portfolio/

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

- No cookies and no third-party scripts (system fonts, inline SVG)
- Optional cookieless analytics via GoatCounter (see below)
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

## Visitor analytics

Set `goatcounter` in `content.js` to your GoatCounter code to turn it on (`null` = off). It uses no cookies
and loads no third-party script: the site sends GoatCounter one small request itself.

- **Humans only:** nothing is sent unless the page's JavaScript runs, the browser isn't automated or a known
  bot, and the visitor keeps the tab visible for 5 s, scrolls, clicks or types. Link-preview bots
  (LinkedIn, Slack, WhatsApp…) never count.
- **Per-application links:** share `https://sri2614.github.io/sribalaji-portfolio/?ref=adyen` and the visit
  shows in GoatCounter with the referrer `adyen`.
- **Events:** `read-about`, `read-work`, `read-experience`, `read-skills`, `read-contact` (section in the middle
  of the screen for 2 s), `stayed-1-min`, `stayed-3-min`, `click-email`, `click-linkedin`, `click-github`,
  `copy-email`, `contact-form-sent`.
- **Exclude yourself:** open the site once with `?me=1` on each of your devices (`?me=0` undoes it).
- On `localhost` nothing is sent; events are logged to the browser console instead.

### Private dashboard

`/visitors/` is a private dashboard (not linked anywhere, `noindex`). It contains no data: it unlocks with a
GoatCounter API key (Export permission) that is kept only in that browser, and pulls GoatCounter's export API
directly. Requires **Individual pageviews** to be enabled in GoatCounter.

- **People:** create a personal link per person (random `?ref=` code). Names stay in that browser; use
  Download / Restore backup to move the list between devices.
- **Visits:** each visit with name and company for personal links, plus location, device, source, sections read,
  time on site and contact actions. Bots are removed.
- Opening the dashboard on a device also stops that device's visits being counted.
- `/visitors/?demo` shows it with made-up sample data.
