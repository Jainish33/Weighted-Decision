"use client";

// The disguised taste-capture quiz. To the recipient this is a playful
// "music personality" quiz; the answers flow into the order's taste profile
// (via Firestore when configured — the slug links it to the order).
import { useState } from "react";
import { useParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const QUESTIONS = [
  {
    q: "It's a long drive. What's playing?",
    options: [
      "Old Bollywood, windows down",
      "Indie playlists no one's heard of",
      "Top 40, loudly",
      "Whatever's on, I'm talking anyway",
    ],
  },
  {
    q: "Pick a concert",
    options: [
      "Arijit, front row",
      "A tiny unplugged gig",
      "A festival with friends",
      "Coke Studio live",
    ],
  },
  {
    q: "Your 2am song is…",
    options: [
      "Something soft and sad, obviously",
      "A comfort song from school days",
      "Lo-fi until I fall asleep",
      "2am? I'm asleep",
    ],
  },
  {
    q: "Language of your repeat-list?",
    options: ["Hindi", "English", "A proper mix", "Regional gems"],
  },
];

export default function Quiz() {
  const { slug } = useParams<{ slug: string }>();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [artists, setArtists] = useState("");
  const [done, setDone] = useState(false);

  function answer(option: string) {
    const next = [...answers, option];
    setAnswers(next);
    setStep(step + 1);
  }

  async function finish() {
    const firestore = db();
    if (firestore) {
      await setDoc(doc(firestore, "quizzes", slug), {
        slug,
        answers,
        artists,
        at: Date.now(),
      }).catch(() => {});
    }
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-charcoal text-canvas">
      <div className="mx-auto max-w-md px-6 py-16">
        {!done && step < QUESTIONS.length && (
          <section className="animate-fadeUp">
            <p className="text-xs uppercase tracking-widest text-gold">
              what&rsquo;s your music personality?
            </p>
            <h1 className="mt-3 font-serif text-2xl">
              {QUESTIONS[step].q}
            </h1>
            <div className="mt-8 grid gap-3">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o}
                  onClick={() => answer(o)}
                  className="rounded-xl border border-canvas/20 p-4 text-left text-sm hover:border-gold"
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="mt-10 flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-8 rounded-full ${
                    i <= step ? "bg-gold" : "bg-canvas/20"
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {!done && step >= QUESTIONS.length && (
          <section className="animate-fadeUp">
            <h1 className="font-serif text-2xl">
              Last one — name two artists you can&rsquo;t skip
            </h1>
            <input
              value={artists}
              onChange={(e) => setArtists(e.target.value)}
              placeholder="e.g. Arijit Singh, Prateek Kuhad"
              className="mt-8 w-full border-b border-canvas/30 bg-transparent pb-2 outline-none placeholder:text-canvas/30 focus:border-gold"
            />
            <button
              onClick={finish}
              disabled={!artists.trim()}
              className="mt-8 w-full rounded-full bg-gold py-3 text-charcoal disabled:opacity-30"
            >
              See my result
            </button>
          </section>
        )}

        {done && (
          <section className="animate-fadeUp text-center">
            <p className="text-xs uppercase tracking-widest text-gold">
              your music personality
            </p>
            <h1 className="mt-4 font-serif text-3xl">The Feeler</h1>
            <p className="mt-4 text-sm leading-relaxed text-canvas/70">
              You don&rsquo;t just listen to music — you live inside it.
              Songs are how you remember people.
            </p>
            <p className="mt-10 text-xs text-canvas/40">
              thanks for playing ♥
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
