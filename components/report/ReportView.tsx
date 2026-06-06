"use client";

import { useRef, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { useSession } from "@/context/SessionContext";
import type { Idea } from "@/types";
import { QUADRANT_META } from "@/types";
import { formatCurrency } from "@/lib/scoring";
import { exportReportPDF } from "@/lib/pdfExport";
import Button from "@/components/shared/Button";

export default function ReportView() {
  const { session, setStep } = useSession();
  const matrixRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const cal = session.calibration;
  const scored = session.ideas.filter((i) => i.quadrant !== null);

  if (!cal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">Complete calibration first.</p>
        <div className="mt-4">
          <Button onClick={() => setStep("calibration")}>Go to Calibration</Button>
        </div>
      </div>
    );
  }

  const data = scored.map((i) => ({
    x: i.effortScore!,
    y: i.impactScore!,
    name: i.name,
    idea: i,
  }));

  const handleDownload = async () => {
    setExporting(true);
    try {
      await exportReportPDF({
        calibration: cal,
        ideas: scored,
        matrixElement: matrixRef.current,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Report Preview
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setStep("matrix")}>
            Back to Matrix
          </Button>
          <Button onClick={handleDownload} disabled={exporting}>
            {exporting ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Idea Quadrant Analysis Report
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {new Date().toLocaleDateString()}
        </p>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Your Calibration Anchors
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Capital Ceiling</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(cal.capitalCeiling, cal.currency)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Time Ceiling</p>
              <p className="text-lg font-semibold text-slate-900">
                {cal.timeCeiling} months
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Impact Ceiling</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(cal.impactCeiling, cal.currency)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            The Matrix
          </h3>
          <div ref={matrixRef} className="relative rounded-xl bg-navy p-4">
            <span className="pointer-events-none absolute left-12 top-6 text-[10px] font-bold uppercase text-emerald-400">
              Gold Mine
            </span>
            <span className="pointer-events-none absolute right-8 top-6 text-[10px] font-bold uppercase text-violet-400">
              Moon Shot
            </span>
            <span className="pointer-events-none absolute bottom-14 left-12 text-[10px] font-bold uppercase text-amber-400">
              Quick Win
            </span>
            <span className="pointer-events-none absolute bottom-14 right-8 text-[10px] font-bold uppercase text-rose-400">
              Questionable
            </span>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top: 24, right: 24, bottom: 24, left: 10 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <ZAxis range={[130, 130]} />
                <ReferenceLine x={50} stroke="#64748b" />
                <ReferenceLine y={50} stroke="#64748b" />
                <Scatter data={data} isAnimationActive={false}>
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
                    style={{ fill: "#e2e8f0", fontSize: 10 }}
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Idea Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Idea</th>
                  <th className="py-2 pr-4 font-medium">Effort</th>
                  <th className="py-2 pr-4 font-medium">Impact</th>
                  <th className="py-2 pr-4 font-medium">Quadrant</th>
                  <th className="py-2 font-medium">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {scored.map((idea: Idea) => {
                  const q = idea.quadrant!;
                  return (
                    <tr
                      key={idea.id}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {idea.name}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {idea.effortScore}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {idea.impactScore}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{
                            backgroundColor: QUADRANT_META[q].color,
                          }}
                        >
                          {QUADRANT_META[q].label}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {QUADRANT_META[q].recommendation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Recommendations by Quadrant
          </h3>
          <ul className="space-y-3">
            {(
              Object.keys(QUADRANT_META) as Array<keyof typeof QUADRANT_META>
            ).map((q) => (
              <li key={q} className="flex gap-3">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: QUADRANT_META[q].color }}
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {QUADRANT_META[q].label}
                  </p>
                  <p className="text-sm text-slate-600">
                    {QUADRANT_META[q].recommendation}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
