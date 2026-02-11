# CODEBASE.md — HA React Dashboard Architecture

> Last updated: 2026-02-12

## Overview

A fully customizable Home Assistant dashboard built with React. The project is a **pnpm monorepo** (47 workspace packages) consisting of a Vite-powered React frontend, an Express/Node.js backend, and a Home Assistant addon packaging layer.

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
│  3627+ modules    │            │  Bundled: 2MB single  │
│  Code-split:      │            │  file via @vercel/ncc │
│  vendor 692KB     │            │                       │
│  app    966KB     │            │                       │
│  icons  3.5MB     │            │                       │
└────────┬──────────┘            └────────────┬──────────┘
         │ imports                             │ imports
         ▼                                    ▼
┌─────────────────────────────────────────────────────────┐
│                    SHARED PACKAGES                       │
│                                                         │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐           │
│  │ packages/ │  │ packages/│  │ packages/  │           │
│  │ api       │◄►│ helpers  │  │ types      │           │
│  │ (axios,   │  │ (dayjs,  │  │ (TS types, │           │
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
└─────────────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
┌────────┴──────────────┐   ┌───────────┴──────────────┐
│      PANELS (21)      │   │  PROPERTY CONTROLLERS (9)│
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
│   ├── types/           TypeScript type definitions (panels, HA entities, grid)
│   └── ui/              Shared UI library (Radix primitives, Lucide, forms, editor)
├── panels/              Dashboard panel components (one per entity domain)
│   ├── action/          Push-button for HA scripts
│   ├── camera/          Live camera feed
│   ├── climate/         Thermostat/HVAC with gesture support
│   ├── clock/           Live clock (dayjs format)
│   ├── cover/           Blinds/shades control
│   ├── fallback/        No-op fallback (renders null)
│   ├── light/           Light control with color pickers + brightness
│   ├── sensor/          Sensor data with optional chart
│   ├── slideshow/       Image slideshow (Swiper carousel)
│   ├── stack/           Container for sub-panels (scrollable)
│   ├── toggle/          Toggle switch for any on/off entity
│   ├── waste/           Waste/garbage collection display
│   ├── weather/         OpenWeather display with forecast
│   ├── media-player/    Media player controls (play/pause/skip)
│   ├── alarm/           Alarm control panel (arm/disarm)
│   ├── energy/          Energy sensor display with bar indicator
│   ├── multi-entity/    Multi-entity list view
│   ├── person/          Person presence tracking
│   ├── fan/             Fan control (toggle/speed)
│   ├── lock/            Lock control (lock/unlock)
│   └── vacuum/          Vacuum robot controls
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

### Resolved Issues (this session)
| Item | Resolution |
|---|---|
| `packages/themes/` (dead code) | **Deleted** — was empty placeholder with no source |
| `react-custom-scrollbars` (unmaintained) | **Replaced** with `react-scrollbars-custom` across all 11 files |
| `moment.js` (maintenance mode) | **Replaced** with `dayjs` across all 7 files |
| `icons ↔ ui` circular dep | **Fixed** — `IconValue` now imported from `types` instead of `ui` |
| `api ↔ helpers` circular dep | **Fixed** — moved 4 panel helpers from `helpers` to `api/dashboard/helpers/` |
| 5.3 MB single chunk | **Fixed** — code-split into vendor (692KB), app (966KB), icons (3.5MB), ha-websocket (12KB) |
| Vite CJS deprecation | **Fixed** — added `"type": "module"` to dashboard package.json |
| `base` option missing slash | **Fixed** — Vite base path now starts with `/` |
| Tailwind config `type: "module"` | **Fixed** — added to `config/tailwind/package.json` |
| Italian visibility labels | **Fixed** — translated to English |
| Server package name typo | **Fixed** — `sever` → `server` |
| `querystring` deprecated | **Fixed** — migrated to native `URLSearchParams` |
| `@types/sharp` deprecated | **Fixed** — removed (types bundled with sharp) |

### Remaining Technical Debt

### Incomplete Features
- Weather panel uses hardcoded OpenWeather API — no configuration UI for API key visible.
- Dart Sass legacy JS API deprecation warning — requires Vite plugin update.

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
