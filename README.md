# ThirdBaseRyan.com

Mobile-first static satire site. No build tools, accounts, environment variables or paid APIs required.

## Deploy
1. Create a GitHub repository named `thirdbaseryan`.
2. Upload `index.html`, `style.css`, `app.js`, and `netlify.toml` to the repository root.
3. In Netlify, choose **Add new project → Import an existing project → GitHub** and select the repository.
4. Set publish directory to `.` (or leave the auto-detected configuration). No build command needed.
5. Deploy and test your Netlify URL. Add `thirdbaseryan.com` in **Domain management** only after purchasing/controlling the domain; follow Netlify's displayed DNS instructions.

## Important limitations
- Fan voting uses browser localStorage; it is **not** a public poll and is not fraud resistant.
- Scores and coaching records are a historical snapshot as of Nov 14, 2026, and must be updated manually.
- Share card is generated locally by Canvas. Mobile browsers may save the PNG to Files or Downloads.
- Excuse generator is entirely fictional parody, not actual quotes.
- The site is independent commentary, not an official Ohio State property.

## Data sources
- https://www.sports-reference.com/cfb/coaches/ryan-day-1.html
- https://ohiostatebuckeyes.com/sports/football/roster/coaches/ryan-day/2310
- https://sports.yahoo.com/articles/ohio-state-football-vs-michigan-110154832.html
- https://www.axios.com/local/columbus/2022/11/28/buckeyes-foiled-rival-michigan-college-football

## Next upgrades
Supabase shared voting with abuse controls; admin-editable game records; server-generated OG images; automatic source-verified score refresh.
