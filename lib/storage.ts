import type { Session } from "@/types";

const STORAGE_KEY = "idea-quadrant-session";

export const defaultSession: Session = {
  calibration: null,
  ideas: [],
  currentStep: "calibration",
  scoringIdeaId: null,
};

export function loadSession(): Session {
  if (typeof window === "undefined") return defaultSession;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSession;
    const parsed = JSON.parse(raw) as Session;
    return {
      ...defaultSession,
      ...parsed,
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
    };
  } catch {
    return defaultSession;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota / serialization errors
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
