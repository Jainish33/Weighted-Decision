"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StringProgress from "@/components/StringProgress";
import { COMPLETE_TOKEN } from "@/lib/conversation";
import { getOrder, updateOrder } from "@/lib/store";
import type { ChatMessage, Order } from "@/lib/types";

// Session target is 10-14 assistant turns; progress depth maps onto that.
const TARGET_TURNS = 12;

export default function Conversation() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [complete, setComplete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const o = getOrder(orderId);
    if (!o) {
      router.replace("/begin");
      return;
    }
    setOrder(o);
    setMessages(o.conversation);
    setComplete(o.status === "conversation_complete");
    if (o.conversation.length === 0 && !startedRef.current) {
      startedRef.current = true;
      void ask(o, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function ask(o: Order, history: ChatMessage[]) {
    setStreaming(true);
    let text = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: o.recipientName,
          relationship: o.relationship,
          occasion: o.occasion,
          messages:
            history.length === 0
              ? [
                  {
                    role: "user",
                    content: `I'm ready to tell you about ${o.recipientName}.`,
                  },
                ]
              : history.map(({ role, content }) => ({ role, content })),
        }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        // Stream into a provisional last message for the typing effect.
        setMessages([...history, { role: "assistant", content: "", at: Date.now() }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          const visible = text.replace(COMPLETE_TOKEN, "").trimEnd();
          setMessages([
            ...history,
            { role: "assistant", content: visible, at: Date.now() },
          ]);
        }
      }
    } catch {
      text = "We lost the thread for a moment. Please send that again.";
    }

    const done = text.includes(COMPLETE_TOKEN);
    const finalMsg: ChatMessage = {
      role: "assistant",
      content: text.replace(COMPLETE_TOKEN, "").trim(),
      at: Date.now(),
    };
    const next = [...history, finalMsg];
    setMessages(next);
    setStreaming(false);

    const status = done ? "conversation_complete" : "conversation_active";
    updateOrder(o.id, { conversation: next, status });
    if (done) setComplete(true);
  }

  function send() {
    if (!order || !input.trim() || streaming) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      at: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    updateOrder(order.id, { conversation: next, status: "conversation_active" });
    void ask(order, next);
  }

  if (!order) return null;

  const assistantTurns = messages.filter((m) => m.role === "assistant").length;
  const depth = complete ? 1 : Math.min(0.95, assistantTurns / TARGET_TURNS);

  return (
    <main className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-10 border-b border-taupe bg-canvas/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2">
          <h1 className="font-serif text-lg">
            Tell us about {order.recipientName}
          </h1>
          <StringProgress depth={depth} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div
              key={i}
              className="mb-6 ml-4 border-l border-burgundy/60 pl-4 leading-relaxed"
            >
              {m.content || (
                <span className="text-ink/40">we&rsquo;re listening…</span>
              )}
            </div>
          ) : (
            <div key={i} className="mb-6 leading-relaxed text-ink">
              {m.content}
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      <footer className="sticky bottom-0 border-t border-taupe bg-canvas px-6 py-4">
        <div className="mx-auto max-w-2xl">
          {complete ? (
            <button
              onClick={() => router.push(`/create/${order.id}/taste`)}
              className="w-full rounded-full bg-burgundy py-3 text-canvas"
            >
              Next — their music taste
            </button>
          ) : (
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="write in English, Hindi, ya Hinglish…"
                className="max-h-40 flex-1 resize-none rounded-2xl border border-taupe bg-white/50 px-4 py-3 outline-none placeholder:text-ink/30 focus:border-burgundy"
              />
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                aria-label="send"
                className="rounded-full bg-burgundy p-3 text-canvas disabled:opacity-30"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
