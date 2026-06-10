"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { getOrder, updateOrder } from "@/lib/store";
import { TIERS, type Order, type Tier } from "@/lib/types";

function prettyDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
  });
}

export default function Review() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [tier, setTier] = useState<Tier>("classic");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const o = getOrder(orderId);
    if (!o) {
      router.replace("/begin");
      return;
    }
    setOrder(o);
    if (o.tier) setTier(o.tier);
  }, [orderId, router]);

  if (!order) return null;

  function pay() {
    setPaying(true);
    // Cashfree integration lands here; until keys are configured the order
    // moves straight into the studio pipeline.
    updateOrder(order!.id, {
      tier,
      paidAt: Date.now(),
      status: "song_generating",
    });
    setTimeout(() => router.push(`/orders/${order!.id}`), 600);
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-xl px-6 pb-24 pt-4">
        <h1 className="font-serif text-3xl">Almost theirs</h1>

        <div className="mt-8 rounded-2xl border border-taupe bg-white/40 p-6 text-sm leading-relaxed">
          <div className="flex justify-between">
            <span className="text-ink/60">For</span>
            <span>
              {order.recipientName} · your {order.relationship}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-ink/60">Occasion</span>
            <span>{order.occasion}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-ink/60">Delivery</span>
            <span>
              {order.city} · {order.pincode}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-ink/60">Story</span>
            <span>{order.conversation.length} messages collected</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-ink/60">Music taste</span>
            <span>
              {order.taste?.mode === "ask_secretly"
                ? "secret quiz sent"
                : order.taste?.artists.join(", ") || "—"}
            </span>
          </div>
        </div>

        <h2 className="mt-10 font-serif text-xl">Choose the gift</h2>
        <div className="mt-4 grid gap-4">
          {(Object.keys(TIERS) as Tier[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                tier === t
                  ? "border-burgundy bg-white"
                  : "border-taupe bg-white/40 hover:border-burgundy"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-lg">{TIERS[t].name}</span>
                <span className="font-serif text-xl text-burgundy">
                  ₹{TIERS[t].price.toLocaleString("en-IN")}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {TIERS[t].includes.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button
          onClick={pay}
          disabled={paying}
          className="mt-10 w-full rounded-full bg-burgundy py-3.5 text-canvas disabled:opacity-50"
        >
          {paying
            ? "One moment…"
            : `Pay ₹${TIERS[tier].price.toLocaleString("en-IN")}`}
        </button>
        <p className="mt-3 text-center text-sm text-ink/60">
          In their hands by {prettyDate(order.deliveryDate)}.
        </p>
      </div>
    </main>
  );
}
