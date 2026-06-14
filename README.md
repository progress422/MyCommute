# Commute Planner

A **React learning scaffold** for experienced Vue developers who want to practice modern React patterns by building a public transport commute planner themselves.

This repository provides project structure, tooling, and placeholder UI — **not** a finished application. Business logic, API integration, and persistence are intentionally left as TODOs for you to implement.

## Stack Overview

| Technology | Role |
| --- | --- |
| **React** | UI library — components replace Vue SFCs; JSX replaces templates |
| **TypeScript** | Static typing across the codebase |
| **Vite** | Fast dev server and production bundler (similar role to Vite in Vue) |
| **React Router** | Client-side routing — compare to Vue Router |
| **TanStack Query** | Server/async state, caching, and loading states |
| **Zustand** | Lightweight global client state — compare to Pinia |
| **React Hook Form** | Form state management with minimal re-renders |
| **Zod** | Schema validation shared between forms and APIs |
| **Tailwind CSS** | Utility-first styling without a component library |
| **Vitest + RTL** | Unit and component testing |
| **ESLint + Prettier** | Linting and formatting |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type-check and production build
npm run test     # Run tests in watch mode
npm run test:run # Run tests once
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Folder Structure

The project uses a **feature-based** layout. Each domain area owns its UI, hooks, API wrappers, schemas, and types:

```text
src/
├── app/           # App shell: providers, router, layouts
├── features/      # Domain features (settings, routes, favorites, …)
├── shared/        # Cross-feature components, API, hooks, utils, types
├── stores/        # Zustand stores (global client state)
└── test/          # Test setup and example tests
```

- **`app/`** — Application wiring that rarely changes per feature.
- **`features/`** — Where most learning work happens; mirror how you might structure Vue feature modules.
- **`shared/`** — Reusable pieces with no feature-specific knowledge.
- **`stores/`** — Global UI or client state (not server data — use TanStack Query for that).

Each feature folder includes a `README.md` describing its future responsibilities.

## Future Roadmap

Planned features (not implemented in this scaffold):

- Configure default departure location
- Configure default destination
- Search public transport connections
- Display route suggestions
- Save favorite routes
- Keep route history
- Replace mock API with a real transport provider

## For Vue Developers

Helpful mental mappings:

- **Component** ≈ Vue SFC (script + template combined in one function)
- **`useState` / `useEffect`** ≈ `ref` / `watch` / `onMounted`
- **Custom hooks** ≈ composables
- **Zustand** ≈ Pinia
- **TanStack Query** ≈ async data layer (no direct Vue equivalent; often replaced by manual fetching in smaller apps)
- **`<Outlet />`** ≈ `<router-view />`
- **React Hook Form** ≈ VeeValidate or manual v-model handling

Explore the TODO comments throughout the codebase — they mark where you should add real functionality next.
