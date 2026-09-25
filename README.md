# Bruno Polaski · portfolio + Halo UI

My portfolio, live at **https://brunopolaski.github.io**, built on Halo UI: a monochrome design system for Nuxt 4 with ink-on-white components, dependency-free SVG charts, and canvas pixel effects.

- `/` is the portfolio (pt-BR first, also English and Spanish).
- `/halo` is the Halo UI docs site.

```bash
pnpm install
pnpm dev        # http://localhost:3000 (portfolio) and /halo (docs)
pnpm lint
pnpm typecheck
pnpm test       # chart scale + locale detection (node:test)
pnpm generate   # static site in .output/public
```

## Deploy

Every push to `main` (and a daily scheduled run, to refresh the GitHub stats) builds the static site with
`pnpm generate` and publishes it to GitHub Pages via `.github/workflows/deploy.yml`.
The repo-count and language data are fetched from the GitHub API at build time.

## Layout

```
app/
  assets/css/tokens.css   color, type, space, radius tokens (light + dark)
  assets/css/base.css     reset and a few layout helpers
  components/ui/          <UiButton>, <UiInput>, <UiTable>, <UiModal>, ...
  components/chart/       <ChartLine>, <ChartBar>, <ChartDonut>, <ChartSparkline>
  components/fx/          <FxPixelSphere>, <FxHorizonGlow>, <FxPixelGrid>, <FxPixelText>, <FxPixelLoader>
  components/docs/        docs-site wrappers
  components/folio/       portfolio sections: <FolioPatterns>, <FolioSaga>, <FolioWordmark>, ...
  composables/            useToast, useTheme, useWidth, useFrameLoop, useShader, useLocale
  i18n/                   portfolio copy: pt-BR.ts (the shape every locale must match), en.ts, es.ts
  pages/index.vue         the portfolio
  pages/halo/             one docs page per component group
server/api/               github-languages: public repos per language, for the hero sphere
```

Components are auto-imported by folder: `components/ui/Button.vue` becomes `<UiButton>`.

## Theming

Components only read role tokens (`--ink`, `--surface`, `--line`, ...). To rebrand, override them in `tokens.css`.
Dark mode follows the OS; the sidebar switch stores an override in a `theme` cookie so SSR renders the right theme.

A component on a permanently dark surface (the hero, `<UiCard tone="ink">`) redefines the ink roles locally, so every nested component inverts with no extra props.

## Principles

- Native first: `<dialog>` for modals, the popover API for menus, `<details>` for the accordion, native form controls.
- Color is reserved: charts use the validated categorical palette; status colors always come with an icon and a label; `--signal` is used only for focus rings and motion.
- Acrylic (`.acrylic`: tint + backdrop blur + grain) is the one surface material, used by the top bar, menus and dialogs.
- Motion (2D canvas and WebGL shaders) pauses off screen and holds a still frame under `prefers-reduced-motion`.
