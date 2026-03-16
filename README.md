# Portfolio

Personal portfolio built with Astro + React, featuring a bento-style layout, interactive Mapbox map, technology slider, and a global like counter with confetti.

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
- Like counter with:
  - Increment and decrement (`like` / `unlike`)
  - Per-browser cookie (`portfolio_liked`)
  - Confetti effect on like
  - Optimistic UI updates

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
    api/
      likes.ts
  layouts/
    Layout.astro
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

## Likes API

Endpoint file: `src/pages/api/likes.ts`

- `GET /api/likes`
  - Returns `{ count }`
- `POST /api/likes`
  - If cookie `portfolio_liked=1` does not exist: increments and sets cookie
  - If cookie already exists: does not increment
- `DELETE /api/likes`
  - If cookie exists: decrements (minimum 0) and clears cookie

### Current persistence model

The counter is currently stored in `/tmp/portfolio_likes.json`.

This works locally, but in serverless environments (such as Vercel), `/tmp` is ephemeral. The counter may reset across executions or deployments.

For true production persistence, migrate storage to a DB/KV solution (for example Vercel KV, Supabase, Redis, etc.).

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

### 3) Like counter does not persist in production

This is expected with `/tmp` on serverless. Migrate storage for durable persistence.

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
