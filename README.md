# Heart Strings

Some feelings need a song. A hand-finished hardcover card, an original song
written from your memories, and a personal page that belongs to one person
only.

## v1 — manual fulfilment (what's live)

The public site is a premium gifting storefront that captures a lead and
hands off to WhatsApp. Every gift is then crafted by hand. There is **no
login and no self-serve app yet** — that's deliberate for Stage 1.

| Route | Screen |
|---|---|
| `/` | Landing page — the real card design, premium gifting brand |
| `/begin` | Lead-capture form → pre-filled WhatsApp handoff (+ optional booking) |
| `/signin` | "Studio opens soon" invitation wall (future login page) |

### Pricing

- **Just the card** — ₹500 (no song)
- **Classic** — ₹1,700 · card + original song + hosted page + QR
- **Signature** — ₹2,100 · + 2 RFID cards + 1 revision *(most chosen)*
- **Heirloom** — ₹2,500 · + premium packaging + a 2nd revision

### How the handoff works

`/begin` collects the brief (gifter, recipient, occasion, date, city, tier),
saves it (localStorage; Firestore too if configured), then opens
`wa.me/<number>` with the whole brief pre-typed. Set the number and an
optional booking link in env:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, e.g. `919712243992`
- `NEXT_PUBLIC_BOOKING_URL` — a public Google Calendar Appointment / Calendly
  / Cal.com link (embedded as an iframe, no API key). Blank = WhatsApp only.

## v2 — the SaaS studio (built, gated)

The full gifter journey — streaming Claude conversation, AI-drafted card
builder, taste capture, secret music quiz, checkout, order tracking — is
already built and lives under `/create`, `/orders`, `/quiz`. It's gated by
`STUDIO_ENABLED` in `lib/config.ts` (currently `false`): those routes
redirect to the invitation wall via `middleware.ts`. Flip the flag to `true`
once real login is added and the whole studio comes back online.

## Stack

Next.js 14 (App Router) · Tailwind · Framer Motion · `@anthropic-ai/sdk`
(v2 chatbot/drafting) · Firebase (v2 auth + Firestore, optional).

## Deploying on Vercel

1. Import this repo (framework auto-detected: Next.js).
2. Add env vars from `.env.example` — for v1 you only need
   `NEXT_PUBLIC_WHATSAPP_NUMBER` (and optionally `NEXT_PUBLIC_BOOKING_URL`).
3. Deploy.

## Local dev

```sh
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

Everything in v1 works with zero keys.
