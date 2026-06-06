"use client";

import type { Idea } from "@/types";
import { QUADRANT_META } from "@/types";
import { SUB_FACTORS } from "@/lib/scoring";
import Button from "@/components/shared/Button";

interface Props {
  idea: Idea;
  onClose: () => void;
  onEdit: () => void;
}

export default function IdeaDetailPanel({ idea, onClose, onEdit }: Props) {
  const q = idea.quadrant;

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 text-white">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{idea.name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {q && (
        <span
          className="mt-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: QUADRANT_META[q].color }}
        >
          {QUADRANT_META[q].label}
        </span>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-700/50 p-3">
          <p className="text-xs text-slate-400">Effort</p>
          <p className="text-2xl font-bold">{idea.effortScore}</p>
        </div>
        <div className="rounded-lg bg-slate-700/50 p-3">
          <p className="text-xs text-slate-400">Impact</p>
          <p className="text-2xl font-bold">{idea.impactScore}</p>
        </div>
      </div>

      {idea.scores && (
        <div className="mt-5 flex-1 overflow-y-auto">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sub-factor breakdown
          </p>
          <ul className="space-y-2">
            {SUB_FACTORS.map((f) => {
              const v = idea.scores![f.key];
              return (
                <li key={f.key} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">{f.title}</span>
                    <span className="font-semibold">{v}/5</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={
                        f.section === "Effort"
                          ? "h-full bg-amber-400"
                          : "h-full bg-emerald-400"
                      }
                      style={{ width: `${(v / 5) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <Button variant="secondary" onClick={onEdit} className="w-full">
          Edit Scores
        </Button>
      </div>
    </div>
  );
}
