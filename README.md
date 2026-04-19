# Portfolio

My personal portfolio website built with Astro and React.

## What matters most

- Responsive bento-style homepage
- Light and dark mode toggle
- Interactive map section (Mapbox)
- About pages generated from Markdown content
- Simple deploy flow to Vercel

## Tech

- Astro 5
- React 19
- Tailwind CSS 4
- Mapbox GL JS

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321`

## Build and preview

```bash
pnpm build
pnpm preview
```

## Environment variable

Create a `.env` file:

```bash
PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
```

Use `PUBLIC_` because this value is used on the client side.

## Update About content

Add or edit Markdown files in `src/content/about/`.

Required frontmatter fields:

- `title`
- `label`
- `description` (optional)

The filename becomes the route slug.
Example: `my-story.md` -> `/about/my-story`

## Deploy

Configured for Vercel. Add `PUBLIC_MAPBOX_TOKEN` in project environment variables before deploying.

## License

Personal use.
