"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { BOOKING_URL, whatsappLink } from "@/lib/config";
import { CARD_ONLY, TIERS } from "@/lib/pricing";
import { saveLead, type Lead } from "@/lib/leads";

const RELATIONSHIPS = [
  "partner",
  "best friend",
  "parent",
  "sibling",
  "colleague",
  "other",
];
const OCCASIONS = [
  "birthday",
  "anniversary",
  "farewell",
  "wedding",
  "just because",
];

const TIER_OPTIONS = [
  ...TIERS.map((t) => ({
    id: t.id,
    label: `${t.name} · ₹${t.price.toLocaleString("en-IN")}`,
  })),
  { id: CARD_ONLY.id, label: `${CARD_ONLY.name} · ₹${CARD_ONLY.price}` },
  { id: "unsure", label: "Help me decide" },
];

function tierLabel(id: string) {
  return TIER_OPTIONS.find((t) => t.id === id)?.label ?? "Help me decide";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function field(label: string, control: React.ReactNode) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-ink/50">
        {label}
      </span>
      <div className="mt-2">{control}</div>
    </label>
  );
}

const inputClass =
  "w-full border-b border-taupe bg-transparent pb-2 text-lg outline-none placeholder:text-ink/30 focus:border-forest";

function BeginInner() {
  const params = useSearchParams();
  const initialTier = params.get("tier") || "signature";

  const [gifterName, setGifterName] = useState("");
  const [gifterPhone, setGifterPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [occasion, setOccasion] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [city, setCity] = useState("");
  const [tier, setTier] = useState(initialTier);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const valid =
    gifterName.trim() &&
    gifterPhone.trim().length >= 10 &&
    recipientName.trim() &&
    relationship &&
    occasion &&
    deliveryDate &&
    city.trim();

  const daysAway = deliveryDate
    ? Math.floor((new Date(deliveryDate).getTime() - Date.now()) / 86_400_000)
    : null;

  const message = useMemo(
    () =>
      [
        "Hi Heart Strings — I'd like to begin a gift.",
        "",
        `For: ${recipientName || "—"} (my ${relationship || "—"})`,
        `Occasion: ${occasion || "—"}`,
        `Needed by: ${deliveryDate || "—"}`,
        `Deliver to: ${city || "—"}`,
        `Gift: ${tierLabel(tier)}`,
        "",
        `From: ${gifterName || "—"}`,
        note ? `Note: ${note}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [recipientName, relationship, occasion, deliveryDate, city, tier, gifterName, note],
  );

  function submit() {
    if (!valid) return;
    const lead: Lead = {
      id: Math.random().toString(36).slice(2, 10),
      createdAt: Date.now(),
      gifterName: gifterName.trim(),
      gifterPhone: gifterPhone.trim(),
      recipientName: recipientName.trim(),
      relationship,
      occasion,
      deliveryDate,
      city: city.trim(),
      tier,
      note: note.trim(),
    };
    saveLead(lead);
    setSubmitted(true);
  }

  /* ---------- confirmation ---------- */
  if (submitted) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <header className="border-b border-gold/30 px-6 py-5 md:px-12">
          <Wordmark />
        </header>
        <div className="mx-auto max-w-lg px-6 pb-24 pt-16 text-center">
          <p className="font-script text-3xl text-forest">Thank you</p>
          <h1 className="mt-3 font-serif text-3xl">Your brief is ready</h1>
          <p className="mt-3 text-ink/60">
            Send it to us on WhatsApp and we&rsquo;ll take it from here — every
            gift is made by hand, by us. We reply within a few hours.
          </p>

          <div className="mt-8 rounded-2xl border border-taupe bg-white/50 p-6 text-left text-sm leading-relaxed">
            <div className="flex justify-between">
              <span className="text-ink/50">For</span>
              <span>
                {recipientName} · your {relationship}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-ink/50">Occasion</span>
              <span>{occasion}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-ink/50">Needed by</span>
              <span>
                {new Date(deliveryDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-ink/50">Gift</span>
              <span>{tierLabel(tier)}</span>
            </div>
          </div>

          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-cream transition-opacity hover:opacity-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M.05 24l1.7-6.2A11.9 11.9 0 1112 24a11.9 11.9 0 01-5.9-1.6L.05 24zM6.6 20.1l.4.2a9.9 9.9 0 005 1.4 9.9 9.9 0 10-9.9-9.9c0 1.8.5 3.5 1.4 5l.2.4-1 3.7 3.5-1zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a8.1 8.1 0 01-2.4-1.5 9 9 0 01-1.7-2c-.2-.3 0-.4.1-.6l.4-.4.3-.5c.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
            </svg>
            Continue on WhatsApp
          </a>
          <p className="mt-3 text-xs text-ink/40">
            Opens a chat with your brief already written.
          </p>

          {BOOKING_URL && (
            <div className="mt-12 border-t border-taupe pt-10">
              <h2 className="font-serif text-xl">
                Would you rather talk it through?
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Book a quiet 15 minutes with us.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-taupe">
                <iframe
                  src={BOOKING_URL}
                  title="Book a call"
                  className="h-[640px] w-full"
                />
              </div>
            </div>
          )}

          <Link href="/" className="mt-10 inline-block text-sm text-ink/50">
            back to the start
          </Link>
        </div>
      </main>
    );
  }

  /* ---------- the form ---------- */
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-gold/30 px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-xl px-6 pb-24 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-forest">
          by appointment
        </p>
        <h1 className="mt-3 font-serif text-4xl">Begin a gift</h1>
        <p className="mt-3 text-ink/60">
          Tell us a little, and we&rsquo;ll carry the rest of the conversation
          on WhatsApp.
        </p>

        <div className="mt-10 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {field(
              "your name",
              <input
                value={gifterName}
                onChange={(e) => setGifterName(e.target.value)}
                placeholder="who's gifting"
                className={inputClass}
              />,
            )}
            {field(
              "your whatsapp number",
              <div className="flex items-end gap-2 border-b border-taupe pb-2 focus-within:border-forest">
                <span className="text-ink/50">+91</span>
                <input
                  value={gifterPhone}
                  onChange={(e) =>
                    setGifterPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="phone number"
                  inputMode="numeric"
                  className="w-full bg-transparent text-lg outline-none placeholder:text-ink/30"
                />
              </div>,
            )}
          </div>

          {field(
            "who is this for",
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="their name"
              className={inputClass}
            />,
          )}

          {field(
            "they are your…",
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIPS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRelationship(r)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    relationship === r
                      ? "border-forest bg-forest text-cream"
                      : "border-taupe hover:border-forest"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>,
          )}

          {field(
            "the occasion",
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    occasion === o
                      ? "border-forest bg-forest text-cream"
                      : "border-taupe hover:border-forest"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>,
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            {field(
              "in their hands by",
              <input
                type="date"
                min={today()}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={inputClass}
              />,
            )}
            {field(
              "delivery city",
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="city"
                className={inputClass}
              />,
            )}
          </div>
          {daysAway !== null && daysAway < 5 && (
            <p className="-mt-4 text-sm text-gold">
              That&rsquo;s a tight timeline — message us and we&rsquo;ll see
              what&rsquo;s possible.
            </p>
          )}

          {field(
            "the gift",
            <div className="flex flex-wrap gap-2">
              {TIER_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    tier === t.id
                      ? "border-forest bg-forest text-cream"
                      : "border-taupe hover:border-forest"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>,
          )}

          {field(
            "anything we should know (optional)",
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="a detail, a deadline, a worry…"
              className="w-full resize-none rounded-xl border border-taupe bg-white/40 p-3 outline-none placeholder:text-ink/30 focus:border-forest"
            />,
          )}

          <button
            onClick={submit}
            disabled={!valid}
            className="w-full rounded-full bg-forest py-3.5 text-cream transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            Continue
          </button>
          <p className="text-center text-xs text-ink/40">
            No account, no payment yet. We&rsquo;ll confirm everything with you
            first.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Begin() {
  return (
    <Suspense>
      <BeginInner />
    </Suspense>
  );
}
