## Goal

Keep Lovable Cloud's auto-managed `supabase` client untouched, and add a parallel client pointing at your external Supabase project (`kyqtkotrnhqhzfffqbyf`). All app data — profiles, trades, sentiment votes, realtime — will use the external client. Auth will also move to the external project so RLS (`auth.uid()`) matches the row owner.

## What gets created

**`src/integrations/external-supabase/client.ts`** — new browser client:
- URL: `https://kyqtkotrnhqhzfffqbyf.supabase.co` (the one matching your anon key)
- Anon key: the JWT you provided (publishable, safe in code)
- Separate `storageKey` (e.g. `gvxm-ext-auth`) so its session doesn't collide with the Lovable Cloud client's session in `localStorage`
- Exported as `externalSupabase`
- No types import (your external DB types aren't generated here) — typed as `SupabaseClient<any>`

## What gets changed

1. **`src/lib/auth-context.tsx`** — swap `supabase` → `externalSupabase` so login/signup/session all run against your project. This is required: trades/profiles RLS uses `auth.uid()`, which only works if the user is authenticated against the same project that owns the rows.
2. **`src/routes/login.tsx`, `src/routes/register.tsx`** — same swap for `signInWithPassword`, `signUp`, and Google OAuth.
3. **`src/routes/dashboard.tsx`** — swap `supabase` → `externalSupabase` for the `profiles` query, the `profile-changes` realtime channel, and the `sentiment_votes` read/insert.
4. Any other component reading these tables (will grep during implementation).

## What stays the same

- `src/integrations/supabase/client.ts`, `types.ts`, `.env`, `supabase/config.toml` — untouched (Lovable Cloud auto-manages them).
- UI, design, charts, market simulation, Binance WebSocket — no changes.

## Things you must do in your external Supabase dashboard

I can't run migrations or configure auth on an external project. You confirmed the schema exists, so please also verify:

1. **Auth providers**: Email enabled. If you want Google login to keep working, enable Google in Authentication → Providers and add the OAuth client.
2. **Redirect URLs** (Authentication → URL Configuration): add
   - `https://id-preview--6c305472-c097-470f-a6cd-2e5ec54eed19.lovable.app`
   - `https://goldenvaultxmtrading.lovable.app`
   - `http://localhost:*` for local
3. **`handle_new_user` trigger**: the Lovable Cloud project has a trigger on `auth.users` that auto-creates a `profiles` row on signup. Make sure your external project has the equivalent trigger, otherwise new signups will have no profile row and the dashboard will show zeros.
4. **Realtime**: ensure `profiles` and `sentiment_votes` are added to the `supabase_realtime` publication.

## Caveats

- TypeScript on the external client will be loose (`any` row types) since types aren't generated for your external schema. Acceptable trade-off; the alternative is hand-writing types.
- Existing users created against Lovable Cloud will not exist in your external project — they'll need to register again.
- This is a one-way move for the data layer. Lovable Cloud's tables will go unused (but remain available if you ever want to flip back).

## Ready to implement?

Approve and I'll make the file changes in one pass.