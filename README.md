# Sleep Experiment Tracker · Wake Anchor

Static PWA build of two companion apps:

- **Sleep Experiment Tracker** (site root) — a ~3-week self-experiment: baseline
  -> stabilize -> measure, with a pre-registered verdict on when your body wants
  to wake.
- **Wake Anchor** (`/wake-anchor/`) — answer seven steps, get a personalized
  evidence-based sleep schedule, then run the same experiment against it.

All data stays in your browser's `localStorage` — nothing is sent anywhere.
Open the site in Safari/Chrome and use *Add to Home Screen* for an app-like
install; a service worker keeps it working offline.

Deployed automatically to GitHub Pages by the workflow in `.github/workflows/`.
The HTML is generated output; canonical sources are maintained elsewhere.
