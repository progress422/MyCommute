# Transport feature

Main commute view — connection search and route suggestion display.

## Implemented

- Auto-loads commute connections on open using from/to saved in Settings
- Re-fetches when departure time changes or destinations are swapped
- `useCommuteSearch` query hook wrapping `getCommuteWithTimetables`
- Trip tiles show time until departure and total duration

## Shared service

VRR EFA-JSON logic lives in `src/shared/services/vrr-efa/` and is exposed via `src/shared/api/transportApi.ts`.
