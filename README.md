# CollabChord

CollabChord is a music-collaboration web app with desktop and mobile layouts.

## Stack
- Static HTML/CSS/JavaScript frontend
- Supabase Auth and PostgreSQL with row-level security
- Private Supabase Storage bucket for audio stems
- Vercel static hosting

## Features wired to the backend
- Email/password sign-up, sign-in, and sign-out
- Artist profiles persisted in PostgreSQL and matched against other registered artists
- Create and browse collaboration bulletins
- Direct messages and project chat stored in PostgreSQL (Realtime subscriptions are used where enabled)
- Create project spaces, invite collaborators, and add timeline comments
- Upload private audio stems to Supabase Storage and generate short-lived signed download links
- Mobile layout shares the same profile, messaging, project, comment, and stem data

## Setup
1. Apply `supabase/migrations/20261018090000_collabchord_core.sql` to a fresh Supabase project.
2. Enable email/password authentication and configure allowed redirect URLs for your domain.
3. Put the project's Supabase URL and **publishable key only** in `supabase-config.js`. Never put a service-role key in frontend files.
4. Deploy the static files to Vercel.

The connected Supabase project is provisioned already; the migration is included to reproduce the schema elsewhere.

## Notes / remaining product decisions
- The audio preview is a browser-generated synth demo, not streaming from a third-party music catalog.
- Stem uploads are stored privately and can be downloaded by project members; a full multitrack synchronized playback/mixing engine and track-duration analysis are future work.
- Spotify OAuth, profile moderation, abuse reporting, email notifications, and production privacy/retention policies need provider and product decisions before a public launch.
