# Humaloom Website

Static marketing site for Humaloom. Pure HTML + Tailwind CSS.

## Local development

For active development, run two terminals in parallel:

**Terminal 1** — auto-rebuilds CSS on save:
```bash
npm run watch
```

**Terminal 2** — serves source files directly and proxies `/api/*` to the Azure Function:
```bash
npx swa start . --api-location api
```

HTML changes are visible on refresh immediately. CSS changes are picked up automatically by watch. The contact and subscribe forms work end-to-end in this mode. Open [http://localhost:4280](http://localhost:4280) in your browser.

To preview the exact production artifact before deploying (builds `dist/` and serves it with API):

```bash
npm run preview
```

To preview the static site only (no API): 
```bash
npm run build
npx serve dist -l 59000
```

## Making changes

### HTML / content
Edit the `.html` files directly. No build step needed unless you add new Tailwind classes (see below).

### Styles (Tailwind)
Install dependencies once:

```bash
npm install
```

After adding or changing Tailwind utility classes in the HTML, rebuild:

```bash
npm run build
```

This compiles `assets/css/output.css` and assembles the `dist/` folder. Neither is committed — both are gitignored and regenerated on each build.

While actively editing, use watch mode to rebuild CSS automatically:

```bash
npm run watch
```

To change the theme (colors, fonts), edit `tailwind.config.js` and rebuild.

### Custom CSS
Each page has a `<style>` block in `<head>` for non-Tailwind styles (animations, drawer, grain overlay, etc.). Edit those directly.

## Testing the contact form API locally

The contact form posts to an Azure Function in `api/`. To run it locally we installed the [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) with brew.

`@azure/static-web-apps-cli` is included as a dev dependency so that `npx swa start` can proxy `/api/*` requests to the local function. Without it, the static server and the function run on different ports and the forms can't reach the API.

1. We created `api/local.settings.json` (gitignored) with our Postmark token.

2. Start the function:

```bash
cd api && npm install && func start
```

3. POST to `http://localhost:7071/api/contact` with a JSON body:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "message": "Hi, I'd like to learn more about Humaloom.",
  "website": ""
}
```

Keep `"website"` as an empty string — it's a honeypot field used to filter bots, and a non-empty value will silently discard the submission and return 200.

## Blog images

Blog hero images come from [Unsplash](https://unsplash.com/s/photos/budget?license=free) — filter by **Free** license. Download the full-size image, name it descriptively (e.g. `kelly-sikkema-3-Tc_5LROrM-unsplash.jpg`), and place it in `assets/images/blog/`. See the "Adding a New Blog Post" section in `CLAUDE.md` for where to reference it in the post and listing card.

Before adding the image, resize it to match the other images in `assets/images/blog/` using Preview on Mac:

1. Double-click the image to open it in Preview.
2. Click **Tools** in the top menu bar.
3. Select **Adjust Size...** from the dropdown.
4. Set the width to match the existing blog images and click **OK**.

## Deploying

Merge `main` to the `prod-env` branch. GitHub Actions deploys to Azure Static Web Apps automatically.

# Google Analytics Setup

- Humaloom’s Google Analytics 4 `GA4` setup was created for the website humaloom.ai as a web data stream with Enhanced Measurement enabled, allowing baseline tracking such as page views, scrolls, outbound clicks, and other automatic interaction data. 
- Go to [Google Analytics](https://analytics.google.com/) with teh Humaloom Gmail login in order to access the collected data.
- We have an if condition to fire analytics events only on the Production website, so the analytics won't be polluted by any localhost traffic.

## Humaloom GA4 Events

| Event | Trigger | Why it matters |
|-------|---------|----------------|
| `demo_booking_click`        | Click any Calendly link                                  | Primary conversion; most important metric |
| `cta_click`                 | Click "Lock in Special Pricing" hero CTA on `index.html` | Secondary conversion intent signal |
| `contact_form_start`        | First focusin on any contact form field                  | Measures form engagement vs. abandonment |
| `contact_form_submit_click` | Click "Send Message" button                              | Captures intent before validation; reveals validation drop-off |
| `generate_lead`             | Successful POST to `/api/contact` (`res.ok`)             | Confirmed lead — highest-value contact funnel event |
| `blog_article_click`        | Click any article card on `blog.html`                    | Shows which topics attract readers |