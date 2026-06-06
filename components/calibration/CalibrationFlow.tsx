"use client";

import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import type { Calibration, Currency, Weights } from "@/types";
import { DEFAULT_WEIGHTS } from "@/types";
import Button from "@/components/shared/Button";

interface QuestionDef {
  key: "capitalCeiling" | "timeCeiling" | "impactCeiling";
  question: string;
  label: string;
  hint: string;
  money: boolean;
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "capitalCeiling",
    question:
      "Imagine the boldest business move you'd make right now — how much money would you put in?",
    label: "Your Capital Ceiling",
    hint: "This sets your personal scale. An idea asking for half this feels manageable. An idea asking for more will be your Moon Shot territory.",
    money: true,
  },
  {
    key: "timeCeiling",
    question:
      "How many months would you invest before expecting meaningful results?",
    label: "Your Time Ceiling",
    hint: "Ideas needing less time than this will score as lower effort. Ideas beyond this are high-effort bets.",
    money: false,
  },
  {
    key: "impactCeiling",
    question: "What annual revenue would feel truly transformational for you?",
    label: "Your Impact Ceiling",
    hint: "This defines what 'high impact' means to you. Everything is scored relative to this number.",
    money: true,
  },
];

type WeightGroup = "effort" | "impact";

const WEIGHT_DEFS: Record<
  WeightGroup,
  { key: keyof Weights["effort"] | keyof Weights["impact"]; label: string; rationale: string }[]
> = {
  effort: [
    { key: "time", label: "Time to validate", rationale: "How quickly you can know if it works" },
    { key: "capital", label: "Capital required", rationale: "How much money is needed to test" },
    { key: "skill", label: "Skill / team gap", rationale: "How much hiring or learning is needed" },
    { key: "dependency", label: "Dependencies", rationale: "How much relies on things outside your control" },
  ],
  impact: [
    { key: "revenue", label: "Revenue potential", rationale: "Direct financial upside at scale" },
    { key: "market", label: "Market size / demand", rationale: "Size and clarity of the addressable market" },
    { key: "strategic", label: "Strategic value", rationale: "Long-term moat, skills, or platform value" },
    { key: "fit", label: "Founder fit", rationale: "Your unique edge in this space" },
  ],
};

function WeightsStep({
  weights,
  onChange,
  onBack,
  onDone,
}: {
  weights: Weights;
  onChange: (w: Weights) => void;
  onBack: () => void;
  onDone: () => void;
}) {
  const effortSum = Object.values(weights.effort).reduce((a, b) => a + b, 0);
  const impactSum = Object.values(weights.impact).reduce((a, b) => a + b, 0);
  const effortOk = effortSum === 100;
  const impactOk = impactSum === 100;

  const update = (group: WeightGroup, key: string, val: string) => {
    const num = val === "" ? 0 : parseInt(val, 10);
    if (isNaN(num) || num < 0 || num > 100) return;
    onChange({
      ...weights,
      [group]: { ...weights[group], [key]: num },
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-2 text-sm font-medium text-slate-400">Step 4 of 4</div>
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        How much does each factor matter to you?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        Adjust the weights below. Each group must add up to exactly 100%. The defaults reflect common priorities — change them to match what matters most in your context.
      </p>

      <div className="mt-8 space-y-8">
        {(["effort", "impact"] as WeightGroup[]).map((group) => {
          const sum = group === "effort" ? effortSum : impactSum;
          const ok = sum === 100;
          return (
            <div key={group}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold capitalize text-slate-800">
                  {group === "effort" ? "Effort Factors" : "Impact Factors"}
                </h2>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    ok
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {sum}% {ok ? "✓" : `— needs ${100 - sum > 0 ? "+" : ""}${100 - sum}% to reach 100%`}
                </span>
              </div>
              <div className="space-y-3">
                {WEIGHT_DEFS[group].map(({ key, label, rationale }) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-400">{rationale}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={weights[group][key as keyof typeof weights[typeof group]] || ""}
                        onChange={(e) => update(group, key, e.target.value)}
                        className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm font-medium focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        💡 These weights affect how your scores are calculated. A factor with a higher weight has more influence on where your idea lands on the matrix.
      </p>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onDone} disabled={!effortOk || !impactOk}>
          Start Adding Ideas
        </Button>
      </div>
    </div>
  );
}

export default function CalibrationFlow() {
  const { setCalibration, setStep } = useSession();
  const [index, setIndex] = useState(0);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [values, setValues] = useState<Record<string, string>>({
    capitalCeiling: "",
    timeCeiling: "",
    impactCeiling: "",
  });
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [showWeights, setShowWeights] = useState(false);

  const q = QUESTIONS[index];
  const raw = values[q?.key ?? "capitalCeiling"];
  const num = Number(raw);
  const valid = raw !== "" && !Number.isNaN(num) && num > 0;
  const symbol = currency === "INR" ? "₹" : "$";

  const handleNext = () => {
    if (!valid) return;
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    // All 3 questions answered — go to weights step
    setShowWeights(true);
  };

  const handleWeightsDone = () => {
    const cal: Calibration = {
      capitalCeiling: Number(values.capitalCeiling),
      timeCeiling: Number(values.timeCeiling),
      impactCeiling: Number(values.impactCeiling),
      currency,
      weights,
    };
    setCalibration(cal);
    setStep("ideas");
  };

  if (showWeights) {
    return (
      <WeightsStep
        weights={weights}
        onChange={setWeights}
        onBack={() => setShowWeights(false)}
        onDone={handleWeightsDone}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-12">
      <div className="mb-2 text-sm font-medium text-slate-400">
        Step {index + 1} of 4
      </div>

      <div key={q.key} className="animate-fadeIn">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {q.question}
        </h1>

        {index === 0 && (
          <div className="mt-6">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Currency preference
            </span>
            <div className="inline-flex rounded-lg border border-slate-300 p-1">
              {(["INR", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    currency === c
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {c === "INR" ? "INR ₹" : "USD $"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {q.label}
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
            {q.money && (
              <span className="pl-4 text-lg text-slate-500">{symbol}</span>
            )}
            <input
              type="number"
              min={0}
              value={raw}
              autoFocus
              onChange={(e) =>
                setValues((v) => ({ ...v, [q.key]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNext();
              }}
              placeholder={q.money ? "Enter an amount" : "Enter months"}
              className="w-full bg-transparent px-4 py-3 text-lg outline-none"
            />
            {!q.money && (
              <span className="pr-4 text-sm text-slate-500">months</span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{q.hint}</p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={!valid}>
          Next
        </Button>
      </div>
    </div>
  );
}
