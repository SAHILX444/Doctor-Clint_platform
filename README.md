# OPD Flow

OPD Flow is a front-end outpatient queue-management console for City Care Clinic. It includes a dense doctor workflow, a one-handed client queue view, and a high-contrast waiting-room display. The app runs entirely on in-memory mock state so queue operations can be demonstrated without a backend.

## Run

```bash
npm install
npm run dev
```

The development server uses port `5173`. Quality checks:

```bash
npm run lint
npm run build
```

## Demo credentials

- Doctor: `doctor@citycare.test` / `demo123`
- Client: `98765 43215` / `demo123`

## Routes

- `/login` — role-aware demo sign-in
- `/doctor` — dashboard, `/doctor/queue`, `/doctor/patients`, `/doctor/emergency`, `/doctor/workload`, `/doctor/analytics`, `/doctor/settings`
- `/client` — My Queue, `/client/appointment`, `/client/notifications`, `/client/history`, `/client/profile`
- `/display` — TV queue display

## Supabase integration notes

All backend replacement work is intentionally confined to `src/services/queueService.js`. The service currently returns delayed mock data and a no-op subscription. A Supabase adapter can replace those functions with `doctors`, `patients`, `appointments`, `queue`, `consultations`, `queue_events`, and `notifications` tables, plus a realtime channel per doctor. The reducer and UI should continue to consume the same service-shaped data.
