# EPAM CloudForge Journey

Static landing page built with plain HTML, CSS, and JavaScript — ready for GitHub Pages without a build step.

## Structure

```
├── index.html          # Main page
├── css/styles.css      # All styles
├── js/main.js          # Toast + scroll-sync logic
└── assets/bg.svg       # Background image
```

## Local preview

Open `index.html` in a browser, or run a simple static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` (or `master`) and folder **`/ (root)`**.
5. Save — the site will be available at `https://<username>.github.io/<repo>/`.

All asset paths are relative, so the site works both at the domain root and in a project subdirectory.

## Features

- Hero section with animated service cards
- Scroll-driven tab navigation (Intersection Observer)
- Keyboard accessible tabs
- `prefers-reduced-motion` support
- Responsive layout (desktop / tablet / mobile)
