"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { useSession } from "@/context/SessionContext";
import type { Idea } from "@/types";
import { QUADRANT_META } from "@/types";
import Button from "@/components/shared/Button";
import IdeaDetailPanel from "./IdeaDetailPanel";

interface Point {
  x: number;
  y: number;
  name: string;
  idea: Idea;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const p: Point = payload[0].payload;
  const q = p.idea.quadrant;
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{p.name}</p>
      <p className="text-slate-300">Effort: {p.x}</p>
      <p className="text-slate-300">Impact: {p.y}</p>
      {q && (
        <p className="mt-1 font-medium" style={{ color: QUADRANT_META[q].color }}>
          {QUADRANT_META[q].label}
        </p>
      )}
    </div>
  );
}

export default function MatrixView() {
  const { session, setStep, setScoringIdea } = useSession();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scored = session.ideas.filter((i) => i.quadrant !== null);
  const data: Point[] = scored.map((i) => ({
    x: i.effortScore!,
    y: i.impactScore!,
    name: i.name,
    idea: i,
  }));

  const selected = scored.find((i) => i.id === selectedId) || null;

  const handleEdit = () => {
    if (!selected) return;
    setScoringIdea(selected.id);
    setStep("scoring");
  };

  return (
    <div className="min-h-screen bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Idea Matrix
          </h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep("ideas")}>
              Add More Ideas
            </Button>
            <Button onClick={() => setStep("report")}>Generate Report</Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative rounded-2xl bg-slate-800/60 p-4">
            {/* corner labels */}
            <span className="pointer-events-none absolute left-12 top-8 text-xs font-bold uppercase tracking-wide text-emerald-400">
              Gold Mine
            </span>
            <span className="pointer-events-none absolute right-8 top-8 text-xs font-bold uppercase tracking-wide text-violet-400">
              Moon Shot
            </span>
            <span className="pointer-events-none absolute bottom-16 left-12 text-xs font-bold uppercase tracking-wide text-amber-400">
              Quick Win
            </span>
            <span className="pointer-events-none absolute bottom-16 right-8 text-xs font-bold uppercase tracking-wide text-rose-400">
              Questionable
            </span>

            <ResponsiveContainer width="100%" height={460}>
              <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 10 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Effort"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  label={{
                    value: "Effort →",
                    position: "insideBottom",
                    offset: -15,
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Impact"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  label={{
                    value: "Impact →",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />
                <ZAxis range={[140, 140]} />
                <ReferenceLine x={50} stroke="#64748b" strokeWidth={1.5} />
                <ReferenceLine y={50} stroke="#64748b" strokeWidth={1.5} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<CustomTooltip />}
                />
                <Scatter
                  data={data}
                  onClick={(p: any) => setSelectedId(p?.idea?.id ?? null)}
                  cursor="pointer"
                >
                  {data.map((p) => (
                    <Cell
                      key={p.idea.id}
                      fill={
                        p.idea.quadrant
                          ? QUADRANT_META[p.idea.quadrant].color
                          : "#fff"
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="name"
                    position="top"
                    style={{ fill: "#e2e8f0", fontSize: 11 }}
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-xs text-slate-400">
              Click a dot to see its full breakdown.
            </p>
          </div>

          <div className="min-h-[300px]">
            {selected ? (
              <IdeaDetailPanel
                idea={selected}
                onClose={() => setSelectedId(null)}
                onEdit={handleEdit}
              />
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 p-6 text-center text-sm text-slate-400">
                <p>Select an idea on the matrix to inspect its scores.</p>
                <div className="mt-4 w-full space-y-2 text-left">
                  {(
                    Object.keys(QUADRANT_META) as Array<
                      keyof typeof QUADRANT_META
                    >
                  ).map((q) => (
                    <div key={q} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: QUADRANT_META[q].color }}
                      />
                      <span className="text-slate-300">
                        {QUADRANT_META[q].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
