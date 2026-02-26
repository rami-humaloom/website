# Humaloom Website

Static marketing site for Humaloom. Pure HTML + Tailwind CSS.

## Local development

Open any `.html` file directly in a browser, or serve the directory:

```bash
npx serve .
```

## Making changes

### HTML / content
Edit the `.html` files directly. No build step needed unless you add new Tailwind classes (see below).

### Styles (Tailwind)
Install dependencies once:

```bash
npm install
```

After adding or changing Tailwind utility classes in the HTML, rebuild the CSS:

```bash
npm run build
```

While actively editing, use watch mode to rebuild automatically:

```bash
npm run watch
```

The generated `assets/css/output.css` is committed to the repo — always commit it alongside your HTML changes.

To change the theme (colors, fonts), edit `tailwind.config.js` and rebuild.

### Custom CSS
Each page has a `<style>` block in `<head>` for non-Tailwind styles (animations, drawer, grain overlay, etc.). Edit those directly.

## Deploying

Merge `main` to the `prod-env` branch. GitHub Actions deploys to Azure Static Web Apps automatically.
