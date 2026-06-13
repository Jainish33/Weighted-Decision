"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Wordmark from "@/components/Wordmark";
import { TIERS, CARD_ONLY } from "@/lib/pricing";

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

// A small painted-leaf cluster for the botanical pages.
function Leaves({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden>
      <path d="M8 32 Q14 18 28 14 Q20 26 12 34 Z" fill="#8AA38D" opacity="0.8" />
      <path d="M20 36 Q28 24 42 22 Q34 32 24 38 Z" fill="#3E5C45" opacity="0.6" />
      <path d="M30 14 Q40 6 52 8 Q44 16 34 18 Z" fill="#8AA38D" opacity="0.55" />
    </svg>
  );
}

// QR sketch used on the printed song page.
function QrSketch({ cell = 6 }: { cell?: number }) {
  return (
    <div
      className="grid gap-[1px]"
      style={{ gridTemplateColumns: `repeat(6, ${cell}px)` }}
      aria-hidden
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          style={{ width: cell, height: cell }}
          className={((i * 11) % 3) === 0 || i < 3 || i % 6 === 0 ? "bg-ink/80" : "bg-ink/10"}
        />
      ))}
    </div>
  );
}

/* ---------- the cover: painted, scripted, played ---------- */

const QUALITIES = [
  { word: "Uplifting", line: "you make us better" },
  { word: "Warm-hearted", line: "pure, honest magic" },
  { word: "Radiant", line: "light in our lives" },
  { word: "Compassionate", line: "the heart of us" },
];

function CardCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-[21rem] rounded-xl border border-taupe bg-cream p-4 shadow-2xl md:w-[24rem] ${className}`}
    >
      <div className="relative z-10 -mb-4 text-center font-script text-4xl text-ink">
        Happy Birthday
      </div>

      {/* the painting */}
      <div
        className="relative h-52 overflow-hidden rounded-lg"
        style={{
          background:
            "linear-gradient(155deg,#88a7c2 0%,#9db89a 28%,#5f9163 55%,#3c6b45 82%)",
        }}
      >
        {/* brush-stroke texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(112deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 9px), repeating-linear-gradient(75deg, rgba(20,40,20,0.25) 0 1px, transparent 1px 12px)",
          }}
        />
        {/* frosted player panel */}
        <div className="absolute bottom-3 left-[6.5rem] right-3 top-3 rounded-lg bg-cream/20 backdrop-blur-[1.5px]" />

        {/* circular photo */}
        <div
          className="absolute left-12 top-1/2 z-10 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream/80 text-center text-[8px] leading-tight text-cream/90 shadow-lg"
          style={{ background: "radial-gradient(circle at 35% 30%, #6b5a48, #2c241c)" }}
        >
          the two
          <br />
          of you
        </div>

        {/* vertical player strip */}
        <div className="absolute left-[8.7rem] top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 text-cream">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4 17h3l4-5-4-5H4l4 5zm9-10 4 5-4 5h3l4-5-4-5z" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 6h2v12H6zM18 6l-8 6 8 6z" />
          </svg>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#3E5C45" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 6h2v12h-2zM6 6l8 6-8 6z" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z" />
          </svg>
        </div>

        {/* song title, sideways like the print */}
        <div
          className="absolute left-[11.2rem] top-1/2 z-10 -translate-y-1/2 text-[8px] uppercase tracking-[0.2em] text-cream/90"
          style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
        >
          beautiful soul · their song
        </div>

        {/* the four qualities */}
        <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 gap-3">
          {QUALITIES.map((q) => (
            <div key={q.word} className="flex flex-col items-center gap-1.5">
              <div
                className="flex gap-1"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                <span className="text-[9px] font-semibold tracking-wide text-cream">
                  {q.word}
                </span>
                <span className="text-[7px] text-cream/75">{q.line}</span>
              </div>
              <span
                className="h-7 w-7 rounded-[3px] border border-cream/40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(243,236,221,0.85), rgba(194,165,130,0.65))",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* TO, ____________ */}
      <div className="mt-4 flex items-center gap-3 px-1">
        <span className="text-[10px] tracking-[0.25em] text-ink/80">TO,</span>
        <span className="h-px flex-1 bg-ink/70" />
      </div>
      <p className="mt-1.5 px-1 text-xs text-ink/55">
        by the ones who love them
      </p>
    </div>
  );
}

/* ---------- the personal page, in a phone ---------- */

function PhonePreview({ className = "" }: { className?: string }) {
  const [whisper, setWhisper] = useState(false);

  function tapHeart() {
    setWhisper(true);
    setTimeout(() => setWhisper(false), 2000);
  }

  return (
    <div
      className={`w-60 rounded-[2.2rem] border border-ink/20 bg-charcoal p-5 pb-6 text-canvas shadow-2xl ${className}`}
    >
      <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-canvas/20" />
      <div className="text-[10px] uppercase tracking-[0.25em] text-gold">
        a page that belongs to
      </div>
      <div className="mt-1 font-script text-4xl text-canvas">your person</div>
      <div className="mt-1 text-xs text-canvas/50">listening since their birth year</div>

      <div className="relative mt-5 flex justify-center">
        <motion.button
          onClick={tapHeart}
          whileTap={{ scale: 1.25 }}
          aria-label="tap the heart"
          className="rounded-full p-2"
        >
          <Heart size={32} />
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

      <Waveform className="mt-3 justify-center" bars={22} />

      <div className="mt-4 rounded-xl bg-canvas/5 p-3 text-xs leading-relaxed text-canvas/70">
        your words and photographs drift in, line by line, as the song plays
      </div>

      <div className="mt-4 rounded-full border border-canvas/15 px-3 py-1.5 text-center text-[9px] text-canvas/50">
        heartstrings.gift/for/your-person
      </div>
    </div>
  );
}

/* ---------- the inner pages, in miniature ---------- */

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-3 w-10 rounded-[2px] bg-paper/90 opacity-80 shadow-sm ${className}`}
      aria-hidden
    />
  );
}

function MiniPage({
  label,
  children,
  bg,
}: {
  label: string;
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <motion.div {...reveal} className="flex flex-col">
      <div
        className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl border border-taupe p-4 shadow-sm"
        style={{ background: bg }}
      >
        {children}
      </div>
      <p className="mt-3 text-center text-xs text-ink/60">{label}</p>
    </motion.div>
  );
}

function PagesOfTheCard() {
  return (
    <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4">
      {/* the greeting — watercolour botanicals */}
      <MiniPage
        label="the greeting, in watercolour"
        bg="linear-gradient(160deg,#F6F8F0,#E7EFE2)"
      >
        <Leaves className="absolute -right-2 -top-1 rotate-12" />
        <Leaves className="absolute -bottom-1 -left-2 rotate-[195deg]" />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-script text-2xl leading-snug text-forest">
            Happy
            <br />
            Birthday
          </p>
          <p className="mt-2 text-[9px] tracking-[0.2em] text-forest/60">
            THEIR NAME, HAND-SET
          </p>
        </div>
      </MiniPage>

      {/* the song, printed on aged paper with the QR */}
      <MiniPage
        label="their song — printed, scannable"
        bg="linear-gradient(165deg,#F0E4C8,#E4D2A9)"
      >
        <p className="text-center font-serif text-[10px] text-ink/80">
          Happy Birthday, dear you
        </p>
        <div className="mt-2 space-y-1.5">
          <p className="font-serif text-[8px] italic leading-relaxed text-ink/60">
            we&rsquo;ve seen each other break, we&rsquo;ve seen each other
            bloom…
          </p>
          {[84, 70, 78, 56, 80, 64].map((w, i) => (
            <div key={i} className="h-[3px] rounded-full bg-ink/15" style={{ width: `${w}%` }} />
          ))}
          <p className="font-serif text-[8px] italic leading-relaxed text-ink/60">
            …we&rsquo;ll be there — with your favourite song.
          </p>
          {[74, 60].map((w, i) => (
            <div key={i} className="h-[3px] rounded-full bg-ink/15" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-[8px] italic text-ink/50">scan to hear it</span>
          <QrSketch cell={5} />
        </div>
      </MiniPage>

      {/* favourite memories — polaroids and tape */}
      <MiniPage
        label="favourite memories"
        bg="linear-gradient(160deg,#D6C2A4,#C2A582)"
      >
        <p className="font-script text-xl text-ink/80">Favourite Memories</p>
        <div className="relative mt-2 flex-1">
          <div className="absolute left-1 top-1 w-20 -rotate-6 rounded-sm bg-white p-1.5 pb-4 shadow-md">
            <div className="aspect-square rounded-[2px] bg-gradient-to-br from-sage/70 to-forest/50" />
            <Tape className="-top-1.5 left-5 rotate-3" />
          </div>
          <div className="absolute right-0 top-6 w-20 rotate-6 rounded-sm bg-white p-1.5 pb-4 shadow-md">
            <div className="aspect-square rounded-[2px] bg-gradient-to-br from-kraft to-paper" />
            <Tape className="-top-1.5 right-4 -rotate-6" />
          </div>
          <div className="absolute bottom-0 left-7 w-20 -rotate-2 rounded-sm bg-white p-1.5 pb-4 shadow-md">
            <div className="aspect-square rounded-[2px] bg-gradient-to-br from-burgundy/40 to-gold/40" />
            <Tape className="-top-1.5 left-6 rotate-12" />
          </div>
        </div>
      </MiniPage>

      {/* the letter — kraft collage */}
      <MiniPage
        label="the letter you never sent"
        bg="linear-gradient(160deg,#E2D3BD,#D2BD9F)"
      >
        <div className="relative flex-1 rounded-md bg-cream p-3 shadow-inner">
          <Heart size={11} color="#A8323E" />
          <p className="mt-1.5 font-serif text-[9px] italic text-ink/75">
            Dear you,
          </p>
          <div className="mt-1.5 space-y-1">
            {[90, 78, 86, 64, 82, 70, 50].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full bg-ink/12" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-2 text-right font-serif text-[8px] italic text-ink/60">
            with all our love —
          </p>
          <span className="absolute -bottom-1 right-2">
            <Heart size={13} color="#A8323E" />
          </span>
        </div>
      </MiniPage>
    </div>
  );
}

/* ---------- the keepsake cards ---------- */

function RfidPair({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-44 w-72 ${className}`} aria-hidden>
      <div className="absolute left-8 top-3 w-56 -rotate-2 rounded-2xl bg-ink p-4 opacity-50 shadow-lg" style={{ height: "10rem" }} />
      <div className="absolute left-0 top-0 w-56 rotate-2 rounded-2xl bg-forest p-4 text-cream shadow-xl">
        <div className="text-[9px] uppercase tracking-[0.25em] text-gold">
          happy birthday
        </div>
        <div className="font-script text-2xl">to our favourite person</div>
        <ul className="mt-2 space-y-1.5">
          {QUALITIES.slice(0, 3).map((q) => (
            <li key={q.word} className="flex items-center gap-2 text-xs text-cream/90">
              <Heart size={10} color="#B8975A" /> {q.word} — {q.line}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] text-cream/50">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-cream/50" />
          tap on any phone — their page opens
        </div>
      </div>
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
      <header className="flex items-center justify-between border-b border-gold/30 px-6 py-5 md:px-12">
        <Wordmark />
        <div className="flex items-center gap-5">
          <span className="hidden text-xs uppercase tracking-[0.22em] text-ink/40 sm:inline">
            by appointment
          </span>
          <Link
            href="/begin"
            className="rounded-full bg-forest px-5 py-2 text-sm text-cream transition-opacity hover:opacity-90"
          >
            Begin a gift
          </Link>
        </div>
      </header>

      {/* Hero — the actual card, the actual page */}
      <section className="px-6 pb-24 pt-12 md:px-12 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-forest"
            >
              <span className="h-px w-8 bg-gold" />
              Handcrafted to order
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
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
              A hand-finished hardcover card — watercolour, aged paper,
              polaroids — that opens into an original song written from your
              memories. One tap, and their page begins to play.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex items-center gap-5"
            >
              <Link
                href="/begin"
                className="rounded-full bg-forest px-8 py-3 text-cream transition-opacity hover:opacity-90"
              >
                Begin a gift
              </Link>
              <span className="text-sm text-ink/50">from ₹1,700</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-ink/45"
            >
              <span>Made to order</span>
              <span className="text-gold">·</span>
              <span>Pan-India</span>
              <span className="text-gold">·</span>
              <span>In their hands in 7 days</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto h-[520px] w-full max-w-md"
          >
            <CardCover className="absolute left-0 top-16 -rotate-3" />
            <PhonePreview className="absolute -right-2 top-0 z-10 md:right-0" />
            <p className="absolute bottom-2 right-4 max-w-[180px] text-right text-xs text-ink/40">
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
            stroke="#3E5C45"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Inside the card */}
      <section className="px-6 py-24 md:px-12">
        <motion.div {...reveal} className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-forest">
            the physical gift
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Every page, made for one person on earth
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink/60">
            Watercolour botanicals, aged paper, polaroids and tape — and on the
            song page, a QR that knows exactly who it belongs to.
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
              A pair of keepsake RFID cards, each carrying the qualities that
              make them <em>them</em>. Tap one on any phone — no app, no
              login — and their page opens.
            </p>
          </div>
        </motion.div>
      </section>

      {/* The moment — inverted, like the personal page */}
      <section className="bg-charcoal px-6 py-24 text-canvas md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p {...reveal} className="text-xs uppercase tracking-[0.25em] text-gold">
            the moment
          </motion.p>
          <motion.h2 {...reveal} className="mt-3 font-serif text-3xl md:text-4xl">
            They tap the card. The room goes quiet.
          </motion.h2>
          <motion.div {...reveal} className="mt-12 grid gap-8 text-left md:grid-cols-3">
            {[
              {
                t: "One tap, or one scan",
                b: "The RFID card on a phone, or the QR on the song page — both open the same address: a page with their name on it.",
              },
              {
                t: "They tap the heart",
                b: "“you're our favourite person.” Two seconds. Every single time they tap it.",
              },
              {
                t: "Their song begins",
                b: "Your memories, set to music, in their taste — while your letter and photographs drift in below.",
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
          <motion.p {...reveal} className="mt-6 inline-block rounded-full border border-canvas/15 px-4 py-1.5 text-xs text-canvas/50">
            heartstrings.gift/for/your-person — theirs for years
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
              body: "An original song written from your memories, in their music taste — printed as lyrics on aged paper, with your letter and photographs. You approve everything first.",
            },
            {
              title: "They scan, they listen, they cry",
              body: "The card arrives. They tap it. Their page opens. We've watched this part happen — bring tissues.",
            },
          ].map((s, i) => (
            <motion.div key={s.title} {...reveal}>
              <div className="font-serif text-forest">0{i + 1}</div>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-taupe px-6 py-24 md:px-12">
        <motion.blockquote {...reveal} className="mx-auto max-w-2xl text-center">
          <Heart size={20} color="#A8323E" />
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
        <motion.div {...reveal} className="text-center">
          <p className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em] text-forest">
            <span className="h-px w-8 bg-gold" />
            the collection
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            One gift, three ways
          </h2>
        </motion.div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <motion.div
              key={t.id}
              {...reveal}
              className={`relative flex flex-col rounded-2xl border p-8 ${
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
              <p className="mt-1 text-xs italic text-ink/45">{t.tagline}</p>
              <div className="mt-3 font-serif text-3xl text-forest">
                ₹{t.price.toLocaleString("en-IN")}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-ink/70">
                {t.includes.map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="text-gold">·</span> {l}
                  </li>
                ))}
              </ul>
              <Link
                href={`/begin?tier=${t.id}`}
                className={`mt-8 block rounded-full py-2.5 text-center text-sm transition-opacity hover:opacity-90 ${
                  t.featured
                    ? "bg-forest text-cream"
                    : "border border-taupe hover:border-forest"
                }`}
              >
                Begin a gift
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.p {...reveal} className="mt-8 text-center text-sm text-ink/50">
          {CARD_ONLY.note} —{" "}
          <Link
            href={`/begin?tier=${CARD_ONLY.id}`}
            className="text-forest underline-offset-4 hover:underline"
          >
            {CARD_ONLY.name}, ₹{CARD_ONLY.price}
          </Link>
        </motion.p>
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
                <span className="text-forest transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </motion.div>
      </section>

      {/* Closing */}
      <section className="bg-ink px-6 py-24 text-center text-canvas md:px-12">
        <motion.p {...reveal} className="font-script text-3xl text-gold">
          Happy Birthday
        </motion.p>
        <motion.h2 {...reveal} className="mx-auto mt-4 max-w-xl font-serif text-3xl leading-snug md:text-4xl">
          Somebody&rsquo;s birthday is coming.
          <br />
          You already know whose.
        </motion.h2>
        <motion.div {...reveal}>
          <Link
            href="/begin"
            className="mt-10 inline-block rounded-full bg-cream px-8 py-3 text-ink transition-opacity hover:opacity-90"
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
