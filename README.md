# CollabChord

A browser-based music collaboration hub for artist profiles, skill/genre matching, collaboration listings, messaging concepts, and a Web Audio stem-mixer demo.

## Stack
- Static HTML/CSS/JavaScript frontend
- Supabase Auth and PostgreSQL (row-level security enabled)
- Vercel deployment

## Setup
1. The Supabase schema is provisioned in project xshejlfaolzupncldoax.
2. Configure email/password authentication in Supabase.
3. The supabase-config.js file uses the project URL and a public publishable client key only.
4. Deploy the repository to Vercel.

## Current implementation notes
Authentication and artist-profile persistence are connected to Supabase. The creator directory, sample tracks, and parts of chat/project interactions remain demo data; external Spotify OAuth and real stem uploads need provider configuration and storage wiring before production use.
