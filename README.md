# Crestovia Business Dashboard

Client/project tracking, expenses, payments, PDF invoices, and a daily work log —
backed by a real Postgres database, ready to deploy on Vercel.

## What's in here
- `pages/index.js` — serves the dashboard at `/`
- `public/dashboard.html` — the whole app (UI, charts, PDF invoice generator, Excel/JSON backup)
- `pages/api/login.js`, `logout.js`, `data.js` — the backend: login, logout, and load/save all data
- `lib/db.js` — the database layer (one JSON row in Postgres holds all your data)
- `lib/auth.js` — cookie-based login sessions
- `lib/seed.js` — the starter data created the very first time the app runs

## Deploy to Vercel

1. **Push this folder to a GitHub repo** (or run `vercel deploy` from inside this folder with the [Vercel CLI](https://vercel.com/docs/cli) if you'd rather skip GitHub).

2. **Import the project on [vercel.com](https://vercel.com/new)** and point it at the repo.

3. **Add a database.** In your new Vercel project: **Storage** tab → **Create Database** → choose **Postgres** (Vercel's native Neon-backed Postgres). Connect it to the project — Vercel automatically adds a Postgres connection string as an environment variable (`POSTGRES_URL` or `DATABASE_URL`, depending on the integration version) — the app picks up either automatically. Nothing else to configure.

4. **(Optional) Set your own admin login before the first deploy.** In **Settings → Environment Variables**, add:
   - `ADMIN_USERNAME` — defaults to `admin`
   - `ADMIN_PASSWORD` — defaults to `Crestovia@2026`
   - `AUTH_SECRET` — a long random string (run `openssl rand -hex 32` to generate one). If you skip this, a fallback is used — fine for testing, but set a real one before relying on this for real client data.

   You can also skip this step entirely and just log in with the defaults, then change the username/password from **Settings → Admin account** inside the app afterwards.

5. **Deploy.** Once it's live, open the URL, log in, and you're in.

## Local development

```bash
npm install
vercel env pull .env.local   # after linking the project + database on Vercel
npm run dev
```

Open http://localhost:3000.

## How your data is protected
- All data (clients, projects, expenses, payments, invoices, daily log) lives in the Postgres database — it's the same data no matter what device or browser you log in from.
- **Settings → Excel workbook** and **Settings → JSON backup** are safety nets, not the primary storage: export either any time, and import it back in to restore everything if the database is ever unavailable or you want a point-in-time backup before a big change.
- The admin password is stored as a SHA-256 hash, never in plain text.
