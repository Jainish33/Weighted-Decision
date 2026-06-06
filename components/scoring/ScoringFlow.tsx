"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/context/SessionContext";
import {
  SUB_FACTORS,
  computeEffort,
  computeImpact,
} from "@/lib/scoring";
import type { Scores } from "@/types";
import Button from "@/components/shared/Button";
import QuestionCard from "./QuestionCard";
import MiniMatrix from "./MiniMatrix";

type PartialScores = Partial<Record<keyof Scores, number>>;

export default function ScoringFlow() {
  const { session, setScores, setStep, setScoringIdea } = useSession();
  const idea = session.ideas.find((i) => i.id === session.scoringIdeaId);
  const cal = session.calibration;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PartialScores>(
    () => (idea?.scores ? { ...idea.scores } : {})
  );

  const factor = SUB_FACTORS[index];

  const options = useMemo(
    () => (cal ? factor.options(cal) : []),
    [cal, factor]
  );

  // Live preview: use defaults of 3 for unanswered factors.
  const previewScores = useMemo<Scores>(() => {
    const filled = {} as Scores;
    for (const f of SUB_FACTORS) {
      filled[f.key] = answers[f.key] ?? 3;
    }
    return filled;
  }, [answers]);

  const allAnswered = SUB_FACTORS.every((f) => answers[f.key] != null);
  const hasAny = Object.keys(answers).length > 0;

  if (!idea || !cal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">No idea selected to score.</p>
        <div className="mt-4">
          <Button onClick={() => setStep("ideas")}>Back to Ideas</Button>
        </div>
      </div>
    );
  }

  const select = (value: number) => {
    setAnswers((a) => ({ ...a, [factor.key]: value }));
    // auto-advance to next unanswered question
    if (index < SUB_FACTORS.length - 1) {
      setTimeout(() => setIndex((i) => i + 1), 180);
    }
  };

  const finish = () => {
    if (!allAnswered) return;
    setScores(idea.id, answers as Scores);
    setScoringIdea(null);
    setStep("matrix");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{idea.name}</h1>
          <p className="text-sm text-slate-500">
            Question {index + 1} of {SUB_FACTORS.length}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setScoringIdea(null);
            setStep("ideas");
          }}
        >
          Save &amp; exit
        </Button>
      </div>

      {/* progress dots */}
      <div className="mb-8 flex gap-1.5">
        {SUB_FACTORS.map((f, i) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i === index
                ? "bg-slate-900"
                : answers[f.key] != null
                ? "bg-emerald-400"
                : "bg-slate-200"
            }`}
            aria-label={`Go to ${f.title}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          <QuestionCard
            factor={factor}
            options={options}
            selected={answers[factor.key] ?? null}
            onSelect={select}
          />

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              Back
            </Button>
            {index < SUB_FACTORS.length - 1 ? (
              <Button
                variant="secondary"
                onClick={() => setIndex((i) => i + 1)}
                disabled={answers[factor.key] == null}
              >
                Next
              </Button>
            ) : (
              <Button onClick={finish} disabled={!allAnswered}>
                Finish &amp; View Matrix
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <MiniMatrix
            effort={hasAny ? computeEffort(previewScores) : null}
            impact={hasAny ? computeImpact(previewScores) : null}
          />
          <p className="mt-2 text-[11px] leading-snug text-slate-400">
            Unanswered factors assume a neutral value until you answer them.
          </p>
        </div>
      </div>
    </div>
  );
}
