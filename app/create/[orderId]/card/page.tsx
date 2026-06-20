"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { getOrder, updateOrder } from "@/lib/store";
import type { CardContent, Order } from "@/lib/types";

const PAGES = ["Page 1", "Page 2", "Page 3", "Page 4", "RFID cards"] as const;

export default function CardBuilder() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [card, setCard] = useState<CardContent | null>(null);
  const [page, setPage] = useState(0);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    const o = getOrder(orderId);
    if (!o) {
      router.replace("/begin");
      return;
    }
    setOrder(o);
    if (o.card) {
      setCard(o.card);
    } else {
      setDrafting(true);
      fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: o.recipientName,
          relationship: o.relationship,
          occasion: o.occasion,
          transcript: o.conversation,
        }),
      })
        .then((r) => r.json())
        .then((draft: CardContent) => {
          setCard(draft);
          updateOrder(o.id, { card: draft });
        })
        .finally(() => setDrafting(false));
    }
  }, [orderId, router]);

  if (!order) return null;

  function patch(p: Partial<CardContent>) {
    const next = { ...card!, ...p };
    setCard(next);
    updateOrder(order!.id, { card: next });
  }

  if (drafting || !card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
        <p className="font-serif text-xl text-ink/60">
          drafting from {order.recipientName}&rsquo;s story…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-4">
        <h1 className="font-serif text-3xl">The card</h1>
        <p className="mt-2 text-sm text-ink/60">
          We drafted everything from your conversation. You are the author —
          edit anything.
        </p>

        <div className="mt-8 flex gap-2 overflow-x-auto">
          {PAGES.map((p, i) => (
            <button
              key={p}
              onClick={() => setPage(i)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm ${
                page === i
                  ? "border-burgundy bg-burgundy text-canvas"
                  : "border-taupe hover:border-burgundy"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* The live page preview — hardcover-card proportions */}
        <div className="mt-8 rounded-2xl border border-taupe bg-white p-8 shadow-sm">
          {page === 0 && (
            <section className="animate-fadeUp text-center">
              <div className="mx-auto flex aspect-[4/3] max-w-xs items-center justify-center rounded-xl border border-dashed border-taupe text-sm text-ink/40">
                your photo together
                <br />
                (uploads arrive with production)
              </div>
              <textarea
                value={card.page1Greeting}
                onChange={(e) => patch({ page1Greeting: e.target.value })}
                rows={2}
                className="mt-6 w-full resize-none bg-transparent text-center font-serif text-2xl outline-none"
              />
            </section>
          )}

          {page === 1 && (
            <section className="animate-fadeUp">
              <h2 className="font-serif text-xl">Memories of you two</h2>
              {card.page2Memories.map((m, i) => (
                <div key={i} className="mt-4 flex gap-2">
                  <textarea
                    value={m}
                    onChange={(e) => {
                      const next = [...card.page2Memories];
                      next[i] = e.target.value;
                      patch({ page2Memories: next });
                    }}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-taupe bg-canvas/50 p-3 text-sm leading-relaxed outline-none focus:border-burgundy"
                  />
                  <button
                    aria-label="remove memory"
                    onClick={() =>
                      patch({
                        page2Memories: card.page2Memories.filter(
                          (_, j) => j !== i,
                        ),
                      })
                    }
                    className="self-start text-ink/30 hover:text-burgundy"
                  >
                    ×
                  </button>
                </div>
              ))}
              {card.page2Memories.length < 4 && (
                <button
                  onClick={() =>
                    patch({ page2Memories: [...card.page2Memories, ""] })
                  }
                  className="mt-4 text-sm text-burgundy"
                >
                  + add a memory
                </button>
              )}
            </section>
          )}

          {page === 2 && (
            <section className="flex animate-fadeUp flex-col items-center py-10 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7-4.6-9.5-8.5C.6 9.4 2.2 5.5 5.7 5.1c2-.2 3.9.8 4.9 2.4l1.4 2 1.4-2c1-1.6 2.9-2.6 4.9-2.4 3.5.4 5.1 4.3 3.2 7.4C19 16.4 12 21 12 21z"
                  fill="#6B2737"
                />
              </svg>
              <h2 className="mt-4 font-serif text-xl">Your song appears here</h2>
              <p className="mt-2 max-w-xs text-sm text-ink/60">
                Once the conversation becomes music, page 3 carries the QR and
                RFID that opens {order.recipientName}&rsquo;s page.
              </p>
            </section>
          )}

          {page === 3 && (
            <section className="animate-fadeUp">
              <h2 className="font-serif text-xl">Your message</h2>
              <textarea
                value={card.page4Message}
                onChange={(e) => patch({ page4Message: e.target.value })}
                rows={7}
                className="mt-4 w-full resize-none rounded-xl border border-taupe bg-canvas/50 p-3 text-sm leading-relaxed outline-none focus:border-burgundy"
              />
              <div className="mt-4 flex aspect-[3/1] items-center justify-center rounded-xl border border-dashed border-taupe text-sm text-ink/40">
                photos of {order.recipientName} (uploads arrive with production)
              </div>
            </section>
          )}

          {page === 4 && (
            <section className="animate-fadeUp">
              <h2 className="font-serif text-xl">Their three songs</h2>
              <p className="mt-2 text-sm text-ink/60">
                Each RFID card carries Spotify-style song titles that hint at
                who {order.recipientName} is —{" "}
                {card.qualities.join(", ")}. Pick three.
              </p>
              <div className="mt-4 grid gap-2">
                {card.rfidTitles.map((t, i) => {
                  const picked = i < 3;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        aria-label={picked ? "deselect" : "move up"}
                        onClick={() => {
                          const next = [...card.rfidTitles];
                          const [item] = next.splice(i, 1);
                          picked ? next.push(item) : next.unshift(item);
                          patch({ rfidTitles: next });
                        }}
                        className={`h-5 w-5 rounded-full border ${
                          picked
                            ? "border-burgundy bg-burgundy"
                            : "border-taupe"
                        }`}
                      />
                      <input
                        value={t}
                        onChange={(e) => {
                          const next = [...card.rfidTitles];
                          next[i] = e.target.value;
                          patch({ rfidTitles: next });
                        }}
                        className={`flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm outline-none focus:border-burgundy ${
                          picked ? "" : "text-ink/40"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              {/* RFID card preview, dark like the player */}
              <div className="mt-6 rounded-2xl bg-charcoal p-5 text-canvas">
                <div className="text-xs uppercase tracking-widest text-gold">
                  happy {order.occasion}
                </div>
                <div className="mt-1 font-serif text-lg">
                  {order.recipientName}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {card.rfidTitles.slice(0, 3).map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm">
                      <span className="text-burgundy">♥</span> {t || "—"}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>

        <button
          onClick={() => router.push(`/create/${order.id}/review`)}
          className="mt-8 w-full rounded-full bg-burgundy py-3 text-canvas"
        >
          Review &amp; place the order
        </button>
      </div>
    </main>
  );
}
