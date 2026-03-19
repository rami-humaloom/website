# Humaloom Website

Static marketing site for Humaloom. Pure HTML + Tailwind CSS.

## Local development

Open any `.html` file directly in a browser, or serve the directory:

```bash
npx serve . -l 59000
```

To preview the exact production artifact (what gets deployed to Azure):

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

Keep `"website"` as an empty string — it's a honeypot field used to filter bots, and a non-empty value will silently discard the submissio, and return 200.

## Deploying

Merge `main` to the `prod-env` branch. GitHub Actions deploys to Azure Static Web Apps automatically.
