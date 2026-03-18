# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Humaloom marketing website — a static HTML site for an AI-powered L&D (Learning & Development) SaaS product targeting lean HR teams at SMBs.

## Architecture

Pure static HTML. Tailwind CSS is compiled locally via the CLI — there is no runtime build step:

- `index.html` — Home/landing page
- `how-it-works.html` — Product walkthrough page
- `about.html` — Company mission page
- `contact.html` — Demo booking / contact page
- `404.html` — Custom 404 page
- `staticwebapp.config.json` — Azure Static Web Apps routing and security headers config
- `tailwind.config.js` — Tailwind theme config (colors, fonts)
- `assets/css/input.css` — Tailwind directives (`@tailwind base/components/utilities`)
- `assets/css/output.css` — **Generated, not committed** (gitignored). Run `npm run build` to regenerate after changing HTML classes.
- `dist/` — **Generated, not committed** (gitignored). Assembled by `npm run build`. Contains only the files served in production (HTML pages, `output.css`, images, `staticwebapp.config.json`).
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
1. Merge/push changes to the `prod-env` branch
2. The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-black-desert-0e7de4310.yml`) builds CSS, assembles `dist/`, and deploys it automatically

The workflow runs `npm run build` (which compiles CSS and assembles `dist/`), then deploys only `dist/` to Azure — keeping build tooling files, source CSS, and internal docs out of the deployment artifact.

For local development: open HTML files directly in a browser, or use `npx serve .`. Use `npm run watch` to auto-rebuild CSS while editing. To preview the exact production artifact locally: run `npm run build` then `npx serve dist`.

## Adding a New Blog Post

Blog post pages live in `blog/` and follow a consistent structure. To add a new post:

1. **Create `blog/<slug>.html`** — copy an existing post (e.g. `blog/why-smb-training-fails.html`) as the starting point. Update:
   - `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:url`
   - The category badge text and color (`bg-brand-50 text-brand-600` for SMB Training/Training ROI, `bg-accent-50 text-accent-700` for Frontline Learning)
   - `<h1>`, subhead `<p>`, publish date, and read time in the article header
   - The full article body
   - The soft CTA text and link
   - The 2 related post cards at the bottom (titles, dates, read times, and `href` values)

2. **Update `blog.html`** — add a new card in the "More Articles" grid (or promote to featured). Fill in title, description, category badge, date, read time, and `href="blog/<slug>.html"`. Remove the empty placeholder slot if used. Add `data-category="<slug>"` to the `<article>` element so the filter buttons work. Current slugs: `smb-training`, `training-roi`. To add a new category, also add a corresponding `<button data-filter="<slug>">` in the Topic Filters section of `blog.html`.

3. **Add the hero image** — place the image in `assets/images/blog/`. Then:
   - In the post page, add a hero image block between the article header and article body:
     ```html
     <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
         <img src="/assets/images/blog/<filename>" alt="..." class="w-full rounded-2xl object-cover max-h-96">
     </div>
     ```
   - In `blog.html`, replace the placeholder `<div class="bg-gradient-to-br ...">` in the card with:
     ```html
     <div class="h-44 overflow-hidden">
         <img src="/assets/images/blog/<filename>" alt="..." class="w-full h-full object-cover">
     </div>
     ```
   - In related article cards on other post pages, replace the same placeholder div with:
     ```html
     <div class="h-36 overflow-hidden">
         <img src="/assets/images/blog/<filename>" alt="..." class="w-full h-full object-cover">
     </div>
     ```

4. **Update related posts on other pages** — if the new post is related to existing ones, add it as a related card on those pages too (with its image).

5. **Run `npm run build`** to verify the build succeeds and the new file appears in `dist/blog/`.

**Path conventions for `blog/` pages:**
- Nav/footer links use `../` prefix (e.g. `../index.html`, `../blog.html`)
- Cross-links between posts use filename only (e.g. `fix-smb-training.html`)
- Asset paths (`/assets/css/output.css`, `/assets/images/logo.jpeg`) are already absolute — no change needed

**Blog post page structure (in order):**
1. Nav + mobile drawer (Blog link marked active)
2. Article header: back link, category badge, `<h1>`, subhead, date + read time
3. Article body in `max-w-3xl mx-auto` column
4. Soft CTA box (`bg-brand-50 border border-brand-100 rounded-2xl`)
5. Related articles section (2-up grid, `bg-slate-50`)
6. Footer

## Conventions

- The Tailwind config block is duplicated in each HTML file's `<head>`. When adding new custom colors or fonts, update all pages.
- Images use `placehold.co` as placeholders — these should be replaced with real assets before production use.
- The `Content-Security-Policy` in `staticwebapp.config.json` restricts external resources. If adding new external scripts, fonts, or image domains, update the CSP accordingly.
- Navigation active state (`nav-link active` class) and mobile drawer active highlighting are hardcoded per page — update them when adding new pages.
- The footer year is dynamically set via JS: `document.getElementById('footer-year').textContent = new Date().getFullYear()`.
