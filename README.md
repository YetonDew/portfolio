# Portfolio

Personal portfolio built with Astro + React, featuring a bento-style layout, interactive Mapbox map, technology slider, and a GitHub stars card with confetti.

## Stack

- Astro 5
- React 19 (`@astrojs/react`)
- TailwindCSS 4 (`@tailwindcss/vite`)
- Mapbox GL JS
- canvas-confetti
- Astro Vercel adapter (`@astrojs/vercel`)

## Features

- Responsive layout (mobile-first + bento grid on desktop)
- Light/dark mode
- Interactive map card with theme-aware style
- Infinite technology slider
- GitHub stars card with:
  - Live stars count from GitHub REST API
  - Link to repo stargazers page
  - Per-browser visual "starred" state for UI feedback
  - Confetti effect on click

## Main Structure

```text
src/
  components/
    Main.astro
    Map.jsx
    Slider.astro
    Toggle.astro
    LikeButton.jsx
  pages/
    index.astro
    about.astro
    about/
      [slug].astro
  layouts/
    Layout.astro
  content/
    config.ts
    about/
      more-about-my-journey.md
```

## Environment Variables

Create a `.env` file in the project root:

```bash
PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
```

A template is included in `.env.example`.

Notes:

- Use `PUBLIC_` because this token is exposed to the client (frontend).
- Do not commit `.env` to the repository.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Astro Content Collections

This project uses Astro Content Collections to manage article-like pages from Markdown files.

- Collection config: `src/content/config.ts`
- Collection name: `about`
- Content folder: `src/content/about/`
- Example entry: `src/content/about/more-about-my-journey.md`

Each Markdown file contains frontmatter (`title`, `label`, `description`) and body content.
The dynamic template reads that metadata and renders the article body through Astro's content API.

### Adding a New Article

1. Create a new `.md` file in `src/content/about/`.
2. Add frontmatter fields that match the collection schema.
3. Use the file name as the route slug (for example: `my-story.md` -> `/about/my-story`).

## Routing and Navigation

Routing combines static pages, dynamic routes, redirect helpers, and client-side transitions.

- Home page: `src/pages/index.astro`
- About redirect entry: `src/pages/about.astro`
- Dynamic article route: `src/pages/about/[slug].astro`

### How It Works

1. `src/pages/about.astro` redirects to the current default article route.
2. `src/pages/about/[slug].astro` uses `getStaticPaths()` with the `about` collection to generate pages.
3. `ClientRouter` is enabled in `src/layouts/Layout.astro` so route changes happen without full page reload.
4. Shared-element transitions (`transition:name`) are used between the main "more info" button and the About close button.
5. Theme state is reapplied on `astro:page-load`, so dark/light mode stays consistent across client-side navigation.

## Vercel Deployment

This project is already configured for Vercel in `astro.config.mjs`:

- `output: 'server'`
- `adapter: vercel()`

### Steps

1. Import the repository in Vercel
2. In **Settings > Environment Variables**, add:
   - `PUBLIC_MAPBOX_TOKEN`
3. Redeploy

## Security

- The hardcoded Mapbox token was removed from source code and git history.
- The token is now read from `import.meta.env.PUBLIC_MAPBOX_TOKEN` in `src/components/Map.jsx`.

## Troubleshooting

### 1) Map does not appear

- Verify `PUBLIC_MAPBOX_TOKEN` is configured.
- If the console shows `WebGL not supported`, enable hardware acceleration in your browser.

### 2) Push blocked by secret scanning (GH013)

If a secret is committed again, GitHub push protection will block the push.

Best practices:

- Never hardcode secrets/tokens in source code
- Use `.env` for local development
- Use environment variables in Vercel/GitHub Actions

### 3) Stars count does not update immediately

- The stars count comes from GitHub API and may not update instantly due to caching/rate limits.
- The component re-fetches stars when the tab regains focus.

## Useful Commands

```bash
# development
pnpm dev

# local production build
pnpm build && pnpm preview

# check git status
git status
```

## License

Personal use.
