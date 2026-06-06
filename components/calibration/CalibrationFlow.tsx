"use client";

import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import type { Calibration, Currency } from "@/types";
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

export default function CalibrationFlow() {
  const { setCalibration, setStep } = useSession();
  const [index, setIndex] = useState(0);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [values, setValues] = useState<Record<string, string>>({
    capitalCeiling: "",
    timeCeiling: "",
    impactCeiling: "",
  });

  const q = QUESTIONS[index];
  const raw = values[q.key];
  const num = Number(raw);
  const valid = raw !== "" && !Number.isNaN(num) && num > 0;
  const symbol = currency === "INR" ? "₹" : "$";

  const handleNext = () => {
    if (!valid) return;
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    const cal: Calibration = {
      capitalCeiling: Number(values.capitalCeiling),
      timeCeiling: Number(values.timeCeiling),
      impactCeiling: Number(values.impactCeiling),
      currency,
    };
    setCalibration(cal);
    setStep("ideas");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-12">
      <div className="mb-2 text-sm font-medium text-slate-400">
        Step {index + 1} of {QUESTIONS.length}
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
          {index < QUESTIONS.length - 1 ? "Next" : "Start Adding Ideas"}
        </Button>
      </div>
    </div>
  );
}
