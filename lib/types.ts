export type Relationship =
  | "partner"
  | "best friend"
  | "parent"
  | "sibling"
  | "colleague"
  | "other";

export type Occasion =
  | "birthday"
  | "anniversary"
  | "farewell"
  | "wedding"
  | "just because";

export type OrderStatus =
  | "draft"
  | "conversation_active"
  | "conversation_complete"
  | "song_generating"
  | "qc_pending"
  | "preview_sent"
  | "approved"
  | "in_production"
  | "shipped"
  | "delivered"
  | "reaction_collected";

export type Tier = "classic" | "signature" | "together";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  at: number;
}

export interface TasteProfile {
  mode: "i_know" | "ask_secretly";
  artists: string[];
  songs: string[];
  language: "hindi" | "english" | "mix" | "regional";
  /** 0 = soft & emotional, 100 = upbeat & fun */
  energy: number;
  quizSlug?: string;
}

export interface CardContent {
  page1Greeting: string;
  page2Memories: string[];
  page4Message: string;
  qualities: string[];
  rfidTitles: string[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  recipientName: string;
  relationship: Relationship;
  occasion: Occasion;
  deliveryDate: string;
  city: string;
  pincode: string;
  conversation: ChatMessage[];
  taste?: TasteProfile;
  card?: CardContent;
  tier?: Tier;
  paidAt?: number;
}

export const TIERS: Record<
  Tier,
  { name: string; price: number; includes: string[] }
> = {
  classic: {
    name: "Classic",
    price: 2999,
    includes: [
      "Hardcover 4-page card",
      "An original song, written from your memories",
      "Their personal webpage, forever",
      "2 RFID cards + QR",
    ],
  },
  signature: {
    name: "Signature",
    price: 4499,
    includes: [
      "Everything in Classic",
      "Premium gift box",
      "1 song revision included",
      "Guestbook on their page",
      "Scented pages",
    ],
  },
  together: {
    name: "Together",
    price: 5999,
    includes: [
      "Everything in Signature",
      "Friends contribute memories via a shared link",
      "Group messages on the page",
    ],
  },
};

export const STATUS_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "conversation_complete", label: "Story collected" },
  { status: "song_generating", label: "Song in the studio" },
  { status: "qc_pending", label: "Listening & refining" },
  { status: "in_production", label: "Card in production" },
  { status: "shipped", label: "On its way" },
  { status: "delivered", label: "Delivered" },
];
