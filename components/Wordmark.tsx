import Link from "next/link";

// The wordmark: serif type with a single thin line through it that reads as
// both a guitar string and an audio waveform.
export default function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link href="/" className="inline-block group">
      <span
        className={`relative font-serif text-ink ${
          size === "lg" ? "text-4xl" : "text-xl"
        }`}
      >
        Heart Strings
        <svg
          className="absolute left-0 -bottom-1 w-full"
          height="6"
          viewBox="0 0 200 6"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 3 L70 3 Q75 0.5 80 3 Q85 5.5 90 3 Q95 0.5 100 3 Q105 5.5 110 3 Q115 0.5 120 3 L200 3"
            stroke="#6B2737"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </span>
    </Link>
  );
}
