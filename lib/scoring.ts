import type { Calibration, Currency, Quadrant, Scores } from "@/types";

export const EFFORT_WEIGHTS = {
  time: 0.3,
  capital: 0.25,
  skill: 0.25,
  dependency: 0.2,
} as const;

export const IMPACT_WEIGHTS = {
  revenue: 0.35,
  market: 0.25,
  strategic: 0.25,
  fit: 0.15,
} as const;

export function formatCurrency(value: number, currency: Currency): string {
  const symbol = currency === "INR" ? "₹" : "$";
  const rounded = Math.round(value);
  let formatted: string;
  if (currency === "INR") {
    formatted = rounded.toLocaleString("en-IN");
  } else {
    formatted = rounded.toLocaleString("en-US");
  }
  return `${symbol}${formatted}`;
}

export interface Option {
  label: string;
  value: number;
}

/**
 * Build five ascending buckets from a ceiling. The label describes a range,
 * the value is the effort/impact score 1..5.
 */
function bucketsFromCeiling(
  ceiling: number,
  unit: (n: number) => string,
  ascendingMeansHigher: boolean
): Option[] {
  const c = ceiling > 0 ? ceiling : 1;
  const b1 = c / 5;
  const b2 = (c * 2) / 5;
  const b3 = (c * 3) / 5;
  const b4 = (c * 4) / 5;

  const ranges = [
    `Under ${unit(b1)}`,
    `${unit(b1)} to ${unit(b2)}`,
    `${unit(b2)} to ${unit(b3)}`,
    `${unit(b3)} to ${unit(b4)}`,
    `More than ${unit(b4)}`,
  ];

  // For effort (time/capital), lowest range => 1 (low effort).
  // For impact (revenue), lowest range => 1 (low impact), highest => 5.
  // Both map ascending range -> ascending value.
  return ranges.map((label, i) => ({
    label,
    value: ascendingMeansHigher ? i + 1 : i + 1,
  }));
}

export function timeOptions(cal: Calibration): Option[] {
  return bucketsFromCeiling(
    cal.timeCeiling,
    (n) => `${Math.round(n)} months`,
    true
  );
}

export function capitalOptions(cal: Calibration): Option[] {
  return bucketsFromCeiling(
    cal.capitalCeiling,
    (n) => formatCurrency(n, cal.currency),
    true
  );
}

export function revenueOptions(cal: Calibration): Option[] {
  return bucketsFromCeiling(
    cal.impactCeiling,
    (n) => formatCurrency(n, cal.currency),
    true
  );
}

export const skillOptions: Option[] = [
  { label: "I can do this entirely myself", value: 1 },
  { label: "Minor gaps — a freelancer or short course fixes it", value: 2 },
  { label: "Moderate gaps — need a part-time hire or co-founder", value: 3 },
  { label: "Significant gaps — need key hires I don't have yet", value: 4 },
  {
    label: "I'd be building a team from scratch in unfamiliar territory",
    value: 5,
  },
];

export const dependencyOptions: Option[] = [
  { label: "Fully in my control — I can start tomorrow", value: 1 },
  { label: "1–2 minor dependencies (a tool, a supplier)", value: 2 },
  { label: "A few dependencies but manageable", value: 3 },
  { label: "Relies on a key partnership or regulatory approval", value: 4 },
  {
    label: "Multiple critical things must align that I can't control",
    value: 5,
  },
];

export const marketOptions: Option[] = [
  { label: "I've validated demand — people are already asking for it", value: 5 },
  { label: "Strong signals — similar things sell well", value: 4 },
  { label: "Reasonable assumption but not validated yet", value: 3 },
  { label: "Gut feel — I believe it exists but haven't checked", value: 2 },
  { label: "Speculative — I'm not sure people want this", value: 1 },
];

export const strategicOptions: Option[] = [
  {
    label: "Creates a strong moat or platform for future businesses",
    value: 5,
  },
  { label: "Builds meaningful skills, network, or IP", value: 4 },
  { label: "Some strategic upside but mostly standalone", value: 3 },
  { label: "Limited strategic value beyond the revenue itself", value: 2 },
  { label: "No strategic value — purely transactional", value: 1 },
];

export const fitOptions: Option[] = [
  {
    label:
      "This is my unfair advantage — I have unique insight, network, or experience",
    value: 5,
  },
  { label: "Strong fit — I understand this space deeply", value: 4 },
  { label: "Decent fit — I can learn what I need", value: 3 },
  { label: "Weak fit — others are better positioned but I can compete", value: 2 },
  { label: "Anyone could do this — I have no particular edge", value: 1 },
];

export interface SubFactor {
  key: keyof Scores;
  section: "Effort" | "Impact";
  title: string;
  question: string;
  rationale: string;
  weight: number;
  dynamic: boolean;
  options: (cal: Calibration) => Option[];
}

export const SUB_FACTORS: SubFactor[] = [
  {
    key: "time",
    section: "Effort",
    title: "Time to validate",
    question: "How long before you'd know if this idea is working?",
    rationale: "The faster you can validate, the lower the risk and effort.",
    weight: 0.3,
    dynamic: true,
    options: timeOptions,
  },
  {
    key: "capital",
    section: "Effort",
    title: "Capital required",
    question: "How much money would you need to test if this idea works?",
    rationale:
      "Ideas that need less capital to validate are easier to start and cheaper to be wrong about.",
    weight: 0.25,
    dynamic: true,
    options: capitalOptions,
  },
  {
    key: "skill",
    section: "Effort",
    title: "Skill / team gap",
    question:
      "Do you have the skills and people needed, or would you need to hire/learn significantly?",
    rationale:
      "Ideas that play to your existing strengths move faster and fail less often.",
    weight: 0.25,
    dynamic: false,
    options: () => skillOptions,
  },
  {
    key: "dependency",
    section: "Effort",
    title: "Dependencies",
    question: "How much does this idea depend on things outside your control?",
    rationale:
      "The more external dependencies, the more your timeline and outcome are at risk.",
    weight: 0.2,
    dynamic: false,
    options: () => dependencyOptions,
  },
  {
    key: "revenue",
    section: "Impact",
    title: "Revenue potential",
    question:
      "If this works well, what's the realistic annual revenue in 3 years?",
    rationale: "Revenue potential is the most direct measure of business impact.",
    weight: 0.35,
    dynamic: true,
    options: revenueOptions,
  },
  {
    key: "market",
    section: "Impact",
    title: "Market size / demand clarity",
    question: "How clearly do you know there's a real, sizeable market for this?",
    rationale: "A big idea in a small or nonexistent market is still a small idea.",
    weight: 0.25,
    dynamic: false,
    options: () => marketOptions,
  },
  {
    key: "strategic",
    section: "Impact",
    title: "Strategic value",
    question:
      "Beyond direct revenue, does this idea open doors or build long-term advantage?",
    rationale:
      "Ideas that build compounding advantages are worth more than their immediate revenue.",
    weight: 0.25,
    dynamic: false,
    options: () => strategicOptions,
  },
  {
    key: "fit",
    section: "Impact",
    title: "Founder fit",
    question:
      "How uniquely positioned are you to win at this compared to anyone else?",
    rationale:
      "Ideas you're uniquely positioned to win at outperform identical ideas in stranger hands.",
    weight: 0.15,
    dynamic: false,
    options: () => fitOptions,
  },
];

// Convert a weighted 1..5 sum into 0..100.
// Min weighted sum = 1, max = 5 => normalize (x - 1) / 4 * 100.
function normalize(weightedSum: number): number {
  return Math.round(((weightedSum - 1) / 4) * 100);
}

export function computeEffort(scores: Scores): number {
  const sum =
    scores.time * EFFORT_WEIGHTS.time +
    scores.capital * EFFORT_WEIGHTS.capital +
    scores.skill * EFFORT_WEIGHTS.skill +
    scores.dependency * EFFORT_WEIGHTS.dependency;
  return normalize(sum);
}

export function computeImpact(scores: Scores): number {
  const sum =
    scores.revenue * IMPACT_WEIGHTS.revenue +
    scores.market * IMPACT_WEIGHTS.market +
    scores.strategic * IMPACT_WEIGHTS.strategic +
    scores.fit * IMPACT_WEIGHTS.fit;
  return normalize(sum);
}

export function determineQuadrant(
  effort: number,
  impact: number
): Quadrant {
  const highEffort = effort > 50;
  const highImpact = impact > 50;
  if (!highEffort && highImpact) return "gold-mine";
  if (highEffort && highImpact) return "moon-shot";
  if (!highEffort && !highImpact) return "quick-win";
  return "questionable";
}

export interface ComputedResult {
  effortScore: number;
  impactScore: number;
  quadrant: Quadrant;
}

export function computeAll(scores: Scores): ComputedResult {
  const effortScore = computeEffort(scores);
  const impactScore = computeImpact(scores);
  return {
    effortScore,
    impactScore,
    quadrant: determineQuadrant(effortScore, impactScore),
  };
}

export function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}
