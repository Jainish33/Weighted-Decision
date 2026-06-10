"use client";

// The brand motif made functional: a string that gains gentle waveform
// curves as the conversation deepens. `depth` goes from 0 to 1.
export default function StringProgress({ depth }: { depth: number }) {
  const waves = Math.max(0, Math.round(depth * 12));
  const segment = 300 / 13;
  let d = "M0 8";
  for (let i = 0; i < 13; i++) {
    const x0 = i * segment;
    const x1 = (i + 1) * segment;
    if (i < waves) {
      const amp = 5 * Math.min(1, depth + 0.2);
      d += ` Q ${x0 + segment / 4} ${8 - amp} ${x0 + segment / 2} 8`;
      d += ` Q ${x0 + (3 * segment) / 4} ${8 + amp} ${x1} 8`;
    } else {
      d += ` L ${x1} 8`;
    }
  }
  return (
    <svg
      className="w-full max-w-xs"
      height="16"
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      aria-label="conversation progress"
    >
      <path
        d={d}
        stroke="#6B2737"
        strokeWidth="1.25"
        fill="none"
        className="transition-all duration-700"
      />
    </svg>
  );
}
