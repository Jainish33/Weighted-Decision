# Heart Strings

Some feelings need a song. A hardcover card, an original song written from
your memories, and a personal webpage that belongs to one person only.

## Stack

- Next.js 14 (App Router) + Tailwind — brand system: off-white canvas,
  warm black ink, deep burgundy accent, Fraunces serif + Inter sans
- Claude (`@anthropic-ai/sdk`) — the Layer 2 emotional-material-extractor
  chatbot (streaming) and card-content ghostwriting
- Firebase — Auth (phone OTP + Google) and Firestore mirroring, both
  optional at runtime: without keys the app runs in guest mode on
  localStorage so every flow still works

## The gifter journey (what's built)

| Route | Screen |
|---|---|
| `/` | Landing page |
| `/begin` | Setup: recipient, occasion, delivery-date feasibility, city/pincode |
| `/signin` | Phone OTP + Google (guest mode when Firebase unconfigured) |
| `/create/[id]/conversation` | The conversation — streaming Claude chat with the string/waveform progress motif |
| `/create/[id]/taste` | Music taste: "I know their taste" or the secret quiz link |
| `/quiz/[slug]` | The disguised music-personality quiz recipients fill |
| `/create/[id]/card` | Card builder: 4 pages + RFID titles, AI-drafted, fully editable |
| `/create/[id]/review` | Order summary, tiers (₹2,999 / ₹4,499 / ₹5,999), pay |
| `/orders/[id]` | Order tracking timeline in brand voice |

Not yet wired (next phases): photo uploads to Storage, Cashfree payment,
Suno song pipeline + QC dashboard, recipient page (`/for/[slug]`),
WhatsApp automation, voice-note input.

## Deploying on Vercel

1. Import this repo in Vercel (framework auto-detected: Next.js).
2. Add env vars from `.env.example`:
   - `ANTHROPIC_API_KEY` — required for the real chatbot and drafting
   - `NEXT_PUBLIC_FIREBASE_*` — from your Firebase project settings
     (enable Phone and Google providers in Firebase Auth, and add your
     Vercel domain to Auth's authorized domains)
3. Deploy.

## Local dev

```sh
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

Everything works without any keys — the chatbot uses a scripted question
flow and orders persist in localStorage.
