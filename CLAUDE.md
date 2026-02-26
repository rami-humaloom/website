# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Humaloom marketing website — a static HTML site for an AI-powered L&D (Learning & Development) SaaS product targeting lean HR teams at SMBs.

## Architecture

Pure static HTML. Tailwind CSS is built locally and committed as a static asset — there is no runtime build step:

- `index.html` — Home/landing page
- `how-it-works.html` — Product walkthrough page
- `about.html` — Company mission page
- `contact.html` — Demo booking / contact page
- `404.html` — Custom 404 page
- `staticwebapp.config.json` — Azure Static Web Apps routing and security headers config
- `tailwind.config.js` — Tailwind theme config (colors, fonts)
- `assets/css/input.css` — Tailwind directives (`@tailwind base/components/utilities`)
- `assets/css/output.css` — **Generated and committed.** Run `npm run build` to regenerate after changing HTML classes.
- `package.json` — Dev dependency (`tailwindcss ^3`) and build/watch scripts

**Styling:** Tailwind CSS built locally via the Tailwind CLI. Each HTML file links to `/assets/css/output.css`. The shared theme config lives in `tailwind.config.js` — do not inline Tailwind config in HTML files.

**Fonts:** Poppins (headings, `font-heading`) and DM Sans (body, `font-body`) from Google Fonts.

**Color palette:**
- `brand-*` — Indigo/purple scale, primary CTA color is `brand-500` (#4F46E5)
- `accent-*` — Green scale, used for positive indicators (#10B981)
- `slate-*` — Neutral gray scale for text and backgrounds

**Animations:** Scroll-triggered fade-up via IntersectionObserver + CSS classes (`.fade-up`, `.fade-up.visible`). Stagger delays applied via `.stagger > .fade-up:nth-child(n)` selectors.

**JS:** Vanilla JavaScript only, inlined in each page's `<script>` block at the bottom. Each page handles its own mobile drawer toggle and scroll animations independently.

## Deployment

Deployed to Azure Static Web Apps. CI/CD pipeline triggers on push to the `prod-env` branch (not `main`). To deploy:
1. Run `npm run build` to regenerate `assets/css/output.css` (required if any Tailwind classes changed)
2. Commit the updated `output.css`
3. Merge/push changes to the `prod-env` branch
4. The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-black-desert-0e7de4310.yml`) handles deployment automatically (`skip_app_build: true` — no server-side build)

For local development: open HTML files directly in a browser, or use `npx serve .`. Use `npm run watch` to auto-rebuild CSS while editing.

## Conventions

- The Tailwind config block is duplicated in each HTML file's `<head>`. When adding new custom colors or fonts, update all pages.
- Images use `placehold.co` as placeholders — these should be replaced with real assets before production use.
- The `Content-Security-Policy` in `staticwebapp.config.json` restricts external resources. If adding new external scripts, fonts, or image domains, update the CSP accordingly.
- Navigation active state (`nav-link active` class) and mobile drawer active highlighting are hardcoded per page — update them when adding new pages.
- The footer year is dynamically set via JS: `document.getElementById('footer-year').textContent = new Date().getFullYear()`.
