# Wake Anchor · Sleep Experiment Tracker

Static PWA build of two companion apps:

- **Wake Anchor** (site root) — answer seven steps, get a personalized
  evidence-based sleep schedule, then a ~3-week self-experiment that tests it
  against pre-registered rules.
- **The original experiment** (`/original/`) — the author's own pre-registered
  10:30 -> 7:00 run that Wake Anchor grew out of. (`/wake-anchor/` redirects
  to the root for old links.)

All data stays in your browser's `localStorage` — nothing is sent anywhere.
Open the site in Safari/Chrome and use *Add to Home Screen* for an app-like
install; a service worker keeps it working offline.

Live: https://jonathon946.github.io/sleep-tracker/

Pushes to `main` are mirrored to `gh-pages` by the workflow in
`.github/workflows/`, and GitHub Pages serves that branch. The HTML is
generated output; canonical sources are maintained elsewhere.
