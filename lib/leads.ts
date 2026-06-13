// Lead capture for v1. The real delivery channel is the pre-filled WhatsApp
// message; this record is a bonus — saved locally always, and mirrored to
// Firestore when configured so the business has a record to follow up on.
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Lead {
  id: string;
  createdAt: number;
  gifterName: string;
  gifterPhone: string;
  recipientName: string;
  relationship: string;
  occasion: string;
  deliveryDate: string;
  city: string;
  tier: string;
  note: string;
}

const KEY = "heartstrings.leads";

export function saveLead(lead: Lead) {
  if (typeof window !== "undefined") {
    try {
      const all: Lead[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      all.push(lead);
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // ignore quota / serialization issues — WhatsApp carries the lead
    }
  }
  const firestore = db();
  if (firestore) {
    setDoc(doc(firestore, "leads", lead.id), lead).catch(() => {});
  }
}
