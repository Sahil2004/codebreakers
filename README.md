# NorthQuest

<img src="public/branding/indiaskills-logos.png" alt="NSDC · Skill India · IndiaSkills" width="100%" />

![IndiaSkills](https://img.shields.io/badge/IndiaSkills-2026-orange?style=flat-square) ![Web Technologies](https://img.shields.io/badge/Web%20Technologies-Team%20Round-blue?style=flat-square) ![Team](https://img.shields.io/badge/Team-Codebreakers-black?style=flat-square)

An AI-powered digital tourism platform for exploring the culture, heritage, and eco-tourism destinations of North India. Built by team Codebreakers during the team round of **IndiaSkills 2026 — Web Technologies**.

NorthQuest surfaces popular destinations and hidden gems, generates personalized day-by-day trip itineraries with AI, and answers travel questions through a floating chat assistant.

## Features

- **AI Trip Planner** — generate a day-by-day itinerary from starting city, trip length, budget, and interests.
- **Destination Explorer** — browse and search destinations, filterable by "hidden gem" status, ranked by an eco-score.
- **Travel Assistant Chatbot** — a floating chat widget for quick, practical questions (seasons, budgets, routes, safety).
- **Destination detail pages** — dedicated page per destination at `/destination/[id]`.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: [Supabase](https://supabase.com) (Postgres) — `destinations` and `trips` tables
- **AI**: [Groq](https://groq.com) SDK (Llama models) for itinerary generation and the chat assistant

## Project Structure

```
app/
  page.tsx                    Landing page
  explore/                    Destination explorer
  destination/[id]/           Destination detail page
  trip-planner/                AI trip planner UI
  api/
    destinations/              GET destinations (search + hidden-gem filter)
    generate-itinerary/        POST -> AI-generated itinerary, persisted to Supabase
    travel-assistant/          POST -> AI chat assistant answers
components/
  ChatbotFloating.tsx          Floating "Ask NorthQuest AI" chat widget
  DestinationCard.tsx          Destination card UI
lib/
  gemini.ts                    AI client (Groq SDK) — generateJson / generateText helpers
  supabase.ts                  Supabase client factories (browser, server anon, service role)
  types.ts                     Shared Destination / Itinerary types
  env.ts                       requireEnv() helper
supabase/
  schema.sql                   Table definitions, RLS policies, and seed data
scripts/
  apply-schema.mjs             Apply schema.sql to a Supabase Postgres instance
  seed.mjs                     Seed destinations via the Supabase JS client
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only; used to persist generated itineraries) |
| `SUPABASE_DB_URL` | Direct Postgres connection string, used by `scripts/apply-schema.mjs` |
| `GROQ_API_KEY` | API key for Groq |
| `GROQ_MODEL` | Optional model override (defaults to a Groq Llama model) |

### 3. Set up the database

Apply the schema (creates `destinations` and `trips` tables, RLS policies, and seed data) either by running `supabase/schema.sql` directly in the Supabase SQL editor, or via script:

```bash
node scripts/apply-schema.mjs
```

Optionally re-seed destinations independently:

```bash
node scripts/seed.mjs
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
