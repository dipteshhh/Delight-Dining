# Delight Dining

Delight Dining is a Vite + React + TypeScript restaurant app with:

- public menu browsing
- table reservations with live slot availability
- catering inquiry intake
- admin dashboard for menu, reservations, catering, and order status
- Supabase-backed persistence with a local demo fallback when env vars are missing

## Stack

- Frontend: React 19, TypeScript, Vite
- Backend services: Supabase Postgres, Supabase Auth, Supabase Edge Functions
- Email: Resend via the `send-confirmation` edge function

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the frontend env file and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

3. Run [`supabase/schema.sql`](/Users/diptesh/Desktop/delight dining/supabase/schema.sql) in the Supabase SQL editor.

4. Create an admin user in Supabase Auth if you want live admin login.

5. Optional: deploy the email edge function in [`supabase/functions/send-confirmation/index.ts`](/Users/diptesh/Desktop/delight dining/supabase/functions/send-confirmation/index.ts) and set these secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`

6. Start the app:

```bash
npm run dev
```

## Demo Mode

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set, the app falls back to browser `localStorage` so the full flow still works locally.

- Admin email: `admin@delightdining.com`
- Admin password: `delight-demo`

## Features

### Public Site

- Menu page loads live menu items and hides unavailable dishes.
- Reservation form checks slot usage by date and prevents overbooking.
- Catering page stores package, guest count, event date, contact details, and notes.
- Cart and checkout remain available for a lightweight pickup/delivery flow.

### Admin

- Dashboard summaries for reservations, catering leads, menu visibility, and active orders.
- Menu manager for create/edit/delete and availability toggles.
- Reservation manager for confirm/cancel workflows.
- Catering manager for lead status updates.
- Order manager for advancing order status.

## Deployment Notes

- Frontend: Vercel works well for this repo.
- Backend: Supabase covers Postgres, auth, and edge functions.
- Email: deploy the edge function and set Resend secrets in Supabase.

This workspace does not include an already-configured live deployment target, so deployment still needs project credentials.
