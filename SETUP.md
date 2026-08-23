# Setup Guide (do this in order, ~15-20 min)

## 1. Supabase project
1. Create a project at supabase.com
2. Go to SQL Editor → paste contents of `supabase/schema.sql` → Run
3. Go to Storage → Create a new bucket named `report-evidence` → set it to **Private**
4. Go to Authentication → Users → Add user manually (this is your Joint Secretary / admin login — email + password)

## 2. Env vars
Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API → anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → service_role key (keep secret, never expose client-side)

## 3. Run locally
```
npm install
npm run dev
```
Visit http://localhost:3000

## 4. Test the full flow
1. Go to `/report`, submit a test concern
2. Copy the Report ID + Secret Code shown
3. Go to `/track`, paste both — confirm you see the timeline
4. Go to `/admin/login`, sign in with the admin user you created in Supabase
5. Open the report from the dashboard, change status + write an update, save
6. Go back to `/track` with the same credentials — confirm the new update shows

## 5. Deploy
Push to GitHub → import into Vercel → add the same 3 env vars in Vercel's project settings → deploy.

## Notes on what's already handled per your spec
- RLS is enabled on all 3 tables with no public policies — only the service role key (used server-side only) can read/write. Anon key has zero direct table access.
- Secret codes are generated with `crypto.randomBytes` and hashed with bcrypt before storage — plaintext is shown to the student exactly once.
- `/api/reports/track` is rate-limited (5 attempts/hour per IP, in-memory — fine for single-instance deploy; swap for Upstash if you scale).
- Evidence images are served via short-lived (5 min) signed URLs generated server-side in the admin report view — bucket stays private.
- Admin routes are protected by middleware checking the Supabase Auth session; the update API route also double-checks auth server-side.
