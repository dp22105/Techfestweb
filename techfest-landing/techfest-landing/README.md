# Techfest — Concept Landing Page

A landing page concept for **Techfest, IIT Bombay** (techfest.org). Plain HTML, CSS and JavaScript. No build step, no frameworks, no 3D assets.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Fonts (Unbounded, Inter, JetBrains Mono) load from Google Fonts, so you need an internet connection for the intended look. The page falls back to system fonts offline.

## Concept: "Signal lock"

Techfest pulls in people from thousands of colleges toward one campus. The page treats that as a signal being locked on:

- **Boot sequence** that "links" colleges to IIT Bombay (skippable, shown once per session)
- **Node network** background (canvas, 2D) that reaches toward your cursor
- **Wordmark** whose outlined letters fill with lime as the pointer nears them
- **Live countdown** to 16 Dec 2026 (IST) that switches to "live now" and "see you next year" automatically
- **Animated stat counters**, an **expanding experience panel** (Competitions / Lectures / Exhibitions / Workshops)
- **Filterable competition cards** with a cursor-following spotlight
- **"Road to finale" timeline** that reads today's date and marks what is done and what is next

Also: custom cursor, scroll progress bar, mobile menu, `prefers-reduced-motion` support, keyboard focus states, semantic HTML.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Structure and content |
| `styles.css` | Design tokens, layout, animation |
| `script.js` | Boot sequence, canvas, countdown, filters, timeline |

## Content sources and caveats

Content was assembled from public sources (Wikipedia, IIT Bombay alumni newsletters, press coverage, and public 2026 competition listings), because techfest.org itself could not be fetched during research. Before shipping:

- Confirm dates, prize pools and the competition list against the official site.
- Swap the text wordmark for the official logo and brand assets.
- Replace the stats with the organisers' current figures.

## Customise

Colours and fonts are CSS variables at the top of `styles.css`. Competition cards and timeline items are plain HTML in `index.html`; the countdown dates are at the top of the countdown section in `script.js`.
