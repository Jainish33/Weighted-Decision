"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { getOrder } from "@/lib/store";
import { STATUS_TIMELINE, type Order, type OrderStatus } from "@/lib/types";

const ORDER_OF: OrderStatus[] = [
  "draft",
  "conversation_active",
  "conversation_complete",
  "song_generating",
  "qc_pending",
  "preview_sent",
  "approved",
  "in_production",
  "shipped",
  "delivered",
  "reaction_collected",
];

export default function Tracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const o = getOrder(orderId);
    if (!o) {
      router.replace("/begin");
      return;
    }
    setOrder(o);
  }, [orderId, router]);

  if (!order) return null;

  const position = ORDER_OF.indexOf(order.status);
  const firstPending = STATUS_TIMELINE.findIndex(
    (s) => position <= ORDER_OF.indexOf(s.status),
  );

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-xl px-6 pb-24 pt-8">
        <h1 className="font-serif text-3xl">
          {order.recipientName}&rsquo;s gift
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Order {order.id} · arriving by{" "}
          {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}
        </p>

        <ol className="mt-12">
          {STATUS_TIMELINE.map((stage, i) => {
            const stagePos = ORDER_OF.indexOf(stage.status);
            const done = position > stagePos;
            const current = !done && i === firstPending;
            return (
              <li key={stage.status} className="relative flex gap-4 pb-10">
                {i < STATUS_TIMELINE.length - 1 && (
                  <span
                    className={`absolute left-[7px] top-5 h-full w-px ${
                      done ? "bg-burgundy" : "bg-taupe"
                    }`}
                  />
                )}
                <span
                  className={`mt-1 h-[15px] w-[15px] shrink-0 rounded-full border ${
                    done
                      ? "border-burgundy bg-burgundy"
                      : current
                        ? "border-burgundy bg-canvas"
                        : "border-taupe bg-canvas"
                  }`}
                />
                <div>
                  <p
                    className={`font-serif ${
                      done || current ? "text-ink" : "text-ink/40"
                    }`}
                  >
                    {stage.label}
                    {done && <span className="ml-2 text-burgundy">✓</span>}
                  </p>
                  {current && (
                    <p className="mt-1 text-sm text-ink/60">
                      {stage.status === "song_generating"
                        ? "This will take a little time. Good things do."
                        : "We'll message you the moment this moves."}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
