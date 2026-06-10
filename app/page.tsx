"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Wordmark from "@/components/Wordmark";

/* ---------- shared bits ---------- */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

// Deterministic bar heights so server and client render identically.
function barHeight(i: number) {
  return 8 + ((i * 37) % 23);
}

function Waveform({
  bars = 26,
  color = "#B8975A",
  className = "",
}: {
  bars?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex h-10 items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{ height: [barHeight(i), barHeight(i + 7), barHeight(i)] }}
          transition={{
            repeat: Infinity,
            duration: 1.4 + (i % 5) * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Heart({ size = 22, color = "#6B2737" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.6-9.5-8.5C.6 9.4 2.2 5.5 5.7 5.1c2-.2 3.9.8 4.9 2.4l1.4 2 1.4-2c1-1.6 2.9-2.6 4.9-2.4 3.5.4 5.1 4.3 3.2 7.4C19 16.4 12 21 12 21z"
        fill={color}
      />
    </svg>
  );
}

/* ---------- product mockups ---------- */

// The hardcover card cover — a Spotify-plaque style print for one person.
function CardPlaque({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-60 rounded-2xl border border-taupe bg-white p-5 shadow-xl ${className}`}
    >
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-burgundy via-[#8a3a4d] to-gold">
        <Heart size={44} color="#FAF7F2" />
      </div>
      <div className="mt-4 font-serif text-lg leading-tight text-ink">
        Riya&rsquo;s Song
      </div>
      <div className="text-xs text-ink/50">written for exactly one person</div>
      <div className="mt-3 h-1 w-full rounded-full bg-taupe">
        <div className="h-1 w-2/3 rounded-full bg-ink" />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink/40">
        <span>1:58</span>
        <span>3:02</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5 text-ink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 6h2v12H6zM9 12l10 6V6z" transform="scale(-1,1) translate(-24,0)" />
        </svg>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#FAF7F2" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 6h2v12H6zM9 12l10 6V6z" />
        </svg>
      </div>
    </div>
  );
}

// The recipient page, previewed in a phone frame. The heart is real:
// tap it and the page says what it always says.
function PhonePreview({ className = "" }: { className?: string }) {
  const [whisper, setWhisper] = useState(false);

  function tapHeart() {
    setWhisper(true);
    setTimeout(() => setWhisper(false), 2000);
  }

  return (
    <div
      className={`w-64 rounded-[2.2rem] border border-ink/20 bg-charcoal p-5 pb-7 text-canvas shadow-2xl ${className}`}
    >
      <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-canvas/20" />
      <div className="text-[10px] uppercase tracking-[0.25em] text-gold">
        for our favourite person
      </div>
      <div className="mt-1 font-serif text-3xl">Riya</div>
      <div className="text-xs text-canvas/50">listening since 2002</div>

      <div className="relative mt-5 flex justify-center">
        <motion.button
          onClick={tapHeart}
          whileTap={{ scale: 1.25 }}
          aria-label="tap the heart"
          className="rounded-full p-2"
        >
          <Heart size={34} />
        </motion.button>
        <AnimatePresence>
          {whisper && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-7 whitespace-nowrap font-serif text-sm text-gold"
            >
              you&rsquo;re our favourite person
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Waveform className="mt-4 justify-center" />

      <div className="mt-5 rounded-xl bg-canvas/5 p-3 text-xs leading-relaxed text-canvas/70">
        remember the rooftop chai, the night before results? you laughed first.
        you always laugh first.
      </div>
      <div className="mt-2 rounded-xl bg-canvas/5 p-3 text-xs leading-relaxed text-canvas/50">
        happy birthday, our golden hour heart…
      </div>
    </div>
  );
}

function RfidPair({ className = "" }: { className?: string }) {
  const titles = ["Golden Hour Heart", "Brave on Both Sides", "Confetti Weather"];
  return (
    <div className={`relative h-44 w-72 ${className}`} aria-hidden>
      <div className="absolute left-8 top-3 w-56 -rotate-2 rounded-2xl bg-ink p-4 text-canvas opacity-60 shadow-lg" />
      <div className="absolute left-0 top-0 w-56 rotate-2 rounded-2xl bg-charcoal p-4 text-canvas shadow-xl">
        <div className="text-[9px] uppercase tracking-[0.25em] text-gold">
          happy birthday
        </div>
        <div className="mt-0.5 font-serif text-base">Riya</div>
        <ul className="mt-2.5 space-y-1.5">
          {titles.map((t) => (
            <li key={t} className="flex items-center gap-2 text-xs text-canvas/85">
              <Heart size={10} /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] text-canvas/40">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-canvas/40" />
          tap or scan to listen
        </div>
      </div>
    </div>
  );
}

/* ---------- the four pages ---------- */

function MiniPage({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div {...reveal} className="flex flex-col">
      <div className="flex aspect-[3/4] flex-col rounded-xl border border-taupe bg-white p-4 shadow-sm">
        {children}
      </div>
      <p className="mt-3 text-center text-xs text-ink/60">{label}</p>
    </motion.div>
  );
}

function PagesOfTheCard() {
  return (
    <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4">
      <MiniPage label="page one — the two of you">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-taupe/60 to-taupe/20 text-[10px] text-ink/40">
          your photo together
        </div>
        <p className="mt-3 text-center font-serif text-sm">happy birthday, Riya</p>
      </MiniPage>
      <MiniPage label="page two — your memories">
        <p className="font-serif text-xs">the rooftop chai</p>
        <div className="mt-1.5 space-y-1">
          {[82, 66, 78].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-taupe" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-3 font-serif text-xs">the wrong train, 2019</p>
        <div className="mt-1.5 space-y-1">
          {[80, 64, 72].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-taupe" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-3 font-serif text-xs">the quiet semester</p>
        <div className="mt-1.5 space-y-1">
          {[76, 58].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-taupe" style={{ width: `${w}%` }} />
          ))}
        </div>
      </MiniPage>
      <MiniPage label="page three — her song">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Heart size={26} />
          <div className="flex h-5 items-center gap-[2px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-burgundy/60"
                style={{ height: 4 + ((i * 29) % 14) }}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-[2px]" aria-hidden>
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 ${((i * 7) % 3) === 0 ? "bg-ink" : "bg-ink/15"}`}
              />
            ))}
          </div>
          <p className="text-center text-[9px] text-ink/40">
            scan — the card knows the rest
          </p>
        </div>
      </MiniPage>
      <MiniPage label="page four — the unsaid thing">
        <div className="space-y-1">
          {[88, 70, 84, 60].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-taupe" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-3 text-right font-serif text-[10px] text-ink/60">— with everything, A.</p>
        <div className="mt-auto grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded bg-gradient-to-br from-taupe/60 to-taupe/20"
            />
          ))}
        </div>
      </MiniPage>
    </div>
  );
}

/* ---------- page ---------- */

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
    <main className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Wordmark />
        <Link
          href="/begin"
          className="rounded-full bg-burgundy px-5 py-2 text-sm text-canvas transition-opacity hover:opacity-90"
        >
          Begin a gift
        </Link>
      </header>

      {/* Hero — the product itself, not a stock photo */}
      <section className="px-6 pb-24 pt-12 md:px-12 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-serif text-5xl leading-[1.08] md:text-6xl lg:text-7xl"
            >
              Some feelings
              <br />
              need a song.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-ink/70"
            >
              A hardcover card that opens into an original song — written from
              your memories, in their taste, living on a page that belongs to
              one person only.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex items-center gap-5"
            >
              <Link
                href="/begin"
                className="rounded-full bg-burgundy px-8 py-3 text-canvas transition-opacity hover:opacity-90"
              >
                Begin a gift
              </Link>
              <span className="text-sm text-ink/50">from ₹2,999 · 7 days</span>
            </motion.div>
          </div>

          {/* card + phone composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto h-[480px] w-full max-w-md"
          >
            <CardPlaque className="absolute left-0 top-10 -rotate-6" />
            <PhonePreview className="absolute right-0 top-0 md:right-2" />
            <p className="absolute -bottom-1 right-4 max-w-[180px] text-right text-xs text-ink/40">
              the heart works. try it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* string divider */}
      <div aria-hidden className="px-6 md:px-12">
        <svg className="mx-auto w-full max-w-6xl" height="14" viewBox="0 0 1000 14" preserveAspectRatio="none">
          <path
            d="M0 7 L380 7 Q390 1 400 7 Q410 13 420 7 Q430 1 440 7 Q450 13 460 7 Q470 1 480 7 Q490 13 500 7 Q510 1 520 7 Q530 13 540 7 Q550 1 560 7 Q570 13 580 7 Q590 1 600 7 L1000 7"
            stroke="#6B2737"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Inside the card */}
      <section className="px-6 py-24 md:px-12">
        <motion.div {...reveal} className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-burgundy">
            the physical gift
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Four pages. One person on earth.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink/60">
            A hardcover card in the language of album covers — because the
            third page is one.
          </p>
        </motion.div>
        <PagesOfTheCard />

        <motion.div
          {...reveal}
          className="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16"
        >
          <RfidPair />
          <div className="max-w-xs text-center md:text-left">
            <h3 className="font-serif text-xl">And two cards to keep</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Spotify-style RFID cards. Each song title hints at a quality of
              theirs — warmth, courage, mischief. One tap on a phone, and their
              page opens.
            </p>
          </div>
        </motion.div>
      </section>

      {/* The moment — inverted, like the recipient page */}
      <section className="bg-charcoal px-6 py-24 text-canvas md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p {...reveal} className="text-xs uppercase tracking-[0.25em] text-gold">
            the moment
          </motion.p>
          <motion.h2 {...reveal} className="mt-3 font-serif text-3xl md:text-4xl">
            They scan. The room goes quiet.
          </motion.h2>
          <motion.div {...reveal} className="mt-12 grid gap-8 text-left md:grid-cols-3">
            {[
              {
                t: "Their name appears",
                b: "In serif, on a near-black page. No login, no app, no banner. Just them.",
              },
              {
                t: "They tap the heart",
                b: "“you're our favourite person.” Two seconds. Every single time they tap it.",
              },
              {
                t: "The song begins",
                b: "Their memories, set to music, in their taste — while your words and photos drift in below.",
              },
            ].map((s, i) => (
              <div key={s.t}>
                <div className="font-serif text-gold">0{i + 1}</div>
                <h3 className="mt-2 font-serif text-lg">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-canvas/60">{s.b}</p>
              </div>
            ))}
          </motion.div>
          <motion.div {...reveal} className="mt-14 flex justify-center">
            <Waveform bars={40} />
          </motion.div>
          <motion.p {...reveal} className="mt-6 text-sm text-canvas/50">
            The page stays up for years. Some gifts shouldn&rsquo;t expire.
          </motion.p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 md:px-12">
        <motion.h2 {...reveal} className="text-center font-serif text-3xl md:text-4xl">
          You bring the memories. We bring the music.
        </motion.h2>
        <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3">
          {[
            {
              title: "Tell us about them",
              body: "A quiet conversation — in English, Hindi, ya Hinglish — about your favourite person. The nicknames, the rituals, the thing you never said.",
            },
            {
              title: "We craft their song & card",
              body: "An original song written from your memories, in their music taste. You hear it and approve it before anything is printed.",
            },
            {
              title: "They scan, they listen, they cry",
              body: "The card arrives. They tap it. Their page opens. We've watched this part happen — bring tissues.",
            },
          ].map((s, i) => (
            <motion.div key={s.title} {...reveal}>
              <div className="font-serif text-burgundy">0{i + 1}</div>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-taupe px-6 py-24 md:px-12">
        <motion.blockquote {...reveal} className="mx-auto max-w-2xl text-center">
          <Heart size={20} />
          <p className="mt-6 font-serif text-2xl leading-relaxed md:text-3xl">
            &ldquo;She opened the card, scanned it, and by the second line of
            the song she was crying. I have never given a gift that did
            that.&rdquo;
          </p>
          <footer className="mt-6 text-sm text-ink/50">one of our first gifters</footer>
        </motion.blockquote>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 md:px-12">
        <motion.h2 {...reveal} className="text-center font-serif text-3xl md:text-4xl">
          One gift, three ways
        </motion.h2>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              name: "Classic",
              price: "₹2,999",
              lines: ["Hardcover card", "Their original song", "Their page, for years", "2 RFID cards + QR"],
              featured: false,
            },
            {
              name: "Signature",
              price: "₹4,499",
              lines: ["Everything in Classic", "Premium gift box", "One song revision", "Guestbook for friends", "Scented pages"],
              featured: true,
            },
            {
              name: "Together",
              price: "₹5,999",
              lines: ["Everything in Signature", "Friends add memories via a link", "One song, many voices", "Group messages on the page"],
              featured: false,
            },
          ].map((t) => (
            <motion.div
              key={t.name}
              {...reveal}
              className={`relative rounded-2xl border p-8 ${
                t.featured
                  ? "border-gold bg-white shadow-lg"
                  : "border-taupe bg-white/40"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs text-canvas">
                  most chosen
                </span>
              )}
              <h3 className="font-serif text-xl">{t.name}</h3>
              <div className="mt-3 font-serif text-3xl text-burgundy">{t.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-ink/70">
                {t.lines.map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="text-burgundy">·</span> {l}
                  </li>
                ))}
              </ul>
              <Link
                href="/begin"
                className={`mt-8 block rounded-full py-2.5 text-center text-sm transition-opacity hover:opacity-90 ${
                  t.featured
                    ? "bg-burgundy text-canvas"
                    : "border border-taupe hover:border-burgundy"
                }`}
              >
                Begin a gift
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24 md:px-12">
        <motion.h2 {...reveal} className="text-center font-serif text-3xl">
          Questions
        </motion.h2>
        <motion.div {...reveal} className="mx-auto mt-10 max-w-2xl divide-y divide-taupe">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <span className="text-burgundy transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </motion.div>
      </section>

      {/* Closing */}
      <section className="bg-ink px-6 py-24 text-center text-canvas md:px-12">
        <motion.h2 {...reveal} className="mx-auto max-w-xl font-serif text-3xl leading-snug md:text-4xl">
          Somebody&rsquo;s birthday is coming.
          <br />
          You already know whose.
        </motion.h2>
        <motion.div {...reveal}>
          <Link
            href="/begin"
            className="mt-10 inline-block rounded-full bg-canvas px-8 py-3 text-ink transition-opacity hover:opacity-90"
          >
            Begin a gift
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-taupe px-6 py-10 text-center text-sm text-ink/50">
        <Wordmark />
        <p className="mt-3">made slowly, on purpose</p>
      </footer>
    </main>
  );
}
