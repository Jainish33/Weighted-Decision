"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { newOrderId, saveOrder } from "@/lib/store";
import type { Occasion, Relationship } from "@/lib/types";

const RELATIONSHIPS: Relationship[] = [
  "partner",
  "best friend",
  "parent",
  "sibling",
  "colleague",
  "other",
];

const OCCASIONS: Occasion[] = [
  "birthday",
  "anniversary",
  "farewell",
  "wedding",
  "just because",
];

function feasibility(date: string): {
  level: "comfortable" | "tight" | "not_possible" | null;
  message: string;
} {
  if (!date) return { level: null, message: "" };
  const days = Math.floor(
    (new Date(date).getTime() - Date.now()) / 86_400_000,
  );
  if (days >= 10)
    return {
      level: "comfortable",
      message: "Plenty of time. We'll make something beautiful.",
    };
  if (days >= 5)
    return {
      level: "tight",
      message: "A little tight, but we can do it. Start the conversation today.",
    };
  return {
    level: "not_possible",
    message:
      "We're sorry — good things take a little time. We need at least 5 days.",
  };
}

export default function Begin() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const feas = useMemo(() => feasibility(date), [date]);

  function finish() {
    const id = newOrderId();
    saveOrder({
      id,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      recipientName: name.trim(),
      relationship: relationship!,
      occasion: occasion!,
      deliveryDate: date,
      city: city.trim(),
      pincode: pincode.trim(),
      conversation: [],
    });
    router.push(`/signin?next=/create/${id}/conversation`);
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>

      <div className="mx-auto max-w-xl px-6 pt-12">
        {step === 0 && (
          <section className="animate-fadeUp">
            <h1 className="font-serif text-3xl">Who is this for?</h1>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="their name"
              className="mt-6 w-full border-b border-taupe bg-transparent pb-2 font-serif text-2xl outline-none placeholder:text-ink/30 focus:border-burgundy"
            />
            <p className="mt-8 text-sm text-ink/60">and they are your…</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {RELATIONSHIPS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRelationship(r)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    relationship === r
                      ? "border-burgundy bg-burgundy text-canvas"
                      : "border-taupe hover:border-burgundy"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              disabled={!name.trim() || !relationship}
              onClick={() => setStep(1)}
              className="mt-10 rounded-full bg-burgundy px-6 py-2.5 text-canvas disabled:opacity-30"
            >
              Continue
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="animate-fadeUp">
            <h1 className="font-serif text-3xl">What&rsquo;s the occasion?</h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    occasion === o
                      ? "border-burgundy bg-burgundy text-canvas"
                      : "border-taupe hover:border-burgundy"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
            <button
              disabled={!occasion}
              onClick={() => setStep(2)}
              className="mt-10 rounded-full bg-burgundy px-6 py-2.5 text-canvas disabled:opacity-30"
            >
              Continue
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fadeUp">
            <h1 className="font-serif text-3xl">
              When does it need to be in their hands?
            </h1>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-6 w-full border-b border-taupe bg-transparent pb-2 font-serif text-2xl outline-none focus:border-burgundy"
            />
            {feas.level && (
              <p
                className={`mt-4 text-sm ${
                  feas.level === "comfortable"
                    ? "text-ink/70"
                    : feas.level === "tight"
                      ? "text-gold"
                      : "text-burgundy"
                }`}
              >
                {feas.message}
              </p>
            )}
            <button
              disabled={!date || feas.level === "not_possible"}
              onClick={() => setStep(3)}
              className="mt-10 rounded-full bg-burgundy px-6 py-2.5 text-canvas disabled:opacity-30"
            >
              Continue
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fadeUp">
            <h1 className="font-serif text-3xl">Where are we sending it?</h1>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="city"
              className="mt-6 w-full border-b border-taupe bg-transparent pb-2 font-serif text-2xl outline-none placeholder:text-ink/30 focus:border-burgundy"
            />
            <input
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="pincode"
              inputMode="numeric"
              className="mt-6 w-full border-b border-taupe bg-transparent pb-2 font-serif text-2xl outline-none placeholder:text-ink/30 focus:border-burgundy"
            />
            <button
              disabled={!city.trim() || pincode.length !== 6}
              onClick={finish}
              className="mt-10 rounded-full bg-burgundy px-6 py-2.5 text-canvas disabled:opacity-30"
            >
              Begin {name.trim() ? `${name.trim()}'s` : "their"} story
            </button>
          </section>
        )}

        <div className="mt-16 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full ${
                i <= step ? "bg-burgundy" : "bg-taupe"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
