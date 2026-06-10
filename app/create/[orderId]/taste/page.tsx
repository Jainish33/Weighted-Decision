"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { getOrder, updateOrder } from "@/lib/store";
import type { Order, TasteProfile } from "@/lib/types";

const LANGUAGES = ["hindi", "english", "mix", "regional"] as const;

export default function Taste() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [mode, setMode] = useState<TasteProfile["mode"] | null>(null);
  const [artists, setArtists] = useState(["", "", ""]);
  const [songs, setSongs] = useState(["", ""]);
  const [language, setLanguage] =
    useState<TasteProfile["language"]>("mix");
  const [energy, setEnergy] = useState(40);
  const [quizSlug, setQuizSlug] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const o = getOrder(orderId);
    if (!o) {
      router.replace("/begin");
      return;
    }
    setOrder(o);
    if (o.taste) {
      setMode(o.taste.mode);
      setArtists([...o.taste.artists, "", "", ""].slice(0, 3));
      setSongs([...o.taste.songs, "", ""].slice(0, 2));
      setLanguage(o.taste.language);
      setEnergy(o.taste.energy);
      if (o.taste.quizSlug) setQuizSlug(o.taste.quizSlug);
    }
  }, [orderId, router]);

  if (!order) return null;

  function saveAndContinue(taste: TasteProfile) {
    updateOrder(order!.id, { taste });
    router.push(`/create/${order!.id}/card`);
  }

  function makeQuizLink() {
    const slug = `${order!.recipientName.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8) || "you"}-${Math.random().toString(36).slice(2, 6)}`;
    setQuizSlug(slug);
    updateOrder(order!.id, {
      taste: {
        mode: "ask_secretly",
        artists: [],
        songs: [],
        language: "mix",
        energy: 50,
        quizSlug: slug,
      },
    });
  }

  const quizUrl =
    typeof window !== "undefined" && quizSlug
      ? `${window.location.origin}/quiz/${quizSlug}`
      : "";

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-xl px-6 pt-8 pb-20">
        <h1 className="font-serif text-3xl">
          What does {order.recipientName} listen to?
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          The song will be written in their taste, not yours.
        </p>

        {!mode && (
          <div className="mt-10 grid gap-4">
            <button
              onClick={() => setMode("i_know")}
              className="rounded-2xl border border-taupe bg-white/40 p-6 text-left hover:border-burgundy"
            >
              <h2 className="font-serif text-xl">I know their taste</h2>
              <p className="mt-1 text-sm text-ink/60">
                Tell us their artists, their repeat-songs, their language.
              </p>
            </button>
            <button
              onClick={() => setMode("ask_secretly")}
              className="rounded-2xl border border-taupe bg-white/40 p-6 text-left hover:border-burgundy"
            >
              <h2 className="font-serif text-xl">Ask them secretly</h2>
              <p className="mt-1 text-sm text-ink/60">
                We&rsquo;ll give you a disguised music quiz to send them.
                They&rsquo;ll never suspect a thing.
              </p>
            </button>
          </div>
        )}

        {mode === "i_know" && (
          <section className="mt-10 animate-fadeUp">
            <p className="text-sm font-medium">3 artists they love</p>
            {artists.map((a, i) => (
              <input
                key={i}
                value={a}
                onChange={(e) => {
                  const next = [...artists];
                  next[i] = e.target.value;
                  setArtists(next);
                }}
                placeholder={`artist ${i + 1}`}
                className="mt-3 w-full border-b border-taupe bg-transparent pb-1.5 outline-none placeholder:text-ink/30 focus:border-burgundy"
              />
            ))}
            <p className="mt-8 text-sm font-medium">2 songs they replay</p>
            {songs.map((s, i) => (
              <input
                key={i}
                value={s}
                onChange={(e) => {
                  const next = [...songs];
                  next[i] = e.target.value;
                  setSongs(next);
                }}
                placeholder={`song ${i + 1}`}
                className="mt-3 w-full border-b border-taupe bg-transparent pb-1.5 outline-none placeholder:text-ink/30 focus:border-burgundy"
              />
            ))}
            <p className="mt-8 text-sm font-medium">Language</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    language === l
                      ? "border-burgundy bg-burgundy text-canvas"
                      : "border-taupe hover:border-burgundy"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-8 text-sm font-medium">Energy</p>
            <input
              type="range"
              min={0}
              max={100}
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="mt-3 w-full accent-burgundy"
            />
            <div className="flex justify-between text-xs text-ink/50">
              <span>soft &amp; emotional</span>
              <span>upbeat &amp; fun</span>
            </div>
            <button
              disabled={artists.filter((a) => a.trim()).length === 0}
              onClick={() =>
                saveAndContinue({
                  mode: "i_know",
                  artists: artists.filter((a) => a.trim()),
                  songs: songs.filter((s) => s.trim()),
                  language,
                  energy,
                })
              }
              className="mt-10 w-full rounded-full bg-burgundy py-3 text-canvas disabled:opacity-30"
            >
              Next — build their card
            </button>
            <button
              onClick={() => setMode(null)}
              className="mt-3 w-full text-sm text-ink/50"
            >
              back
            </button>
          </section>
        )}

        {mode === "ask_secretly" && (
          <section className="mt-10 animate-fadeUp">
            {!quizSlug ? (
              <button
                onClick={makeQuizLink}
                className="w-full rounded-full bg-burgundy py-3 text-canvas"
              >
                Create their secret quiz link
              </button>
            ) : (
              <>
                <p className="text-sm text-ink/70">
                  Send this to {order.recipientName}. It looks like a fun
                  &ldquo;music personality&rdquo; quiz — their answers flow
                  straight into our studio.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-taupe bg-white/50 p-3">
                  <code className="flex-1 truncate text-sm">{quizUrl}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(quizUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="rounded-full border border-taupe px-3 py-1 text-xs hover:border-burgundy"
                  >
                    {copied ? "copied" : "copy"}
                  </button>
                </div>
                <button
                  onClick={() =>
                    saveAndContinue({
                      mode: "ask_secretly",
                      artists: [],
                      songs: [],
                      language: "mix",
                      energy: 50,
                      quizSlug,
                    })
                  }
                  className="mt-8 w-full rounded-full bg-burgundy py-3 text-canvas"
                >
                  Next — build their card
                </button>
              </>
            )}
            <button
              onClick={() => setMode(null)}
              className="mt-3 w-full text-sm text-ink/50"
            >
              back
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
