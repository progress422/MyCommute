# Transport feature

Main commute view — connection search and route suggestion display.

## Planned responsibilities

- Commute overview and search form UI (`components/`)
- TanStack Query hooks wrapping `searchConnections` (`hooks/`, `api/`)
- Types and Zod schemas for search params and results

## Implemented

- `useCommuteSearch` hook wrapping `getCommuteWithTimetables` from shared API
- `TransportPage` search form with route legs and per-stop departure boards

## Shared service

VRR EFA-JSON logic lives in `src/shared/services/vrr-efa/` and is exposed via `src/shared/api/transportApi.ts`.
