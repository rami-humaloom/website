# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Humaloom marketing website — a static HTML site for an AI-powered L&D (Learning & Development) SaaS product targeting lean HR teams at SMBs. There is no build system, no package manager, and no framework.

## Architecture

Pure static HTML with no build step:

- `index.html` — Home/landing page
- `how-it-works.html` — Product walkthrough page
- `about.html` — Company mission page
- `contact.html` — Demo booking / contact page
- `404.html` — Custom 404 page
- `staticwebapp.config.json` — Azure Static Web Apps routing and security headers config

**Styling:** Tailwind CSS loaded via CDN (`https://cdn.tailwindcss.com`). The Tailwind config (custom colors, fonts) is inlined in a `<script>` block at the top of each HTML file. No separate CSS files.

**Fonts:** Poppins (headings, `font-heading`) and DM Sans (body, `font-body`) from Google Fonts.

**Color palette:**
- `brand-*` — Indigo/purple scale, primary CTA color is `brand-500` (#4F46E5)
- `accent-*` — Green scale, used for positive indicators (#10B981)
- `slate-*` — Neutral gray scale for text and backgrounds

**Animations:** Scroll-triggered fade-up via IntersectionObserver + CSS classes (`.fade-up`, `.fade-up.visible`). Stagger delays applied via `.stagger > .fade-up:nth-child(n)` selectors.

**JS:** Vanilla JavaScript only, inlined in each page's `<script>` block at the bottom. Each page handles its own mobile drawer toggle and scroll animations independently.

## Deployment

Deployed to Azure Static Web Apps. CI/CD pipeline triggers on push to the `prod-env` branch (not `main`). To deploy:
1. Merge/push changes to the `prod-env` branch
2. The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-black-desert-0e7de4310.yml`) handles deployment automatically

There is no local dev server or build step — open HTML files directly in a browser to preview, or use any static file server (e.g., `npx serve .`).

## Conventions

- The Tailwind config block is duplicated in each HTML file's `<head>`. When adding new custom colors or fonts, update all pages.
- Images use `placehold.co` as placeholders — these should be replaced with real assets before production use.
- The `Content-Security-Policy` in `staticwebapp.config.json` restricts external resources. If adding new external scripts, fonts, or image domains, update the CSP accordingly.
- Navigation active state (`nav-link active` class) and mobile drawer active highlighting are hardcoded per page — update them when adding new pages.
- The footer year is dynamically set via JS: `document.getElementById('footer-year').textContent = new Date().getFullYear()`.
