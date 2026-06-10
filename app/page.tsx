import Link from "next/link";
import Wordmark from "@/components/Wordmark";

const STEPS = [
  {
    title: "Tell us about them",
    body: "A quiet conversation about your favourite person. Their story, your memories, the things you never quite said.",
  },
  {
    title: "We craft their song & card",
    body: "An original song written from your memories, inside a hardcover card made for exactly one person on earth.",
  },
  {
    title: "They scan. They listen. They cry.",
    body: "A tap of the card opens their own page — their song, your words, your photographs. It stays theirs, forever.",
  },
];

const FAQS = [
  {
    q: "How long does it take?",
    a: "Most gifts are in their hands within 7 days. We confirm your date before you pay — we never accept an order we can't deliver.",
  },
  {
    q: "What if I don't know their music taste?",
    a: "We'll give you a disguised little music quiz to send them. They'll never know what it was for.",
  },
  {
    q: "How long does their page stay up?",
    a: "A minimum of five years, and we intend forever. Permanence is part of the gift.",
  },
  {
    q: "Can I hear the song before it ships?",
    a: "Yes. You approve the song before the card goes to production.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Wordmark />
        <Link
          href="/begin"
          className="rounded-full bg-burgundy px-5 py-2 text-sm text-canvas transition-opacity hover:opacity-90"
        >
          Begin a gift
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pb-20 pt-16 text-center md:pt-28">
        <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-7xl animate-fadeUp">
          Some feelings need a song.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70 animate-fadeUp">
          A hardcover card. An original song written from your memories.
          A page on the internet that belongs to one person only.
        </p>
        <Link
          href="/begin"
          className="mt-10 inline-block rounded-full bg-burgundy px-8 py-3 text-canvas transition-opacity hover:opacity-90 animate-fadeUp"
        >
          Begin a gift
        </Link>
      </section>

      {/* How it works */}
      <section className="border-t border-taupe px-6 py-20 md:px-12">
        <h2 className="text-center font-serif text-3xl">How it works</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title}>
              <div className="font-serif text-burgundy">0{i + 1}</div>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-taupe bg-ink px-6 py-20 text-canvas md:px-12">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl leading-relaxed md:text-3xl">
            &ldquo;She opened the card, scanned it, and by the second line of
            the song she was crying. I have never given a gift that did
            that.&rdquo;
          </p>
          <footer className="mt-6 text-sm text-canvas/60">
            one of our first gifters
          </footer>
        </blockquote>
      </section>

      {/* Pricing */}
      <section className="border-t border-taupe px-6 py-20 md:px-12">
        <h2 className="text-center font-serif text-3xl">One gift, three ways</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { name: "Classic", price: "₹2,999", note: "Card, song, their page, 2 RFID cards" },
            { name: "Signature", price: "₹4,499", note: "Gift box, a revision, guestbook, scented pages" },
            { name: "Together", price: "₹5,999", note: "Friends contribute memories to one song" },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-taupe bg-white/40 p-8 text-center"
            >
              <h3 className="font-serif text-xl">{t.name}</h3>
              <div className="mt-3 font-serif text-3xl text-burgundy">
                {t.price}
              </div>
              <p className="mt-3 text-sm text-ink/70">{t.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-taupe px-6 py-20 md:px-12">
        <h2 className="text-center font-serif text-3xl">Questions</h2>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-taupe">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-taupe px-6 py-10 text-center text-sm text-ink/50">
        <Wordmark />
        <p className="mt-3">made slowly, on purpose</p>
      </footer>
    </main>
  );
}
