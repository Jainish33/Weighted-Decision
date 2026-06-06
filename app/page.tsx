"use client";

import { useSession } from "@/context/SessionContext";
import ProgressBar from "@/components/shared/ProgressBar";
import CalibrationFlow from "@/components/calibration/CalibrationFlow";
import IdeaList from "@/components/ideas/IdeaList";
import ScoringFlow from "@/components/scoring/ScoringFlow";
import MatrixView from "@/components/matrix/MatrixView";
import ReportView from "@/components/report/ReportView";

export default function Home() {
  const { session, hydrated, resetSession } = useSession();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  const step = session.currentStep;
  const onDarkScreen = step === "matrix";

  return (
    <main className={onDarkScreen ? "min-h-screen bg-navy" : "min-h-screen"}>
      <header
        className={`flex items-center justify-between px-4 py-3 ${
          onDarkScreen ? "bg-navy text-white" : "bg-white"
        }`}
      >
        <span className="text-sm font-semibold tracking-tight">
          Idea Quadrant Analyzer
        </span>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm("Reset everything and start over?")
            ) {
              resetSession();
            }
          }}
          className={`text-xs font-medium ${
            onDarkScreen
              ? "text-slate-400 hover:text-white"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Reset
        </button>
      </header>

      {!onDarkScreen && <ProgressBar current={step} />}

      {step === "calibration" && <CalibrationFlow />}
      {step === "ideas" && <IdeaList />}
      {step === "scoring" && <ScoringFlow />}
      {step === "matrix" && <MatrixView />}
      {step === "report" && <ReportView />}
    </main>
  );
}
