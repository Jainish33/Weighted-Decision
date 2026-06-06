"use client";

import type { Step } from "@/types";

const STEPS: { key: Step; label: string }[] = [
  { key: "calibration", label: "Calibrate" },
  { key: "ideas", label: "Ideas" },
  { key: "scoring", label: "Score" },
  { key: "matrix", label: "Matrix" },
  { key: "report", label: "Report" },
];

export default function ProgressBar({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4 sm:gap-4">
        {STEPS.map((step, i) => {
          const active = i === currentIndex;
          const done = i < currentIndex;
          return (
            <div key={step.key} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : done
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-sm sm:inline ${
                    active ? "font-semibold text-slate-900" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded ${
                    done ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
