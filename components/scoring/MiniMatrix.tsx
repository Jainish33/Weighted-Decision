"use client";

import { QUADRANT_META } from "@/types";

interface Props {
  effort: number | null;
  impact: number | null;
}

// X = effort (0..100), Y = impact (0..100). SVG y is inverted.
export default function MiniMatrix({ effort, impact }: Props) {
  const size = 220;
  const pad = 24;
  const inner = size - pad * 2;

  const hasPoint = effort !== null && impact !== null;
  const cx = pad + ((effort ?? 0) / 100) * inner;
  const cy = pad + (1 - (impact ?? 0) / 100) * inner;

  const quadrant =
    hasPoint && effort !== null && impact !== null
      ? effort > 50 && impact > 50
        ? "moon-shot"
        : effort <= 50 && impact > 50
        ? "gold-mine"
        : effort <= 50 && impact <= 50
        ? "quick-win"
        : "questionable"
      : null;

  const labelStyle =
    "text-[9px] font-semibold uppercase tracking-wide";

  return (
    <div className="rounded-xl bg-navy p-4 text-white">
      <p className="mb-2 text-xs font-medium text-slate-300">Live preview</p>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {/* quadrant fills */}
        <rect x={pad} y={pad} width={inner / 2} height={inner / 2} fill="#10B981" opacity={0.18} />
        <rect x={pad + inner / 2} y={pad} width={inner / 2} height={inner / 2} fill="#8B5CF6" opacity={0.18} />
        <rect x={pad} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="#F59E0B" opacity={0.18} />
        <rect x={pad + inner / 2} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="#F43F5E" opacity={0.18} />

        {/* divider lines */}
        <line x1={pad + inner / 2} y1={pad} x2={pad + inner / 2} y2={pad + inner} stroke="#475569" strokeWidth={1} />
        <line x1={pad} y1={pad + inner / 2} x2={pad + inner} y2={pad + inner / 2} stroke="#475569" strokeWidth={1} />

        {/* border */}
        <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke="#334155" strokeWidth={1} />

        {/* corner labels */}
        <text x={pad + inner / 4} y={pad + 12} textAnchor="middle" className={labelStyle} fill="#10B981">Gold Mine</text>
        <text x={pad + (inner * 3) / 4} y={pad + 12} textAnchor="middle" className={labelStyle} fill="#8B5CF6">Moon Shot</text>
        <text x={pad + inner / 4} y={pad + inner - 4} textAnchor="middle" className={labelStyle} fill="#F59E0B">Quick Win</text>
        <text x={pad + (inner * 3) / 4} y={pad + inner - 4} textAnchor="middle" className={labelStyle} fill="#F43F5E">Question</text>

        {/* point */}
        {hasPoint && (
          <circle cx={cx} cy={cy} r={6} fill="#fff" stroke="#0F172A" strokeWidth={2} />
        )}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>Effort →</span>
        <span>↑ Impact</span>
      </div>
      {quadrant && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: QUADRANT_META[quadrant].color }}
          />
          <span className="font-semibold">{QUADRANT_META[quadrant].label}</span>
        </div>
      )}
    </div>
  );
}
