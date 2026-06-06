export type Currency = "INR" | "USD";

export type Quadrant =
  | "gold-mine"
  | "moon-shot"
  | "quick-win"
  | "questionable";

export type Step = "calibration" | "ideas" | "scoring" | "matrix" | "report";

export interface Calibration {
  capitalCeiling: number;
  timeCeiling: number;
  impactCeiling: number;
  currency: Currency;
}

export interface Scores {
  time: number;
  capital: number;
  skill: number;
  dependency: number;
  revenue: number;
  market: number;
  strategic: number;
  fit: number;
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  scores: Scores | null;
  effortScore: number | null;
  impactScore: number | null;
  quadrant: Quadrant | null;
}

export interface Session {
  calibration: Calibration | null;
  ideas: Idea[];
  currentStep: Step;
  scoringIdeaId: string | null;
}

export const QUADRANT_META: Record<
  Quadrant,
  { label: string; color: string; recommendation: string }
> = {
  "gold-mine": {
    label: "Gold Mine",
    color: "#10B981",
    recommendation:
      "Prioritize immediately — high return for low investment",
  },
  "moon-shot": {
    label: "Moon Shot",
    color: "#8B5CF6",
    recommendation:
      "Plan carefully — worth pursuing with the right resources and timing",
  },
  "quick-win": {
    label: "Quick Win",
    color: "#F59E0B",
    recommendation:
      "Pick up when bandwidth allows — easy but limited upside",
  },
  questionable: {
    label: "Questionable",
    color: "#F43F5E",
    recommendation:
      "Reconsider — high cost with low return. Needs major rethinking.",
  },
};
