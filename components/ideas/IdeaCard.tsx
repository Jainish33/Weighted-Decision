"use client";

import type { Idea } from "@/types";
import { QUADRANT_META } from "@/types";
import Button from "@/components/shared/Button";

interface Props {
  idea: Idea;
  onScore: () => void;
  onDelete: () => void;
}

export default function IdeaCard({ idea, onScore, onDelete }: Props) {
  const scored = idea.quadrant !== null;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{idea.name}</h3>
        {scored && idea.quadrant && (
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: QUADRANT_META[idea.quadrant].color }}
          >
            {QUADRANT_META[idea.quadrant].label}
          </span>
        )}
      </div>

      {idea.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
          {idea.description}
        </p>
      )}

      {scored && (
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span>
            Effort:{" "}
            <strong className="text-slate-800">{idea.effortScore}</strong>
          </span>
          <span>
            Impact:{" "}
            <strong className="text-slate-800">{idea.impactScore}</strong>
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant={scored ? "secondary" : "primary"} onClick={onScore}>
          {scored ? "Re-score" : "Score this idea"}
        </Button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-medium text-slate-400 hover:text-rose-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
