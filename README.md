# theFoundry

A clean, modern web simulation demo that showcases the end-to-end user journey for theFoundry platform: AI-driven matchmaking between iDICE founders and 3MTT talents.

This project is intentionally demo-focused. It uses simulated authentication and mock data to help teams visualize product direction before deeper backend integration.

## What This Demo Covers

- Persona-first landing flow with role selection
- Simulated login (no passwords)
- Role-aware dashboards and navigation
- Team blueprint, matches, impact reports, and profile/settings views
- Founder and talent-focused journey surfaces
- Board/admin overview dashboards
- Charts and tables with realistic fake data
- Responsive UI with a dark-mode capable Tailwind theme

## Personas in the Simulator

- 3MTT Talent
- iDICE Founder
- iDICE Board / BOI Officer
- 3MTT Board / Admin

On landing, selecting a persona sets role state in the app and redirects to `/dashboard`.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Radix UI primitives
- Vitest + Testing Library
- Playwright config scaffold

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or bun/pnpm/yarn)

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Main Routes

- `/` - Landing page and persona selection
- `/dashboard` - Role-based dashboard
- `/team` - Team Blueprint view
- `/matches` - AI match list/table
- `/impact` - Impact Reports
- `/settings` - Profile and settings
- `/notifications` - Talent notifications

## UX and Design Notes

- Startup-style visual language with blue/green accents
- Primary accent aligned with `#0A84FF`
- Class-based dark mode support
- Responsive sidebar behavior on mobile/desktop
- Subtle transitions and reveal animations

## Mock Data Included

The app ships with local fake data for:

- 3MTT fellows and skills (for example: Fullstack, ML, UI/UX)
- Startup opportunities and stages
- Match scores and statuses
- Equity allocations and vesting progression
- Milestones and impact metrics

## Current Limitations

- Authentication is simulated and local to the frontend state
- No backend API or persistent database is wired yet
- Demo data is static and intentionally non-production

## Planned Follow-up

This base is prepared for adding deeper persona workflows in follow-up iterations, including:

- Founder detailed team formation and grant-track progression
- Talent application lifecycle and advanced profile matching
- Board/admin governance actions and reporting workflows
