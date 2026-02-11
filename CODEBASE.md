# CODEBASE.md — HA React Dashboard Architecture

> Last updated: 2026-02-11

## Overview

A fully customizable Home Assistant dashboard built with React. The project is a **pnpm monorepo** (40 workspace packages) consisting of a Vite-powered React frontend, an Express/Node.js backend, and a Home Assistant addon packaging layer.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADDON (Docker)                               │
│  addon/Dockerfile → Docker image running Node.js                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  dist/                                                         │  │
│  │  ├── server.js          (ncc-bundled Express server)           │  │
│  │  ├── start-addon.sh     (entrypoint)                           │  │
│  │  └── public/            (Vite-built dashboard SPA + assets)    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │ scripts/build.sh                   │ build-addon.sh
         │ (build + assemble dist/)           │ (build + docker build)
         │                                    │
┌────────┴──────────┐            ┌────────────┴──────────┐
│  apps/dashboard   │            │    apps/server        │
│  (Vite + React)   │            │    (Express + ncc)    │
│                   │            │                       │
│  Port: 5173 (dev) │            │  Port: 8099           │
│  Output: dist/    │            │  Output: dist/        │
│  3627 modules     │            │  Bundled: 2MB single  │
│  5.3MB chunk      │            │  file via @vercel/ncc │
└────────┬──────────┘            └────────────┬──────────┘
         │ imports                             │ imports
         ▼                                    ▼
┌─────────────────────────────────────────────────────────┐
│                    SHARED PACKAGES                       │
│                                                         │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐           │
│  │ packages/ │  │ packages/│  │ packages/  │           │
│  │ api       │◄►│ helpers  │  │ types      │           │
│  │ (axios,   │  │ (moment, │  │ (TS types, │           │
│  │  HA WS)   │  │  uuid,   │  │  HA entity │           │
│  └───────────┘  │  sonner) │  │  types)    │           │
│       ▲         └──────────┘  └────────────┘           │
│       │                            ▲                    │
│  ┌────┴──────┐  ┌──────────┐  ┌───┴────────┐           │
│  │ packages/ │  │ packages/│  │ packages/  │           │
│  │ hooks     │  │ locale   │  │ defines    │           │
│  └───────────┘  └──────────┘  └────────────┘           │
│                                                         │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐           │
│  │ packages/ │◄►│ packages/│  │ packages/  │           │
│  │ icons     │  │ ui       │  │ providers  │           │
│  │ (MDI,     │  │ (Radix,  │  │ (React     │           │
│  │  react-   │  │  Lucide, │  │  Context)  │           │
│  │  icons)   │  │  forms)  │  │            │           │
│  └───────────┘  └──────────┘  └────────────┘           │
│                                                         │
│  ┌────────────┐                                         │
│  │ packages/  │  ← DEAD: no src/ directory              │
│  │ themes     │                                         │
│  └────────────┘                                         │
└─────────────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
┌────────┴──────────────┐   ┌───────────┴──────────────┐
│      PANELS (13)      │   │  PROPERTY CONTROLLERS (9)│
│                       │   │                          │
│  action    (script)   │   │  direction  (dropdown)   │
│  camera    (camera)   │   │  entity     (HA picker)  │
│  climate   (climate)  │   │  icon       (MDI picker) │
│  clock     (time)     │   │  number     (input)      │
│  cover     (cover)    │   │  select     (dropdown)   │
│  fallback  (null)     │   │  text       (input)      │
│  light     (light)    │   │  toggle     (switch)     │
│  sensor    (sensor)   │   │  visibility (strategy)   │
│  slideshow (swiper)   │   │  yesno      (bool)       │
│  stack     (container)│   │                          │
│  toggle    (on/off)   │   └──────────────────────────┘
│  waste     (garbage)  │
│  weather   (weather)  │
└───────────────────────┘
```

## Workspace Structure

```
ha-react-dashboard/
├── apps/
│   ├── dashboard/       Vite React SPA (the user-facing dashboard)
│   └── server/          Express backend (API, WebSocket proxy, image processing)
├── packages/            Shared libraries consumed by both apps and panels
│   ├── api/             HTTP client (axios), HA WebSocket hooks, file-saver
│   ├── defines/         Global constants, hotkey definitions
│   ├── helpers/         Utility functions (dates, slugify, UUID, forms, toasts)
│   ├── hooks/           Shared React hooks (Tailwind breakpoints, etc.)
│   ├── icons/           Icon wrappers (MDI, react-icons)
│   ├── locale/          i18n translation string constants
│   ├── providers/       React context providers (HA connection, dashboard state)
│   ├── themes/          ⚠️ EMPTY — placeholder with no source code
│   ├── types/           TypeScript type definitions (panels, HA entities, grid)
│   └── ui/              Shared UI library (Radix primitives, Lucide, forms, editor)
├── panels/              Dashboard panel components (one per entity domain)
│   ├── action/          Push-button for HA scripts
│   ├── camera/          Live camera feed
│   ├── climate/         Thermostat/HVAC with gesture support
│   ├── clock/           Live clock (moment.js format)
│   ├── cover/           Blinds/shades control
│   ├── fallback/        No-op fallback (renders null)
│   ├── light/           Light control with color pickers + brightness
│   ├── sensor/          Sensor data with optional chart
│   ├── slideshow/       Image slideshow (Swiper carousel)
│   ├── stack/           Container for sub-panels (scrollable)
│   ├── toggle/          Toggle switch for any on/off entity
│   ├── waste/           Waste/garbage collection display
│   └── weather/         OpenWeather display with forecast
├── property-controllers/  Panel configuration form controls
│   ├── direction/       Top/Bottom/Left/Right dropdown
│   ├── entity/          Home Assistant entity picker
│   ├── icon/            MDI icon picker
│   ├── number/          Numeric input
│   ├── select/          Generic dropdown from options list
│   ├── text/            Free-text input
│   ├── toggle/          Boolean switch
│   ├── visibility/      Visibility strategy (None/Both/Card/Modal)
│   └── yesno/           Yes/No boolean dropdown
├── config/              Shared development configurations
│   ├── eslint/          ESLint config (TS, React Refresh, Prettier, Stylelint)
│   ├── prettier/        Prettier config (no deps)
│   ├── scripts/         Lint runner scripts
│   ├── tailwind/        Tailwind CSS config + tailwindcss-animate
│   └── typescript/      Shared tsconfig presets (app, library, node, panel, etc.)
├── addon/               Home Assistant addon packaging
│   ├── Dockerfile       Docker image definition (node:20, copies dist/)
│   ├── config.yaml      HA addon manifest (ingress, ports, permissions)
│   └── apparmor.txt     AppArmor security profile
├── scripts/
│   └── build.sh         Main build script (dashboard + server → dist/)
└── build-addon.sh       Full addon build (build + Docker image)
```

## Build Pipeline

```
pnpm build:dashboard          pnpm build:server
      │                              │
      ▼                              ▼
apps/dashboard/dist/          apps/server/dist/index.js
(Vite static SPA)             (ncc-bundled Express)
      │                              │
      └──────────┬───────────────────┘
                 │ scripts/build.sh
                 ▼
            root dist/
            ├── server.js
            ├── start.sh
            ├── start-addon.sh
            └── public/
                ├── index.html (dashboard SPA)
                ├── assets/    (JS, CSS, fonts)
                └── ...        (icons, login pages)
                 │
                 │ build-addon.sh
                 ▼
            addon/dist/ → docker build → local/react_dashboard:latest
```

**Key commands:**
- `pnpm dev` — Start dashboard dev server (Vite, port 5173)
- `pnpm dev:server` — Start backend dev server (nodemon, port 8099)
- `pnpm build:dashboard` — Production build of the React SPA
- `pnpm build:server` — Production build of the Express server (via ncc)
- `bash scripts/build.sh` — Full build: dashboard + server → assembled dist/
- `bash build-addon.sh` — Full addon: build + Docker image

## Known Issues & Technical Debt

### Dead Code / Unused Packages
| Item | Status | Notes |
|---|---|---|
| `packages/themes/` | **DEAD** | Has `package.json` + `tsconfig.json` but no `src/` directory. No code. |
| `react-custom-scrollbars` | **Unmaintained** | Used in dashboard + panel-stack. Last published 7+ years ago. Peer deps require React 0.14–16. Consider `react-scrollbars-custom` (already a dep) or `simplebar-react`. |
| `moment.js` | **Maintenance mode** | Used across 10+ panels. Consider migrating to `date-fns` or `dayjs`. |

### Cyclic Dependencies
- `packages/api` ↔ `packages/helpers` (circular workspace dep)
- `packages/icons` ↔ `packages/ui` (circular workspace dep)

These work due to pnpm's symlink resolution but are a code smell and can cause issues with build ordering.

### Build Warnings
- **5.3 MB single JS chunk** — No code splitting. Should add `manualChunks` in Vite config or dynamic `import()`.
- **Vite CJS deprecation** — Project uses the deprecated CJS Node API. Should migrate to ESM.
- **`base` option** — Vite warns "base option should start with a slash".
- **Tailwind config `type: "module"`** — Missing in `config/tailwind/package.json`, causes reparsing overhead.

### Server Package
- Package name was `@home-assistant-react/sever` (typo) — **fixed** to `@home-assistant-react/server`.
- `querystring` module was deprecated — **migrated** to native `URLSearchParams`.
- `@types/sharp` was deprecated — **removed** (types now bundled with sharp).

### Incomplete Features
- `packages/themes/` — Intended for theming support but never implemented.
- Weather panel uses hardcoded OpenWeather API — no configuration UI for API key visible.
- Visibility controller labels are in Italian ("Solo card", "Solo in modal") — incomplete i18n.

### Major Upgrades Deferred
These were **not** updated due to breaking changes requiring significant refactoring:

| Package | Current | Latest | Breaking Changes |
|---|---|---|---|
| React | 18.x | 19.x | New rendering model, hooks changes |
| Express | 4.x | 5.x | Middleware/routing API changes |
| Vite | 5.x | 7.x | Config API, plugin compatibility |
| Tailwind CSS | 3.x | 4.x | Config format, JIT changes |
| ESLint | 8.x | 10.x | Flat config required |
| Zod | 3.x | 4.x | Schema API changes |
| Swiper | 10.x | 12.x | Import paths, component API |
| react-grid-layout | 1.x | 2.x | Layout API |
| body-parser | 1.x | 2.x | Now part of Express 5 |
| pino | 8.x | 10.x | Logger API |
| react-intl | 6.x | 8.x | Provider/hook API |
| react-datepicker | 4.x | 9.x | Component API rewrite |

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 (SWC plugin) |
| Styling | Tailwind CSS 3 + CSS modules + Sass |
| UI components | Radix UI primitives + custom components |
| State management | React Context (via providers package) |
| HA communication | `home-assistant-js-websocket` + axios REST |
| Drag & drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Backend | Express 4 + TypeScript |
| Backend bundler | `@vercel/ncc` (single-file output) |
| Database | PostgreSQL (via `postgres` driver) |
| Image processing | Sharp + Jimp |
| Auth | bcryptjs + passport-jwt |
| Package manager | pnpm 9 (workspace monorepo) |
| Containerization | Docker (node:20 base) |
| Target platform | Home Assistant addon (ingress) |
