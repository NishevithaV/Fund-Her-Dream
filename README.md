# Fund Her Dream

A micro-crowdfunding platform built for International Women's Day 2026, celebrating women founders and the bold ideas they are bringing to life.

---

## The Story Behind It

This project was built as part of the **SheBuilds challenge** - a hackathon celebrating women in tech on International Women's Day 2026. The idea came from a simple observation: women-led startups are chronically underfunded, and even a small signal of financial belief can be the push a founder needs to keep going. Fund Her Dream is that signal. Anyone can submit an idea, and anyone can back it, starting at just $5.

---

## What It Does

- **Submit an idea**: Women founders submit a title, description, category, and optional link through a modal form
- **AI-generated pitch**: On submission, the idea is passed to an AI model (Gemini via Lovable's gateway) which generates a polished one-liner investor pitch and 3 category tags automatically
- **Browse and back ideas**: Visitors browse a grid of approved ideas on the homepage (preview of 6) or the full dedicated ideas page at `/ideas`
- **Stripe payments**: Backers choose a preset or custom amount and pay securely via Stripe Checkout
- **Real-time updates**: Funding totals and backer counts update live across all connected sessions using Supabase Realtime

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | shadcn/ui, Tailwind CSS |
| Backend / DB | (Postgres + RLS + Realtime) |
| Edge Functions | Deno (Supabase Edge Functions) |
| Payments | Stripe Checkout |
| AI | Google Gemini (via Lovable AI Gateway) |

---

## AI Capability

When a founder submits an idea, a Supabase edge function calls the Lovable AI gateway using `google/gemini-3-flash-preview`. The model returns a structured response via tool calling -- a one-liner pitch capped at 120 characters and exactly 3 category tags. These are stored alongside the idea and surfaced on every card. The AI call is rate-limited to 10 requests per IP per hour to protect API credits.

---

## Architecture and Vulnerability Handling

- Three edge functions handle all server-side logic: `create-checkout`, `verify-payment`, and `generate-pitch`
- Payment verification includes an idempotency check so a Stripe session can never be credited more than once
- Row-Level Security is enforced on all tables - the public can read approved ideas but cannot directly insert contributions or update idea records (those actions are service-role only)
- Rate limiting is applied at the edge function level across all three endpoints

---

## Running Locally

```bash
git clone https://github.com/NishevithaV/Fund-Her-Dream.git
cd Fund-Her-Dream
npm install
npm run dev
```

Create a `.env` file in the root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

## Built By

Nishevitha Venkatesh - built for the **SheBuilds x International Women's Day 2026 challenge**.
