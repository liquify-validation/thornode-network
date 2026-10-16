# Thornode Network – classic dashboard

THORChain node monitoring dashboard, served at `https://thornode.network/v1/`.

## Requirements

- Node.js 22.12 or later (or 20.19+)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173/v1/. The dashboard reads live data from `https://api.liquify.com/thor/api`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm test` | Run the unit tests |
| `npm run typecheck` | Type-check without building |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## Deployment (nginx)

1. Build: `npm ci && npm run build`
2. Copy the contents of `dist/` to `/var/www/thornode-classic` on the server.
3. Add the contents of `deploy/nginx.conf` to the `thornode.network` server block.
4. Test and reload nginx: `sudo nginx -t && sudo systemctl reload nginx`

For later releases, repeat steps 1 and 2. The config serves `index.html` uncached and the
fingerprinted files in `assets/` with long-term caching, so new builds take effect immediately.

The config sets a Content-Security-Policy. If the app needs to call another host, add it to
`connect-src` (API calls) or `img-src`/`font-src` as appropriate.

## Common changes

| To change | Edit |
| --- | --- |
| API host | `API_BASE` in `src/api/client.ts` |
| Chain columns shown on the active table | `CHAINS` in `src/types.ts`, plus an icon in `chainIcons` in `src/assets/index.ts` |
| ISP logos | `ispLogos` in `src/assets/index.ts` (image in `src/assets/isp/`) |
| Churn labels (churn-in threshold, worst performer age) | constants at the top of `src/lib/nodes.ts` |
| Refresh interval | `REFRESH_MS` in `src/hooks/networkData.tsx` |
| Overview tiles | `src/components/dashboard/OverviewStats.tsx` |
| Table columns | `COLUMNS` in `src/components/dashboard/NodeTable.tsx` and the cells in `NodeRow.tsx` |
| Version menu links | `src/components/layout/PageLayout.tsx` |
| Base path (`/v1`) | `base` in `vite.config.ts` and `basename` in `src/App.tsx` |

## Styles

Styles load in this order from `src/main.tsx`:

1. `src/styles/vendor/antd-v4-core.css`
2. `src/styles/global.css`
3. `src/styles/vendor/antd-v4-components.css`
4. `src/styles/app.css`

Make styling changes in `src/styles/app.css` (or `global.css`). Leave the `vendor/` files
unedited. Light and dark colours are CSS variables at the top of `app.css`.

## Project structure

```
src/
  api/          API client and chart history loaders
  lib/          data transform, churn labelling, sorting and search (unit tested)
  hooks/        theme, favourites and data polling
  components/
    ui/         buttons, popovers, modals, selects, tables and icons
    charts/     chart components and chart option builders
    layout/     header, footer and loading spinner
    dashboard/  overview tiles, node table, toolbar and dialogs
  pages/        dashboard pages and the node report page
deploy/
  nginx.conf
```

Favourites are stored in the `myFavNodes` cookie and the theme in `localStorage` (`theme`).
