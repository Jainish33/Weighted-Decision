// Order persistence. localStorage is the source of truth in the browser;
// when Firebase is configured every save is mirrored to Firestore so the
// internal ops dashboard (phase 3) can read live orders.
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Order } from "./types";

const KEY = "heartstrings.orders";

function readAll(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeAll(orders: Record<string, Order>) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function newOrderId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function getOrder(id: string): Order | null {
  return readAll()[id] ?? null;
}

export function listOrders(): Order[] {
  return Object.values(readAll()).sort((a, b) => b.createdAt - a.createdAt);
}

export function saveOrder(order: Order) {
  const all = readAll();
  all[order.id] = { ...order, updatedAt: Date.now() };
  writeAll(all);

  const firestore = db();
  if (firestore) {
    setDoc(doc(firestore, "orders", order.id), all[order.id], {
      merge: true,
    }).catch(() => {
      // Offline or rules not set up yet — localStorage copy is intact.
    });
  }
}

export function updateOrder(id: string, patch: Partial<Order>): Order | null {
  const existing = getOrder(id);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  saveOrder(next);
  return next;
}
