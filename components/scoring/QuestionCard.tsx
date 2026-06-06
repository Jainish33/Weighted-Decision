"use client";

import type { Option, SubFactor } from "@/lib/scoring";

interface Props {
  factor: SubFactor;
  options: Option[];
  selected: number | null;
  onSelect: (value: number) => void;
}

export default function QuestionCard({
  factor,
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <div key={factor.key} className="animate-fadeIn">
      <span
        className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
          factor.section === "Effort"
            ? "bg-amber-100 text-amber-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {factor.section} · {factor.title}
      </span>
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {factor.question}
      </h2>
      <p className="mt-2 text-sm italic text-slate-500">{factor.rationale}</p>

      <div className="mt-6 space-y-2">
        {options.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`ml-3 shrink-0 text-xs font-semibold ${
                  active ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {opt.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
