"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type {
  Calibration,
  Idea,
  Scores,
  Session,
  Step,
} from "@/types";
import { defaultSession, loadSession, saveSession, clearSession } from "@/lib/storage";
import { computeAll, generateId } from "@/lib/scoring";

interface SessionContextValue {
  session: Session;
  hydrated: boolean;
  setCalibration: (cal: Calibration) => void;
  addIdea: (name: string, description: string) => string;
  updateIdea: (id: string, patch: Partial<Pick<Idea, "name" | "description">>) => void;
  deleteIdea: (id: string) => void;
  setScores: (id: string, scores: Scores) => void;
  setStep: (step: Step) => void;
  setScoringIdea: (id: string | null) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(defaultSession);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSession(session);
  }, [session, hydrated]);

  const setCalibration = useCallback((cal: Calibration) => {
    setSession((s) => ({ ...s, calibration: cal }));
  }, []);

  const addIdea = useCallback((name: string, description: string) => {
    const id = generateId();
    const idea: Idea = {
      id,
      name,
      description,
      scores: null,
      effortScore: null,
      impactScore: null,
      quadrant: null,
    };
    setSession((s) => ({ ...s, ideas: [...s.ideas, idea] }));
    return id;
  }, []);

  const updateIdea = useCallback(
    (id: string, patch: Partial<Pick<Idea, "name" | "description">>) => {
      setSession((s) => ({
        ...s,
        ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    []
  );

  const deleteIdea = useCallback((id: string) => {
    setSession((s) => ({
      ...s,
      ideas: s.ideas.filter((i) => i.id !== id),
      scoringIdeaId: s.scoringIdeaId === id ? null : s.scoringIdeaId,
    }));
  }, []);

  const setScores = useCallback((id: string, scores: Scores) => {
    const result = computeAll(scores);
    setSession((s) => ({
      ...s,
      ideas: s.ideas.map((i) =>
        i.id === id
          ? {
              ...i,
              scores,
              effortScore: result.effortScore,
              impactScore: result.impactScore,
              quadrant: result.quadrant,
            }
          : i
      ),
    }));
  }, []);

  const setStep = useCallback((step: Step) => {
    setSession((s) => ({ ...s, currentStep: step }));
  }, []);

  const setScoringIdea = useCallback((id: string | null) => {
    setSession((s) => ({ ...s, scoringIdeaId: id }));
  }, []);

  const resetSession = useCallback(() => {
    clearSession();
    setSession({ ...defaultSession });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        hydrated,
        setCalibration,
        addIdea,
        updateIdea,
        deleteIdea,
        setScores,
        setStep,
        setScoringIdea,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
