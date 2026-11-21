# ThirdBaseRyan — community voting + Hot Seat Meter

Mobile-first independent fan satire. Static HTML/CSS/JS plus one Netlify Function and a Supabase table. No frontend API keys.

## iPhone setup (new, separate Supabase project)
1. Open https://supabase.com/dashboard in Safari. Create a **new project** called `thirdbaseryan` under your existing Supabase account. Wait for provisioning.
2. Open **SQL Editor → New query**. Paste the complete contents of `supabase-schema.sql` and tap **Run**. The SQL should finish without errors.
3. In Supabase **Project Settings → API** (or the newer **Connect / API Keys** screens), copy the **Project URL** and the **service_role secret key**. Never use the anon/publishable key in place of the service role. **Never commit the service role key to GitHub or put it in frontend JavaScript.**
4. Open your GitHub `thirdbaseryan` repo. Replace `index.html`, `app.js`, `style.css`, `netlify.toml`, `README.md`; add `supabase-schema.sql` and `netlify/functions/vote.mjs`. GitHub's web UI may require creating the `netlify/functions` folder by typing the path in **Add file → Create new file**. You can alternatively upload the unzipped folder contents preserving directory structure from a computer. Commit changes.
5. Open Netlify → your site → **Project configuration → Environment variables**. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` with the values from step 3. Use all scopes or at least Functions. Do not add these to `netlify.toml`.
6. In Netlify **Deploys → Trigger deploy → Deploy project without cache** (wording varies). Wait for deployment.
7. Open `https://thirdbaseryan.netlify.app/`. Vote FIRE, check that the meter increases, then switch to KEEP and check that the total does **not** increase. Open a second browser/device to see shared totals. Tap Refresh totals to fetch latest counts.

## Troubleshooting
- **503 / voting unavailable:** Check both Netlify environment variables, that the SQL ran successfully, and that a fresh deploy occurred after setting variables. Inspect Netlify Function logs for `vote`.
- **404 on function:** Confirm `netlify/functions/vote.mjs` is committed in the correct folder and redeploy.
- **Votes not changing:** Inspect browser network requests and Supabase `fan_votes` table.
- **Site works but vote buttons disabled:** Frontend deliberately disables voting when the backend is unavailable rather than pretending votes were saved.

## How voting works and its limits
Each browser creates a random ID in localStorage. Netlify hashes the ID with SHA-256 and stores the hash + latest choice in Supabase. A unique primary key prevents multiple simultaneous rows for the same browser ID. Changing votes updates that row. Totals are real counts of stored browser identifiers, **not unique people**. Visitors can vote again by clearing storage, using private browsing, or switching devices. For stronger anti-abuse controls, add IP-based rate limiting, CAPTCHA, and/or authenticated accounts. There is no daily reset, scheduled snapshot, or historical chart yet.

## Security
The service-role key remains in server-side Netlify environment variables. Supabase RLS is enabled and public table permissions are revoked. Netlify endpoint is public, so rate limits and bot protection are recommended before high traffic. No claim of one-person-one-vote is made.

## Content
Stats are dated snapshots. Verify and update them after games; satire and invented excuse-generator lines are clearly labeled as parody. The site is unaffiliated with Ohio State or Ryan Day.


## Loss Hall update (Nov 21, 2026)
Replaces the old four-Michigan-loss list with 16 notable defeats, source links, category filters, and clearly marked parody headlines. No new SQL or environment variables needed. Upload the updated `app.js` and `style.css` (or all package files) to the same GitHub repository. The existing Supabase poll and Netlify Function are unchanged.


## Interactive Loss Hall upgrade
This version adds per-loss 1–5 star personal ratings (stored only in localStorage; NOT community averages), permanent deep links, and 1200×630 downloadable/shareable PNG cards for each loss. No new database tables or Netlify variables required. Replace `app.js`, `style.css`, and `index.html` in your existing GitHub repo. Existing vote function and schema are unchanged.
